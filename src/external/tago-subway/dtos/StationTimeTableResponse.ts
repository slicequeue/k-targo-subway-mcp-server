import { StationTimeTableItem } from './StationTimeTableItem';
import { DailyTypeCodeValue, UpDownTypeCodeValue } from '../types/codes';

export interface ExtendedPagingInfo {
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  filteredNumOfRows?: number;
  filterNonArrive?: boolean;
}

export interface StationTimeTableResponseData {
  dailyTypeCode: DailyTypeCodeValue;
  upDownTypeCode: UpDownTypeCodeValue;
  data: StationTimeTableItem[];
  paging: ExtendedPagingInfo;
}

export class StationTimeTableResponse {
  public dailyTypeCode: DailyTypeCodeValue;
  public upDownTypeCode: UpDownTypeCodeValue;
  public data: StationTimeTableItem[];
  public paging: ExtendedPagingInfo;

  constructor({
    dailyTypeCode,
    upDownTypeCode,
    data,
    paging,
  }: StationTimeTableResponseData) {
    this.dailyTypeCode = dailyTypeCode;
    this.upDownTypeCode = upDownTypeCode;
    this.data = data;
    this.paging = paging;
  }
} 