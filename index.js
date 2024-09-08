const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
var cors = require('cors')


const port = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json())

const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server: server })

/*
"rooms":

	"roomId": {
		"name": string
		"players": {
			"id": {player data}
		}

	}


*/
let rooms = {}
let clients = {}

wss.on('connection', (ws) => {
	
	ws.on('message', (message) => {
		const data = JSON.parse(message.toString())

		// User joins a room
		if (data.type === 'join') {
			const userId = data.userId
			const roomId = data.roomId

			// Store userId/websocket for communcation
			clients[userId] = ws

			// Give websocket id
			ws.userId = userId

			if (roomId in rooms) {
				// "Join" room by adding them to players object
				let players = rooms[roomId]["players"]

				// Check if admin (first player to join room is admin)
				let isAdmin = false
				if (Object.keys(players).length === 0) isAdmin = true

				players[userId] = {
					"admin": isAdmin,
					"name": "test",
					"points": 1
				}
			}
			
			// Room doesn't exist, return error/close ws
			else {

			}

			console.log(rooms)
		}
		
	})

	ws.on('close', () => {
		console.log("User " + ws.userId + " has disconnected")
  });

})


app.get('/', (req, res) => {
  res.json(rooms)
})

app.post('/createRoom', (req, res) => {
	const { roomId, roomName } = req.body
	const room = {
		"name": roomName,
		"players": {}
	}

	rooms[roomId] = room
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})