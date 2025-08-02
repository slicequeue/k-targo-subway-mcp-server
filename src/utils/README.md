# PackageJsonUtil 클래스

package.json 파일의 정보를 쉽게 읽어올 수 있는 유틸리티 클래스입니다.

## 특징

- **싱글톤 패턴**: 메모리 효율성을 위해 싱글톤 패턴을 사용합니다.
- **캐싱**: 한 번 읽은 package.json 데이터를 캐시하여 성능을 최적화합니다.
- **타입 안전성**: TypeScript로 작성되어 타입 안전성을 보장합니다.
- **에러 처리**: 파일 읽기 실패 시 적절한 에러 메시지를 제공합니다.

## 사용법

### 기본 사용법

```typescript
import { PackageJsonUtil } from './utils/PackageJsonUtil';

const pkgUtil = PackageJsonUtil.getInstance();

// 프로젝트 기본 정보
console.log(pkgUtil.getName());        // "mcp-using-sdk-boilerplate"
console.log(pkgUtil.getVersion());     // "1.0.0"
console.log(pkgUtil.getType());        // "module"
console.log(pkgUtil.getAuthor());      // "slicequeue"
console.log(pkgUtil.getLicense());     // "ISC"
```

### 스크립트 정보

```typescript
// 모든 스크립트 가져오기
const scripts = pkgUtil.getScripts();
console.log(scripts); // { build: "tsup", start: "node dist/index.js", ... }

// 특정 스크립트 가져오기
const buildScript = pkgUtil.getScript('build');
console.log(buildScript); // "tsup"
```

### 의존성 정보

```typescript
// 의존성 정보
const dependencies = pkgUtil.getDependencies();
const devDependencies = pkgUtil.getDevDependencies();

// 특정 의존성 버전 확인
const axiosVersion = pkgUtil.getDependencyVersion('axios');
console.log(axiosVersion); // "^1.10.0"

const typescriptVersion = pkgUtil.getDevDependencyVersion('typescript');
console.log(typescriptVersion); // "^5.8.3"

// 의존성 이름 목록
const dependencyNames = pkgUtil.getDependencyNames();
const devDependencyNames = pkgUtil.getDevDependencyNames();
const allDependencyNames = pkgUtil.getAllDependencyNames();
```

### 프로젝트 요약

```typescript
const summary = pkgUtil.getSummary();
console.log(summary);
// {
//   name: "mcp-using-sdk-boilerplate",
//   version: "1.0.0",
//   description: "",
//   author: "slicequeue",
//   license: "ISC",
//   dependenciesCount: 4,
//   devDependenciesCount: 8
// }
```

### 데이터 새로고침

package.json 파일이 변경되었을 때 캐시된 데이터를 새로고침할 수 있습니다.

```typescript
pkgUtil.refresh(); // 캐시된 데이터를 지우고 다시 읽어옵니다
```

## API 참조

### 메서드 목록

#### 기본 정보
- `getName()`: 프로젝트 이름 반환
- `getVersion()`: 프로젝트 버전 반환
- `getType()`: 프로젝트 타입 반환
- `getMain()`: 메인 진입점 반환
- `getBin()`: 바이너리 설정 반환
- `getAuthor()`: 작성자 반환
- `getLicense()`: 라이선스 반환
- `getDescription()`: 설명 반환

#### 스크립트
- `getScripts()`: 모든 스크립트 반환
- `getScript(scriptName)`: 특정 스크립트 반환

#### 의존성
- `getDependencies()`: 일반 의존성 반환
- `getDevDependencies()`: 개발 의존성 반환
- `getDependencyVersion(name)`: 특정 의존성 버전 반환
- `getDevDependencyVersion(name)`: 특정 개발 의존성 버전 반환
- `getAllDependencies()`: 모든 의존성 반환
- `getDependencyNames()`: 의존성 이름 목록 반환
- `getDevDependencyNames()`: 개발 의존성 이름 목록 반환
- `getAllDependencyNames()`: 모든 의존성 이름 목록 반환

#### 유틸리티
- `getPackageJsonPath()`: package.json 파일 경로 반환
- `refresh()`: 캐시된 데이터 새로고침
- `getSummary()`: 프로젝트 요약 정보 반환

## 예제 실행

예제 파일을 실행하여 실제 동작을 확인할 수 있습니다:

```bash
npm run build
node dist/utils/PackageJsonUtil.example.js
``` 