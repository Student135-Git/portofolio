<script>
  const clockEl = document.getElementById('clock');

  function renderClock(showFullDate = false){
    const now = new Date();

    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const shortDate = now.toLocaleDateString([], {
      month: 'short',
      day: '2-digit'
    });

    const fullDate = now.toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    clockEl.textContent = showFullDate
      ? `${time} • ${fullDate}`
      : `${time} ${shortDate}`;
  }

  renderClock(false);
  setInterval(() => renderClock(false), 1000 * 10);

  clockEl.addEventListener('mouseenter', () => renderClock(true));
  clockEl.addEventListener('mouseleave', () => renderClock(false));

  // --- Wallpaper chooser ---
  const overlay = document.getElementById('wallpaperOverlay');
  const openBtn = document.getElementById('openWallpaper');
  const closeBtn = document.getElementById('closeWallpaper');
  const grid = document.getElementById('wallpaperGrid');

  function setWallpaper(url){
    document.body.style.backgroundImage = `url("${url}")`;
    localStorage.setItem('wallpaper', url);

    // highlight selected
    document.querySelectorAll('.wallpaper-item').forEach(item=>{
      item.classList.toggle('selected', item.dataset.wall === url);
    });
  }

  function openWallpaper(){
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
  }

  function closeWallpaper(){
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
  }

  // open/close
  openBtn.addEventListener('click', (e)=>{ e.preventDefault(); openWallpaper(); });
  closeBtn.addEventListener('click', closeWallpaper);

  // click outside window closes
  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay) closeWallpaper();
  });

  // ESC closes
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeWallpaper();
  });

  // click a wallpaper
  grid.addEventListener('click', (e)=>{
    const item = e.target.closest('.wallpaper-item');
    if(!item) return;
    setWallpaper(item.dataset.wall);
  });

  // load saved wallpaper
  const saved = localStorage.getItem('wallpaper');
  if(saved) setWallpaper(saved);
</script>

function setWallpaper(url){
  const img = new Image();
  img.onload = () => {
    document.body.style.backgroundImage = `url("${url}")`;
    localStorage.setItem('wallpaper', url);

    document.querySelectorAll('.wallpaper-item').forEach(item=>{
      item.classList.toggle('selected', item.dataset.wall === url);
    });
  };
  img.src = url;
}

