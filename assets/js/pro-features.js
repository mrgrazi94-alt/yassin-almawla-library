(function() {
    var ADMIN_PASS = 'admin2026';

    function initYassinPlatform() {
        if (document.getElementById('yassinUltimateHub')) return;

        // === 1. تحسينات التنسيق وتوحيد صور المنتجات ===
        var styleTag = document.createElement('style');
        styleTag.textContent = `
            .product-card img, .product-img-wrap img {
                aspect-ratio: 1 / 1;
                object-fit: cover;
                background: #f8fafc;
                border-radius: 12px;
            }
            .yassin-hub-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 12px;
            }
            @media (max-width: 640px) {
                .yassin-hub-grid {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding-bottom: 8px;
                    gap: 10px;
                }
                .yassin-hub-card {
                    min-width: 230px;
                    scroll-snap-align: start;
                    flex-shrink: 0;
                }
            }
            .yassin-hub-card:hover {
                transform: translateY(-3px);
                filter: brightness(1.05);
            }
            .ym-tab-btn.active {
                background: #f25011 !important;
                color: #fff !important;
                border-color: #f25011 !important;
            }
        `;
        document.head.appendChild(styleTag);

        // === 2. شريط التقدم للتوصيل المجاني أعلى الصفحة ===
        var freeShippingThreshold = 25000;
        var fsBar = document.createElement('div');
        fsBar.id = 'freeShippingProgressBar';
        fsBar.style.cssText = 'background:#0f172a;color:#fff;padding:8px 16px;text-align:center;font-size:0.85rem;direction:rtl;border-bottom:2px solid #f25011;position:relative;z-index:900;';
        fsBar.innerHTML = `
            <div id="fsText" style="font-weight:700;margin-bottom:5px;">🚚 اطلب بقيمة <b>25,000 د.ع</b> أو أكثر واحصل على <b>توصيل مجاني</b> لجميع المحافظات!</div>
            <div style="max-width:420px;height:6px;background:rgba(255,255,255,0.18);border-radius:10px;margin:0 auto;overflow:hidden;">
                <div id="fsFill" style="width:15%;height:100%;background:linear-gradient(90deg,#f25011,#fbbf24);transition:width 0.4s ease;"></div>
            </div>
        `;
        document.body.prepend(fsBar);

        setInterval(function() {
            var totalEl = document.getElementById('cartTotal');
            if (!totalEl) return;
            var currentVal = parseInt(totalEl.textContent.replace(/\D/g, '') || '0', 10);
            var pct = Math.min(100, Math.round((currentVal / freeShippingThreshold) * 100));
            var fillEl = document.getElementById('fsFill');
            var txtEl = document.getElementById('fsText');
            if (fillEl) fillEl.style.width = (pct > 0 ? pct : 10) + '%';
            if (txtEl) {
                if (currentVal >= freeShippingThreshold) {
                    txtEl.innerHTML = '🎉 <b>مبروك!</b> لقد حصلت على <b>توصيل مجاني بالكامل</b> لطلبك!';
                } else if (currentVal > 0) {
                    var rem = freeShippingThreshold - currentVal;
                    txtEl.innerHTML = '🚚 أضف مشتريات بقيمة <b style="color:#fbbf24;">' + rem.toLocaleString() + ' د.ع</b> فقط لتحصل على <b>توصيل مجاني</b>!';
                } else {
                    txtEl.innerHTML = '🚚 اطلب بقيمة <b>25,000 د.ع</b> أو أكثر واحصل على <b>توصيل مجاني</b> لجميع المحافظات!';
                }
            }
        }, 800);

        // === 3. البحث الصوتي الذكي ===
        var searchInput = document.querySelector('input[type="search"], input[placeholder*="بحث"], input[placeholder*="ابحث"]');
        if (searchInput && !document.getElementById('voiceSearchBtn')) {
            var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRec) {
                var micBtn = document.createElement('button');
                micBtn.type = 'button';
                micBtn.id = 'voiceSearchBtn';
                micBtn.title = 'ابحث بصوتك';
                micBtn.innerHTML = '🎙️';
                micBtn.style.cssText = 'background:#f25011;color:#fff;border:none;border-radius:10px;padding:6px 10px;cursor:pointer;font-size:1rem;margin-right:6px;';
                searchInput.parentNode.appendChild(micBtn);

                micBtn.onclick = function() {
                    var rec = new SpeechRec();
                    rec.lang = 'ar-IQ';
                    micBtn.innerHTML = '🔴...';
                    rec.onresult = function(ev) {
                        searchInput.value = ev.results[0][0].transcript;
                        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                        micBtn.innerHTML = '🎙️';
                    };
                    rec.onerror = function() { micBtn.innerHTML = '🎙️'; };
                    rec.onend = function() { micBtn.innerHTML = '🎙️'; };
                    rec.start();
                };
            }
        }

        // === 4. مركز خدمات الزبائن (نظيف ومخفي فيه زر الإدارة تماماً) ===
        var productsSection = document.querySelector('#productsGrid, .products-section, .products-grid');
        var hub = document.createElement('section');
        hub.id = 'yassinUltimateHub';
        hub.style.cssText = 'max-width:1240px;margin:22px auto;padding:0 16px;direction:rtl;font-family:inherit;';

        hub.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;background:#f8fafc;padding:10px 16px;border-radius:14px;border:1px solid #e2e8f0;">
                <div style="font-weight:800;color:#0f172a;font-size:0.95rem;">⚡ خدمات مكتبة ياسين المولى التفاعلية</div>
                <button type="button" id="btnTrackOrder" style="background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:inherit;">📦 تتبع طلبي</button>
            </div>

            <div class="yassin-hub-grid">
                <div id="btnPrintCalc" class="yassin-hub-card" style="background:linear-gradient(135deg,#f25011,#c2410c);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#0f172a;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🖨️</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">حاسبة الاستنساخ PDF</div><div style="font-size:0.78rem;opacity:0.9;">احسب سعر الطباعة والتسليك</div></div>
                </div>

                <div id="btnSmartBundle" class="yassin-hub-card" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#f25011;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🎒</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">مُكوّن الحقيبة الذكي</div><div style="font-size:0.78rem;opacity:0.9;">باقات دراسية بخصم 10%</div></div>
                </div>

                <div id="btnGroupOrder" class="yassin-hub-card" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#fbbf24;color:#0f172a;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🤝</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">اطلب وية جماعتك</div><div style="font-size:0.78rem;opacity:0.9;">قسّم الفاتورة والتوصيل</div></div>
                </div>

                <div id="btnBulkList" class="yassin-hub-card" style="background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#fff;color:#0f766e;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">📋</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">قائمة ملازم كاملة</div><div style="font-size:0.78rem;opacity:0.9;">الصق قائمة المدرس دفعة واحدة</div></div>
                </div>

                <div id="btnScratchCard" class="yassin-hub-card" style="background:linear-gradient(135deg,#be123c,#e11d48);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#fde047;color:#0f172a;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🎁</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">امسح واربح هديتك</div><div style="font-size:0.78rem;opacity:0.9;">بطاقة حظ فورية لكل طالب</div></div>
                </div>

                <div id="btnChecklist" class="yassin-hub-card" style="background:linear-gradient(135deg,#0369a1,#0284c7);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#fff;color:#0369a1;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">✅</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">كاشف نواقص الحقيبة</div><div style="font-size:0.78rem;opacity:0.9;">استخرج نواقصك تلقائياً</div></div>
                </div>

                <div id="btnSpecialReq" class="yassin-hub-card" style="background:linear-gradient(135deg,#065f46,#047857);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#fbbf24;color:#0f172a;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🔍</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">اطلب ملزمة خاصة</div><div style="font-size:0.78rem;opacity:0.9;">نوفّر أي ملزمة غير موجودة</div></div>
                </div>

                <div id="btnStudyTimer" class="yassin-hub-card" style="background:linear-gradient(135deg,#1e293b,#334155);color:#fff;padding:15px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:0.2s;">
                    <div style="background:#38bdf8;color:#0f172a;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">⏱️</div>
                    <div><div style="font-weight:800;font-size:0.95rem;">مؤقت الدراسة الذكي</div><div style="font-size:0.78rem;opacity:0.9;">ادرس بنظام البومودورو</div></div>
                </div>
            </div>
        `;

        if (productsSection && productsSection.parentNode) {
            productsSection.parentNode.insertBefore(hub, productsSection);
        } else {
            document.body.insertBefore(hub, document.body.children[2] || null);
        }

        // === 5. واجهة الإدارة المستقلة بملء الشاشة (Full-Screen Enterprise Admin Portal) ===
        var adminPortalHtml = `
        <div id="ymFullAdminPortal" style="display:none;position:fixed;inset:0;background:#0b1120;color:#f8fafc;z-index:10000;overflow-y:auto;direction:rtl;font-family:inherit;">
            <!-- الشريط العلوي للوحة الإدارة -->
            <div style="background:#111827;border-bottom:1px solid #1e293b;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:100;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="background:#f25011;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:900;">👑</div>
                    <div>
                        <h2 style="margin:0;font-size:1.2rem;color:#fff;">مركز القيادة والإدارة — مكتبة ياسين المولى</h2>
                        <div style="font-size:0.78rem;color:#94a3b8;">تحكم كامل بالمنتجات، الأسعار، الألوان، الزبائن، والطلبات</div>
                    </div>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <button type="button" id="admCopyJsonBtn" style="background:#16a34a;color:#fff;border:none;padding:9px 16px;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.85rem;">📋 نسخ كود المنتجات المحدث (GitHub)</button>
                    <button type="button" id="admClosePortalBtn" style="background:#ef4444;color:#fff;border:none;padding:9px 16px;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;font-size:0.85rem;">✖ إغلاق والعودة للمتجر</button>
                </div>
            </div>

            <!-- إحصائيات سريعة -->
            <div style="max-width:1280px;margin:20px auto;padding:0 20px;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:20px;">
                    <div style="background:#1e293b;padding:16px;border-radius:16px;border:1px solid #334155;">
                        <div style="color:#94a3b8;font-size:0.82rem;">إجمالي المنتجات</div>
                        <div id="statTotalProds" style="font-size:1.8rem;font-weight:900;color:#fff;margin-top:4px;">0</div>
                    </div>
                    <div style="background:#1e293b;padding:16px;border-radius:16px;border:1px solid #334155;">
                        <div style="color:#94a3b8;font-size:0.82rem;">المنتجات المتوفرة</div>
                        <div id="statAvailProds" style="font-size:1.8rem;font-weight:900;color:#10b981;margin-top:4px;">0</div>
                    </div>
                    <div style="background:#1e293b;padding:16px;border-radius:16px;border:1px solid #334155;">
                        <div style="color:#94a3b8;font-size:0.82rem;">المنتجات النافذة</div>
                        <div id="statOutProds" style="font-size:1.8rem;font-weight:900;color:#ef4444;margin-top:4px;">0</div>
                    </div>
                    <div style="background:#1e293b;padding:16px;border-radius:16px;border:1px solid #334155;">
                        <div style="color:#94a3b8;font-size:0.82rem;">الطلبات المسجلة</div>
                        <div id="statOrdersCount" style="font-size:1.8rem;font-weight:900;color:#f59e0b;margin-top:4px;">0</div>
                    </div>
                </div>

                <!-- أزرار التبويبات -->
                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;border-bottom:1px solid #1e293b;padding-bottom:14px;">
                    <button type="button" class="ym-tab-btn active" data-tab="tabProducts" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:10px 18px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">📦 إدارة المنتجات والألوان (إضافة / تعديل / حذف)</button>
                    <button type="button" class="ym-tab-btn" data-tab="tabOrders" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:10px 18px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">👥 الزبائن وسجل الطلبات</button>
                    <button type="button" class="ym-tab-btn" data-tab="tabMarketing" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:10px 18px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">🏷️ ملصقات التوصيل وصانع الإعلانات</button>
                </div>

                <!-- التبويب 1: إدارة المنتجات -->
                <div id="tabProducts" class="ym-tab-content">
                    <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:20px;align-items:start;">
                        <!-- نموذج إضافة / تعديل منتج -->
                        <div style="background:#111827;padding:20px;border-radius:18px;border:1px solid #1e293b;">
                            <h3 id="admFormTitle" style="margin:0 0 14px;color:#f25011;font-size:1.1rem;">➕ إضافة منتج جديد للمتجر</h3>
                            <input type="hidden" id="admEditIndex" value="-1">
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <input type="text" id="admPName" placeholder="اسم المنتج أو الملزمة *" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                                    <input type="number" id="admPPrice" placeholder="السعر الحالي (د.ع) *" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                    <input type="number" id="admPOldPrice" placeholder="السعر القديم (اختياري)" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                </div>
                                <select id="admPCat" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                    <option value="ملازم دراسية">ملازم دراسية</option>
                                    <option value="قرطاسية">قرطاسية</option>
                                    <option value="مستلزمات مدرسية">مستلزمات مدرسية</option>
                                    <option value="مستلزمات مكتبية">مستلزمات مكتبية</option>
                                    <option value="مستلزمات الرسم">مستلزمات الرسم</option>
                                    <option value="حقائب">حقائب</option>
                                    <option value="هدايا">هدايا</option>
                                </select>
                                <input type="text" id="admPColors" placeholder="الألوان أو الخيارات (مثال: أزرق، أسود، أحمر)" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <textarea id="admPDesc" rows="2" placeholder="وصف مختصر للمنتج..." style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;"></textarea>
                                
                                <div style="background:#1e293b;padding:10px;border-radius:10px;border:1px dashed #475569;">
                                    <label style="font-size:0.82rem;color:#cbd5e1;display:block;margin-bottom:6px;">📸 ارفع صورة المنتج من جهازك (تُضغط تلقائياً):</label>
                                    <input type="file" id="admPFile" accept="image/*" style="font-size:0.82rem;color:#94a3b8;width:100%;">
                                    <input type="text" id="admPImgUrl" placeholder="أو الصق رابط الصورة المباشر هنا..." style="margin-top:8px;width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#fff;font-family:inherit;font-size:0.82rem;">
                                </div>

                                <div style="display:flex;gap:8px;margin-top:6px;">
                                    <button type="button" id="admSaveProdBtn" style="flex:1;background:#f25011;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;font-family:inherit;">💾 حفظ المنتج</button>
                                    <button type="button" id="admCancelEditBtn" style="display:none;background:#475569;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;">إلغاء التعديل</button>
                                </div>
                            </div>
                        </div>

                        <!-- قائمة المنتجات الحالية مع أزرار التعديل والحذف والتوفر -->
                        <div style="background:#111827;padding:20px;border-radius:18px;border:1px solid #1e293b;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                                <h3 style="margin:0;font-size:1.1rem;">📋 قائمة منتجات المتجر</h3>
                                <input type="text" id="admSearchProds" placeholder="بحث سريع في المنتجات..." style="padding:8px 12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;font-size:0.85rem;">
                            </div>
                            <div id="admProductsList" style="display:flex;flex-direction:column;gap:10px;max-height:540px;overflow-y:auto;"></div>
                        </div>
                    </div>
                </div>

                <!-- التبويب 2: الزبائن وسجل الطلبات -->
                <div id="tabOrders" class="ym-tab-content" style="display:none;">
                    <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:20px;align-items:start;">
                        <div style="background:#111827;padding:20px;border-radius:18px;border:1px solid #1e293b;">
                            <h3 style="margin:0 0 14px;color:#38bdf8;font-size:1.1rem;">➕ تسجيل طلب جديد لزبون</h3>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <input type="text" id="ordCustName" placeholder="اسم الزبون الكامل *" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <input type="text" id="ordCustPhone" placeholder="رقم هاتف الزبون *" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <input type="text" id="ordCustAddr" placeholder="المحافظة والمنطقة" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <textarea id="ordItems" rows="2" placeholder="تفاصيل الطلب والملازم..." style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;"></textarea>
                                <input type="number" id="ordTotal" placeholder="المبلغ الإجمالي (د.ع)" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <button type="button" id="admSaveOrderBtn" style="background:#0284c7;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;font-family:inherit;">💾 حفظ الطلب في السجل</button>
                            </div>
                        </div>

                        <div style="background:#111827;padding:20px;border-radius:18px;border:1px solid #1e293b;">
                            <h3 style="margin:0 0 14px;font-size:1.1rem;">🗂️ سجل طلبات الزبائن المحفوظة</h3>
                            <div id="admOrdersList" style="display:flex;flex-direction:column;gap:10px;max-height:500px;overflow-y:auto;"></div>
                        </div>
                    </div>
                </div>

                <!-- التبويب 3: ملصقات التوصيل وصانع الإعلانات -->
                <div id="tabMarketing" class="ym-tab-content" style="display:none;">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
                        <div style="background:#111827;padding:20px;border-radius:18px;border:1px solid #1e293b;">
                            <h3 style="margin:0 0 12px;color:#fbbf24;">🏷️ طباعة بوليصة شحن حرارية (Waybill)</h3>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <input type="text" id="wbCustName" placeholder="اسم المستلم" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <input type="text" id="wbCustPhone" placeholder="رقم الهاتف" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <input type="text" id="wbCustAddr" placeholder="المحافظة والعنوان" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <input type="number" id="wbAmount" placeholder="المبلغ المطلوب عند الاستلام (د.ع)" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <button type="button" id="btnPrintWaybill" style="background:#f25011;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;font-family:inherit;">🖨️ طباعة ملصق التوصيل الآن</button>
                            </div>
                        </div>

                        <div style="background:#111827;padding:20px;border-radius:18px;border:1px solid #1e293b;">
                            <h3 style="margin:0 0 12px;color:#38bdf8;">📸 صانع إعلانات الستوري + تصدير الجرد</h3>
                            <div style="display:flex;flex-direction:column;gap:10px;">
                                <input type="text" id="stProdName" placeholder="عنوان الإعلان (مثال: ملزمة الفيزياء 2026)" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <input type="text" id="stProdPrice" placeholder="السعر (مثال: 12,000 د.ع)" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-family:inherit;">
                                <button type="button" id="btnGenStoryCard" style="background:#0284c7;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;font-family:inherit;">✨ تصميم وتحميل صورة ستوري</button>
                                <hr style="border-color:#1e293b;width:100%;">
                                <button type="button" id="btnExportCsv" style="background:#16a34a;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;font-family:inherit;">📊 تصدير جرد المكتبة الكامل (Excel / CSV)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', adminPortalHtml);

        // === 6. منطق تشغيل لوحة الإدارة المستقلة وربطها بالمتجر ===
        function getProdsArray() {
            var key = localStorage.getItem('yassin_products') ? 'yassin_products' : 'products';
            var arr = [];
            try { arr = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) {}
            if ((!arr || !arr.length) && typeof window.products !== 'undefined' && Array.isArray(window.products)) {
                arr = window.products;
            }
            return arr || [];
        }

        function saveProdsArray(arr) {
            localStorage.setItem('yassin_products', JSON.stringify(arr));
            localStorage.setItem('products', JSON.stringify(arr));
            if (typeof window.products !== 'undefined') window.products = arr;
            if (typeof window.renderProducts === 'function') window.renderProducts();
            renderAdminDashboard();
        }

        function renderAdminDashboard() {
            var prods = getProdsArray();
            var orders = JSON.parse(localStorage.getItem('ym_admin_orders') || '[]');
            var searchQ = (document.getElementById('admSearchProds')?.value || '').trim().toLowerCase();

            document.getElementById('statTotalProds').textContent = prods.length;
            document.getElementById('statAvailProds').textContent = prods.filter(function(p) { return !p.outOfStock; }).length;
            document.getElementById('statOutProds').textContent = prods.filter(function(p) { return p.outOfStock; }).length;
            document.getElementById('statOrdersCount').textContent = orders.length;

            var listEl = document.getElementById('admProductsList');
            if (listEl) {
                var filtered = prods.map(function(p, idx) { return { p: p, idx: idx }; }).filter(function(item) {
                    return !searchQ || (item.p.name || '').toLowerCase().includes(searchQ) || (item.p.category || '').toLowerCase().includes(searchQ);
                });

                listEl.innerHTML = filtered.length ? filtered.map(function(item) {
                    var p = item.p, idx = item.idx;
                    var isOut = Boolean(p.outOfStock);
                    var colors = Array.isArray(p.variants) && p.variants.length ? p.variants.join('، ') : 'بدون ألوان';
                    return `
                        <div style="background:#1e293b;padding:12px;border-radius:12px;border:1px solid #334155;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                            <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:210px;">
                                <img src="${p.img || p.image || 'assets/images/logo.jpg'}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;background:#0f172a;">
                                <div>
                                    <div style="font-weight:800;color:#fff;font-size:0.95rem;">${p.name}</div>
                                    <div style="font-size:0.8rem;color:#fbbf24;font-weight:700;">${Number(p.price).toLocaleString()} د.ع <span style="color:#94a3b8;font-weight:400;">| ${p.category || ''} | الألوان: ${colors}</span></div>
                                </div>
                            </div>
                            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                <button type="button" onclick="ymToggleStock(${idx})" style="background:${isOut ? '#ef4444' : '#10b981'};color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;">
                                    ${isOut ? '❌ نافذ' : '✅ متوفر'}
                                </button>
                                <button type="button" onclick="ymEditProduct(${idx})" style="background:#3b82f6;color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;">✏️ تعديل</button>
                                <button type="button" onclick="ymDeleteProduct(${idx})" style="background:#475569;color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;">🗑️ حذف</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div style="color:#94a3b8;text-align:center;padding:20px;">لا توجد منتجات مطابقة.</div>';
            }

            var ordListEl = document.getElementById('admOrdersList');
            if (ordListEl) {
                ordListEl.innerHTML = orders.length ? orders.map(function(o, i) {
                    return `
                        <div style="background:#1e293b;padding:12px;border-radius:12px;border:1px solid #334155;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                            <div>
                                <div style="font-weight:800;color:#fff;">👤 ${o.name} <span style="color:#38bdf8;font-size:0.82rem;">(${o.phone})</span></div>
                                <div style="font-size:0.82rem;color:#cbd5e1;margin-top:2px;">📍 ${o.addr || 'غير محدد'} | 📦 ${o.items}</div>
                                <div style="font-size:0.82rem;color:#fbbf24;font-weight:700;margin-top:2px;">💰 المبلغ: ${Number(o.total || 0).toLocaleString()} د.ع</div>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <button type="button" onclick="ymPrintOrderWaybill(${i})" style="background:#f25011;color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;">🖨️ وصل شحن</button>
                                <button type="button" onclick="ymDeleteOrder(${i})" style="background:#ef4444;color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;">حذف</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div style="color:#94a3b8;text-align:center;padding:20px;">لم يتم تسجيل أي طلبات بعد.</div>';
            }
        }

        window.ymToggleStock = function(idx) {
            var prods = getProdsArray();
            if (!prods[idx]) return;
            prods[idx].outOfStock = !prods[idx].outOfStock;
            saveProdsArray(prods);
        };

        window.ymDeleteProduct = function(idx) {
            if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
            var prods = getProdsArray();
            prods.splice(idx, 1);
            saveProdsArray(prods);
        };

        window.ymEditProduct = function(idx) {
            var prods = getProdsArray();
            var p = prods[idx];
            if (!p) return;
            document.getElementById('admEditIndex').value = idx;
            document.getElementById('admFormTitle').textContent = '✏️ تعديل المنتج: ' + p.name;
            document.getElementById('admPName').value = p.name || '';
            document.getElementById('admPPrice').value = p.price || '';
            document.getElementById('admPOldPrice').value = p.oldPrice || '';
            document.getElementById('admPCat').value = p.category || 'ملازم دراسية';
            document.getElementById('admPColors').value = Array.isArray(p.variants) ? p.variants.join('، ') : '';
            document.getElementById('admPDesc').value = p.desc || '';
            document.getElementById('admPImgUrl').value = p.img || p.image || '';
            document.getElementById('admCancelEditBtn').style.display = 'block';
        };

        document.getElementById('admCancelEditBtn').onclick = function() {
            document.getElementById('admEditIndex').value = '-1';
            document.getElementById('admFormTitle').textContent = '➕ إضافة منتج جديد للمتجر';
            document.getElementById('admPName').value = '';
            document.getElementById('admPPrice').value = '';
            document.getElementById('admPOldPrice').value = '';
            document.getElementById('admPColors').value = '';
            document.getElementById('admPDesc').value = '';
            document.getElementById('admPImgUrl').value = '';
            document.getElementById('admPFile').value = '';
            this.style.display = 'none';
        };

        // ضغط الصورة المرفوعة من الجهاز تلقائياً
        document.getElementById('admPFile').onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var img = new Image();
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var maxW = 550;
                    var scale = Math.min(1, maxW / img.width);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    document.getElementById('admPImgUrl').value = canvas.toDataURL('image/jpeg', 0.78);
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        };

        document.getElementById('admSaveProdBtn').onclick = function() {
            var name = document.getElementById('admPName').value.trim();
            var price = Number(document.getElementById('admPPrice').value || 0);
            if (!name || price <= 0) { alert('يرجى إدخال اسم المنتج والسعر الصحيح'); return; }

            var oldPrice = Number(document.getElementById('admPOldPrice').value || 0);
            var cat = document.getElementById('admPCat').value;
            var colorsRaw = document.getElementById('admPColors').value;
            var variants = colorsRaw.split(/[,،]/).map(function(s) { return s.trim(); }).filter(Boolean);
            var desc = document.getElementById('admPDesc').value.trim();
            var imgUrl = document.getElementById('admPImgUrl').value.trim() || 'assets/images/logo.jpg';

            var prods = getProdsArray();
            var editIdx = parseInt(document.getElementById('admEditIndex').value, 10);

            var prodObj = {
                id: editIdx >= 0 && prods[editIdx] ? prods[editIdx].id : Date.now(),
                name: name,
                price: price,
                oldPrice: oldPrice > price ? oldPrice : null,
                category: cat,
                variants: variants,
                desc: desc,
                img: imgUrl,
                image: imgUrl,
                outOfStock: editIdx >= 0 && prods[editIdx] ? Boolean(prods[editIdx].outOfStock) : false
            };

            if (editIdx >= 0) {
                prods[editIdx] = prodObj;
            } else {
                prods.unshift(prodObj);
            }

            saveProdsArray(prods);
            document.getElementById('admCancelEditBtn').click();
            alert('✅ تم حفظ المنتج بنجاح!');
        };

        document.getElementById('admSearchProds').oninput = renderAdminDashboard;

        // إدارة سجل الطلبات
        document.getElementById('admSaveOrderBtn').onclick = function() {
            var name = document.getElementById('ordCustName').value.trim();
            var phone = document.getElementById('ordCustPhone').value.trim();
            if (!name || !phone) { alert('يرجى إدخال اسم الزبون ورقم هاتفه'); return; }
            var orders = JSON.parse(localStorage.getItem('ym_admin_orders') || '[]');
            orders.unshift({
                name: name,
                phone: phone,
                addr: document.getElementById('ordCustAddr').value.trim(),
                items: document.getElementById('ordItems').value.trim(),
                total: Number(document.getElementById('ordTotal').value || 0),
                date: new Date().toLocaleDateString('ar-IQ')
            });
            localStorage.setItem('ym_admin_orders', JSON.stringify(orders));
            document.getElementById('ordCustName').value = '';
            document.getElementById('ordCustPhone').value = '';
            document.getElementById('ordCustAddr').value = '';
            document.getElementById('ordItems').value = '';
            document.getElementById('ordTotal').value = '';
            renderAdminDashboard();
        };

        window.ymDeleteOrder = function(i) {
            var orders = JSON.parse(localStorage.getItem('ym_admin_orders') || '[]');
            orders.splice(i, 1);
            localStorage.setItem('ym_admin_orders', JSON.stringify(orders));
            renderAdminDashboard();
        };

        window.ymPrintOrderWaybill = function(i) {
            var orders = JSON.parse(localStorage.getItem('ym_admin_orders') || '[]');
            var o = orders[i];
            if (!o) return;
            document.getElementById('wbCustName').value = o.name;
            document.getElementById('wbCustPhone').value = o.phone;
            document.getElementById('wbCustAddr').value = o.addr;
            document.getElementById('wbAmount').value = o.total;
            document.getElementById('btnPrintWaybill').click();
        };

        // التبويبات داخل لوحة الإدارة
        document.querySelectorAll('.ym-tab-btn').forEach(function(btn) {
            btn.onclick = function() {
                document.querySelectorAll('.ym-tab-btn').forEach(function(b) { b.classList.remove('active'); });
                document.querySelectorAll('.ym-tab-content').forEach(function(c) { c.style.display = 'none'; });
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).style.display = 'block';
            };
        });

        // نسخ JSON لتحديث GitHub
        document.getElementById('admCopyJsonBtn').onclick = function() {
            var jsonStr = JSON.stringify(getProdsArray(), null, 2);
            navigator.clipboard.writeText(jsonStr).then(function() {
                alert('✅ تم نسخ كود المنتجات المحدث! الصقه الآن في ملف data/products.json على GitHub ليظهر لجميع الزبائن.');
            });
        };

        // فتح وإغلاق واجهة الإدارة المستقلة
        function openFullAdminPortal() {
            renderAdminDashboard();
            document.getElementById('ymFullAdminPortal').style.display = 'block';
        }
        document.getElementById('admClosePortalBtn').onclick = function() {
            document.getElementById('ymFullAdminPortal').style.display = 'none';
        };

        // ربط زر القفل القديم في أسفل الصفحة ليفتح الواجهة الجديدة مباشرة
        var oldAdminBtn = document.getElementById('adminLoginBtn') || document.querySelector('[id*="adminBtn"], .admin-trigger');
        if (oldAdminBtn) {
            oldAdminBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                var pass = prompt('🔐 أدخل رمز الدخول إلى مركز إدارة مكتبة ياسين المولى:');
                if (pass === ADMIN_PASS) {
                    openFullAdminPortal();
                } else if (pass !== null) {
                    alert('❌ رمز الدخول غير صحيح!');
                }
            };
        }

        // دعم الفتح المباشر عبر الرابط ?admin=1
        if (window.location.search.indexOf('admin=1') !== -1) {
            setTimeout(function() {
                var pass = prompt('🔐 أدخل رمز الدخول إلى مركز إدارة مكتبة ياسين المولى:');
                if (pass === ADMIN_PASS) openFullAdminPortal();
            }, 400);
        }

        // === 7. ربط أدوات الطباعة والإعلانات وتصدير CSV ===
        document.getElementById('btnPrintWaybill').onclick = function() {
            var cName = document.getElementById('wbCustName').value.trim() || 'زبون مكتبة ياسين المولى';
            var cPhone = document.getElementById('wbCustPhone').value.trim() || '---';
            var cAddr = document.getElementById('wbCustAddr').value.trim() || '---';
            var cAmt = Number(document.getElementById('wbAmount').value || 0).toLocaleString();
            var ordNum = 'YM-' + Math.floor(1000 + Math.random() * 9000);
            var w = window.open('', '_blank', 'width=420,height=520');
            w.document.write(`
                <html dir="rtl"><head><title>وصل شحن ${ordNum}</title></head>
                <body style="font-family:Tahoma,sans-serif;padding:20px;border:3px solid #000;margin:10px;">
                    <h2 style="text-align:center;margin:0 0 8px;">مكتبة ياسين المولى</h2>
                    <div style="text-align:center;font-size:13px;border-bottom:2px dashed #000;padding-bottom:8px;">بوليصة شحن وتوصيل رسمية | رقم: <b>${ordNum}</b></div>
                    <p style="font-size:15px;"><b>اسم المستلم:</b> ${cName}</p>
                    <p style="font-size:15px;"><b>رقم الهاتف:</b> ${cPhone}</p>
                    <p style="font-size:15px;"><b>العنوان:</b> ${cAddr}</p>
                    <div style="background:#000;color:#fff;padding:12px;text-align:center;font-size:18px;font-weight:bold;margin-top:14px;">
                        المبلغ المطلوب عند الاستلام: ${cAmt} د.ع
                    </div>
                    <script>window.print();<\/script>
                </body></html>
            `);
            w.document.close();
        };

        document.getElementById('btnGenStoryCard').onclick = function() {
            var pName = document.getElementById('stProdName').value.trim() || 'أحدث الملازم الدراسية';
            var pPrice = document.getElementById('stProdPrice').value.trim() || 'متوفرة الآن';
            var canvas = document.createElement('canvas');
            canvas.width = 540; canvas.height = 960;
            var ctx = canvas.getContext('2d');
            var grad = ctx.createLinearGradient(0, 0, 540, 960);
            grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e3a8a');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 540, 960);
            ctx.fillStyle = '#f25011'; ctx.fillRect(40, 80, 460, 12);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 34px Tahoma'; ctx.textAlign = 'center';
            ctx.fillText('مكتبة ياسين المولى', 270, 150);
            ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 24px Tahoma';
            ctx.fillText('✨ متوفر الآن في المكتبة ✨', 270, 260);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px Tahoma';
            ctx.fillText(pName.slice(0, 28), 270, 440);
            ctx.fillStyle = '#f25011'; ctx.fillRect(110, 520, 320, 80);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 34px Tahoma';
            ctx.fillText(pPrice, 270, 572);
            ctx.fillStyle = '#cbd5e1'; ctx.font = '22px Tahoma';
            ctx.fillText('اطلبها الآن عبر متجرنا الإلكتروني', 270, 760);
            ctx.fillText('توصيل سريع لجميع محافظات العراق 🚚', 270, 810);
            var link = document.createElement('a');
            link.download = 'story-yassin-almawla.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        document.getElementById('btnExportCsv').onclick = function() {
            var prods = getProdsArray();
            var csv = '\uFEFFاسم المنتج,السعر,القسم,الحالة\n';
            prods.forEach(function(p) {
                csv += `"${(p.name||'').replace(/"/g,'""')}",${p.price||0},"${p.category||''}","${p.outOfStock ? 'نافذ' : 'متوفر'}"\n`;
            });
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'جرد-مكتبة-ياسين-المولى.csv';
            a.click();
        };

        // === 8. نوافذ أدوات الزبائن التفاعلية ===
        var custModals = `
        <div id="mTrackOrder" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:440px;border-radius:22px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">📦 متابعة حالة طلبك</h3>
                    <button type="button" onclick="document.getElementById('mTrackOrder').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="background:#f1f5f9;padding:12px;border-radius:12px;text-align:center;margin-bottom:12px;">
                    <div style="font-size:0.82rem;color:#475569;">رقم تتبع الجلسة:</div>
                    <div id="trackCodeDisplay" style="font-size:1.3rem;font-weight:900;color:#f25011;">#YM-2026</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:0.88rem;margin-bottom:14px;">
                    <div style="padding:10px;background:#ecfdf5;border-right:4px solid #10b981;border-radius:8px;">✅ <b>1. استلام الطلب:</b> يتم تأكيد طلبك فور إرساله على الواتساب.</div>
                    <div style="padding:10px;background:#fff7ed;border-right:4px solid #f25011;border-radius:8px;">⚙️ <b>2. التجهيز والتسليك:</b> طباعة وتغليف ملازمك بأعلى دقة.</div>
                    <div style="padding:10px;background:#eff6ff;border-right:4px solid #3b82f6;border-radius:8px;">🚚 <b>3. التوصيل السريع:</b> يصل المندوب لباب بيتك خلال 24-48 ساعة.</div>
                </div>
                <button type="button" id="btnAskOrderStatusWa" style="background:#16a34a;color:#fff;border:none;padding:11px;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;">استفسر عن موقع المندوب عبر واتساب</button>
            </div>
        </div>

        <div id="mPrintCalc" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:450px;border-radius:20px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🖨️ حاسبة استنساخ وطباعة الملازم</h3>
                    <button type="button" onclick="document.getElementById('mPrintCalc').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <label style="font-size:0.88rem;font-weight:700;">عدد صفحات الملف (PDF):</label>
                    <input type="number" id="inPcPages" value="100" min="1" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;font-weight:700;">
                    <label style="font-size:0.88rem;font-weight:700;">نوع الاستنساخ:</label>
                    <select id="inPcType" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                        <option value="75">أبيض وأسود - وجه أو وجهين (75 د.ع للصفحة)</option>
                        <option value="100">ملون - وجه أو وجهين (100 د.ع للصفحة)</option>
                        <option value="250">استنساخ ليزري فاخر (250 د.ع للصفحة)</option>
                    </select>
                    <label style="font-size:0.88rem;font-weight:700;">التغليف والتسليك:</label>
                    <select id="inPcBind" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                        <option value="spiral">سبايرول (2,000 د.ع | ولـ 200 صفحة فما فوق 4,000 د.ع)</option>
                        <option value="1500">كبس حراري (1,500 د.ع)</option>
                        <option value="500">تغليف نايلون (500 د.ع)</option>
                        <option value="0">بدون تغليف</option>
                    </select>
                    <div style="background:#f8fafc;padding:14px;border-radius:12px;border:1px dashed #f25011;text-align:center;">
                        <div style="font-size:0.85rem;color:#475569;">التكلفة الإجمالية:</div>
                        <div id="outPcPrice" style="font-size:1.45rem;font-weight:900;color:#f25011;margin-top:4px;">9,500 د.ع</div>
                        <div id="outPcNote" style="font-size:0.78rem;color:#64748b;margin-top:4px;"></div>
                    </div>
                    <button type="button" id="waPcSend" style="background:#16a34a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;font-size:1rem;">إرسال طلب الطباعة عبر واتساب</button>
                </div>
            </div>
        </div>

        <div id="mSmartBundle" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🎒 مُكوّن الحقيبة المدرسية الذكي</h3>
                    <button type="button" onclick="document.getElementById('mSmartBundle').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <button type="button" class="b-preset" data-n="باقة السادس الإعدادي المتكاملة" data-p="18000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                        <div style="font-weight:800;">🎓 باقة السادس الإعدادي (علمي / أدبي)</div>
                        <div style="font-size:0.82rem;color:#f25011;font-weight:700;">18,000 د.ع (بدلاً من 22,000)</div>
                    </button>
                    <button type="button" class="b-preset" data-n="باقة المرحلة المتوسطة المتكاملة" data-p="14000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                        <div style="font-weight:800;">📚 باقة المرحلة المتوسطة</div>
                        <div style="font-size:0.82rem;color:#f25011;font-weight:700;">14,000 د.ع (بدلاً من 17,000)</div>
                    </button>
                    <button type="button" class="b-preset" data-n="باقة الفنون والرسم الاحترافية" data-p="15000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                        <div style="font-weight:800;">🎨 باقة الفنون والرسم الاحترافية</div>
                        <div style="font-size:0.82rem;color:#f25011;font-weight:700;">15,000 د.ع (بدلاً من 19,000)</div>
                    </button>
                </div>
            </div>
        </div>

        <div id="mGroupOrder" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:480px;border-radius:20px;padding:24px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🤝 الطلب الجماعي (تقسيم التوصيل)</h3>
                    <button type="button" onclick="document.getElementById('mGroupOrder').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
                    <label style="font-size:0.85rem;font-weight:700;">أجرة التوصيل الكلية (د.ع):</label>
                    <input type="number" id="inGoDeliv" value="5000" step="500" style="width:110px;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-weight:700;">
                </div>
                <div id="goRowsContainer" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                    <div class="g-item-row" style="display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;">
                        <input type="text" placeholder="اسم الطالب" class="g-name" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                        <input type="text" placeholder="الملازم المطلوبة" class="g-desc" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                        <input type="number" placeholder="السعر" class="g-cost" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                    </div>
                    <div class="g-item-row" style="display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;">
                        <input type="text" placeholder="اسم الصديق" class="g-name" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                        <input type="text" placeholder="الملازم المطلوبة" class="g-desc" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                        <input type="number" placeholder="السعر" class="g-cost" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                    </div>
                </div>
                <button type="button" id="btnAddGoRow" style="background:#f1f5f9;color:#0f172a;border:1px dashed #94a3b8;padding:8px;border-radius:8px;width:100%;cursor:pointer;font-family:inherit;font-weight:700;margin-bottom:12px;">+ إضافة طالب آخر للمجموعة</button>
                <div id="outGoSummary" style="background:#f8fafc;padding:12px;border-radius:12px;border:1px solid #e2e8f0;font-size:0.85rem;margin-bottom:12px;line-height:1.6;"></div>
                <button type="button" id="waGoSend" style="background:#4f46e5;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">إرسال الفاتورة المقسّمة عبر واتساب</button>
            </div>
        </div>

        <div id="mBulkList" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">📋 اطلب قائمة ملازم كاملة دفعة واحدة</h3>
                    <button type="button" onclick="document.getElementById('mBulkList').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <textarea id="inBulkText" rows="5" placeholder="اكتب أو الصق قائمة الملازم والقرطاسية هنا..." style="width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:12px;font-family:inherit;font-size:0.9rem;margin-bottom:12px;"></textarea>
                <input type="text" id="inBulkGov" placeholder="المحافظة والمنطقة للتوصيل" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;margin-bottom:12px;">
                <button type="button" id="waBulkSend" style="background:#0d9488;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">إرسال القائمة عبر واتساب</button>
            </div>
        </div>

        <div id="mScratchCard" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:420px;border-radius:22px;padding:24px;text-align:center;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="margin:0;font-size:1.15rem;">🎁 بطاقة حظ مكتبة ياسين المولى</h3>
                    <button type="button" onclick="document.getElementById('mScratchCard').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <p style="font-size:0.85rem;color:#475569;margin-top:0;">امسح البطاقة الفضية أدناه بإصبعك أو بالماوس لكشف هديتك:</p>
                <div style="position:relative;width:300px;height:140px;margin:16px auto;border-radius:16px;overflow:hidden;border:2px dashed #f25011;background:#fffbeb;display:flex;align-items:center;justify-content:center;">
                    <div id="outPrize" style="font-weight:900;font-size:1.1rem;color:#be123c;padding:10px;"></div>
                    <canvas id="cvScratch" width="300" height="140" style="position:absolute;inset:0;cursor:pointer;touch-action:none;"></canvas>
                </div>
                <button type="button" id="waPrizeSend" style="display:none;background:#16a34a;color:#fff;border:none;padding:12px 20px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">تفعيل الهدية عبر واتساب</button>
            </div>
        </div>

        <div id="mChecklist" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:22px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">✅ كاشف نواقص الحقيبة المدرسية</h3>
                    <button type="button" onclick="document.getElementById('mChecklist').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <p style="font-size:0.85rem;color:#475569;margin-top:0;">ضع علامة (✓) على الأغراض <b>المتوفرة عندك حالياً</b>:</p>
                <div id="boxChecklist" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="دفاتر سلك 100 ورقة"> دفاتر سلك 100 ورقة</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="طقم أقلام جاف"> طقم أقلام جاف (أزرق / أسود / أحمر)</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="أقلام تحديد فسفورية"> أقلام تحديد فسفورية للمراجعة</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="دفتر ملاحظات صغير"> دفتر ملاحظات صغير للقوانين</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="ملفات شفافة وحافظة أوراق"> ملفات شفافة وحافظة أوراق</label>
                </div>
                <button type="button" id="waMissingSend" style="background:#0369a1;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">اطلب النواقص غير المحددة عبر واتساب</button>
            </div>
        </div>

        <div id="mSpecialReq" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:440px;border-radius:20px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🔍 اطلب ملزمة أو كتاباً غير متوفر</h3>
                    <button type="button" onclick="document.getElementById('mSpecialReq').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <input type="text" id="inSrBook" placeholder="اسم الملزمة أو الكتاب" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                    <input type="text" id="inSrTeacher" placeholder="اسم الأستاذ أو دار النشر + الصف" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                    <button type="button" id="waSrSend" style="background:#0f172a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">إرسال الطلب عبر واتساب</button>
                </div>
            </div>
        </div>

        <div id="mStudyTimer" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:9999;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#0f172a;color:#fff;width:100%;max-width:400px;border-radius:24px;padding:26px;text-align:center;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 style="margin:0;font-size:1.1rem;color:#38bdf8;">⏱️ مؤقت المذاكرة الذكي</h3>
                    <button type="button" onclick="document.getElementById('mStudyTimer').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:#94a3b8;">✖</button>
                </div>
                <div id="outTimer" style="font-size:3.5rem;font-weight:900;font-family:monospace;margin:16px 0;color:#f25011;background:rgba(255,255,255,0.05);padding:16px;border-radius:18px;">25:00</div>
                <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">
                    <button type="button" id="t25" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;">25 دقيقة</button>
                    <button type="button" id="t50" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;">50 دقيقة</button>
                    <button type="button" id="t5" style="background:#1e293b;color:#38bdf8;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;">استراحة 5 د</button>
                </div>
                <div style="display:flex;gap:10px;">
                    <button type="button" id="tStart" style="flex:1;background:#16a34a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">▶ ابدأ</button>
                    <button type="button" id="tPause" style="flex:1;background:#f25011;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">⏸ إيقاف</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', custModals);

        function getWa() {
            var a = document.querySelector('a[href*="wa.me/"]');
            if (a) { var m = a.href.match(/wa\.me\/(\d+)/); if (m) return m[1]; }
            return '9647700000000';
        }

        document.getElementById('btnTrackOrder').onclick = function() {
            var code = localStorage.getItem('ym_last_order') || ('#YM-' + Math.floor(1000 + Math.random() * 9000));
            localStorage.setItem('ym_last_order', code);
            document.getElementById('trackCodeDisplay').textContent = code;
            document.getElementById('mTrackOrder').style.display = 'flex';
        };
        document.getElementById('btnAskOrderStatusWa').onclick = function() {
            window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، أرغب بالاستفسار عن حالة طلبي رقم: ' + document.getElementById('trackCodeDisplay').textContent), '_blank');
        };

        function calcPrint() {
            var p = Math.max(1, parseInt(document.getElementById('inPcPages').value || '1', 10));
            var r = parseInt(document.getElementById('inPcType').value || '75', 10);
            var b = document.getElementById('inPcBind').value;
            var bc = b === 'spiral' ? (p >= 200 ? 4000 : 2000) : parseInt(b || '0', 10);
            var tot = (p * r) + bc;
            document.getElementById('outPcPrice').textContent = tot.toLocaleString() + ' د.ع';
            document.getElementById('outPcNote').textContent = b === 'spiral'
                ? (p >= 200 ? '(شامل سبايرول 200 صفحة فما فوق: 4,000 د.ع)' : '(شامل سبايرول قياسي: 2,000 د.ع)')
                : (bc > 0 ? '(شامل التغليف: ' + bc.toLocaleString() + ' د.ع)' : '(بدون تغليف)');
            return { p: p, tot: tot };
        }
        document.getElementById('btnPrintCalc').onclick = function() { calcPrint(); document.getElementById('mPrintCalc').style.display = 'flex'; };
        document.getElementById('inPcPages').oninput = calcPrint;
        document.getElementById('inPcType').onchange = calcPrint;
        document.getElementById('inPcBind').onchange = calcPrint;
        document.getElementById('waPcSend').onclick = function() {
            var res = calcPrint();
            window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، طلب استنساخ PDF:\n- الصفحات: ' + res.p + '\n- النوع: ' + document.getElementById('inPcType').selectedOptions[0].text + '\n- الإجمالي: ' + res.tot.toLocaleString() + ' د.ع'), '_blank');
        };

        document.getElementById('btnSmartBundle').onclick = function() { document.getElementById('mSmartBundle').style.display = 'flex'; };
        document.querySelectorAll('.b-preset').forEach(function(btn) {
            btn.onclick = function() {
                window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، أرغب بطلب:\n🎒 ' + btn.dataset.n + '\n💰 السعر: ' + Number(btn.dataset.p).toLocaleString() + ' د.ع'), '_blank');
            };
        });

        document.getElementById('btnGroupOrder').onclick = function() { document.getElementById('mGroupOrder').style.display = 'flex'; };
        document.getElementById('btnAddGoRow').onclick = function() {
            document.getElementById('goRowsContainer').insertAdjacentHTML('beforeend', '<div class="g-item-row" style="display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;"><input type="text" placeholder="اسم الطالب" class="g-name" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"><input type="text" placeholder="الملازم" class="g-desc" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"><input type="number" placeholder="السعر" class="g-cost" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"></div>');
        };
        function calcGo() {
            var rows = Array.from(document.querySelectorAll('.g-item-row'));
            var d = parseInt(document.getElementById('inGoDeliv').value || '0', 10);
            var act = rows.map(function(r, i) {
                return { n: r.querySelector('.g-name').value.trim() || ('طالب ' + (i+1)), desc: r.querySelector('.g-desc').value.trim(), c: parseInt(r.querySelector('.g-cost').value || '0', 10) };
            }).filter(function(x) { return x.desc || x.c > 0; });
            var box = document.getElementById('outGoSummary');
            if (!act.length) { box.innerHTML = 'أدخل بيانات الطلاب أعلاه لحساب حصة كل طالب.'; return ''; }
            var sh = Math.round(d / act.length), tot = d;
            var lines = ['حصة التوصيل لكل طالب: ' + sh.toLocaleString() + ' د.ع'];
            act.forEach(function(m) { tot += m.c; lines.push('• ' + m.n + ' (' + m.desc + '): ' + (m.c + sh).toLocaleString() + ' د.ع'); });
            lines.push('الإجمالي الكلي: ' + tot.toLocaleString() + ' د.ع');
            box.innerHTML = lines.join('<br>');
            return 'مرحباً مكتبة ياسين المولى، طلب جماعي مقسّم:\n' + lines.join('\n');
        }
        document.getElementById('mGroupOrder').addEventListener('input', calcGo);
        document.getElementById('waGoSend').onclick = function() { var t = calcGo(); if (t) window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent(t), '_blank'); };

        document.getElementById('btnBulkList').onclick = function() { document.getElementById('mBulkList').style.display = 'flex'; };
        document.getElementById('waBulkSend').onclick = function() {
            var txt = document.getElementById('inBulkText').value.trim(); if (!txt) return;
            window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، أرغب بتجهيز هذه القائمة:\n' + txt + '\n📍 العنوان: ' + document.getElementById('inBulkGov').value), '_blank');
        };

        document.getElementById('btnScratchCard').onclick = function() {
            var prizes = ['🎉 كبس حراري مجاني لملزمتك! (YASSIN-BIND)', '🔥 خصم 10% على طلبك! (STUDENT10)', '🎁 تغليف سبايرول مجاني! (SPIRAL-FREE)'];
            document.getElementById('outPrize').textContent = prizes[Math.floor(Math.random() * prizes.length)];
            document.getElementById('waPrizeSend').style.display = 'none';
            document.getElementById('mScratchCard').style.display = 'flex';
            var c = document.getElementById('cvScratch'), ctx = c.getContext('2d');
            ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#94a3b8'; ctx.fillRect(0,0,300,140);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✨ امسح هنا لكشف هديتك ✨', 150, 75);
            var dr = false, cnt = 0;
            function sc(x, y) { ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI*2); ctx.fill(); if (++cnt > 12) document.getElementById('waPrizeSend').style.display = 'block'; }
            c.onmousedown = function() { dr = true; }; c.onmouseup = function() { dr = false; };
            c.onmousemove = function(e) { if (dr) { var r = c.getBoundingClientRect(); sc(e.clientX - r.left, e.clientY - r.top); } };
            c.ontouchmove = function(e) { e.preventDefault(); var r = c.getBoundingClientRect(); sc(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); };
        };
        document.getElementById('waPrizeSend').onclick = function() {
            window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، ربحت هدية من بطاقة الحظ: ' + document.getElementById('outPrize').textContent), '_blank');
        };

        document.getElementById('btnChecklist').onclick = function() { document.getElementById('mChecklist').style.display = 'flex'; };
        document.getElementById('waMissingSend').onclick = function() {
            var miss = Array.from(document.querySelectorAll('#boxChecklist input:not(:checked)')).map(function(i) { return '• ' + i.value; });
            if (!miss.length) { alert('جميع المستلزمات متوفرة لديك!'); return; }
            window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، هذه النواقص التي أحتاجها:\n' + miss.join('\n')), '_blank');
        };

        document.getElementById('btnSpecialReq').onclick = function() { document.getElementById('mSpecialReq').style.display = 'flex'; };
        document.getElementById('waSrSend').onclick = function() {
            var b = document.getElementById('inSrBook').value.trim(); if (!b) return;
            window.open('https://wa.me/' + getWa() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، أطلب توفير: ' + b + ' - ' + document.getElementById('inSrTeacher').value), '_blank');
        };

        var sec = 1500, iv = null;
        function renderT() { var m = Math.floor(sec/60), s = sec%60; document.getElementById('outTimer').textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s; }
        document.getElementById('btnStudyTimer').onclick = function() { document.getElementById('mStudyTimer').style.display = 'flex'; };
        document.getElementById('t25').onclick = function() { clearInterval(iv); iv=null; sec=1500; renderT(); };
        document.getElementById('t50').onclick = function() { clearInterval(iv); iv=null; sec=3000; renderT(); };
        document.getElementById('t5').onclick = function() { clearInterval(iv); iv=null; sec=300; renderT(); };
        document.getElementById('tStart').onclick = function() { if (!iv) iv = setInterval(function() { if (sec>0) { sec--; renderT(); } else { clearInterval(iv); iv=null; alert('انتهى الوقت!'); } }, 1000); };
        document.getElementById('tPause').onclick = function() { clearInterval(iv); iv=null; };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYassinPlatform);
    } else {
        initYassinPlatform();
    }
})();