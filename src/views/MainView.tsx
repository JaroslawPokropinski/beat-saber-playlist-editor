import { Button, Fab, makeStyles } from '@material-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PlaylistsList from '../components/PlaylistsList'
import { getBSDirectory } from '../util/getBSDirectory'
import { Playlist } from '../types/Playlists'
import { useHistory } from 'react-router-dom'
import { path, readdir, readFile } from '../util/fileUtil'
import AddPlaylistModal from '../components/AddPlaylistModal'
import AddIcon from '@material-ui/icons/Add';
import { savePlaylist } from '../util/loadSongs'


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100vh',
  },
  content: {
    flexGrow: 2,
    textAlign: 'center'
  },
  imageContainer: {
    display: 'inline-block',
    width: '100%',
    height: '300px'
  },
  image: {
    height: '300px'
  },
  description: {

  },
  edit: {

  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(8),
    right: theme.spacing(8),
  },
}))

const MainView: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const [playlists, setPlaylists] = useState<(Playlist & {dir: string})[]>([])
  const [chosen, setChosen] = useState<(Playlist & {dir: string}) | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const editPlaylist = useCallback(() => {
    if (chosen == null) return

    console.log(`Go to /playlist/${chosen.dir}`)
    history.push(`/playlist/${chosen.dir}`)
  }, [history, chosen])

  const loadList = useCallback(async () => {
    const directoryPath = path.join(getBSDirectory(), "/Playlists")

    try {
      const files = await readdir(directoryPath)
      const readPromises = files.map(async (fileName: string) => {
        const fileData = await readFile(path.join(directoryPath, fileName), 'utf-8')
        const fileJson: Playlist = JSON.parse(fileData)

        return { ...fileJson, dir: fileName }
      })
      const newPlaylists: (Playlist & {dir: string})[] = await Promise.all(readPromises)
      setPlaylists(newPlaylists)
      if (newPlaylists.length > 0) {
        setChosen(newPlaylists[0])
      }
      
    } catch (error) {
      console.error(error)
    }
  }, [setChosen])

  const createPlaylist = useCallback((name: string) => {
    
    const newPlaylist: Playlist = { playlistTitle: name ,playlistAuthor: 'me', playlistDescription: '', image: '', songs: [] }
    savePlaylist(`${name}.bplist`, JSON.stringify(newPlaylist))
      .then(() => history.push(`/playlist/${name}.bplist`))
      .catch((e) => console.error(e))

  }, [history])

  useEffect(() => {
    loadList()
  }, [loadList])

  useEffect(() => {
    if (imageRef.current == null) return;
    if (chosen == null) return;

    imageRef.current.src = chosen.image;
  }, [imageRef, chosen]);

  return <div className={classes.root}>
    <PlaylistsList playlists={playlists} setChosen={setChosen} />
    <div className={classes.content}>
      <div className={classes.imageContainer}>
        <img className={classes.image} alt="Playlist" ref={imageRef}/>
      </div>
      
      <Button color="primary" variant="contained" onClick={editPlaylist}>Edit</Button>
    </div>
    <AddPlaylistModal isModalOpen={isModalOpen} setModalOpen={(o: boolean) => setModalOpen(o)} onAdd={createPlaylist}/>
    <Fab className={classes.fab} color="primary" aria-label="add" onClick={() => {setModalOpen(true)}}>
      <AddIcon />
    </Fab>
  </div>
}

export default MainView
