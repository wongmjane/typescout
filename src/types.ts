export type HydrationPair<HYDRATED, DEHYDRATED> = {
  HYDRATED: HYDRATED
  DEHYDRATED: DEHYDRATED
}

export type Hydrator<T extends HydrationPair<unknown, unknown>> = (
  dehydratedData: T['DEHYDRATED'],
) => T['HYDRATED']

export type Dehydrator<T extends HydrationPair<unknown, unknown>> = (
  dehydratedData: T['HYDRATED'],
) => T['DEHYDRATED']

export type Transformer<T, U> = (value: T) => U
export type Predicate<T> = Transformer<T, boolean>
