const net = require("net");

const port = 4444;

// Set of all currently connected sockets
const connectedSockets = new Set();

// broadcast to all connected sockets except one
connectedSockets.broadcast = function (data, except) {
  for (let sock of this) {
    if (sock !== except) {
      sock.write(data);
    }
  }
};

const server = net.createServer(onClientConnection);

server.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

function onClientConnection(sock) {
  console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);
  connectedSockets.add(sock);

  sock.on("data", async function (data) {
    const msgData = await JSON.parse(data.toString());
    connectedSockets.broadcast(
      `${msgData.name} [${sock.remoteAddress}:${sock.remotePort}]: ${msgData.message}`,
      sock
    );
  });

  sock.on("close", function () {
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connection closed`);
  });

  sock.on("error", function (error) {
    console.error(
      `${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`
    );
  });
}
