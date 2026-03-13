/**
 * Ngaji Digital Backend
 */
const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e.parameter.action;
  checkAndInitSheets();

  if (action) {
    try {
      let result;
      switch(action) {
        case 'sync': result = flushAndSync(); break;
        case 'getSurah': result = getSheetData("DB_Surah"); break;
        case 'getDoa': result = getSheetData("DB_Doa"); break;
        case 'getTahlil': result = getSheetData("DB_Tahlil"); break;
        case 'getSholat': result = getJadwalV3(e.parameter.id); break;
        case 'getAyatData': result = fetchAyatFromAPI(e.parameter.surahId); break;
        case 'searchKota': 
          result = callAPI(`https://api.myquran.com/v3/sholat/kabkota/cari/${encodeURIComponent(e.parameter.q || "jakarta")}`); 
          break;
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

function getJadwalV3(id) {
  const now = new Date();
  const dateStr = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd");
  const res = callAPI(`https://api.myquran.com/v3/sholat/jadwal/${id}/${dateStr}`);
  
  if(res && res.status && res.data && res.data.jadwal) {
    return { status: true, data: { jadwal: res.data.jadwal } };
  }
  return { status: false };
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const head = data.shift();
  return data.map(r => { 
    let o = {}; head.forEach((h, i) => { o[h] = r[i]; }); return o; 
  });
}

function flushAndSync() {
  try {
    const resQ = callAPI("https://equran.id/api/v2/surat");
    if(resQ && resQ.data) {
      const rows = resQ.data.map(s => [s.nomor, s.namaLatin, s.nama, s.tempatTurun, s.jumlahAyat]);
      SS.getSheetByName("DB_Surah").clear().getRange(1,1,1,5).setValues([["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"]]);
      SS.getSheetByName("DB_Surah").getRange(2,1,rows.length,5).setValues(rows);
    }
    const resD = callAPI("https://api.myquran.com/v3/doa/semua");
    if(resD && resD.status && resD.data) {
      const rows = resD.data.map(d => [d.judul, d.arab, d.indo]);
      SS.getSheetByName("DB_Doa").clear().getRange(1,1,1,3).setValues([["Judul","Arab","Terjemah"]]);
      SS.getSheetByName("DB_Doa").getRange(2,1,rows.length,3).setValues(rows);
    }
    return {status: "success", message: "Sinkronisasi Berhasil!"};
  } catch (e) { return {status: "error", message: e.toString()}; }
}

function callAPI(url) {
  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    return JSON.parse(res.getContentText());
  } catch (e) { return { status: false }; }
}

function fetchAyatFromAPI(id) {
  const res = callAPI(`https://equran.id/api/v2/surat/${id}`);
  return res ? res.data : null;
}

function checkAndInitSheets() {
  const s = {"DB_Surah":["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"],"DB_Doa":["Judul","Arab","Terjemah"],"DB_Tahlil":["Judul","Arab","Terjemah"]};
  for (let n in s) { if(!SS.getSheetByName(n)) { SS.insertSheet(n).getRange(1, 1, 1, s[n].length).setValues([s[n]]); } }
}
