import { Playlist } from "../types/Playlists"
import { Song } from "../types/Song"
import { path, readdir, readFile, writeFile } from "./fileUtil"
import { getBSDirectory } from "./getBSDirectory"
import { getSongHash } from "./getSongHash"


export const loadSongs = async () => {
  const directoryPath = path.join(getBSDirectory(), 'Beat Saber_Data', 'CustomLevels')

  const files = await readdir(directoryPath)
  const readPromises = files.map(async (fileName: string) => {
    const fileData = await readFile(path.join(directoryPath, fileName, 'info.dat'), 'utf-8')
    const fileJson: Song = JSON.parse(fileData)

    try {
      const fileMetadata = await readFile(path.join(directoryPath, fileName, 'metadata.dat'), 'utf-8')
      const fileMetaJson: { hash: string } = JSON.parse(fileMetadata)

      return { ...fileJson, hash: fileMetaJson.hash }
    } catch(_e) {
      const hash = await getSongHash(fileName)
      return { ...fileJson, hash }
    }
  })
  await Promise.all(readPromises)
  const newSongs: Song[] = await Promise.all(readPromises)
  return newSongs
}

export const getPlaylistFrom =  async (fileName: string) => {
  const playlistsPath = path.join(getBSDirectory(), "/Playlists")
  const fileData = await readFile(path.join(playlistsPath, fileName), 'utf-8')
  const fileJson: Playlist = JSON.parse(fileData)
  
  return fileJson
}

export const savePlaylist = async (fileName: string, data: string) => {
  const playlistsPath = path.join(getBSDirectory(), "/Playlists")
  return await writeFile(path.join(playlistsPath, fileName), data)
}