const EventEmitter = require("events");

class ConnectionProtocol extends EventEmitter {
    constructor(peer, localId) {
        super();
        this.peer = peer;
        this.localId = localId;
        this.state = "INIT";

    }

    onMessage(rawMsg) {
        const msg = JSON.parse(rawMsg.toString());
        if (msg.type == "handshake") {
            this.state = "HANDSHAKING";
            this.emit(this.state);
            this.handleHandshake(msg);

        }
    }

    handleHandshake(msg) {
        if (this.state !== "HANDSHAKING") return;
        this.peer.remotePeerId = msg.peerId;
        this.state = "READY";
        this.sendHandshake();
        

        
    }

    sendHandshake() {
        const handshake = {
            type: "handshake",
            peerId: this.localId,
        }
        this.emit("handshake-sent", handshake);
    }

    sendMessage(type, payload) {
        if (this.state !== READY) {
            throw new Error("Protocol not ready");
        }

        const msg = JSON.stringify({
            type,
            payload
        })

        this.peer.sendMessage(msg);


    }
}