namespace GmailAutoArchiver {
  export class Gmail {
    static ensureLabel(name: string): void {
      // TODO
    }

    static cleanupLabel(name: string): void {
      // TODO
    }

    static archive(name: string, senders: string[], unreadOnly = true): void {
      // TODO
    }

    static unarchive(name: string, senders: string[]): void {
      // TODO
    }

    static migrate(from: string, to: string, senders: string[]): void {
      // TODO
    }

    static markAsRead(senders: string[]): void {
      // TODO
    }

    static markAsUnread(senders: string[]): void {
      // TODO
    }

    static markAsImportant(senders: string[]): void {
      // TODO
    }

    static unmarkAsImportant(senders: string[]): void {
      // TODO
    }
  }
}
