import { F } from 'ts-toolbelt'

const pipe: F.Pipe = (...fns: any[]) =>
  fns.reduce((prevFn: Function, nextFn: Function) => (value: unknown) =>
    nextFn(prevFn(value)),
  )

export default pipe
