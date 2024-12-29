export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
} 