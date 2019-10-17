type Maybe<T> = T|undefined

export type StringMap = { [key: string]: string }
export type ValueMap = { [key: string]: string|number|boolean }

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
}

export type Entity = {
  id: string
  version_id: string
  version: number
  created_at: string
  modified_at: string
  type: string
  body: ValueMap,
  schema: StringMap
}

export interface RepositoryInterface {
  isConnected(): Promise<boolean>
  find(query: StringMap, sortBy?: string): Promise<Entity[]>
  get(id: string): Promise<Maybe<Entity>>
  create(data: StringMap): Promise<Maybe<Entity>>
  update(id: string, data: StringMap): Promise<Maybe<Entity>>
  delete(id: string): Promise<Maybe<Entity>>
}
