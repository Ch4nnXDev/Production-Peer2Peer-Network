const EventEmitter = require("events");

class MessageRouter extends EventEmitter {
    constructor(connectionManager, PeerManager) {
        super();
        this.routes = new Map();
        this.connectionManager = connectionManager;
        this.peerManager = PeerManager;

        this.connectionManager.on("message-received", (msg, peer) => {
            this.route(msg, peer);
        });


    }

    register(type, handler) {
        this.routes.set(type, handler);
    }

    route(msg, peer) {
        const type = msg.type;
        const handler = this.routes.get(type);
        if (handler) {
            handler(msg, peer);
        } else {
            this.emit("unhandled-message", msg, peer);
        }
    }
}

module.exports = MessageRouter;