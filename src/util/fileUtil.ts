import util from 'util'
import fsType from 'fs'
import pathType from 'path'

const fs = window.require('fs') as typeof fsType
export const path = window.require('path') as typeof pathType

export const readFile = util.promisify(fs.readFile)
export const readdir = util.promisify(fs.readdir)
export const writeFile = util.promisify(fs.writeFile)