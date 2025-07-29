export interface bannerlistDataType {
  imgsrc: string;
  line?: number;
  webdataid: number;
  showednum: number;
  url: string;
  description?: string;
  treeData?: string;
  hot?: boolean;
}

export interface headerlistDataType {
  line: number;
  webdataid: number;
  url: string;
  description?: string;
  color?: string;
}
