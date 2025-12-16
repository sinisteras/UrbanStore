// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "urban-gent.firebaseapp.com",
  projectId: "urban-gent",
  storageBucket: "urban-gent.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MY_PHONE_NUMBER = "9647724329890"; 

// 📦 1. قاعدة البيانات
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

// --- 🛒 نظام السلة ---
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function updateCartIcon() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.reduce((total, item) => total + item.qty, 0);
}
updateCartIcon();

// --- 📄 منطق العرض ---
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && user) {
        if(document.getElementById('guest-links')) document.getElementById('guest-links').style.display = 'none';
        if(document.getElementById('user-links')) document.getElementById('user-links').style.display = 'flex';
        const nameDisplay = document.getElementById('user-name-display');
        if (nameDisplay) nameDisplay.textContent = user;
    }

    const grid = document.querySelector('.products-grid');
    if (grid) {
        grid.innerHTML = allProducts.map(p => `
            <div class="product-card">
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} د.ع</p>
                <button onclick="window.location.href='product.html?id=${p.id}'">عرض التفاصيل</button>
            </div>
        `).join('');
    }

    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
});

// --- صفحة تفاصيل المنتج ---
if (window.location.pathname.includes('product.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = allProducts.find(p => p.id === id);

    if (product) {
        const mainImg = document.getElementById('p-img');
        if (mainImg) mainImg.src = product.image;
        document.getElementById('p-name').textContent = product.name;
        document.getElementById('p-price').textContent = product.price.toLocaleString() + ' د.ع';
        document.getElementById('p-desc').textContent = product.description;

        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            let html = `<label>القياس:</label> <select id="size-select" onchange="updateStockStatus(${product.id})"><option value="">اختر..</option>${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select><br><br>`;
            html += `<label>اللون:</label> <select id="color-select" onchange="updateStockStatus(${product.id})"><option value="">اختر..</option>${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select>`;
            html += `<div id="stock-display" style="margin-top:15px; font-weight:bold; color:#e67e22;">يرجى اختيار القياس واللون</div>`;
            optionsContainer.innerHTML = html;
        }

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

// --- الدوال المساعدة ---
function addToCart(productId, s, c) {
    const product = allProducts.find(p => p.id === productId);
    const existing = cart.find(i => i.id === productId && i.size === s && i.color === c);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1, size: s, color: c });
    }
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartIcon();
    alert('تمت الإضافة للسلة! ✅');
}

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
            if(btn) { btn.disabled = false; btn.style.opacity = "1"; }
        } else {
            display.textContent = "للأسف، نفدت هذه التشكيلة ❌";
            display.style.color = "#c0392b";
            if(btn) { btn.disabled = true; btn.style.opacity = "0.5"; }
        }
    }
}

async function checkoutWhatsApp() {
    const user = localStorage.getItem('userName');
    if (!user) return alert("يرجى تسجيل الدخول أولاً 🔐");
    if (cart.length === 0) return alert('السلة فارغة!');
    const finalTotal = document.getElementById('final-total').textContent;

    const orderData = {
        customerName: user,
        date: new Date().toLocaleString('ar-EG'),
        items: cart.map(item => `${item.name} (${item.size}/${item.color}) عدد: ${item.qty}`),
        total: finalTotal,
        status: "قيد المراجعة"
    };

    try {
        await addDoc(collection(db, "orders"), orderData);
        let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
        history.push(orderData);
        localStorage.setItem('orderHistory', JSON.stringify(history));
    } catch (e) { console.error(e); }

    let msg = `🛍️ *طلب جديد من Urban Gent*%0a👤 *الزبون:* ${user}%0a💰 *الإجمالي: ${finalTotal} د.ع*`;
    localStorage.removeItem('myCart');
    cart = [];
    updateCartIcon();
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');
    setTimeout(() => { window.location.href = 'profile.html'; }, 1500);
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
    if (cart[index].qty + delta > 0) {
        cart[index].qty += delta;
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCartPage();
        updateCartIcon();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCartPage();
    updateCartIcon();
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
        localStorage.setItem('discount', 0.10);
        localStorage.setItem('coupon_IQ2025_used', 'true');
        alert("تهانينا! تم تطبيق خصم 10% بنجاح ✅");
        renderCartPage();
    } else {
        alert("كود الخصم غير صحيح ❌");
        localStorage.setItem('discount', 0);
        renderCartPage();
    }
}

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// ربط الدوال بالـ window لضمان عملها مع HTML
window.removeItem = removeItem;
window.changeQty = changeQty;
window.applyCoupon = applyCoupon;
window.checkoutWhatsApp = checkoutWhatsApp;
window.logoutUser = logoutUser;
window.updateStockStatus = updateStockStatus;
