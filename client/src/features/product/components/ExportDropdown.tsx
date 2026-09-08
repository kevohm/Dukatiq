import { Download } from 'lucide-react'

import { Button } from '../../../components/ui/Button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../components/ui/DropdownMenu'

import { exportToCSV, exportToExcel } from '../../../lib/excel/export'

type ExportDropdownProps<T> = {
    filename: string
    data: T[]
    onDownloadTemplate?: () => void
}

export function ExportDropdown<T>({
    filename,
    data,
    onDownloadTemplate,
}: ExportDropdownProps<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" icon={<Download size={16} />}>
                    Export
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onSelect={() =>
                        exportToExcel({
                            filename,
                            data,
                        })
                    }
                >
                    Export Excel (.xlsx)
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={() =>
                        exportToCSV({
                            filename,
                            data,
                        })
                    }
                >
                    Export CSV
                </DropdownMenuItem>

                {onDownloadTemplate && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onSelect={onDownloadTemplate}>
                            Download Template
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
