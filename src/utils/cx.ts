export default (
  ...classNames: ReadonlyArray<string | false | undefined | null | 0>
) => classNames.filter(Boolean).join(' ')
