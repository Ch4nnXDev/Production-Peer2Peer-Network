const EventEmitter = require("events");

class ConnectionProtocol extends EventEmitter {
    constructor(peer, localId) {
        super();
        this.peer = peer;
        this.localId = localId;
        this.state = "INIT";

        this.peer.on("message", raw => this.onMessage(raw));

    }

    onMessage(rawMsg) {
        let msg;
        try {
            msg = JSON.parse(rawMsg.toString());
        } catch (e) {
            this.emit("error", new Error("Invalid message JSON"));
            return;
        }

        if (msg.type === "handshake") {
            this.handleHandshake(msg);
        } else {
            this.emit("message-received", msg);
        }
    }


    handleHandshake(msg) {
        if (this.state !== "INIT") return;
        this.peer.remotePeerId = msg.peerId;
        this.sendHandshake();
        this.state = "READY";
        
        this.emit("ready", this.peer);
        

        
    }

    sendHandshake() {
        const handshake = {
            type: "handshake",
            peerId: this.localId,
        }
        this.peer.sendMessage(JSON.stringify(handshake));
        this.emit("handshake-sent", handshake);
    }

    sendMessage(type, payload) {
        if (this.state !== "READY") {
            throw new Error("Protocol not ready");
        }


        const msg = JSON.stringify({ type, payload });
        this.peer.sendMessage(msg);


    }
}