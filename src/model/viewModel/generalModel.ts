export interface IErrorMsg {
  error: string | string[];
  code?: string ;
  name?: string;
  extensions?: {
      response?: {
        statusCode: number;
        message: string;
      },
      code?: number;
  },
  message: string;
  statusCode?: number;
}
