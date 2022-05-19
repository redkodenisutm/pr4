const port = 4444;

module.exports = class Client {
  connected = false;
  constructor(socket, name) {
    this.socket = socket;
    this.name = name;
  }

  async connect() {
    await this.socket.connect(port);
    this.socket.on("connect", this.onConnect.bind(this));
    this.socket.on("data", this.onData.bind(this));
    this.socket.on("close", this.onClose.bind(this));
    this.socket.on("error", this.onError.bind(this));
  }

  chat(message) {
    this.socket.write(JSON.stringify({ name: this.name, message }));
  }

  onConnect() {
    this.connected = true;
  }

  onData(data) {
    console.log(data.toString());
  }

  onClose() {
    this.connected = false;
  }

  onError(error) {
    console.error(
      `${this.socket.remoteAddress}:${this.socket.remotePort} Connection Error ${error}`
    );
  }
};
