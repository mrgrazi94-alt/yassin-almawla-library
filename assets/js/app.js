const FIREBASE_DB_URL = 'https://yassin-library-default-rtdb.firebaseio.com';

let products = JSON.parse(localStorage.getItem('yassin_products_v2') || localStorage.getItem('yassin_products') || '[]');
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

// إدارة المظهر (الليلي / النهاري)
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

// عرض المنتجات في واجهة المتجر
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = products.filter(p => {
        if (!p || !p.name) return false;
        const cat = (p.category || '').trim();
        const matchCat = currentCategory === "الكل" || cat === currentCategory || cat.includes(currentCategory) || currentCategory.includes(cat);
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cat.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDiscount = !onlyDiscounts || (p.oldPrice && Number(p.oldPrice) > Number(p.price));
        return matchCat && matchSearch && matchDiscount;
    });

    if (sortOption === "low-high") filtered.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortOption === "high-low") filtered.sort((a, b) => Number(b.price) - Number(a.price));
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
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
                <i class="fas fa-box-open" style="font-size:2.2rem; margin-bottom:12px; opacity:0.5;"></i>
                <h3 style="margin:0 0 6px;">لا توجد منتجات في هذا القسم حالياً</h3>
                <p style="font-size:0.9rem;">جرب تصفح جميع الأقسام أو البحث بكلمة أخرى.</p>
            </div>`;
        return;
    }

    filtered.forEach(prod => {
        const isFav = wishlist.includes(prod.id);
        const isOut = prod.outOfStock === true;
        const priceNum = Number(prod.price) || 0;
        const oldPriceNum = Number(prod.oldPrice) || 0;
        const discountPct = oldPriceNum > priceNum ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) : 0;
        const badgeHTML = isOut ? `<span class="badge-tag out">نفذت الكمية</span>` : (discountPct > 0 ? `<span class="badge-tag sale">خصم ${discountPct}%</span>` : '');
        const variantsList = Array.isArray(prod.variants) ? prod.variants : [];
        const variantsHTML = variantsList.length ? `<div class="card-variants-preview">${variantsList.map(v => `<span class="mini-variant-chip">${sanitizeHTML(v)}</span>`).join('')}</div>` : '';
        const defaultVar = variantsList[0] || "";
        const imgSrc = prod.img || prod.image || 'assets/images/logo.jpg';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHTML}
            <div class="card-floating-actions">
                <button class="circle-action-btn ${isFav ? 'fav-active' : ''}" onclick="toggleWishlist(${prod.id})" title="المفضلة"><i class="${isFav ? 'fas' : 'far'} fa-heart"></i></button>
                <button class="circle-action-btn share-btn" onclick="shareProduct(${prod.id})" title="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
            <div class="card-img-wrap" style="${isOut ? 'opacity:0.65;' : ''}">
                <img src="${sanitizeHTML(imgSrc)}" alt="${sanitizeHTML(prod.name)}" loading="lazy">
                <button class="quick-view-bar" onclick="openQuickView(${prod.id})"><i class="fas fa-eye"></i> معاينة التفاصيل</button>
            </div>
            <div class="card-body">
                <div>
                    <span class="card-cat">${sanitizeHTML(prod.category || 'عام')}</span>
                    <h3 class="card-title">${sanitizeHTML(prod.name)}</h3>
                    ${variantsHTML}
                </div>
                <div>
                    <div class="card-price-row">
                        <span class="price-now">${priceNum.toLocaleString()} د.ع</span>
                        ${oldPriceNum > priceNum ? `<span class="price-was">${oldPriceNum.toLocaleString()} د.ع</span>` : ''}
                    </div>
                    <button class="card-add-btn" onclick="addToCart(${prod.id}, '${sanitizeHTML(defaultVar)}')" ${isOut ? 'disabled' : ''}>
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
    const discCheck = document.getElementById('onlyDiscountCheckbox');
    if (discCheck) discCheck.checked = false;
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

// إدارة السلة
window.addToCart = function(prodId, variant = "") {
    const product = products.find(p => p.id === prodId);
    if (!product || product.outOfStock) return;
    const chosenVar = variant || product.variants?.[0] || "";
    const cartKey = `${prodId}_${chosenVar}`;
    const existing = cart.find(i => i.cartKey === cartKey);
    if (existing) existing.quantity++;
    else {
        cart.push({
            cartKey,
            id: product.id,
            name: product.name,
            price: Number(product.price),
            img: product.img || product.image || 'assets/images/logo.jpg',
            variant: chosenVar,
            quantity: 1
        });
    }
    localStorage.setItem('yassin_cart_v2', JSON.stringify(cart));
    updateCartUI();
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
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
        container.innerHTML = `<div style="text-align:center; padding:45px 15px; color:var(--text-muted);">سلة المشتريات فارغة حالياً</div>`;
    } else {
        cart.forEach(item => {
            subTotal += item.price * item.quantity;
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 0; border-bottom:1px solid var(--border-color);">
                    <img src="${sanitizeHTML(item.img)}" style="width:50px; height:50px; border-radius:10px; object-fit:cover; border:1px solid #e2e8f0;">
                    <div style="flex:1;">
                        <h4 style="font-size:13.5px; margin:0 0 3px;">${sanitizeHTML(item.name)}</h4>
                        ${item.variant ? `<span style="font-size:11.5px; color:var(--text-muted); display:block;">الخيار: ${sanitizeHTML(item.variant)}</span>` : ''}
                        <span style="font-size:13px; color:var(--accent); font-weight:800;">${item.price.toLocaleString()} د.ع</span>
                        <div style="margin-top:6px; display:flex; align-items:center; gap:6px;">
                            <button type="button" onclick="changeCartQty('${item.cartKey}', -1)" style="width:24px; height:24px; border-radius:6px; border:1px solid #cbd5e1; background:#fff; cursor:pointer; font-weight:bold;">-</button>
                            <strong style="min-width:20px; text-align:center;">${item.quantity}</strong>
                            <button type="button" onclick="changeCartQty('${item.cartKey}', 1)" style="width:24px; height:24px; border-radius:6px; border:1px solid #cbd5e1; background:#fff; cursor:pointer; font-weight:bold;">+</button>
                        </div>
                    </div>
                    <button type="button" onclick="removeCartItem('${item.cartKey}')" style="background:none; border:none; color:#ef4444; cursor:pointer; padding:6px;"><i class="fas fa-trash"></i></button>
                </div>`;
        });
    }

    const threshold = (typeof STORE_CONFIG !== 'undefined' && STORE_CONFIG.freeShippingThreshold) ? STORE_CONFIG.freeShippingThreshold : 50000;
    const pct = Math.min(100, (subTotal / threshold) * 100);
    const bar = document.getElementById('freeShippingBar');
    if (bar) bar.style.width = `${pct}%`;

    const shipTxt = document.getElementById('freeShippingText');
    if (shipTxt) {
        shipTxt.innerHTML = subTotal >= threshold
            ? `مؤهل للحصول على <strong>توصيل مجاني بالكامل</strong>`
            : `أضف منتجات بقيمة <strong>${(threshold - subTotal).toLocaleString()} د.ع</strong> للحصول على توصيل مجاني`;
    }

    const citySel = document.getElementById('custCity');
    const opt = citySel?.options[citySel.selectedIndex];
    let fee = opt?.dataset.fee ? parseInt(opt.dataset.fee, 10) : 0;
    const feeLabel = document.getElementById('deliveryFeeText');

    if (feeLabel) {
        if (subTotal >= threshold && subTotal > 0) {
            fee = 0;
            feeLabel.textContent = "مجاني";
        } else if (opt?.value) {
            feeLabel.textContent = `${fee.toLocaleString()} د.ع`;
        } else {
            feeLabel.textContent = "اختر المحافظة";
        }
    }

    const disc = Math.round((subTotal * appliedDiscountPercent) / 100);
    document.getElementById('discountRow')?.classList.toggle('hidden', disc <= 0);
    if (disc > 0) document.getElementById('discountAmount').textContent = `-${disc.toLocaleString()} د.ع`;

    const finalTotal = Math.max(0, subTotal - disc + (subTotal > 0 ? fee : 0));
    if (document.getElementById('subTotalPrice')) document.getElementById('subTotalPrice').textContent = `${subTotal.toLocaleString()} د.ع`;
    if (document.getElementById('finalTotalPrice')) document.getElementById('finalTotalPrice').textContent = `${finalTotal.toLocaleString()} د.ع`;
    if (document.getElementById('headerMiniTotal')) document.getElementById('headerMiniTotal').textContent = `${subTotal.toLocaleString()} د.ع`;

    // تحديث شريط السلة السفلي المتزامن
    const stickyBar = document.getElementById('stickyCartBar');
    if (stickyBar) {
        if (totalItems > 0) {
            stickyBar.classList.remove('hidden');
            stickyBar.style.display = 'flex';
            const sCount = document.getElementById('stickyCartCount');
            const sTotal = document.getElementById('stickyCartTotal');
            if (sCount) sCount.textContent = totalItems;
            if (sTotal) sTotal.textContent = `${subTotal.toLocaleString()} د.ع`;
        } else {
            stickyBar.classList.add('hidden');
            stickyBar.style.display = 'none';
        }
    }
}

document.getElementById('custCity')?.addEventListener('change', updateCartUI);

document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    if (code === "YASSIN10") {
        appliedDiscountPercent = 10;
        showToast("تم تطبيق خصم 10% بنجاح");
        updateCartUI();
    } else {
        showToast("كود الخصم غير صالح");
    }
});

// المعاينة السريعة للمنتج
window.openQuickView = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modalImg').src = p.img || p.image || 'assets/images/logo.jpg';
    document.getElementById('modalCategory').textContent = p.category || 'عام';
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalPrice').textContent = `${Number(p.price).toLocaleString()} د.ع`;
    document.getElementById('modalDesc').textContent = p.desc || 'منتج أصلي مضمون الجودة من مكتبة ياسين المولى.';

    const pills = document.getElementById('modalVariantPills');
    pills.innerHTML = '';
    if (Array.isArray(p.variants) && p.variants.length) {
        document.getElementById('modalVariantsBox').classList.remove('hidden');
        selectedQuickViewVariant = p.variants[0];
        p.variants.forEach((v, idx) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = `variant-pill-btn ${idx === 0 ? 'selected' : ''}`;
            b.textContent = v;
            b.onclick = () => {
                document.querySelectorAll('.variant-pill-btn').forEach(x => x.classList.remove('selected'));
                b.classList.add('selected');
                selectedQuickViewVariant = v;
            };
            pills.appendChild(b);
        });
    } else {
        selectedQuickViewVariant = "";
        document.getElementById('modalVariantsBox').classList.add('hidden');
    }

    const addBtn = document.getElementById('modalAddToCartBtn');
    addBtn.disabled = Boolean(p.outOfStock);
    addBtn.innerHTML = p.outOfStock ? 'غير متوفر حالياً' : '<i class="fas fa-cart-plus"></i> إضافة إلى السلة';
    addBtn.onclick = () => {
        addToCart(p.id, selectedQuickViewVariant);
        document.getElementById('quickViewModal').classList.remove('active');
    };
    document.getElementById('quickViewModal').classList.add('active');
};

window.toggleWishlist = function(id) {
    wishlist = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    localStorage.setItem('yassin_wishlist_v2', JSON.stringify(wishlist));
    const wlCount = document.getElementById('wishlistCount');
    if (wlCount) wlCount.textContent = wishlist.length;
    renderProducts();
};

window.shareProduct = function(id) {
    const p = products.find(x => x.id === id);
    if (p) {
        navigator.clipboard.writeText(`${p.name} - ${Number(p.price).toLocaleString()} د.ع\n${window.location.href}`)
            .then(() => showToast("تم نسخ رابط المنتج للمشاركة"));
    }
};

// فتح وإغلاق السلة والنوافذ
function openCartDrawer() {
    document.getElementById('cartDrawer')?.classList.add('active');
    document.getElementById('cartOverlay')?.classList.add('active');
}
function closeCartDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('active');
    document.getElementById('cartOverlay')?.classList.remove('active');
}

document.getElementById('cartToggleBtn')?.addEventListener('click', openCartDrawer);
document.getElementById('openStickyCartBtn')?.addEventListener('click', openCartDrawer);
document.getElementById('closeCartBtn')?.addEventListener('click', closeCartDrawer);
document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);

document.getElementById('wishlistToggleBtn')?.addEventListener('click', () => {
    const box = document.getElementById('wishlistItemsContainer');
    box.innerHTML = wishlist.length ? wishlist.map(id => {
        const p = products.find(x => x.id === id);
        return p ? `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border-color);"><span>${sanitizeHTML(p.name)}</span><button type="button" onclick="addToCart(${p.id})" class="btn-primary-lg" style="padding:6px 12px; font-size:12px;">أضف للسلة</button></div>` : '';
    }).join('') : '<p style="text-align:center; padding:24px; color:var(--text-muted);">قائمة المفضلة فارغة حالياً</p>';
    document.getElementById('wishlistModal').classList.add('active');
});
document.getElementById('closeWishlistModal')?.addEventListener('click', () => document.getElementById('wishlistModal').classList.remove('active'));

document.getElementById('ordersHistoryBtn')?.addEventListener('click', () => {
    const box = document.getElementById('ordersHistoryContainer');
    box.innerHTML = orderHistory.length ? orderHistory.map(o => `<div style="padding:12px; border-bottom:1px solid var(--border-color);"><strong>#${o.orderId}</strong> — ${o.total} <span style="color:var(--text-muted); font-size:12px;">(${o.date})</span></div>`).join('') : '<p style="text-align:center; padding:24px; color:var(--text-muted);">لا توجد طلبات سابقة مسجلة</p>';
    document.getElementById('ordersModal').classList.add('active');
});
document.getElementById('closeOrdersModal')?.addEventListener('click', () => document.getElementById('ordersModal').classList.remove('active'));
document.getElementById('closeQuickView')?.addEventListener('click', () => document.getElementById('quickViewModal').classList.remove('active'));
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => document.getElementById('mainNav').classList.toggle('open'));
document.getElementById('shopNowBtn')?.addEventListener('click', () => document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' }));

document.querySelectorAll('#mainNav a').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    filterByCategory(a.dataset.cat);
}));
document.getElementById('sortProducts')?.addEventListener('change', (e) => { sortOption = e.target.value; renderProducts(); });
document.getElementById('onlyDiscountCheckbox')?.addEventListener('change', (e) => { onlyDiscounts = e.target.checked; renderProducts(); });

// المزامنة الحية المباشرة مع Firebase لصفحة الزبون
async function initStore() {
    const wlCount = document.getElementById('wishlistCount');
    if (wlCount) wlCount.textContent = wishlist.length;

    // عرض الكاش المحلي فوراً لتسريع الفتح
    if (products.length > 0) {
        renderProducts();
        updateCartUI();
    }

    // جلب أحدث المنتجات من سحابة Firebase دائماً
    try {
        const cloudRes = await fetch(`${FIREBASE_DB_URL}/products.json?t=${Date.now()}`);
        if (cloudRes.ok) {
            const cloudData = await cloudRes.json();
            if (Array.isArray(cloudData) && cloudData.length > 0) {
                products = cloudData;
                localStorage.setItem('yassin_products_v2', JSON.stringify(products));
                localStorage.setItem('yassin_products', JSON.stringify(products));
                renderProducts();
                updateCartUI();
                return;
            }
        }
    } catch (e) {}

    // خطة بديلة من الملف المحلي إذا كانت السحابة فارغة
    if (products.length === 0) {
        try {
            const localRes = await fetch(`data/products.json?v=${Date.now()}`);
            if (localRes.ok) {
                const localData = await localRes.json();
                if (Array.isArray(localData) && localData.length > 0) {
                    products = localData;
                    localStorage.setItem('yassin_products_v2', JSON.stringify(products));
                    renderProducts();
                    updateCartUI();
                }
            }
        } catch (e) {}
    }
}

initStore();