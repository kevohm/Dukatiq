
import React from 'react'
import { Button, type ButtonProps } from '../ui/Button'
import { LogOut } from 'lucide-react'
import { useCommonLogout } from '@/hooks/useCommonLogout'

interface LogoutButtonProps extends ButtonProps {
    label?: string
    disabled?: boolean
    onClick?: () => void | Promise<void>
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
    label,
    disabled = false,
    onClick,
    ...props
}) => {
    const {logout} = useCommonLogout()
    return (
        <Button
            type="button"
            onClick={async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await logout()
               
            }}
            variant="danger"
            disabled={disabled}
            icon={<LogOut className=" w-4 h-4" />}
            {...props}
        >
            {label ?? <span className="md:hidden lg:block">Logout</span>}
        </Button>
    )
}

export default LogoutButton
