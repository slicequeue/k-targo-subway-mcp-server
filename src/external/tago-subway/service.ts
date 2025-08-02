import { SearchSubwayStationItem } from './dtos/SearchSubwayStationItem';
import { SearchSubwayStationResponse, PagingInfo } from './dtos/SearchSubwayStationResponse';
import { StationTimeTableItem } from './dtos/StationTimeTableItem';
import { StationTimeTableResponse, ExtendedPagingInfo } from './dtos/StationTimeTableResponse';
import * as metroApi from './api';
import { getKeyByValue } from '../common/utils/objectUtil';
import { tic, toc, sleep } from '../common/utils/timeUtil';
import { DailyTypeCode, UpDownTypeCode, DailyTypeCodeValue, UpDownTypeCodeValue } from './types/codes';
import { getCodeValues, getCodeKeyByValue } from './types/utils';

interface ApiBody {
  items?: {
    item: any[] | any;
  };
  numOfRows: string;
  pageNo: string;
  totalCount: string;
}

const extractItemArrayOrDefualtEmptyArray = (body: ApiBody): any[] => {
  let result: any[] = [];
  if (body && body.items) {
    if (!Array.isArray(body.items.item)) {
      result = [body.items.item];
    } else {
      result = body.items.item;
    }
  }
  return result;
}

const extractPagingInfoOrDefaultEmptyObject = (body: ApiBody, appendObject: Record<string, any> = {}): ExtendedPagingInfo => {
  let paging: ExtendedPagingInfo = {
    numOfRows: Number(body.numOfRows),
    pageNo: Number(body.pageNo),
    totalCount: Number(body.totalCount),
  }

  Object.keys(appendObject).forEach(key => {
    (paging as any)[key] = appendObject[key];
  });

  return paging;
}

export async function getSubwayList(
  subwayStationName: string, 
  pageNo: number = 1, 
  numOfRows: number = 10
): Promise<SearchSubwayStationResponse> {
  const body = await metroApi.getSubwayList(subwayStationName, pageNo, numOfRows);
  const data = extractItemArrayOrDefualtEmptyArray(body).map(each => new SearchSubwayStationItem(each));
  const paging = extractPagingInfoOrDefaultEmptyObject(body);
  return new SearchSubwayStationResponse({ data, paging });
}

export async function getStationTimetable(
  subwayStationId: string,
  dailyTypeCodeValue: string,
  upDownTypeCodeValue: string,
  pageNo: number = 1,
  numOfRows: number = 10,
  filterNonArrive: boolean = true,
): Promise<StationTimeTableResponse> {
  const body = await metroApi.getStationTimetable(subwayStationId, dailyTypeCodeValue, upDownTypeCodeValue, pageNo, numOfRows);
  let data = extractItemArrayOrDefualtEmptyArray(body).map(each => {
    each.dailyTypeCode = getKeyByValue(DailyTypeCode, each.dailyTypeCode);
    each.upDownTypeCode = getKeyByValue(UpDownTypeCode, each.upDownTypeCode);
    return each;
  }).map(each => new StationTimeTableItem(each));

  let filteredCount = 0;
  if (filterNonArrive) {
    data = data.filter(each => each.arrTime != '0');
    filteredCount = data.length;
  }

  const paging = extractPagingInfoOrDefaultEmptyObject(body, {
    numOfRows,
    filteredNumOfRows: numOfRows - filteredCount,
    filterNonArrive,
  });
  return new StationTimeTableResponse({ 
    dailyTypeCode: dailyTypeCodeValue as DailyTypeCodeValue,
    upDownTypeCode: upDownTypeCodeValue as UpDownTypeCodeValue,
    data, 
    paging 
  });
}

const generateCombinations = (arrays: any[][], index: number = 0): any[][] => {
  if (index === arrays.length) {
    return [['']]; // 조합의 종료점
  }

  const result: any[][] = [];
  const nextCombinations = generateCombinations(arrays, index + 1);

  for (const item of arrays[index]) {
    for (const combination of nextCombinations) {
      result.push([item, ...combination]);
    }
  }

  return result;
}

export async function getStationAllArgsTimetable(
  subwayStationId: string,
  pageNo: number = 1,
  numOfRows: number = 400,
  filterNonArrive: boolean = true,
  untilDelayMsec: number = 1000
): Promise<StationTimeTableResponse[]> {
  const dailyTypeCodes = getCodeValues(DailyTypeCode);
  const upDownTypeCodes = getCodeValues(UpDownTypeCode);

  const allArgs = generateCombinations([dailyTypeCodes, upDownTypeCodes]);
  const results: StationTimeTableResponse[] = [];
  for (let args of allArgs) {
    const msec = tic();
    results.push(await getStationTimetable(subwayStationId, args[0], args[1], pageNo, numOfRows, filterNonArrive))
    const gap = toc(msec);
    if (gap < untilDelayMsec) {
      await sleep(untilDelayMsec - gap);
    }
  }
  return results;
} 