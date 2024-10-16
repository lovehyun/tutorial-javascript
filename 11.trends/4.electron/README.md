# Electron 앱개발
1. Electron 설치: Node.js 기반 프로젝트를 생성하고 npm install electron으로 설치.
2. 프로젝트 구조 생성: 메인 프로세스(main.js)와 렌더러 프로세스(index.html) 파일 생성.
3. Electron 실행: npm start 명령으로 애플리케이션을 실행.
4. 멀티 플랫폼: 한 번의 코드로 Windows, macOS, Linux에서 실행 가능한 애플리케이션을 배포.

# Electron 앱빌드
## 1. Electron Builder 설치
터미널에서 다음 명령어로 Electron Builder를 설치합니다:

```bash
npm install --save-dev electron-builder
```

## 2. package.json 설정
package.json 파일에 Electron Builder의 설정을 추가하여 앱을 빌드하고 패키징할 수 있도록 합니다.

package.json 파일을 다음과 같이 수정합니다:

```json
코드 복사
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "build": {
    "appId": "com.mycompany.myapp",
    "productName": "MyElectronApp",
    "files": [
      "main.js",
      "index.html",
      "renderer.js",
      "style.css",
      "preload.js"
    ],
    "mac": {
      "category": "public.app-category.productivity"
    },
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": [
        "AppImage",
        "deb"
      ],
      "category": "Utility"
    }
  },
  "devDependencies": {
    "electron": "^26.0.0",
    "electron-builder": "^24.0.0"
  }
}
```
### package.json 설명:
- appId: 앱의 고유한 식별자입니다. 보통 도메인 형식으로 작성합니다.
- productName: 애플리케이션의 이름으로, 빌드된 실행 파일에 표시됩니다.
- files: 빌드에 포함될 파일 목록입니다. 앱에서 사용하는 파일들을 지정합니다.
- mac, win, linux: 각각 macOS, Windows, Linux용으로 빌드할 때의 설정입니다. 아이콘 파일(.ico, .icns 파일) 등을 지정할 수 있습니다.
- scripts:
- pack: 앱을 압축하지 않고 디렉토리로 패키징합니다.
- dist: 앱을 패키징하고, 설치 가능한 실행 파일을 만듭니다.

## 3. 아이콘 추가
앱에 맞는 아이콘 파일을 추가할 수 있습니다. Windows용 .ico 파일, macOS용 .icns 파일을 준비해야 합니다. 이 파일들은 build 디렉토리에 위치시키고, package.json에 경로를 지정합니다.

예시:
```
Windows 아이콘: build/icon.ico
macOS 아이콘: build/icon.icns
```

## 4. 앱 빌드
이제 애플리케이션을 패키징할 수 있습니다.

### 4.1 모든 플랫폼용으로 빌드하기
```bash
npm run dist
```
이 명령은 Windows, macOS, Linux용 설치 파일을 생성합니다. 각 플랫폼에 맞는 실행 파일이 dist/ 폴더에 생성됩니다.

### 4.2 특정 플랫폼용으로 빌드하기
운영 체제에 맞는 설치 파일을 생성하려면 해당 명령어를 실행합니다.

Windows용(NSIS 설치 파일):
```bash
npm run dist -- -w
```
macOS용(.dmg 파일):
```bash
npm run dist -- -m
```
Linux용(AppImage, .deb 파일):
```bash
npm run dist -- -l
```

## 5. 빌드된 파일 배포

빌드가 완료되면 dist/ 폴더에 각 플랫폼용 설치 파일이 생성됩니다.

- Windows: .exe 또는 .msi 설치 파일이 생성됩니다.
- macOS: .dmg 또는 .pkg 파일이 생성됩니다.
- Linux: .AppImage, .deb 등의 설치 파일이 생성됩니다.

이 설치 파일들을 사용자가 다운로드하고 설치할 수 있도록 웹사이트에 업로드하거나, 소프트웨어 배포 플랫폼(예: GitHub Releases, S3, 또는 각 운영 체제별 패키지 매니저)에 업로드할 수 있습니다.

### Electron Builder의 주요 기능
- 자동 업데이트: Electron Builder는 자동 업데이트를 지원합니다. 앱이 배포된 후 새로운 - 버전을 배포할 때 사용자는 앱 내에서 자동으로 업데이트를 받을 수 있습니다.
- 다중 플랫폼 지원: 한 번의 설정으로 Windows, macOS, Linux 설치 파일을 모두 생성할 수 있습니다.
- 아이콘 설정: 플랫폼에 맞는 아이콘을 쉽게 설정할 수 있습니다.
- 서명 및 인증: macOS나 Windows에서 앱을 서명하여 배포할 수 있습니다.

## 6. 자동 업데이트 설정
Electron Builder를 사용해 자동 업데이트 기능을 추가할 수 있습니다. 이 기능을 통해 사용자는 새로운 버전이 배포될 때 앱 내에서 자동으로 업데이트할 수 있습니다.

GitHub Releases나 S3와 같은 원격 서버에 앱 업데이트 파일을 호스팅합니다.
앱이 시작될 때 원격 서버에서 최신 버전을 확인하고, 새로운 버전이 있을 경우 자동으로 다운로드하여 설치합니다.

package.json 설정에 업데이트 URL 추가:

```json
"build": {
  "publish": [
    {
      "provider": "github",
      "owner": "your-github-username",
      "repo": "your-repo-name"
    }
  ]
}
```

이 설정은 GitHub Releases에서 업데이트를 확인하고, 새 버전이 있을 경우 자동으로 업데이트합니다.
