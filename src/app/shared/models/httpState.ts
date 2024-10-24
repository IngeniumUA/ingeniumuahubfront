export interface HttpState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}
