export interface IErrorMsg {
  error: string | string[];
  code?: string;
  name?: string;
  extensions?: {
    response?: {
      statusCode: number;
      message: string;
    };
    code?: number;
  };
  message: string;
  statusCode?: number;
}

export interface EmailCompose {
  from?: string;
  to?: string | string[];
  subject?: string;
  html?: string;
  attachments?: EmailAttachments[];
  cc?: string | string[];
}
export interface EmailAttachments {
  filename?: string;
  path?: string;
}
