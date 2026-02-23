// Productos iniciales
let productsData = [
    {id: 1, name: 'Capuccino Caliente 8oz', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 2, name: 'Capuccino Caliente 16oz', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 3, name: 'Capuccino Vainilla Caliente 8oz', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 4, name: 'Capuccino Vainilla Caliente 16oz', category: 'bebidas-calientes', 
    price: 50, stock: 0, emoji: '☕', active: true},
    {id: 5, name: 'Mochaccino Caliente 8oz', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 6, name: 'Mochaccino Caliente 16oz', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 7, name: 'Mocha Canela Caliente 8oz', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 8, name: 'Mocha Canela Caliente 16oz', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 9, name: 'Latte Caliente 8oz', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 10, name: 'Latte Caliente 16oz', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 11, name: 'Chocolate Caliente 8oz', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 12, name: 'Chocolate Caliente 16oz', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 13, name: 'Espresso Caliente', category: 'bebidas-calientes', price: 40,
    stock: 0, emoji: '☕', active: true},
    {id: 14, name: 'Espresso Doble', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 15, name: 'Lungo', category: 'bebidas-calientes', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 16, name: 'Capuccino Frío 16oz', category: 'bebidas-frias', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 17, name: 'Capuccino Vainilla Frío 16oz', category: 'bebidas-frias', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 18, name: 'Mochaccino Frío 16oz', category: 'bebidas-frias', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 19, name: 'Mocha Canela Frío 16oz', category: 'bebidas-frias', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 20, name: 'Latte Frío 16oz', category: 'bebidas-frias', price: 50,
    stock: 0, emoji: '☕', active: true},
    {id: 21, name: 'Chocolate Frío 16oz', category: 'bebidas-frias', price: 50,
    stock: 0, emoji: '☕', active: true},
]

let salesHistory = [];

// Estado de la app
let currentUser = null; //Nadie ha iniciado sesión todavía
let cart = []; //Carrito de compras vacío
let currentCategory = 'all'; //Categoría seleccionada en el filtro de productos
let currentScreen = 'pos' //Pantalla activa que se está mostrando

// Llaves para localstorage
const STORAGE_KEYS = {
    PRODUCTS: 'posApp_products',
    SALES_HISTORY: 'posApp_salesHistory',
    CART: 'posApp_cart',
    CATEGORY: 'posApp_currentCategory'
};


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp(){

    // Carga de datos guardados (localstorage)
    loadAllData();

    // Login del POS
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    btnLogin.addEventListener('click', handleLogin);

    // Logout del POS
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    cart = [];
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('posScreen').classList.add('hidden');
    document.getElementById('loginForm').reset();
})

    // Navegación
    setupNavigation();

    // Reloj en tiempo real
    updateClock();
    setInterval(updateClock, 1000);

    // Gestión de productos
    renderProductsTable();

    // Cargar productos
    renderProducts();

    // Configurar eventos del POS
    setupPOSEvents();

    // Configurar búsqueda
    const searchInput = document.getElementById('productSearch');
    searchInput.addEventListener('input', handleSearch);
    
    // Configurar categorías
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => handleCategoryChange(btn));
    });

}

// Login
function handleLogin(e){
    e.preventDefault();

    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    
    // Simulación de login (en una app real, esto sería una llamada al backend)
    if(user === 'admin' && password === 'admin'){
        currentUser = {name: 'Administrador', role: 'Gerente'};
        // Ocultar pantalla de login y mostrar app
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('posScreen').classList.remove('hidden');
    } else {
        alert('Credenciales incorrectas');
    }
}

//Navegación
function setupNavigation(){
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Leemos el valor del atributo data-screen en HTML para saber que titulo del nav resaltar
            const screen = item.dataset.screen;
            switchScreen(screen);
        })
    })
}

function switchScreen(screenName){  
    document.querySelectorAll('.nav-item').forEach(item =>{
        item.classList.remove('active');
        if (item.dataset.screen === screenName){
            item.classList.add('active');
        }
    });

    // Ocultamos todas las pantallas
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.add('hidden');
    })

    // Mostramos la pantalla seleccionada
    const screenElement = document.getElementById(`${screenName}Screen`);
    if (screenElement){
        screenElement.classList.remove('hidden');
    }

    if (screenName === 'reports') {
        // Reemplaza updateReports() por renderReportsScreen()
        renderReportsScreen(); 
    }
}

// Reloj en tiempo real
function updateClock(){
    const now = new Date();

    // Hora
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('currentTime').textContent = timeString;

    // Fecha
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${dayName}, ${day} ${month} ${year}`;
    document.getElementById('currentDate').textContent = dateString;
}

// Productos
function renderProducts(filter = ''){ // Cambiado 'all' por ''
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    let filteredProducts = productsData.filter(p => p.active);

    // 1. Filtrar por categoría
    if (currentCategory !== 'all'){
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    // 2. Filtrar por búsqueda (solo si el filtro no es "all" y tiene texto)
    if (filter && filter !== 'all') { 
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => addToCart(product);
    
    let stockClass = '';
    let stockText = product.stock;
    if (product.stock < 10) {
        stockClass = 'low';
        stockText = `¡${product.stock}!`;
    } else if (product.stock === 0) {
        stockClass = 'out';
        stockText = 'Agotado';
    }
    
    card.innerHTML = `
        <span class="product-stock ${stockClass}">${stockText}</span>
        <div class="product-image">${product.emoji}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
    `;
    
    return card;
}

function handleCategoryChange(btn) {
    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Actualizar categoría actual
    currentCategory = btn.dataset.category;

    // Guarda en localstorage
    saveCategory();
    
    // Re-renderizar productos
    renderProducts();
}

function handleSearch(e) {
    const filter = e.target.value;
    renderProducts(filter);
}

// Carrito de compras
function addToCart(product) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(); // Guarda cambios en localstorage
    renderCart();
    updateCartSummary();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateCartSummary();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
            updateCartSummary();
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z"/>
                </svg>
                <p>Carrito vacío</p>
                <small>Agrega productos para comenzar</small>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
    if (cart.length > 0 && confirm('¿Estás seguro de limpiar el carrito?')) {
        cart = [];
        renderCart();
        updateCartSummary();
    }
}

// Eventos del POS
function setupPOSEvents() {
    // Botón limpiar carrito
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    
    // Botón cobrar
    document.getElementById('checkoutBtn').addEventListener('click', openPaymentModal);
    
    // Modal de pago
    document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
    document.getElementById('cancelPaymentBtn').addEventListener('click', closePaymentModal);
    document.getElementById('confirmPaymentBtn').addEventListener('click', processPayment);
    
    // Métodos de pago
    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', () => selectPaymentMethod(btn));
    });
    
    // Cálculo de cambio
    document.getElementById('receivedAmount').addEventListener('input', calculateChange);
}

// Modal de pago
function openPaymentModal() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    document.getElementById('paymentTotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('receivedAmount').value = '';
    document.getElementById('changeAmount').textContent = '$0.00';
    
    document.getElementById('paymentModal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
}

function selectPaymentMethod(btn) {
    document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const method = btn.dataset.method;
    const cashSection = document.getElementById('cashPaymentSection');
    
    if (method === 'efectivo') {
        cashSection.style.display = 'block';
    } else {
        cashSection.style.display = 'none';
    }
}

function calculateChange() {
    const total = parseFloat(document.getElementById('paymentTotal').textContent.replace('$', ''));
    const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
    const change = received - total;
    
    if (change >= 0) {
        document.getElementById('changeAmount').textContent = `$${change.toFixed(2)}`;
        document.getElementById('changeAmount').style.color = 'var(--color-success)';
    } else {
        document.getElementById('changeAmount').textContent = `$${Math.abs(change).toFixed(2)} faltante`;
        document.getElementById('changeAmount').style.color = 'var(--color-danger)';
    }
}

function processPayment() {
    const activeMethod = document.querySelector('.payment-method-btn.active');
    
    if (!activeMethod) {
        alert('Selecciona un método de pago');
        return;
    }
    
    const method = activeMethod.dataset.method;
    const total = parseFloat(document.getElementById('paymentTotal').textContent.replace('$', ''));
    
    if (method === 'efectivo') {
        const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
        
        if (received < total) {
            alert('El monto recibido es insuficiente');
            return;
        }
    }
    
        // 1. Crear el objeto de la venta actual
    const currentSale = {
        id: Date.now(), // ID único basado en el tiempo
        date: new Date().toLocaleDateString(), // Fecha de hoy
        items: [...cart], // Copia de los items del carrito
        total: total
    };

    // 2. Guardar en el historial
    salesHistory.push(currentSale);
    saveSalesHistory();
    
    // Simulación de procesamiento de pago
    alert('¡Pago procesado exitosamente!');
    
    // Limpiar carrito
    cart = [];
    renderCart();
    updateCartSummary();
    
    // Cerrar modal
    closePaymentModal();
    
    // En una aplicación real, aquí se imprimiría el ticket
    console.log('Imprimir ticket...');
}

// Generador de reportes
function renderReportsScreen() {
    const screen = document.getElementById('reportsScreen');
    
    // --- 1. CÁLCULOS MATEMÁTICOS ---
    
    // Filtramos ventas de hoy (Opcional: si quieres histórico total, quita el filtro)
    const today = new Date().toLocaleDateString();
    const todaysSales = salesHistory.filter(s => s.date === today);

    // A) Ventas Totales ($)
    const totalSales = todaysSales.reduce((acc, sale) => acc + sale.total, 0);

    // B) Total de Ordenes (Tickets)
    const totalOrders = todaysSales.length;

    // C) Ticket Promedio
    const averageTicket = totalOrders > 0 ? (totalSales / totalOrders) : 0;

    // D) Producto Más Vendido
    let productCounts = {};
    todaysSales.forEach(sale => {
        sale.items.forEach(item => {
            productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
    });
    
    // Buscar cuál tiene el número más alto
    let topProduct = 'N/A';
    let maxCount = 0;
    
    for (const [name, count] of Object.entries(productCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topProduct = name;
        }
    }

    // --- 2. GENERACIÓN DEL HTML ---
    
    screen.innerHTML = `
        <div id="reportsScreen" class="screen-content">
                    <div class="reports-container">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon" style="background: #2D7A4F;">
                                    <svg viewBox="0 0 24 24" fill="white">
                                        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                                    </svg>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-label">Ventas Hoy</div>
                                    <div class="stat-value">$${totalSales.toFixed(2)}</div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon" style="background: #D97706;">
                                    <svg viewBox="0 0 24 24" fill="white">
                                        <path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z"/>
                                    </svg>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-label">Órdenes Hoy</div>
                                    <div class="stat-value">${totalOrders}</div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon" style="background: #7C3AED;">
                                    <svg viewBox="0 0 24 24" fill="white">
                                        <path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z"/>
                                    </svg>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-label">Producto Top</div>
                                    <div class="stat-value">${topProduct}</div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon" style="background: #DC2626;">
                                    <svg viewBox="0 0 24 24" fill="white">
                                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                                    </svg>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-label">Ticket Promedio</div>
                                    <div class="stat-value">$${averageTicket.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    `;
    
    // Importante: Asegurar que se muestre la pantalla
    // (Esto asume que manejas la navegación ocultando/mostrando clases)
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

//  SISTEMA DE FOLIOS — Recibo y Merma

// Llaves de localStorage para folios
const FOLIO_KEYS = {
    RECIBOS: 'posApp_foliosRecibo',
    MERMAS:  'posApp_foliosMerma'
};

// Estado del modal activo
let folioTipoActual = null;         // 'recibo' | 'merma'
let folioSeleccion = {};            // { productId: cantidad }

// Contadores persistentes
function cargarContadorFolios() {
    const recibos = cargarFoliosDelStorage(FOLIO_KEYS.RECIBOS);
    const mermas  = cargarFoliosDelStorage(FOLIO_KEYS.MERMAS);

    document.getElementById('badgeRecibo').textContent = recibos.length;
    document.getElementById('badgeMerma').textContent  = mermas.length;

    renderizarHistorialFolios('listaRecibo', 'badgeRecibo', recibos, 'primary');
    renderizarHistorialFolios('listaMerma',  'badgeMerma',  mermas,  'danger');
}

function cargarFoliosDelStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function guardarFolioEnStorage(key, folio) {
    const lista = cargarFoliosDelStorage(key);
    lista.unshift(folio); // más reciente primero
    localStorage.setItem(key, JSON.stringify(lista));
}

// Abrir modal
function crearFolioRecibo() {
    abrirFolioModal('recibo');
}

function crearFolioMerma() {
    abrirFolioModal('merma');
}

function abrirFolioModal(tipo) {
    folioTipoActual = tipo;
    folioSeleccion  = {};

    const esRecibo = tipo === 'recibo';

    // Configurar cabecera del modal
    document.getElementById('folioModalIcon').innerHTML = esRecibo
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

    document.getElementById('folioModalIcon').className =
        `folio-modal__icon folio-modal__icon--${esRecibo ? 'primary' : 'danger'}`;

    document.getElementById('folioModalTitle').textContent =
        esRecibo ? 'Nuevo Folio de Recibo' : 'Nuevo Folio de Merma';

    document.getElementById('folioModalSubtitle').textContent =
        esRecibo
            ? 'Selecciona los productos que ingresan al inventario'
            : 'Selecciona los productos a dar de baja por merma';

    document.getElementById('folioConfirmBtn').textContent =
        esRecibo ? '✔ Confirmar Recibo' : '✔ Confirmar Merma';

    document.getElementById('folioConfirmBtn').className =
        `btn folio-btn-confirm folio-btn-confirm--${esRecibo ? 'primary' : 'danger'}`;

    document.getElementById('folioSearchInput').value = '';
    document.getElementById('folioSelectedCount').textContent = '0 productos seleccionados';

    renderizarProductosModal('');
    document.getElementById('folioModal').classList.remove('hidden');
}

function cerrarFolioModal() {
    document.getElementById('folioModal').classList.add('hidden');
    folioTipoActual = null;
    folioSeleccion  = {};
}

// Renderizar productos dentro del modal
function renderizarProductosModal(filtro) {
    const lista = document.getElementById('folioProductsList');
    lista.innerHTML = '';

    const productosActivos = productsData.filter(p =>
        p.active &&
        p.name.toLowerCase().includes(filtro.toLowerCase())
    );

    if (productosActivos.length === 0) {
        lista.innerHTML = `<div class="folio-no-results">Sin resultados para "${filtro}"</div>`;
        return;
    }

    productosActivos.forEach(producto => {
        const cantidadActual = folioSeleccion[producto.id] || 0;
        const row = document.createElement('div');
        row.className = 'folio-product-row';
        row.id = `folioRow-${producto.id}`;

        row.innerHTML = `
            <div class="folio-product-info">
                <span class="folio-product-emoji">${producto.emoji}</span>
                <div>
                    <div class="folio-product-name">${producto.name}</div>
                    <div class="folio-product-stock">Stock actual: <strong>${producto.stock}</strong></div>
                </div>
            </div>
            <div class="folio-product-qty">
                <button class="folio-qty-btn folio-qty-btn--minus"
                    onclick="cambiarCantidadFolio(${producto.id}, -1)"
                    ${cantidadActual === 0 ? 'disabled' : ''}>−</button>
                <input
                    type="number"
                    min="0"
                    class="folio-qty-input"
                    id="folioQty-${producto.id}"
                    value="${cantidadActual}"
                    oninput="setCantidadFolio(${producto.id}, this.value)"
                />
                <button class="folio-qty-btn folio-qty-btn--plus"
                    onclick="cambiarCantidadFolio(${producto.id}, 1)">+</button>
            </div>
        `;

        if (cantidadActual > 0) row.classList.add('folio-product-row--selected');
        lista.appendChild(row);
    });
}

function filtrarProductosModal() {
    const filtro = document.getElementById('folioSearchInput').value;
    renderizarProductosModal(filtro);
}

// Manejo de cantidades
function cambiarCantidadFolio(productoId, delta) {
    const actual = folioSeleccion[productoId] || 0;
    const nuevo  = Math.max(0, actual + delta);
    folioSeleccion[productoId] = nuevo;
    actualizarFilaFolio(productoId);
    actualizarContadorSeleccion();
}

function setCantidadFolio(productoId, valor) {
    const parsed = parseInt(valor);
    folioSeleccion[productoId] = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    actualizarFilaFolio(productoId);
    actualizarContadorSeleccion();
}

function actualizarFilaFolio(productoId) {
    const cantidad = folioSeleccion[productoId] || 0;
    const input    = document.getElementById(`folioQty-${productoId}`);
    const row      = document.getElementById(`folioRow-${productoId}`);
    const btnMinus = row?.querySelector('.folio-qty-btn--minus');

    if (input) input.value = cantidad;
    if (row)   row.classList.toggle('folio-product-row--selected', cantidad > 0);
    if (btnMinus) btnMinus.disabled = cantidad === 0;
}

function actualizarContadorSeleccion() {
    const total = Object.values(folioSeleccion).reduce((sum, v) => sum + (v > 0 ? 1 : 0), 0);
    document.getElementById('folioSelectedCount').textContent =
        `${total} producto${total !== 1 ? 's' : ''} seleccionado${total !== 1 ? 's' : ''}`;
}

// Confirmar folio y actualizar stock
function confirmarFolio() {
    const productosConCantidad = Object.entries(folioSeleccion)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ id: parseInt(id), qty }));

    if (productosConCantidad.length === 0) {
        alert('Debes seleccionar al menos un producto con cantidad mayor a 0.');
        return;
    }

    const esRecibo = folioTipoActual === 'recibo';
    const itemsFolio = [];

    // Validar stock suficiente en caso de merma
    if (!esRecibo) {
        for (const { id, qty } of productosConCantidad) {
            const producto = productsData.find(p => p.id === id);
            if (producto && producto.stock < qty) {
                alert(`Stock insuficiente para "${producto.name}".\nStock actual: ${producto.stock} | Merma solicitada: ${qty}`);
                return;
            }
        }
    }

    // Actualizar stock
    productosConCantidad.forEach(({ id, qty }) => {
        const producto = productsData.find(p => p.id === id);
        if (!producto) return;

        const stockAnterior = producto.stock;
        producto.stock = esRecibo
            ? producto.stock + qty
            : producto.stock - qty;

        itemsFolio.push({
            id:             producto.id,
            nombre:         producto.name,
            emoji:          producto.emoji,
            cantidad:       qty,
            stockAnterior,
            stockNuevo:     producto.stock
        });
    });

    // Guardar productos en localStorage
    saveProducts();

    // Generar y guardar folio
    const storageKey = esRecibo ? FOLIO_KEYS.RECIBOS : FOLIO_KEYS.MERMAS;
    const listasEnStorage = cargarFoliosDelStorage(storageKey);
    const numeracion = listasEnStorage.length + 1;

    const folio = {
        folio:  esRecibo
            ? `REC-${String(numeracion).padStart(4, '0')}`
            : `MER-${String(numeracion).padStart(4, '0')}`,
        fecha:  new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
        hora:   new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        items:  itemsFolio
    };

    guardarFolioEnStorage(storageKey, folio);

    // Refrescar UI
    const listaId  = esRecibo ? 'listaRecibo'  : 'listaMerma';
    const badgeId  = esRecibo ? 'badgeRecibo'  : 'badgeMerma';
    const tipo     = esRecibo ? 'primary'       : 'danger';
    const foliosActualizados = cargarFoliosDelStorage(storageKey);

    renderizarHistorialFolios(listaId, badgeId, foliosActualizados, tipo);
    renderProducts();        // Actualiza el POS
    renderProductsTable();   // Actualiza tabla de admin

    cerrarFolioModal();
}

// Renderizar historial de folios
function renderizarHistorialFolios(listaId, badgeId, folios, tipo) {
    const lista = document.getElementById(listaId);
    const badge = document.getElementById(badgeId);

    badge.textContent = folios.length;
    lista.innerHTML   = '';

    if (folios.length === 0) {
        const etiqueta = tipo === 'primary' ? 'recibo' : 'merma';
        lista.innerHTML = `
            <div class="folio-history__empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>Sin folios de ${etiqueta} aún</p>
            </div>`;
        return;
    }

    folios.forEach(folio => {
        const item = document.createElement('div');
        item.className = `folio-item folio-item--${tipo}`;

        const resumen = folio.items.map(i =>
            `${i.emoji} ${i.nombre} (${i.cantidad > 0 && tipo === 'primary' ? '+' : '-'}${i.cantidad})`
        ).join(', ');

        item.innerHTML = `
            <div class="folio-item__left">
                <span class="folio-item__numero">${folio.folio}</span>
                <span class="folio-item__fecha">${folio.fecha}</span>
                <span class="folio-item__detalle" title="${resumen}">${resumen}</span>
            </div>
            <div class="folio-item__right">
                <span class="folio-item__hora">${folio.hora}</span>
                <span class="folio-item__status">Aplicado</span>
            </div>`;

        lista.appendChild(item);
    });
}

// Gestión de productos
function renderProductsTable(){ 
    const tableBody = document.getElementById('productsTable');
    tableBody.innerHTML = '';

    productsData.forEach(product => {
        const row = document.createElement('tr');
        
        const categoryNames = {
            'bebidas-calientes': 'Bebidas Calientes',
            'bebidas-frias': 'Bebidas Frías',
            'postres': 'Postres',
            'alimentos': 'Alimentos'
        };

        row.innerHTML = `
            <td>
                <div class="product-table-image">${product.emoji}</div>
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${categoryNames[product.category]}</td>
            <td><strong>$${product.price.toFixed(2)}</strong></td>
            <td>${product.stock} unidades</td>
            <td>
                <span class="status-badge ${product.active ? 'active' : 'inactive'}">
                    ${product.active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="editProduct(${product.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                    </svg>
                </button>
                <button class="action-btn" onclick="deleteProduct(${product.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Editar producto
function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    
    if (product) {
        // Llenar los inputs con los datos actuales
        document.getElementById('editId').value = product.id;
        document.getElementById('editName').value = product.name;
        document.getElementById('editCategory').value = product.category;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editStock').value = product.stock;
        document.getElementById('editStatus').value = product.active.toString();

        document.querySelector('#editModal h3').textContent = 'Editar Producto';
        const saveBtn = document.querySelector('#editModal .save-btn');
        saveBtn.setAttribute('onclick', 'saveEditedProduct()');

        // Mostrar el modal
        document.getElementById('editModal').style.display = 'flex';
    }
}

function closeModal() {
    // El evento onclick se agregó directamente en el HTML
    document.getElementById('editModal').style.display = 'none';
}

function saveEditedProduct() {
    // Obtener los valores del formulario
    const id = parseInt(document.getElementById('editId').value);
    const newEmoji = document.getElementById('editEmoji').value;
    const newName = document.getElementById('editName').value;
    const newCategory = document.getElementById('editCategory').value;
    const newPrice = document.getElementById('editPrice').value; // Lo tomamos como string primero para validar
    const newStock = document.getElementById('editStock').value;
    const newStatus = document.getElementById('editStatus').value === 'true';

    // Validacion Manual (Porque ya no es submit)
    // Si algún campo obligatorio está vacío, mostramos alerta y detenemos la función
    if (newName.trim() === '' || newPrice === '' || newStock === '') {
        alert('Por favor, completa todos los campos obligatorios.');
        return; // Detiene la ejecución aquí
    }

    // Buscar el producto en el array
    const index = productsData.findIndex(p => p.id === id);

    if (index !== -1) {
        // Actualizar el objeto en el array productsData
        productsData[index] = {
            ...productsData[index], // Mantenemos el ID y cualquier otra propiedad original
            emoji: newEmoji,
            name: newName,
            category: newCategory,
            price: parseFloat(newPrice), // Convertimos a número aquí
            stock: parseInt(newStock),   // Convertimos a número aquí
            active: newStatus
        };

        saveProducts();

        // Cerrar el modal, guardar en localstorage y refrescar la tabla
        saveProducts(); 
        closeModal();
        renderProductsTable();
        renderProducts(); // Si quieres que los cambios se reflejen también en la vista de productos

        // Opcional: Feedback visual
        alert('Producto actualizado:', productsData[index]);
    } else {
        alert('Error: No se encontró el producto a editar.');
    }
}

// Eliminar producto
function deleteProduct(id) {
    // Confirmación de seguridad
    if (confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
        
        // Filtramos el array: dejamos todos los productos EXCEPTO el que tiene el ID recibido
        productsData = productsData.filter(product => product.id !== id);

        // Actualizamos las vistas y guardamos en localstorage en tiempo real
        saveProducts(); // Guarda en localstorage
        renderProductsTable(); // Refresca la tabla de administración
        renderProducts();      // Refresca la cuadrícula de ventas (POS)
        alert(`Producto fue eliminado correctamente.`);
    }
}

// Crear un nuevo producto
function openAddProductModal() {
    // 1. Limpiar el formulario (Resetear inputs)
    document.getElementById('editForm').reset();
    document.getElementById('editId').value = ''; // No hay ID porque es nuevo

    // 2. Cambiar el título del Modal (Opcional, para mejor UX)
    document.querySelector('#editModal h3').textContent = 'Nuevo Producto';

    // 3. CAMBIO CLAVE: Cambiar el comportamiento del botón "Guardar"
    // Buscamos el botón por su clase y cambiamos su atributo onclick
    const saveBtn = document.querySelector('#editModal .save-btn');
    saveBtn.setAttribute('onclick', 'saveNewProduct()');

    // 4. Mostrar el modal
    document.getElementById('editModal').style.display = 'flex';
}

function saveNewProduct() {
    // 1. Obtener valores del formulario
    const name = document.getElementById('editName').value;
    const category = document.getElementById('editCategory').value;
    const price = document.getElementById('editPrice').value;
    const stock = document.getElementById('editStock').value;
    const emoji = document.getElementById('editEmoji').value || '☕'; // Valor por defecto
    const status = document.getElementById('editStatus').value === 'true';

    // 2. Validación básica
    if (name.trim() === '' || price === '' || stock === '') {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // 3. Generar un ID Nuevo (Busca el ID más alto y le suma 1)
    // Esto evita que se repitan IDs aunque borres productos intermedios
    const newId = productsData.length > 0 
        ? Math.max(...productsData.map(p => p.id)) + 1 
        : 1;

    // 4. Crear el objeto del nuevo producto
    const newProduct = {
        id: newId,
        name: name,
        category: category,
        price: parseFloat(price),
        stock: parseInt(stock),
        emoji: emoji,
        active: status
    };

    // 5. Agregarlo al array principal
    productsData.push(newProduct);

    // 6. Actualizar las vistas, guardar en localstorage y cerrar
    saveProducts(); // Guarda en localstorage
    renderProductsTable(); // Actualiza tabla
    renderProducts();      // Actualiza POS
    closeModal();
    
    alert('¡Producto agregado exitosamente!');
}

// Persistencia con localstorage (Guardar todo en localstorage)
// Función para guardar productos
function saveProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsData));
}

// Función para cargar productos
function loadProducts() {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (stored) {
        try {
            productsData = JSON.parse(stored);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            // Si hay error, mantener los datos iniciales
        }
    }
}

// Función para guardar historial de ventas
function saveSalesHistory() {
    localStorage.setItem(STORAGE_KEYS.SALES_HISTORY, JSON.stringify(salesHistory));
}

// Función para cargar historial de ventas
function loadSalesHistory() {
    const stored = localStorage.getItem(STORAGE_KEYS.SALES_HISTORY);
    if (stored) {
        try {
            salesHistory = JSON.parse(stored);
        } catch (error) {
            console.error('Error al cargar historial de ventas:', error);
            salesHistory = [];
        }
    }
}

// Función para guardar carrito
function saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

// Función para cargar carrito
function loadCart() {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    if (stored) {
        try {
            cart = JSON.parse(stored);
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            cart = [];
        }
    }
}

// Función para guardar categoría actual
function saveCategory() {
    localStorage.setItem(STORAGE_KEYS.CATEGORY, currentCategory);
}

// Función para cargar categoría actual
function loadCategory() {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORY);
    if (stored) {
        currentCategory = stored;
    }
}

// Función maestra para cargar TODO al iniciar
function loadAllData() {
    loadProducts();
    loadSalesHistory();
    loadCart();
    loadCategory();
}

// Función maestra para guardar TODO
function saveAllData() {
    saveProducts();
    saveSalesHistory();
    saveCart();
    saveCategory();
}

// Ver qué hay en localStorage (para debug)
function debugLocalStorage() {
    console.log('=== localStorage ===');
    console.log('Productos:', JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)));
    console.log('Historial:', JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES_HISTORY)));
    console.log('Carrito:', JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)));
    console.log('Categoría:', localStorage.getItem(STORAGE_KEYS.CATEGORY));
}

// FUNCIONES GLOBALES (necesarias para onclick en HTML)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.closeModal = closeModal;
window.saveEditedProduct = saveEditedProduct;
window.saveNewProduct = saveNewProduct;
window.openAddProductModal = openAddProductModal;