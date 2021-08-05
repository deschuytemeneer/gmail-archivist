namespace GmailAutoArchiver {
  export interface FilterRecord {
    name: string;
    markAsImportant: boolean;
    markAsRead: boolean;
    senders?: string[];
  }

  export class Database {
    static create(
      name: string,
      options: RestrictedPartial<FilterRecord, 'markAsImportant' | 'markAsRead'> = {}
    ): void {
      // TODO
    }

    static read(name: string): FilterRecord;
    static read(name: null): FilterRecord[];
    static read(name: unknown = null): unknown {
      if (name === null) {
        // TODO return all, not with senders
        return [
          {
            name: 'Finances',
            markAsRead: false,
            markAsImportant: false,
          },
          {
            name: 'Finances/Bills',
            markAsRead: false,
            markAsImportant: true,
          },
          {
            name: 'News',
            markAsRead: true,
            markAsImportant: false,
          },
          {
            name: 'News/Promotions',
            markAsRead: true,
            markAsImportant: false,
          },
          {
            name: 'News/Marketing',
            markAsRead: true,
            markAsImportant: false,
          },
        ] as FilterRecord[];
      } else {
        // TODO return one, with senders
        return {
          name: 'News/Promotions',
          markAsRead: true,
          markAsImportant: false,
          senders: ['mail@veganmasters.nl'],
        };
      }
    }

    static update(name: string, options: Partial<FilterRecord>): void {
      // TODO
    }

    static delete(name: string): void {
      // TODO
    }
  }
}
