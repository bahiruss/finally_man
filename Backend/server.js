require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io") 
const Database = require('./config/dbConn');

const corsOptions = require('./config/corsOptions');
// const { logger } = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');
// const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const patientRouter = require('./routes/patientRoute');
const administratorRouter = require('./routes/adminstratorRoute');
const customerAndCrisisSupportRouter = require('./routes/customerAndCrisisSupportRoute')
// const mongoose = require('mongoose');
// const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
     origin: "http://localhost:3000",
     methods: ["GET", "Post"],   
    },
});

const db = new Database();

//asynchronously connecting to the database before server runs
(async () => {
    try {
      await db.connectToDB();
      console.log('Connected to the database');
    } catch (error) {
      console.error(`Error connecting to the database: ${error}`);
      return; // Stop further execution if the database connection fails
    }
  })();


app.use('/patients', patientRouter(db));
app.use('/administrators', administratorRouter(db));
app.use('/customerAndCrisisSupport', customerAndCrisisSupportRouter(db));

app.get('/session/:roomId', (req, res) => {

})




io.on('connection', socket => {
    console.log('connected')
    socket.on('join-video-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
          })
    })
    socket.on('join-chat-room', (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);

        socket.on('send-message', (messageData) => {
            socket.to(roomId).emit('receive-message', messageData);
        })

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
          });
    })
   
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));