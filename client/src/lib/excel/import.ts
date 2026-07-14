// lib/excel/import.ts

import * as XLSX from 'xlsx'

export async function importSpreadsheet<T>(file: File): Promise<T[]> {
    const buffer = await file.arrayBuffer()

    const workbook = XLSX.read(buffer)

    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    return XLSX.utils.sheet_to_json<T>(sheet, {
        defval: '',
    })
}
