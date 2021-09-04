const staff = require("./staff");

class WebSocketService {
  static instance = null;

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
  constructor() {
    this.socketRef = null;
  }

  connect(company, branch) {
    const path = `ws://127.0.0.1:8000/ws/staff/${company}${branch}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("socket opened");
      let message = {
        companyId: company,
        branchId: branch
      };

      this.newChatMessage(message);
    };

    this.socketRef.onmessage = e => {
      //handle in coming message
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
    };

    this.socketRef.onclose = () => {
      console.log("socket closed");
      this.connect();
    };
  }

  socketNewMessage(data) {
    //message received
    const message = JSON.parse(data);
    //if just one message or message list
    if (
      message.section.toUpperCase() == "STAFF_UPDATE" &&
      message.command.toUpperCase() == "NEW_MESSAGE"
    ) {
      socketUpdateUser(message);
    } else if (
      message.section.toUpperCase() == "STAFF_UPDATE" &&
      message.command.toUpperCase() == "FETCH_MESSAGES"
    ) {
      //if message
      message.list.forEach(async item => {
        //update each user
        await socketUpdateUser(item);
      });
    }

    console.log(message);
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "fetch_messages",
      companyId: message.companyId,
      branchId: message.branchId
    });
  }

  sendMessage(data) {
    try {
      this.socketRef.send(
        JSON.stringify({
          ...data
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }

  waitForSocketConnection(callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (socket.readyState === 1) {
        console.log("connection is secure");
        if (callback != null) {
          callback();
        }

        return;
      } else {
        console.log("waiting for connection...");
        recursion(callback);
      }
    }, 1);
  }
}

const WebSocketInstance = WebSocketService.getInstance();

module.exports = WebSocketInstance;
