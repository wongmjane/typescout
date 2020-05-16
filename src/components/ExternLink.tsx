import React, { AnchorHTMLAttributes, forwardRef } from 'react'

export default forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => (
  <a target='_blank' rel='noopener noreferrer' {...props} ref={ref} />
))
