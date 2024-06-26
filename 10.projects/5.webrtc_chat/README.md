# 기본이론
## 참고자료
  https://web.dev/articles/webrtc-basics?hl=ko

# 1.simple_p2p
- 서버 없이 클라이언트에서 p2p 연결
- index.html 파일을 서빙해줄 서버만 있으면 됨

    ```bash
    python -m http.server 8000
    ```
    또는
    ```bash
    node server.js
    ```

# 2.signaling_server
  - 세션관리를 위한 데이터 처리만 담당 (실제 영상 데이터는 여전히 p2p)

  1. Sent message to client
        ```bash
        {
            "candidate": {
                "candidate": "candidate:2782310545 1 tcp 1518214911 192.168.58.1 9 typ host tcptype active generation 0 ufrag B9fB network-id 2",
                "sdpMid": "0",
                "sdpMLineIndex": 0,
                "usernameFragment": "B9fB"
            }
        }
        ```

  2. Received message
        ```bash
        {
            "candidate": {
                "candidate": "candidate:2445211240 1 tcp 1518149375 192.168.10.1 9 typ host tcptype active generation 0 ufrag B9fB network-id 3",
                "sdpMid": "0",
                "sdpMLineIndex": 0,
                "usernameFragment": "B9fB"
            }
        }
        ```

## 메세지 파싱
  - candidate: 이 필드는 ICE 후보 정보를 포함합니다. 후보 정보는 네트워크 경로를 설명합니다.
    - candidate:2782310545: 후보의 ID입니다.
    - 1 tcp 1518214911: 후보의 구성 요소와 우선 순위를 나타냅니다.
    - 192.168.58.1 9: 후보의 IP 주소와 포트 번호입니다.
    - typ host: 후보의 유형입니다. 이 경우, host는 로컬 네트워크 후보임을 나타냅니다.
    - tcptype active: TCP 타입과 상태를 나타냅니다.
    - generation 0: ICE 후보 생성 번호입니다.
    - ufrag B9fB: 사용자 프래그먼트, ICE 연결의 인증에 사용됩니다.
    - network-id 2: 네트워크 ID를 나타냅니다.
  - sdpMid: 해당 후보가 속한 미디어 스트림의 식별자입니다.
  - sdpMLineIndex: 해당 후보가 속한 미디어 스트림의 라인 인덱스입니다.
  - usernameFragment: ICE 연결의 인증에 사용되는 사용자 프래그먼트입니다.

## 동작 설명
1. ICE 후보 생성 및 전송:
   - 피어 A는 자신의 네트워크 인터페이스에서 사용할 수 있는 ICE 후보를 생성합니다.
   - 이 후보는 피어 A의 네트워크 경로 정보 (예: IP 주소, 포트, 타입)를 포함합니다.
   - 피어 A는 이 후보를 시그널링 서버를 통해 피어 B에게 전송합니다.
   - 콘솔에 출력된 "Sent message to client"는 피어 A가 피어 B에게 후보를 전송했음을 나타냅니다.

2. ICE 후보 수신 및 처리:
   - 피어 B는 시그널링 서버를 통해 피어 A로부터 ICE 후보를 수신합니다.
   - 피어 B는 이 후보를 자신의 RTCPeerConnection 객체에 추가하여 후보를 처리합니다.
   - 콘솔에 출력된 "Received message"는 피어 B가 피어 A로부터 후보를 수신했음을 나타냅니다.

## STUN 서버
STUN (Session Traversal Utilities for NAT) 서버는 NAT(Network Address Translation) 및 방화벽을 통해 공용 IP 주소를 확인하는 데 사용됩니다. 이를 통해 피어 간의 직접 연결을 설정하는 데 도움이 됩니다. 일반적으로 WebRTC 프로젝트에서는 공용 STUN 서버를 사용합니다.

### STUN 서버 주소
Google의 공용 STUN 서버 주소를 예제로 자주 사용합니다:

    ```bash
    stun:stun.l.google.com:19302
    ```

## STUN 서버 직접 설치
Google의 공용 STUN 서버 (stun:stun.l.google.com:19302)는 개발 및 테스트 용도로 널리 사용되지만, 프로덕션 환경에서 사용할 때는 주의가 필요합니다. Google의 STUN 서버는 공식적으로 공개되어 있지 않으며, 따라서 상업적 용도로 무제한 사용이 보장되지 않습니다.

### STUN 서버 사용에 대한 권장 사항
#### 개발 및 테스트 용도:

개발 및 테스트 단계에서는 Google의 공용 STUN 서버를 사용해도 큰 문제가 없습니다. 많은 개발자들이 이를 사용하여 WebRTC 애플리케이션을 개발하고 테스트합니다.

#### 프로덕션 환경:

프로덕션 환경에서는 자체 STUN/TURN 서버를 설정하거나, 신뢰할 수 있는 STUN/TURN 서버 제공업체를 이용하는 것이 좋습니다. 이를 통해 안정적이고 신뢰할 수 있는 서비스를 보장할 수 있습니다.

### STUN/TURN 서버 제공업체
여러 STUN/TURN 서버 제공업체가 있으며, 상업적 용도로 사용할 수 있는 안정적인 서비스를 제공합니다. 다음은 몇 가지 예입니다:

- Twilio: Twilio는 STUN 및 TURN 서버 서비스를 제공합니다. https://www.twilio.com/stun-turn
- Xirsys: Xirsys는 다양한 WebRTC 관련 서비스를 제공하며, STUN 및 TURN 서버도 포함됩니다. https://www.xirsys.com/
- Coturn: Coturn은 오픈 소스 STUN/TURN 서버 프로젝트로, 자체 서버를 설정할 수 있습니다. https://github.com/coturn/coturn

#### Coturn 설치 예제
Coturn을 사용하여 자체 STUN/TURN 서버를 설정하는 방법을 간단히 소개하겠습니다.

##### Coturn 설치 및 설정
- 설치:

Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install coturn
```

- 설정:
```bash
/etc/turnserver.conf 파일을 편집하여 기본 설정을 변경합니다. 예를 들어:
plaintext
코드 복사
listening-port=3478
fingerprint
use-auth-secret
static-auth-secret=mysecret
realm=myrealm
total-quota=100
bps-capacity=0
stale-nonce
log-file=/var/log/turnserver/turn.log
no-loopback-peers
no-multicast-peers
```

필요한 설정에 따라 설정 파일을 조정합니다.

- 서버 시작:

Coturn 서버를 시작합니다.
```bash
sudo service coturn start
```

- 클라이언트 코드에서 Coturn 서버 사용

설치한 Coturn 서버를 클라이언트 코드에 설정합니다.

```javascript
function createPeerConnection() {
    // 자체 STUN/TURN 서버 사용
    const servers = {
        iceServers: [
            { urls: 'stun:your-stun-server.com:3478' },
            { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
        ]
    };
    pc = new RTCPeerConnection(servers);

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            signalingSocket.send(JSON.stringify({ candidate }));
            console.log('Sent candidate');
        }
    };

    pc.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
        console.log('Received remote stream');
    };
}
```

#### 요약
Google의 공용 STUN 서버는 개발 및 테스트 용도로 사용하기 적합하지만, 프로덕션 환경에서는 자체 STUN/TURN 서버를 설정하거나 신뢰할 수 있는 제공업체를 사용하는 것이 좋습니다.
Coturn과 같은 오픈 소스 프로젝트를 사용하면 자체 STUN/TURN 서버를 설정할 수 있습니다.
