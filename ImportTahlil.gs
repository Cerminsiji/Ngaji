/**
 * Fungsi untuk otomatis mengisi Database Tahlil
 * Jalankan fungsi ini satu kali saja melalui editor Apps Script
 */
function setupDatabaseTahlil() {
  const sheetName = "DB_Tahlil";
  let sheet = SS.getSheetByName(sheetName);
  
  // Jika sheet belum ada, buat baru
  if (!sheet) {
    sheet = SS.insertSheet(sheetName);
  }
  
  // Header tabel sesuai struktur backend kita
  const header = [["id", "judul", "arab", "latin", "terjemah"]];
  
  // Data lengkap tahlil
  const data = [
    ["1", "Hadrah (Pengantar)", "إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَآلِهِ وَصَحْبِهِ شَيْءٌ لِلّٰهِ لَهُمُ الْفَاتِحَةُ", "Ila hadrotin nabiyyil musthofa shollallohu 'alaihi wasallam wa alihi wasohbihi syai-un lillahi lahumul fatihah.", "Untuk yang terhormat Nabi pilihan, semoga Allah mencurahkan shalawat dan salam kepadanya, keluarganya, dan sahabatnya. Sesuatu bagi Allah, bagi mereka Al-Fatihah."],
    ["2", "Surah Al-Ikhlas (3x)", "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللهُ أَحَدٌ. اللهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (٣×)", "Bismillahir rohmanir rohim. Qul huwallahu ahad. Allahush shomad. Lam yalid walam yuulad. Walam yakul lahu kufuwan ahad. (3x)", "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu."],
    ["3", "Tahlil & Takbir", "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ", "La ilaha illallahu wallahu akbar.", "Tiada Tuhan selain Allah, dan Allah Maha Besar."],
    ["4", "Surah Al-Falaq", "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِنْ شَرِّ مَا خَلَقَ. وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", "Bismillahir rohmanir rohim. Qul a'udzu birobbil falaq. Min syarri ma kholaq. Wa min syarri ghosiqin idza waqob.", "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh."],
    ["5", "Surah An-Nas", "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلٰهِ النَّاسِ. مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ", "Bismillahir rohmanir rohim. Qul a'udzu birobbin nas. Malikin nas. Ilahin nas.", "Katakanlah: Aku berlindung kepada Tuhan (yang memelihara) manusia. Raja manusia. Sembahan manusia."],
    ["6", "Al-Fatihah", "بِسْمِ اللّٰهِ الرَّحٰنِ الرَّحِيْمِ . اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ . اَلرَّحْمٰنِ الرَّحِيْمِ . مَالِكِ يَوْمِ الدِّيْنِ . إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ . اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ", "Bismillahir rohmanir rohim. Alhamdulillahi robbil 'alamin. Ar-rohmanir rohim. Maliki yaumid din.", "Segala puji bagi Allah, Tuhan semesta alam. Maha Pemurah lagi Maha Penyayang. Yang menguasai di Hari Pembalasan."],
    ["7", "Awal Surah Al-Baqarah", "الم . ذٰلِكَ الْكِتٰبُ لَا رَيْبَ فِيْهِ هُدًى لِلْمُتَّقِيْنَ . الَّذِيْنَ يُؤْمِنُوْنَ بِالْغَيْبِ وَيُقِيْمُوْنَ الصَّلٰوةَ وَمِمَّا رَزَقْنٰهُمْ يُنْفِقُوْنَ", "Alif lam mim. Dzalikal kitabu la roiba fih, hudal lil muttaqin.", "Alif laam miim. Kitab (Al Quran) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertaqwa."],
    ["8", "Al-Baqarah 163", "وَإِلٰهُكُمْ إِلٰهٌ وَاحِدٌ لَا إِلٰهَ إِلَّا هُوَ الرَّحْمٰنُ الرَّحِيْمُ", "Wa ilahukum ilahun wahidun la ilaha illa huwar rohmanur rohim.", "Dan Tuhanmu adalah Tuhan Yang Maha Esa; tidak ada Tuhan melainkan Dia, Yang Maha Pemurah lagi Maha Penyayang."],
    ["9", "Ayat Kursi", "اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ", "Allahu la ilaha illa huwal hayyul qoyyum, la ta'khudzuhu sinatun wala naum.", "Allah, tidak ada Tuhan melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya)."],
    ["10", "Akhir Al-Baqarah", "لِلّٰهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ وَإِنْ تُبْدُوا مَا فِي أَنْفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُمْ بِهِ اللّٰهُ", "Lillahi ma fissamawati wa ma fil ardh.", "Kepunyaan Allah-lah segala apa yang ada di langit dan apa yang ada di bumi."],
    ["11", "Istighotsah", "ارْحَمْنَا يَا أَرْحَمَ الرَّاحِمِينَ (٧×). رَحْمَةُ اللهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ إِنَّهُ حَمِيدٌ مَجِيدٌ", "Irhamna ya arhamar rohimin (7x).", "Kasihanilah kami, wahai Tuhan Yang Maha Penyayang (7x). Rahmat Allah dan keberkahan-Nya dicurahkan atas kamu."],
    ["12", "Shalawat Nabi", "اللَّهُمَّ صَلِّ أَفْضَلَ الصَّلَاةِ عَلَى أَسْعَدِ مَخْلُوقَاتِكَ نُورِ الْهُدَى سَيِّدِنَا مُحَمَّدٍ", "Allahumma sholli afdholas sholati 'ala as'adi makhluqotika nuril huda.", "Ya Allah, tambahkanlah kesejahteraan yang paling utama kepada makhluk-Mu yang paling bahagia."],
    ["13", "Hasbunallah & La Hawla", "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ. وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", "Hasbunallahu wa ni'mal wakil. Wala hawla wala quwwata illa billah.", "Cukuplah Allah bagi kami dan Dia sebaik-baik penolong. Tidak ada daya kecuali dengan pertolongan Allah."],
    ["14", "Istighfar (3x)", "أَسْتَغْفِرُ اللهَ الْعَظِيمَ (٣×)", "Astaghfirullahal 'adzim (3x).", "Aku memohon ampun kepada Allah Yang Maha Agung (3x)."],
    ["15", "Tahlil Inti", "لَا إِلٰهَ إِلَّا اللهُ (١٠٠×)", "La ilaha illallah (100x).", "Tiada Tuhan selain Allah (100x)."],
    ["16", "Kalimat Tauhid", "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ", "La ilaha illallahu muhammadur rosulullahi.", "Tiada Tuhan selain Allah, Nabi Muhammad adalah utusan Allah."],
    ["17", "Doa Tahlil (Buka)", "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ حَمْدًا يُوَافِي نِعَمَهُ", "Bismillahir rohmanir rohim. Alhamdulillahi robbil 'alamin.", "Segala puji bagi Allah, Tuhan semesta alam, pujian yang sebanding dengan nikmat-nikmat-Nya."],
    ["18", "Doa Tahlil (Isi)", "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ. اللَّهُمَّ تَقَبَّلْ وَأَوْصِلْ ثَوَابَ مَا قَرَأْنَاهُ", "Allahumma sholli wa sallim 'ala sayyidina muhammadin.", "Ya Allah, terimalah dan sampaikanlah pahala Al-Quran yang kami baca, tahlil kami, dan tasbih kami."],
    ["19", "Doa Ahli Kubur", "اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ", "Allahummaghfir lahum warhamhum wa 'afihim wa'fu 'anhum.", "Ya Allah, ampunilah mereka, kasihanilah mereka, sejahterakanlah mereka dan maafkanlah mereka."],
    ["20", "Doa Penutup", "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", "Robbana atina fiddunya hasanatan wa fil akhiroti hasanatan.", "Wahai Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat."]
  ];
  
  sheet.clear();
  sheet.getRange(1, 1, 1, header[0].length).setValues(header).setFontWeight("bold").setBackground("#dcfce7");
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 5);
  
  Logger.log("Database Tahlil berhasil dibuat!");
}
