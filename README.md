# 🇰🇷 K-Targo Subway MCP Server
[![smithery badge](https://smithery.ai/badge/@slicequeue/k-targo-subway-mcp-server)](https://smithery.ai/server/@slicequeue/k-targo-subway-mcp-server)

한국 지하철 정보를 제공하는 MCP (Model Context Protocol) 서버입니다.

## 🚇 주요 기능

- **지하철역 검색**: 역명으로 지하철역 정보 검색
- **열차 시간표 조회**: 특정 역의 열차 시간표 조회
- **실시간 지하철 정보**: Tago API를 통한 실시간 데이터 제공
- **MCP 표준 준수**: Model Context Protocol 표준을 따르는 도구 제공

## 🛠️ 설치 및 사용

### Installing via Smithery

To install k-targo-subway-mcp-server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@slicequeue/k-targo-subway-mcp-server):

```bash
npx -y @smithery/cli install @slicequeue/k-targo-subway-mcp-server --client claude
```

### 1. 공공데이터 API 키 설정
이 서버는 **국토교통부_(TAGO)_지하철정보** API를 사용합니다. 사용하기 전에 API 키를 설정해야 합니다.

#### API 정보
- **API 명**: 국토교통부_(TAGO)_지하철정보
- **API URL**: https://www.data.go.kr/data/15098554/openapi.do
- **제공기관**: 국토교통부
- **데이터 형식**: JSON

#### API 키 발급
1. [공공데이터포털](https://www.data.go.kr/)에 가입
2. "국토교통부_(TAGO)_지하철정보" API 신청
3. 승인 후 발급받은 API 키를 환경변수로 설정

#### 환경변수 설정
```bash
# Windows
set GOV_API_KEY=your_api_key_here

# macOS/Linux
export GOV_API_KEY=your_api_key_here

# .env 파일 사용 (권장)
echo "GOV_API_KEY=your_api_key_here" > .env
```

### 2. npx로 즉시 실행 (권장)
```bash
npx k-targo-subway-mcp-server
```

### 3. npm으로 설치
```bash
npm install k-targo-subway-mcp-server
```

### 4. 글로벌 설치
```bash
npm install -g k-targo-subway-mcp-server
```

## 📦 MCP 도구

### 1. 지하철역 검색 (`search_subway_station`)
지하철역명으로 역 정보를 검색합니다.

**입력 파라미터:**
- `stationName` (string): 검색할 역명

**사용 예시:**
```typescript
// "강남" 역 검색
const result = await searchSubwayStationTool.handler({
  stationName: "강남"
}, {});
```

### 2. 열차 시간표 조회 (`get_station_timetable`)
특정 역의 열차 시간표를 조회합니다.

**입력 파라미터:**
- `stationCode` (string): 역 코드
- `direction` (string): 방향 (상행/하행)

**사용 예시:**
```typescript
// 강남역 상행 시간표 조회
const result = await getStationTimetableTool.handler({
  stationCode: "0222",
  direction: "상행"
}, {});
```

## 🏗️ 프로젝트 구조

```
src/
├── config/           # 설정 파일
│   └── index.ts
├── external/         # 외부 API 연동
│   ├── common/       # 공통 유틸리티
│   └── tago-subway/  # Tago 지하철 API
│       ├── api.ts    # API 클라이언트
│       ├── service.ts # 비즈니스 로직
│       ├── dtos/     # 데이터 전송 객체
│       └── types/    # 타입 정의
├── tools/           # MCP 도구들
│   ├── subway.ts    # 지하철 관련 도구
│   ├── index.ts     # 도구들 통합
│   └── types.ts     # 도구 타입 정의
├── utils/           # 유틸리티
│   ├── PackageJsonUtil.ts
│   └── ResponseUtil.ts
└── index.ts         # 메인 진입점
```

## 🔧 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. API 키 설정
```bash
# .env 파일 생성
echo "GOV_API_KEY=your_api_key_here" > .env

# 또는 환경변수로 설정
export GOV_API_KEY=your_api_key_here  # macOS/Linux
set GOV_API_KEY=your_api_key_here     # Windows
```

#### .env 파일 예시
```env
# 국토교통부_(TAGO)_지하철정보 API 키
# 공공데이터포털(https://www.data.go.kr/)에서 발급받은 API 키를 설정하세요
# API URL: https://www.data.go.kr/data/15098554/openapi.do
GOV_API_KEY=your_public_data_api_key_here

# 예시:
# GOV_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

### 5. 테스트
```bash
# 전체 테스트
npm test

# API 테스트
npm run test:api

# 특정 역 테스트
npm run test:api:station
```

## 📡 API 연동

### 국토교통부_(TAGO)_지하철정보 API
- **API 명**: 국토교통부_(TAGO)_지하철정보
- **API URL**: https://www.data.go.kr/data/15098554/openapi.do
- **제공기관**: 국토교통부
- **기본 URL**: `https://api.tago.go.kr`
- **인증**: 공공데이터 API 키 기반 인증 (`GOV_API_KEY` 환경변수)
- **데이터 형식**: JSON
- **API 키 발급**: [공공데이터포털](https://www.data.go.kr/)에서 "국토교통부_(TAGO)_지하철정보" 신청

### 환경변수 설정
```bash
# 필수 환경변수
GOV_API_KEY=your_public_data_api_key_here
```

### 주요 엔드포인트
- `GET /subway-station/search`: 지하철역 검색
- `GET /subway-station/{stationCode}/timetable`: 열차 시간표 조회

## 🎯 사용 예제

### MCP 클라이언트 설정
MCP 클라이언트에서 이 서버를 사용하려면 다음과 같이 설정하세요:

```json
{
  "mcpServers": {
    "k-targo-subway": {
      "command": "npx",
      "args": ["k-targo-subway-mcp-server"],
      "env": {
        "GOV_API_KEY": "your_targo_api_key_here"
      }
    }
  }
}
```

### MCP 클라이언트에서 사용
```typescript
// 지하철역 검색
const searchResult = await mcpClient.callTool('search_subway_station', {
  stationName: '강남'
});

// 시간표 조회
const timetableResult = await mcpClient.callTool('get_station_timetable', {
  stationCode: '0222',
  direction: '상행'
});
```

### CLI에서 직접 실행
```bash
# npx로 실행 (권장)
npx k-targo-subway-mcp-server

# 글로벌 설치 후 실행
k-targo-subway-mcp-server

# 또는 npm 스크립트로 실행
npm start
```

## 🔄 개발 워크플로우

1. **새 기능 추가**: `src/tools/`에 새 도구 파일 생성
2. **API 연동**: `src/external/`에 외부 API 클라이언트 추가
3. **타입 정의**: 필요한 타입들을 정의
4. **테스트**: `test/` 디렉토리에 테스트 코드 작성
5. **빌드 및 배포**: `npm run build` 후 배포

## 📚 주요 개념

### MCP Tool
사용자가 호출할 수 있는 함수입니다. 입력 스키마와 핸들러 함수로 구성됩니다.

### TAGO API
국토교통부에서 제공하는 지하철 정보 API입니다. 공공데이터포털을 통해 제공됩니다.

### 지하철역 코드
각 지하철역은 고유한 코드를 가지고 있습니다 (예: 강남역 = "0222").

## 🚀 배포

```bash
# 빌드
npm run build

# npm 배포
npm publish

# 실행
node dist/index.js
```

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

- **GitHub**: [https://github.com/slicequeue/k-targo-subway-mcp-server](https://github.com/slicequeue/k-targo-subway-mcp-server)
- **Issues**: [https://github.com/slicequeue/k-targo-subway-mcp-server/issues](https://github.com/slicequeue/k-targo-subway-mcp-server/issues)

## 🙏 감사의 말

- [국토교통부_(TAGO)_지하철정보](https://www.data.go.kr/data/15098554/openapi.do) - 지하철 정보 제공
- [공공데이터포털](https://www.data.go.kr/) - API 서비스 제공
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP 표준
- [Node.js](https://nodejs.org) - 런타임 환경 