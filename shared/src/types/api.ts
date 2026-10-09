export interface ApiErrorBody {
  code: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
