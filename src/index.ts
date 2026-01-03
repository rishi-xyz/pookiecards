import http from "http"
import express from "express"
import { Server } from "colyseus"
import { BattleRoom } from "./rooms/BattleRoom"

const app = express()
const server = http.createServer(app)

const gameServer = new Server({ server })

gameServer.define("battle", BattleRoom)

app.get("/", (_, res) => {
  res.send("Colyseus server running")
})

const PORT = 2567
server.listen(PORT, () => {
  console.log(`Colyseus running on ws://localhost:${PORT}`)
})