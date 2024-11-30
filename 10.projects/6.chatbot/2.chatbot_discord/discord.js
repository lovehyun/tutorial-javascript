const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

console.log('DISCORD_BOT_TOKEN:', process.env.DISCORD_BOT_TOKEN ? 'Loaded' : 'Missing');
console.log('DISCORD_CHANNEL_ID:', process.env.DISCORD_CHANNEL_ID || 'Missing');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // 봇이 서버(guild) 관련 이벤트를 받을 수 있도록 허용.
        GatewayIntentBits.GuildMessages, // 봇이 서버의 텍스트 채널에 전송된 메시지를 받을 수 있도록 허용.
        GatewayIntentBits.MessageContent, // 봇이 메시지의 내용을 읽을 수 있도록 허용.
    ],
});

// 쓰레드 생성 또는 가져오기
async function getOrCreateThread(userId, channelId) {
    console.log(`Fetching channel with ID: ${channelId}`);
    const channel = await client.channels.fetch(channelId).catch((error) => {
        console.error('Error fetching channel:', error.message);
    });

    if (!channel) {
        console.error('Channel not found or bot lacks access.');
        return;
    }
    console.log(`Channel fetched: ${channel.name}`);
    
    // 기존 쓰레드 검색
    const existingThreads = await channel.threads.fetchActive();
    const existingThread = existingThreads.threads.find(
        (thread) => thread.name === `Session ${userId}`
    );

    if (existingThread) {
        return existingThread;
    }

    // 새로운 쓰레드 생성
    const newThread = await channel.threads.create({
        name: `Session ${userId}`,
        autoArchiveDuration: 60, // 1시후 자동 보관
    }).catch((error) => {
        console.error('Error creating thread:', error.message);
    });

    if (!newThread) {
        console.error('Failed to create thread.');
        return;
    }

    console.log(`Thread created: ${newThread.name}`);
    return newThread;
}

// 쓰레드에 메시지 보내기
async function sendMessageToThread(userId, message) {
    const channelId = process.env.DISCORD_CHANNEL_ID; // 텍스트 채널 ID
    const thread = await getOrCreateThread(userId, channelId);

    try {
        await thread.send(message);
        console.log(`Message sent to thread [${thread.name}]: ${message}`);
    } catch (error) {
        console.error('Error sending message to thread:', error.message);
    }
}

// 쓰레드 메시지 감지 및 전달
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // 봇 메시지 무시

    // 메시지가 쓰레드에서 발생한 경우 처리
    if (message.channel.isThread()) {
        const threadMatch = message.channel.name.match(/Session (\d+)/);
        
        if (threadMatch) {
            const userId = threadMatch[1]; // 쓰레드 이름에서 세션 ID 추출
            const content = message.content.trim(); // 메시지 내용
            const displayName = message.member?.displayName || message.author.username; // 별명 또는 기본 사용자 이름

            console.log(`Message in thread [${message.channel.name}] from ${displayName}: ${content}`);

            // 메시지를 서버로 전달
            try {
                await axios.post('http://localhost:3000/api/messages', {
                    userId,
                    message: content,
                    author: displayName, // 작성자 이름 추가
                    timestamp: new Date(),
                    fromAdmin: true, // Discord에서 온 메시지
                });
                console.log(`Message sent to server for user ${userId} from ${displayName}: ${content}`);
            } catch (error) {
                console.error('Error sending message to server:', error.message);
            }
        }
    }
});

// 오래된 쓰레드 아카이빙
async function archiveOldThreads() {
    const channelId = process.env.DISCORD_CHANNEL_ID; // 텍스트 채널 ID
    const maxIdleMinutes = parseInt(process.env.THREAD_DELETE_TIME, 10) || 1440; // 기본값 24시간

    const channel = await client.channels.fetch(channelId).catch((error) => {
        console.error('Error fetching channel:', error.message);
    });

    if (!channel) {
        console.error('Channel not found or bot lacks access.');
        return;
    }

    // 모든 활성화된 쓰레드 가져오기
    const activeThreads = await channel.threads.fetchActive();
    const now = new Date();

    activeThreads.threads.forEach(async (thread) => {
        const lastMessageTimestamp = thread.lastMessage?.createdTimestamp || thread.createdTimestamp;
        const idleTimeMinutes = (now - lastMessageTimestamp) / (1000 * 60);

        if (idleTimeMinutes >= maxIdleMinutes) {
            try {
                await thread.setArchived(true);
                console.log(`Archived old thread [${thread.name}] due to inactivity.`);
            } catch (error) {
                console.error(`Error archiving thread [${thread.name}]:`, error.message);
            }
        }
    });
}

// Discord 봇 로그인
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // 주기적으로 오래된 쓰레드 아카이빙
    setInterval(archiveOldThreads, 60 * 1000); // 매 1분마다 실행
});

client.login(process.env.DISCORD_BOT_TOKEN);

// 모듈 내보내기
module.exports = { sendMessageToThread };
