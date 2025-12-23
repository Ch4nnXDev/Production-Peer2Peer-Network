const { EventEmitter } = require("events");
const net = require("net");
const crypto = require("crypto");

class Peer extends EventEmitter {
    constructor(socket) {
        super();
        this.id = crypto.randomUUID();
        this.remotePeerId = null;
        this.socket = socket;
        this.state = "INIT";
        this.buffer = "";
        this.remoteListenPort = null;
        this.setupSocket();

    }

    setupSocket() {
        this.socket.on("data", (data)=> {                    // data here is only raw without limits because tcp dosent find limits
            this.buffer += data.toString();
            this.processBuffer();
            
        })
       
        this.socket.on("end", ()=> {
            this.emit("disconnected");
        })

        this.socket.on("close", ()=> {
            this.emit("disconnected");
        })

        this.socket.on("error", (err)=> {
            this.emit("error", err);

        })
    }

    processBuffer() {            // this is needed to find the message limit
        let index;
        while ((index = this.buffer.indexOf("\n")) !== -1) {       // Transport Layer -> Message Layer -> Protocol Layer -> Application Layer
            const fmsg = this.buffer.slice(0, index);
            this.buffer = this.buffer.slice(index + 1);

            if (fmsg.length === 0) continue;
    
            this.emit("message", fmsg);
        }
        
        

    }

    sendMessage(message) {
        if (this.socket) {
            this.socket.write(message + "\n");

        } else {
            throw new Error("No Socket Detected");
        }
        
    }

}

module.exports = Peer;
   