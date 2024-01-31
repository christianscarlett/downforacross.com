import {PuzzleJson, PuzzleStatsJson} from '../../shared/types';

export default class PuzzleListItem {
  pid: string;
  content: PuzzleJson;
  stats: PuzzleStatsJson;

  constructor(pid: string, content: PuzzleJson, stats: PuzzleStatsJson) {
    this.pid = pid;
    this.content = content;
    this.stats = stats;
  }

  get displaySize() {
    const {type} = this.content.info;
    if (type === 'Daily Puzzle') {
      return 'Standard';
    }
    if (type === 'Mini Puzzle') {
      return 'Mini';
    }
    return 'Puzzle';
  }
}
