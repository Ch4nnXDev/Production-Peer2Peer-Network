const crypto = require("crypto");
const ConnectionManager = require("./ConnectionManager");
const PeerManager = require("./PeerManager");
const MessageRouter = require("./MessageRouter");

class P2PNode {
    constructor(port) {
        this.localId = crypto.randomUUID();
        this.port = port;
        this.connectionManager = new ConnectionManager(this.localId, this.port);
        this.peerManager = new PeerManager(this.connectionManager);
        this.messageRouter = new MessageRouter(this.connectionManager, this.peerManager);

    }

    start() {
        this.connectionManager.startServer();
        console.log(`P2P Node started with ID: ${this.localId} on port: ${this.port}`);
    }

}

const node = new P2PNode(8000);
node.start();
