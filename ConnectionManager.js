const net = require('net');
const { EventEmitter } = require('events');
const Peer = require("./Peer");
const crypto = require("crypto");

class ConnectionManager extends EventEmitter {
    constructor(localId) {
        super();
        this.localId = localId;
        this.connections = new Map();
        this.knownPeers = new Map();
        this.server = null;
    }

    startServer() {
        this.server = net.createServer((socket)=> {
            const peer = new Peer(socket);
            peer.socket = socket;
        

            peer.on("data", (data)=>{
                const msg = JSON.parse(data.toString());
                if (msg.type == "handshake") {
                  

                    const serverHandshake = JSON.stringify({
                        type: "handshake",
                        localId: this.id,
                        host: this.host,
                        port: this.port
                    })
                    socket.write(serverHandshake);
                } else {
                    socket.write(data.toString());
                    this.emit("message-recevied", data.toString());
                }
            })

        })
        this.server.listen(this.port);

    };
    addPeer(host, port) {
        const peer = new Peer(host, port);
        peer.on("handshake-received", (msg)=> {
            this.connections.set(msg.peerId, peer.socket);
            this.knownPeers.set(msg.peerId, {host: msg.host, port: msg.port})
        })
        peer.connect(host, port);



    };
    removePeer(id) {
        if (this.knownPeers.get(id)) {
            this.knownPeers.delete(id);
        }
    };
    getknownPeers() {
        if (this.knownPeers.size != 0) {
            this.knownPeers.forEach((value, key)=> {
                console.log(key, value);
            })
        }
    };
    getConnections() {
        if (this.connections.size != 0) {
            this.connections.forEach((value, key)=> {
                console.log(key, value);
            })
        }
    };

}

module.exports = ConnectionManager;