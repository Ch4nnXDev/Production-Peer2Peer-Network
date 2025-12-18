const EventEmitter = require("events");
const ConnectionManager = require("./ConnectionManager");

class PeerManager extends EventEmitter {
    constructor(ConnectionManager) {
        this.ConnectionManager = ConnectionManager;
        this.peers = new Map();

        this.ConnectionManager.on("peer-connected", (peer) => this.addPeer(peer));
        this.ConnectionManager.on("peer-disconnected", (peer) => this.removePeer(peer));

        
        }
        addPeer(peer) {
            this.peers.set(peer.remotePeerId, peer);
        }
        removePeer(peerId) {
            this.peers.delete(peerId);
        }

        sendMessage(peerId, type, payload) {
            const peer = this.peers.get(peerId);
            if (!peer) throw new Error("Peer not found");
            peer.sendMessage(type, payload);
        }

        broadcastMessage(type, payload) {
            for (const peer of this.peers.values()) {
                peer.sendMessage(type, payload);
            }
        }
}