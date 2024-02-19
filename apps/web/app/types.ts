export interface PropsWithPageParams<T = {}> {
  params: {
    locale: string
  } & T
}
