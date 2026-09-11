/* ==========================================================================
   KEDAR CHEMISTRY // CHAPTER SHELL LOGIC (DARK MODE ONLY)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const chapterSlug = document.body.getAttribute('data-chapter-slug') || '';
  const STORAGE_KEY = 'kedar_chemistry_completed_chapters';

  // 1. TABS SWITCHING
  const tabButtons = document.querySelectorAll('.tab-item');
  const viewPanels = document.querySelectorAll('.view-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      viewPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 2. FULLSCREEN TOGGLE FOR NOTES
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      document.body.classList.toggle('is-fullscreen');
      const isFull = document.body.classList.contains('is-fullscreen');
      fullscreenBtn.setAttribute('title', isFull ? 'Exit Fullscreen' : 'Enter Fullscreen');
    });
  }

  // Escape key exits fullscreen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('is-fullscreen')) {
      document.body.classList.remove('is-fullscreen');
    }
  });

  // 3. STUDY PROGRESS TRACKER ("MARK COMPLETE")
  const markCompleteBtn = document.getElementById('markCompletedBtn');
  
  function getCompletedChapters() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function setCompletedChapters(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function updateCompleteButtonUI() {
    if (!markCompleteBtn || !chapterSlug) return;
    const list = getCompletedChapters();
    const isDone = list.includes(chapterSlug);

    if (isDone) {
      markCompleteBtn.classList.add('is-completed');
      markCompleteBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        Completed
      `;
    } else {
      markCompleteBtn.classList.remove('is-completed');
      markCompleteBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
        Mark Complete
      `;
    }
  }

  if (markCompleteBtn) {
    updateCompleteButtonUI();
    markCompleteBtn.addEventListener('click', () => {
      let list = getCompletedChapters();
      if (list.includes(chapterSlug)) {
        list = list.filter(item => item !== chapterSlug);
      } else {
        list.push(chapterSlug);
      }
      setCompletedChapters(list);
      updateCompleteButtonUI();
    });
  }

  // 4. GUIDE LOCAL TEXT SEARCH
  const guideSearchInputs = document.querySelectorAll('.guide-search-input');
  guideSearchInputs.forEach(input => {
    input.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      const wrap = this.closest('.view-panel');
      if (!wrap) return;
      const content = wrap.querySelector('.guide-content');
      if (!content) return;

      const blocks = content.querySelectorAll('h1, h2, h3, h4, p, table, ul, ol, pre');
      if (!q) {
        blocks.forEach(b => (b.style.display = ''));
        return;
      }

      blocks.forEach(b => {
        const text = b.textContent.toLowerCase();
        if (text.includes(q)) {
          b.style.display = '';
        } else {
          b.style.display = 'none';
        }
      });
    });
  });

  // 5. AUTO RENDER KATEX
  if (typeof renderMathInElement === 'function') {
    const guideContents = document.querySelectorAll('.guide-content');
    guideContents.forEach(el => {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    });
  }
});
