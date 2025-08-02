import { getSubwayList, getStationTimetable, getStationAllArgsTimetable } from '../src/external/tago-subway/service';
import { DailyTypeCode, UpDownTypeCode } from '../src/external/tago-subway/types/codes';
import { normalizeStationName } from '../src/external/tago-subway/types/utils';

/**
 * 지하철 API 테스트 함수들
 * 실제 API 호출을 통해 기능을 테스트합니다.
 */

export async function testSearchSubwayStation() {
  console.log('🚇 지하철역 검색 테스트 시작...\n');
  
  try {
    // 강남역 검색 테스트
    const result = await getSubwayList('강남', 1, 5);
    
    console.log('✅ 검색 성공!');
    console.log(`총 ${result.paging.totalCount}개 역 발견`);
    console.log('\n📋 검색 결과:');
    
    result.data.forEach((station, index) => {
      console.log(`${index + 1}. ${station.stationName} (${station.routeName})`);
      console.log(`   역 ID: ${station.stationId}`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ 검색 실패:', error);
    throw error;
  }
}

export async function testGetStationTimetable(stationId: string) {
  console.log(`\n🚇 지하철 시간표 조회 테스트 시작... (역 ID: ${stationId})\n`);
  
  try {
    // 평일 상행 시간표 조회
    const result = await getStationTimetable(
      stationId,
      DailyTypeCode.WEEKDAY,
      UpDownTypeCode.UP,
      1,
      10,
      true
    );
    
    console.log('✅ 시간표 조회 성공!');
    console.log(`역명: ${result.data[0]?.subwayStationNm || '알 수 없음'}`);
    console.log(`요일: 평일, 방향: 상행(서울방향)`);
    console.log(`총 ${result.data.length}개 열차`);
    
    console.log('\n📋 시간표 (처음 5개):');
    result.data.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.arrTime} 도착 → ${item.depTime} 출발`);
      console.log(`   종점: ${item.endSubwayStationNm}`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ 시간표 조회 실패:', error);
    throw error;
  }
}

export async function testGetAllTimetables(stationId: string) {
  console.log(`\n🚇 전체 시간표 조회 테스트 시작... (역 ID: ${stationId})\n`);
  
  try {
    const results = await getStationAllArgsTimetable(
      stationId,
      1,
      20, // 각 조합당 20개씩만 조회
      true,
      500 // 0.5초 지연
    );
    
    console.log('✅ 전체 시간표 조회 성공!');
    console.log(`총 ${results.length}개 조합`);
    
    console.log('\n📋 조합별 요약:');
    results.forEach((result, index) => {
      const dailyText = {
        '01': '평일',
        '02': '토요일',
        '03': '일요일'
      }[result.dailyTypeCode] || result.dailyTypeCode;
      
      const upDownText = {
        'U': '상행',
        'D': '하행'
      }[result.upDownTypeCode] || result.upDownTypeCode;
      
      console.log(`${index + 1}. ${dailyText} ${upDownText}: ${result.data.length}개 열차`);
    });
    
    return results;
  } catch (error) {
    console.error('❌ 전체 시간표 조회 실패:', error);
    throw error;
  }
}

/**
 * 통합 테스트 함수
 */
export async function runAllTests() {
  console.log('🧪 지하철 API 통합 테스트 시작\n');
  console.log('=' .repeat(50));
  
  try {
    // 1. 지하철역 검색 테스트
    const searchResult = await testSearchSubwayStation();
    
    if (searchResult.data.length > 0) {
      const firstStation = searchResult.data[0];
      
      // 2. 첫 번째 역의 시간표 조회 테스트
      await testGetStationTimetable(firstStation.stationId);
      
      // 3. 첫 번째 역의 전체 시간표 조회 테스트
      await testGetAllTimetables(firstStation.stationId);
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 모든 테스트 완료!');
    
  } catch (error) {
    console.error('\n❌ 테스트 실패:', error);
    throw error;
  }
}

/**
 * 개별 테스트 실행 함수들
 */
export async function testSpecificStation(stationName: string) {
  console.log(`\n🔍 "${stationName}" 역 상세 테스트\n`);
  
  try {
    // 1. 역 검색
    const searchResult = await getSubwayList(stationName, 1, 5);
    
    if (searchResult.data.length === 0) {
      console.log(`❌ "${stationName}" 역을 찾을 수 없습니다.`);
      return;
    }
    
    const station = searchResult.data[0];
    console.log(`✅ "${station.stationName}" 역 발견 (${station.routeName})`);
    console.log(`역 ID: ${station.stationId}\n`);
    
    // 2. 시간표 조회
    await testGetStationTimetable(station.stationId);
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    throw error;
  }
} 

/**
 * 역 이름 정규화 테스트
 */
export async function testStationNameNormalization() {
  console.log('🔍 역 이름 정규화 테스트 시작...\n');
  
  const testCases = [
    '강남역',
    '홍대입구역', 
    '신촌',
    '강남',
    '홍대입구',
    '강남역역', // 중복된 '역' 접미사
    '역', // '역'만 있는 경우
    '  강남역  ', // 공백 포함
    ''
  ];
  
  console.log('📋 정규화 테스트 결과:');
  testCases.forEach(testCase => {
    const normalized = normalizeStationName(testCase);
    const changed = testCase !== normalized;
    const status = changed ? '✅ 변환됨' : '➡️ 동일';
    console.log(`${status} "${testCase}" → "${normalized}"`);
  });
  
  console.log('\n🧪 실제 검색 테스트:');
  
  // 실제 검색 테스트
  const searchTests = ['강남역', '홍대입구역', '신촌'];
  
  for (const testCase of searchTests) {
    try {
      const normalized = normalizeStationName(testCase);
      const result = await getSubwayList(normalized, 1, 3);
      
      console.log(`\n🔍 "${testCase}" → "${normalized}" 검색 결과:`);
      if (result.data.length > 0) {
        result.data.forEach((station, index) => {
          console.log(`  ${index + 1}. ${station.stationName} (${station.routeName})`);
        });
      } else {
        console.log(`  ❌ 검색 결과 없음`);
      }
    } catch (error) {
      console.error(`  ❌ "${testCase}" 검색 실패:`, error);
    }
  }
} 