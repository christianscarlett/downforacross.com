export interface WsEvent {
  timestamp: number;
  type: string;
}

export interface WsGridEntry {
  black: boolean;
  edits: [];
  number: number;
  parents: any;
  value: string;
}

export interface WsUpdateCellEvent extends WsEvent {
  id: string;
  params: {
    id: string;
    color: string;
    pencil: boolean;
    value: string;
    cell: {
      c: number;
      r: number;
    };
  };
}

export interface WsCreateEvent extends WsEvent {
  params: {
    game: {
      chat: {
        messages: any;
      };
      circles: [];
      clock: {
        lastUpdated: number;
        paused: boolean;
        totalTime: number;
        trueTotalTime: number;
      };
      clues: {
        across: string[];
        down: string[];
      };
      cursor: any;
      grid: WsGridEntry[][];
      info: {
        author: string;
        description: string;
        title: string;
        type: string;
      };
      solution: string[][];
      solved: boolean;
    };
    pid: number;
    version: number;
  };
}
