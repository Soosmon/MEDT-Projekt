const { Server } = require('ws');

let wss = null;
function setupWebSocket(server) {
  wss = new Server({ server });
  wss.on('connection', ws => {
    ws.on('message', message => {
      // Broadcast an alle Clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(message);
        }
      });
    });
  });
}

function broadcastNotesChanged() {
  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: 'notesChanged' }));
    }
  });
}

module.exports = { setupWebSocket, broadcastNotesChanged };
