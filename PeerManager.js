const EventEmitter = require("events");
const ConnectionManager = require("./ConnectionManager");

class PeerManager extends EventEmitter {
    constructor(ConnectionManager) {
        this.ConnectionManager = ConnectionManager;
        this.knownPeers = new Map();
        


    }
}