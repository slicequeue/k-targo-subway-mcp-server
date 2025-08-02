/**
 * 요일구분코드
 */
export const DailyTypeCode = {
  /** 평일 */
  WEEKDAY: '01',
  /** 토요일 */
  SATURDAY: '02',
  /** 일요일(공휴일) */
  SUNDAY: '03',
} as const;

export type DailyTypeCodeValue = typeof DailyTypeCode[keyof typeof DailyTypeCode];

/**
 * 상하행구분코드
 */
export const UpDownTypeCode = {
  /** 상행 - 서울방향 */
  UP: 'U',
  /** 하행 - 서울반대방향 */
  DOWN: 'D',
} as const;

export type UpDownTypeCodeValue = typeof UpDownTypeCode[keyof typeof UpDownTypeCode]; 