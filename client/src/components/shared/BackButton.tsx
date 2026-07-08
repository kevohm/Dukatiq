import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import { Button } from '../ui/Button'

const BackButton: React.FC<{ label?: string }> = ({ label }) => {
    const navigate = useNavigate()
    return (
        <Button
            type="button"
            onClick={() => navigate({ to: '..' })}
            variant="ghost"
        >
            {label ?? 'Go Back'}
        </Button>
    )
}

export default BackButton
