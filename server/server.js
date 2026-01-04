const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('colyseus');
const { monitor } = require('@colyseus/monitor');


const port = process.env.PORT || 2567;
const app = express();

app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Colyseus server
const gameServer = new Server({
  server: server
});

// Register BattleRoom
gameServer.define('battle', require('./BattleRoom'));

// Register colyseus monitor
app.use('/monitor', monitor());

gameServer.listen(port);
console.log(`Colyseus server is running on ws://localhost:${port}`);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await gameServer.gracefullyShutdown();
  process.exit(0);
});