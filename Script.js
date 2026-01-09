// ==========================================
// MODERN macOS-INSPIRED PORTFOLIO - JavaScript
// ==========================================

(function() {
  'use strict';

  // ========== Clock Functionality ==========
  const clockEl = document.getElementById('clock');
  let showingFullDate = false;

  /**
   * Updates the clock display
   * @param {boolean} showFull - Whether to show full date format
   */
  function updateClock(showFull = false) {
    if (!clockEl) return;

    const now = new Date();

    // Format time (HH:MM)
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (showFull) {
      // Full date format: "3:45 PM • Mon, January 9, 2026"
      const fullDate = now.toLocaleDateString([], {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      clockEl.textContent = `${time} • ${fullDate}`;
    } else {
      // Short format: "3:45 PM Jan 09"
      const shortDate = now.toLocaleDateString([], {
        month: 'short',
        day: '2-digit'
      });
      clockEl.textContent = `${time} ${shortDate}`;
    }
  }

  // Initialize clock
  updateClock(false);
  
  // Update every minute
  setInterval(() => {
    if (!showingFullDate) {
      updateClock(false);
    }
  }, 60000);

  // Show full date on hover
  if (clockEl) {
    clockEl.addEventListener('mouseenter', () => {
      showingFullDate = true;
      updateClock(true);
    });

    clockEl.addEventListener('mouseleave', () => {
      showingFullDate = false;
      updateClock(false);
    });
  }

  // ========== Wallpaper Chooser ==========
  const overlay = document.getElementById('wallpaperOverlay');
  const openBtn = document.getElementById('openWallpaper');
  const closeBtn = document.getElementById('closeWallpaper');
  const grid = document.getElementById('wallpaperGrid');

  /**
   * Sets the wallpaper with preloading to prevent flash
   * @param {string} url - Image URL for the wallpaper
   */
  function setWallpaper(url) {
    if (!url) return;

    // Preload image before applying
    const img = new Image();
    
    img.onload = () => {
      // Apply wallpaper with smooth transition
      document.body.style.backgroundImage = `url("${url}")`;
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('wallpaper', url);
      } catch (e) {
        console.warn('Could not save wallpaper preference:', e);
      }

      // Update UI - highlight selected wallpaper
      updateSelectedWallpaper(url);
    };

    img.onerror = () => {
      console.error('Failed to load wallpaper:', url);
    };

    img.src = url;
  }

  /**
   * Updates the visual selected state of wallpaper items
   * @param {string} url - Currently selected wallpaper URL
   */
  function updateSelectedWallpaper(url) {
    const items = document.querySelectorAll('.wallpaper-item');
    items.forEach(item => {
      const isSelected = item.dataset.wall === url;
      item.classList.toggle('selected', isSelected);
      item.setAttribute('aria-pressed', isSelected.toString());
    });
  }

  /**
   * Opens the wallpaper chooser
   */
  function openWallpaperChooser() {
    if (!overlay) return;
    
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    
    // Focus first wallpaper item for keyboard navigation
    const firstItem = overlay.querySelector('.wallpaper-item');
    if (firstItem) {
      setTimeout(() => firstItem.focus(), 100);
    }

    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the wallpaper chooser
   */
  function closeWallpaperChooser() {
    if (!overlay) return;
    
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to open button
    if (openBtn) {
      openBtn.focus();
    }
  }

  // Event: Open wallpaper chooser
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWallpaperChooser();
    });
  }

  // Event: Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWallpaperChooser);
  }

  // Event: Click outside window to close
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeWallpaperChooser();
      }
    });
  }

  // Event: ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('show')) {
      closeWallpaperChooser();
    }
  });

  // Event: Click wallpaper to select
  if (grid) {
    grid.addEventListener('click', (e) => {
      const item = e.target.closest('.wallpaper-item');
      if (!item) return;
      
      const wallUrl = item.dataset.wall;
      if (wallUrl) {
        setWallpaper(wallUrl);
      }
    });

    // Keyboard support for wallpaper selection
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const item = e.target.closest('.wallpaper-item');
        if (item) {
          e.preventDefault();
          const wallUrl = item.dataset.wall;
          if (wallUrl) {
            setWallpaper(wallUrl);
          }
        }
      }
    });
  }

  // ========== Initialize ==========
  
  /**
   * Load saved wallpaper from localStorage
   */
  function loadSavedWallpaper() {
    try {
      const saved = localStorage.getItem('wallpaper');
      if (saved) {
        setWallpaper(saved);
      } else {
        // Set default wallpaper if none saved
        const defaultWall = "Image/w1.jpg";
        updateSelectedWallpaper(defaultWall);
      }
    } catch (e) {
      console.warn('Could not load saved wallpaper:', e);
    }
  }

  // Load wallpaper on page load
  loadSavedWallpaper();

  // ========== Additional Features ==========

  /**
   * Add subtle parallax effect to desktop icons (if any exist)
   */
  function initParallax() {
    const desktop = document.querySelector('.desktop');
    if (!desktop) return;

    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const moveX = (clientX - centerX) / 50;
      const moveY = (clientY - centerY) / 50;
      
      // Apply to desktop icons if they exist
      const icons = desktop.querySelectorAll('.desktop-icon');
      icons.forEach((icon, index) => {
        const depth = (index + 1) * 0.1;
        icon.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
      });
    });
  }

  // Optionally enable parallax (uncomment to use)
  // initParallax();

  /**
   * Log useful debug info
   */
  function logDebugInfo() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🎨 Portfolio initialized');
      console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight);
      console.log('🖼️ Current wallpaper:', localStorage.getItem('wallpaper'));
    }
  }

  logDebugInfo();

  // ========== Service Worker (Optional) ==========
  
  /**
   * Register service worker for offline support
   */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Uncomment to enable service worker
      // navigator.serviceWorker.register('/sw.js')
      //   .then(reg => console.log('Service Worker registered'))
      //   .catch(err => console.log('Service Worker registration failed:', err));
    });
  }

})();
