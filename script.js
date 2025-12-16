// ==========================================
// ⚙️ إعدادات المتجر
// ==========================================
const MY_PHONE_NUMBER = "9647724329890"; // ✅ رقمك محفوظ

// ==========================================
// 📦 1. قاعدة البيانات (مع دعم الصور المتعددة)
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
        gallery: ["images/suit.jpg", "images/suit_back.jpg", "images/suit_fabric.jpg"]
    },
    {
        id: 2,
        name: "قميص أبيض كلاسيك",
        price: 35000,
        image: "images/shirt.jpg",
        description: "قميص قطني 100%.",
        sizes: ["M", "L", "XL"],
        colors: [],
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
        gallery: ["images/sweater.jpg", "images/sweater_red.jpg", "images/sweater_yellow.jpg"]
    },
  {
        id: 5,
        name: "بنطلون رسمي",
        price: 20000,
        image: "images/pant.jpg",
        description: "بنطلون قماش رسمي فاخر.",
        // 🆕 نظام المخزون حسب القياس واللون
        inventory: [
            { size: "30", color: "اسود", stock: 4 },
            { size: "32", color: "اسود", stock: 2 },
            { size: "34", color: "اسود", stock: 0 } // نفد من المخزون
        ],
        // سنبقي هذه للمساعدة في بناء القوائم المنسدلة
        sizes: ["30", "32", "34"],
        colors: ["اسود"],
        gallery: ["images/pant.jpg"]
    }
];

// ==========================================
// 🛒 2. نظام السلة (كما هو)
// ==========================================
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
updateCartIcon();

function updateCartIcon() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.reduce((total, item) => total + item.qty, 0);
}

function addToCart(productId, selectedSize = null, selectedColor = null) {
    const product = allProducts.find(p => p.id === productId);
    
    if (window.location.pathname.includes('product.html')) {
        const hasSizes = product.sizes && product.sizes.length > 0;
        const hasColors = product.colors && product.colors.length > 0;
        if (hasSizes && !selectedSize) return alert('يرجى اختيار القياس أولاً!');
        if (hasColors && !selectedColor) return alert('يرجى اختيار اللون أولاً!');
    }

    const finalSize = selectedSize || (product.sizes && product.sizes.length > 0 ? "غير محدد" : "");
    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? "غير محدد" : "");

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

// --- صفحة تفاصيل المنتج (المحدثة للصور) ---
if (window.location.pathname.includes('product.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = allProducts.find(p => p.id === id);

    if (product) {
        // تعيين الصورة الرئيسية الأولية
    // 1. عرض البيانات الأساسية
        const mainImg = document.getElementById('p-img');
        mainImg.src = product.image;
        document.getElementById('p-name').textContent = product.name;
        document.getElementById('p-price').textContent = product.price.toLocaleString() + ' د.ع';
        document.getElementById('p-desc').textContent = product.description;

        // 2. كود المعرض (Gallery Logic) - كما هو
        const thumbsContainer = document.getElementById('thumbnails-container');
        thumbsContainer.innerHTML = ''; 
        if (product.gallery && product.gallery.length > 0) {
            product.gallery.forEach(imgSrc => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.className = "thumb-img"; // يمكنك إضافة ستايل لها في CSS
                thumb.style.width = "60px";
                thumb.style.height = "60px";
                thumb.style.objectFit = "cover";
                thumb.style.border = "2px solid #ddd";
                thumb.style.borderRadius = "5px";
                thumb.style.cursor = "pointer";
                thumb.onclick = function() {
                    mainImg.src = imgSrc;
                    document.querySelectorAll('#thumbnails-container img').forEach(img => img.style.borderColor = '#ddd');
                    thumb.style.borderColor = '#1abc9c';
                };
                thumbsContainer.appendChild(thumb);
            });
        }

        // 3. كود بناء القوائم المنسدلة (القياس واللون)
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; 

        if (product.sizes && product.sizes.length > 0) {
            optionsContainer.innerHTML += `
                <div style="margin-bottom: 10px;">
                    <label>القياس:</label>
                    <select id="size-select" style="padding:5px; border-radius:5px;">
                        <option value="">اختر..</option>
                        ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>`;
        }

        if (product.colors && product.colors.length > 0) {
            optionsContainer.innerHTML += `
                <div style="margin-bottom: 10px;">
                    <label>اللون:</label>
                    <select id="color-select" style="padding:5px; border-radius:5px;">
                        <option value="">اختر..</option>
                        ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>`;
        }

        // 4. 🆕 إضافة مكان عرض المخزون (هنا الإضافة الجديدة)
        optionsContainer.innerHTML += `
            <div id="stock-display" style="margin-top: 15px; font-weight: bold; color: #e67e22;">
                يرجى اختيار الخيارات المتاحة
            </div>
        `;

        // 5. 🆕 دالة فحص المخزون وتحديث الزر
        window.updateStockStatus = function() {
            const s = document.getElementById('size-select')?.value;
            const c = document.getElementById('color-select')?.value;
            const display = document.getElementById('stock-display');
            const btn = document.getElementById('add-btn');

            if (product.inventory) {
                const variant = product.inventory.find(v => v.size === s && v.color === c);
                if (variant) {
                    if (variant.stock > 0) {
                        display.textContent = `متوفر: ${variant.stock} قطعة`;
                        display.style.color = "#27ae60";
                        btn.disabled = false;
                        btn.style.opacity = "1";
                    } else {
                        display.textContent = `للأسف، هذا الخيار نفد ❌`;
                        display.style.color = "#c0392b";
                        btn.disabled = true;
                        btn.style.opacity = "0.5";
                    }
                } else if (s && c) {
                    display.textContent = "هذا التشكيل غير متوفر حالياً";
                    display.style.color = "#c0392b";
                    btn.disabled = true;
                }
            }
        };

        // ربط القوائم بالدالة عند التغيير
        document.body.addEventListener('change', (e) => {
            if (e.target.id === 'size-select' || e.target.id === 'color-select') {
                updateStockStatus();
            }
        });

                thumbsContainer.appendChild(thumb);
            });
        }

        // --- باقي الكود (الخيارات والأزرار) ---
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; 

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

        document.getElementById('add-btn').onclick = () => {
            const sizeSelect = document.getElementById('size-select');
            const colorSelect = document.getElementById('color-select');
            const selectedSize = sizeSelect ? sizeSelect.value : "";
            const selectedColor = colorSelect ? colorSelect.value : "";
            addToCart(product.id, selectedSize, selectedColor);
        };
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
        container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">السلة فارغة 🛒</td></tr>';
        totalEl.textContent = '0';
        return;
    }
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        let details = "";
        if (item.size) details += ` | قياس: ${item.size}`;
        if (item.color) details += ` | لون: ${item.color}`;
        return `
            <tr>
                <td><img src="${item.image}" width="50" style="border-radius:5px;"></td>
                <td>${item.name}<br><span style="font-size:0.8em; color:gray;">${details}</span></td>
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

    // 🆕 الخطوة 1: خصم الكمية من المخزون (محلياً في المتصفح)
    cart.forEach(item => {
        // ابحث عن المنتج في قاعدة البيانات الأصلية
        const productInDb = allProducts.find(p => p.id === item.id);
        
        if (productInDb && productInDb.inventory) {
            // ابحث عن القياس واللون المختار داخل المخزون
            const variant = productInDb.inventory.find(v => v.size === item.size && v.color === item.color);
            
            if (variant) {
                // نقص الكمية المحجوزة من المخزون المتوفر
                variant.stock -= item.qty; 
                if (variant.stock < 0) variant.stock = 0; // حماية حتى لا ينزل تحت الصفر
            }
        }
    });

    // 📝 الخطوة 2: بناء رسالة الواتساب (نفس ترتيبك السابق مع تحسينات)
    let msg = "مرحباً Urban Gent، أريد إتمام الطلب التالي:%0a%0a";
    let total = 0;

    cart.forEach((item, index) => {
        msg += `*${index + 1}. ${item.name}*%0a`;
        if (item.size && item.size !== "غير محدد") msg += `   - القياس: ${item.size}%0a`;
        if (item.color && item.color !== "غير محدد") msg += `   - اللون: ${item.color}%0a`;
        msg += `   - الكمية: ${item.qty}%0a`;
        msg += `   - السعر: ${(item.price * item.qty).toLocaleString()} د.ع%0a%0a`;
        total += item.price * item.qty;
    });

    // إضافة الإجمالي النهائي للرسالة
    const finalTotal = document.getElementById('final-total')?.textContent || total.toLocaleString();
    msg += `💰 *الإجمالي النهائي: ${finalTotal} د.ع*`;

    // فتح واتساب
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');
    
    // اختياري: تفريغ السلة بعد الطلب
    // cart = [];
    // localStorage.setItem('myCart', JSON.stringify(cart));
    // updateCartIcon();
}

    const finalPrice = document.getElementById('final-total').textContent;
    msg += `--------------------------%0a`;
    msg += `💰 *الإجمالي النهائي: ${finalPrice} د.ع*`;

    // فتح واتساب
    window.open(`https://wa.me/${MY_PHONE_NUMBER}?text=${msg}`, '_blank');
}

// تسجيل الدخول
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
// دالة تطبيق كود الخصم
function applyCoupon() {
    const code = document.getElementById('coupon-code').value.trim();
    const totalEl = document.getElementById('final-total');
    
    // حساب الإجمالي الحالي قبل الخصم
    let currentTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (code === "IQ2025") {
        const discountPercent = 0.10; // خصم 10%
        const discountAmount = currentTotal * discountPercent;
        const newTotal = currentTotal - discountAmount;
        
        // حفظ الخصم في الـ localStorage لاستخدامه عند الإرسال للواتساب
        localStorage.setItem('discount', discountPercent);
        
        // تحديث الرقم في الصفحة
        totalEl.textContent = newTotal.toLocaleString();
        
        alert("تهانينا! تم تطبيق خصم 10% ✅");
    } else if (code === "") {
        alert("يرجى إدخال كود الخصم أولاً");
    } else {
        alert("عذراً، هذا الكود غير صالح ❌");
        localStorage.setItem('discount', 0);
        renderCartPage(); // إعادة السعر للأصل
    }
}




