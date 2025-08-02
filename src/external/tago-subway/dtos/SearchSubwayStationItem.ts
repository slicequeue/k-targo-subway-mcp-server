export interface SearchSubwayStationItemData {
  subwayRouteName: string;
  subwayStationId: string;
  subwayStationName: string;
}

export class SearchSubwayStationItem {
  public routeName: string;
  public stationId: string;
  public stationName: string;

  constructor({ subwayRouteName, subwayStationId, subwayStationName }: SearchSubwayStationItemData) {
    this.routeName = subwayRouteName;
    this.stationId = subwayStationId;
    this.stationName = subwayStationName;
  }
} 