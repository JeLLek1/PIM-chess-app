import express from 'express';
import dotenv from 'dotenv';
import server from './server';
import wss from './endpoints/WebSocketServer';


dotenv.config();
const port = parseInt(process.env.PORT);
const app = express();

app.get('/', (req, res) => {
  res.send('Test');
});

server.on('request', app);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket as any, head, ws => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});