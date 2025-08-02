import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

export interface Config {
  // API 키 설정 (필요시 주석 해제)
  // api: {
  //   key: string;
  // };
  log: {
    level: string;
  };
}

// 환경변수 검증 함수
function validateConfig(): Config {
  // API 키 검증 (필요시 주석 해제)
  // const apiKey = process.env.API_KEY;
  // if (!apiKey) {
  //   throw new Error('API_KEY 환경변수가 설정되지 않았습니다.');
  // }

  return {
    // API 키 반환 (필요시 주석 해제)
    // api: {
    //   key: apiKey,
    // },
    log: {
      level: process.env.LOG_LEVEL || 'info',
    },
  };
}

// 설정 객체 export
export const config: Config = validateConfig(); 