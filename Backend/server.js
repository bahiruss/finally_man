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
const therapistRouter = require('./routes/therapistRoute');
const administratorRouter = require('./routes/adminstratorRoute');
const customerAndCrisisSupportRouter = require('./routes/customerAndCrisisSupportRoute')
const bookingRouter = require('./routes/bookingRoute');
const therapySessionRouter = require('./routes/therapySessionRoute');
const scheduleRouter = require('./routes/scheduleRoute');
const groupSessionRouter = require('./routes/groupSessionRoute');
const feedbackRouter = require('./routes/feedbackAndRatingRoute');
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
    } catch (error) {
      console.error(`Error connecting to the database: ${error}`);
      return; // Stop further execution if the database connection fails
    }
  })();


app.use('/patients', patientRouter(db));
app.use('/therapists', therapistRouter(db));
app.use('/schedule', scheduleRouter(db));
app.use('/administrators', administratorRouter(db));
app.use('/customerAndCrisisSupport', customerAndCrisisSupportRouter(db));
app.use('/bookings', bookingRouter(db));
app.use('/sessions', therapySessionRouter(db));
app.use('/groupSessions', groupSessionRouter(db));
app.use('/feedbackAndRating', feedbackRouter(db));



io.on('connection', socket => {
    // console.log('connected')
    socket.on('join-video-room', (roomId, userId) => {
        socket.join(roomId)
        console.log(`User ${userId} joined video room ${roomId}`);
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
 
    //to check last user to update end time of video session
    socket.on('check-last-user', async (roomId) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room || room.size === 0) {
        try {
          const therapySessionsCollection = await db.getDB().collection('therapysessions');
          await therapySessionsCollection.updateOne(
            { sessionId: roomId },
            { $set: { _sessionEndTime: new Date() } }
          );
          console.log(`Updated end time for session ${roomId}`);
        } catch (error) {
          console.error('Error updating session end time:', error);
        }
      }
    });
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));