// ==========================================
// ⚙️ إعدادات المتجر ورقم الواتساب
// ==========================================
const MY_PHONE_NUMBER = "9647724329890"; 

// ==========================================
// 📦 1. قاعدة البيانات (مع نظام المخزون)
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
// --- صفحة تفاصيل المنتج ---
if (window.location.pathname.includes('product.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = allProducts.find(p => p.id === id);

    if (product) {
        // تحديث النصوص والصور
        const mainImg = document.getElementById('p-img');
        if (mainImg) mainImg.src = product.image;
        
        document.getElementById('p-name').textContent = product.name;
        document.getElementById('p-price').textContent = product.price.toLocaleString() + ' د.ع';
        document.getElementById('p-desc').textContent = product.description;

        // توليد الصور المصغرة
        const thumbsContainer = document.getElementById('thumbnails-container');
        if (thumbsContainer && product.gallery) {
            thumbsContainer.innerHTML = product.gallery.map(imgSrc => `
                <img src="${imgSrc}" onclick="document.getElementById('p-img').src='${imgSrc}'" 
                     style="width:60px; height:60px; object-fit:cover; border:2px solid #ddd; border-radius:5px; cursor:pointer;">
            `).join('');
        }

        // توليد خيارات القياس واللون
        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            let html = '';
            if (product.sizes) {
                html += `<label>القياس:</label> <select id="size-select" onchange="updateStockStatus(${product.id})">
                            <option value="">اختر..</option>
                            ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                         </select><br><br>`;
            }
            if (product.colors) {
                html += `<label>اللون:</label> <select id="color-select" onchange="updateStockStatus(${product.id})">
                            <option value="">اختر..</option>
                            ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                         </select>`;
            }
            html += `<div id="stock-display" style="margin-top:15px; font-weight:bold; color:#e67e22;">يرجى اختيار القياس واللون</div>`;
            optionsContainer.innerHTML = html;
        }

        // تفعيل زر الإضافة
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            addBtn.onclick = () => {
                const s = document.getElementById('size-select')?.value;
                const c = document.getElementById('color-select')?.value;
                if (!s || !c) return alert('يرجى اختيار القياس واللون! ⚠️');
                addToCart(product.id, s, c);
            };
        }
    }
}

// دالة تحديث حالة المخزون (تظهر للزبون إذا كانت القطعة متوفرة أم لا)
function updateStockStatus(productId) {
    const product = allProducts.find(p => p.id === productId);
    const s = document.getElementById('size-select')?.value;
    const c = document.getElementById('color-select')?.value;
    const display = document.getElementById('stock-display');
    const btn = document.getElementById('add-btn');

    if (s && c && product.inventory) {
        const variant = product.inventory.find(v => v.size === s && v.color === c);
        if (variant && variant.stock > 0) {
            display.textContent = `متوفر: ${variant.stock} قطعة ✅`;
            display.style.color = "#27ae60";
            btn.disabled = false; btn.style.opacity = "1";
        } else {
            display.textContent = "للأسف، نفدت هذه التشكيلة ❌";
            display.style.color = "#c0392b";
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    }
}
// ==========================================
// 🛒 2. نظام السلة الأساسي
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
// 📄 3. منطق الصفحات والتحكم بالعرض
// ==========================================

// --- تحديث حالة الهيدر (أهلاً فلان / دخول) ---
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && user) {
        if(document.getElementById('guest-links')) document.getElementById('guest-links').style.display = 'none';
        if(document.getElementById('user-links')) document.getElementById('user-links').style.display = 'flex';
        const nameDisplay = document.getElementById('user-name-display');
        if (nameDisplay) nameDisplay.textContent = user;
    }

    // تشغيل دوال الصفحات المحددة
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
});

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

// --- صفحة السلة ---
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('final-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5">السلة فارغة 🛒</td></tr>';
        totalEl.textContent = '0';
        updateCartButtons(); // تحديث الأزرار حتى لو فارغة
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
    
    updateCartButtons(); // تحديث أزرار الشحن/الدخول
}

function changeQty(index, delta) {
    const item = cart[index];
    const product = allProducts.find(p => p.id === item.id);
    
    // البحث عن كمية المخزون المتوفرة لهذا القياس واللون تحديداً
    const variant = product.inventory.find(v => v.size === item.size && v.color === item.color);
    const maxStock = variant ? variant.stock : 0;

    if (delta > 0) {
        // إذا كان الزبون يريد الزيادة، نتحقق من المخزون
        if (item.qty + delta > maxStock) {
            alert(`عذراً، المتوفر في المخزون هو ${maxStock} قطع فقط من هذا النوع ⚠️`);
            return; // توقف، لا تزيد الكمية
        }
    }

    // تنفيذ التغيير (زيادة أو نقصان)
    item.qty += delta;

    // التأكد من أن الكمية لا تقل عن 1
    if (item.qty < 1) item.qty = 1;

    // حفظ التعديلات وتحديث الصفحة
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

// --- نظام التحقق من الدخول في السلة ---
function updateCartButtons() {
    const actionArea = document.getElementById('checkout-action-area');
    if (!actionArea) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        actionArea.innerHTML = `
            <button onclick="checkoutWhatsApp()" style="width: 100%; padding: 15px; background: #25D366; color: white; border: none; font-weight: bold; font-size: 1.1em; cursor: pointer; border-radius: 5px; margin-top: 15px;">
                إتمام الطلب عبر واتساب 📱
            </button>
        `;
    } else {
        actionArea.innerHTML = `
            <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border: 1px solid #ffeeba; text-align: center; margin-top: 15px;">
                <p style="margin-bottom: 10px; font-weight: bold;">يجب تسجيل الدخول لإرسال الطلب 🔐</p>
                <a href="login.html" style="display: block; background: #2c3e50; color: white; padding: 10px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    تسجيل الدخول الآن
                </a>
            </div>
        `;
    }
}

// --- إتمام الطلب ---
function checkoutWhatsApp() {
    const user = localStorage.getItem('userName');
    if (!user) return alert("يرجى تسجيل الدخول أولاً 🔐");
    if (cart.length === 0) return alert('السلة فارغة!');

    const finalTotal = document.getElementById('final-total').textContent;

    // --- 1. تجهيز بيانات الطلب للسجل ---
    const orderData = {
        date: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
        items: cart.map(item => `${item.name} (${item.qty})`), // تحويل المنتجات لنصوص
        total: finalTotal
    };

    // --- 2. حفظ في سجل الطلبات (orderHistory) ---
    let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history.push(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(history));

    // --- 3. إعداد رسالة الواتساب ---
    let msg = `🛍️ *طلب جديد من Urban Gent*%0a`;
    msg += `👤 *الزبون:* ${user}%0a`;
    msg += `--------------------------%0a`;

    cart.forEach((item, i) => {
        msg += `${i+1}. *${item.name}*%0a القياس: ${item.size} | اللون: ${item.color}%0a الكمية: ${item.qty}%0a%0a`;
    });

    msg += `💰 *الإجمالي النهائي: ${finalTotal} د.ع*`;
    
    // --- 4. تفريغ السلة وتوجيه المستخدم ---
    localStorage.removeItem('myCart');
    cart = [];
    updateCartIcon();

    // فتح واتساب
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');

    // توجيه الزبون لصفحة ملفه الشخصي لرؤية الطلب في السجل
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}
// --- نظام تسجيل الخروج ---
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    alert("تم تسجيل الخروج");
    window.location.href = 'index.html';
}

// دالة استعادة كلمة المرور
function recoverPassword() {
    const phoneInput = document.getElementById('recover-phone');
    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    let users = JSON.parse(localStorage.getItem('registered_users')) || [];
    
    const user = users.find(u => u.phone === phone);

    if (user) {
        // تنبيه يظهر كلمة السر المخزنة في متصفحه
        alert(`تم العثور على حسابك بنجاح! ✅\nكلمة المرور الخاصة بك هي: ${user.password}`);
        window.location.href = 'login.html';
    } else {
        alert("عذراً، هذا الرقم غير مسجل على هذا الجهاز ❌");
    }
}
function applyCoupon() {
    const codeInput = document.getElementById('coupon-code');
    if (!codeInput) return;

    const code = codeInput.value.trim().toUpperCase();
    const isUsed = localStorage.getItem('coupon_IQ2025_used');

    if (isUsed === 'true') {
        alert("عذراً، لقد استخدمت هذا الكود مسبقاً! ❌");
        return;
    }

    if (code === "IQ2025") {
        localStorage.setItem('discount', 0.10); // خصم 10%
        alert("تهانينا! تم تطبيق خصم 10% بنجاح ✅");
        renderCartPage(); // إعادة بناء الصفحة لتحديث السعر
    } else {
        alert("كود الخصم غير صحيح ❌");
        localStorage.setItem('discount', 0);
        renderCartPage();
    }
}





