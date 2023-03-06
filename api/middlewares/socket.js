const { updateOnlineStatus } = require('../controllers/user');
const { addMessageAndContact, getContacts } = require('../controllers/user');

module.exports = {
    initSocket: (io) => {
        io.on('connection', (socket) => {

            socket.on('online', (email) => {
                updateOnlineStatus(email, true);
            });

            socket.on('offline', (email) => {
                updateOnlineStatus(email, false);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            socket.on('message', (data) => {
                addMessageAndContact(data.sender, data.receiver, data.message);

            });

            socket.on('contacts', (data) => {
                socket.join(data);
                getContacts(data).then((contacts) => {
                    io.to(data).emit('contacts', contacts);
                });
            });

        });
    }
}