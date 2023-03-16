const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { initSocket } = require('./api/middlewares/socket');
require('dotenv').config('./.env')

const server = http.createServer(app);
const io = require('socket.io')(server);
initSocket(io);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Listening on port ${port}`));

// db connection
mongoose.connect(process.env.MONGODB_URI);