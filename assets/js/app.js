let products = JSON.parse(localStorage.getItem('yassin_products_v2')) || [];
let cart = JSON.parse(localStorage.getItem('yassin_cart_v2')) || [];
let wishlist = JSON.parse(localStorage.getItem('yassin_wishlist_v2')) || [];
let orderHistory = JSON.parse(localStorage.getItem('yassin_orders_v2')) || [];

let currentCategory = "الكل";
let searchQuery = "";
let sortOption = "default";
let onlyDiscounts = false;
let appliedDiscountPercent = 0;
let selectedQuickViewVariant = "";

function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

// الوضع الليلي والنهاري
const savedTheme = localStorage.getItem('yassin_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
const themeIcon = document.querySelector('#themeToggleBtn i');
if (themeIcon) themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('yassin_theme', next);
    if (themeIcon) themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// عرض المنتجات
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = products.filter(p => {
        const matchCat = currentCategory === "الكل" || p.category === currentCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDiscount = !onlyDiscounts || (p.oldPrice && p.oldPrice > p.price);
        return matchCat && matchSearch && matchDiscount;
    });

    if (sortOption === "low-high") filtered.sort((a, b) => a.price - b.price);
    else if (sortOption === "high-low") filtered.sort((a, b) => b.price - a.price);
    else if (sortOption === "discount") {
        filtered.sort((a, b) => {
            const dA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
            const dB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
            return dB - dA;
        });
    }

    const countLabel = document.getElementById('productsCountLabel');
    if (countLabel) countLabel.textContent = `${filtered.length} منتج`;
    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:50px 20px; color:var(--text-muted);"><h3>لا توجد منتجات مطابقة</h3></div>`;
        return;
    }

    filtered.forEach(prod => {
        const isFav = wishlist.includes(prod.id);
        const isOut = prod.outOfStock === true;
        const discountPct = prod.oldPrice && prod.oldPrice > prod.price ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100) : 0;
        const badgeHTML = isOut ? `<span class="badge-tag out">نفذت الكمية</span>` : (discountPct > 0 ? `<span class="badge-tag sale">خصم ${discountPct}%</span>` : '');
        const variantsHTML = prod.variants?.length ? `<div class="card-variants-preview">${prod.variants.map(v => `<span class="mini-variant-chip">${sanitizeHTML(v)}</span>`).join('')}</div>` : '';
        const defaultVar = prod.variants?.[0] || "";

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHTML}
            <div class="card-floating-actions">
                <button class="circle-action-btn ${isFav ? 'fav-active' : ''}" onclick="toggleWishlist(${prod.id})"><i class="${isFav ? 'fas' : 'far'} fa-heart"></i></button>
                <button class="circle-action-btn share-btn" onclick="shareProduct(${prod.id})"><i class="fas fa-share-alt"></i></button>
            </div>
            <div class="card-img-wrap" style="${isOut ? 'opacity:0.65;' : ''}">
                <img src="${sanitizeHTML(prod.img)}" alt="${sanitizeHTML(prod.name)}" loading="lazy">
                <button class="quick-view-bar" onclick="openQuickView(${prod.id})"><i class="fas fa-eye"></i> معاينة سريعة</button>
            </div>
            <div class="card-body">
                <div>
                    <span class="card-cat">${sanitizeHTML(prod.category)}</span>
                    <h3 class="card-title">${sanitizeHTML(prod.name)}</h3>
                    ${variantsHTML}
                </div>
                <div>
                    <div class="card-price-row">
                        <span class="price-now">${prod.price.toLocaleString()} د.ع</span>
                        ${prod.oldPrice && prod.oldPrice > prod.price ? `<span class="price-was">${prod.oldPrice.toLocaleString()} د.ع</span>` : ''}
                    </div>
                    <button class="card-add-btn" onclick="addToCart(${prod.id}, '${sanitizeHTML(defaultVar)}', this)" ${isOut ? 'disabled' : ''}>
                        ${isOut ? 'غير متوفر حالياً' : '<i class="fas fa-cart-plus"></i> أضف إلى السلة'}
                    </button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

window.filterByCategory = function(cat) {
    currentCategory = cat;
    document.querySelectorAll('#mainNav a').forEach(a => a.classList.toggle('active', a.dataset.cat === cat));
    const titleEl = document.getElementById('currentCategoryTitle');
    if (titleEl) titleEl.textContent = cat === "الكل" ? "أحدث المنتجات المميزة" : `قسم: ${cat}`;
    document.getElementById('mainNav')?.classList.remove('open');
    renderProducts();
};

window.resetStoreFilters = function() {
    currentCategory = "الكل";
    searchQuery = "";
    onlyDiscounts = false;
    const sIn = document.getElementById('liveSearchInput');
    if (sIn) sIn.value = "";
    filterByCategory("الكل");
};

// البحث الفوري
document.getElementById('liveSearchInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    document.getElementById('clearSearchBtn')?.classList.toggle('hidden', !searchQuery);
    renderProducts();
});

document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
    document.getElementById('liveSearchInput').value = "";
    searchQuery = "";
    document.getElementById('clearSearchBtn').classList.add('hidden');
    renderProducts();
});

// السلة
window.addToCart = function(prodId, variant = "", btn = null) {
    const product = products.find(p => p.id === prodId);
    if (!product || product.outOfStock) return;
    const chosenVar = variant || product.variants?.[0] || "";
    const cartKey = `${prodId}_${chosenVar}`;
    const existing = cart.find(i => i.cartKey === cartKey);
    if (existing) existing.quantity++;
    else cart.push({ cartKey, id: product.id, name: product.name, price: product.price, img: product.img, variant: chosenVar, quantity: 1 });
    localStorage.setItem('yassin_cart_v2', JSON.stringify(cart));
    updateCartUI();
    showToast(`تمت إضافة "${product.name}" للسلة`);
};

window.changeCartQty = function(key, delta) {
    const item = cart.find(i => i.cartKey === key);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.cartKey !== key);
    localStorage.setItem('yassin_cart_v2', JSON.stringify(cart));
    updateCartUI();
};

window.removeCartItem = function(key) {
    cart = cart.filter(i => i.cartKey !== key);
    localStorage.setItem('yassin_cart_v2', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = totalItems;

    const container = document.getElementById('cartItemsContainer');
    if (!container) return;
    container.innerHTML = '';
    let subTotal = 0;

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px 10px; color:var(--text-muted);">السلة فارغة حالياً</div>`;
    } else {
        cart.forEach(item => {
            subTotal += item.price * item.quantity;
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border-color);">
                    <img src="${sanitizeHTML(item.img)}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;">
                    <div style="flex:1;">
                        <h4 style="font-size:13.5px;">${sanitizeHTML(item.name)}</h4>
                        ${item.variant ? `<span style="font-size:11px; color:var(--text-muted); display:block;">${sanitizeHTML(item.variant)}</span>` : ''}
                        <span style="font-size:12.5px; color:var(--accent); font-weight:800;">${item.price.toLocaleString()} د.ع</span>
                        <div style="margin-top:4px;">
                            <button onclick="changeCartQty('${item.cartKey}', -1)" style="padding:1px 7px; cursor:pointer;">-</button>
                            <strong style="margin:0 6px;">${item.quantity}</strong>
                            <button onclick="changeCartQty('${item.cartKey}', 1)" style="padding:1px 7px; cursor:pointer;">+</button>
                        </div>
                    </div>
                    <button onclick="removeCartItem('${item.cartKey}')" style="background:none; border:none; color:var(--danger); cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>`;
        });
    }

    const threshold = STORE_CONFIG.freeShippingThreshold;
    const pct = Math.min(100, (subTotal / threshold) * 100);
    const bar = document.getElementById('freeShippingBar');
    if (bar) bar.style.width = `${pct}%`;
    const shipTxt = document.getElementById('freeShippingText');
    if (shipTxt) shipTxt.innerHTML = subTotal >= threshold ? `🎉 حصلت على <strong>توصيل مجاني</strong>!` : `باقي <strong>${(threshold - subTotal).toLocaleString()} د.ع</strong> للتوصيل المجاني!`;

    const citySel = document.getElementById('custCity');
    const opt = citySel?.options[citySel.selectedIndex];
    let fee = opt?.dataset.fee ? parseInt(opt.dataset.fee, 10) : 0;
    if (subTotal >= threshold && subTotal > 0) {
        fee = 0;
        document.getElementById('deliveryFeeText').textContent = "مجاني 🎉";
    } else if (opt?.value) {
        document.getElementById('deliveryFeeText').textContent = `${fee.toLocaleString()} د.ع`;
    }

    const disc = Math.round((subTotal * appliedDiscountPercent) / 100);
    document.getElementById('discountRow')?.classList.toggle('hidden', disc <= 0);
    if (disc > 0) document.getElementById('discountAmount').textContent = `-${disc.toLocaleString()} د.ع`;

    const finalTotal = Math.max(0, subTotal - disc + (subTotal > 0 ? fee : 0));
    document.getElementById('subTotalPrice').textContent = `${subTotal.toLocaleString()} د.ع`;
    document.getElementById('finalTotalPrice').textContent = `${finalTotal.toLocaleString()} د.ع`;
    document.getElementById('headerMiniTotal').textContent = `${subTotal.toLocaleString()} د.ع`;
}

document.getElementById('custCity')?.addEventListener('change', updateCartUI);

document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
    if (document.getElementById('couponInput').value.trim().toUpperCase() === "YASSIN10") {
        appliedDiscountPercent = 10;
        showToast("تم تطبيق خصم 10%");
        updateCartUI();
    } else showToast("كود الخصم غير صحيح");
});

document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) return showToast("السلة فارغة!");
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const city = document.getElementById('custCity').value;
    const address = document.getElementById('custAddress').value.trim();
    if (!isValidIraqiPhone(phone)) return alert("يرجى إدخال رقم هاتف عراقي صحيح (07XXXXXXXXX)");

    const orderId = "YAS-" + Math.floor(1000 + Math.random() * 9000);
    const totalStr = document.getElementById('finalTotalPrice').textContent;
    orderHistory.unshift({ orderId, date: new Date().toLocaleDateString('ar-IQ'), total: totalStr, city, itemsCount: cart.reduce((s, i) => s + i.quantity, 0) });
    localStorage.setItem('yassin_orders_v2', JSON.stringify(orderHistory));

    let msg = `*فاتورة طلب #${orderId} - مكتبة ياسين المولى* 📚\nالاسم: ${name}\nالهاتف: ${phone}\nالمحافظة: ${city}\nالعنوان: ${address}\n----------------\n`;
    cart.forEach(i => msg += `• ${i.name} ${i.variant ? `[${i.variant}]` : ''} × ${i.quantity}\n`);
    msg += `----------------\nالمجموع النهائي: ${totalStr}`;
    window.open(`https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
});

// النوافذ والمفضلة ولوحة الإدارة
window.openQuickView = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalCategory').textContent = p.category;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalPrice').textContent = `${p.price.toLocaleString()} د.ع`;
    document.getElementById('modalDesc').textContent = p.desc;
    const pills = document.getElementById('modalVariantPills');
    pills.innerHTML = '';
    if (p.variants?.length) {
        document.getElementById('modalVariantsBox').classList.remove('hidden');
        selectedQuickViewVariant = p.variants[0];
        p.variants.forEach((v, idx) => {
            const b = document.createElement('button');
            b.className = `variant-pill-btn ${idx === 0 ? 'selected' : ''}`;
            b.textContent = v;
            b.onclick = () => {
                document.querySelectorAll('.variant-pill-btn').forEach(x => x.classList.remove('selected'));
                b.classList.add('selected');
                selectedQuickViewVariant = v;
            };
            pills.appendChild(b);
        });
    } else document.getElementById('modalVariantsBox').classList.add('hidden');

    document.getElementById('modalAddToCartBtn').onclick = () => {
        addToCart(p.id, selectedQuickViewVariant);
        document.getElementById('quickViewModal').classList.remove('active');
    };
    document.getElementById('quickViewModal').classList.add('active');
};

window.toggleWishlist = function(id) {
    wishlist = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    localStorage.setItem('yassin_wishlist_v2', JSON.stringify(wishlist));
    document.getElementById('wishlistCount').textContent = wishlist.length;
    renderProducts();
};

window.shareProduct = function(id) {
    const p = products.find(x => x.id === id);
    if (p) navigator.clipboard.writeText(`${p.name} - ${p.price.toLocaleString()} د.ع\n${window.location.href}`).then(() => showToast("تم نسخ رابط المنتج"));
};

// أزرار فتح وإغلاق القوائم والنوافذ
document.getElementById('cartToggleBtn')?.addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
});
document.getElementById('closeCartBtn')?.addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
});
document.getElementById('cartOverlay')?.addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
});
document.getElementById('wishlistToggleBtn')?.addEventListener('click', () => {
    const box = document.getElementById('wishlistItemsContainer');
    box.innerHTML = wishlist.length ? wishlist.map(id => {
        const p = products.find(x => x.id === id);
        return p ? `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);"><span>${sanitizeHTML(p.name)}</span><button onclick="addToCart(${p.id})" class="btn-primary-lg" style="padding:4px 10px; font-size:12px;">للسلة</button></div>` : '';
    }).join('') : '<p style="text-align:center; padding:20px;">المفضلة فارغة</p>';
    document.getElementById('wishlistModal').classList.add('active');
});
document.getElementById('closeWishlistModal')?.addEventListener('click', () => document.getElementById('wishlistModal').classList.remove('active'));
document.getElementById('ordersHistoryBtn')?.addEventListener('click', () => {
    const box = document.getElementById('ordersHistoryContainer');
    box.innerHTML = orderHistory.length ? orderHistory.map(o => `<div style="padding:10px; border-bottom:1px solid var(--border-color);"><strong>#${o.orderId}</strong> - ${o.total} (${o.date})</div>`).join('') : '<p style="text-align:center; padding:20px;">لا توجد طلبات سابقة</p>';
    document.getElementById('ordersModal').classList.add('active');
});
document.getElementById('closeOrdersModal')?.addEventListener('click', () => document.getElementById('ordersModal').classList.remove('active'));
document.getElementById('closeQuickView')?.addEventListener('click', () => document.getElementById('quickViewModal').classList.remove('active'));
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => document.getElementById('mainNav').classList.toggle('open'));
document.getElementById('shopNowBtn')?.addEventListener('click', () => document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' }));

document.querySelectorAll('#mainNav a').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); filterByCategory(a.dataset.cat); }));
document.getElementById('sortProducts')?.addEventListener('change', (e) => { sortOption = e.target.value; renderProducts(); });
document.getElementById('onlyDiscountCheckbox')?.addEventListener('change', (e) => { onlyDiscounts = e.target.checked; renderProducts(); });

// بوابة الإدارة
document.getElementById('secretAdminTrigger')?.addEventListener('click', () => document.getElementById('adminModal').classList.add('active'));
document.getElementById('closeAdminModal')?.addEventListener('click', () => document.getElementById('adminModal').classList.remove('active'));

document.getElementById('adminLoginSubmit')?.addEventListener('click', async () => {
    const pass = document.getElementById('adminPasswordInput').value;
    const hash = await sha256(pass);
    if (hash === STORE_CONFIG.adminHash) {
        document.getElementById('adminLoginSection').classList.add('hidden');
        document.getElementById('adminDashboardSection').classList.remove('hidden');
        renderAdminList();
    } else {
        document.getElementById('adminErrorMsg').textContent = "كلمة المرور غير صحيحة!";
    }
});

document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    document.getElementById('adminDashboardSection').classList.add('hidden');
    document.getElementById('adminLoginSection').classList.remove('hidden');
    document.getElementById('adminModal').classList.remove('active');
});

function renderAdminList() {
    const list = document.getElementById('adminProductsList');
    list.innerHTML = products.map(p => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color); font-size:13px;">
            <span>${sanitizeHTML(p.name)} (${p.price.toLocaleString()} د.ع)</span>
            <button onclick="adminDelete(${p.id})" style="background:#ef4444; color:#fff; border:none; padding:3px 8px; border-radius:5px; cursor:pointer;">حذف</button>
        </div>`).join('');
}

window.adminDelete = function(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('yassin_products_v2', JSON.stringify(products));
    renderProducts();
    renderAdminList();
};

document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const vars = document.getElementById('newProdVariants').value.split(',').map(v => v.trim()).filter(Boolean);
    products.unshift({
        id: Date.now(),
        name: document.getElementById('newProdName').value.trim(),
        category: document.getElementById('newProdCat').value,
        price: parseInt(document.getElementById('newProdPrice').value, 10),
        oldPrice: document.getElementById('newProdOldPrice').value ? parseInt(document.getElementById('newProdOldPrice').value, 10) : null,
        img: document.getElementById('newProdImg').value.trim(),
        variants: vars,
        outOfStock: false,
        desc: document.getElementById('newProdDesc').value.trim()
    });
    localStorage.setItem('yassin_products_v2', JSON.stringify(products));
    e.target.reset();
    renderProducts();
    renderAdminList();
    showToast("تمت إضافة المنتج!");
});

document.getElementById('exportProductsBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(products, null, 4)).then(() => alert("تم نسخ كود JSON للمنتجات! الصقه في data/products.json"));
});

// تحميل المنتجات من JSON
async function initStore() {
    try {
        const res = await fetch('data/products.json?v=' + Date.now());
        if (res.ok && !localStorage.getItem('yassin_products_v2')) {
            products = await res.json();
        }
    } catch (e) {}
    document.getElementById('wishlistCount').textContent = wishlist.length;
    renderProducts();
    updateCartUI();
}
initStore();

// ميزة رفع وضغط الصور مباشرة من الجهاز داخل لوحة الإدارة
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'prodImgFile') {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const maxWidth = 450;
                const scale = img.width > maxWidth ? (maxWidth / img.width) : 1;
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                const urlInput = document.querySelector('#adminDashboardSection input[placeholder*="صورة"], #prodImg');
                if (urlInput) {
                    urlInput.value = compressedBase64;
                    alert('✅ تم ضغط الصورة وتجهيزها بنجاح! اضغط الآن على زر إضافة المنتج.');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// === تحديثات حساب الزبون + شريط السلة السفلي + صور متعددة ===
(function initEnterpriseUpgrades() {
    // 1. إدارة حساب الزبون
    const accBtn = document.getElementById('customerAccountBtn');
    const accModal = document.getElementById('customerModal');
    const closeAcc = document.getElementById('closeCustomerModal');
    const accForm = document.getElementById('customerAuthForm');
    const logoutBtn = document.getElementById('logoutCustomerBtn');
    const navName = document.getElementById('customerNavName');

    function loadCustomerProfile() {
        const saved = JSON.parse(localStorage.getItem('yassin_customer') || 'null');
        if (saved && saved.name) {
            if (navName) navName.textContent = 'أهلاً، ' + saved.name.split(' ')[0];
            if (document.getElementById('custNameInput')) document.getElementById('custNameInput').value = saved.name;
            if (document.getElementById('custPhoneInput')) document.getElementById('custPhoneInput').value = saved.phone || '';
            if (document.getElementById('custGovInput')) document.getElementById('custGovInput').value = saved.gov || 'بغداد';
            if (document.getElementById('custAddressInput')) document.getElementById('custAddressInput').value = saved.address || '';
            logoutBtn?.classList.remove('hidden');

            // تعبئة حقول السلة تلقائياً
            const cartName = document.getElementById('custName');
            const cartPhone = document.getElementById('custPhone');
            const cartGov = document.getElementById('custGov');
            const cartAddr = document.getElementById('custAddress');
            if (cartName && !cartName.value) cartName.value = saved.name;
            if (cartPhone && !cartPhone.value) cartPhone.value = saved.phone || '';
            if (cartGov && saved.gov) cartGov.value = saved.gov;
            if (cartAddr && !cartAddr.value) cartAddr.value = saved.address || '';
        } else {
            if (navName) navName.textContent = 'دخول / حساب';
            logoutBtn?.classList.add('hidden');
        }
    }

    accBtn?.addEventListener('click', () => { loadCustomerProfile(); accModal?.classList.add('active'); });
    closeAcc?.addEventListener('click', () => accModal?.classList.remove('active'));
    accForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const profile = {
            name: document.getElementById('custNameInput').value.trim(),
            phone: document.getElementById('custPhoneInput').value.trim(),
            gov: document.getElementById('custGovInput').value,
            address: document.getElementById('custAddressInput').value.trim()
        };
        localStorage.setItem('yassin_customer', JSON.stringify(profile));
        loadCustomerProfile();
        accModal?.classList.remove('active');
        alert('✅ تم حفظ حسابك بنجاح! سيتم تعبئة بياناتك تلقائياً عند كل طلب.');
    });
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('yassin_customer');
        accForm?.reset();
        loadCustomerProfile();
        accModal?.classList.remove('active');
    });

    // 2. شريط السلة العائم أسفل الشاشة
    const stickyBar = document.getElementById('stickyCartBar');
    const stickyCount = document.getElementById('stickyCartCount');
    const stickyTotal = document.getElementById('stickyCartTotal');
    const openStickyBtn = document.getElementById('openStickyCartBtn');

    openStickyBtn?.addEventListener('click', () => {
        document.getElementById('cartBtn')?.click();
        loadCustomerProfile();
    });

    setInterval(() => {
        const badge = document.getElementById('cartCount');
        const totalEl = document.getElementById('cartTotal');
        const count = badge ? parseInt(badge.textContent || '0', 10) : 0;
        if (stickyBar) {
            if (count > 0) {
                stickyBar.classList.remove('hidden');
                if (stickyCount) stickyCount.textContent = count;
                if (stickyTotal && totalEl) stickyTotal.textContent = totalEl.textContent;
            } else {
                stickyBar.classList.add('hidden');
            }
        }
    }, 500);

    // 3. دعم رفع وضغط أكثر من صورة للمنتج الواحد
    document.addEventListener('change', async function(e) {
        if (e.target && e.target.id === 'prodImgFile') {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;
            const compressedList = [];
            for (const file of files) {
                const b64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const maxW = 420;
                            const scale = img.width > maxW ? (maxW / img.width) : 1;
                            canvas.width = img.width * scale;
                            canvas.height = img.height * scale;
                            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                            resolve(canvas.toDataURL('image/jpeg', 0.72));
                        };
                        img.src = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                });
                compressedList.push(b64);
            }
            const urlInput = document.querySelector('#adminDashboardSection input[placeholder*="صورة"], #prodImg');
            if (urlInput) {
                urlInput.value = compressedList.join(' | ');
                alert('✅ تم ضغط وتجهيز ' + compressedList.length + ' صورة بنجاح!');
            }
        }
    });

    loadCustomerProfile();
})();

// === ENTERPRISE_JS_START ===
window.addEventListener('DOMContentLoaded', function() {
    // 1. تفعيل حساب الزبون وتعبئة السلة تلقائياً
    const openBtn = document.getElementById('floatingCustBtn');
    const overlay = document.getElementById('custAuthOverlay');
    const closeBtn = document.getElementById('closeCustAuthBtn');
    const form = document.getElementById('custProfileForm');
    const logoutBtn = document.getElementById('cLogoutBtn');
    const nameLabel = document.getElementById('floatingCustName');

    function syncCustomer() {
        const data = JSON.parse(localStorage.getItem('yassin_user_profile') || 'null');
        if (data && data.name) {
            nameLabel.textContent = 'أهلاً، ' + data.name.split(' ')[0];
            document.getElementById('cName').value = data.name;
            document.getElementById('cPhone').value = data.phone || '';
            document.getElementById('cGov').value = data.gov || 'بغداد';
            document.getElementById('cAddr').value = data.addr || '';
            logoutBtn.style.display = 'block';

            // ملء بيانات السلة تلقائياً
            document.querySelectorAll('input').forEach(inp => {
                const ph = (inp.placeholder || '').toLowerCase();
                if ((ph.includes('الاسم') || inp.id.toLowerCase().includes('name')) && !inp.value && inp.id !== 'cName') inp.value = data.name;
                if ((ph.includes('هاتف') || ph.includes('رقم') || inp.id.toLowerCase().includes('phone')) && !inp.value && inp.id !== 'cPhone') inp.value = data.phone;
                if ((ph.includes('عنوان') || ph.includes('منطقة') || inp.id.toLowerCase().includes('address')) && !inp.value && inp.id !== 'cAddr') inp.value = data.addr;
            });
        } else {
            nameLabel.textContent = 'دخول / حساب';
            logoutBtn.style.display = 'none';
        }
    }

    openBtn?.addEventListener('click', () => { syncCustomer(); overlay.style.display = 'flex'; });
    closeBtn?.addEventListener('click', () => { overlay.style.display = 'none'; });
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const profile = {
            name: document.getElementById('cName').value.trim(),
            phone: document.getElementById('cPhone').value.trim(),
            gov: document.getElementById('cGov').value,
            addr: document.getElementById('cAddr').value.trim()
        };
        localStorage.setItem('yassin_user_profile', JSON.stringify(profile));
        syncCustomer();
        overlay.style.display = 'none';
        alert('✅ تم حفظ حسابك بنجاح!');
    });
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('yassin_user_profile');
        form.reset();
        syncCustomer();
        overlay.style.display = 'none';
    });

    // 2. مراقبة السلة وتحديث الشريط الثابت أسفل الشاشة تلقائياً
    const bottomBar = document.getElementById('bottomCartBar');
    const bottomCount = document.getElementById('bottomCartCount');
    const bottomTotal = document.getElementById('bottomCartTotal');
    const bottomOpenBtn = document.getElementById('bottomCartOpenBtn');

    bottomOpenBtn?.addEventListener('click', () => {
        syncCustomer();
        const cartTrigger = document.getElementById('cartBtn') || document.querySelector('[id*="cart"], .cart-btn');
        if (cartTrigger) cartTrigger.click();
    });

    setInterval(() => {
        const countEl = document.getElementById('cartCount') || document.querySelector('.cart-badge, .badge');
        const totalEl = document.getElementById('cartTotal') || document.querySelector('[id*="total"]');
        const qty = countEl ? parseInt(countEl.textContent.replace(/\D/g, '') || '0', 10) : 0;
        if (qty > 0) {
            bottomBar.style.display = 'flex';
            bottomCount.textContent = qty;
            if (totalEl) bottomTotal.textContent = totalEl.textContent;
        } else {
            bottomBar.style.display = 'none';
        }
    }, 400);

    // 3. حقن أدوات الإدارة (صور متعددة + ألوان + تبديل متوفر/نافذ) تلقائياً عند فتح لوحة الإدارة
    const adminObserver = new MutationObserver(() => {
        const adminInputs = Array.from(document.querySelectorAll('input'));
        const imgInput = adminInputs.find(i => (i.placeholder || '').includes('صورة') || (i.id || '').toLowerCase().includes('img'));
        if (imgInput && !document.getElementById('multiImgUploadBox')) {
            const box = document.createElement('div');
            box.id = 'multiImgUploadBox';
            box.style.cssText = 'margin:8px 0;padding:10px;background:#f8fafc;border:1px dashed #f25011;border-radius:10px;font-size:0.85rem;';
            box.innerHTML = '<label style="cursor:pointer;font-weight:700;color:#0f172a;display:block;"><i class="fas fa-images" style="color:#f25011;"></i> اختيار صورة أو أكثر من جهازك (ضغط تلقائي): <input type="file" id="adminMultiFiles" accept="image/*" multiple style="margin-top:6px;display:block;"></label>';
            imgInput.parentNode.insertBefore(box, imgInput.nextSibling);

            document.getElementById('adminMultiFiles').addEventListener('change', async function(ev) {
                const files = Array.from(ev.target.files || []);
                if (!files.length) return;
                const results = [];
                for (const f of files) {
                    const b64 = await new Promise(res => {
                        const r = new FileReader();
                        r.onload = e => {
                            const im = new Image();
                            im.onload = () => {
                                const c = document.createElement('canvas');
                                const s = im.width > 420 ? (420 / im.width) : 1;
                                c.width = im.width * s; c.height = im.height * s;
                                c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
                                res(c.toDataURL('image/jpeg', 0.72));
                            };
                            im.src = e.target.result;
                        };
                        r.readAsDataURL(f);
                    });
                    results.push(b64);
                }
                imgInput.value = results.join(' | ');
                alert('✅ تم ضغط وتجهيز ' + results.length + ' صورة بنجاح!');
            });
        }
    });
    adminObserver.observe(document.body, { childList: true, subtree: true });

    syncCustomer();
});
// === ENTERPRISE_JS_END ===

// === ADMIN_ADVANCED_START ===
window.addEventListener('DOMContentLoaded', function() {
    // مراقبة لوحة الإدارة وحقن أدوات التحكم المتقدمة (تعديل + ألوان + متوفر/نافذ)
    const observer = new MutationObserver(() => {
        const adminSection = document.getElementById('adminDashboardSection') || document.querySelector('[id*="admin"]');
        if (!adminSection) return;

        // 1. حقن حقل الألوان المتوفرة في نموذج إضافة/تعديل المنتج إذا لم يكن موجوداً
        const descInput = Array.from(adminSection.querySelectorAll('input, textarea')).find(el =>
            (el.placeholder || '').includes('وصف') || (el.id || '').toLowerCase().includes('desc')
        );
        if (descInput && !document.getElementById('adminColorsInput')) {
            const colorDiv = document.createElement('div');
            colorDiv.style.cssText = 'margin:8px 0;';
            colorDiv.innerHTML = '<input type="text" id="adminColorsInput" placeholder="الألوان أو الخيارات المتوفرة (افصل بينها بفاصلة، مثال: أزرق، أسود، أحمر)" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;font-size:0.9rem;">';
            descInput.parentNode.insertBefore(colorDiv, descInput.nextSibling);
        }

        // 2. إضافة لوحة إدارة سريعة للمنتجات الحالية (تعديل + زر متوفر/نافذ)
        if (!document.getElementById('quickInventoryManager')) {
            const managerBox = document.createElement('div');
            managerBox.id = 'quickInventoryManager';
            managerBox.style.cssText = 'margin-top:20px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;';
            managerBox.innerHTML = 
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                    <h4 style="margin:0;color:#0f172a;"><i class="fas fa-sliders-h" style="color:#f25011;"></i> إدارة المخزون السريعة (تعديل التفاصيل / متوفر أو نافذ)</h4>
                    <button type="button" id="refreshQuickInvBtn" style="background:#0f172a;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.82rem;">تحديث القائمة</button>
                </div>
                <div id="quickInvList" style="display:flex;flex-direction:column;gap:10px;"></div>
            ;
            adminSection.appendChild(managerBox);

            window.renderQuickInventory = function() {
                const listEl = document.getElementById('quickInvList');
                if (!listEl) return;
                // قراءة المنتجات من الذاكرة أو من المتغير العام
                let prods = [];
                try {
                    prods = JSON.parse(localStorage.getItem('yassin_products') || localStorage.getItem('products') || '[]');
                } catch(e) {}
                if ((!prods || !prods.length) && typeof products !== 'undefined') prods = products;

                if (!prods || !prods.length) {
                    listEl.innerHTML = '<div style="color:#64748b;font-size:0.85rem;">اضغط "تحديث القائمة" لعرض المنتجات الحالية وتعديلها.</div>';
                    return;
                }

                listEl.innerHTML = prods.map((p, idx) => {
                    const isOut = Boolean(p.outOfStock);
                    const colorsText = Array.isArray(p.variants) ? p.variants.join('، ') : (p.variants || 'لا توجد ألوان محددة');
                    return 
                        <div style="background:#fff;padding:12px;border-radius:10px;border:1px solid #cbd5e1;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:800;color:#0f172a;"> <span style="color:#f25011;font-size:0.85rem;">( د.ع)</span></div>
                                <div style="font-size:0.8rem;color:#475569;margin-top:3px;">الألوان/الخيارات: <b></b></div>
                            </div>
                            <div style="display:flex;gap:8px;align-items:center;">
                                <button type="button" onclick="toggleProductStock()" style="background:;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.82rem;">
                                    
                                </button>
                                <button type="button" onclick="editProductDetails()" style="background:#2563eb;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.82rem;">
                                    <i class="fas fa-edit"></i> تعديل
                                </button>
                            </div>
                        </div>
                    ;
                }).join('');
            };

            window.toggleProductStock = function(idx) {
                let key = localStorage.getItem('yassin_products') ? 'yassin_products' : 'products';
                let prods = JSON.parse(localStorage.getItem(key) || '[]');
                if (!prods.length && typeof products !== 'undefined') prods = products;
                if (!prods[idx]) return;
                prods[idx].outOfStock = !prods[idx].outOfStock;
                localStorage.setItem(key, JSON.stringify(prods));
                if (typeof products !== 'undefined') products = prods;
                if (typeof renderProducts === 'function') renderProducts();
                window.renderQuickInventory();
            };

            window.editProductDetails = function(idx) {
                let key = localStorage.getItem('yassin_products') ? 'yassin_products' : 'products';
                let prods = JSON.parse(localStorage.getItem(key) || '[]');
                if (!prods.length && typeof products !== 'undefined') prods = products;
                const p = prods[idx];
                if (!p) return;

                const newName = prompt('تعديل اسم المنتج:', p.name);
                if (newName === null) return;
                const newPrice = prompt('تعديل السعر (بالدينار العراقي):', p.price);
                if (newPrice === null) return;
                const currentColors = Array.isArray(p.variants) ? p.variants.join('، ') : '';
                const newColors = prompt('الألوان أو الخيارات المتوفرة (افصل بينها بفاصلة مثل: أزرق، أسود، أحمر):', currentColors);
                if (newColors === null) return;
                const newDesc = prompt('تعديل وصف المنتج:', p.desc || '');
                if (newDesc === null) return;

                p.name = newName.trim() || p.name;
                p.price = Number(newPrice) || p.price;
                p.variants = newColors.split(/[,،]/).map(s => s.trim()).filter(Boolean);
                p.desc = newDesc.trim();

                prods[idx] = p;
                localStorage.setItem(key, JSON.stringify(prods));
                if (typeof products !== 'undefined') products = prods;
                if (typeof renderProducts === 'function') renderProducts();
                window.renderQuickInventory();
                alert('✅ تم تحديث تفاصيل وألوان المنتج بنجاح! لا تنسَ نسخ الكود وتحديث products.json على GitHub ليظهر لجميع الزبائن.');
            };

            document.getElementById('refreshQuickInvBtn')?.addEventListener('click', window.renderQuickInventory);
            setTimeout(window.renderQuickInventory, 400);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
// === ADMIN_ADVANCED_END ===
