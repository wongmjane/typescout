export default <T, U>(mapper: (value: T, index: number) => U) => (
  array: ReadonlyArray<T>,
) => array.map(mapper)
