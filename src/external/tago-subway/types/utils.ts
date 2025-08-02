export function getCodeKeyByValue<T extends Record<string, any>>(object: T, value: T[keyof T]): keyof T | undefined {
  return Object.keys(object).find(key => object[key] === value) as keyof T | undefined;
}

export function getCodeValues<T extends Record<string, any>>(code: T): T[keyof T][] {
  return Object.values(code);
}

export function getCodeKeys<T extends Record<string, any>>(code: T): (keyof T)[] {
  return Object.keys(code) as (keyof T)[];
}

/**
 * 지하철역 이름을 검색에 적합한 형태로 정규화합니다.
 * "역" 접미사를 제거하고 검색 키워드로 변환합니다.
 * 
 * @param stationName 원본 역 이름
 * @returns 정규화된 역 이름
 * 
 * @example
 * normalizeStationName("강남역") // "강남"
 * normalizeStationName("홍대입구역") // "홍대입구"
 * normalizeStationName("신촌") // "신촌"
 */
export function normalizeStationName(stationName: string): string {
  // "역" 접미사 제거
  let normalized = stationName.replace(/역$/, '');
  
  // 공백 제거 및 앞뒤 공백 정리
  normalized = normalized.trim();
  
  // 빈 문자열이면 원본 반환
  if (normalized === '') {
    return stationName;
  }
  
  return normalized;
}

/**
 * 역 이름 정규화 후 검색을 수행하는 헬퍼 함수
 * 
 * @param originalName 원본 역 이름
 * @param searchFunction 검색 함수
 * @returns 검색 결과
 */
export async function searchStationWithNormalization<T>(
  originalName: string,
  searchFunction: (normalizedName: string) => Promise<T>
): Promise<T> {
  const normalizedName = normalizeStationName(originalName);
  return await searchFunction(normalizedName);
} 