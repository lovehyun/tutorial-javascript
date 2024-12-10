const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const { archiveOldThreads } = require('./discord_threads'); // 쓰레드 관리 함수 가져오기
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// 쓰레드 생성 또는 가져오기
async function getOrCreateThread(userId, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) throw new Error('Channel not found or bot lacks access.');

        // 기존 쓰레드 검색
        const activeThreads = await channel.threads.fetchActive();
        const existingThread = activeThreads.threads.find(
            (thread) => thread.name === `Session ${userId}`
        );

        if (existingThread) {
            console.log(`Existing thread found: ${existingThread.name}`);
            return existingThread;
        }

        // 새로운 쓰레드 생성
        const newThread = await channel.threads.create({
            name: `Session ${userId}`,
            autoArchiveDuration: 60, // 1시간 후 자동 보관
        });

        console.log(`New thread created: ${newThread.name}`);
        return newThread;
    } catch (error) {
        console.error('Error creating or fetching thread:', error.message);
    }
}

// Discord 클라이언트 준비 이벤트
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // 오래된 쓰레드 아카이브 작업 시작
    const channelId = process.env.DISCORD_CHANNEL_ID;

    setInterval(() => {
        archiveOldThreads(client, channelId); // 클라이언트와 채널 ID를 전달
    }, 60 * 1000); // 1분 간격
});

// 메시지 이벤트 처리
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // 봇 메시지 무시

    // 특정 채널(또는 쓰레드)에서만 메시지 처리
    const allowedChannelId = process.env.DISCORD_CHANNEL_ID; // 환경 변수에서 채널 ID 가져오기
    if (message.channelId !== allowedChannelId && !message.channel.isThread()) return;
    
    // 메시지를 서버로 전달
    const threadMatch = message.channel.name.match(/Session (\d+)/);        
    if (threadMatch) {
        const userId = threadMatch[1]; // 쓰레드 이름에서 세션 ID 추출
        const content = message.content.trim(); // 메시지 내용
        const displayName = message.member?.displayName || message.author.username; // 별명 또는 기본 사용자 이름

        try {
            await axios.post('http://localhost:3000/api/messages', {
                userId,
                name: displayName, // 작성자 이름 추가
                message: content,
                timestamp: new Date(),
                fromAdmin: true, // Discord에서 온 메시지
            });
            console.log(`Message sent to server for user ${userId} from ${displayName}: ${content}`);
        } catch (error) {
            console.error('Error sending message to server:', error.message);
        }
    }
});

// Discord 클라이언트 로그인
client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = { client, getOrCreateThread };
