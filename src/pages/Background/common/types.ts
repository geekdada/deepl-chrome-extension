export type Handler<T = any> = (
  payload: T,
  resolve: (result: Record<string, any> | string) => void,
  reject: (reason: Record<string, any> | string) => void,
) => void
