import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import { Button } from '../ui/Button'

type BackButtonProps = {
    label?: string
    disabled?: boolean
    onClick?: () => void | Promise<void>
}

const BackButton: React.FC<BackButtonProps> = ({
    label,
    disabled = false,
    onClick,
}) => {
    const navigate = useNavigate()
    return (
        <Button
            type="button"
            onClick={() => {
                if (onClick) {
                    void onClick()
                    return
                }

                navigate({ to: '..' })
            }}
            variant="ghost"
            disabled={disabled}
        >
            {label ?? 'Go Back'}
        </Button>
    )
}

export default BackButton
