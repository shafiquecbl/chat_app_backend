const http = require('http');
const app = require('./app');
const env = require('./api/common/env');
const mongoose = require('mongoose');
const { initSocket } = require('./api/middlewares/socket');

const server = http.createServer(app);
const io = require('socket.io')(server);
initSocket(io);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Listening on port ${port}`));

// db connection
mongoose.connect(env.dbUrl);