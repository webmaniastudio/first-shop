document.addEventListener('DOMContentLoaded', () => {
    const htmlEl = document.documentElement;
    const mainHeader = document.getElementById('main-header');
    const headerBackground = document.getElementById('header-background');
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.querySelector('.search-input');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('overlay');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const profileMenuContainer = document.getElementById('profile-menu-container');

    // مدیریت تم
    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    applyTheme(localStorage.getItem('theme') || 'light');

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    // اسکرول هدر
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        mainHeader.classList.toggle('active', scrollY > 50);
        headerBackground.style.opacity = 1 - Math.min(scrollY / 500, 1);
    });

    // جستجو
    searchIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        mainHeader.classList.toggle('search-active');
        if (mainHeader.classList.contains('search-active')) searchInput.focus();
    });

    // منوی کشویی
    const openMenu = () => {
        navDrawer.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('drawer-open');
    };
    const closeMenu = () => {
        navDrawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('drawer-open');
    };
    menuToggle.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // منوی پروفایل
    profileMenuContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        profileMenuContainer.classList.toggle('dropdown-open');
    });

    // بستن منوها و جستجو با کلیک بیرون
    document.addEventListener('click', (event) => {
        if (mainHeader.classList.contains('search-active') && !event.target.closest('#search-container')) {
            mainHeader.classList.remove('search-active');
        }
        if (profileMenuContainer.classList.contains('dropdown-open') && !event.target.closest('#profile-menu-container')) {
            profileMenuContainer.classList.remove('dropdown-open');
        }
    });
});
