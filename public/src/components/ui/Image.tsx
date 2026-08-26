import { useState } from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export default function Image({ src, alt = '', fallback = '', className = '', onError, ...props }: ImageProps) {
  const [errored, setErrored] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setErrored(true)
    onError?.(e)
  }

  if (errored && fallback) {
    return <img src={fallback} alt={alt} className={className} {...props} />
  }

  if (errored && !fallback) {
    return <div className={`bg-surface-dark ${className}`} />
  }

  return <img src={src} alt={alt} className={className} onError={handleError} {...props} />
}
