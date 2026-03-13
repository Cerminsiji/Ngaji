/**
 * Ngaji Digital Backend
 * Memastikan sinkronisasi Imsakiyah, Jadwal Sholat, dan Doa
 */
const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e.parameter.action;
  checkAndInitSheets();

  if (action) {
    try {
      let result;
      switch(action) {
        case 'sync': result = syncDoaFromEQuran(); break;
        case 'getSurah': result = getSheetData("DB_Surah"); break;
        case 'getDoa': result = getSheetData("DB_Doa"); break;
        case 'getTahlil': result = getSheetData("DB_Tahlil"); break;
        case 'getSholat': result = getJadwalEQuran(e.parameter.id); break;
        case 'getAyatData': result = fetchAyatFromAPI(e.parameter.surahId); break;
        case 'searchKota': result = callAPI(`https://equran.id/api/v2/imsakiyah/kota`); break;
        case 'getCalendar': result = getCalendarV3(); break;
        default: result = {status: false, message: "Aksi tidak ditemukan"};
      }
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({status: false, message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return HtmlService.createHtmlOutput("Ngaji Digital Backend Active");
}

// Mengambil Jadwal dari eQuran ID (v2)
function getJadwalEQuran(id) {
  const res = callAPI(`https://equran.id/api/v2/shalat/jadwal/${id}`);
  if(res && res.code === 200) {
    return { status: true, data: { jadwal: res.data } };
  }
  return { status: false };
}

// Sinkronisasi Doa dari eQuran ID (v2)
function syncDoaFromEQuran() {
  try {
    const res = callAPI("https://equran.id/api/v2/doa");
    if(res && res.code === 200) {
      const rows = res.data.map(d => [d.nama, d.lafal, d.terjemahan]);
      const sheet = SS.getSheetByName("DB_Doa");
      sheet.clear().getRange(1,1,1,3).setValues([["Judul","Arab","Terjemah"]]);
      sheet.getRange(2,1,rows.length,3).setValues(rows);
      
      // Bonus: Sync Surah sekalian jika diperlukan
      const resQ = callAPI("https://equran.id/api/v2/surat");
      if(resQ && resQ.code === 200) {
        const rowsQ = resQ.data.map(s => [s.nomor, s.namaLatin, s.nama, s.tempatTurun, s.jumlahAyat]);
        SS.getSheetByName("DB_Surah").clear().getRange(1,1,1,5).setValues([["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"]]);
        SS.getSheetByName("DB_Surah").getRange(2,1,rowsQ.length,5).setValues(rowsQ);
      }
      
      return {status: "success", message: "Database Doa & Surah Berhasil Disinkronkan!"};
    }
    return {status: "error", message: "Gagal mengambil data dari eQuran"};
  } catch (e) { return {status: "error", message: e.toString()}; }
}

function getCalendarV3() {
  const now = new Date();
  const dateStr = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd");
  const res = callAPI(`https://api.myquran.com/v3/cal/hijr/${dateStr}?method=standar`);
  if (res && res.status && res.data) {
    const d = res.data;
    return { 
      status: true, 
      masehi: `${d.ce.dayName}, ${d.ce.day} ${d.ce.monthName} ${d.ce.year}`, 
      hijri: `${d.hijr.day} ${d.hijr.monthName} ${d.hijr.year} H` 
    };
  }
  return { status: false };
}

function callAPI(url) {
  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    return JSON.parse(res.getContentText());
  } catch (e) { return { status: false }; }
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const head = data.shift();
  return data.map(r => { let o = {}; head.forEach((h, i) => { o[h] = r[i]; }); return o; });
}

function fetchAyatFromAPI(id) {
  const res = callAPI(`https://equran.id/api/v2/surat/${id}`);
  return res ? res.data : null;
}

function checkAndInitSheets() {
  const s = {"DB_Surah":["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"],"DB_Doa":["Judul","Arab","Terjemah"],"DB_Tahlil":["Judul","Arab","Terjemah"]};
  for (let n in s) { if(!SS.getSheetByName(n)) { SS.insertSheet(n).getRange(1, 1, 1, s[n].length).setValues([s[n]]); } }
}
