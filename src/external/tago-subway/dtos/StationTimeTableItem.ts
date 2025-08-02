import { DailyTypeCodeValue, UpDownTypeCodeValue } from '../types/codes';

export interface StationTimeTableItemData {
  arrTime: string;
  dailyTypeCode: DailyTypeCodeValue;
  depTime: string;
  endSubwayStationId: string;
  endSubwayStationNm: string;
  subwayRouteId: string;
  subwayStationId: string;
  subwayStationNm: string;
  upDownTypeCode: UpDownTypeCodeValue;
}

export class StationTimeTableItem {
  public arrTime: string;
  public dailyTypeCode: DailyTypeCodeValue;
  public depTime: string;
  public endSubwayStationId: string;
  public endSubwayStationNm: string;
  public subwayRouteId: string;
  public subwayStationId: string;
  public subwayStationNm: string;
  public upDownTypeCode: UpDownTypeCodeValue;

  constructor({
    arrTime,
    dailyTypeCode,
    depTime,
    endSubwayStationId,
    endSubwayStationNm,
    subwayRouteId,
    subwayStationId,
    subwayStationNm,
    upDownTypeCode,
  }: StationTimeTableItemData) {
    this.arrTime = arrTime;
    this.dailyTypeCode = dailyTypeCode;
    this.depTime = depTime;
    this.endSubwayStationId = endSubwayStationId;
    this.endSubwayStationNm = endSubwayStationNm;
    this.subwayRouteId = subwayRouteId;
    this.subwayStationId = subwayStationId;
    this.subwayStationNm = subwayStationNm;
    this.upDownTypeCode = upDownTypeCode;
  }
} 