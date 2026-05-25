export interface PropsWithPageParams<T = {}> {
  params: Promise<{
    locale: string
  } & T>
}
