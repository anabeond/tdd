'use client'

import { useState } from 'react'
import Image from 'next/image'

type ProductImageProps = {
  src: string
  alt: string
  sizes?: string
  className?: string
  placeholder: React.ReactNode
}

export function ProductImage({ src, alt, sizes, className, placeholder }: ProductImageProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) return <>{placeholder}</>

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
