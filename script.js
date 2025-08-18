// script.js
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Theme
  const THEME_KEY = 'theme';
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  };
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  $('#theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // Toast
  const toastEl = $('#toast');
  const showToast = (msg, ms = 1500) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), ms);
  };

  // Header / Drawer (home)
  const mainHeader = $('#main-header');
  const headerBackground = $('#header-background');
  const menuToggle = $('#menu-toggle');
  const navDrawer = $('#nav-drawer');
  const overlay = $('#overlay');
  const closeMenuBtn = $('#close-menu-btn');

  if (menuToggle && navDrawer && overlay && closeMenuBtn) {
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
  }

  // Profile dropdown (home)
  const profileMenuContainer = $('#profile-menu-container');
  if (profileMenuContainer) {
    profileMenuContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenuContainer.classList.toggle('dropdown-open');
    });
    document.addEventListener('click', (e) => {
      if (profileMenuContainer.classList.contains('dropdown-open') && !e.target.closest('#profile-menu-container')) {
        profileMenuContainer.classList.remove('dropdown-open');
      }
    });
  }

  // Hero scroll effect (home)
  if (mainHeader && headerBackground && document.body.classList.contains('home-page')) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      mainHeader.classList.toggle('active', scrollY > 50);
      headerBackground.style.opacity = String(1 - Math.min(scrollY / 500, 1));
    });
  }

  // Contact form (home)
  $('#contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('پیام شما ارسال شد ✅');
    e.target.reset();
  });

  // ---------------- Orders Page ----------------
  if (document.body.classList.contains('orders-page')) {
    const orders = [
      {
        id: 'OM-2025-0003',
        date: '2025-01-08T10:35:00Z',
        status: 'processing',
        total: 2890000,
        items: [
          { title: 'پیراهن لینن مردانه', variant: 'سفید / L', qty: 1, price: 1290000, img: 'images/shirts.webp' },
          { title: 'شلوار کتان زنانه', variant: 'مشکی / 38', qty: 1, price: 1600000, img: 'images/pants.webp' }
        ],
        shipping: { method: 'پست پیشتاز', address: 'تهران، خیابان نمونه، پلاک ۱۰', tracking: '' }
      },
      {
        id: 'OM-2025-0002',
        date: '2025-01-04T16:12:00Z',
        status: 'shipped',
        total: 1990000,
        items: [
          { title: 'اکسسوری کیف چرمی', variant: 'قهوه‌ای', qty: 1, price: 1990000, img: 'images/accessories.webp' }
        ],
        shipping: { method: 'تیپاکس', address: 'کرج، گوهردشت، بلوک ۵', tracking: 'TRK-782341' }
      },
      {
        id: 'OM-2024-1011',
        date: '2024-12-26T09:02:00Z',
        status: 'delivered',
        total: 3490000,
        items: [
          { title: 'پیراهن راه‌راه', variant: 'آبی / M', qty: 1, price: 1390000, img: 'images/shirts.webp' },
          { title: 'شلوار جین', variant: 'آبی تیره / 32', qty: 1, price: 2100000, img: 'images/pants.webp' }
        ],
        shipping: { method: 'چاپار', address: 'اصفهان، خیابان چهارباغ', tracking: 'CHP-553210' }
      },
      {
        id: 'OM-2024-1005',
        date: '2024-12-20T13:00:00Z',
        status: 'canceled',
        total: 890000,
        items: [
          { title: 'کمربند چرمی', variant: 'مشکی', qty: 1, price: 890000, img: 'images/accessories.webp' }
        ],
        shipping: { method: 'پست سفارشی', address: 'تبریز، ولیعصر', tracking: '' }
      }
    ];

    const fmtPrice = (n) => n.toLocaleString('fa-IR') + ' تومان';
    const statusTitle = (s) => ({
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      canceled: 'لغو شده',
      returned: 'مرجوع شده'
    }[s] || s);

    const listEl = $('#orders-list');
    const emptyEl = $('#empty-state');

    function orderCard(o) {
      const imgs = o.items.slice(0,3).map(i => `<img src="${i.img}" alt="${i.title}"/>`).join('');
      const more = o.items.length > 3 ? `<span class="more">+${o.items.length-3}</span>` : '';
      const canCancel = o.status === 'processing';
      const canReturn = o.status === 'delivered';
      const tracking = o.shipping?.tracking;

      return `
        <div class="order-card" data-id="${o.id}">
          <div class="order-head">
            <div class="meta">
              <span class="order-id">#${o.id}</span>
            </div>
            <span class="status-badge status-${o.status}">${statusTitle(o.status)}</span>
          </div>

          <div class="order-main">
            <div class="thumbs">${imgs}${more}</div>
            <div class="summary">
              <div class="line"><span>تعداد اقلام:</span><strong>${o.items.reduce((a,b)=>a+b.qty,0).toLocaleString('fa-IR')}</strong></div>
              <div class="line"><span>مبلغ کل:</span><strong>${fmtPrice(o.total)}</strong></div>
            </div>
            <div class="actions">
              <button class="btn outline btn-details" data-action="toggle">جزئیات
                <svg class="chev" viewBox="0 0 24 24" width="16" height="16"><polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" stroke-width="2"/></svg>
              </button>
              <a class="btn outline" href="#" onclick="window.print();return false;">دانلود فاکتور</a>
              ${canCancel ? `<button class="btn outline danger" data-action="cancel">لغو سفارش</button>` : ''}
              ${canReturn ? `<button class="btn outline" data-action="return">درخواست مرجوعی</button>` : ''}
            </div>
          </div>

          <div class="order-details" hidden>
            <div class="details-grid">
              <div class="items">
                ${o.items.map(i => `
                  <div class="item">
                    <img src="${i.img}" alt="${i.title}"/>
                    <div class="info">
                      <div class="title">${i.title}</div>
                      <div class="muted">${i.variant || ''}</div>
                    </div>
                    <div class="qty">× ${i.qty.toLocaleString('fa-IR')}</div>
                    <div class="price">${fmtPrice(i.price)}</div>
                  </div>
                `).join('')}
              </div>
              <div class="shipping">
                <div class="row"><span class="label">روش ارسال:</span><span>${o.shipping?.method || '-'}</span></div>
                <div class="row"><span class="label">آدرس:</span><span>${o.shipping?.address || '-'}</span></div>
                <div class="row"><span class="label">کد رهگیری:</span><span>${tracking ? tracking : '-'}</span></div>
                ${tracking ? `<a class="btn outline w-100" target="_blank" href="https://tracking.post.ir/">پیگیری مرسوله</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function render(list) {
      if (!list.length) {
        listEl.innerHTML = '';
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
      listEl.innerHTML = list
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .map(orderCard).join('');
    }

    function applyFilters() {
      const q = $('#q')?.value.trim().toLowerCase() || '';
      const status = $('#status')?.value || 'all';

      let result = orders.slice();
      if (status !== 'all') result = result.filter(o => o.status === status);
      if (q) {
        result = result.filter(o =>
          o.id.toLowerCase().includes(q) ||
          o.items.some(i => (i.title + ' ' + (i.variant || '')).toLowerCase().includes(q)) ||
          (o.shipping?.tracking || '').toLowerCase().includes(q)
        );
      }
      render(result);
    }

    $('#q')?.addEventListener('input', applyFilters);
    $('#status')?.addEventListener('change', (e) => {
      $$('.status-tabs .chip').forEach(c => {
        c.classList.toggle('active', c.dataset.status === e.target.value || (e.target.value === 'all' && c.dataset.status === 'all'));
      });
      applyFilters();
    });
    $('#clearFilters')?.addEventListener('click', () => {
      $('#q').value = '';
      $('#status').value = 'all';
      $$('.status-tabs .chip').forEach((c, i) => c.classList.toggle('active', i===0));
      applyFilters();
    });

    $$('.status-tabs .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.status-tabs .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if ($('#status')) $('#status').value = chip.dataset.status;
        applyFilters();
      });
    });

    $('#orders-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button, a');
      if (!btn) return;
      const card = e.target.closest('.order-card');
      const id = card?.dataset.id;
      const order = orders.find(o => o.id === id);
      const action = btn.dataset.action;

      if (action === 'toggle') {
        const details = card.querySelector('.order-details');
        details.hidden = !details.hidden;
        card.classList.toggle('open', !details.hidden);
        return;
      }
      if (action === 'cancel') {
        if (order.status !== 'processing') return;
        if (confirm('از لغو این سفارش مطمئن هستید؟')) {
          order.status = 'canceled';
          applyFilters();
          showToast('سفارش لغو شد');
        }
      }
      if (action === 'return') {
        if (order.status !== 'delivered') return;
        alert('درخواست مرجوعی ثبت شد. همکاران ما با شما تماس می‌گیرند.');
        showToast('مرجوعی ثبت شد');
      }
    });

    applyFilters();
  }

  // ---------------- Shop Page ----------------
  if (document.body.classList.contains('shop-page')) {
    const products = [
      { id:1,  title:'ساعت مچی دیجیتال مردانه مدل A1', brand:'Nova',     gender:'مردانه',  tags:['دیجیتال','اسپرت'],          price:1290000, oldPrice:1590000, rating:4.2, votes:87, shipping:'fast',   img:'images/accessories.webp', special:true,  sales:510, date:'2025-01-05' },
      { id:2,  title:'ساعت کلاسیک زنانه مدل B2',         brand:'Elegance', gender:'زنانه',  tags:['کلاسیک'],                  price:1890000, oldPrice:0,       rating:4.6, votes:45, shipping:'custom', img:'images/accessories.webp', special:false, sales:220, date:'2025-01-03' },
      { id:3,  title:'ساعت هوشمند مدل C3',               brand:'Nova',     gender:'یونیسکس',tags:['هوشمند'],                  price:3490000, oldPrice:3990000, rating:4.1, votes:120,shipping:'fast',   img:'images/accessories.webp', special:true,  sales:730, date:'2025-01-08' },
      { id:4,  title:'ساعت دیجیتال ورزشی مدل D4',        brand:'ProFit',   gender:'مردانه',  tags:['دیجیتال','اسپرت'],          price:990000,  oldPrice:1290000, rating:3.9, votes:64, shipping:'fast',   img:'images/accessories.webp', special:false, sales:180, date:'2024-12-28' },
      { id:5,  title:'ساعت مچی مینیمال مدل E5',          brand:'Elegance', gender:'زنانه',  tags:['کلاسیک'],                  price:1590000, oldPrice:1790000, rating:4.7, votes:32, shipping:'custom', img:'images/accessories.webp', special:true,  sales:260, date:'2024-12-30' },
      { id:6,  title:'ساعت هوشمند اسپرت مدل F6',         brand:'Pulse',    gender:'یونیسکس',tags:['هوشمند','اسپرت'],           price:2890000, oldPrice:0,       rating:4.0, votes:54, shipping:'fast',   img:'images/accessories.webp', special:false, sales:340, date:'2025-01-02' },
      { id:7,  title:'ساعت کلاسیک بند چرمی مدل G7',      brand:'Royal',    gender:'مردانه',  tags:['کلاسیک'],                  price:2190000, oldPrice:2590000, rating:4.5, votes:77, shipping:'custom', img:'images/accessories.webp', special:false, sales:195, date:'2024-12-20' },
      { id:8,  title:'ساعت دیجیتال فشن مدل H8',          brand:'Nova',     gender:'زنانه',  tags:['دیجیتال'],                  price:1190000, oldPrice:1390000, rating:3.8, votes:20, shipping:'fast',   img:'images/accessories.webp', special:false, sales:98,  date:'2025-01-01' },
      { id:9,  title:'ساعت هوشمند کلاسیک مدل I9',        brand:'Royal',    gender:'یونیسکس',tags:['هوشمند','کلاسیک'],          price:3790000, oldPrice:0,       rating:4.3, votes:88, shipping:'fast',   img:'images/accessories.webp', special:true,  sales:410, date:'2025-01-07' },
      { id:10, title:'ساعت کوارتز اقتصادی مدل J10',      brand:'Pulse',    gender:'مردانه',  tags:['کلاسیک'],                  price:790000,  oldPrice:990000,  rating:3.7, votes:15, shipping:'custom', img:'images/accessories.webp', special:false, sales:65,  date:'2024-12-15' },
      { id:11, title:'ساعت دیجیتال دخترانه مدل K11',     brand:'Nova',     gender:'زنانه',  tags:['دیجیتال'],                  price:890000,  oldPrice:1090000, rating:4.1, votes:25, shipping:'fast',   img:'images/accessories.webp', special:true,  sales:120, date:'2024-12-22' },
      { id:12, title:'ساعت هوشمند ورزشی مدل L12',        brand:'ProFit',   gender:'یونیسکس',tags:['هوشمند','اسپرت'],           price:2990000, oldPrice:3290000, rating:4.4, votes:61, shipping:'fast',   img:'images/accessories.webp', special:false, sales:275, date:'2024-12-29' },
      { id:13, title:'ساعت کلاسیک ظریف مدل M13',         brand:'Elegance', gender:'زنانه',  tags:['کلاسیک'],                  price:2090000, oldPrice:0,       rating:4.6, votes:34, shipping:'custom', img:'images/accessories.webp', special:false, sales:140, date:'2025-01-06' },
      { id:14, title:'ساعت دیجیتال کودکانه مدل N14',     brand:'Pulse',    gender:'یونیسکس',tags:['دیجیتال'],                  price:690000,  oldPrice:0,       rating:4.0, votes:18, shipping:'fast',   img:'images/accessories.webp', special:false, sales:90,  date:'2024-12-10' },
      { id:15, title:'ساعت لوکس کرنوگراف مدل O15',       brand:'Royal',    gender:'مردانه',  tags:['کلاسیک'],                  price:4890000, oldPrice:5490000, rating:4.8, votes:52, shipping:'custom', img:'images/accessories.webp', special:true,  sales:150, date:'2024-12-05' }
    ];

    const state = {
      q: '', tags: new Set(), brands: new Set(), genders: new Set(),
      priceMin: null, priceMax: null, sort: 'relevance', page: 1, perPage: 12
    };
    const fmtPrice = (n) => n.toLocaleString('fa-IR') + ' تومان';

    const grid = $('#productsGrid');
    const resultCount = $('#resultCount');
    const sortChips = $('#sortChips');
    const categoryChips = $('#categoryChips');
    const pagination = $('#pagination');
    const brandFilters = $('#brandFilters');
    const genderFilters = $('#genderFilters');
    const priceMin = $('#priceMin');
    const priceMax = $('#priceMax');
    const clearAll = $('#clearAll');

    // Category chips
    (() => {
      const allTags = Array.from(new Set(products.flatMap(p => p.tags)));
      categoryChips.innerHTML = allTags.map(t => `<button class="chip" data-tag="${t}">${t}</button>`).join('');
      categoryChips.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip'); if (!btn) return;
        const tag = btn.dataset.tag;
        if (state.tags.has(tag)) { state.tags.delete(tag); btn.classList.remove('active'); }
        else { state.tags.add(tag); btn.classList.add('active'); }
        state.page = 1; applyFilters();
      });
      $$('.related-btn').forEach(b => {
        b.addEventListener('click', () => {
          const tag = b.dataset.tag;
          categoryChips.querySelectorAll('.chip').forEach(ch => {
            if (ch.dataset.tag === tag) { ch.classList.add('active'); state.tags.add(tag); }
          });
          state.page = 1; applyFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    })();

    // Facet filters
    (() => {
      const brands = Array.from(new Set(products.map(p => p.brand)));
      brandFilters.innerHTML = brands.map(b => `<label class="checkbox"><input type="checkbox" value="${b}" class="brand-check" /> ${b}</label>`).join('');
      brandFilters.addEventListener('change', (e) => {
        if (!e.target.classList.contains('brand-check')) return;
        const v = e.target.value;
        if (e.target.checked) state.brands.add(v); else state.brands.delete(v);
        state.page = 1; applyFilters();
      });

      const genders = Array.from(new Set(products.map(p => p.gender)));
      genderFilters.innerHTML = genders.map(g => `<label class="checkbox"><input type="checkbox" value="${g}" class="gender-check" /> ${g}</label>`).join('');
      genderFilters.addEventListener('change', (e) => {
        if (!e.target.classList.contains('gender-check')) return;
        const v = e.target.value;
        if (e.target.checked) state.genders.add(v); else state.genders.delete(v);
        state.page = 1; applyFilters();
      });
    })();

    // Search
    $('#q').addEventListener('input', (e) => {
      state.q = e.target.value.trim().toLowerCase();
      state.page = 1; applyFilters();
    });

    // Price
    const parseNum = (v) => {
      const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : null;
    };
    priceMin.addEventListener('change', () => { state.priceMin = parseNum(priceMin.value); state.page=1; applyFilters(); });
    priceMax.addEventListener('change', () => { state.priceMax = parseNum(priceMax.value); state.page=1; applyFilters(); });
    $('#clearPrice').addEventListener('click', () => {
      priceMin.value = ''; priceMax.value = '';
      state.priceMin = state.priceMax = null; state.page=1; applyFilters();
    });

    // Clear all
    clearAll.addEventListener('click', () => {
      state.q = ''; $('#q').value = '';
      state.tags.clear(); categoryChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      state.brands.clear(); brandFilters.querySelectorAll('input').forEach(i => i.checked = false);
      state.genders.clear(); genderFilters.querySelectorAll('input').forEach(i => i.checked = false);
      priceMin.value = ''; priceMax.value = ''; state.priceMin = state.priceMax = null;
      state.sort = 'relevance'; sortChips.querySelectorAll('.chip').forEach((c,i)=>c.classList.toggle('active', i===0));
      state.page = 1; applyFilters();
    });

    // Sort
    sortChips.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip'); if (!btn) return;
      sortChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active'); state.sort = btn.dataset.sort; state.page = 1; applyFilters();
    });

    // Product card
    function productCard(p) {
      const hasDiscount = p.oldPrice && p.oldPrice > p.price;
      const discountPercent = hasDiscount ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
      const stars = Array.from({length:5}, (_,i)=> i < Math.round(p.rating) ? '<span class="on">★</span>' : '<span>★</span>').join('');
      return `
        <div class="product-card">
          <div class="thumb">
            ${p.special ? '<span class="badge badge-special">فروش ویژه</span>' : ''}
            ${p.shipping === 'custom' ? '<span class="badge badge-custom">سفارشی</span>' : ''}
            <img src="${p.img}" alt="${p.title}"/>
          </div>
          <div class="card-body">
            <h3 class="title">${p.title}</h3>
            <div class="meta">
              <div class="rating" title="${p.rating.toFixed(1)} از 5">${stars}<span class="votes">(${p.votes.toLocaleString('fa-IR')})</span></div>
            </div>
            <div class="price-row">
              <div class="price">
                ${hasDiscount ? `<div class="old">${fmtPrice(p.oldPrice)}</div>` : ''}
                <div class="new">${fmtPrice(p.price)}</div>
              </div>
              ${hasDiscount ? `<div class="discount">-${discountPercent}%</div>` : ''}
            </div>
            <button type="button" class="btn primary w-100" data-add-to-cart data-id="${p.id}">افزودن به سبد</button>
          </div>
        </div>
      `;
    }
    function renderProducts(list) {
      grid.innerHTML = list.map(productCard).join('');
    }

    // Pagination
    function renderPagination(pages) {
      if (pages <= 1) { pagination.innerHTML = ''; return; }
      let html = '';
      const mkBtn = (label, page, active=false, disabled=false) =>
        `<button class="page-btn ${active?'active':''}" ${disabled?'disabled':''} data-page="${page}">${label}</button>`;
      html += mkBtn('قبلی', Math.max(1, state.page-1), false, state.page===1);
      for (let i=1;i<=pages;i++) html += mkBtn(i, i, i===state.page);
      html += mkBtn('بعدی', Math.min(pages, state.page+1), false, state.page===pages);
      pagination.innerHTML = html;
    }
    pagination.addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn'); if (!btn) return;
      const page = Number(btn.dataset.page);
      if (!Number.isFinite(page)) return;
      state.page = page; applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Cart
    const CART_KEY = 'wm_cart';
    function addToCart(id) {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
      cart[id] = (cart[id] || 0) + 1;
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      showToast('به سبد اضافه شد!');
    }
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;
      e.preventDefault();
      const id = Number(btn.dataset.id);
      if (!Number.isFinite(id)) return;
      addToCart(id);
    });

    // Filter application
    function applyFilters() {
      let result = products.slice();

      if (state.q) {
        result = result.filter(p =>
          p.title.toLowerCase().includes(state.q) ||
          p.brand.toLowerCase().includes(state.q) ||
          p.tags.some(t => t.toLowerCase().includes(state.q))
        );
      }
      if (state.tags.size)   result = result.filter(p => [...state.tags].every(t => p.tags.includes(t)));
      if (state.brands.size) result = result.filter(p => state.brands.has(p.brand));
      if (state.genders.size)result = result.filter(p => state.genders.has(p.gender));
      if (state.priceMin != null) result = result.filter(p => p.price >= state.priceMin);
      if (state.priceMax != null) result = result.filter(p => p.price <= state.priceMax);

      switch (state.sort) {
        case 'newest':     result.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
        case 'bestseller': result.sort((a,b) => b.sales - a.sales); break;
        case 'cheap':      result.sort((a,b) => a.price - b.price); break;
        case 'expensive':  result.sort((a,b) => b.price - a.price); break;
        default:
          result.sort((a,b) => {
            const score = (p) => (p.special?2:0) + (p.sales/100) + (p.rating/5);
            return score(b) - score(a);
          });
      }

      const total = result.length;
      resultCount.textContent = total ? total.toLocaleString('fa-IR') + ' کالا' : 'کالایی یافت نشد';
      const start = (state.page - 1) * state.perPage;
      const pageItems = result.slice(start, start + state.perPage);

      renderProducts(pageItems);
      renderPagination(Math.ceil(total / state.perPage));
    }

    // Mobile drawer: move sidebar, not clone (avoid duplicate IDs)
    const openFilters = $('#openFilters');
    const filtersDrawer = $('#filtersDrawer');
    const closeFilters = $('#closeFilters');
    const drawerBody = filtersDrawer?.querySelector('.drawer-body');
    const sidebar = $('#sidebar');
    let sidebarPlaceholder = null;

    function moveSidebarToDrawer() {
      if (!filtersDrawer || !drawerBody || !sidebar) return;
      if (!sidebarPlaceholder) {
        sidebarPlaceholder = document.createElement('div');
        sidebarPlaceholder.id = 'sidebar-placeholder';
        sidebar.after(sidebarPlaceholder);
      }
      drawerBody.appendChild(sidebar);
      filtersDrawer.classList.add('open');
      filtersDrawer.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function restoreSidebar() {
      if (!sidebarPlaceholder || !filtersDrawer || !sidebar) return;
      sidebarPlaceholder.parentNode.insertBefore(sidebar, sidebarPlaceholder);
      filtersDrawer.classList.remove('open');
      filtersDrawer.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    openFilters?.addEventListener('click', moveSidebarToDrawer);
    closeFilters?.addEventListener('click', restoreSidebar);
    filtersDrawer?.addEventListener('click', (e) => { if (e.target === filtersDrawer) restoreSidebar(); });

    applyFilters();
  }

  // ---------------- Auth Page ----------------
  if (document.body.classList.contains('auth-page')) {
    const tabs = $$('.auth-tab');
    const forms = $$('.auth-form');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = document.querySelector(tab.dataset.target);
        forms.forEach(f => f.classList.remove('active'));
        target?.classList.add('active');
      });
    });

    $$('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁' : '👁‍🗨';
      });
    });

    const pwd = $('#signup-password');
    const bar = $('.password-strength .bar');
    const strength = (val) => {
      let s = 0;
      if (val.length >= 8) s++;
      if (/[A-Za-z]/.test(val)) s++;
      if (/[0-9]/.test(val)) s++;
      if (/[^A-Za-z0-9]/.test(val)) s++;
      return s; // 0..4
    };
    pwd?.addEventListener('input', (e) => {
      const val = e.target.value;
      const score = strength(val);
      const width = (score / 4) * 100;
      if (bar) {
        bar.style.width = width + '%';
        bar.dataset.score = String(score);
      }
    });

    const setError = (input, message) => {
      const err = input.parentElement.querySelector('.field-error');
      if (err) err.textContent = message || '';
      input.classList.toggle('invalid', !!message);
    };
    const emailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    $('#login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email;
      const password = form.password;
      let ok = true;
      if (!emailValid(email.value)) { setError(email, 'ایمیل معتبر نیست'); ok = false; } else setError(email, '');
      if (!password.value) { setError(password, 'رمز عبور الزامی است'); ok = false; } else setError(password, '');
      const msg = form.querySelector('.form-message');
      if (ok) {
        msg.textContent = 'ورود با موفقیت انجام شد. در حال انتقال...';
        msg.classList.add('success');
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
      } else {
        msg.textContent = 'لطفا خطاهای فرم را برطرف کنید.';
        msg.classList.remove('success');
      }
    });

    $('#signup')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name;
      const email = form.email;
      const phone = form.phone;
      const password = form.password;
      const confirm = form.confirm;
      const terms = form.terms;
      let ok = true;

      if (!name.value.trim()) { setError(name, 'نام را وارد کنید'); ok = false; } else setError(name, '');
      if (!emailValid(email.value)) { setError(email, 'ایمیل معتبر نیست'); ok = false; } else setError(email, '');
      if (phone.value && !/^09\d{9}$/.test(phone.value)) { setError(phone, 'شماره موبایل معتبر نیست'); ok = false; } else setError(phone, '');
      if (password.value.length < 8 || !(/[A-Za-z]/.test(password.value) && /[0-9]/.test(password.value))) {
        setError(password, 'رمز باید حداقل ۸ کاراکتر و شامل حرف و عدد باشد'); ok = false;
      } else setError(password, '');
      if (confirm.value !== password.value) { setError(confirm, 'تکرار رمز مطابقت ندارد'); ok = false; } else setError(confirm, '');
      if (!terms.checked) ok = false;

      const msg = form.querySelector('.form-message');
      if (ok) {
        msg.textContent = 'ثبت‌نام انجام شد! اکنون می‌توانید وارد شوید.';
        msg.classList.add('success');
        document.querySelector('.auth-tab[data-target="#login"]').click();
      } else {
        msg.textContent = 'لطفا خطاهای فرم را برطرف کنید.';
        msg.classList.remove('success');
      }
    });

    const modal = $('#reset-modal');
    const forgot = $('#forgot-link');
    const closeReset = $('#close-reset');
    forgot?.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
    closeReset?.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    $('#reset-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.remove('open');
      alert('اگر ایمیل شما ثبت شده باشد، لینک بازیابی ارسال می‌شود.');
    });
  }
})();