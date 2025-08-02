# Node.js MCP SDK Boilerplate

Model Context Protocol (MCP) 서버를 빠르게 개발할 수 있는 Node.js 보일러플레이트입니다.

## 🚀 특징

- **TypeScript** 기반 개발 환경
- **절대 경로 import** (`@` 별칭) 지원
- **MCP Tools & Resources** 구조화된 개발
- **Zod** 스키마 기반 입력 검증
- **모듈화된 구조**로 확장성 보장

## 📁 프로젝트 구조

```
src/
├── config/           # 설정 파일
│   └── index.ts
├── tools/           # MCP 도구들
│   ├── add.ts       # 덧셈 도구
│   ├── multiply.ts  # 곱셈 도구
│   ├── index.ts     # 도구들 통합
│   └── types.ts     # 도구 타입 정의
├── resources/       # MCP 리소스들
│   ├── greeting.ts  # 인사말 리소스
│   ├── index.ts     # 리소스들 통합
│   └── types.ts     # 리소스 타입 정의
├── utils/           # 유틸리티
│   ├── PackageJsonUtil.ts      # package.json 관리
│   ├── ResponseUtil.ts         # 응답 유틸리티
│   └── PackageJsonUtil.example.ts
└── index.ts         # 메인 진입점
```

## 🛠️ 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 📝 새로운 도구 추가하기

### 1. 도구 파일 생성
`src/tools/` 디렉토리에 새 도구 파일을 생성합니다.

```typescript
// src/tools/divide.ts
import { z } from "zod";
import { ResponseUtil } from "@/utils/ResponseUtil";
import { MCPTool } from "@/tools/types";

export const divideTool: MCPTool<{
  a: z.ZodNumber;
  b: z.ZodNumber;
}> = {
  name: 'divide',
  description: '두 수를 나눕니다',
  inputSchema: {
    a: z.number().describe('피제수'),
    b: z.number().describe('제수')
  },
  handler: async (args: { a: number; b: number }, extra: any) => {
    const { a, b } = args;

    if (b === 0) {
      return ResponseUtil.error('0으로 나눌 수 없습니다.');
    }

    const result = a / b;

    return ResponseUtil.data('나눗셈 결과', {
      '피제수': a,
      '제수': b,
      '결과': result
    });
  }
};
```

### 2. 도구 등록
`src/tools/index.ts`에 새 도구를 추가합니다.

```typescript
import { divideTool } from '@/tools/divide';

export const tools: ToolsContainer = {
  add: addTool,
  multiply: multiplyTool,
  divide: divideTool  // 새 도구 추가
};

export { addTool, multiplyTool, divideTool }
```

## 📝 새로운 리소스 추가하기

### 1. 리소스 파일 생성
`src/resources/` 디렉토리에 새 리소스 파일을 생성합니다.

```typescript
// src/resources/weather.ts
import { MCPResource } from "@/resources/types";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export const weatherResource: MCPResource = {
  name: 'weather',
  description: '날씨 정보를 제공하는 리소스',
  template: new ResourceTemplate('weather://{city}', {
    list: undefined
  }),
  handler: async (uri: URL, params: Record<string, string | string[]>) => {
    const city = (params.city as string) || '서울';
    
    const weatherInfo = `현재 ${city}의 날씨는 맑습니다.`;
    
    return {
      contents: [{
        uri: uri.href,
        text: weatherInfo,
        mimeType: 'text/plain'
      }]
    };
  }
};
```

### 2. 리소스 등록
`src/resources/index.ts`에 새 리소스를 추가합니다.

```typescript
import { weatherResource } from '@/resources/weather';

export const resources: ResourcesContainer = {
  greeting: greetingResource,
  weather: weatherResource  // 새 리소스 추가
};

export { greetingResource, weatherResource }
```

## 🔧 설정 파일

### TypeScript 설정 (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/config/*": ["config/*"],
      "@/resources/*": ["resources/*"],
      "@/tools/*": ["tools/*"],
      "@/utils/*": ["utils/*"]
    }
  }
}
```

### 빌드 설정 (`tsup.config.ts`)
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  esbuildOptions(options) {
    options.alias = {
      '@': './src'
    }
  }
})
```

## 📦 유틸리티

### ResponseUtil
도구의 응답을 표준화된 형식으로 생성합니다.

```typescript
import { ResponseUtil } from "@/utils/ResponseUtil";

// 성공 응답
return ResponseUtil.data('작업 완료', {
  '결과': '성공'
});

// 오류 응답
return ResponseUtil.error('오류가 발생했습니다.');
```

### PackageJsonUtil
package.json 정보에 접근할 수 있습니다.

```typescript
import { PackageJsonUtil } from "@/utils/PackageJsonUtil";

const pkgUtil = PackageJsonUtil.getInstance();
console.log('프로젝트 이름:', pkgUtil.getName());
console.log('프로젝트 버전:', pkgUtil.getVersion());
```

## 🎯 사용 예제

### 도구 사용
```typescript
// 덧셈 도구
const result = await addTool.handler({ a: 5, b: 3 }, {});
// 결과: { success: true, data: { '첫 번째 숫자': 5, '두 번째 숫자': 3, '결과': 8 } }

// 곱셈 도구
const result = await multiplyTool.handler({ a: 4, b: 6 }, {});
// 결과: { success: true, data: { '첫 번째 숫자': 4, '두 번째 숫자': 6, '결과': 24 } }
```

### 리소스 사용
```typescript
// 인사말 리소스
const greetingUri = new URL('greeting://홍길동');
const result = await greetingResource.handler(greetingUri, { name: '홍길동' });
// 결과: { contents: [{ uri: 'greeting://홍길동', text: '좋은 오후에요, 홍길동님!', mimeType: 'text/plain' }] }
```

## 🔄 개발 워크플로우

1. **새 기능 추가**: `src/tools/` 또는 `src/resources/`에 새 파일 생성
2. **타입 정의**: `types.ts` 파일에서 필요한 타입 추가
3. **등록**: `index.ts` 파일에 새 기능 등록
4. **테스트**: 개발 서버로 테스트
5. **빌드**: `npm run build`로 빌드

## 📚 주요 개념

### MCP Tool
사용자가 호출할 수 있는 함수입니다. 입력 스키마와 핸들러 함수로 구성됩니다.

### MCP Resource
URI 기반의 리소스입니다. 템플릿과 핸들러로 구성됩니다.

### 절대 경로 Import
`@` 별칭을 사용하여 깔끔한 import 경로를 제공합니다.
- `@/utils/ResponseUtil` - 유틸리티
- `@/tools/types` - 도구 타입
- `@/resources/types` - 리소스 타입

## 🚀 배포

```bash
# 빌드
npm run build

# 실행
node dist/index.js
```

## 📄 라이선스

MIT License 