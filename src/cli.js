#!/usr/bin/env node

import fse from 'fs-extra'
import path from 'path'
import { Command } from 'commander'
import { fileURLToPath } from 'url'

// modules
import app from './app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = await fse.readJSON(packageJsonPath)

const program = new Command()

program.name('sumor-cli').description('轻呈云应用命令行工具').version(packageJson.version)

program
  .command('start')
  .description('启动轻呈云应用')
  .action(() => {
    app()
  })

program.parse(process.argv)
