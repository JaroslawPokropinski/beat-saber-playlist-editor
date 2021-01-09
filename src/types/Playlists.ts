export type Playlist = {
  playlistTitle: string;
  playlistAuthor: string;
  playlistDescription: string;
  image: string;
  songs: {
    key?: string;
    hash: string;
    songName?: string;
    uploader?: string;
  }[]
}
