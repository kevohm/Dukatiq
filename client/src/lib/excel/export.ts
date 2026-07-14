// lib/excel/export.ts

import * as XLSX from 'xlsx'

type ExportOptions<T> = {
    data: T[]
    filename: string
    sheetName?: string
}

export function exportToExcel<T>({
    data,
    filename,
    sheetName = 'Sheet1',
}: ExportOptions<T>) {
    const worksheet = XLSX.utils.json_to_sheet(data)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function exportToCSV<T>({ data, filename }: ExportOptions<T>) {
    const worksheet = XLSX.utils.json_to_sheet(data)

    const csv = XLSX.utils.sheet_to_csv(worksheet)

    const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
    })

    const link = document.createElement('a')

    link.href = URL.createObjectURL(blob)

    link.download = `${filename}.csv`

    link.click()
}
