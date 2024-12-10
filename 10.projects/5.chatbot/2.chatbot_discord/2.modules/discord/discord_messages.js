const { client, getOrCreateThread } = require('./discord');

async function sendMessageToThread(userId, message, channelId) {
    const thread = await getOrCreateThread(userId, channelId);
    if (thread) {
        await thread.send(message);
    }
}

module.exports = { sendMessageToThread };
