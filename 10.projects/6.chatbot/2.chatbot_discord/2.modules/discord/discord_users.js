const { client } = require('./discord'); // Discord 클라이언트 가져오기

// Discord 채널 사용자 목록 가져오기
async function getChannelUsers(channelId) {
    try {
        const channel = await client.channels.fetch(channelId); // 채널 가져오기
        if (!channel || !channel.isTextBased()) {
            throw new Error('Invalid channel or bot lacks access.');
        }

        // 채널의 모든 멤버 가져오기
        const members = await channel.guild.members.fetch(); // Guild 멤버 가져오기
        return members
            .filter((member) => !member.user.bot) // 봇 제외
            .map((member) => ({
                id: member.user.id, // 사용자 ID
                username: member.user.username, // 사용자 이름
                displayName: member.displayName || member.user.username, // 별명 또는 기본 이름
            }));
    } catch (error) {
        console.error('Error fetching channel users:', error.message);
        throw error;
    }
}

module.exports = { getChannelUsers };
