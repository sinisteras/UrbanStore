// ==========================================
// ⚙️ إعدادات المتجر العامة
// ==========================================
const MY_PHONE_NUMBER = "9647700000000"; // 🔴 ضع رقمك هنا

// ==========================================
// 📦 1. قاعدة بيانات المنتجات
// ==========================================
const allProducts = [
    {
        id: 1,
        name: "بدلة رسمية سوداء",
        price: 150000,
        image: "images/suit.jpg",
        description: "بدلة رسمية فاخرة مصنوعة من أجود أنواع الأقمشة. مناسبة للحفلات والاجتماعات الرسمية."
    },
    {
        id: 2,
        name: "قميص أبيض كلاسيك",
        price: 35000,
        image: "images/shirt.jpg",
        description: "قميص قطني 100% مريح جداً ومقاوم للتعرق. تصميم عصري يناسب البدلات والجينز."
    },
    {
        id: 3,
        name: "حذاء جلد طبيعي",
        price: 60000,
        image: "images/shoes.jpg",
        description: "حذاء مصنوع يدوياً من الجلد الطبيعي. أرضية طبية لراحة القدمين طوال اليوم."
    }
];

// ==========================================
// 🛒 2. نظام السلة (Cart System)
// ==========================================
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

// تحديث أيقونة السلة فوراً عند التحميل
updateCartIcon();

function updateCartIcon() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        // حساب مجموع القطع وليس فقط عدد الأنواع
        const totalQty = cart.reduce((total, item) => total + item.qty, 0);
        countEl.textContent = totalQty;
    }
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    // الحفظ في الذاكرة
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartIcon();
    alert('تمت الإضافة للسلة بنجاح! ✅');
}

// ==========================================
// 👤 3. نظام تسجيل الدخول (Login System)
// ==========================================
// تشغيل التحقق من المستخدم في كل الصفحات عند التحميل
document.addEventListener('DOMContentLoaded', checkLoginState);

function checkLoginState() {
    // جلب البيانات من الذاكرة الدائمة
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    // تحديد العناصر في HTML
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links');
    const userNameDisplay = document.getElementById('user-name-display');

    // إذا لم تكن العناصر موجودة (مثلاً في صفحة السلة)، نتوقف
    if (!guestLinks || !userLinks) return;

    if (isLoggedIn === 'true' && userName) {
        // ✅ المستخدم مسجل دخول
        guestLinks.style.display = 'none';
        userLinks.style.display = 'flex';
        if(userNameDisplay) userNameDisplay.textContent = userName;
    } else {
        // ❌ المستخدم زائر
        guestLinks.style.display = 'flex';
        userLinks.style.display = 'none';
    }
}

// دالة تسجيل الخروج
function logoutUser() {
    // مسح مفتاح الدخول فقط، مع الاحتفاظ بالسلة
    localStorage.removeItem('isLoggedIn'); 
    alert('تم تسجيل الخروج. نراك قريباً! 👋');
    window.location.href = 'index.html'; // العودة للرئيسية
}


// ==========================================
// 📄 4. منطق الصفحات (Router Logic)
// ==========================================

// --- الصفحة الرئيسية (index.html) ---
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    const grid = document.querySelector('.products-grid');
    if (grid) {
        grid.innerHTML = allProducts.map(p => `
            <div class="product-card">
                <img src="${p.image}" onclick="goToProduct(${p.id})" style="cursor:pointer" alt="${p.name}">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} د.ع</p>
                <button onclick="addToCart(${p.id})">أضف للسلة</button>
            </div>
        `).join('');
    }
}

function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// --- صفحة تفاصيل المنتج (product.html) ---
if (window.location.pathname.includes('product.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = allProducts.find(p => p.id === id);

    if (product) {
        document.getElementById('p-img').src = product.image;
        document.getElementById('p-name').textContent = product.name;
        document.getElementById('p-price').textContent = product.price.toLocaleString() + ' د.ع';
        document.getElementById('p-desc').textContent = product.description;
        document.getElementById('add-btn').onclick = () => addToCart(product.id);
    }
}

// --- صفحة السلة (cart.html) ---
if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
}

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('final-total');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">السلة فارغة 🛒</td></tr>';
        totalEl.textContent = '0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <tr>
                <td><img src="${item.image}" width="50" style="border-radius:5px;"></td>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()}</td>
                <td>
                    <div style="display:flex; justify-content:center; gap:5px;">
                        <button onclick="changeQty(${index}, -1)" style="padding:2px 8px;">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" style="padding:2px 8px;">+</button>
                    </div>
                </td>
                <td><button onclick="removeItem(${index})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">&times;</button></td>
            </tr>
        `;
    }).join('');

    // حساب الخصم
    const discount = localStorage.getItem('discount') || 0;
    const finalTotal = total - (total * discount);
    
    totalEl.textContent = finalTotal.toLocaleString();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart[index].qty = 1;
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCartPage();
    updateCartIcon();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCartPage();
    updateCartIcon();
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value;
    if (code === 'IQ2025') {
        localStorage.setItem('discount', 0.10);
        alert('تم تفعيل خصم 10% بنجاح! 🎉');
        renderCartPage();
    } else {
        alert('كود الخصم غير صحيح ❌');
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert('السلة فارغة!');

    let msg = "مرحباً، أريد إتمام الطلب:%0a";
    let total = 0;
    
    cart.forEach(item => {
        msg += `- ${item.name} (عدد ${item.qty})%0a`;
        total += item.price * item.qty;
    });

    const discount = localStorage.getItem('discount') || 0;
    if(discount > 0) {
         msg += `%0a🔖 تم تطبيق خصم 10%`;
    }

    msg += `%0a💰 *الإجمالي النهائي: ${document.getElementById('final-total').textContent} د.ع*`;
    
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');
}
