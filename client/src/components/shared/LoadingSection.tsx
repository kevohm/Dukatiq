import { Loader, Loader2 } from 'lucide-react'
import React from 'react'

const LoadingSection = ({ title }: { title?: string }) => {
    return (
        <div className="w-full h-96 flex flex-col items-center justify-center">
            <p className="mb-8 capitalize text-xl font-bold text-slate-600">
               {title ?? "fetching data"}
            </p>
            <Loader className="w-8 h-8 text-brand animate-spin ease-in-out" />
        </div>
    )
}

export default LoadingSection
