const net = require('net');
const { EventEmitter } = require('events');
const Peer = require("./Peer");
const ConnectionProtocol = require("./ConnectionProtocol");


class ConnectionManager extends EventEmitter {
    constructor(localId, port) {
        super();
        this.localId = localId;
        this.connections = new Map();
        this.knownPeers = new Map();
        this.port = port

    }

    startServer() {
        this.server = net.createServer((socket)=> {
            const peer = new Peer(socket);
            const protocol = new ConnectionProtocol(peer, this.localId);
            protocol.sendHandshake();
            protocol.on("ready", peer => {
                if (this.connections.has(peer.remotePeerId)) {
                    this.connections.get(peer.remotePeerId).socket.destroy();
                }
                this.connections.set(peer.remotePeerId, peer);
                this.knownPeers.set(peer.remotePeerId, {host: socket.remoteAddress, port: peer.remoteListenPort});

            });
            peer.on("disconnected", () => {
                if (peer.remotePeerId) {
                    this.connections.delete(peer.remotePeerId);
                    this.knownPeers.delete(peer.remotePeerId);
                }
            });
            protocol.on("error", err => {
                console.error("Protocol error:", err.message);
                peer.socket.destroy();
            });



            protocol.on("message-received", (msg) => {

                this.emit("message-received", msg, peer);

             });
        

           

        })
        this.server.listen(this.port, () => console.log(`Server listening on port ${this.port}`));

    };
    addPeer(host, port) {
        const socket = net.connect(host, port);
        const peer = new Peer(socket);
        const protocol = new ConnectionProtocol(peer, this.localId);
        protocol.sendHandshake();
        protocol.on("ready", (peer) => {

            if (this.connections.has(peer.remotePeerId)) {
                this.connections.get(peer.remotePeerId).socket.destroy();
            }

            this.connections.set(peer.remotePeerId, peer);

            this.knownPeers.set(peer.remotePeerId, { host, port: peer.remoteListenPort });
            this.emit("peer-connected", peer);
        });

        peer.on("disconnected", () => {
            if (peer.remotePeerId) {
                this.connections.delete(peer.remotePeerId);
                this.knownPeers.delete(peer.remotePeerId);
            }
        });
        
        protocol.on("error", err => {
            console.error("Protocol error:", err.message);
            peer.socket.destroy();
        });



        protocol.on("message-received", (msg) => {
            this.emit("message-received", msg, peer);
        });

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