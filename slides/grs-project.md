---
marp: true
theme: default
paginate: true
_class: lead
---

# Network Chaos Tool

### Fault injection for Docker networks

---

## Introduction

- Programmable chaos engineering tool for Docker-based topologies.
- Injects latency and packet loss into running containers.
- Uses a privileged sidecar to keep victims unmodified.

---

## Need for the Project

- Container networks hide real-world failures until production.
- Teams need safe, repeatable experiments in dev/test.
- Existing tools often assume Kubernetes or production access.

---

## Project Overview

- Host wrapper `chaosctl` spins up a sidecar.
- Sidecar enters the target network namespace via `nsenter`.
- `tc` applies latency, loss, and composite rules.
- Optional auto-clear and scenario runner.

---

## Similar Projects

- Chaos Monkey
- Focused on disrupting production live systems to test resilience.
- Our scope: Docker dev/test environments and local topologies.

---

## Main Features

- Privileged sidecar with zero requirements on victims.
- Latency and loss, including composite faults.
- Scenario runner from YAML definitions.
- Auto-clear by duration.
- Sidecar image fallback: local cache, registry, or bundled build.

---

## Installation

- Published on PyPI: [https://pypi.org/project/network-chaos-tool/](https://pypi.org/project/network-chaos-tool/)

```bash
pip install network-chaos-tool
chaosctl serve
```

---

## Web Dashboard Overview

- `chaosctl serve` launches a FastAPI dashboard.
- Live `tc` metrics and ping measurements.
- Auto-starts a monitor sidecar for visibility.

---

## Live Demo

---

## Future Work

- Automated random chaos experiments.
- More fault types: jitter, corruption, bandwidth throttling, partitions.
- Infer network topology from docker-compose.

---

## Conclusion

- Safe, repeatable network fault injection for Docker.
- Realistic failures without touching victim containers.
- Ready for extension with new fault types and automation.
