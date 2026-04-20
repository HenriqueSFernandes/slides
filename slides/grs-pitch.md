---
marp: true
title: GRS Pitch - Network Chaos Tool
theme: default
paginate: true
_class: lead
---

# Network Chaos Tool

### Resilience Testing for Docker-Simulated Networks

---

## What Is It?

A **programmable chaos engineering tool** that targets Docker-based network topologies.

- Injects faults: **packet loss**, **latency**, **network partitions**, **container crashes**
- Uses `iptables` and `tc` (traffic control) to manipulate network conditions at runtime
- Exposes a simple interface to define **chaos scenarios** and run them on demand
- Monitors and records **how the network recovers**

---

## Why Is It Relevant?

Directly extends the skills and infrastructure from our labs:

| Lab Concept | How It's Used |
|---|---|
| Docker networking (bridge/macvlan) | Target environment for fault injection |
| OSPF/BGP with Quagga | Test routing convergence under partition |
| Nginx + Load Balancer | Measure degradation under resource exhaustion |
| Prometheus / Grafana | Observability stack for chaos metrics |

---

## Implementation Plan

**Core Components:**

1. **Chaos Agent**: Python service using the Docker API to stop containers or apply `tc` / `iptables` rules
2. **Scenario Runner**: Define fault scenarios (duration, target, type) in a config file
3. **Observability Stack**: Prometheus scrapes metrics; Grafana shows a live "Chaos Dashboard"

**Key Scenarios:**
- Break an OSPF adjacency via `iptables DROP` between routers
- Add 200ms latency + 10% packet loss on an uplink
- Kill a replicated Nginx worker and watch the load balancer react

