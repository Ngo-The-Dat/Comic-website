/* ==========================================================================
   APP LOGIC: WEB COMIC READER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentMode = 'scroll'; // 'scroll' | 'slide'
  let currentSlideIndex = 0;
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
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
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
      console.warn('Lỗi đọc reactions:', err);
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
  const defaultComments = [
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
  ];

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
    const all = [...customComments, ...defaultComments];
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
            <span class="comment-user-badge">${escapeHTML(c.badge || 'Bạn đọc')}</span>
            <span class="comment-time">• ${escapeHTML(c.time || 'Vừa xong')}</span>
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

      const author = nameInput.value.trim() || 'Lập trình viên ẩn danh';
      const content = textInput.value.trim();

      if (!content) return;

      const newComment = {
        author,
        badge: 'Dev Newbie',
        time: 'Vừa xong',
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
        fullscreenBtn.innerHTML = '⛶ <span>Thu nhỏ</span>';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        fullscreenBtn.innerHTML = '⛶ <span>Toàn màn</span>';
      }
      playArcadeSound('blip');
    });
  }

  // Initial setup
  setMode('scroll');
  renderComments();
});
