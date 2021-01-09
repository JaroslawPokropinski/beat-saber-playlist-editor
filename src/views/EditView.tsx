import { Button, makeStyles, TextField } from '@material-ui/core'
import fileDialog from 'file-dialog'
import MaterialTable from 'material-table'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Playlist } from '../types/Playlists'
import { Song } from '../types/Song'
import { readFile } from '../util/fileUtil'
import { getPlaylistFrom, loadSongs, savePlaylist as savePlaylistUtil } from '../util/loadSongs'


const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
  },
  table: {
    minWidth: 650,
  },
}))

function BasicFiltering({data, onSelectionChange} : {data: object[], onSelectionChange: (data: object[]) => void}) {
  return (
    <MaterialTable
      onSelectionChange={onSelectionChange}
      title=""
      columns={[
        { title: 'Title', field: '_songName' },
        { title: 'Artist', field: '_songAuthorName' },
      ]}
      data={data}
      options={{
        selection: true
      }}
    />
  )
}

const EditView: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const selected = useRef<Song[]>([])
  const { playlistFile } = useParams<{ playlistFile?: string }>()
  const [songs, setSongs] = useState<Song[]>([]);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [rows, setRows] = useState<(Song & { tableData: { checked: boolean } })[]>([])
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    loadSongs()
      .then((songs) => {
        console.log(songs)
        setSongs(songs)
      })
      .catch(() => null)
  }, [])

  useEffect(() => {
    if (playlistFile == null) return

    getPlaylistFrom(playlistFile)
      .then((p) => {
        setPlaylist(p)
      })
      .catch(() => null)
  }, [playlistFile])

  useEffect(() => {
    selected.current = [...songs]
    if (playlist == null) {
      const rows = songs.map((s) => ({...s, tableData: { checked: false }}))
      setRows(rows)
      return
    }
    const hashesMap = new Map<string, null>();
    playlist.songs.forEach((song) => {
      hashesMap.set(song.hash, null)
    })
    const rows = songs.map((s) => ({...s, tableData: { checked: s.hash == null ? false : hashesMap.has(s.hash) }}))
    setRows(rows)
    return
  }, [songs, playlist])

  const onSelectionChange = useCallback((data: object[]) => {
    if (selected.current == null) return
    selected.current = data as Song[]
  }, [])

  const chooseImage = useCallback(() => {
    fileDialog()
      .then((files) => {
        if (files[0] == null) return
        setImagePath(files[0].path)
      })
      .catch(() => null)
  }, [])

  const savePlaylist = useCallback(async () => {
    if (playlistFile == null || playlist == null || selected.current == null) return

    const newPlaylist = { ...playlist }
    newPlaylist.songs = selected.current.map((s) => ({ hash: s.hash ?? "" }))
    if (imagePath != null) 
      newPlaylist.image = 'data:image/jpg;base64,' + (await readFile(imagePath)).toString('base64')

    savePlaylistUtil(playlistFile, JSON.stringify(newPlaylist))
      .then(() => {
        history.replace('/')
      })
  }, [history, playlist, playlistFile, imagePath])

  const cancelPlaylist = useCallback(() => {
    history.replace('/')
  }, [history])

  return <div className={classes.root}>
    <TextField disabled value={imagePath} />
    <Button onClick={chooseImage}>Choose image</Button>
    <BasicFiltering data={rows} onSelectionChange={onSelectionChange}/>
    <Button color="primary" variant="contained" onClick={savePlaylist}>Save</Button>
    <Button color="secondary" variant="contained" onClick={cancelPlaylist}>Cancel</Button>
  </div>
}

export default EditView
