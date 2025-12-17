📡 Peer-to-Peer Networking System (Node.js)
This project is a low-level peer-to-peer (P2P) networking system built using Node.js’ net module, designed to explore how distributed systems operate beneath high-level frameworks.
The system separates concerns into clear layers:
Transport Layer – Raw TCP socket communication
Peer Layer – Manages individual peer connections, message framing, and event-based communication
Protocol Layer – Defines handshake, ping/pong, and message types
Overlay & Topology Layer – Controls peer discovery, message propagation, and network organization (unstructured P2P)
Node / Connection Manager – Coordinates multiple peers and manages lifecycle events
The current implementation follows an unstructured P2P overlay, where peers connect dynamically, exchange known peers, and propagate messages using controlled flooding (TTL-based). This architecture is intentionally modular so that the overlay can later be replaced with a structured DHT (e.g., Kademlia) or a hybrid supernode-based model without changing the transport layer.
Key Goals
Understand how real P2P systems are built from first principles
Practice event-driven, layered system design
Avoid framework abstractions to expose core networking concepts
Provide a foundation for future structured overlays and distributed protocols
Why this matters
Most applications rely on centralized servers or high-level libraries. This project focuses on building the networking logic directly, making protocol behavior, peer discovery, and message routing explicit and inspectable.
