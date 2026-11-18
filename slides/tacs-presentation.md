---
marp: true
title: "Three-Colour Map Colouring with Quantum Model-Driven Engineering"
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

# Three-Colour Map Colouring

A Quantum Model-Driven Engineering Demonstration

TACS / Group 13 / Problem B

---

# Agenda

1. Problem statement
2. The full transformation chain
3. Problem DSL, metamodel and OCL
4. T1: map to CNF and the solution metamodel
5. T2: CNF to quantum circuit and code generation
6. Execution, validation and result reporting
7. Summary

---

# Problem Statement

Can every region of a map be coloured with red, green or blue so that regions sharing a border receive different colours?

Assumptions:

- Only adjacency matters: no shapes, distances or geometry.
- This is a decision problem, not an optimisation problem.
- Regions that touch only at a point are not considered neighbours.

Benchmark maps:

| Map | Regions | Borders | Valid colourings |
|---|---|---|---|
| Triangle | 3 | 3 | 6 |
| Ring | 5 | 5 | 30 |
| Wheel | 6 | 10 | 0 |

---

# Problem DSL: Concepts

The problem language describes maps.

| Class | Attributes | Meaning |
|---|---|---|
| Map | name | One colouring question |
| Region | id | One area to colour |
| Border | none | Joins two different regions |

Associations:

- Map owns Regions by composition (1 to many, at least one).
- Map owns Borders by composition (0 to many).
- Border connects regionA and regionB (1 to 1 each).

No geometric attributes are included because only adjacency affects the result.

---

# Problem DSL: OCL Invariants

Six well-formedness rules constrain the problem metamodel.

| Invariant | Context | Purpose |
|---|---|---|
| NonEmptyMapName | Map | Every map has a readable name. |
| NonEmptyRegionId | Region | Every region has an identifier. |
| UniqueRegionIds | Map | Region identifiers are unique within a map. |
| NoSelfBorder | Border | A border joins two different regions. |
| EndpointsInSameMap | Border | Both endpoints belong to the map that owns the border. |
| NoDuplicateBorders | Map | Each unordered pair of regions appears at most once. |

The colourability rule is not part of the problem metamodel. It is encoded later in the CNF formula.

---

# Problem DSL: Triangle Instance

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

This object model conforms to the problem metamodel. The metamodel is the grammar; the object model is one sentence written in that grammar.

---

# Encoding: Two Bits per Region

Each region is encoded with two Boolean variables.

| bits (high, low) | colour |
|---|---|
| 00 | red |
| 01 | green |
| 10 | blue |
| 11 | invalid |

This encoding uses fewer search qubits than a one-hot encoding, at the cost of longer border clauses.

---

# Mapping: Region to CNF

For every region R:

- Two Boolean variables: R_high and R_low.
- One clause that forbids the invalid pattern 11:

```text
(not R_high or not R_low)
```

For every border U-V, three clauses forbid equal colours:

```text
(U_high or U_low or V_high or V_low)         # not both red
(U_high or not U_low or V_high or not V_low) # not both green
(not U_high or U_low or not V_high or V_low) # not both blue
```

---

# Mapping: Region to CNF (continuation)

Instance sizes:

| Map | Variables | Clauses | Literals | Solutions |
|---|---|---|---|---|
| Triangle | 6 | 12 | 42 | 6 |
| Ring | 10 | 20 | 70 | 30 |
| Wheel | 12 | 36 | 132 | 0 |

---

# Solution Metamodel

The solution language describes Boolean formulas in conjunctive normal form.

| Class | Attributes | Meaning |
|---|---|---|
| Formula | name | One SAT instance, owns variables and clauses |
| BooleanVariable | id, regionId, bitRole | One colour bit; carries traceability back to the map |
| Clause | id | One OR constraint; owned by the formula |
| Literal | negated | One use of a variable, with or without NOT |

---

Associations:

- Formula owns BooleanVariables by composition (1 to many, at least one).
- Formula owns Clauses by composition (1 to many, at least one).
- Clause owns Literals by composition (1 to many, at least one).
- Literal references one BooleanVariable. The variable is not owned because it is shared among clauses.

Traceability fields `regionId` and `bitRole` are not part of the Boolean logic, but they allow measured bitstrings to be decoded back into region colours.

---

# T1: Map to CNF

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
    add_clause([(uh, False), (ul, True),  (vh, False), (vl, True)])   # both green
    add_clause([(uh, True),  (ul, False), (vh, True),  (vl, False)])  # both blue
```

---

# T2: CNF to Quantum Circuit Model

T2 builds a BESSER QuantumCircuit object.

- Search qubits: two per region, holding the colour bits.
- Workspace ancillas: scratch qubits used to evaluate clauses reversibly.
- No separate phase ancilla: the oracle marks by applying Z directly to the formula ancilla.

The oracle evaluates the CNF using a compact AND tree over the clauses, so the number of workspace qubits scales logarithmically with the number of clauses.

| Map | Search qubits | Workspace qubits | Total qubits |
|---|---|---|---|
| Triangle | 6 | 9 | 15 |
| Ring | 10 | 11 | 21 |
| Wheel | 12 | 13 | 25 |

---

# From Clauses to Quantum Gates

Each clause is an OR of literals. Using De Morgan's law, T2 turns it into a multi-controlled X gate:

- A positive literal controls on value 0.
- A negated literal controls on value 1.
- The target ancilla flips unless every literal is false.
- A trailing X converts that into "the clause is true".

Clauses are combined by an AND tree of multi-controlled X gates over additional ancillas. After marking the solution states, the entire oracle computation is reversed to clear the workspace.

The diffuser is the standard Grover inversion-about-the-average operator over the search qubits.

---

# Model-to-Text: Qiskit Generation

The circuit model is not executed directly. BESSER's QiskitGenerator translates it into a runnable Python script.

```python
# part2/qiskit_runner.py
generator = QiskitGenerator(
    circuit,
    output_dir=output_dir,
    backend_type=config.simulator_name,
    shots=config.shots,
)
generator.generate()   # -> part2/generated/qiskit_circuit.py
```

A bundled Jinja template is used when the installed BESSER package does not include it. The generated file is roughly three thousand lines and is not written by hand.

---

# Running the Pipeline

The full chain is invoked with one command:

```bash
.venv/bin/python -m part2.pipeline --instance triangle
```

Example output:

```text
=== Triangle instance ===
Circuit: 15 qubits, 12 clauses, R = 2 Grover rounds
177 shots (17.29%): A=red, B=green, C=blue  valid=True
176 shots (17.19%): A=red, B=blue, C=green  valid=True
171 shots (16.70%): A=green, B=blue, C=red  valid=True
...
```

The pipeline executes T1, T2, Qiskit generation, Aer simulation and decoding in sequence.

---

# Decoding Measurements

Qiskit returns bitstrings such as "011010". The decoder maps each bit to a region and role using the variable traceability fields, then interprets the two-bit colour code.

```python
# part2/decoding.py
positions = {(v.regionId, v.bitRole): measurements[v.id] for v in variables}
for region in regions:
    pair = "".join(bits[-1 - positions[region, role]] for role in ("high", "low"))
    colours[region] = {"00": "red", "01": "green", "10": "blue", "11": "invalid"}[pair]
```

Classical bit 0 is the rightmost character in a Qiskit count string. The decoder uses both the problem model (for regions and borders) and the solution model (for bit positions).

---

# Validation Results

```bash
.venv/bin/python -m part2.validation
```

| Instance | N | M | R | shots | valid | success probability | solutions found |
|---|---|---|---|---|---|---|---|
| triangle | 64 | 6 | 2 | 1024 | 1024 | 100.00% | 6 |
| ring | 1024 | 30 | 4 | 2048 | 2047 | 99.95% | 30 |
| wheel | 4096 | 0 | 1 | 1024 | 0 | 0.00% | 0 |

N is the search space size, M is the exact classical solution count, and R is the number of Grover rounds.

The Wheel result shows zero valid measurements, but unsatisfiability is established by the independent classical solver, not by the quantum measurement alone.

