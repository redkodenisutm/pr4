const net = require("net");
const Client = require("./client");
const util = require("util");

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);

async function start() {
  try {
    const name = await question(`What's your name?\n`);
    const socket = new net.Socket();
    const client = new Client(socket, name);
    await client.connect();

    let c = true;
    while (c) {
      const message = await question(">");

      if (message !== "exit") {
        client.chat(message);
      } else {
        client.socket.end();
        rl.close();
        c = false;
      }
    }
  } catch (err) {
    console.error("Question rejected", err);
  }
}

start();
