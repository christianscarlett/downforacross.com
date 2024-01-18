import {PuzzleJson, PuzzleStatsJson} from '../../shared/types';

export default class Puzzle {
  pid: string;
  content: PuzzleJson;
  stats: PuzzleStatsJson;

  constructor(pid: string, content: PuzzleJson, stats: PuzzleStatsJson) {
    this.pid = pid;
    this.content = content;
    this.stats = stats;
  }
}
