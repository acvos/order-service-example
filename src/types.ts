export type StringMap = { [key: string]: string }

export interface LoggerInterface {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
}
