export type Response<T> = Promise<T>;
export type Nullable<T> = T | undefined | null;
export type NullableResponse<T> = Response<Nullable<T>>;
