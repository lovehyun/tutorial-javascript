require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// Kakao REST API Key
const KAKAO_RESTAPI_KEY = process.env.KAKAO_RESTAPI_KEY;

// KoGPT API 요청 URL
const KOGPT_API_URL = "https://api.kakaobrain.com/v1/inference/kogpt/generation";

// 요청 헤더 설정
const HEADERS = {
    Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`,
    "Content-Type": "application/json"
};

// KoGPT API 호출 함수
async function kogptApi(prompt, maxTokens, temperature = 1.0, topP = 1.0, n = 1) {
    const data = {
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topP,
        n: n
    };

    try {
        const response = await axios.post(KOGPT_API_URL, data, { headers: HEADERS });
        return response.data;
    } catch (error) {
        console.error(`Error: ${error.response?.status || error.message}`);
        return null;
    }
}

// 다양한 테스트 실행
(async () => {
    // 1. 다음 문장 만들기
    console.log("---------- 1. 다음 문장 만들기 ----------");
    const prompt1 = "인간처럼 생각하고, 행동하는 '지능'을 통해 인류가 이제까지 풀지 못했던";
    const response1 = await kogptApi(prompt1, 64, 0.7, 0.8);
    console.log("다음 문장 만들기 결과:", response1);
    console.log("----------------------------------------\n");

    // 2. 문장 분류하기
    console.log("---------- 2. 문장 분류하기 ----------");
    const prompt2 = `상품 후기를 긍정 또는 부정으로 분류합니다.
가격대비좀 부족한게많은듯=부정
재구매 친구들이 좋은 향 난다고 해요=긍정
ㅠㅠ약간 후회가 됩니다..=부정
이전에 먹고 만족해서 재구매합니다=긍정
튼튼하고 잘 쓸수 있을 것 같습니다. 이 가격에 이 퀄리티면 훌륭하죠=`;
    const response2 = await kogptApi(prompt2, 1, 0.4);
    console.log("문장 분류하기 결과:", response2);
    console.log("--------------------------------------\n");

    // 3. 뉴스 한 줄 요약하기
    console.log("---------- 3. 뉴스 한 줄 요약하기 ----------");
    const prompt3 = `카카오(대표이사 정신아)의 카카오프렌즈가 서울페스타 2024에 참여한다고 29일 밝혔다. 서울페스타는 서울시에서 주최하는 서울 대표 봄축제로 서울의 다양한 매력을 전 세계에 홍보하는 행사다. 카카오는 황금연휴 기간 서울 곳곳에서 카카오프렌즈를 활용한 행사로 나들이객들과 관광객들에게 색다른 즐거움을 선사할 계획이다.
한줄 요약:`;
    const response3 = await kogptApi(prompt3, 64, 0.1);
    console.log("뉴스 한 줄 요약하기 결과:", response3);
    console.log("--------------------------------------------\n");

    // 4. 질문에 답변하기
    console.log("---------- 4. 질문에 답변하기 ----------");
    const prompt4 = `의료 스타트업으로 구성된 원격의료산업협의회가 10월부터 열리는 국정감사 시기에 맞춰 국회와 정부에 비대면 진료법 근거 마련을 촉구하는 정책제안서를 제출한다. 
정책제안서를 제출하는 시기는 언제인가?:`;
    const response4 = await kogptApi(prompt4, 128, 0.2);
    console.log("질문에 답변하기 결과:", response4);
    console.log("----------------------------------------\n");

    // 5. 특정 정보 추려내기
    console.log("---------- 5. 특정 정보 추려내기 ----------");
    const prompt5 = `임진왜란(壬辰倭亂)은 1592년(선조 25년) 도요토미 정권이 조선을 침략하면서 발발하여 1598년(선조 31년)까지 이어진 전쟁이다.
임진왜란 때 조선의 왕은?
답:`;
    const response5 = await kogptApi(prompt5, 1, 0.3);
    console.log("특정 정보 추려내기 결과:", response5);
    console.log("----------------------------------------\n");

    // 6. 말투 바꾸기
    console.log("---------- 6. 말투 바꾸기 ----------");
    const prompt6 = `주어진 문장을 존댓말 문장으로 바꿔주세요.
문장:하지마!
존댓말:하지 말아주세요.
문장:배고파 밥줘
존댓말:배가 고픈데 밥을 먹어도 될까요?
문장:당장 제자리에 돌려놔
존댓말:`;
    const response6 = await kogptApi(prompt6, 10, 0.7);
    console.log("말투 바꾸기 결과:", response6);
    console.log("----------------------------------------\n");

    // 7. 채팅하기
    console.log("---------- 7. 채팅하기 ----------");
    const prompt7 = `정보:거주지 서울, 나이 30대, 성별 남자, 자녀 두 명, 전공 인공지능, 말투 친절함
Q:안녕하세요 반갑습니다. 자기소개 부탁드려도 될까요?
A:안녕하세요. 저는 서울에 거주하고 있는 30대 남성입니다.
Q:오 그렇군요, 결혼은 하셨나요?
A:`;
    const response7 = await kogptApi(prompt7, 32, 0.3, 0.85);
    console.log("채팅하기 결과:", response7);
    console.log("----------------------------------------\n");
})();
