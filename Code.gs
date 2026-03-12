/**
 * NGAJI REK - STABLE VERSION
 */
const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e.parameter.action;
  
  // 1. Inisialisasi Sheet otomatis jika belum ada
  checkAndInitSheets();

  // 2. Jika ada parameter 'action', kirim data JSON
  if (action) {
    let result;
    try {
      switch(action) {
        case 'sync': result = flushAndSync(); break;
        case 'getSurah': result = getSheetData("DB_Surah"); break;
        case 'getDoa': result = getSheetData("DB_Doa"); break;
        case 'getTahlil': result = getSheetData("DB_Tahlil"); break;
        case 'getSholat': result = getJadwalByCityId(e.parameter.id); break;
        case 'getAyatData': result = fetchAyatFromAPI(e.parameter.surahId); break;
        default: result = {status: "error", message: "Action tidak dikenal"};
      }
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.message})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // 3. Jika dibuka langsung tanpa parameter, tampilkan UI
  return HtmlService.createTemplateFromFile('index').evaluate()
         .setTitle('Ngaji | Edisi Digital')
         .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
         .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return []; // Jika hanya ada header
  const headers = values.shift();
  return values.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function flushAndSync() {
  try {
    // Sync Surah List
    const resQ = UrlFetchApp.fetch("https://equran.id/api/v2/surat");
    const jsonQ = JSON.parse(resQ.getContentText());
    if(jsonQ.data) {
      const rowsQ = jsonQ.data.map(s => [s.nomor, s.namaLatin, s.nama, s.tempatTurun, s.jumlahAyat]);
      const sheetQ = SS.getSheetByName("DB_Surah");
      sheetQ.clear().getRange(1,1,1,5).setValues([["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"]]);
      sheetQ.getRange(2,1,rowsQ.length,5).setValues(rowsQ);
    }

    // Sync Doa
    const resD = UrlFetchApp.fetch("https://api.myquran.com/v2/doa/semua");
    const jsonD = JSON.parse(resD.getContentText());
    if(jsonD.data) {
      const rowsD = jsonD.data.map(d => [d.judul, d.arab, d.indo]);
      const sheetD = SS.getSheetByName("DB_Doa");
      sheetD.clear().getRange(1,1,1,3).setValues([["Judul","Arab","Terjemah"]]);
      sheetD.getRange(2,1,rowsD.length,3).setValues(rowsD);
    }

    // Sync Tahlil
    const resT = UrlFetchApp.fetch("https://islamic-api-zhirrr.vercel.app/api/tahlil");
    const jsonT = JSON.parse(resT.getContentText());
    if(jsonT.data) {
      const rowsT = jsonT.data.map(t => [t.title, t.arabic, t.translation]);
      const sheetT = SS.getSheetByName("DB_Tahlil");
      sheetT.clear().getRange(1,1,1,3).setValues([["Judul","Arab","Terjemah"]]);
      sheetT.getRange(2,1,rowsT.length,3).setValues(rowsT);
    }
    return {status: "success", message: "Data berhasil diperbarui"};
  } catch (e) {
    return {status: "error", message: e.toString()};
  }
}

function getJadwalByCityId(id) {
  const date = Utilities.formatDate(new Date(), "GMT+7", "yyyy/MM/dd");
  const res = UrlFetchApp.fetch(`https://api.myquran.com/v2/sholat/jadwal/${id}/${date}`);
  const json = JSON.parse(res.getContentText());
  if(json.data) {
    const subuh = json.data.jadwal.subuh;
    const [h, m] = subuh.split(':').map(Number);
    let d = new Date(); d.setHours(h, m - 10, 0);
    json.data.jadwal.imsak = Utilities.formatDate(d, "GMT+7", "HH:mm");
  }
  return json;
}

function fetchAyatFromAPI(id) {
  const res = UrlFetchApp.fetch(`https://equran.id/api/v2/surat/${id}`);
  return JSON.parse(res.getContentText()).data;
}

function checkAndInitSheets() {
  const sheets = {
    "DB_Surah": ["ID","Nama","Nama Arab","Tipe","Jumlah Ayat"],
    "DB_Doa": ["Judul","Arab","Terjemah"],
    "DB_Tahlil": ["Judul","Arab","Terjemah"]
  };
  for (let name in sheets) {
    if (!SS.getSheetByName(name)) {
      SS.insertSheet(name).getRange(1, 1, 1, sheets[name].length).setValues([sheets[name]]);
    }
  }
}
