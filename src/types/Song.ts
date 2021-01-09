export type Song = {
  hash?: string;
  _songName: string;
  _songAuthorName: string;
  _difficultyBeatmapSets: { _difficultyBeatmaps: { _beatmapFilename: string; }[] }[];
}
