import {fetchPuzzleList} from '../../api/puzzle_list';
import Puzzle from './Puzzle';

/** Repository for the list of puzzles */
export default class PuzzleListRepo {
  private static instance: PuzzleListRepo | null = null;

  static getInstance(): PuzzleListRepo {
    if (PuzzleListRepo.instance == null) {
      PuzzleListRepo.instance = new PuzzleListRepo();
    }
    return PuzzleListRepo.instance;
  }

  /* Class */

  private isFetching = false;

  private currentPage = 0;
  private PAGE_SIZE = 10;

  private puzzles: Puzzle[] = [];

  getPuzzles(): Puzzle[] {
    return this.puzzles;
  }

  private async executeFetchPuzzles(refresh: boolean = false) {
    this.isFetching = true;

    if (refresh) {
      this.currentPage = 0;
      this.puzzles = [];
    }

    let puzzleListResponse = await fetchPuzzleList({
      page: this.currentPage,
      pageSize: this.PAGE_SIZE,
      filter: {
        sizeFilter: {
          Mini: true,
          Standard: true,
        },
        nameOrTitleFilter: '',
      },
    });
    this.puzzles = this.puzzles.concat(puzzleListResponse.puzzles);
    this.currentPage += 1;
    this.isFetching = false;
  }

  async maybeFetchPuzzles(initialFetch: boolean = false) {
    let isInvalidInitialFetch = initialFetch && this.currentPage !== 0;
    if (this.isFetching || isInvalidInitialFetch) {
      return;
    }
    await this.executeFetchPuzzles();
  }

  async refresh() {
    await this.executeFetchPuzzles(true);
  }
}
