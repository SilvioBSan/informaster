// --- ConfiguraÃ§Ã£o do EmailJS (e-mail de confirmaÃ§Ã£o de pedido) ---
// 1. Crie uma conta grÃ¡tis em https://www.emailjs.com (200 e-mails/mÃªs no plano free)
// 2. Em "Email Services", conecte seu e-mail (Gmail, Outlook, etc.) e copie o SERVICE_ID
// 3. Em "Email Templates", crie um modelo usando as variÃ¡veis {{to_name}}, {{to_email}},
//    {{order_number}}, {{order_items}}, {{order_total}}, {{order_address}} â€” e copie o TEMPLATE_ID
// 4. Em "Account" > "General", copie sua PUBLIC_KEY
// 5. Cole os 3 valores abaixo, entre aspas, no lugar de "COLE_AQUI..."
const EMAILJS_SERVICE_ID = 'COLE_AQUI_SEU_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'COLE_AQUI_SEU_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'COLE_AQUI_SUA_PUBLIC_KEY';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY.indexOf('COLE_AQUI') === -1) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function sendOrderConfirmationEmail(orderData) {
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY.indexOf('COLE_AQUI') !== -1) {
        console.warn('EmailJS nÃ£o configurado ainda â€” e-mail de confirmaÃ§Ã£o nÃ£o foi enviado. Veja as instruÃ§Ãµes no topo do script.js.');
        return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, orderData)
        .then(() => {
            showToast('E-mail de confirmaÃ§Ã£o enviado!');
        })
        .catch((error) => {
            console.error('Falha ao enviar e-mail de confirmaÃ§Ã£o:', error);
            showToast('Pedido confirmado, mas o e-mail nÃ£o pÃ´de ser enviado.');
        });
}

// --- Base de Dados dos Produtos ---
// Antes, os produtos ficavam fixos aqui como um array no cÃ³digo.
// Agora eles moram em products.json e sÃ£o carregados via fetch, para que o
// painel administrativo em /admin (Decap CMS) possa editÃ¡-los sem tocar em cÃ³digo.
let products = [];

async function loadProducts() {
    try {
        const response = await fetch('products.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // O painel /admin salva o arquivo como { "produtos": [...] }.
        // Se vocÃª mantiver o products.json como array puro (sem usar o painel
        // para essa ediÃ§Ã£o), este fallback tambÃ©m funciona.
        products = Array.isArray(data) ? data : (data.produtos || []);
    } catch (error) {
        console.error('NÃ£o foi possÃ­vel carregar products.json:', error);
        products = [];
    }
}

// Nome de exibiÃ§Ã£o de cada categoria (usado na etiqueta do card e no tÃ­tulo da seÃ§Ã£o)
const CATEGORY_TITLES = {
    all: 'Nossos Produtos',
    papelaria: 'Papelaria',
    agendas: 'Agendas',
    cadernos: 'Cadernos',
    canetas: 'Canetas & LÃ¡pis',
    borrachas: 'Borrachas & Apontadores',
    escolar: 'Material Escolar',
    escritorio: 'EscritÃ³rio',
    'linha-fofa': 'Linha Fofa',
    kits: 'Kits & Presentes',
    criativo: 'Criativo & ArtÃ­stico',
    gamer: 'Gamer',
    informatica: 'InformÃ¡tica',
    cameras: 'CÃ¢meras & SeguranÃ§a'
};

// Grupos "guarda-chuva" â€” usados pelos botÃµes do hero e pelo rodapÃ©,
// que filtram vÃ¡rias categorias de uma vez (ex: "Papelaria" reÃºne
// agendas, cadernos, canetas etc. de uma sÃ³ vez)
const CATEGORY_GROUPS = {
    papelaria: ['agendas', 'cadernos', 'canetas', 'borrachas', 'escolar', 'escritorio', 'linha-fofa', 'kits', 'criativo'],
    informatica: ['informatica'],
    gamer: ['gamer'],
    cameras: ['cameras']
};

function getProductsForCategory(category) {
    if (category === 'all') return products;
    if (CATEGORY_GROUPS[category]) return products.filter(p => CATEGORY_GROUPS[category].includes(p.category));
    return products.filter(p => p.category === category);
}

// --- Helpers de vitrine (parcelamento, estoque simulado, ordenaÃ§Ã£o) ---
const FREE_SHIPPING_THRESHOLD = 150;

function installmentText(price) {
    const parcela = price / 3;
    return `ou 3x de R$ ${parcela.toFixed(2).replace('.', ',')} sem juros`;
}

// Estoque simulado de forma determinÃ­stica (troque por dado real do seu
// sistema de gestÃ£o/ERP quando integrar um backend de verdade)
function getStock(product) {
    return (product.id * 7) % 14 + 1;
}

function stockBadgeHTML(stock) {
    if (stock <= 3) {
        return `<span class="stock-badge low"><i class="fa-solid fa-circle"></i> Ãšltimas ${stock} unidades</span>`;
    }
    return `<span class="stock-badge ok"><i class="fa-solid fa-circle"></i> Em estoque</span>`;
}

function genericDescription(product) {
    if (product.description && product.description.trim()) return product.description;
    return `${product.title}. Produto original InforMaster, com garantia da loja e suporte da nossa equipe em IlhÃ©us/BA.`;
}

function sortProducts(list, sortBy) {
    const sorted = [...list];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
}

// Estado atual da vitrine (categoria + busca + ordenaÃ§Ã£o)
let currentCategory = 'all';
let currentSearchTerm = '';
let currentSort = 'relevance';

function applyFiltersAndRender() {
    let list = getProductsForCategory(currentCategory);
    if (currentSearchTerm) {
        list = list.filter(p => p.title.toLowerCase().includes(currentSearchTerm));
    }
    list = sortProducts(list, currentSort);
    renderProducts(list);
}

// --- Toasts (notificaÃ§Ã£o de "adicionado ao carrinho") ---
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- PersistÃªncia do carrinho (localStorage) ---
function saveCartToStorage() {
    localStorage.setItem('informaster_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('informaster_cart');
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch (e) {
        return [];
    }
}

// --- Hero Carrossel ---
const heroTrack = document.getElementById('heroTrack');
const heroCarouselEl = document.getElementById('heroCarousel');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
const heroDotsContainer = document.getElementById('heroDots');
let heroSlides = [];
let heroDots = [];
let heroIndex = 0;
let heroAutoplay;

async function loadHero() {
    try {
        const response = await fetch('hero.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        renderHero(data.slides || []);
    } catch (error) {
        console.error('NÃ£o foi possÃ­vel carregar hero.json:', error);
    }
}

function renderHero(slides) {
    heroTrack.innerHTML = '';
    heroDotsContainer.innerHTML = '';

    slides.forEach((slide) => {
        const slideEl = document.createElement('div');
        slideEl.classList.add('hero-slide');
        slideEl.innerHTML = `
            <div class="hero-decor">
                <span class="star star-1">âœ¦</span>
                <span class="star star-2">â˜…</span>
                <span class="star star-3">âœ§</span>
            </div>
            <div class="hero-text">
                <span class="hero-kicker">${slide.kicker || ''}</span>
                <h1>${(slide.title || '').replace(/\n/g, '<br>')}</h1>
                <p>${slide.text || ''}</p>
                <button class="hero-cta" onclick="filterFromHero('${slide.category || 'all'}')">${slide.buttonText || 'Ver mais'}</button>
            </div>
            <div class="hero-image">
                <img src="${slide.image || ''}" alt="${slide.title || ''}">
            </div>
        `;
        heroTrack.appendChild(slideEl);
    });

    heroSlides = document.querySelectorAll('.hero-slide');

    heroSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        dot.addEventListener('click', () => goToHeroSlide(i));
        heroDotsContainer.appendChild(dot);
    });
    heroDots = document.querySelectorAll('.hero-dot');

    heroIndex = 0;
    goToHeroSlide(0);
    if (heroSlides.length > 1) startHeroAutoplay();
}

function goToHeroSlide(index) {
    if (heroSlides.length === 0) return;
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
    heroDots.forEach(d => d.classList.remove('active'));
    if (heroDots[heroIndex]) heroDots[heroIndex].classList.add('active');
}

function startHeroAutoplay() {
    clearInterval(heroAutoplay);
    heroAutoplay = setInterval(() => goToHeroSlide(heroIndex + 1), 6000);
}

function stopHeroAutoplay() {
    clearInterval(heroAutoplay);
}

heroNext.addEventListener('click', () => { goToHeroSlide(heroIndex + 1); stopHeroAutoplay(); startHeroAutoplay(); });
heroPrev.addEventListener('click', () => { goToHeroSlide(heroIndex - 1); stopHeroAutoplay(); startHeroAutoplay(); });
heroCarouselEl.addEventListener('mouseenter', stopHeroAutoplay);
heroCarouselEl.addEventListener('mouseleave', startHeroAutoplay);

// Leva o clique no botÃ£o do hero (ou nos links do rodapÃ©) direto pra categoria filtrada na vitrine
function filterFromHero(category) {
    tabBtns.forEach(b => b.classList.remove('active'));
    const matchingTab = document.querySelector(`.tab-btn[data-category="${category}"]`);
    if (matchingTab) matchingTab.classList.add('active');

    currentCategory = category;
    currentSearchTerm = '';
    searchInput.value = '';
    categoryTitle.textContent = CATEGORY_TITLES[category] || 'Nossos Produtos';
    applyFiltersAndRender();
    document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Estado do Carrinho ---
let cart = loadCartFromStorage();

// --- Elementos do DOM ---
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const searchBar = document.getElementById('searchBar');
const searchToggleBtn = document.getElementById('searchToggleBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const categoryTitle = document.getElementById('categoryTitle');

// Modais
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const checkoutForm = document.getElementById('checkoutForm');
const successModal = document.getElementById('successModal');
const finishSuccessBtn = document.getElementById('finishSuccessBtn');

// --- Renderizar Produtos ---
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `<p class="no-products-msg">Nenhum produto encontrado.</p>`;
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <div class="product-image-container" onclick="openQuickView(${product.id})">
                <span class="product-tag">${CATEGORY_TITLES[product.category] || ''}</span>
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <div>
                    <h3 class="product-title" onclick="openQuickView(${product.id})">${product.title}</h3>
                    <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                    <div class="product-installment">${installmentText(product.price)}</div>
                    <div class="product-stock">${stockBadgeHTML(getStock(product))}</div>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Adicionar
                </button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// --- FunÃ§Ãµes do Carrinho ---
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    updateCartUI();
    openCartSidebar();
    showToast(`${product.title} adicionado ao carrinho`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Atualizar contador do Ã­cone
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Renderizar itens no sidebar
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Seu carrinho estÃ¡ vazio.</p>`;
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = '';
        checkoutBtn.disabled = false;

        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');

            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <div class="product-installment">${installmentText(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    // Atualizar valor total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

    // Barra de frete grÃ¡tis
    const fsText = document.getElementById('freeShippingText');
    const fsFill = document.getElementById('freeShippingFill');
    if (cart.length === 0) {
        fsText.textContent = `Frete grÃ¡tis a partir de R$ ${FREE_SHIPPING_THRESHOLD.toFixed(2).replace('.', ',')}`;
        fsFill.style.width = '0%';
    } else if (totalPrice < FREE_SHIPPING_THRESHOLD) {
        const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
        fsText.innerHTML = `Faltam <strong>R$ ${remaining.toFixed(2).replace('.', ',')}</strong> para frete grÃ¡tis`;
        fsFill.style.width = `${(totalPrice / FREE_SHIPPING_THRESHOLD) * 100}%`;
    } else {
        fsText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> VocÃª ganhou frete grÃ¡tis!`;
        fsFill.style.width = '100%';
    }

    saveCartToStorage();
}

// --- Controle do Sidebar do Carrinho ---
function openCartSidebar() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCartSidebar);
closeCart.addEventListener('click', closeCartSidebar);
document.getElementById('continueShoppingBtn').addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', () => {
    closeCartSidebar();
    closeAllModals();
});

// Busca retrÃ¡til (mobile): o Ã­cone de lupa abre/fecha o campo de busca
if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', () => {
        searchBar.classList.toggle('open');
        if (searchBar.classList.contains('open')) {
            searchInput.focus();
        }
    });
}

// --- Filtragem, Busca e OrdenaÃ§Ã£o ---
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        currentCategory = e.target.getAttribute('data-category');
        categoryTitle.textContent = CATEGORY_TITLES[currentCategory] || 'Nossos Produtos';
        applyFiltersAndRender();
    });
});

searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    applyFiltersAndRender();
});

const sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndRender();
});

// --- VisualizaÃ§Ã£o RÃ¡pida do Produto ---
const quickViewModal = document.getElementById('quickViewModal');
const closeQuickView = document.getElementById('closeQuickView');
let qvCurrentId = null;
let qvQuantity = 1;

function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    qvCurrentId = productId;
    qvQuantity = 1;

    document.getElementById('qvImage').src = product.image;
    document.getElementById('qvImage').alt = product.title;
    document.getElementById('qvTag').textContent = CATEGORY_TITLES[product.category] || '';
    document.getElementById('qvTitle').textContent = product.title;
    document.getElementById('qvPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('qvInstallment').textContent = installmentText(product.price);
    document.getElementById('qvStock').innerHTML = stockBadgeHTML(getStock(product));
    document.getElementById('qvDescription').textContent = genericDescription(product);
    document.getElementById('qvQty').textContent = qvQuantity;

    quickViewModal.classList.add('active');
    overlay.classList.add('active');
}

function closeQuickViewModal() {
    quickViewModal.classList.remove('active');
    overlay.classList.remove('active');
}

closeQuickView.addEventListener('click', closeQuickViewModal);

document.getElementById('qvMinus').addEventListener('click', () => {
    if (qvQuantity > 1) {
        qvQuantity -= 1;
        document.getElementById('qvQty').textContent = qvQuantity;
    }
});

document.getElementById('qvPlus').addEventListener('click', () => {
    qvQuantity += 1;
    document.getElementById('qvQty').textContent = qvQuantity;
});

document.getElementById('qvAddBtn').addEventListener('click', () => {
    addToCart(qvCurrentId, qvQuantity);
    closeQuickViewModal();
});

// --- Fluxo de Checkout (multi-etapas) e Modais ---
function closeAllModals() {
    checkoutModal.classList.remove('active');
    successModal.classList.remove('active');
    closeQuickViewModal();
}

const SHIPPING_FLAT_RATE = 19.90;
function getShippingCost(subtotal) {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}

let checkoutStep = 1;
const TOTAL_CHECKOUT_STEPS = 4;
const checkoutBackBtn = document.getElementById('checkoutBackBtn');
const checkoutNextBtn = document.getElementById('checkoutNextBtn');

function updateCheckoutStepUI() {
    document.querySelectorAll('.checkout-step').forEach(el => {
        const n = parseInt(el.getAttribute('data-step'), 10);
        el.classList.toggle('active', n === checkoutStep);
        el.classList.toggle('done', n < checkoutStep);
    });
    document.querySelectorAll('.checkout-panel').forEach(el => {
        el.classList.toggle('active', parseInt(el.getAttribute('data-panel'), 10) === checkoutStep);
    });
    checkoutBackBtn.style.visibility = checkoutStep === 1 ? 'hidden' : 'visible';
    checkoutNextBtn.textContent = checkoutStep === TOTAL_CHECKOUT_STEPS ? 'Confirmar Pedido' : 'Continuar';
    if (checkoutStep === TOTAL_CHECKOUT_STEPS) renderReview();
}

function validatePanel(panelSelector) {
    const panel = document.querySelector(panelSelector);
    const inputs = panel.querySelectorAll('input[required]');
    for (const input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}

function getSelectedPaymentMethod() {
    return document.querySelector('.payment-tab.active').getAttribute('data-method');
}

function validateCardFieldsIfNeeded() {
    if (getSelectedPaymentMethod() !== 'cartao') return true;
    const ids = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            el.focus();
            showToast('Preencha os dados do cartÃ£o para continuar');
            return false;
        }
    }
    return true;
}

function populateInstallments() {
    const select = document.getElementById('installments');
    select.innerHTML = '';
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + getShippingCost(subtotal);
    for (let n = 1; n <= 3; n++) {
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = `${n}x de R$ ${(total / n).toFixed(2).replace('.', ',')} sem juros`;
        select.appendChild(opt);
    }
}

function renderReview() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = getShippingCost(subtotal);
    const total = subtotal + shipping;

    document.getElementById('reviewItems').innerHTML = cart.map(item => `
        <div class="review-item-row">
            <span>${item.quantity}x ${item.title}</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
        </div>
    `).join('');

    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const complement = document.getElementById('complement').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const cepValue = document.getElementById('cep').value;
    document.getElementById('reviewAddress').textContent =
        `${street}, ${number}${complement ? ' - ' + complement : ''} â€” ${neighborhood}, ${city}/${state} â€” CEP ${cepValue}`;

    const method = getSelectedPaymentMethod();
    let paymentLabel;
    if (method === 'cartao') {
        const last4 = document.getElementById('cardNumber').value.replace(/\D/g, '').slice(-4);
        const installments = document.getElementById('installments').value;
        paymentLabel = `CartÃ£o de crÃ©dito terminando em ${last4 || '----'}, em ${installments}x`;
    } else if (method === 'pix') {
        paymentLabel = 'Pix (cÃ³digo gerado apÃ³s a confirmaÃ§Ã£o)';
    } else {
        paymentLabel = 'Boleto bancÃ¡rio (vencimento em 3 dias Ãºteis)';
    }
    document.getElementById('reviewPayment').textContent = paymentLabel;

    document.getElementById('reviewSubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('reviewShipping').textContent = shipping === 0 ? 'GrÃ¡tis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    document.getElementById('reviewTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function confirmOrder() {
    const orderNumber = 'IM-' + Date.now().toString().slice(-6);
    document.getElementById('orderNumberDisplay').textContent = orderNumber;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = getShippingCost(subtotal);
    const total = subtotal + shipping;

    const itemsText = cart.map(item => `${item.quantity}x ${item.title} â€” R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`).join('\n');
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const complement = document.getElementById('complement').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const addressText = `${street}, ${number}${complement ? ' - ' + complement : ''} â€” ${neighborhood}, ${city}/${state}`;

    sendOrderConfirmationEmail({
        to_name: document.getElementById('name').value,
        to_email: document.getElementById('email').value,
        order_number: orderNumber,
        order_items: itemsText,
        order_total: `R$ ${total.toFixed(2).replace('.', ',')}`,
        order_address: addressText
    });

    checkoutModal.classList.remove('active');
    successModal.classList.add('active');

    cart = [];
    updateCartUI();
    checkoutForm.reset();
    checkoutStep = 1;
    updateCheckoutStepUI();
}

// Abas de forma de pagamento (CartÃ£o / Pix / Boleto)
document.querySelectorAll('.payment-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const method = tab.getAttribute('data-method');
        document.querySelectorAll('.payment-panel').forEach(p => p.classList.toggle('active', p.getAttribute('data-payment') === method));
    });
});

// MÃ¡scaras dos campos de cartÃ£o
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
}
const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
        e.target.value = v;
    });
}
const cardCvvInput = document.getElementById('cardCvv');
if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
}

// CEP: mÃ¡scara + busca automÃ¡tica de endereÃ§o (ViaCEP, API pÃºblica gratuita)
const cepInput = document.getElementById('cep');
const cepStatus = document.getElementById('cepStatus');
if (cepInput) {
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
        cepStatus.textContent = '';
    });

    cepInput.addEventListener('blur', () => {
        const digits = cepInput.value.replace(/\D/g, '');
        if (digits.length !== 8) return;
        cepStatus.textContent = 'Buscando endereÃ§o...';
        fetch(`https://viacep.com.br/ws/${digits}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    cepStatus.textContent = 'CEP nÃ£o encontrado â€” preencha manualmente';
                    return;
                }
                document.getElementById('street').value = data.logradouro || '';
                document.getElementById('neighborhood').value = data.bairro || '';
                document.getElementById('city').value = data.localidade || '';
                document.getElementById('state').value = data.uf || '';
                cepStatus.textContent = 'EndereÃ§o encontrado!';
                document.getElementById('number').focus();
            })
            .catch(() => {
                cepStatus.textContent = 'NÃ£o foi possÃ­vel buscar o CEP agora â€” preencha manualmente';
            });
    });
}

checkoutBtn.addEventListener('click', () => {
    closeCartSidebar();
    checkoutStep = 1;
    populateInstallments();
    updateCheckoutStepUI();
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
});

closeModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
});

checkoutForm.addEventListener('submit', (e) => e.preventDefault());

checkoutBackBtn.addEventListener('click', () => {
    if (checkoutStep > 1) {
        checkoutStep -= 1;
        updateCheckoutStepUI();
    }
});

checkoutNextBtn.addEventListener('click', () => {
    if (checkoutStep === 1 && !validatePanel('.checkout-panel[data-panel="1"]')) return;
    if (checkoutStep === 2 && !validatePanel('.checkout-panel[data-panel="2"]')) return;
    if (checkoutStep === 3 && !validateCardFieldsIfNeeded()) return;

    if (checkoutStep === TOTAL_CHECKOUT_STEPS) {
        confirmOrder();
        return;
    }
    checkoutStep += 1;
    updateCheckoutStepUI();
});

finishSuccessBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Links de categoria no rodapÃ© tambÃ©m usam o filtro
document.querySelectorAll('.footer-cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        filterFromHero(link.getAttribute('data-category') === 'all' ? 'all' : link.getAttribute('data-category'));
    });
});

// Inicializar a loja: carrega products.json e hero.json, sÃ³ entÃ£o renderiza
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([loadProducts(), loadHero()]);
    applyFiltersAndRender();
    updateCartUI();
});
