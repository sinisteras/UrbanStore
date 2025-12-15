// ==========================================
// ⚙️ إعدادات المتجر
// ==========================================
const MY_PHONE_NUMBER = "9647700000000"; // 🔴 ضع رقمك هنا

// ==========================================
// 📦 1. قاعدة بيانات المنتجات (مع الألوان والقياسات)
// ==========================================
const allProducts = [
    {
        id: 1,
        name: "بدلة رسمية سوداء",
        price: 150000,
        image: "images/suit.jpg",
        description: "بدلة رسمية فاخرة.",
        // إضافة الخيارات (اترك المصفوفة فارغة [] إذا المنتج ما بيه خيارات)
        sizes: ["46", "48", "50", "52", "54"], 
        colors: ["أسود", "كحلي"] 
    },
    {
        id: 2,
        name: "قميص أبيض كلاسيك",
        price: 35000,
        image: "images/shirt.jpg",
        description: "قميص قطني 100%.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [] // لا توجد خيارات ألوان (فقط أبيض)
    },
    {
        id: 3,
        name: "حذاء جلد طبيعي",
        price: 60000,
        image: "images/shoes.jpg",
        description: "حذاء جلد طبيعي مريح.",
        sizes: ["40", "41", "42", "43", "44", "45"],
        colors: ["أسود", "بني"]
    },
    {
        id: 4, // منتج جديد للتجربة
        name: "سويتر شتوي",
        price: 25000,
        image: "images/sweater.jpg", // تأكد من وجود صورة
        description: "سويتر صوف دافئ بألوان متعددة.",
        sizes: ["M", "L", "XL"],
        colors: ["رمادي", "أحمر", "أصفر", "بيج"]
    }
];

// ==========================================
// 🛒 2. نظام السلة الذكي (يدعم الخيارات)
// ==========================================
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
updateCartIcon();

function updateCartIcon() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.reduce((total, item) => total + item.qty, 0);
}

// دالة الإضافة للسلة (المطورة)
function addToCart(productId, selectedSize = null, selectedColor = null) {
    const product = allProducts.find(p => p.id === productId);
    
    // التحقق: هل المنتج يحتاج خيارات والزبون لم يختر؟
    // (هذا يحدث فقط داخل صفحة المنتج)
    if (window.location.pathname.includes('product.html')) {
        const hasSizes = product.sizes && product.sizes.length > 0;
        const hasColors = product.colors && product.colors.length > 0;

        if (hasSizes && !selectedSize) return alert('يرجى اختيار القياس أولاً!');
        if (hasColors && !selectedColor) return alert('يرجى اختيار اللون أولاً!');
    }

    // تجهيز قيم افتراضية إذا تم الإضافة من الصفحة الرئيسية
    const finalSize = selectedSize || (product.sizes && product.sizes.length > 0 ? "غير محدد" : "");
    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? "غير محدد" : "");

    // البحث في السلة: يجب تطابق الآيدي + اللون + القياس
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === finalSize && 
        item.color === finalColor
    );

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            ...product,
            qty: 1,
            size: finalSize,
            color: finalColor
        });
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
                <img src="${p.image}" onerror="this.src='https://via.placeholder.com/300'" onclick="goToProduct(${p.id})" style="cursor:pointer" alt="${p.name}">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} د.ع</p>
                <button onclick="goToProduct(${p.id})">عرض التفاصيل</button>
            </div>
        `).join('');
    }
}
// ملاحظة: غيرت زر الصفحة الرئيسية ليذهب للتفاصيل بدلاً من الإضافة المباشرة لمنع المشاكل

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

        // 🟢 رسم قوائم الاختيار (الجديد)
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; // تنظيف

        // قائمة القياسات
        if (product.sizes && product.sizes.length > 0) {
            optionsContainer.innerHTML += `
                <div style="margin-bottom: 15px;">
                    <label style="font-weight:bold; margin-left:10px;">القياس:</label>
                    <select id="size-select" style="padding: 5px; width: 150px; border-radius:5px; border:1px solid #ccc;">
                        <option value="">اختر القياس...</option>
                        ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        // قائمة الألوان
        if (product.colors && product.colors.length > 0) {
            optionsContainer.innerHTML += `
                <div style="margin-bottom: 15px;">
                    <label style="font-weight:bold; margin-left:10px;">اللون:</label>
                    <select id="color-select" style="padding: 5px; width: 150px; border-radius:5px; border:1px solid #ccc;">
                        <option value="">اختر اللون...</option>
                        ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        // زر الإضافة (يقرأ القيم من القوائم)
        document.getElementById('add-btn').onclick = () => {
            const sizeSelect = document.getElementById('size-select');
            const colorSelect = document.getElementById('color-select');
            
            const selectedSize = sizeSelect ? sizeSelect.value : "";
            const selectedColor = colorSelect ? colorSelect.value : "";

            addToCart(product.id, selectedSize, selectedColor);
        };
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
        // عرض التفاصيل (لون وقياس)
        let details = "";
        if (item.size) details += ` | قياس: ${item.size}`;
        if (item.color) details += ` | لون: ${item.color}`;

        return `
            <tr>
                <td><img src="${item.image}" width="50" style="border-radius:5px;"></td>
                <td>
                    ${item.name}
                    <br><span style="font-size:0.8em; color:gray;">${details}</span>
                </td>
                <td>${item.price.toLocaleString()}</td>
                <td>
                    <div style="display:flex; justify-content:center; gap:5px;">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td><button onclick="removeItem(${index})" style="color:red; border:none; background:none; cursor:pointer;">&times;</button></td>
            </tr>
        `;
    }).join('');

    const discount = localStorage.getItem('discount') || 0;
    totalEl.textContent = (total - (total * discount)).toLocaleString();
}

// دوال مساعدة للسلة
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

function checkoutWhatsApp() {
    if (cart.length === 0) return alert('السلة فارغة!');
    let msg = "مرحباً، أريد إتمام الطلب:%0a";
    let total = 0;
    cart.forEach(item => {
        let details = "";
        if (item.size) details += ` (قياس: ${item.size})`;
        if (item.color) details += ` (لون: ${item.color})`;
        
        msg += `- ${item.name} ${details} - عدد ${item.qty}%0a`;
        total += item.price * item.qty;
    });
    msg += `%0a💰 الإجمالي: ${document.getElementById('final-total').textContent} د.ع`;
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');
}

// 4. تسجيل الدخول (نفس الكود السابق)
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links');
    const userNameDisplay = document.getElementById('user-name-display');

    if (!guestLinks || !userLinks) return;

    if (isLoggedIn === 'true' && userName) {
        guestLinks.style.display = 'none';
        userLinks.style.display = 'flex';
        if(userNameDisplay) userNameDisplay.textContent = userName;
    } else {
        guestLinks.style.display = 'flex';
        userLinks.style.display = 'none';
    }
});
function logoutUser() { localStorage.removeItem('isLoggedIn'); window.location.href = 'index.html'; }
