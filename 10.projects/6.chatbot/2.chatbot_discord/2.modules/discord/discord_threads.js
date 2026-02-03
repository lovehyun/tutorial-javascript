async function archiveOldThreads(client, channelId, maxIdleMinutes = 1440) {
    try {
        const channel = await client.channels.fetch(channelId);
        const activeThreads = await channel.threads.fetchActive();
        const now = new Date();

        activeThreads.threads.forEach(async (thread) => {
            const lastMessageTimestamp = thread.lastMessage?.createdTimestamp || thread.createdTimestamp;
            const idleTimeMinutes = (now - lastMessageTimestamp) / (1000 * 60); // 1시간

            if (idleTimeMinutes >= maxIdleMinutes) {
                await thread.setArchived(true);
            }
        });
    } catch (error) {
        console.error('Error archiving threads:', error.message);
    }
}

module.exports = { archiveOldThreads };
