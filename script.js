/* =========================================================
   SCARLET.TIKSL.COM - JAVASCRIPT CORE LOGIC
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- STATE MANAGEMENT ---
  let isPremium = false;
  const SECRET_TOKEN = "Glass5522";

  // --- DOM ELEMENTS ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  const themeToggle = document.getElementById('themeToggle');
  const tiktokUrlInput = document.getElementById('tiktokUrl');
  const downloadBtn = document.getElementById('downloadBtn');
  const resSelect = document.getElementById('resSelect');
  const fpsSelect = document.getElementById('fpsSelect');
  const opt1080 = document.getElementById('opt1080');
  const opt60 = document.getElementById('opt60');
  const loader = document.getElementById('loader');
  const resultContainer = document.getElementById('resultContainer');
  const userTierBadge = document.getElementById('userTierBadge');
  const tierText = document.getElementById('tierText');
  const adBanner = document.getElementById('adBanner');
  const premiumBtn = document.getElementById('premiumBtn');
  const premiumModal = document.getElementById('premiumModal');
  const closeModal = document.getElementById('closeModal');
  const submitTokenBtn = document.getElementById('submitTokenBtn');
  const tokenInput = document.getElementById('tokenInput');
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput = document.getElementById('cmdInput');
  const cmdList = document.getElementById('cmdList');
  const pageTransition = document.getElementById('pageTransition');
  const logoText = document.getElementById('logoText');

  // --- 1. SOUND EFFECTS (Web Audio API) ---
  function playClickSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio Context Error:', e);
    }
  }

  // Universal Click Listener for Sound
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input, select, .cmd-list li')) {
      playClickSound();
    }
  });

  // --- 2. CUSTOM CURSOR TRAILING ---
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 250, fill: "forwards" });
  });

  // Cursor Hover Effect
  document.querySelectorAll('button, a, input, select, .tilt-element').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // --- 3. DARK / LIGHT MODE TOGGLE ---
  themeToggle.addEventListener('click', () => {
    triggerPageTransition(() => {
      document.body.classList.toggle('light-mode');
      document.body.classList.toggle('dark-mode');
    });
  });

  // --- 4. RIPPLE & BUTTON MORPH ANIMATION ---
  document.querySelectorAll('.ripple-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const ripple = this.getElementsByClassName('ripple')[0];
      if (ripple) { ripple.remove(); }

      this.appendChild(circle);

      // Button Morph Trigger
      this.classList.add('morphing');
      setTimeout(() => this.classList.remove('morphing'), 300);
    });
  });

  // --- 5. MAGNETIC BUTTONS ---
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // --- 6. PAGE TRANSITION ---
  function triggerPageTransition(callback) {
    pageTransition.classList.add('active');
    setTimeout(() => {
      if (callback) callback();
      pageTransition.classList.remove('active');
    }, 400);
  }

  // --- 7. TEXT SCRAMBLE ANIMATION ---
  function scrambleText(element, newText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let iteration = 0;
    const originalText = newText;
    
    clearInterval(element.scrambleInterval);
    element.scrambleInterval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(element.scrambleInterval);
      }
      iteration += 1 / 3;
    }, 30);
  }

  // Scramble Logo on Hover
  logoText.addEventListener('mouseenter', () => {
    scrambleText(logoText, "Scarlet.tikSl");
  });

  // --- 8. ROTATING PLACEHOLDER SEARCH TEXT (5s Interval) ---
  const placeholders = [
    "Scarlet Glass Liliya",
    "Masukan link tiktok",
    "Scarlet.TikSL.com"
  ];
  let placeholderIndex = 0;

  setInterval(() => {
    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    const nextText = placeholders[placeholderIndex];
    
    // Smooth opacity fade out and scramble
    tiktokUrlInput.style.opacity = '0';
    setTimeout(() => {
      tiktokUrlInput.setAttribute('placeholder', nextText);
      tiktokUrlInput.style.opacity = '1';
    }, 200);
  }, 5000);

  // --- 9. SCROLL REVEAL ANIMATIONS ---
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const elementInView = (el, dividend = 1.25) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el)) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', handleScrollAnimation);
  handleScrollAnimation(); // Initial check

  // --- 10. CONFETTI BURST EFFECT ---
  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#0066ff', '#ffffff']
      });
    }
  }

  // --- 11. COMMAND PALETTE (CTRL + K) ---
  function toggleCmdPalette(show) {
    if (show) {
      cmdOverlay.classList.remove('hidden');
      cmdInput.focus();
    } else {
      cmdOverlay.classList.add('hidden');
    }
  }

  cmdPaletteBtn.addEventListener('click', () => toggleCmdPalette(true));
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleCmdPalette(true);
    }
    if (e.key === 'Escape' && !cmdOverlay.classList.contains('hidden')) {
      toggleCmdPalette(false);
    }
  });

  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) toggleCmdPalette(false);
  });

  cmdList.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      toggleCmdPalette(false);
      if (action === 'theme') themeToggle.click();
      if (action === 'premium') premiumModal.classList.remove('hidden');
      if (action === 'clear') tiktokUrlInput.value = '';
      if (action === 'focus') tiktokUrlInput.focus();
    });
  });

  // Filter Command List
  cmdInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    cmdList.querySelectorAll('li').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(term) ? 'flex' : 'none';
    });
  });

  // --- 12. PREMIUM TOKEN ACTIVATION ---
  premiumBtn.addEventListener('click', () => premiumModal.classList.remove('hidden'));
  closeModal.addEventListener('click', () => premiumModal.classList.add('hidden'));

  submitTokenBtn.addEventListener('click', () => {
    const inputToken = tokenInput.value.trim();
    if (inputToken === SECRET_TOKEN) {
      isPremium = true;
      premiumModal.classList.add('hidden');
      
      // Update UI for Premium Status
      tierText.innerText = "Premium VIP Tier (Unlocked)";
      userTierBadge.style.borderColor = "#ffd700";
      userTierBadge.style.color = "#ffd700";
      userTierBadge.querySelector('.status-dot').style.backgroundColor = "#ffd700";
      userTierBadge.querySelector('.status-dot').style.boxShadow = "0 0 8px #ffd700";

      // Unlock 1080p and 60fps options
      opt1080.disabled = false;
      opt1080.innerText = "1080p Full HD (Unlocked)";
      opt60.disabled = false;
      opt60.innerText = "60 FPS High-Frame (Unlocked)";

      // Remove Ad Banner
      adBanner.remove();

      // Trigger Celebration
      triggerConfetti();
      alert('Aktivasi Premium Berhasil! Semua Fitur VIP & Bebas Iklan Telah Terbuka.');
    } else {
      alert('Token Salah! Silakan masukkan token yang valid.');
    }
  });

  // --- 13. TIKWM API INTEGRATION ---
  downloadBtn.addEventListener('click', async () => {
    const url = tiktokUrlInput.value.trim();

    if (!url) {
      alert('Sila masukan URL video TikTok yang valid!');
      return;
    }

    // Show Loader
    loader.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    try {
      // Call TikWM API
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      loader.classList.add('hidden');

      if (data.code === 0 && data.data) {
        const videoData = data.data;

        // Populate Video Details
        document.getElementById('videoCover').src = videoData.cover;
        document.getElementById('videoTitle').innerText = videoData.title || "TikTok Video tanpa judul";
        document.getElementById('videoAuthor').innerText = `@${videoData.author.unique_id || 'user'}`;
        document.getElementById('dlNoWm').href = videoData.play;
        document.getElementById('dlMusic').href = videoData.music;

        // Display Selected Resolution & FPS
        document.getElementById('resBadge').innerText = resSelect.value;
        document.getElementById('fpsBadge').innerText = fpsSelect.value;

        // Reveal Result
        resultContainer.classList.remove('hidden');
        triggerConfetti();
      } else {
        alert('Gagal mengambil video TikTok. Pastikan URL benar/publik.');
      }
    } catch (error) {
      loader.classList.add('hidden');
      alert('Terjadi kesalahan koneksi ke TikWM API.');
      console.error(error);
    }
  });
});
