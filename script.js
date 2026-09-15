// --- Configuração do EmailJS (e-mail de confirmação de pedido) ---
// 1. Crie uma conta grátis em https://www.emailjs.com (200 e-mails/mês no plano free)
// 2. Em "Email Services", conecte seu e-mail (Gmail, Outlook, etc.) e copie o SERVICE_ID
// 3. Em "Email Templates", crie um modelo usando as variáveis {{to_name}}, {{to_email}},
//    {{order_number}}, {{order_items}}, {{order_total}}, {{order_address}} — e copie o TEMPLATE_ID
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
        console.warn('EmailJS não configurado ainda — e-mail de confirmação não foi enviado. Veja as instruções no topo do script.js.');
        return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, orderData)
        .then(() => {
            showToast('E-mail de confirmação enviado!');
        })
        .catch((error) => {
            console.error('Falha ao enviar e-mail de confirmação:', error);
            showToast('Pedido confirmado, mas o e-mail não pôde ser enviado.');
        });
}

// --- Base de Dados dos Produtos ---
const products = [
    // Agendas
    { id: 1, title: "Agenda 2027 Executiva Capa Dura", category: "agendas", price: 59.90, image: "https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Agenda Permanente Espiral Floral", category: "agendas", price: 42.90, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80" },

    // Cadernos
    { id: 3, title: "Caderno Universitário Espiral 10 Matérias", category: "cadernos", price: 34.90, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Caderno Inteligente Recarregável", category: "cadernos", price: 79.90, image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=600&q=80" },

    // Canetas & Lápis
    { id: 5, title: "Caneta Gel Premium Ponta Fina 0.5mm", category: "canetas", price: 12.50, image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Kit 12 Canetas Coloridas Ponta Fina", category: "canetas", price: 29.90, image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80" },

    // Borrachas & Apontadores
    { id: 7, title: "Kit Borracha + Apontador com Depósito", category: "borrachas", price: 9.90, image: "https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=600&q=80" },
    { id: 8, title: "Lapiseira 0.7mm Profissional", category: "borrachas", price: 14.90, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80" },

    // Escolar
    { id: 9, title: "Kit Réguas e Esquadros Escolar", category: "escolar", price: 19.90, image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&w=600&q=80" },
    { id: 10, title: "Mochila Escolar Reforçada", category: "escolar", price: 129.90, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },

    // Escritório
    { id: 11, title: "Organizador de Mesa Metálico Minimalista", category: "escritorio", price: 49.90, image: "https://images.unsplash.com/photo-1585336261022-6fc0e7915a2a?auto=format&fit=crop&w=600&q=80" },
    { id: 12, title: "Grampeador de Mesa Profissional", category: "escritorio", price: 24.90, image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80" },

    // Linha Fofa
    { id: 13, title: "Caderno Capa Dura Ursinho Fofo", category: "linha-fofa", price: 47.90, image: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&w=600&q=80" },
    { id: 14, title: "Estojo Pelúcia Unicórnio", category: "linha-fofa", price: 54.90, image: "https://images.unsplash.com/photo-1584824388878-9b073b07e5f9?auto=format&fit=crop&w=600&q=80" },

    // Kits & Presentes
    { id: 15, title: "Kit Volta às Aulas Completo", category: "kits", price: 149.90, image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80" },
    { id: 16, title: "Kit Presente Papelaria Premium", category: "kits", price: 89.90, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80" },

    // Criativo
    { id: 17, title: "Massa de Modelar Kit 12 Cores", category: "criativo", price: 32.90, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80" },
    { id: 18, title: "Tinta Guache 6 Cores 15ml", category: "criativo", price: 18.90, image: "https://images.unsplash.com/photo-1502773860571-211a597d6e4b?auto=format&fit=crop&w=600&q=80" },

    // Gamer
    { id: 19, title: "Teclado Mecânico Gamer RGB Switch Brown", category: "gamer", price: 289.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
    { id: 20, title: "Headset Gamer Surround 7.1 com Microfone", category: "gamer", price: 199.90, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" },
    { id: 21, title: "Mousepad Gamer Extra Grande", category: "gamer", price: 39.90, image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80" },

    // Informática
    { id: 22, title: "Mouse Sem Fio Ergonômico Bluetooth", category: "informatica", price: 89.90, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80" },
    { id: 23, title: "Pen Drive 64GB USB 3.0", category: "informatica", price: 34.90, image: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=600&q=80" },
    { id: 24, title: "Cabo HDMI 2.0 - 2 Metros", category: "informatica", price: 19.90, image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=600&q=80" },

    // Câmeras & Segurança
    { id: 25, title: "Câmera Wi-Fi Inteligente Interna 360° HD", category: "cameras", price: 219.90, image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=600&q=80" },
    { id: 26, title: "Câmera de Segurança Externa Full HD IP66", category: "cameras", price: 279.00, image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80" },
    { id: 27, title: "Kit 4 Câmeras + DVR Monitoramento Completo", category: "cameras", price: 899.90, image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=600&q=80" }
];

// Nome de exibição de cada categoria (usado na etiqueta do card e no título da seção)
const CATEGORY_TITLES = {
    all: 'Nossos Produtos',
    papelaria: 'Papelaria',
    agendas: 'Agendas',
    cadernos: 'Cadernos',
    canetas: 'Canetas & Lápis',
    borrachas: 'Borrachas & Apontadores',
    escolar: 'Material Escolar',
    escritorio: 'Escritório',
    'linha-fofa': 'Linha Fofa',
    kits: 'Kits & Presentes',
    criativo: 'Criativo & Artístico',
    gamer: 'Gamer',
    informatica: 'Informática',
    cameras: 'Câmeras & Segurança'
};

// Grupos "guarda-chuva" — usados pelos botões do hero e pelo rodapé,
// que filtram várias categorias de uma vez (ex: "Papelaria" reúne
// agendas, cadernos, canetas etc. de uma só vez)
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

// --- Helpers de vitrine (parcelamento, estoque simulado, ordenação) ---
const FREE_SHIPPING_THRESHOLD = 150;

function installmentText(price) {
    const parcela = price / 3;
    return `ou 3x de R$ ${parcela.toFixed(2).replace('.', ',')} sem juros`;
}

// Estoque simulado de forma determinística (troque por dado real do seu
// sistema de gestão/ERP quando integrar um backend de verdade)
function getStock(product) {
    return (product.id * 7) % 14 + 1;
}

function stockBadgeHTML(stock) {
    if (stock <= 3) {
        return `<span class="stock-badge low"><i class="fa-solid fa-circle"></i> Últimas ${stock} unidades</span>`;
    }
    return `<span class="stock-badge ok"><i class="fa-solid fa-circle"></i> Em estoque</span>`;
}

function genericDescription(product) {
    return `${product.title}. Produto original InforMaster, com garantia da loja e suporte da nossa equipe em Ilhéus/BA.`;
}

function sortProducts(list, sortBy) {
    const sorted = [...list];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
}

// Estado atual da vitrine (categoria + busca + ordenação)
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

// --- Toasts (notificação de "adicionado ao carrinho") ---
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

// --- Persistência do carrinho (localStorage) ---
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
const heroSlides = document.querySelectorAll('.hero-slide');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
const heroDotsContainer = document.getElementById('heroDots');
let heroIndex = 0;
let heroAutoplay;

heroSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    dot.addEventListener('click', () => goToHeroSlide(i));
    heroDotsContainer.appendChild(dot);
});
const heroDots = document.querySelectorAll('.hero-dot');

function goToHeroSlide(index) {
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
    heroDots.forEach(d => d.classList.remove('active'));
    heroDots[heroIndex].classList.add('active');
}

function startHeroAutoplay() {
    heroAutoplay = setInterval(() => goToHeroSlide(heroIndex + 1), 6000);
}

function stopHeroAutoplay() {
    clearInterval(heroAutoplay);
}

heroNext.addEventListener('click', () => { goToHeroSlide(heroIndex + 1); stopHeroAutoplay(); startHeroAutoplay(); });
heroPrev.addEventListener('click', () => { goToHeroSlide(heroIndex - 1); stopHeroAutoplay(); startHeroAutoplay(); });
document.getElementById('heroCarousel').addEventListener('mouseenter', stopHeroAutoplay);
document.getElementById('heroCarousel').addEventListener('mouseleave', startHeroAutoplay);
startHeroAutoplay();

// Leva o clique no botão do hero (ou nos links do rodapé) direto pra categoria filtrada na vitrine
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

// --- Funções do Carrinho ---
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
    // Atualizar contador do ícone
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Renderizar itens no sidebar
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Seu carrinho está vazio.</p>`;
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

    // Barra de frete grátis
    const fsText = document.getElementById('freeShippingText');
    const fsFill = document.getElementById('freeShippingFill');
    if (cart.length === 0) {
        fsText.textContent = `Frete grátis a partir de R$ ${FREE_SHIPPING_THRESHOLD.toFixed(2).replace('.', ',')}`;
        fsFill.style.width = '0%';
    } else if (totalPrice < FREE_SHIPPING_THRESHOLD) {
        const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
        fsText.innerHTML = `Faltam <strong>R$ ${remaining.toFixed(2).replace('.', ',')}</strong> para frete grátis`;
        fsFill.style.width = `${(totalPrice / FREE_SHIPPING_THRESHOLD) * 100}%`;
    } else {
        fsText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Você ganhou frete grátis!`;
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

// Busca retrátil (mobile): o ícone de lupa abre/fecha o campo de busca
if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', () => {
        searchBar.classList.toggle('open');
        if (searchBar.classList.contains('open')) {
            searchInput.focus();
        }
    });
}

// --- Filtragem, Busca e Ordenação ---
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

// --- Visualização Rápida do Produto ---
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
            showToast('Preencha os dados do cartão para continuar');
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
        `${street}, ${number}${complement ? ' - ' + complement : ''} — ${neighborhood}, ${city}/${state} — CEP ${cepValue}`;

    const method = getSelectedPaymentMethod();
    let paymentLabel;
    if (method === 'cartao') {
        const last4 = document.getElementById('cardNumber').value.replace(/\D/g, '').slice(-4);
        const installments = document.getElementById('installments').value;
        paymentLabel = `Cartão de crédito terminando em ${last4 || '----'}, em ${installments}x`;
    } else if (method === 'pix') {
        paymentLabel = 'Pix (código gerado após a confirmação)';
    } else {
        paymentLabel = 'Boleto bancário (vencimento em 3 dias úteis)';
    }
    document.getElementById('reviewPayment').textContent = paymentLabel;

    document.getElementById('reviewSubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('reviewShipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    document.getElementById('reviewTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function confirmOrder() {
    const orderNumber = 'IM-' + Date.now().toString().slice(-6);
    document.getElementById('orderNumberDisplay').textContent = orderNumber;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = getShippingCost(subtotal);
    const total = subtotal + shipping;

    const itemsText = cart.map(item => `${item.quantity}x ${item.title} — R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`).join('\n');
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const complement = document.getElementById('complement').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const addressText = `${street}, ${number}${complement ? ' - ' + complement : ''} — ${neighborhood}, ${city}/${state}`;

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

// Abas de forma de pagamento (Cartão / Pix / Boleto)
document.querySelectorAll('.payment-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const method = tab.getAttribute('data-method');
        document.querySelectorAll('.payment-panel').forEach(p => p.classList.toggle('active', p.getAttribute('data-payment') === method));
    });
});

// Máscaras dos campos de cartão
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

// CEP: máscara + busca automática de endereço (ViaCEP, API pública gratuita)
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
        cepStatus.textContent = 'Buscando endereço...';
        fetch(`https://viacep.com.br/ws/${digits}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    cepStatus.textContent = 'CEP não encontrado — preencha manualmente';
                    return;
                }
                document.getElementById('street').value = data.logradouro || '';
                document.getElementById('neighborhood').value = data.bairro || '';
                document.getElementById('city').value = data.localidade || '';
                document.getElementById('state').value = data.uf || '';
                cepStatus.textContent = 'Endereço encontrado!';
                document.getElementById('number').focus();
            })
            .catch(() => {
                cepStatus.textContent = 'Não foi possível buscar o CEP agora — preencha manualmente';
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

// Links de categoria no rodapé também usam o filtro
document.querySelectorAll('.footer-cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        filterFromHero(link.getAttribute('data-category') === 'all' ? 'all' : link.getAttribute('data-category'));
    });
});

// Inicializar a loja exibindo todos os produtos e o carrinho salvo
document.addEventListener('DOMContentLoaded', () => {
    applyFiltersAndRender();
    updateCartUI();
});