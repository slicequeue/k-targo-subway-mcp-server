import axios, { AxiosResponse } from 'axios';
import { config } from '../../config/index';
import { DataType } from './types/constants';

const API_URL = 'http://apis.data.go.kr/1613000/SubwayInfoService';

interface ApiResponse<T> {
  response: {
    header: {
      resultCode: string;
    };
    body: T;
  };
}

interface SubwayListBody {
  items: {
    item: any[] | any;
  };
  numOfRows: string;
  pageNo: string;
  totalCount: string;
}

interface StationTimetableBody {
  items: {
    item: any[] | any;
  };
  numOfRows: string;
  pageNo: string;
  totalCount: string;
}

const extractResponseBody = <T>(res: AxiosResponse<ApiResponse<T>>): T => {
  const data = res.data;
  if (!data.response || !data.response.header || !data.response.header.resultCode || data.response.header.resultCode != '00') {
    throw Error(`gov metro api error: ${JSON.stringify(data)}`);
  }
  return data.response.body;
}

const apiClient = axios.create({
  baseURL: API_URL,
  params: {
    serviceKey: config.govApi.key,
    _type: DataType.JSON,
  }
});

export async function getSubwayList(
  subwayStationName: string, 
  pageNo: number = 1, 
  numOfRows: number = 10
): Promise<SubwayListBody> {
  const res = await apiClient.get<ApiResponse<SubwayListBody>>('/getKwrdFndSubwaySttnList', {
    params: {
      subwayStationName,
      pageNo,
      numOfRows,
    }
  });
  return extractResponseBody(res);
}

/**
 * 지하철역별 시간표 목록조회
 * @param subwayStationId *지하철역ID - 지하철역 목록조회에서 조회 가능
 * @param dailyTypeCodeValue *요일구분코드값 - DataType
 * @param upDownTypeCodeValue *상하행구분코드값 - UpDownTypeCode
 * @param pageNo 한 페이지 결과 수
 * @param numOfRows 페이지 번호
 * @param filterNonArrive 정차하지 않는 정보 필터링 여부
 * @returns 
 */
export async function getStationTimetable(
  subwayStationId: string,
  dailyTypeCodeValue: string,
  upDownTypeCodeValue: string,
  pageNo: number = 1,
  numOfRows: number = 10,
): Promise<StationTimetableBody> {
  const res = await apiClient.get<ApiResponse<StationTimetableBody>>('/getSubwaySttnAcctoSchdulList', {
    params: {
      subwayStationId,
      dailyTypeCode: dailyTypeCodeValue,
      upDownTypeCode: upDownTypeCodeValue,
      pageNo,
      numOfRows,
    }
  });

  return extractResponseBody(res);
} 