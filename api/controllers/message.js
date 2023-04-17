const User = require('../models/user');
const Message = require('../models/message');
const { uploadMessageImage } = require('../middlewares/image');
const userCon = require('./user');

const sendMessage = (io, receiver, messages) => {
    io.to(receiver).emit('onMessage', messages);
}

const getInitialMessages = async (senderId, receiverId) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: -1 });

        return messages;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    async addMessageAndContact(senderId, receiverId, message, image, request, ended) {
        try {
            const senderUser = await User.findOne({ _id: senderId });
            const receiverUser = await User.findOne({ _id: receiverId });

            console.log(request);

            if (message != 'Chat Request' && message != 'Chat Ended' && message != 'Request Accepted') {
                senderId = senderId;
            } else {
                // check if the contact already exists then get sender Id
                const senderContactIndex = senderUser.contacts.findIndex(contact => contact.user.toString() === receiverUser._id.toString());
                if (senderContactIndex !== -1) {
                    senderId = senderUser.contacts[senderContactIndex].sender;
                }

            }

            const senderContact = {
                user: receiverUser._id,
                lastMessage: message,
                createdAt: Date.now(),
                image: image,
                ended: ended,
                request: request,
                sender: senderUser._id
            };

            const receiverContact = {
                user: senderUser._id,
                lastMessage: message,
                createdAt: Date.now(),
                image: image,
                ended: ended,
                request: request,
                sender: senderUser._id
            };

            if (request == 'accepted') {
                senderContact.startTime = Date.now();
                receiverContact.startTime = Date.now();
            }

            // add contact to sender
            const senderContactIndex = senderUser.contacts.findIndex(contact => contact.user.toString() === receiverUser._id.toString());
            if (senderContactIndex === -1) {
                senderUser.contacts.push(senderContact);
            }
            else {
                senderUser.contacts[senderContactIndex] = senderContact;
            }

            // add contact to receiver
            const receiverContactIndex = receiverUser.contacts.findIndex(contact => contact.user.toString() === senderUser._id.toString());
            if (receiverContactIndex === -1) {
                receiverUser.contacts.push(receiverContact);
            }
            else {
                receiverUser.contacts[receiverContactIndex] = receiverContact;
            }

            senderUser.save();
            receiverUser.save();


            // save message in the database

            const newMessage = new Message({
                sender: senderUser._id,
                receiver: receiverUser._id,
                message: message,
                createdAt: Date.now(),
                image: image
            });

            var messageResult = '';
            if (message != 'Chat Request' && message != 'Chat Ended' && message != 'Request Accepted') {
                messageResult = await newMessage.save();
            }

            return messageResult;

        }
        catch (err) {
            console.log(err);
        }

    },


    async getContacts(email) {
        console.log(email);
        const user = await User.findOne({ email: email }).populate('contacts.user');
        return user.contacts;
    },



    async addFavoriteContact(email, contactId) {
        const user = await User.findOne({ email: email }).populate('contacts.user');
        const contactIndex = user.contacts.findIndex(contact => contact.user._id.toString() === contactId.toString());
        if (contactIndex !== -1) {
            // if null or undefined then set to true and if true then set to false and if false then set to true
            user.contacts[contactIndex].favorite = user.contacts[contactIndex].favorite ? false : true;
        }
        user.save();
        return user.contacts;

    },


    async deleteContact(email, contactId) {
        const user = await User.findOne({ email: email }).populate('contacts.user');
        const contactIndex = user.contacts.findIndex(contact => contact.user._id.toString() === contactId.toString());
        if (contactIndex !== -1) {
            user.contacts.splice(contactIndex, 1);
        }
        user.save();
        return user.contacts;
    },

    async onMessage(io, data) {
        try {
            var messageData = '';
            if (data.image === true) {
                messageData = await uploadMessageImage(data.message, Date.now().toString().replace('.', ''));
            } else {
                messageData = data.message;
            }
            const message = await addMessageAndContact(data.sender, data.receiver, messageData, data.image, data.request, data.ended);
            const senderEmail = await userCon.getEmailFromId(data.sender);
            const receiverEmail = await userCon.getEmailFromId(data.receiver);
            if (messageData != 'Chat Request' && messageData != 'Chat Ended' && messageData != 'Request Accepted') {
                sendMessage(io, receiverEmail, [message]);
                sendMessage(io, senderEmail, [message]);
            }
            userCon.emitContacts(io, senderEmail);
            userCon.emitContacts(io, receiverEmail);
        }
        catch (err) {
            console.log(err);
        }
    },

    async emitInitialMessages(io, email, senderId, receiverId) {
        const messages = await getInitialMessages(senderId, receiverId);
        io.to(email).emit('onMessage', messages);
    }

};