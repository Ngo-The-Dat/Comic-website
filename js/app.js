/* ==========================================================================
   APP LOGIC: WEB COMIC READER (WITH BILINGUAL EN/VI SUPPORT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------- State variables -----------------
  let currentMode = 'scroll'; // 'scroll' | 'slide'
  let currentSlideIndex = 0;
  let currentLang = localStorage.getItem('comic_lang') || 'en'; // Default to English

  const panels = document.querySelectorAll('.comic-panel-card');
  const totalPanels = panels.length;

  // DOM Elements
  const progressBar = document.getElementById('reading-progress-bar');
  const readerWrapper = document.getElementById('reader-container');
  const btnModeScroll = document.getElementById('btn-mode-scroll');
  const btnModeSlide = document.getElementById('btn-mode-slide');
  const slidePrevBtn = document.getElementById('slide-prev-btn');
  const slideNextBtn = document.getElementById('slide-next-btn');
  const slideCounterEl = document.getElementById('slide-counter-display');
  const commentForm = document.getElementById('new-comment-form');
  const commentList = document.getElementById('comments-container');
  const commentCountEl = document.getElementById('comment-count');
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  const backToTopBtn = document.getElementById('btn-back-to-top');
  const jumpCommentsBtn = document.getElementById('btn-jump-comments');
  const langBtnEn = document.getElementById('lang-btn-en');
  const langBtnVi = document.getElementById('lang-btn-vi');

  // ----------------- Bilingual Translations Dictionary -----------------
  const translations = {
    en: {
      site_title: "The Bug Hunter - 03:00 AM Midnight Meltdown | Web Comic",
      meta_desc: "A hilarious online comic about a software developer's midnight battle against a fatal production bug.",
      nav_webtoon: "Webtoon",
      nav_slides: "Slides",
      hero_badge: "ONE-SHOT COMIC #01",
      hero_title: "THE BUG HUNTER: 03:00 AM MIDNIGHT MELTDOWN",
      tag_1: "#Comedy",
      tag_2: "#Programming",
      tag_3: "#Drama",
      tag_4: "#SciFi",
      tag_5: "#5Panels",
      hero_desc: "A true horror story that every programmer has experienced: At exactly 02:59 AM, just as you're about to log off and sleep, Production mysteriously crashes... The survival battle against the ancient bug begins!",
      stat_rating: "Rating",
      stat_views: "Reads",
      stat_comments: "Comments",
      stat_readtime: "Read Time",
      stat_min: "3 Mins",
      slide_prev: "◀ Prev Panel",
      slide_next: "Next Panel ▶",
      narrator_tag: "Narrator",
      dev_name: "Dat The Developer",
      monster_name: "Ancient NullPointerException",
      // Panel 1
      p1_title: "ACT 1: MIDNIGHT ALERT",
      p1_narration: "On a quiet, rainy night, while the entire city slept soundly, our developer smiled with the peaceful hope of a full night's rest...",
      p1_d1: '"Only one minute left until 3:00 AM... Everything is done. Time to shut down and finally sleep!"',
      p1_d2: '"WAIT WHAT?! \'CRITICAL 500: PRODUCTION CRASHED\'?! WHO ON EARTH MERGED CODE TO MAIN AT THIS HOUR?!"',
      // Panel 2
      p2_title: "ACT 2: AWAKENING OF THE BEAST",
      p2_narration: "From deep within the decaying legacy codebase, a thousand-year-old digital entity awakens, shattering all firewalls!",
      p2_d1: '"HAHAHA! I AM THE IMMORTAL BEAST OF DOOM! YOUR SERVERS BELONG TO ME NOW! FORGET ABOUT SLEEP TONIGHT!"',
      p2_d2: '"Impossible! It worked perfectly on my localhost without a single warning?!"',
      // Panel 3
      p3_title: "ACT 3: THE DEBUG SORCERY",
      p3_narration: "Refusing to surrender to the darkness, our hero unleashes the Ultimate Focus state, typing at the speed of sound!",
      p3_d1: '"You dare challenge me? You dare underestimate my 100 open StackOverflow tabs?!"',
      p3_d2: '"Hear my ultimate incantation: <code>console.log(\'HERE 1\'); console.log(\'HERE 2\');</code> — REVEAL YOURSELF, FOUL BUG!"',
      // Panel 4
      p4_title: "ACT 4: THE SHOCKING TRUTH",
      p4_narration: "After 2 hours of desperate tracing through the dark, a blinding ray of revelation suddenly illuminates the abyss!",
      p4_d1: '"WH-WHAT IS THIS?! A MISSING SEMICOLON <code>;</code> ON LINE 404?!"',
      p4_d2: '"Just one tiny little semicolon crippled a million-dollar server cluster for 2 agonizing hours?!"',
      // Panel 5
      p5_title: "ACT 5: DAWN OF VICTORY",
      p5_narration: "The semicolon added, committed, git push forced... All services light up green. Golden sunrise beams softly through the window.",
      p5_d1: '"Deploy successful! All systems are operational and green. Morning coffee has never tasted so sweet..."',
      p5_d2: '"Until we meet again, bugs... But for now, I\'m sleeping and ignoring all pings!"',
      // Engagement
      eng_title: "HOW DID YOU LIKE THIS COMIC?",
      eng_sub: "Leave a reaction to encourage the author to create Chapter 2!",
      rx_fire: "Lit!",
      rx_haha: "Haha",
      rx_shock: "Relatable",
      rx_heart: "Masterpiece",
      // Comments
      comm_heading: "READER COMMENTS",
      comm_name_placeholder: "Your name or dev handle...",
      comm_text_placeholder: "Share your thoughts about this legendary debugging night...",
      comm_btn: "Post Comment 💬",
      // Nav & Footer
      nav_top: "Top",
      nav_comments: "Comments",
      nav_fullscreen: "Fullscreen",
      footer_copy: "© 2026 The Bug Hunter. Stored in Web directory.",
      footer_tip: "Pro-tip: In 'Slides' mode, use Left/Right arrows or A/D keys to flip panels rapidly!",
      ad_label: "ADVERTISEMENT (728x90)"
    },
    vi: {
      site_title: "Huyền Thoại Fix Bug - Đêm Trắng 03:00 AM | Web Comic",
      meta_desc: "Trang web đọc truyện tranh comic online hài hước về cuộc chiến của lập trình viên với bug lúc nửa đêm.",
      nav_webtoon: "Webtoon",
      nav_slides: "Từng trang",
      hero_badge: "ONE-SHOT COMIC #01",
      hero_title: "HUYỀN THOẠI FIX BUG: ĐÊM TRẮNG 03:00 AM",
      tag_1: "#HàiHước",
      tag_2: "#LậpTrình",
      tag_3: "#KịchTính",
      tag_4: "#SciFi",
      tag_5: "#5KhungTranh",
      hero_desc: "Câu chuyện kinh dị có thật xảy ra với mọi lập trình viên trên Trái Đất: Đúng 02:59 sáng khi chuẩn bị tắt máy đi ngủ thì Production bỗng sập không lý do... Cuộc chiến sống còn với đại quái thú bug bắt đầu!",
      stat_rating: "Đánh giá",
      stat_views: "Lượt xem",
      stat_comments: "Bình luận",
      stat_readtime: "Thời lượng",
      stat_min: "3 Phút",
      slide_prev: "◀ Khung trước",
      slide_next: "Khung tiếp ▶",
      narrator_tag: "Người dẫn chuyện",
      dev_name: "Lập Trình Viên Đạt",
      monster_name: "Bug Thượng Cổ (NullPointer)",
      // Panel 1
      p1_title: "HỒI 1: CẢNH BÁO NỬA ĐÊM",
      p1_narration: "Vào một đêm mưa giông tĩnh mịch, khi cả thành phố đã chìm vào giấc ngủ sâu, anh Dev mỉm cười với hi vọng được ngủ một giấc trọn vẹn...",
      p1_d1: '"Chỉ còn 1 phút nữa là đúng 3h sáng rồi... May quá xong việc, tắt máy đi ngủ thôi!"',
      p1_d2: '"HẢ?! CÁI QUÁI GÌ ĐÂY?! \'PRODUCTION SẬP! CRITICAL 500 ERROR\'?! AI ĐÃ MERGE CODE LÊN MAIN LÚC NÀY THẾ NÀY?!"',
      // Panel 2
      p2_title: "HỒI 2: QUÁI VẬT THỨC GIẤC",
      p2_narration: "Từ sâu thẳm trong các tầng code mục nát, một thực thể tà ác nghìn năm tuổi thức giấc, phá tan mọi tường lửa!",
      p2_d1: '"HAHAHA! TA CHÍNH LÀ QUÁI VẬT TỬ THẦN! TOÀN BỘ SERVER ĐÃ BỊ TA CHIẾM GIỮ! NGƯƠI ĐỪNG MONG CÓ ĐƯỢC GIẤC NGỦ ĐÊM NAY!"',
      p2_d2: '"Vô lý! Rõ ràng dưới Localhost của mình chạy mượt mà không có một lỗi nào cơ mà?!"',
      // Panel 3
      p3_title: "HỒI 3: PHÉP THUẬT DEBUG",
      p3_narration: "Không đầu hàng trước bóng tối, người hùng của chúng ta kích hoạt trạng thái Thượng Thừa, gõ phím với vận tốc âm thanh!",
      p3_d1: '"Muốn hạ ta ư? Ngươi coi thường 100 tab StackOverflow của ta rồi đấy!"',
      p3_d2: '"Hỡi thần chú tối thượng: <code>console.log(\'HERE 1\'); console.log(\'HERE 2\');</code> — HIỆN HÌNH ĐI CON BUG KIA!"',
      // Panel 4
      p4_title: "HỒI 4: CHÂN LÝ PHÁT LỘ",
      p4_narration: "Sau 2 tiếng đồng hồ truy tìm trong màn đêm tăm tối, bức màn bí mật cuối cùng cũng được vén lên bằng một ánh hào quang chói lọi!",
      p4_d1: '"CÁI... CÁI GÌ THẾ NÀY?! MỘT DẤU CHẤM PHẨY <code>;</code> THIẾU Ở DÒNG 404?!"',
      p4_d2: '"Chỉ vì thiếu đúng một cái dấu chấm phẩy bé tí tẹo mà làm sập cả cụm máy chủ triệu đô suốt 2 tiếng đồng hồ sao trời ơi?!"',
      // Panel 5
      p5_title: "HỒI 5: BÌNH MINH CHIẾN THẮNG",
      p5_narration: "Thêm dấu chấm phẩy, commit, git push force... Toàn bộ hệ thống xanh trở lại. Ánh bình minh đầu ngày rọi chiếu qua khung cửa sổ.",
      p5_d1: '"Deploy success! Mọi dịch vụ đã xanh mượt trở lại. Cà phê sáng nay ngon ngọt đến lạ lùng..."',
      p5_d2: '"Tạm biệt nhé quái vật bug... Còn bây giờ, ta đi ngủ đây, ai gọi gì cũng mặc kệ!"',
      // Engagement
      eng_title: "BẠN CẢM THẤY BỘ TRUYỆN NÀY THẾ NÀO?",
      eng_sub: "Hãy thả cảm xúc để ủng hộ tác giả ra tiếp Chapter 2 nhé!",
      rx_fire: "Cháy quá!",
      rx_haha: "Cười bò",
      rx_shock: "Quá đồng cảm",
      rx_heart: "Tuyệt phẩm",
      // Comments
      comm_heading: "BÌNH LUẬN ĐỘC GIẢ",
      comm_name_placeholder: "Tên hoặc biệt danh của bạn...",
      comm_text_placeholder: "Chia sẻ cảm nghĩ của bạn về đêm fix bug huyền thoại này...",
      comm_btn: "Gửi bình luận 💬",
      // Nav & Footer
      nav_top: "Lên đầu",
      nav_comments: "Bình luận",
      nav_fullscreen: "Toàn màn",
      footer_copy: "© 2026 Huyền Thoại Fix Bug. Lưu trữ tại thư mục Web.",
      footer_tip: "Mẹo: Ở chế độ 'Từng trang', dùng phím mũi tên Trái/Phải hoặc phím A/D trên bàn phím để chuyển khung truyện nhanh!",
      ad_label: "QUẢNG CÁO (728x90)"
    }
  };

  // ----------------- Language Switcher Handler -----------------
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('comic_lang', lang);
    document.documentElement.lang = lang;

    // Toggle button active states
    if (lang === 'en') {
      langBtnEn.classList.add('active');
      langBtnVi.classList.remove('active');
    } else {
      langBtnVi.classList.add('active');
      langBtnEn.classList.remove('active');
    }

    const dict = translations[lang] || translations.en;

    // Update document title & meta
    document.title = dict.site_title;
    const metaDesc = document.querySelector('meta[data-i18n-desc="meta_desc"]');
    if (metaDesc) metaDesc.setAttribute('content', dict.meta_desc);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // Re-render comments with localized default comments
    renderComments();
  }

  langBtnEn.addEventListener('click', () => {
    setLanguage('en');
    playArcadeSound('blip');
  });

  langBtnVi.addEventListener('click', () => {
    setLanguage('vi');
    playArcadeSound('blip');
  });

  // ----------------- Sound Synthesis (Web Audio API) -----------------
  const audioCtx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playArcadeSound(type = 'blip') {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'blip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'victory') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'slide') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      // Audio playback fails silently if browser blocks
    }
  }

  // ----------------- Reading Progress -----------------
  function updateScrollProgress() {
    if (currentMode === 'scroll') {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      progressBar.style.width = percent + '%';
    } else {
      const percent = ((currentSlideIndex + 1) / totalPanels) * 100;
      progressBar.style.width = percent + '%';
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ----------------- View Mode Switcher -----------------
  function setMode(mode) {
    currentMode = mode;
    if (mode === 'scroll') {
      readerWrapper.classList.remove('reader-slide-mode');
      readerWrapper.classList.add('reader-scroll-mode');
      btnModeScroll.classList.add('active');
      btnModeSlide.classList.remove('active');
      panels.forEach(p => p.classList.remove('active'));
    } else {
      readerWrapper.classList.remove('reader-scroll-mode');
      readerWrapper.classList.add('reader-slide-mode');
      btnModeSlide.classList.add('active');
      btnModeScroll.classList.remove('active');
      showSlide(currentSlideIndex);
    }
    updateScrollProgress();
  }

  btnModeScroll.addEventListener('click', () => {
    setMode('scroll');
    playArcadeSound('blip');
  });

  btnModeSlide.addEventListener('click', () => {
    setMode('slide');
    playArcadeSound('blip');
  });

  // ----------------- Slide Mode Navigation -----------------
  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalPanels) index = totalPanels - 1;
    currentSlideIndex = index;

    panels.forEach((panel, i) => {
      if (i === currentSlideIndex) {
        panel.classList.add('active');
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        panel.classList.remove('active');
      }
    });

    slideCounterEl.textContent = `${currentSlideIndex + 1} / ${totalPanels}`;
    slidePrevBtn.disabled = currentSlideIndex === 0;
    slideNextBtn.disabled = currentSlideIndex === totalPanels - 1;

    updateScrollProgress();
  }

  slidePrevBtn.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      showSlide(currentSlideIndex - 1);
      playArcadeSound('slide');
    }
  });

  slideNextBtn.addEventListener('click', () => {
    if (currentSlideIndex < totalPanels - 1) {
      showSlide(currentSlideIndex + 1);
      playArcadeSound('slide');
    }
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return; // Skip if typing in comments
    }

    if (currentMode === 'slide') {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (currentSlideIndex < totalPanels - 1) {
          showSlide(currentSlideIndex + 1);
          playArcadeSound('slide');
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (currentSlideIndex > 0) {
          showSlide(currentSlideIndex - 1);
          playArcadeSound('slide');
        }
      }
    }
  });

  // ----------------- Reactions & Floating Emojis -----------------
  const reactions = {
    fire: { count: 482, emoji: '🔥' },
    haha: { count: 326, emoji: '😂' },
    shock: { count: 189, emoji: '😱' },
    heart: { count: 654, emoji: '❤️' }
  };

  // Load reactions from localStorage
  const savedReactions = localStorage.getItem('comic_reactions_data');
  if (savedReactions) {
    try {
      const parsed = JSON.parse(savedReactions);
      Object.keys(parsed).forEach(key => {
        if (reactions[key]) {
          reactions[key].count = parsed[key].count;
          if (parsed[key].userReacted) {
            const btn = document.querySelector(`.reaction-btn[data-reaction="${key}"]`);
            if (btn) btn.classList.add('reacted');
          }
        }
      });
    } catch (err) {
      console.warn('Reactions parse error:', err);
    }
  }

  // Update initial reaction display
  Object.keys(reactions).forEach(key => {
    const countSpan = document.getElementById(`count-${key}`);
    if (countSpan) countSpan.textContent = reactions[key].count;
  });

  function createFloatingEmoji(x, y, emojiChar) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emojiChar;
    el.style.left = `${x - 15}px`;
    el.style.top = `${y - 20}px`;
    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1200);
  }

  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const reactionType = btn.getAttribute('data-reaction');
      if (!reactions[reactionType]) return;

      const isReacted = btn.classList.contains('reacted');
      if (isReacted) {
        reactions[reactionType].count--;
        btn.classList.remove('reacted');
      } else {
        reactions[reactionType].count++;
        btn.classList.add('reacted');
        playArcadeSound('victory');

        // Create 3 floating emojis
        const rect = btn.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 20;
            createFloatingEmoji(rect.left + rect.width / 2 + offsetX, rect.top + offsetY, reactions[reactionType].emoji);
          }, i * 120);
        }
      }

      document.getElementById(`count-${reactionType}`).textContent = reactions[reactionType].count;

      // Persist to localStorage
      const saveData = {};
      Object.keys(reactions).forEach(k => {
        const b = document.querySelector(`.reaction-btn[data-reaction="${k}"]`);
        saveData[k] = {
          count: reactions[k].count,
          userReacted: b ? b.classList.contains('reacted') : false
        };
      });
      localStorage.setItem('comic_reactions_data', JSON.stringify(saveData));
    });
  });

  // ----------------- Comment System -----------------
  const localizedDefaultComments = {
    en: [
      {
        author: 'Alex (Senior Bug Slayer)',
        badge: 'PRO',
        time: '15 mins ago',
        content: 'I am laughing in tears because of how painfully accurate this is! That feeling at 3:00 AM tracing logs only to find a missing semicolon ; is a universal developer rite of passage.'
      },
      {
        author: 'Sarah Chen',
        badge: 'Reader',
        time: '45 mins ago',
        content: 'The panel with the console.log spell casting is pure gold! Can\'t wait for Chapter 2: The Git Merge Conflict Disaster.'
      },
      {
        author: 'Marcus TechLead',
        badge: 'Reviewer',
        time: '2 hours ago',
        content: 'Hilarious storytelling, awesome comic art style. 10/10 for the facial expression in Panel 4 when enlightenment struck!'
      }
    ],
    vi: [
      {
        author: 'Hoàng Long (Senior Bug Finder)',
        badge: 'PRO',
        time: '15 phút trước',
        content: 'Cười ra nước mắt vì quá chân thực! Cái cảm giác 3h sáng mò từng dòng log xong phát hiện ra thiếu dấu chấm phẩy ; hoặc thừa một dấu ngoặc nhọn } đúng là huyền thoại của mọi Dev.'
      },
      {
        author: 'Minh Thảo',
        badge: 'Độc giả',
        time: '45 phút trước',
        content: 'Khung tranh Panel 3 vẽ phép thuật console.log ngầu bá cháy bọ chét luôn haha! Hóng chapter 2 cuộc chiến với Merge Conflict git push force.'
      },
      {
        author: 'Tuấn Anh TechLead',
        badge: 'Reviewer',
        time: '2 giờ trước',
        content: 'Cốt truyện ngắn gọn mà đầy đủ drama, hình ảnh comic rất phong cách. 10/10 điểm biểu cảm ở Panel 4 khi nhận ra chân lý!'
      }
    ]
  };

  function getStoredComments() {
    const saved = localStorage.getItem('comic_user_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  function renderComments() {
    const customComments = getStoredComments();
    const defaults = localizedDefaultComments[currentLang] || localizedDefaultComments.en;
    const all = [...customComments, ...defaults];
    commentCountEl.textContent = `(${all.length})`;

    commentList.innerHTML = '';
    all.forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-item';

      const initial = c.author.charAt(0).toUpperCase();
      item.innerHTML = `
        <div class="comment-user-avatar">${initial}</div>
        <div class="comment-content">
          <div class="comment-user-name">
            <span>${escapeHTML(c.author)}</span>
            <span class="comment-user-badge">${escapeHTML(c.badge || (currentLang === 'vi' ? 'Bạn đọc' : 'Reader'))}</span>
            <span class="comment-time">• ${escapeHTML(c.time || (currentLang === 'vi' ? 'Vừa xong' : 'Just now'))}</span>
          </div>
          <div class="comment-body">${escapeHTML(c.content)}</div>
        </div>
      `;
      commentList.appendChild(item);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('comment-author-name');
      const textInput = document.getElementById('comment-text-area');

      const author = nameInput.value.trim() || (currentLang === 'vi' ? 'Lập trình viên ẩn danh' : 'Anonymous Dev');
      const content = textInput.value.trim();

      if (!content) return;

      const newComment = {
        author,
        badge: currentLang === 'vi' ? 'Dev Newbie' : 'Dev Newbie',
        time: currentLang === 'vi' ? 'Vừa xong' : 'Just now',
        content
      };

      const customComments = getStoredComments();
      customComments.unshift(newComment);
      localStorage.setItem('comic_user_comments', JSON.stringify(customComments));

      textInput.value = '';
      renderComments();
      playArcadeSound('victory');
    });
  }

  // ----------------- Floating Toolbar Actions -----------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playArcadeSound('blip');
    });
  }

  if (jumpCommentsBtn) {
    jumpCommentsBtn.addEventListener('click', () => {
      const commentsSection = document.getElementById('comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
        playArcadeSound('blip');
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fullscreenBtn.innerHTML = `⛶ <span>${currentLang === 'vi' ? 'Thu nhỏ' : 'Exit'}</span>`;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        fullscreenBtn.innerHTML = `⛶ <span>${currentLang === 'vi' ? 'Toàn màn' : 'Fullscreen'}</span>`;
      }
      playArcadeSound('blip');
    });
  }

  // ----------------- Initial Initialization -----------------
  setMode('scroll');
  setLanguage(currentLang);
});
