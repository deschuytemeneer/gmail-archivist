namespace GmailAutoArchiver {
  export class Filter implements FilterRecord {
    #name: string;
    #senders: Set<string>;
    // #markAsRead:

    static create(name: string): Filter {
      // TODO when you create a filter:
      // you ensure the label is created in gmail (incl. sublabels)
      // add it in the database

      const filter = new Filter();
      filter.#name = name;
      return filter;
    }

    get name(): string {
      return this.#name;
    }

    get senders(): string[] {
      return Array.from(this.#senders);
    }

    /**
     *
     * @param to
     */
    rename(to: string): void {
      GmailAutoArchiver.Gmail.migrate(this.#name, to, Array.from(this.senders));
      GmailAutoArchiver.Gmail.cleanupLabel(this.#name);

      GmailAutoArchiver.Database.update(this.#name, { name: to });

      this.#name = to;
    }

    markAsRead(): void {
      GmailAutoArchiver.Gmail.markAsRead(this.senders);
      GmailAutoArchiver.Database.update(this.#name, { markAsRead: true });
    }

    markAsImportant(): void {
      GmailAutoArchiver.Gmail.markAsImportant(this.senders);
      GmailAutoArchiver.Database.update(this.#name, { markAsImportant: true });
    }

    unmarkAsImportant(): void {
      GmailAutoArchiver.Gmail.unmarkAsImportant(this.senders);
      GmailAutoArchiver.Database.update(this.#name, { markAsImportant: false });
    }

    /**
     * Adds the email address to the archiver filter with given name. All unread emails in inbox
     * with that sender will have the filter applied and will be moved to the folder with the label
     * with the name of that filter.
     */
    addSender(email: string): void {
      this.#senders.add(email);

      GmailAutoArchiver.Gmail.archive(this.#name, this.senders, false);

      GmailAutoArchiver.Database.update(this.#name, { senders: this.senders });
    }

    private applyFor(senders: string[], inboxOnly: boolean) {
      GmailAutoArchiver.Gmail.archive(this.#name, this.senders, false);
    }

    /**
     * Removes the given email address from the list of senders that should be auto-archived. All
     * email threads by this sender are moved to inbox, unless `keepArchived` is true.
     */
    removeSender(email: string, keepArchived = false): void {
      this.#senders.delete(email);

      // Move all threads from the given sender back to inbox, unless 'keepArchived' is true.
      if (!keepArchived) {
        GmailAutoArchiver.Gmail.unarchive(this.#name, [email])
      }

      // Update the database.
      GmailAutoArchiver.Database.update(this.#name, { senders: this.senders });
    }

    /**
     * Removes the label of given name and moves all senders bound to this filter back to inbox. If
     * any mails are remaining in the label folder after the bound senders are removed from it, the
     * label is kept automatically. If `keepArchived` is set to true, the mail threads are not moved
     * and the label is kept regardless.
     */
    delete(keepArchived = false): void {
      if (!keepArchived) {
        GmailAutoArchiver.Gmail.unarchive(this.#name, this.senders);
        GmailAutoArchiver.Gmail.cleanupLabel(this.#name);
      }

      GmailAutoArchiver.Database.delete(this.#name);
    }

    /**
     *
     */
    apply(): void {
      // TODO
      // get the filter and senders bound to the filter with given name
      // find all (unread) emails in inbox that have a bound sender
      // move these to the folder with the label name
      // apply other actions (mark as read or mark as important)
    }
  }

  /**
   * Create an archiver filter. A corresponding Label is created in gmail. The created Filter is
   * returned.
   */
  export function create(name: string): Filter {
    const filter = new Filter(name);
    // const filter = GmailAutoArchiver.Database.createFilter(name, init);
    // GmailAutoArchiver.Gmail.ensureLabel(filter.name);
    // return filter;
  }

  export function get(name: string): Filter {

  }

  /**
   * Returns all archiver filters configured by the user.
   */
  export function getAll(): Filter[] {

  }
}
