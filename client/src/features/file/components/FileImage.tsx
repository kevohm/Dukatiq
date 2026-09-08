import type { ReactNode } from 'react'
import { useFileUrl } from '../hooks'

type FileImageProps = {
    fileKey?: string | null
    alt: string
    className?: string
    fallback?: ReactNode
}

export function FileImage({
    fileKey,
    alt,
    className,
    fallback = null,
}: FileImageProps) {
    const { data } = useFileUrl(fileKey)

    if (!data?.url) {
        return <>{fallback}</>
    }

    return <img src={data.url} alt={alt} className={className} />
}
