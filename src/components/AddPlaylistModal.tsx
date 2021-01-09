import { Backdrop, Button, Fade, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalTitle: {
    marginBottom: theme.spacing(4)
  },
  modalInput: {
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  modalButton: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default function AddPlaylistModal({ isModalOpen = false, setModalOpen = (_: boolean) => {}, onAdd = (name: string) => {} }) {
  const classes = useStyles();
  const [name, setName] = useState('');

  const handleAdd = useCallback(() => {
    onAdd(name)
  }, [name, onAdd])

  useEffect(() => {
    setName('');
  }, [isModalOpen])

  
  return (<Modal
        open={isModalOpen}
        onAbort={() => setModalOpen(false)}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <div className={classes.modalContent}>
            <Typography className={classes.modalTitle} variant="h3" color="textSecondary" align="left">Add playlist</Typography>
            <TextField className={classes.modalInput} label="Playlist name" variant="outlined" autoComplete="off" value={name} onChange={(v) => setName(v.currentTarget.value)}/>
            <Button className={classes.modalButton} variant="contained" color="primary" onClick={handleAdd}>Add</Button>
            <Button className={classes.modalButton} variant="contained" color="secondary" onClick={() => {setModalOpen(false)}}>Cancel</Button>
          </div>
        </Fade>
      </Modal>)
}