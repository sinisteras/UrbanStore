// 1. تعريف متغير لحفظ عدد المنتجات في السلة
let cartCount = 0;

// 2. الحصول على عنصر العداد من صفحة HTML
const cartCountElement = document.getElementById('cart-count');

// 3. الحصول على جميع أزرار "أضف للسلة"
// querySelectorAll تختار كل العناصر التي تطابق مُحدد CSS
const addButtons = document.querySelectorAll('.product-card button');

// 4. دالة (Function) لتحديث العداد
function updateCartCount() {
    // تحديث المحتوى النصي لعنصر العداد بالقيمة الجديدة
    cartCountElement.textContent = cartCount;
}

// 5. ربط حدث النقر بكل زر من الأزرار
// نستخدم حلقة (loop) للمرور على كل الأزرار المجمعة
addButtons.forEach(button => {
    // إضافة مستمع للحدث (Event Listener) لكل زر
    button.addEventListener('click', () => {
        // زيادة عدد المنتجات
        cartCount++; 
        
        // تحديث عرض العداد على الشاشة
        updateCartCount();
        
        // رسالة إرشادية للمستخدم (يمكنك إزالتها لاحقاً)
        alert('تم إضافة المنتج إلى السلة! العدد الإجمالي: ' + cartCount);
    });
});