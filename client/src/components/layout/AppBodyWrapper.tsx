import React, { type ReactNode } from 'react'

const AppBodyWrapper: React.FC<{ children: ReactNode }> = ({
    children,
}): ReactNode => {
    return <div className="flex flex-col h-full">{children}</div>
}

export default AppBodyWrapper
