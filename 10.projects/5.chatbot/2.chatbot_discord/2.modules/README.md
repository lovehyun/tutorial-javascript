
# **Discord 봇 설정 가이드**

이 문서는 Discord 봇을 설정하고, 봇이 서버 멤버의 닉네임을 사용할 수 있도록 필요한 권한과 설정을 설명합니다.

---

## **1. Discord 봇 생성**
Discord 봇을 생성하려면 다음 단계를 따르세요.

### **단계 1. Discord Developer Portal 방문**
- [Discord Developer Portal](https://discord.com/developers/applications)에 접속합니다.

### **단계 2. 새 애플리케이션 생성**
1. **"New Application"** 버튼 클릭.
2. 애플리케이션 이름 입력 후 생성.

### **단계 3. 봇 추가**
1. **"Bot"** 메뉴 선택.
2. **"Add Bot"** 버튼 클릭.
3. 봇이 성공적으로 생성됩니다.

---

## **2. 봇 토큰 가져오기**
1. **"Bot"** 메뉴에서 **Token** 섹션으로 이동.
2. **"Reset Token"** 버튼 클릭 후 새 토큰 생성.
3. 생성된 토큰을 `.env` 파일에 추가:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   ```

---

## **3. 봇 초대 링크 생성**
1. **OAuth2 > URL Generator** 메뉴로 이동.
2. **Scopes**:
   - `bot` 선택.
3. **Bot Permissions**:
   - 다음 권한 체크:
     - `Read Messages/View Channels`
     - `Send Messages`
     - `Manage Threads`
     - `Read Message History`
   - 추가로 필요한 권한:
     - `Use Application Commands` (선택 사항)
4. **초대 링크 생성**:
   - 생성된 URL을 복사한 후 Discord 서버에 봇을 초대.

---

## **4. 서버 설정**
봇이 서버에서 닉네임을 가져오려면 **서버 멤버 읽기 권한**이 필요합니다.

### **봇 역할(Role) 설정**
1. Discord 서버에서 봇이 추가된 역할(Role)을 찾습니다.
2. 역할 설정에서 다음 권한을 활성화:
   - **Manage Threads**: 쓰레드 관리.
   - **Read Message History**: 이전 메시지 읽기.
   - **Read Messages/View Channels**: 채널 메시지 읽기.
   - **Send Messages**: 메시지 전송.
   - **Manage Nicknames**: 닉네임 읽기/관리.

### **채널별 권한 확인**
1. Discord에서 봇이 활동할 텍스트 채널을 선택.
2. 채널 설정 > **Permissions** > 봇 역할에 대해 다음을 활성화:
   - `Read Messages/View Channels`
   - `Read Message History`
   - `Manage Threads`

---

## **5. 봇 코드와 환경 변수 설정**
### **`.env` 파일**
환경 변수로 봇 토큰 및 채널 ID를 설정합니다.

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
```

- **`DISCORD_CHANNEL_ID`**:
  - 봇이 메시지를 처리할 텍스트 채널 ID.
  - 채널 ID는 채널을 마우스 오른쪽 버튼으로 클릭 > **"Copy ID"**를 통해 복사.

---

## **6. 봇 닉네임 사용 코드**
Discord.js에서 닉네임을 가져오는 코드를 구현합니다.

### **필요한 권한**
- `message.member.displayName`은 봇이 서버 멤버 정보를 읽을 수 있어야 작동합니다.
- `Read Message History`와 `Read Messages/View Channels` 권한이 필요.

```javascript
const authorName = message.member ? message.member.displayName : message.author.username;
```

---

## **7. 테스트**
### **봇 실행**
1. 서버에서 봇이 정상적으로 초대되었는지 확인.
2. `node app.js`를 실행하여 봇을 시작.
3. 다음 시나리오를 테스트:
   - 서버에서 사용자가 메시지를 보냈을 때 봇이 닉네임을 감지.
   - 닉네임이 설정되지 않은 경우 기본 유저네임으로 처리.

---

## **8. 문제 해결**
### **봇이 닉네임을 가져오지 못하는 경우**
1. **권한 확인**:
   - 봇 역할(Role)에 `Read Message History`와 `Manage Threads`가 활성화되었는지 확인.
2. **`message.member`가 null인 경우**:
   - 메시지가 DM 또는 봇의 권한 부족으로 인해 발생할 수 있음.

### **메시지가 전달되지 않는 경우**
1. **봇 토큰 확인**:
   - `.env` 파일에 올바른 `DISCORD_BOT_TOKEN`이 설정되었는지 확인.
2. **채널 ID 확인**:
   - `.env` 파일에 `DISCORD_CHANNEL_ID`가 올바르게 설정되었는지 확인.

