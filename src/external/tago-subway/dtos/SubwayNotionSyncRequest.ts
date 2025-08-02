import { DailyTypeCode, UpDownTypeCode } from "../types/codes";
import { getCodeKeys } from "../types/utils";

export interface SubwayRequestData {
  stationId: string;
  dailyCode: keyof typeof DailyTypeCode;
  upDownCode: keyof typeof UpDownTypeCode;
}

export class SubwayRequest {
  public stationId: string;
  public dailyCode: string;
  public upDownCode: string;

  constructor({ stationId, dailyCode, upDownCode }: SubwayRequestData) {
    this.stationId = stationId;
    this.dailyCode = DailyTypeCode[dailyCode];        // dailyCode key to value
    this.upDownCode = UpDownTypeCode[upDownCode];     // upDownCode key to value
  }

  static validate() {
    return [
      // body('subway.stationId').isString(),
      // body('subway.dailyCode').isString().isIn(getCodeKeys(DailyTypeCode)),
      // body('subway.upDownCode').isString().isIn(getCodeKeys(UpDownTypeCode)),
    ]
  }

  static validateEssential() {
    return [
      // body('subway.stationId').isString(),
    ]
  }
}

export interface NotionRequestData {
  databaseId: string;
}

export class NotionRequest {
  public databaseId: string;

  constructor({ databaseId }: NotionRequestData) {
    this.databaseId = databaseId;
  }

  static validate() {
    return [
      // body('notion.databaseId').isString()
    ]
  }
}

export interface SubwayNotionSyncRequestData {
  subway: SubwayRequestData;
  notion: NotionRequestData;
}

export class SubwayNotionSyncRequest {
  public subway: SubwayRequest;
  public notion: NotionRequest;

  constructor({
    subway,
    notion,
  }: SubwayNotionSyncRequestData) {
    this.subway = new SubwayRequest(subway);
    this.notion = new NotionRequest(notion);
  }

  static validate() {
    return [
      // body('subway').isObject(),
      ...SubwayRequest.validate(),
      // body('notion').isObject(),
      ...NotionRequest.validate()
    ]
  }

  static validateEssential() {
    return [
      // body('subway').isObject(),
      ...SubwayRequest.validateEssential(),
      // body('notion').isObject(),
      ...NotionRequest.validate()
    ]
  }
} 