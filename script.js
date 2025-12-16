// ==========================================
// ⚙️ إعدادات المتجر
// ==========================================
const MY_PHONE_NUMBER = "9647724329890"; 

// ==========================================
// 📦 1. قاعدة البيانات (مع نظام المخزون الذكي)
// ==========================================
const allProducts = [
    {
        id: 1,
        name: "بدلة رسمية سوداء",
        price: 150000,
        image: "images/suit.jpg",
        description: "بدلة رسمية فاخرة.",
        sizes: ["48", "50", "52"], 
        colors: ["أسود"],
        inventory: [
            { size: "48", color: "أسود", stock: 5 },
            { size: "50", color: "أسود", stock: 3 },
            { size: "52", color: "أسود", stock: 1 }
        ],
        gallery: ["images/suit.jpg", "images/suit_back.jpg", "images/suit_fabric.jpg"]
    },
    {
        id: 2,
        name: "قميص أبيض كلاسيك",
        price: 35000,
        image: "images/shirt.jpg",
        description: "قميص قطني 100%.",
        sizes: ["M", "L", "XL"],
        colors: ["أبيض"],
        inventory: [
            { size: "M", color: "أبيض", stock: 10 },
            { size: "L", color: "أبيض", stock: 4 },
            { size: "XL", color: "أبيض", stock: 2 }
        ],
        gallery: ["images/shirt.jpg","images/shirt2.jpg"]
    },
    {
        id: 3,
        name: "حذاء جلد طبيعي",
        price: 25000,
        image: "images/shoes.jpg",
        description: "حذاء جلد طبيعي.",
        sizes: ["40", "41", "42"],
        colors: ["أسود", "بني"],
        inventory: [
            { size: "40", color: "أسود", stock: 5 },
            { size: "41", color: "أسود", stock: 2 },
            { size: "40", color: "بني", stock: 3 }
        ],
        gallery: ["images/shoes.jpg", "images/shoes2.jpg"]
    },
    {
        id: 4,
        name: "سويتر شتوي",
        price: 25000,
        image: "images/sweater.jpg",
        description: "سويتر صوف دافئ.",
        sizes: ["M", "L", "XL"],
        colors: ["رمادي", "أحمر", "أصفر"],
        inventory: [
            { size: "M", color: "رمادي", stock: 6 },
            { size: "L", color: "أحمر", stock: 0 }
        ],
        gallery: ["images/sweater.jpg", "images/sweater_red.jpg", "images/sweater_yellow.jpg"]
    },
    {
        id: 5,
        name: "بنطلون رسمي",
        price: 20000,
        image: "images/pant.jpg",
        description: "بنطلون قماش رسمي فاخر.",
        sizes: ["30", "32", "34"],
        colors: ["اسود"],
        inventory: [
            { size: "30", color: "اسود", stock: 4 },
            { size: "32", color: "اسود", stock: 2 },
            { size: "34", color: "اسود", stock: 0 }
        ],
        gallery: ["images/pant.jpg"]
    }
];

// ==========================================
// 🛒 2. نظام السلة
// ==========================================
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
updateCartIcon();

function updateCartIcon() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.reduce((total, item) => total + item.qty, 0);
}

function addToCart(productId, selectedSize = null, selectedColor = null) {
    const product = allProducts.find(p => p.id === productId);
    const finalSize = selectedSize || "";
    const finalColor = selectedColor || "";

    const existingItem = cart.find(item => item.id === productId && item.size === finalSize && item.color === finalColor);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1, size: finalSize, color: finalColor });
    }
    
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartIcon();
    alert('تمت الإضافة للسلة! ✅');
}

// ==========================================
// 📄 3. منطق الصفحات
// ==========================================

// --- الصفحة الرئيسية ---
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    const grid = document.querySelector('.products-grid');
    if (grid) {
        grid.innerHTML = allProducts.map(p => `
            <div class="product-card">
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'" onclick="goToProduct(${p.id})" style="cursor:pointer">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} د.ع</p>
                <button onclick="goToProduct(${p.id})">عرض التفاصيل</button>
            </div>
        `).join('');
    }
}

function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// --- صفحة تفاصيل المنتج ---
if (window.location.pathname.includes('product.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = allProducts.find(p => p.id === id);

    if (product) {
        const mainImg = document.getElementById('p-img');
        mainImg.src = product.image;
        document.getElementById('p-name').textContent = product.name;
        document.getElementById('p-price').textContent = product.price.toLocaleString() + ' د.ع';
        document.getElementById('p-desc').textContent = product.description;

        const thumbsContainer = document.getElementById('thumbnails-container');
        thumbsContainer.innerHTML = ''; 
        if (product.gallery) {
            product.gallery.forEach(imgSrc => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.style = "width:60px; height:60px; object-fit:cover; border:2px solid #ddd; border-radius:5px; cursor:pointer;";
                thumb.onclick = () => {
                    mainImg.src = imgSrc;
                    document.querySelectorAll('#thumbnails-container img').forEach(i => i.style.borderColor = '#ddd');
                    thumb.style.borderColor = '#1abc9c';
                };
                thumbsContainer.appendChild(thumb);
            });
        }

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        if (product.sizes?.length) {
            optionsContainer.innerHTML += `<label>القياس:</label> <select id="size-select" onchange="updateStockStatus(${product.id})"><option value="">اختر..</option>${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select><br><br>`;
        }
        if (product.colors?.length) {
            optionsContainer.innerHTML += `<label>اللون:</label> <select id="color-select" onchange="updateStockStatus(${product.id})"><option value="">اختر..</option>${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select>`;
        }
        optionsContainer.innerHTML += `<div id="stock-display" style="margin-top:15px; font-weight:bold; color:#e67e22;">يرجى اختيار القياس واللون</div>`;

        document.getElementById('add-btn').onclick = () => {
            const s = document.getElementById('size-select')?.value;
            const c = document.getElementById('color-select')?.value;
            if ((product.sizes?.length && !s) || (product.colors?.length && !c)) return alert('يرجى اختيار القياس واللون!');
            addToCart(product.id, s, c);
        };
    }
}

function updateStockStatus(productId) {
    const product = allProducts.find(p => p.id === productId);
    const s = document.getElementById('size-select')?.value;
    const c = document.getElementById('color-select')?.value;
    const display = document.getElementById('stock-display');
    const btn = document.getElementById('add-btn');

    if (s && c && product.inventory) {
        const variant = product.inventory.find(v => v.size === s && v.color === c);
        if (variant) {
            if (variant.stock > 0) {
                display.textContent = `متوفر: ${variant.stock} قطعة`;
                display.style.color = "#27ae60";
                btn.disabled = false; btn.style.opacity = "1";
            } else {
                display.textContent = "نفد من المخزون ❌";
                display.style.color = "#c0392b";
                btn.disabled = true; btn.style.opacity = "0.5";
            }
        } else {
            display.textContent = "غير متوفر بهذا التشكيل";
        }
    }
}

// --- صفحة السلة ---
if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
}

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('final-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5">السلة فارغة 🛒</td></tr>';
        totalEl.textContent = '0';
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.qty;
        return `
            <tr>
                <td><img src="${item.image}" width="50"></td>
                <td>${item.name}<br><small>${item.size} | ${item.color}</small></td>
                <td>${item.price.toLocaleString()}</td>
                <td>
                    <button onclick="changeQty(${index}, -1)">-</button>
                    ${item.qty}
                    <button onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td><button onclick="removeItem(${index})">❌</button></td>
            </tr>`;
    }).join('');

    const discountPercent = parseFloat(localStorage.getItem('discount')) || 0;
    const finalTotal = subtotal - (subtotal * discountPercent);
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

// --- إتمام الطلب ---
function checkoutWhatsApp() {
    if (cart.length === 0) return alert('السلة فارغة!');

    // خصم المخزون محلياً
    cart.forEach(item => {
        const pDb = allProducts.find(p => p.id === item.id);
        if (pDb?.inventory) {
            const variant = pDb.inventory.find(v => v.size === item.size && v.color === item.color);
            if (variant) variant.stock = Math.max(0, variant.stock - item.qty);
        }
    });

    // حرق كود الخصم بعد الطلب
    if (localStorage.getItem('discount') > 0) {
        localStorage.setItem('coupon_IQ2025_used', 'true');
        localStorage.setItem('discount', 0);
    }

    let msg = "مرحباً Urban Gent، طلب جديد:%0a%0a";
    cart.forEach((item, i) => {
        msg += `${i+1}. *${item.name}*%0a القياس: ${item.size} | اللون: ${item.color}%0a الكمية: ${item.qty}%0a السعر: ${(item.price*item.qty).toLocaleString()} د.ع%0a%0a`;
    });

    msg += `💰 *الإجمالي النهائي: ${document.getElementById('final-total').textContent} د.ع*`;
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');
}

// كود الخصم
function applyCoupon() {
    const codeInput = document.getElementById('coupon-code');
    const code = codeInput.value.trim();
    const isUsed = localStorage.getItem('coupon_IQ2025_used');

    if (isUsed === 'true') {
        alert("عذراً، لقد استخدمت هذا الكود مسبقاً! ❌");
        codeInput.value = "";
        return;
    }

    if (code === "IQ2025") {
        localStorage.setItem('discount', 0.10);
        alert("تهانينا! تم تطبيق خصم 10% ✅");
        renderCartPage();
    } else {
        alert("كود الخصم غير صحيح ❌");
        localStorage.setItem('discount', 0);
        renderCartPage();
    }
}

// تسجيل الدخول والحسابات
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('userName');
    if (user && document.getElementById('user-name-display')) {
        document.getElementById('guest-links').style.display = 'none';
        document.getElementById('user-links').style.display = 'flex';
        document.getElementById('user-name-display').textContent = user;
    }
});

function loginUser() {
    const phone = document.getElementById('login-phone').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    let users = JSON.parse(localStorage.getItem('registered_users')) || [];
    const user = users.find(u => u.phone === phone && u.password === pass);

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', phone);
        alert("أهلاً بك مجدداً! ✅");
        window.location.href = 'index.html';
    } else {
        alert("خطأ في البيانات ❌");
    }
}

function registerUser() {
    const phone = document.getElementById('phone').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (phone.length < 10) return alert("رقم الهاتف غير صحيح");
    
    let users = JSON.parse(localStorage.getItem('registered_users')) || [];
    if (users.find(u => u.phone === phone)) return alert("الرقم مسجل مسبقاً ❌");

    users.push({ phone, password: pass });
    localStorage.setItem('registered_users', JSON.stringify(users));
    alert("تم التسجيل! يمكنك الدخول الآن ✅");
    window.location.href = 'login.html';
}

function logoutUser() { 
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('userName');
    window.location.href = 'index.html'; 
}
