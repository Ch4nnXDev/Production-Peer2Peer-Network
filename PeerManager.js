const EventEmitter = require("events");
const ConnectionManager = require("./ConnectionManager");

class PeerManager extends EventEmitter {
    constructor(ConnectionManager) {
        this.ConnectionManager = ConnectionManager;
        this.peers = new Map();

        this.ConnectionManager.on("peer-connected", (peer) => this.addPeer(peer));
        this.ConnectionManager.on("peer-disconnected", (peer) => this.removePeer(peer));
        
        


    }
}