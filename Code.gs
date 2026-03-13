/**
 * NGAJI DIGITAL BACKEND
 * Penulis: Tim Riset Ngaji Digital
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  // Sistem penangkapan parameter yang lebih kuat
  const params = e.parameter;
  const action = params.action;
  
  let result;

  try {
    if (!action) {
      return createJsonResponse({ status: false, message: "Error: No Action Provided" });
    }

    switch (action) {
      case 'sync':
        result = syncAllData();
        break;
      case 'getSurah':
        result = getSheetData('Surah');
        break;
      case 'getDoa':
        result = getSheetData('Doa');
        break;
      case 'getTahlil':
        result = getSheetData('Tahlil');
        break;
      case 'getSholat':
        result = fetchSholatAPI(params.id);
        break;
      case 'searchKota':
        result = searchKotaAPI(params.q);
        break;
      default:
        result = { status: false, message: "Action '" + action + "' tidak dikenali" };
    }
  } catch (err) {
    result = { status: false, message: "Server Error: " + err.toString() };
  }

  return createJsonResponse(result);
}

// Helper untuk format JSON yang konsisten
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function fetchSholatAPI(cityId) {
  const now = new Date();
  const url = `https://api.myquran.com/v2/sholat/jadwal/${cityId}/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;
  const res = UrlFetchApp.fetch(url);
  return JSON.parse(res.getContentText());
}

function searchKotaAPI(query) {
  const res = UrlFetchApp.fetch(`https://api.myquran.com/v2/sholat/kota/cari/${query}`);
  return JSON.parse(res.getContentText());
}

function syncAllData() {
  // Sync Surah
  const resSurah = UrlFetchApp.fetch('https://equran.id/api/v2/surat');
  const surahs = JSON.parse(resSurah.getContentText()).data;
  const sSheet = getOrCreateSheet('Surah');
  sSheet.clear().appendRow(['ID', 'Nama', 'Nama Arab', 'Jumlah Ayat', 'Tipe']);
  surahs.forEach(s => sSheet.appendRow([s.nomor, s.namaLatin, s.nama, s.jumlahAyat, s.tempatTurun]));

  return { status: true, message: 'Sinkronisasi v30.5 Berhasil!' };
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const header = values.shift();
  return values.map(row => {
    let obj = {};
    header.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getOrCreateSheet(name) {
  let sheet = SS.getSheetByName(name);
  if (!sheet) sheet = SS.insertSheet(name);
  return sheet;
}
