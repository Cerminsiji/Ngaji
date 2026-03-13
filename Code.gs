/**
 * Ngaji Digital Backend v46.0 - UNISA API Integration
 */
const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e ? e.parameter.action : null;
  checkAndInitSheets();

  if (action) {
    try {
      let result;
      switch(action) {
        case 'getCalendar': result = getCalendarUNISA(); break;
        case 'getSholat': result = getJadwalByCityId(e.parameter.id); break;
        case 'getSurah': result = getSheetData("DB_Surah"); break;
        case 'getDoa': result = getSheetData("DB_Doa"); break;
        case 'getTahlil': result = getSheetData("DB_Tahlil"); break;
        case 'getAyatData': result = fetchAyatFromAPI(e.parameter.surahId); break;
        case 'searchKota': result = callAPI(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(e.parameter.q || "jakarta")}`); break;
        case 'sync': result = flushAndSync(); break;
        default: result = {status: false, message: "Aksi tidak dikenal"};
      }
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({status: false, message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return HtmlService.createTemplateFromFile('index').evaluate().setTitle('Ngaji Digital 2026');
}

// FUNGSI BARU MENGGUNAKAN API UNISA
function getCalendarUNISA() {
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    
    // Endpoint UNISA Yogya
    const url = `https://service.unisayogya.ac.id/kalender/api/masehi2hijriah/muhammadiyah/${y}/${m}/${d}`;
    const res = callAPI(url);
    
    if (res && res.hijriah) {
      const h = res.hijriah; // Format: "14 Ramadan 1447 H"
      const masehiStr = Utilities.formatDate(now, "GMT+7", "EEEE, dd MMMM yyyy");
      
      return { 
        status: true, 
        masehi: masehiStr, 
        hijri: h 
      };
    }
    throw "API UNISA Tidak Merespon";
  } catch (e) {
    return {
      status: true,
      masehi: Utilities.formatDate(new Date(), "GMT+7", "EEEE, dd MMMM yyyy"),
      hijri: "Ramadhan 1447 H" // Fallback manual
    };
  }
}

// Fungsi pembantu lainnya tetap sama
function callAPI(url) {
  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, timeoutInSeconds: 15 });
    return JSON.parse(res.getContentText());
  } catch (e) { return null; }
}

function getJadwalByCityId(id) {
  const cityId = id || "1301";
  const dateStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy/MM/dd");
  const res = callAPI(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${dateStr}`);
  if(res && res.status && res.data && res.data.jadwal) {
    return { status: true, data: { jadwal: res.data.jadwal } };
  }
  return { status: false };
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  if(!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const head = data.shift();
  return data.map(r => { let o = {}; head.forEach((h, i) => { o[h] = r[i]; }); return o; });
}

function flushAndSync() {
  try {
    const resQ = callAPI("https://equran.id/api/v2/surat");
    if(resQ && resQ.data) {
      const rows = resQ.data.map(s => [s.nomor, s.namaLatin, s.nama, s.tempatTurun, s.jumlahAyat]);
      SS.getSheetByName("DB_Surah").clear().getRange(1,1,1,5).setValues([["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"]]);
      SS.getSheetByName("DB_Surah").getRange(2,1,rows.length,5).setValues(rows);
    }
    return {status: true, message: "Sync Berhasil!"};
  } catch (e) { return {status: false, message: e.toString()}; }
}

function fetchAyatFromAPI(id) {
  const res = callAPI(`https://equran.id/api/v2/surat/${id}`);
  return res ? res.data : null;
}

function checkAndInitSheets() {
  const s = {"DB_Surah":["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"],"DB_Doa":["Judul","Arab","Terjemah"],"DB_Tahlil":["Judul","Arab","Terjemah"]};
  for (let n in s) { if(!SS.getSheetByName(n)) { SS.insertSheet(n).getRange(1, 1, 1, s[n].length).setValues([s[n]]); } }
}
