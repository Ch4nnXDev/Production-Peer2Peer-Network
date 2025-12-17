const EventEmitter = require("events");

class ConnectionProtocol extends EventEmitter {
    constructor(peer, options) {
        super();
        this.options = options;
        this.state = "INIT";
        this.peer = peer;
    }

    onMessage(rawMsg) {
        const fmsg = rawMsg.toString();
        if (fmsg.type == "handshake") {
            this.state = "HANDSHAKING";
            this.emit(this.state);

        }
    }

    handleHandshake(msg) {
        this.peer.remotePeerId = msg.peerId;
        this.state = "READY";
        this.sendHandshake();


        
    }

    sendHandshake() {
        const handshake = {
            type: "handshake",
            peerId: this.peer.remotePeerId,
            socket: this.peer.socket

        }
        this.emit("handshake-sent", handshake);
    }

    sendMessage() {

    }
}