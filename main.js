document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Navigation Effects
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Drawer Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = navMenu.classList.contains('open') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
      spans[1].style.opacity = navMenu.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = navMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });
  }

  // 3. Highlight Current Page Link in Nav
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Toast Notification Creator
  window.showToast = function(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.borderLeftColor = '#ef4444';
    } else if (type === 'info') {
      toast.style.borderLeftColor = '#06b6d4';
    }
    
    toast.innerHTML = `
      <span class="toast-icon">${type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✨'}</span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    
    // Auto remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // 5. Courses Search and Filtering (courses.html)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('courseSearch');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        filterCourses();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }

  function filterCourses() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';

    courseCards.forEach(card => {
      const cardSubject = card.getAttribute('data-subject'); // 'math' or 'geo'
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      
      const matchesFilter = (filterValue === 'all' || cardSubject === filterValue);
      const matchesSearch = (title.includes(searchValue) || desc.includes(searchValue));

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 6. Details Modal System (courses.html)
  const modalOverlay = document.getElementById('detailsModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');
  const detailButtons = document.querySelectorAll('.view-syllabus-btn');

  if (detailButtons.length > 0 && modalOverlay) {
    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = btn.closest('.course-card');
        const subjectTitle = card.querySelector('h3').textContent;
        const subjectTag = card.querySelector('.course-tag').textContent;
        const subjectDesc = card.querySelector('p').textContent;
        const modules = JSON.parse(card.getAttribute('data-modules') || '[]');

        modalTitle.textContent = subjectTitle;
        
        let modulesHTML = `<p style="margin-bottom:15px; color:var(--text-muted); font-size: 15px;">${subjectDesc}</p>`;
        modulesHTML += `<h4 style="margin-bottom:10px; color:var(--text-main); font-size:16px;">Curriculum Outline:</h4><ul style="list-style-type: disc; padding-left: 20px; color: var(--text-muted);">`;
        
        modules.forEach(mod => {
          modulesHTML += `<li style="margin-bottom: 8px;"><strong>${mod.title}:</strong> ${mod.desc}</li>`;
        });
        modulesHTML += `</ul>`;
        
        // Add tutoring specs
        modulesHTML += `
          <div style="margin-top:25px; padding:15px; border-radius:12px; background:rgba(255,255,255,0.02); border:1px solid var(--surface-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="font-size:12px; color:var(--text-dark); display:block; text-transform:uppercase;">Subject Focus</span>
              <strong style="color:var(--text-main); font-size:14px;">${subjectTag}</strong>
            </div>
            <div>
              <span style="font-size:12px; color:var(--text-dark); display:block; text-transform:uppercase;">Age Group Focus</span>
              <strong style="color:var(--text-main); font-size:14px;">Grades 8 - 12 (AP)</strong>
            </div>
            <a href="contact.html" class="btn btn-primary" style="padding: 8px 18px; font-size:12px;">Call Tutors</a>
          </div>
        `;

        modalBody.innerHTML = modulesHTML;
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    });
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = 'auto'; // Unlock scrolling
    }
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
