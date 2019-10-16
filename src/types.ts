type Maybe<T> = T|undefined

export type StringMap = { [key: string]: string }

export interface LoggerInterface {
  info(message: object|string): void
  warn(message: object|string): void
  error(message: object|string): void
}

export interface HttpAdapterInterface {
  get(route, handler): void
  post(route, handler): void
  put(route, handler): void
  patch(route, handler): void
  delete(route, handler): void
}

export interface Initializable {
  up(): Promise<void>
  down(): Promise<void>
  isHealthy(): Promise<boolean>
}

export type Entity = {
  id: string
  version_id: string
  version: number
  created_at: string
  modified_at: string
  type: string
  body: StringMap,
  schema: StringMap
}

export interface StorageInterface {
  find(type: string, query: StringMap): Promise<Entity[]>
  get(id: string): Promise<Maybe<Entity>>
  create(type: string, data: StringMap): Promise<Maybe<Entity>>
  update(id: string, data: StringMap): Promise<Maybe<Entity>>
  delete(id: string): Promise<Maybe<Entity>>
}
