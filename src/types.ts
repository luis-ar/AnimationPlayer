export type ITrackItemType = "text";

export interface ITrackItem {
  id: string;
  type: ITrackItemType;
  details: {
    text: string;
    fontSize: number;
  };
  display: {
    from: number;
    to: number;
  };
  trim?: {
    from: number;
    to: number;
  };
  animation?: string;
}
