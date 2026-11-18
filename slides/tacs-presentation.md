---
marp: true
title: "Three-Colour Map Colouring with Quantum MDE"
theme: default
paginate: true
style: |
  section {
    font-size: 26px;
  }
  h1 {
    font-size: 44px;
  }
  h2 {
    font-size: 34px;
  }
  code {
    font-size: 20px;
  }
  table {
    font-size: 22px;
  }
---

# 🗺️ Three-Colour Map Colouring
## A Quantum Model-Driven Engineering Demo

**TACS — Group 13 — Problem B**

Model → Solution → Quantum Circuit → Qiskit → Results

---

# 📋 Agenda

| Stage | Topic | Speaker |
|-------|-------|---------|
| A | Problem DSL, metamodel & OCL | *(you)* |
| B | T1: Map → CNF, solution metamodel | *( teammate )* |
| C | T2: CNF → Quantum circuit, code generation | *( teammate )* |
| D | Execution, validation & result reporting | *(you)* |

**End-to-end demo:** run the full chain live on one map.

---

# 🎯 The Problem in Plain Language

> Can every region of a map be coloured with **red, green or blue** so that **regions sharing a border get different colours**?

- Only adjacency matters — **no shapes, no distances**.
- A yes/no decision problem (not optimisation).
- Three benchmark maps:
  - **Triangle** — 3 regions, 3 borders, 6 valid colourings
  - **Ring** — 5 regions, 5 borders, 30 valid colourings
  - **Wheel** — 6 regions, 10 borders, **not** 3-colourable

---

# 🔗 The Full Chain

```text
PROBLEM DSL INSTANCE          SOLUTION DSL INSTANCE        QUANTUM CIRCUIT
part1/examples/                part2/t1.py                  part2/t2.py
triangle_problem.py        →   CNF object model          →   BESSER QuantumCircuit
Map, Region, Border            Formula, Variable,            (search qubits +
                                Clause, Literal              workspace ancillas)
                                      │                            │
                                      ▼                            ▼
                            part2/solver_config.py       part2/qiskit_runner.py
                            Grover rounds, shots,        BESSER QiskitGenerator
                            backend                       + Jinja template
                                                                   │
                                                                   ▼
                                                        part2/generated/qiskit_circuit.py
                                                        executed on Aer simulator
                                                                   │
                                                                   ▼
                                                        part2/decoding.py
                                                        colours + validity report
```

---

# 📐 Stage A — Problem DSL

A small language for maps.

### Concepts

| Class | Attributes | Meaning |
|-------|-----------|---------|
| `Map` | `name` | One colouring question |
| `Region` | `id` | One area to colour |
| `Border` | *(none)* | Joins two different regions |

### Associations
- `Map` ◆—— `Region` (composition, `1..*`)
- `Map` ◆—— `Border` (composition, `0..*`)
- `Border` — `regionA` (`1..1`)
- `Border` — `regionB` (`1..1`)

**No geometry** — only adjacency is modelled.

---

# 🛡️ Stage A — OCL Invariants

Six well-formedness rules on the problem metamodel.

| # | Invariant | Context | Why it matters |
|---|---|---|---|
| 1 | `NonEmptyMapName` | `Map` | readable name |
| 2 | `NonEmptyRegionId` | `Region` | ids become variable names |
| 3 | `UniqueRegionIds` | `Map` | regions distinguishable |
| 4 | `NoSelfBorder` | `Border` | border joins two different regions |
| 5 | `EndpointsInSameMap` | `Border` | both ends belong to the owning map |
| 6 | `NoDuplicateBorders` | `Map` | each unordered pair appears once |

**Note:** colourability is **not** a problem-metamodel rule — it is encoded later in the CNF.

---

# 🧱 Stage A — Triangle Object Model

```python
# part1/examples/triangle_problem.py
map_obj = Object(name="map_triangle", classifier=Map)
map_obj.name = "Triangle"

region_a = Object(name="region_A", classifier=Region)
region_a.id = "A"
region_a.map = map_obj

border_ab = Object(name="border_AB", classifier=Border)
border_ab.map = map_obj
border_ab.regionA = region_a
border_ab.regionB = region_b
```

- `M2` = metamodel (grammar)
- `M1` = this object model (one sentence)
- The OCL is parsed against the metamodel at build time.

---

# 🔢 Stage B — The Encoding

Two bits per region, three colours, one pattern forbidden.

| bits `(high, low)` | colour |
|---|---|
| `00` | red |
| `01` | green |
| `10` | blue |
| `11` | **invalid** |

**Trade-off:** fewer qubits than one-hot encoding, but border clauses are longer.

---

# 📝 Stage B — Map → CNF Mapping

### Per region `R`
- 2 variables: `R_high`, `R_low`
- 1 clause: `(¬R_high ∨ ¬R_low)` → forbids `11`

### Per border `U—V`
- 3 clauses, one per colour, each with 4 literals:

```text
both red:    ( U_high  ∨  U_low  ∨  V_high  ∨  V_low )
both green:  ( U_high  ∨ ¬U_low  ∨  V_high  ∨ ¬V_low )
both blue:   (¬U_high  ∨  U_low  ∨ ¬V_high  ∨  V_low )
```

**Counting:** `V = 2R`, `C = R + 3B`, `L = 2R + 12B`

---

# 📊 Stage B — Instance Sizes

| Map | Regions | Borders | Variables | Clauses | Literals | Valid colourings |
|---|---|---|---|---|---|---|
| Triangle | 3 | 3 | 6 | 12 | 42 | 6 |
| Ring | 5 | 5 | 10 | 20 | 70 | 30 |
| Wheel | 6 | 10 | 12 | 36 | 132 | **0** |

---

# 🧩 Stage B — Solution Metamodel (CNF DSL)

```
Formula 1──* BooleanVariable (id, regionId, bitRole)
       1──* Clause (id)
              1──* Literal (negated)
                    *──1 BooleanVariable
```

- `Formula` owns variables and clauses by composition.
- `Literal` references a variable — **not** composition, because variables are shared.
- `regionId` and `bitRole` are **traceability** fields; they are not Boolean logic.

Eight OCL invariants ensure well-formed CNF (unique ids, valid bit roles, etc.).

---

# ⚙️ Stage B — T1 in Code

```python
# part2/t1.py
for region in regions:
    create variable f"{region.id}_high"
    create variable f"{region.id}_low"
    add_clause([(high, True), (low, True)])      # forbid 11

for border in borders:
    uh, ul = variables[u, "high"], variables[u, "low"]
    vh, vl = variables[v, "high"], variables[v, "low"]
    add_clause([(uh, False), (ul, False), (vh, False), (vl, False)])  # both red
    add_clause([(uh, False), (ul, True ), (vh, False), (vl, True )])  # both green
    add_clause([(uh, True ), (ul, False), (vh, True ), (vl, False)])  # both blue
```

T1 returns a **conforming CNF object model**, checked against the solution metamodel.

---

# ⚛️ Stage C — What Grover Does (One Slide)

A quantum search algorithm that **amplifies** the probability of measuring a solution.

1. **Superposition** — put all colour assignments on equal footing.
2. **Oracle** — marks the assignments that satisfy **every** clause.
3. **Diffuser** — increases the amplitude of marked states.

Repeat oracle + diffuser `R` times, then measure.

`R` is chosen from `N` (search space) and `M` (number of solutions):

```text
θ = arcsin(√(M/N))      R ≈ round(π/(4θ) − ½)
```

---

# 🔧 Stage C — T2: CNF → Quantum Circuit Model

T2 builds a **BESSER `QuantumCircuit`** object:

- **Search qubits** = 2 per region (the colour bits)
- **Workspace ancillas** = scratch qubits for evaluating clauses
- **No phase ancilla** — the oracle marks by applying `Z` directly to the formula ancilla

The oracle evaluates the CNF with a **compact AND tree**: ancilla count grows as `O(log C)`.

| Map | Search qubits | Workspace qubits | Total qubits |
|---|---|---|---|
| Triangle | 6 | 9 | 15 |
| Ring | 10 | 11 | 21 |
| Wheel | 12 | 13 | 25 |

---

# 🧮 Stage C — From Clauses to Gates

A clause = OR of literals.

Using De Morgan, T2 turns each clause into a **multi-controlled X gate**:
- positive literal → control on `0`
- negated literal → control on `1`
- target ancilla flips **unless every literal is false**
- trailing `X` converts that into "clause is true"

The clauses are combined by an AND tree of `X` gates over ancillas. After marking, the whole computation is run **backwards** to clear the workspace.

---

# 🖨️ Stage C — Model-to-Text: Qiskit Code

The circuit model is **not** executed directly.

```python
# part2/qiskit_runner.py
generator = QiskitGenerator(
    circuit,
    output_dir=output_dir,
    backend_type=config.simulator_name,
    shots=config.shots,
)
generator.generate()   # → part2/generated/qiskit_circuit.py
```

- Uses **BESSER's QiskitGenerator** and a bundled Jinja template.
- Generated file is ~3 000 lines; we do not write it by hand.
- Runs on **Qiskit Aer simulator**.

---

# ▶️ Stage D — Running the Pipeline

```bash
.venv/bin/python -m part2.pipeline --instance triangle
```

Output:

```text
=== Triangle instance ===
Circuit: 15 qubits, 12 clauses, R = 2 Grover rounds
177 shots (17.29%): A=red, B=green, C=blue  valid=True
176 shots (17.19%): A=red, B=blue, C=green  valid=True
171 shots (16.70%): A=green, B=blue, C=red  valid=True
...
```

The pipeline glues T1 → T2 → Qiskit generation → execution → decoding.

---

# 📤 Stage D — Decoding Measurements

Qiskit returns bitstrings like `"011010"`.

```python
# part2/decoding.py
positions = {(v.regionId, v.bitRole): measurements[v.id] for v in variables}
for region in regions:
    pair = "".join(bits[-1 - positions[region, role]] for role in ("high", "low"))
    colours[region] = {"00": "red", "01": "green", "10": "blue", "11": "invalid"}[pair]
```

- Bit 0 is **rightmost** in Qiskit strings.
- Uses **both** models: solution model for bit positions, problem model for regions/borders.
- Reports invalid regions and conflicting borders.

---

# ✅ Stage D — Validation Results

```bash
.venv/bin/python -m part2.validation
```

| Instance | N | M | R | shots | valid | success prob | solutions found |
|---|---|---|---|---|---|---|---|
| triangle | 64 | 6 | 2 | 1024 | 1024 | 100.00% | 6 |
| ring | 1024 | 30 | 4 | 2048 | 2047 | 99.95% | 30 |
| wheel | 4096 | 0 | 1 | 1024 | 0 | 0.00% | 0 |

- `N` = search space = `2^(2·regions)`
- `M` = exact classical solution count
- `R` = Grover rounds
- **Wheel unsatisfiability is proven by the classical solver, not by zero counts.**

---

# 🎓 Stage D — Honest Limitations

1. **Classical solution count is known in advance.** Used only to choose `R`.
2. **Simulation cost grows fast.** Wheel uses 25 qubits and takes minutes.
3. **No geometry.** Our maps are abstract graphs.
4. **The generated Qiskit file is large** (~3 000 lines) because it is produced by a generic generator.

These are acceptable for a **model-driven engineering demonstration**; the focus is on transformations, not beating classical solvers.

---

# 🧠 Key Takeaways

- Two metamodels (problem + solution) keep concerns separated.
- T1 and T2 are **model-to-model** transformations; Qiskit generation is **model-to-text**.
- Traceability fields (`regionId`, `bitRole`) let us decode bitstrings back into domain colours.
- Solver configuration (`R`, shots, backend) is a **separate model**, not hard-coded.
- Validation compares quantum output against an independent classical baseline.

---

# 🖥️ Live Demo

```bash
.venv/bin/python -m part2.pipeline --instance triangle
```

*(Run now, or show pre-recorded output if time is short.)*

---

# ❓ Questions?

**Repository:** `project1-g13-tacs-mesw.meic`
