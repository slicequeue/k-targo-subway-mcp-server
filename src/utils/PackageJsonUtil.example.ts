import { PackageJsonUtil } from '@/utils/PackageJsonUtil';

// 사용 예제
export function exampleUsage() {
  const pkgUtil = PackageJsonUtil.getInstance();

  // 기본 정보 가져오기
  console.log('프로젝트 이름:', pkgUtil.getName());
  console.log('프로젝트 버전:', pkgUtil.getVersion());
  console.log('프로젝트 타입:', pkgUtil.getType());
  console.log('메인 진입점:', pkgUtil.getMain());
  console.log('작성자:', pkgUtil.getAuthor());
  console.log('라이선스:', pkgUtil.getLicense());

  // 스크립트 정보
  const scripts = pkgUtil.getScripts();
  console.log('사용 가능한 스크립트:', Object.keys(scripts || {}));
  
  const buildScript = pkgUtil.getScript('build');
  console.log('빌드 스크립트:', buildScript);

  // 의존성 정보
  const dependencies = pkgUtil.getDependencies();
  const devDependencies = pkgUtil.getDevDependencies();
  
  console.log('의존성 개수:', Object.keys(dependencies || {}).length);
  console.log('개발 의존성 개수:', Object.keys(devDependencies || {}).length);

  // 특정 의존성 버전 확인
  const axiosVersion = pkgUtil.getDependencyVersion('axios');
  console.log('axios 버전:', axiosVersion);

  const typescriptVersion = pkgUtil.getDevDependencyVersion('typescript');
  console.log('TypeScript 버전:', typescriptVersion);

  // 모든 의존성 이름
  const allDependencyNames = pkgUtil.getAllDependencyNames();
  console.log('모든 의존성:', allDependencyNames);

  // 프로젝트 요약 정보
  const summary = pkgUtil.getSummary();
  console.log('프로젝트 요약:', summary);

  // package.json 파일 경로
  console.log('package.json 경로:', pkgUtil.getPackageJsonPath());
}

// 직접 실행 시 예제 실행
if (require.main === module) {
  exampleUsage();
} 