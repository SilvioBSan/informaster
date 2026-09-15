# Script para aplicar as atualizacoes do site InforMaster
# Rode este arquivo a partir da RAIZ do projeto (pasta INFORMASTER LOJA)

Write-Host "Aplicando atualizacoes..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "admin" | Out-Null

Write-Host "Escrevendo index.html..."
Set-Content -Path "index.html" -Encoding UTF8 -NoNewline -Value @'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InforMaster Loja - Papelaria, Informática e Segurança</title>
    <meta name="description" content="InforMaster — papelaria, informática e câmeras de segurança em Ilhéus/BA. 20 anos de tradição, assistência técnica especializada e entrega rápida.">
    <meta property="og:title" content="InforMaster Loja — Papelaria, Informática e Segurança">
    <meta property="og:description" content="Cadernos, agendas, acessórios de informática e câmeras de segurança, com 20 anos de tradição em Ilhéus/BA.">
    <meta property="og:type" content="website">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' https: data:; connect-src 'self' https://viacep.com.br https://api.emailjs.com; frame-src 'none'; object-src 'none'; base-uri 'self';">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- EmailJS (envio de e-mail de confirmação de pedido direto do navegador, sem backend) -->
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <!-- Netlify Identity Widget: necessário para que os links de convite e de
         "esqueci minha senha" do painel /admin funcionem quando abertos na
         página principal do site (fora do /admin). Sem isso, o link de
         convite carrega o site normalmente e não abre a tela de criar senha. -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    <!-- Arquivo CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Cabeçalho + Navegação (agrupados para ficarem fixos juntos ao rolar) -->
    <div class="site-top">
        <header class="header">
            <div class="container header-container">
                <a href="#" class="logo">Infor<span>Master</span></a>

                <div class="search-bar" id="searchBar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="searchInput" placeholder="O que você está procurando hoje?">
                </div>

                <div class="header-actions">
                    <button class="icon-btn search-toggle-btn" id="searchToggleBtn" aria-label="Buscar">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button class="cart-btn" id="cartBtn" aria-label="Abrir carrinho">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span class="cart-count" id="cartCount">0</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Navegação por Categorias (Tabs) -->
        <nav class="nav-categories">
            <div class="container nav-categories-inner">
                <div class="nav-tabs" id="navTabs">
                    <button class="tab-btn active" data-category="all">Todos os Produtos</button>
                    <button class="tab-btn" data-category="agendas">Agendas</button>
                    <button class="tab-btn" data-category="cadernos">Cadernos</button>
                    <button class="tab-btn" data-category="canetas">Canetas &amp; Lápis</button>
                    <button class="tab-btn" data-category="borrachas">Borrachas &amp; Apontadores</button>
                    <button class="tab-btn" data-category="escolar">Escolar</button>
                    <button class="tab-btn" data-category="escritorio">Escritório</button>
                    <button class="tab-btn" data-category="linha-fofa">Linha Fofa</button>
                    <button class="tab-btn" data-category="kits">Kits &amp; Presentes</button>
                    <button class="tab-btn" data-category="criativo">Criativo</button>
                    <button class="tab-btn" data-category="gamer">Gamer</button>
                    <button class="tab-btn" data-category="informatica">Informática</button>
                    <button class="tab-btn" data-category="cameras">Câmeras</button>
                </div>
                <a href="https://wa.me/557388594003" target="_blank" rel="noopener" class="nav-cta">
                    <i class="fa-brands fa-whatsapp"></i> Compre já!
                </a>
            </div>
        </nav>
    </div>

    <!-- Seção Principal de Produtos -->
    <main class="container main-content">
        <section class="hero-carousel" id="heroCarousel">
            <div class="hero-track" id="heroTrack">
                <!-- Os slides são injetados via JavaScript a partir de hero.json -->
            </div>

            <button class="hero-arrow prev" id="heroPrev" aria-label="Slide anterior">&#10094;</button>
            <button class="hero-arrow next" id="heroNext" aria-label="Próximo slide">&#10095;</button>
            <div class="hero-dots" id="heroDots"></div>
        </section>

        <div class="trust-bar">
            <div class="trust-item"><i class="fa-solid fa-truck-fast"></i><span>Frete grátis acima de R$ 150</span></div>
            <div class="trust-item"><i class="fa-solid fa-rotate-left"></i><span>Troca facilitada em 30 dias</span></div>
            <div class="trust-item"><i class="fa-solid fa-lock"></i><span>Compra 100% segura</span></div>
            <div class="trust-item"><i class="fa-solid fa-credit-card"></i><span>Em até 3x sem juros</span></div>
        </div>

        <div class="section-title-row">
            <div class="section-title">
                <h2 id="categoryTitle">Nossos Produtos</h2>
                <p>Explore nossa seleção especial de itens de alta qualidade</p>
            </div>
            <div class="sort-control">
                <label for="sortSelect">Ordenar por</label>
                <select id="sortSelect">
                    <option value="relevance">Relevância</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                    <option value="name-asc">Nome A-Z</option>
                </select>
            </div>
        </div>

        <!-- Vitrine de Produtos -->
        <div class="products-grid" id="productsGrid">
            <!-- Os cards serão injetados via JavaScript -->
        </div>
    </main>

    <!-- Rodapé -->
    <footer class="footer">
        <div class="container footer-grid">

            <div class="footer-col footer-brand">
                <a href="#" class="logo footer-logo">Infor<span>Master</span></a>
                <p class="footer-about">Há 20 anos em Ilhéus com papelaria, informática e segurança eletrônica — além de assistência técnica especializada.</p>
                <div class="footer-social">
                    <span class="footer-social-label">Nas redes</span>
                    <div class="footer-social-icons">
                        <a href="https://www.instagram.com/informasteroficial" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                        <a href="https://wa.me/557388594003" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    </div>
                </div>
                <div class="footer-payments">
                    <span class="footer-social-label">Formas de pagamento</span>
                    <div class="payment-icons">
                        <i class="fa-brands fa-cc-visa" title="Visa"></i>
                        <i class="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                        <span class="payment-pix">Pix</span>
                        <i class="fa-solid fa-barcode" title="Boleto"></i>
                    </div>
                </div>
            </div>

            <div class="footer-col">
                <h4>Categorias</h4>
                <ul>
                    <li><a href="#" class="footer-cat-link" data-category="papelaria">Papelaria</a></li>
                    <li><a href="#" class="footer-cat-link" data-category="linha-fofa">Linha Fofa</a></li>
                    <li><a href="#" class="footer-cat-link" data-category="kits">Kits & Presentes</a></li>
                    <li><a href="#" class="footer-cat-link" data-category="gamer">Gamer</a></li>
                    <li><a href="#" class="footer-cat-link" data-category="informatica">Informática</a></li>
                    <li><a href="#" class="footer-cat-link" data-category="cameras">Câmeras &amp; Segurança</a></li>
                    <li><a href="#" class="footer-cat-link" data-category="all">Todos os Produtos</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Atendimento</h4>
                <ul>
                    <li><i class="fa-solid fa-location-dot"></i> Av. Ver. Amilton Ignácio de Castro, 798 - Barra, Ilhéus - BA</li>
                    <li><i class="fa-solid fa-phone"></i> (73) 3639-2820</li>
                    <li><i class="fa-solid fa-clock"></i> Seg. a Sáb., 8h às 18h</li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Institucional</h4>
                <ul>
                    <li><a href="#">Sobre a InforMaster</a></li>
                    <li><a href="#">Assistência Técnica</a></li>
                    <li><a href="#">Trocas e Devoluções</a></li>
                    <li><a href="privacidade.html">Política de Privacidade</a></li>
                </ul>
            </div>

        </div>

        <div class="footer-bottom">
            <div class="container footer-bottom-inner">
                <p>&copy; 2026 InforMaster Loja. Todos os direitos reservados.</p>
                <p class="footer-cnpj">Av. Ver. Amilton Ignácio de Castro, 798 - Barra, Ilhéus - BA</p>
            </div>
        </div>
    </footer>

    <!-- Carrinho de Compras Lateral (Sidebar) -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3><i class="fa-solid fa-bag-shopping"></i> Seu Carrinho</h3>
            <button class="close-cart" id="closeCart">&times;</button>
        </div>
        <div class="cart-items" id="cartItems">
            <!-- Itens do carrinho aparecerão aqui -->
            <p class="empty-cart-msg">Seu carrinho está vazio.</p>
        </div>
        <div class="cart-footer">
            <div class="free-shipping-bar" id="freeShippingBar">
                <p id="freeShippingText"></p>
                <div class="progress-track"><div class="progress-fill" id="freeShippingFill"></div></div>
            </div>
            <div class="cart-total">
                <span>Total:</span>
                <span id="cartTotal">R$ 0,00</span>
            </div>
            <button class="checkout-btn" id="checkoutBtn" disabled>Finalizar Compra</button>
            <button class="continue-shopping-btn" id="continueShoppingBtn">Continuar Comprando</button>
        </div>
    </div>
    <div class="overlay" id="overlay"></div>

    <!-- Modal de Checkout --> 
    <div class="modal" id="checkoutModal">
        <div class="modal-content checkout-flow-content">
            <button class="close-modal" id="closeModal">&times;</button>
            <h2>Finalizar Pedido</h2>

            <div class="checkout-steps" id="checkoutSteps">
                <div class="checkout-step active" data-step="1"><span class="step-number">1</span><span class="step-label">Dados</span></div>
                <div class="checkout-step" data-step="2"><span class="step-number">2</span><span class="step-label">Entrega</span></div>
                <div class="checkout-step" data-step="3"><span class="step-number">3</span><span class="step-label">Pagamento</span></div>
                <div class="checkout-step" data-step="4"><span class="step-number">4</span><span class="step-label">Revisão</span></div>
            </div>

            <form id="checkoutForm">

                <!-- Etapa 1: Dados -->
                <div class="checkout-panel active" data-panel="1">
                    <div class="form-group">
                        <label for="name">Nome Completo</label>
                        <input type="text" id="name" required placeholder="Ex: Maria Silva">
                    </div>
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" required placeholder="seu@email.com">
                    </div>
                    <div class="form-group">
                        <label for="phone">WhatsApp</label>
                        <input type="tel" id="phone" required placeholder="(73) 99999-9999">
                    </div>
                </div>

                <!-- Etapa 2: Entrega -->
                <div class="checkout-panel" data-panel="2">
                    <div class="form-group">
                        <label for="cep">CEP</label>
                        <input type="text" id="cep" required placeholder="00000-000" maxlength="9">
                        <span class="cep-status" id="cepStatus"></span>
                    </div>
                    <div class="form-group">
                        <label for="street">Rua</label>
                        <input type="text" id="street" required placeholder="Nome da rua">
                    </div>
                    <div class="form-row">
                        <div class="form-group form-group-small">
                            <label for="number">Número</label>
                            <input type="text" id="number" required placeholder="123">
                        </div>
                        <div class="form-group">
                            <label for="complement">Complemento</label>
                            <input type="text" id="complement" placeholder="Apto, bloco... (opcional)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="neighborhood">Bairro</label>
                        <input type="text" id="neighborhood" required placeholder="Bairro">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">Cidade</label>
                            <input type="text" id="city" required placeholder="Cidade">
                        </div>
                        <div class="form-group form-group-small">
                            <label for="state">UF</label>
                            <input type="text" id="state" required placeholder="BA" maxlength="2">
                        </div>
                    </div>
                </div>

                <!-- Etapa 3: Pagamento -->
                <div class="checkout-panel" data-panel="3">
                    <div class="payment-method-tabs">
                        <button type="button" class="payment-tab active" data-method="cartao"><i class="fa-solid fa-credit-card"></i> Cartão</button>
                        <button type="button" class="payment-tab" data-method="pix"><i class="fa-brands fa-pix"></i> Pix</button>
                        <button type="button" class="payment-tab" data-method="boleto"><i class="fa-solid fa-barcode"></i> Boleto</button>
                    </div>

                    <div class="payment-panel active" data-payment="cartao">
                        <div class="form-group">
                            <label for="cardNumber">Número do Cartão</label>
                            <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19">
                        </div>
                        <div class="form-group">
                            <label for="cardName">Nome Impresso no Cartão</label>
                            <input type="text" id="cardName" placeholder="Como está no cartão">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cardExpiry">Validade</label>
                                <input type="text" id="cardExpiry" placeholder="MM/AA" maxlength="5">
                            </div>
                            <div class="form-group form-group-small">
                                <label for="cardCvv">CVV</label>
                                <input type="text" id="cardCvv" placeholder="000" maxlength="4">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="installments">Parcelas</label>
                            <select id="installments"></select>
                        </div>
                    </div>

                    <div class="payment-panel" data-payment="pix">
                        <p class="payment-hint">Ao confirmar o pedido, geramos um código Pix para você pagar pelo app do seu banco.</p>
                        <div class="pix-preview">
                            <div class="pix-qr-placeholder"><i class="fa-solid fa-qrcode"></i></div>
                            <p class="payment-hint">O QR Code real é gerado após a confirmação do pedido.</p>
                        </div>
                    </div>

                    <div class="payment-panel" data-payment="boleto">
                        <p class="payment-hint">O boleto vence em 3 dias úteis. A compensação pode levar até 2 dias úteis após o pagamento.</p>
                        <div class="boleto-barcode"></div>
                        <p class="payment-hint">O boleto real é gerado após a confirmação do pedido.</p>
                    </div>
                </div>

                <!-- Etapa 4: Revisão -->
                <div class="checkout-panel" data-panel="4">
                    <div class="review-block">
                        <h4>Itens do Pedido</h4>
                        <div id="reviewItems"></div>
                    </div>
                    <div class="review-block">
                        <h4>Entrega</h4>
                        <p id="reviewAddress"></p>
                    </div>
                    <div class="review-block">
                        <h4>Pagamento</h4>
                        <p id="reviewPayment"></p>
                    </div>
                    <div class="review-totals">
                        <div class="review-total-row"><span>Subtotal</span><span id="reviewSubtotal"></span></div>
                        <div class="review-total-row"><span>Frete</span><span id="reviewShipping"></span></div>
                        <div class="review-total-row review-total-final"><span>Total</span><span id="reviewTotal"></span></div>
                    </div>
                </div>

                <div class="checkout-nav">
                    <button type="button" class="checkout-back-btn" id="checkoutBackBtn">Voltar</button>
                    <button type="button" class="submit-order-btn" id="checkoutNextBtn">Continuar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de Visualização Rápida do Produto -->
    <div class="modal" id="quickViewModal">
        <div class="modal-content quickview-content">
            <button class="close-modal" id="closeQuickView">&times;</button>
            <div class="quickview-image">
                <img id="qvImage" src="" alt="">
            </div>
            <div class="quickview-info">
                <span class="product-tag" id="qvTag"></span>
                <h2 id="qvTitle"></h2>
                <div class="qv-price" id="qvPrice"></div>
                <div class="qv-installment" id="qvInstallment"></div>
                <div id="qvStock"></div>
                <p class="qv-description" id="qvDescription"></p>
                <div class="qv-qty-row">
                    <span>Quantidade</span>
                    <div class="qty-stepper">
                        <button class="qty-btn" id="qvMinus">-</button>
                        <span id="qvQty">1</span>
                        <button class="qty-btn" id="qvPlus">+</button>
                    </div>
                </div>
                <button class="hero-cta qv-add-btn" id="qvAddBtn">
                    <i class="fa-solid fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Sucesso -->
    <div class="modal" id="successModal">
        <div class="modal-content success-content">
            <i class="fa-solid fa-circle-check success-icon"></i>
            <h2>Pedido Realizado com Sucesso!</h2>
            <p class="order-number">Pedido <strong id="orderNumberDisplay"></strong></p>
            <p>Obrigado por comprar na InforMaster. Enviamos os detalhes do pedido para o seu e-mail.</p>
            <button class="submit-order-btn" id="finishSuccessBtn">Voltar à Loja</button>
        </div>
    </div>

    <!-- Notificações -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- Botão flutuante de WhatsApp (visível no celular, onde fica o "Compre já!" do menu) -->
    <a href="https://wa.me/557388594003" target="_blank" rel="noopener" class="floating-whatsapp" aria-label="Fale conosco no WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
    </a>

    <!-- Inicializa o widget do Netlify Identity e trata os links de convite / redefinição de senha
         que chegam por e-mail apontando para a raiz do site (ex: #invite_token=..., #recovery_token=...) -->
    <script>
        if (window.netlifyIdentity) {
            window.netlifyIdentity.on('init', user => {
                if (!user) {
                    window.netlifyIdentity.on('login', () => {
                        document.location.href = '/admin/';
                    });
                }
            });
        }
    </script>

    <!-- Arquivo JavaScript -->
    <script src="script.js"></script>
</body>
</html>

'@

Write-Host "Escrevendo script.js..."
Set-Content -Path "script.js" -Encoding UTF8 -NoNewline -Value @'
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
// Antes, os produtos ficavam fixos aqui como um array no código.
// Agora eles moram em products.json e são carregados via fetch, para que o
// painel administrativo em /admin (Decap CMS) possa editá-los sem tocar em código.
let products = [];

async function loadProducts() {
    try {
        const response = await fetch('products.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // O painel /admin salva o arquivo como { "produtos": [...] }.
        // Se você mantiver o products.json como array puro (sem usar o painel
        // para essa edição), este fallback também funciona.
        products = Array.isArray(data) ? data : (data.produtos || []);
    } catch (error) {
        console.error('Não foi possível carregar products.json:', error);
        products = [];
    }
}

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
    if (product.description && product.description.trim()) return product.description;
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
        console.error('Não foi possível carregar hero.json:', error);
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
                <span class="star star-1">✦</span>
                <span class="star star-2">★</span>
                <span class="star star-3">✧</span>
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

// Inicializar a loja: carrega products.json e hero.json, só então renderiza
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([loadProducts(), loadHero()]);
    applyFiltersAndRender();
    updateCartUI();
});

'@

Write-Host "Escrevendo hero.json..."
Set-Content -Path "hero.json" -Encoding UTF8 -NoNewline -Value @'
{
  "slides": [
    {
      "kicker": "Novidades toda semana",
      "title": "Papelaria\nque inspira",
      "text": "Cadernos, canetas e organizadores pra deixar sua rotina mais bonita e produtiva.",
      "buttonText": "Ver Papelaria",
      "category": "papelaria",
      "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80"
    },
    {
      "kicker": "Performance sem esforço",
      "title": "Informática\nna medida certa",
      "text": "Mouses, teclados e headsets pra deixar sua rotina — ou seu setup gamer — no próximo nível.",
      "buttonText": "Ver Informática",
      "category": "informatica",
      "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80"
    },
    {
      "kicker": "Sua casa, sempre vigiada",
      "title": "Segurança\nque dá paz",
      "text": "Câmeras inteligentes com monitoramento em tempo real, direto do seu celular.",
      "buttonText": "Ver Câmeras",
      "category": "cameras",
      "image": "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=700&q=80"
    }
  ]
}

'@

Write-Host "Escrevendo admin\config.yml..."
Set-Content -Path "admin\config.yml" -Encoding UTF8 -NoNewline -Value @'
# Configuração do painel administrativo (Decap CMS)
# Documentação completa: https://decapcms.org/docs/configuration-options/

backend:
  name: git-gateway
  branch: main                        # <-- troque se sua branch principal tiver outro nome

# Onde o CMS salva as imagens enviadas pelo formulário
media_folder: "images/uploads"   # pasta dentro do repositório
public_folder: "images/uploads"  # caminho usado no <img src="..."> gerado

# Ativa o modo "Editorial Workflow": toda alteração vira um rascunho
# revisável antes de ir pro site no ar. Se preferir que publique na hora,
# pode remover esta linha.
publish_mode: editorial_workflow

# Como todos os produtos vivem juntos em um único products.json (um array),
# usamos uma coleção do tipo "files": um arquivo só, e cada item do array
# vira uma entrada editável na lista dentro do painel.
collections:
  - name: "produtos"
    label: "Catálogo de Produtos"
    files:
      - name: "catalogo"
        label: "Todos os Produtos"
        file: "products.json"
        format: "json"
        fields:
          - label: "Produtos"
            name: "produtos"
            widget: "list"
            summary: "{{fields.title}} — {{fields.category}}"
            fields:
              - { label: "ID", name: "id", widget: "number", value_type: "int", hint: "Não repita um ID já usado por outro produto." }
              - { label: "Nome do Produto", name: "title", widget: "string" }
              - label: "Categoria"
                name: "category"
                widget: "select"
                options:
                  - { label: "Agendas", value: "agendas" }
                  - { label: "Cadernos", value: "cadernos" }
                  - { label: "Canetas & Lápis", value: "canetas" }
                  - { label: "Borrachas & Apontadores", value: "borrachas" }
                  - { label: "Escolar", value: "escolar" }
                  - { label: "Escritório", value: "escritorio" }
                  - { label: "Linha Fofa", value: "linha-fofa" }
                  - { label: "Kits & Presentes", value: "kits" }
                  - { label: "Criativo", value: "criativo" }
                  - { label: "Gamer", value: "gamer" }
                  - { label: "Informática", value: "informatica" }
                  - { label: "Câmeras", value: "cameras" }
              - { label: "Preço (R$)", name: "price", widget: "number", value_type: "float" }
              - { label: "Foto do Produto", name: "image", widget: "image", hint: "Clique ou arraste a foto aqui. Recomendado: fundo branco, quadrada." }
              - { label: "Descrição", name: "description", widget: "text", required: false, hint: "Se deixar em branco, o site mostra uma frase genérica automática." }

  - name: "hero"
    label: "Banner Principal (Topo do Site)"
    files:
      - name: "slides"
        label: "Slides do Banner"
        file: "hero.json"
        format: "json"
        fields:
          - label: "Slides"
            name: "slides"
            widget: "list"
            summary: "{{fields.title}}"
            min: 1
            max: 5
            fields:
              - { label: "Chamada pequena (acima do título)", name: "kicker", widget: "string" }
              - { label: "Título", name: "title", widget: "string", hint: "Pode usar uma quebra de linha digitando \\n" }
              - { label: "Texto", name: "text", widget: "text" }
              - { label: "Texto do Botão", name: "buttonText", widget: "string", default: "Ver mais" }
              - label: "Categoria do Botão"
                name: "category"
                widget: "select"
                hint: "Pra onde o botão leva quando clicado"
                options:
                  - { label: "Papelaria", value: "papelaria" }
                  - { label: "Informática", value: "informatica" }
                  - { label: "Gamer", value: "gamer" }
                  - { label: "Câmeras", value: "cameras" }
                  - { label: "Todos os Produtos", value: "all" }
              - { label: "Foto de Fundo", name: "image", widget: "image" }

'@

Write-Host "Concluido! Agora rode: git add . ; git commit -m 'atualiza site' ; git push" -ForegroundColor Green