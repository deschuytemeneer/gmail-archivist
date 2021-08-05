/**
 * Creates a query which can be used to search all threads with the given email address as sender.
 * The mails are searched in the inbox. If `unreadOnly` is true, emails which have been read already
 * will not be included in the search results.
 */
function constructMailQuery(senders: string[], unreadOnly = true): string {
  return ['is:inbox', unreadOnly ? 'is:unread' : null, `from:(${senders.join(' OR ')})`]
    .filter((segment) => segment !== null)
    .join(' ');
}

/**
 * Applies the given archiver to all email threads that are sent by the given senders.
 */
// function applyFilter(archiver: Filter, ...senders: string[]): void {
//   const label = GmailApp.getUserLabelByName(archiver.label);
//   if (label) {
//     for (const thread of GmailApp.search(Archiver.constructMailQuery(senders))) {
//       if (archiver.markAsRead) {
//         thread.markRead();
//       }
//       if (archiver.markAsImportant) {
//         thread.markImportant();
//       }

//       thread.addLabel(label);
//       thread.moveToArchive();
//     }
//   }
// }

const DATABASE_NAME = 'google-filter-manager-database';
const PROPERTY_DATABASE_ID = 'gmail-filter-manager-db-id';

function makeSheetReadonly(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
  const protection = sheet.protect();

  // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
  // permission comes from a group, the script throws an exception upon removing the group.
  const me = Session.getEffectiveUser();
  protection.addEditor(me);
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}

function createDatabase(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  const spreadsheet = SpreadsheetApp.create(DATABASE_NAME);

  // Create the disclaimer sheet.
  const disclaimer = spreadsheet.getActiveSheet().setName('disclaimer');
  disclaimer.getRange('B2').setValue('This sheet is created by the Gmail Filter Manager addon.');

  // Create the actual database sheet.
  const database = spreadsheet.insertSheet('database');
  database.getRange('A1').setValue('finances/bills');
  database.getRange('B1:C1').insertCheckboxes();
  makeSheetReadonly(database);

  // Store the ID of the created spreadsheet in the user properties for later retrieval.
  PropertiesService.getUserProperties().setProperty(PROPERTY_DATABASE_ID, spreadsheet.getId());

  return spreadsheet;
}

/**
 * Gets the 'database' (a spreadsheet file on the user's drive) that contains the label data.
 * If the file does not exist yet, it is created.
 */
function getDatabase(): void {
  const fileId = PropertiesService.getUserProperties().getProperty(PROPERTY_DATABASE_ID);
  try {
    SpreadsheetApp.openById(fileId);
  } catch (e) {
    Logger.log(e);
  }

  // TODO
  // get filename and id from user prefs
  // check if file exists in drive
  // create if it doesnt exist yet
}
