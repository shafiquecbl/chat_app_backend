const { updateOnlineStatus } = require('../controllers/user');
const { addMessageAndContact, getContacts, getInitialMessages, getEmailFromId } = require('../controllers/user');
const { uploadMessageImage } = require('../middlewares/image');
const { onReview } = require('../controllers/review');

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

            });

            // get contacts
            socket.on('contacts', (data) => {
                getContacts(data).then((contacts) => {
                    io.to(data).emit('contacts', contacts);
                });
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

const emitContacts = (io, email) => {
    getContacts(email).then((contacts) => {
        io.to(email).emit('contacts', contacts);
    });
}

const sendUserStatus = (io, email, status) => {
    getContacts(email).then((contacts) => {
        for (let i = 0; i < contacts.length; i++) {
            io.to(contacts[i].user.email).emit('onlineUsers', {
                email: email,
                status: status
            });
        }
    });
}

const emitInitialMessages = async (io, email, senderId, receiverId) => {
    const messages = await getInitialMessages(senderId, receiverId);
    io.to(email).emit('onMessage', messages);
}

const sendMessage = (io, receiver, messages) => {
    io.to(receiver).emit('onMessage', messages);
}

const inChat = (io, sender, receiver, status) => {
    io.to(receiver).emit('inChat', {
        email: sender,
        status: status,
    });
}

