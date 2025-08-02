import { runAllTests, testSpecificStation } from './external-test';

/**
 * 테스트 실행 메인 함수
 */
async function main() {
  const args = process.argv.slice(2);
  
  console.log('🚇 지하철 API 테스트 도구\n');
  
  if (args.length === 0) {
    // 기본 통합 테스트 실행
    console.log('기본 통합 테스트를 실행합니다...\n');
    await runAllTests();
  } else if (args[0] === 'station' && args[1]) {
    // 특정 역 테스트
    const stationName = args[1];
    console.log(`"${stationName}" 역 테스트를 실행합니다...\n`);
    await testSpecificStation(stationName);
  } else {
    console.log('사용법:');
    console.log('  npm run test                    # 기본 통합 테스트');
    console.log('  npm run test station "강남"     # 특정 역 테스트');
    console.log('');
    console.log('예시:');
    console.log('  npm run test station "홍대입구"');
    console.log('  npm run test station "신촌"');
  }
}

// 환경변수 확인
if (!process.env.GOV_API_KEY) {
  console.error('❌ GOV_API_KEY 환경변수가 설정되지 않았습니다.');
  console.log('다음과 같이 환경변수를 설정해주세요:');
  console.log('  export GOV_API_KEY="your_api_key_here"');
  console.log('  또는 .env 파일에 GOV_API_KEY=your_api_key_here 추가');
  process.exit(1);
}

// 테스트 실행
main().catch(error => {
  console.error('❌ 테스트 실행 중 오류 발생:', error);
  process.exit(1);
}); 