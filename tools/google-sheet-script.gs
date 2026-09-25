/**
 * Perast RSVPs → Google Sheet
 *
 * Paste this into the Google Sheet's Extensions → Apps Script, then
 * Deploy → New deployment → Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the web app URL into SHEET_URL in js/config.js on the website.
 */

const SHEET_NAME = 'RSVPs';

// Column heading → the field the website sends.
const COLUMNS = [
  ['Received',             null],          // filled in with the date and time
  ['Name(s)',              'name'],
  ['Email',                'email'],
  ['WhatsApp / phone',     'phone'],
  ['Coming?',              'plan'],
  ['Adults',               'adults'],
  ['Kids',                 'kids'],
  ['Couple or single',     'party_type'],
  ['Nights',               'nights'],
  ['Which nights',         'nights_detail'],
  ['Arriving',             'arrival'],
  ['Leaving',              'departure'],
  ['Airport shuttle',      'shuttle'],
  ['Dietary requirements', 'dietary'],
  ['Message',              'message'],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // two RSVPs at once won't overwrite each other
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (!data.name || !data.email) return reply('ignored');

    const sheet = getSheet();
    const row = COLUMNS.map(function (col) {
      if (!col[1]) return new Date();
      return clean(data[col[1]]);
    });
    sheet.appendRow(row);
    return reply('ok');
  } finally {
    lock.releaseLock();
  }
}

// Creates the RSVPs tab with bold, frozen headings the first time.
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS.map(function (c) { return c[0]; }));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stops anything a guest types from being treated as a spreadsheet formula.
function clean(value) {
  if (value === undefined || value === null) return '';
  const text = String(value).slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
