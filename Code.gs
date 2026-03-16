/** * NGAJI DIGITAL ENGINE 2.1.0-Ramadhan-Edition
 */
const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e ? e.parameter.action : "index";
  checkAndInitSheets();
  
  try {
    let result;
    switch(action) {
      case 'getCalendar': result = getCalendarData(); break;
      case 'getSholat': result = getJadwalBulan(e.parameter.id); break;
      case 'getSurah': result = getSheetData("DB_Surah"); break;
      case 'getAyatData': result = getAyatWithSync(e.parameter.surahId); break;
      case 'getTahlil': result = getSheetData("DB_Tahlil"); break;
      case 'getDoa': result = getDoaWithSync(); break;
      case 'findHadits': result = findHaditsGrouped(e.parameter.q, e.parameter.kitab); break;
      case 'searchByCoords': result = callAPI(`https://api.myquran.com/v2/sholat/kota/lokasi/${e.parameter.lat}/${e.parameter.lng}`); break;
      case 'searchKota': result = callAPI(`https://api.myquran.com/v2/sholat/kota/cari/${e.parameter.q}`); break;
      default: 
        return HtmlService.createTemplateFromFile('index').evaluate()
               .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
               .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
               .setTitle('Ngaji Digital 2026');
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: false, msg: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function getCalendarData() { 
  try { 
    const now = new Date(); 
    
    // Array Nama Hari dan Bulan Indonesia
    const daysIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthsIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    // Format Masehi Bahasa Indonesia
    const masehiStr = `${daysIndo[now.getDay()]}, ${now.getDate()} ${monthsIndo[now.getMonth()]} ${now.getFullYear()}`;
    
    // Menggunakan API Aladhan sesuai permintaan
    const url = `https://api.aladhan.com/v1/gToH/${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`;
    const response = UrlFetchApp.fetch(url, { "muteHttpExceptions": true });
    const res = JSON.parse(response.getContentText());
    
    let hijriStr = "25 RAMADHAN 1447 H"; // Fallback jika API bermasalah

    if (res && res.data && res.data.hijri) {
      const h = res.data.hijri;
      // Pemetaan nama bulan Aladhan ke format Indonesia yang umum
      const bulanH = {
        "Ramadān": "RAMADHAN", "Shawwāl": "SYAWAL", "Dhū al-Qi'dah": "DZULQA'DAH",
        "Dhū al-Ḥijjah": "DZULHIJJAH", "Muḥarram": "MUHARRAM", "Ṣafar": "SAFAR"
      };
      const namaBulanH = bulanH[h.month.en] || h.month.en.toUpperCase();
      
      // Format: Tanggal Bulan Tahun (Contoh: 25 RAMADHAN 1447 H)
      hijriStr = `${h.day} ${namaBulanH} ${h.year} H`;
    }
    
    return { status: true, masehi: masehiStr, hijri: hijriStr }; 
  } catch (e) { 
    return { status: true, masehi: "Senin, 16 Maret 2026", hijri: "25 RAMADHAN 1447 H" }; 
  } 
}


// Integrasi GPS dengan API MyQuran
function getCityByCoords(lat, lng) {
  const res = callAPI(`https://api.myquran.com/v2/sholat/kota/lokasi/${lat}/${lng}`);
  if (res && res.status) {
    return { status: true, data: res.data };
  }
  return { status: false, msg: "Lokasi tidak ditemukan" };
}


// FUNGSI PENDUKUNG LAINNYA (Sesuai Protokol Sebelumnya)
function getAyatWithSync(surahId) {
  const sheetName = `Surah_${surahId}`;
  let sheet = SS.getSheetByName(sheetName);
  
  if (!sheet) {
    const res = callAPI(`https://equran.id/api/v2/surat/${surahId}`);
    if (res && res.data) {
      sheet = SS.insertSheet(sheetName);
      sheet.appendRow(['Nomor','Arab','Latin','Terjemah']);
      const rows = res.data.ayat.map(a => [a.nomorAyat, a.teksArab, a.teksLatin, a.teksIndonesia]);
      sheet.getRange(2, 1, rows.length, 4).setValues(rows);
      
      // KIRIM NAMA ASLI
      return { 
        status: true, 
        ayat: res.data.ayat, 
        nama: res.data.namaLatin.toUpperCase(), // Pastikan nama asli terkirim
        juz: res.data.ayat[0].juz 
      };
    }
  }
  
  // Jika mengambil dari Sheet, kita perlu tahu namanya. 
  // Solusi terbaik: Ambil nama dari daftar surah utama
  const listSurah = getSheetData("DB_Surah");
  const detailSurah = listSurah.find(s => s.id == surahId);
  const namaAsli = detailSurah ? detailSurah.nama : "SURAH " + surahId;

  const data = getSheetData(sheetName);
  return { 
    status: true, 
    ayat: data.map(d => ({ 
      nomorAyat: d.nomor, 
      teksArab: d.arab, 
      teksLatin: d.latin, 
      teksIndonesia: d.terjemah 
    })), 
    nama: namaAsli.toUpperCase(),
    juz: data[0] ? data[0].juz : "-"
  };
}

function getDoaWithSync() {
  let sheet = SS.getSheetByName("DB_Doa");
  let data = getSheetData("DB_Doa");
  if (data.length === 0) {
    const res = callAPI("https://open-api.my.id/api/doa");
    if (res && Array.isArray(res)) {
      const rows = res.map(d => [d.doa, d.ayat, d.artinya]);
      sheet.getRange(2, 1, rows.length, 3).setValues(rows);
      return getSheetData("DB_Doa");
    }
  }
  return data;
}

function findHaditsGrouped(q, kitab) {
  const query = q ? q.toLowerCase() : "";
  const results = {};
  const perawi = ['Bukhari','Muslim','Abu Daud','Ahmad','Tirmidzi','Darimi','Nasai','Ibnu Majah','Malik'];
  const target = (kitab && kitab !== 'Semua') ? [kitab] : perawi;
  target.forEach(name => {
    const sheet = SS.getSheetByName(name);
    if (!sheet) return;
    const data = sheet.getDataRange().getValues();
    const head = data[0].map(h => h.toString().toLowerCase().trim());
    const idxArab = head.indexOf('arab');
    const idxIndo = head.indexOf('indo') !== -1 ? head.indexOf('indo') : head.indexOf('terjemah');
    const matches = [];
    for(let i=1; i<data.length; i++){
      if (data[i].join(" ").toLowerCase().includes(query)) {
        matches.push({ no: data[i][0], arab: data[i][idxArab], indo: data[i][idxIndo] || "Terjemahan tidak tersedia", kitab: name });
      }
      if(matches.length > 15) break;
    }
    if(matches.length > 0) results[name] = matches;
  });
  return results;
}

function getJadwalBulan(id) {
  const cityId = id || "1301";
  const now = new Date();
  const res = callAPI(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${now.getFullYear()}/${now.getMonth()+1}`);
  return (res && res.data) ? { status: true, data: res.data } : { status: false };
}

function getSheetData(name) {
  const sheet = SS.getSheetByName(name);
  if(!sheet || sheet.getLastRow() < 2) return [];
  const data = sheet.getDataRange().getValues();
  const head = data.shift();
  return data.map(r => {
    let o = {};
    head.forEach((h, i) => { o[h.toString().toLowerCase().trim()] = r[i]; });
    return o;
  });
}

function callAPI(url) {
  try { return JSON.parse(UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText()); } catch (e) { return null; }
}

function checkAndInitSheets() {
  const sheets = ["DB_Surah", "DB_Tahlil", "DB_Doa", "Bukhari", "Muslim", "Abu Daud", "Ahmad", "Tirmidzi", "Darimi", "Nasai", "Ibnu Majah", "Malik"];
  sheets.forEach(n => { if(!SS.getSheetByName(n)) SS.insertSheet(n).appendRow(['id','arab','indo']); });
}
