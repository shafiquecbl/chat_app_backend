const { getEmailFromId, emitContacts, sendUserStatus, updateOnlineStatus } = require('../controllers/user');
const { onReview } = require('../controllers/review');
const { emitInitialMessages, getContacts, addFavoriteContact, deleteContact, sendMessage, addMessageAndContact } = require('../controllers/message');
const { uploadMessageImage } = require('../middlewares/image');

module.exports = {
    initSocket: (io) => {
        io.on('connection', (socket) => {

            // when user is online
            socket.on('online', async (email) => {
                socket.join(email);
                updateOnlineStatus(email, true);
                sendUserStatus(io, email, true);
                emitContacts(io, email);
            });

            // when user is offline
            socket.on('offline', (email) => {
                updateOnlineStatus(email, false);
                sendUserStatus(io, email, false);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            // send message
            socket.on('message', async (data) => {
                try {
                    var messageData = '';
                    if (data.image === true) {
                        messageData = await uploadMessageImage(data.message, Date.now().toString().replace('.', ''));
                    } else {
                        messageData = data.message;
                    }
                    const message = await addMessageAndContact(data.sender, data.receiver, messageData, data.image, data.request, data.ended);
                    const senderEmail = await getEmailFromId(data.sender);
                    const receiverEmail = await getEmailFromId(data.receiver);
                    if (messageData != 'Chat Request' && messageData != 'Chat Ended' && messageData != 'Request Accepted') {
                        sendMessage(io, receiverEmail, [message]);
                        sendMessage(io, senderEmail, [message]);
                    }
                    emitContacts(io, senderEmail);
                    emitContacts(io, receiverEmail);
                }
                catch (err) {
                    console.log(err);
                }
            });

            // get contacts
            socket.on('contacts', async (data) => {

                getContacts(data).then((contacts) => {
                    io.to(data).emit('contacts', contacts);
                });

            });

            socket.on('onContacts', async (data) => {
                if (data.favorite) {
                    const contacts = await addFavoriteContact(data.email, data.favorite);
                    io.to(data.email).emit('contacts', contacts);
                }
                if (data.delete) {
                    const contacts = await deleteContact(data.email, data.delete);
                    io.to(data.email).emit('contacts', contacts);
                }

            });

            // get initial messages
            socket.on('initialMessages', async (data) => {
                emitInitialMessages(io, data.email, data.sender, data.receiver);
            });

            // on join chat
            socket.on('joinChat', (data) => {
                inChat(io, data.sender, data.receiver, data.status);
            });

            socket.on('review', async (data) => {
                onReview(io, data);
            });

        });
    },
}

const inChat = (io, sender, receiver, status) => {
    io.to(receiver).emit('inChat', {
        email: sender,
        status: status,
    });
}

