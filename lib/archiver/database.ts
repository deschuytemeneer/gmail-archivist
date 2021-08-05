namespace GmailAutoArchiver {
  export class Database {
    static createFilter(name: string, init: FilterInitOptions = {}): Filter {
      const filter: Filter = Object.assign({
        name,
        markAsImportant: false,
        markAsRead: false,
      }, init);

      return filter;
    }

    static getFilter(name: string): Filter {
      return {
        name: 'News/Promotions',
        markAsRead: true,
        markAsImportant: false,
      };
    }

    static getFilters(): Filter[] {
      return [Database.getFilter('News/Promotions')];
    }

    static updateFilter(filter: Filter): void {
      return void 0;
    }

    static deleteFilter(name: string): void {
      return void 0;
    }

    static bindSenders(name: string, ...senders: string[]): void {
      return void 0;
    }

    static unbindSenders(name: string, ...senders: string[]): void {
      return void 0;
    }

    static getSenders(name: string): string[] {
      return ['mail@veganmasters.nl'];
    }
  }
}
