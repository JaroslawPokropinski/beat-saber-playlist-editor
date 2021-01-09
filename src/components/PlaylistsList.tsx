import { ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import React, {  } from 'react'
import { Playlist } from '../types/Playlists'

const useStyles = makeStyles((theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
    width: '400px',
    backgroundColor: theme.palette.background.paper
  },
}))

const MainView: React.FC<{ playlists: (Playlist & {dir: string})[], setChosen: (playlist: (Playlist & {dir: string})) => void }> = 
  ({ playlists = [], setChosen = () => null }) => {

  const classes = useStyles()

  return <div className={classes.list}>
    {playlists.map((playlist, i) =>
      <ListItem key={playlist.playlistTitle} onClick={() => setChosen(playlists[i])} button>
        <ListItemIcon>
        </ListItemIcon>
        <ListItemText primary={playlist.playlistTitle} />
      </ListItem>)
    }
  </div>
}

export default MainView
