const EventEmitter = require("events");

class PeerManager extends EventEmitter {
    constructor(connectionManager) {
        super();

        this.connectionManager = connectionManager;
        this.peers = new Map(); 

        this.connectionManager.on("peer-connected", (peer) => {
            this.addPeer(peer);
        });

        this.connectionManager.on("peer-disconnected", (peer) => {
            this.removePeer(peer.remotePeerId);
        });
    }

    addPeer(peer) {
        this.peers.set(peer.remotePeerId, peer);
        this.emit("peer-added", peer);
    }

    removePeer(peerId) {
        this.peers.delete(peerId);
        this.emit("peer-removed", peerId);
    }

    sendMessage(peerId, type, payload) {
        const peer = this.peers.get(peerId);
        if (!peer) {
            throw new Error(`Peer not found: ${peerId}`);
        }
        peer.sendMessage(type, payload);
    }

    broadcastMessage(type, payload) {
        for (const peer of this.peers.values()) {
            peer.sendMessage(type, payload);
        }
    }

    getPeers() {
        return Array.from(this.peers.keys());
    }
}

module.exports = PeerManager;
