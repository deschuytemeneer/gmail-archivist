namespace GmailAutoArchiver {
  export interface Filter {
    name: string;
    markAsImportant: boolean;
    markAsRead: boolean;
  }

  export interface FilterInitOptions {
    markAsRead?: boolean;
    markAsImportant?: boolean;
  }

  export class Archiver {
    /**
     * Create an archiver filter. A corresponding Label is created in gmail. The created Filter is
     * returned.
     */
    static createFilter(name: string, init: FilterInitOptions = {}): Filter {
      // TODO when you create a filter:
      // you ensure the label is created in gmail (incl. sublabels)
      // add it in the database

      const filter = Database.createFilter(name, init);
      return filter;
    }

    /**
     * Adds the email address to the archiver filter with given name. All unread emails in inbox
     * with that sender will have the filter applied and will be moved to the folder with the label
     * with the name of that filter.
     */
    static addSender(name: string, sender: string): void {
      // TODO when you add an email to a filter
      // find all unread emails in inbox and apply filter
      // store the email in the database
      Database.bindSenders(name, sender);
    }

    /**
     * Returns all archiver filters configured by the user.
     */
    static getFilters(): Filter[] {
      return Database.getFilters();
    }

    /**
     * Returns all senders that are bound to the filter with given name.
     */
    static getSenders(name: string): string[] {
      return Database.getSenders(name);
    }

    /**
     * Updates the configuration of the given filter.
     */
    static updateFilter(name: string, filter: Filter): void {
      // TODO when you update a filter

      // case 1: rename
      // move all the bound emails to that new label in gmail
      // remove old label
      // rename in database

      // case 2: markAsRead/markAsImportant
      // update the bound emails
      // update in database

      Database.updateFilter(filter);
    }

    static deleteFilter(name: string): void {
      // TODO when you delete a filter
      // remove the label in gmail
      // move all emails bound to that label back to inbox
      // remove from the database

      return Database.deleteFilter(name);
    }

    static deleteSender(name: string, sender: string): void {
      // TODO when you remove an email from a filter
      // find all emails in the filter and move them to inbox
      // remove the email from the database
    }

    static apply(name: string): void {
      // TODO
      // get the filter and senders bound to the filter with given name
      // find all (unread) emails in inbox that have a bound sender
      // move these to the folder with the label name
      // apply other actions (mark as read or mark as important)
    }
  }
}
