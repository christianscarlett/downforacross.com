class HistoryModel {
  events: any[];

  constructor() {
    this.events = [];
  }

  pushEvent(event: any) {
    this.events.push(event);
  }

  getSortedEvents() {
    let eventsCopy = JSON.parse(JSON.stringify(this.events)) as any[];
    eventsCopy.sort((a, b) => a.timestamp - b.timestamp);
    return eventsCopy;
  }
}

export default HistoryModel;
