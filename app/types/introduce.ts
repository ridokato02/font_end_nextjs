export interface Introduce {
    id: number;
    Title: string;
    description: string;
  }
  
  export interface IntroduceResponse {
    data: Introduce[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  