# 지하철 API 테스트 도구

이 폴더는 `external/tago-subway` 모듈의 실제 API 호출을 테스트할 수 있는 도구들을 포함합니다.

## 🚀 사용법

### 1. 환경변수 설정

먼저 GOV_API_KEY 환경변수를 설정해야 합니다:

```bash
# Windows
set GOV_API_KEY=your_api_key_here

# macOS/Linux
export GOV_API_KEY=your_api_key_here

# 또는 .env 파일에 추가
echo "GOV_API_KEY=your_api_key_here" >> .env
```

### 2. 테스트 실행

#### 기본 통합 테스트
```bash
npm run test:api
```

#### 특정 역 테스트
```bash
npm run test:api station "강남"
npm run test:api station "홍대입구"
npm run test:api station "신촌"
```

### 3. 직접 실행

```bash
# 기본 테스트
npx tsx src/test/run-test.ts

# 특정 역 테스트
npx tsx src/test/run-test.ts station "강남"
```

## 📋 테스트 내용

### 1. 지하철역 검색 테스트
- 강남역 검색
- 검색 결과 출력
- 역 ID, 역명, 노선 정보 확인

### 2. 시간표 조회 테스트
- 평일 상행 시간표 조회
- 도착/출발 시간 확인
- 종점역 정보 확인

### 3. 전체 시간표 조회 테스트
- 모든 요일/방향 조합 조회
- 6가지 조합 (평일/토요일/일요일 × 상행/하행)
- 각 조합별 열차 수 확인

## 🔧 테스트 함수들

### `testSearchSubwayStation()`
지하철역 검색 기능을 테스트합니다.

### `testGetStationTimetable(stationId)`
특정 역의 시간표 조회를 테스트합니다.

### `testGetAllTimetables(stationId)`
특정 역의 전체 시간표 조회를 테스트합니다.

### `runAllTests()`
모든 테스트를 순차적으로 실행합니다.

### `testSpecificStation(stationName)`
특정 역에 대한 상세 테스트를 실행합니다.

## 📊 예상 출력

```
🚇 지하철 API 테스트 도구

기본 통합 테스트를 실행합니다...

🧪 지하철 API 통합 테스트 시작

==================================================
🚇 지하철역 검색 테스트 시작...

✅ 검색 성공!
총 1개 역 발견

📋 검색 결과:
1. 강남 (2호선)
   역 ID: 222

🚇 지하철 시간표 조회 테스트 시작... (역 ID: 222)

✅ 시간표 조회 성공!
역명: 강남
요일: 평일, 방향: 상행(서울방향)
총 20개 열차

📋 시간표 (처음 5개):
1. 06:00 도착 → 06:02 출발
   종점: 신도림
2. 06:05 도착 → 06:07 출발
   종점: 신도림
...

==================================================
🎉 모든 테스트 완료!
```

## ⚠️ 주의사항

1. **API 키 필요**: GOV_API_KEY 환경변수가 설정되어야 합니다.
2. **네트워크 연결**: 인터넷 연결이 필요합니다.
3. **API 제한**: 공공데이터포털 API 호출 제한이 있을 수 있습니다.
4. **실제 호출**: 실제 API를 호출하므로 테스트 시 주의하세요.

## 🐛 문제 해결

### API 키 오류
```
❌ GOV_API_KEY 환경변수가 설정되지 않았습니다.
```
→ 환경변수를 올바르게 설정하세요.

### 네트워크 오류
```
❌ 검색 실패: Network Error
```
→ 인터넷 연결을 확인하세요.

### API 제한 오류
```
❌ 검색 실패: API 호출 한도 초과
```
→ 잠시 후 다시 시도하세요. 