# Peer-to-Peer Networking System (Node.js)

This repository contains a low-level peer-to-peer (P2P) networking system built using Node.js and raw TCP sockets. The project is focused on understanding how distributed systems and P2P protocols are implemented from first principles, without relying on high-level networking frameworks.

The system is designed using a layered architecture:

- **Transport Layer** – TCP socket communication using Node.js `net` module  
- **Peer Layer** – Manages individual peer connections, message framing, and event-based communication  
- **Protocol Layer** – Defines handshake, ping/pong, and structured message types  
- **Overlay & Topology Layer** – Implements an unstructured P2P network with dynamic peer discovery and controlled message propagation  
- **Node / Connection Manager** – Coordinates multiple peer connections and manages network state  

The current implementation follows an **unstructured P2P overlay**, where peers connect dynamically, exchange known peer information, and propagate messages across the network. The architecture is intentionally modular, allowing the overlay layer to be replaced in the future with structured Distributed Hash Table (DHT) protocols (such as Kademlia) or hybrid supernode-based designs without changing the underlying transport layer.

This project serves as an educational and experimental foundation for exploring peer discovery, message routing, protocol design, and scalable distributed network architectures.
