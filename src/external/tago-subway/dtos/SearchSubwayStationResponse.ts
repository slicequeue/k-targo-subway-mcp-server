import { SearchSubwayStationItem } from './SearchSubwayStationItem';

export interface PagingInfo {
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

export interface SearchSubwayStationResponseData {
  data: SearchSubwayStationItem[];
  paging: PagingInfo;
}

export class SearchSubwayStationResponse {
  public data: SearchSubwayStationItem[];
  public paging: PagingInfo;

  constructor({ data, paging }: SearchSubwayStationResponseData) {
    this.data = data;
    this.paging = paging;
  }
} 