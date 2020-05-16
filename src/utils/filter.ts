export default <T>(predicate: (item: T, index: number) => boolean) =>
  function* (iterable: Iterable<T>) {
    let index = 0
    for (const item of iterable) if (predicate(item, index++)) yield item
  }
