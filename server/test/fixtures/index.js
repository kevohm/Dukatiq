import path from 'path'
import { fileURLToPath } from 'url'
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const image = path.resolve(__dirname, './test-image.png')



export {image}