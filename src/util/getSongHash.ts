import { Song } from "../types/Song"
import { path, readFile } from "./fileUtil"
import { getBSDirectory } from "./getBSDirectory"
import { buffer, crypto } from './crypto'

const Buffer = buffer.Buffer

export const getSongHash = async (dir: string) => {
  const directoryPath = path.join(getBSDirectory(), 'Beat Saber_Data', 'CustomLevels')
  const fileData = await readFile(path.join(directoryPath, dir, 'info.dat'), 'utf-8')
  const fileJson: Song = JSON.parse(fileData)

  const data: Buffer[] = []
  for (const set of fileJson._difficultyBeatmapSets) {
    for (const diff of set._difficultyBeatmaps) {
      const ndata = await readFile(path.join(directoryPath, dir, diff._beatmapFilename))
      data.push(ndata)
    }
  }

  return crypto.createHash('sha1')
    .update(fileData)
    .update(Buffer.concat(data))
    .digest('hex')
} 