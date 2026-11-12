(function() {
    window.addEventListener('load', function() {
        try {
            // === 1. حقن شريط الأدوات الحصرية ===
            var mainContainer = document.querySelector('main') || document.body;
            if (!document.getElementById('yassinExclusiveHub')) {
                var hub = document.createElement('section');
                hub.id = 'yassinExclusiveHub';
                hub.style.cssText = 'max-width:1200px;margin:18px auto;padding:0 16px;';
                hub.innerHTML = `
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;">
                        <div id="openBundleModalBtn" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(15,23,42,0.18);transition:0.2s;">
                            <div style="background:#f25011;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🎒</div>
                            <div>
                                <div style="font-weight:800;font-size:1.05rem;">مُكوّن الحقيبة الذكي</div>
                                <div style="font-size:0.82rem;opacity:0.85;">جهّز مستلزمات مرحلتك بخصم 10%</div>
                            </div>
                        </div>

                        <div id="openPrintCalcBtn" style="background:linear-gradient(135deg,#f25011,#c2410c);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(242,80,17,0.22);transition:0.2s;">
                            <div style="background:#0f172a;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🖨️</div>
                            <div>
                                <div style="font-weight:800;font-size:1.05rem;">حاسبة الاستنساخ والطباعة</div>
                                <div style="font-size:0.82rem;opacity:0.9;">احسب سعر طباعة ملازمك PDF فوراً</div>
                            </div>
                        </div>

                        <div id="openSpecialReqBtn" style="background:linear-gradient(135deg,#065f46,#047857);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(6,95,70,0.2);transition:0.2s;">
                            <div style="background:#fbbf24;color:#0f172a;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🔍</div>
                            <div>
                                <div style="font-weight:800;font-size:1.05rem;">اطلب ملزمة أو كتاب خاص</div>
                                <div style="font-size:0.82rem;opacity:0.9;">لم تجد ملزمة أستاذك؟ نوفّرها لك فوراً</div>
                            </div>
                        </div>
                    </div>
                `;
                var firstSection = mainContainer.querySelector('section, .products-grid, #productsContainer');
                if (firstSection) {
                    mainContainer.insertBefore(hub, firstSection);
                } else {
                    mainContainer.prepend(hub);
                }
            }

            // === 2. نوافذ المزايا التفاعلية بأسعار مكتبة ياسين المولى المعتمدة ===
            var modalsHtml = `
            <!-- نافذة حاسبة الاستنساخ والطباعة -->
            <div id="printCalcModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:3500;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;">🖨️ حاسبة استنساخ وطباعة الملازم</h3>
                        <button type="button" onclick="document.getElementById('printCalcModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <label style="font-size:0.88rem;font-weight:700;">عدد صفحات الملف (PDF):</label>
                        <input type="number" id="pcPages" value="100" min="1" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;font-weight:700;">

                        <label style="font-size:0.88rem;font-weight:700;">نوع الاستنساخ:</label>
                        <select id="pcType" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                            <option value="75">أبيض وأسود - وجه أو وجهين (75 د.ع للصفحة)</option>
                            <option value="100">ملون - وجه أو وجهين (100 د.ع للصفحة)</option>
                            <option value="250">استنساخ ليزري فاخر (250 د.ع للصفحة)</option>
                        </select>

                        <label style="font-size:0.88rem;font-weight:700;">التغليف والتسليك:</label>
                        <select id="pcBind" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                            <option value="spiral">سبايرول (2,000 د.ع | ولـ 200 صفحة فما فوق 4,000 د.ع)</option>
                            <option value="1500">كبس حراري (1,500 د.ع)</option>
                            <option value="500">تغليف نايلون (500 د.ع)</option>
                            <option value="0">بدون تغليف (أوراق فقط)</option>
                        </select>

                        <div style="background:#f8fafc;padding:14px;border-radius:12px;border:1px dashed #f25011;text-align:center;">
                            <div style="font-size:0.85rem;color:#475569;">التكلفة الإجمالية للطباعة والتغليف:</div>
                            <div id="pcResultPrice" style="font-size:1.45rem;font-weight:900;color:#f25011;margin-top:4px;">9,500 د.ع</div>
                            <div id="pcBindNote" style="font-size:0.78rem;color:#64748b;margin-top:4px;">(شامل سبايرول قياسي 2,000 د.ع)</div>
                        </div>

                        <button type="button" id="sendPrintOrderWa" style="background:#16a34a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;font-size:1rem;">
                            إرسال طلب الطباعة والملف عبر واتساب
                        </button>
                    </div>
                </div>
            </div>

            <!-- نافذة مُكوّن الحقيبة الذكي -->
            <div id="bundleModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:3500;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;">🎒 مُكوّن الحقيبة المدرسية الذكي</h3>
                        <button type="button" onclick="document.getElementById('bundleModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <p style="font-size:0.88rem;color:#475569;margin-top:0;">اختر مرحلتك الدراسية وسنجهز لك باقة متكاملة بخصم خاص:</p>
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <button type="button" class="bundle-preset-btn" data-name="باقة السادس الإعدادي المتكاملة (دفاتر سلك + أقلام تحديد + ملحقات وزارية)" data-price="18000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                            <div style="font-weight:800;color:#0f172a;">🎓 باقة السادس الإعدادي (علمي / أدبي)</div>
                            <div style="font-size:0.82rem;color:#f25011;font-weight:700;">السعر بعد الخصم: 18,000 د.ع (بدلاً من 22,000)</div>
                        </button>
                        <button type="button" class="bundle-preset-btn" data-name="باقة المرحلة المتوسطة (6 دفاتر فاخرة + طقم أقلام جاف ورصاص + هندسة)" data-price="14000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                            <div style="font-weight:800;color:#0f172a;">📚 باقة المرحلة المتوسطة</div>
                            <div style="font-size:0.82rem;color:#f25011;font-weight:700;">السعر بعد الخصم: 14,000 د.ع (بدلاً من 17,000)</div>
                        </button>
                        <button type="button" class="bundle-preset-btn" data-name="باقة الرسام الصغير (ألوان مائية + كراسة رسم + أقلام تخطيط)" data-price="15000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                            <div style="font-weight:800;color:#0f172a;">🎨 باقة الفنون والرسم الاحترافية</div>
                            <div style="font-size:0.82rem;color:#f25011;font-weight:700;">السعر بعد الخصم: 15,000 د.ع (بدلاً من 19,000)</div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- نافذة طلب ملزمة أو كتاب خاص -->
            <div id="specialReqModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:3500;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:440px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;">🔍 اطلب ملزمة أو كتاباً غير متوفر</h3>
                        <button type="button" onclick="document.getElementById('specialReqModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <input type="text" id="srBookName" placeholder="اسم الملزمة أو الكتاب (مثال: ملزمة الكيمياء)" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                        <input type="text" id="srTeacher" placeholder="اسم الأستاذ أو دار النشر + الصف" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                        <button type="button" id="sendSpecialReqWa" style="background:#0f172a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">
                            إرسال الطلب للمكتبة عبر واتساب
                        </button>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalsHtml);

            // ربط الأزرار والعمليات الحسابية
            document.getElementById('openPrintCalcBtn').onclick = function() { updatePrintPrice(); document.getElementById('printCalcModal').style.display = 'flex'; };
            document.getElementById('openBundleModalBtn').onclick = function() { document.getElementById('bundleModal').style.display = 'flex'; };
            document.getElementById('openSpecialReqBtn').onclick = function() { document.getElementById('specialReqModal').style.display = 'flex'; };

            function updatePrintPrice() {
                var pages = parseInt(document.getElementById('pcPages').value || '1', 10);
                if (pages < 1) pages = 1;
                var rate = parseInt(document.getElementById('pcType').value || '75', 10);
                var bindVal = document.getElementById('pcBind').value;
                var bindCost = 0;
                var noteText = '';

                if (bindVal === 'spiral') {
                    if (pages >= 200) {
                        bindCost = 4000;
                        noteText = '(شامل سبايرول حجم كبير لـ 200 صفحة فما فوق: 4,000 د.ع)';
                    } else {
                        bindCost = 2000;
                        noteText = '(شامل سبايرول قياسي: 2,000 د.ع)';
                    }
                } else {
                    bindCost = parseInt(bindVal || '0', 10);
                    noteText = bindCost > 0 ? '(شامل التغليف: ' + bindCost.toLocaleString() + ' د.ع)' : '(بدون تغليف)';
                }

                var total = (pages * rate) + bindCost;
                document.getElementById('pcResultPrice').textContent = total.toLocaleString() + ' د.ع';
                document.getElementById('pcBindNote').textContent = noteText;
                return { pages: pages, total: total, bindCost: bindCost };
            }

            document.getElementById('pcPages').oninput = updatePrintPrice;
            document.getElementById('pcType').onchange = updatePrintPrice;
            document.getElementById('pcBind').onchange = updatePrintPrice;

            function getStoreWaNumber() {
                var waLink = document.querySelector('a[href*="wa.me/"]');
                if (waLink) {
                    var m = waLink.href.match(/wa\.me\/(\d+)/);
                    if (m) return m[1];
                }
                return '9647700000000';
            }

            document.getElementById('sendPrintOrderWa').onclick = function() {
                var info = updatePrintPrice();
                var typeTxt = document.getElementById('pcType').selectedOptions[0].text;
                var bindSel = document.getElementById('pcBind').value;
                var bindLabel = bindSel === 'spiral' ? ('سبايرول (' + info.bindCost.toLocaleString() + ' د.ع)') : document.getElementById('pcBind').selectedOptions[0].text;
                var msg = 'مرحباً مكتبة ياسين المولى، أرغب بطلب طباعة واستنساخ ملف PDF:\n' +
                          '- عدد الصفحات: ' + info.pages + ' صفحة\n' +
                          '- نوع الاستنساخ: ' + typeTxt + '\n' +
                          '- التغليف: ' + bindLabel + '\n' +
                          '- التكلفة الإجمالية المحسوبة: ' + info.total.toLocaleString() + ' د.ع\n' +
                          '(سأقوم بإرسال ملف الـ PDF هنا الآن)';
                window.open('https://wa.me/' + getStoreWaNumber() + '?text=' + encodeURIComponent(msg), '_blank');
            };

            document.querySelectorAll('.bundle-preset-btn').forEach(function(btn) {
                btn.onclick = function() {
                    var bName = btn.getAttribute('data-name');
                    var bPrice = btn.getAttribute('data-price');
                    var msg = 'مرحباً مكتبة ياسين المولى، أرغب بطلب الباقة الذكية المخفضة:\n' +
                              '🎒 ' + bName + '\n' +
                              '💰 السعر: ' + Number(bPrice).toLocaleString() + ' د.ع';
                    window.open('https://wa.me/' + getStoreWaNumber() + '?text=' + encodeURIComponent(msg), '_blank');
                };
            });

            document.getElementById('sendSpecialReqWa').onclick = function() {
                var book = document.getElementById('srBookName').value.trim();
                var teacher = document.getElementById('srTeacher').value.trim();
                if (!book) { alert('يرجى كتابة اسم الملزمة أو الكتاب أولاً'); return; }
                var msg = 'مرحباً مكتبة ياسين المولى، أبحث عن توفير طلب خاص:\n' +
                          '📘 المطلوب: ' + book + '\n' +
                          '👨‍🏫 الأستاذ / التفاصيل: ' + (teacher || 'غير محدد');
                window.open('https://wa.me/' + getStoreWaNumber() + '?text=' + encodeURIComponent(msg), '_blank');
            };

            updatePrintPrice();
        } catch(e) {
            console.error('Pro features error:', e);
        }
    });
})();

(function() {
    window.addEventListener('load', function() {
        try {
            var hub = document.getElementById('yassinExclusiveHub');
            if (!hub) return;

            var grid = hub.querySelector('div');
            if (grid && !document.getElementById('openGroupOrderBtn')) {
                grid.insertAdjacentHTML('beforeend', `
                    <div id="openGroupOrderBtn" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(79,70,229,0.25);transition:0.2s;">
                        <div style="background:#fbbf24;color:#0f172a;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🤝</div>
                        <div>
                            <div style="font-weight:800;font-size:1.05rem;">اطلب وية جماعتك (قسّم التوصيل)</div>
                            <div style="font-size:0.82rem;opacity:0.9;">اجمع طلبات صفك بفاتورة مقسّمة تلقائياً</div>
                        </div>
                    </div>

                    <div id="openBulkListBtn" style="background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(13,148,136,0.25);transition:0.2s;">
                        <div style="background:#fff;color:#0f766e;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">📋</div>
                        <div>
                            <div style="font-weight:800;font-size:1.05rem;">اطلب قائمة ملازم دفعة واحدة</div>
                            <div style="font-size:0.82rem;opacity:0.9;">اكتب أو الصق قائمة المدرس ونجهزها فوراً</div>
                        </div>
                    </div>
                `);
            }

            var superModals = `
            <!-- نافذة الطلب الجماعي وتقسيم التوصيل -->
            <div id="groupOrderModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:3600;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:480px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);max-height:90vh;overflow-y:auto;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;">🤝 الطلب الجماعي (تقسيم الفاتورة والتوصيل)</h3>
                        <button type="button" onclick="document.getElementById('groupOrderModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <p style="font-size:0.85rem;color:#475569;margin-top:0;">أضف طلبك وطلبات أصدقائك، وسيحسب النظام حصة كل طالب مع تقسيم أجرة التوصيل بالتساوي:</p>
                    
                    <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
                        <label style="font-size:0.85rem;font-weight:700;">أجرة التوصيل الكلية (د.ع):</label>
                        <input type="number" id="goDeliveryFee" value="5000" step="500" style="width:110px;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-weight:700;">
                    </div>

                    <div id="goMembersList" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                        <div class="go-row" style="display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;">
                            <input type="text" placeholder="اسم الطالب" class="go-student" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                            <input type="text" placeholder="الملازم المطلوبة" class="go-items" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                            <input type="number" placeholder="السعر" class="go-price" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                        </div>
                        <div class="go-row" style="display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;">
                            <input type="text" placeholder="اسم الصديق" class="go-student" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                            <input type="text" placeholder="الملازم المطلوبة" class="go-items" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                            <input type="number" placeholder="السعر" class="go-price" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">
                        </div>
                    </div>

                    <button type="button" id="addGoMemberBtn" style="background:#f1f5f9;color:#0f172a;border:1px dashed #94a3b8;padding:8px;border-radius:8px;width:100%;cursor:pointer;font-family:inherit;font-weight:700;margin-bottom:12px;">+ إضافة طالب آخر للمجموعة</button>

                    <div id="goSummaryBox" style="background:#f8fafc;padding:12px;border-radius:12px;border:1px solid #e2e8f0;font-size:0.85rem;margin-bottom:12px;line-height:1.6;"></div>

                    <button type="button" id="sendGroupOrderWa" style="background:#4f46e5;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">
                        إرسال الفاتورة المقسّمة للمكتبة عبر واتساب
                    </button>
                </div>
            </div>

            <!-- نافذة طلب قائمة ملازم دفعة واحدة -->
            <div id="bulkListModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:3600;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;">📋 اطلب قائمة ملازم كاملة دفعة واحدة</h3>
                        <button type="button" onclick="document.getElementById('bulkListModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <p style="font-size:0.85rem;color:#475569;margin-top:0;">الصق قائمة الملازم والقرطاسية التي طلبها المدرس (كل مادة في سطر) وسنجهزها لك كاملة مع حساب الإجمالي:</p>
                    <textarea id="bulkListText" rows="5" placeholder="مثال:&#10;1- ملزمة الفيزياء أ. مؤيد سليم&#10;2- ملزمة الكيمياء أ. هاشم الغرباوي&#10;3- 4 دفاتر سلك 100 ورقة&#10;4- قلم تحديد فسفوري" style="width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:12px;font-family:inherit;font-size:0.9rem;margin-bottom:12px;"></textarea>
                    <input type="text" id="bulkListGov" placeholder="المحافظة والمنطقة للتوصيل" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;margin-bottom:12px;">
                    <button type="button" id="sendBulkListWa" style="background:#0d9488;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">
                        إرسال القائمة لتجهيزها فوراً عبر واتساب
                    </button>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', superModals);

            function getWaNum() {
                var waLink = document.querySelector('a[href*="wa.me/"]');
                if (waLink) {
                    var m = waLink.href.match(/wa\.me\/(\d+)/);
                    if (m) return m[1];
                }
                return '9647700000000';
            }

            document.getElementById('openGroupOrderBtn').onclick = function() {
                calcGroupSplit();
                document.getElementById('groupOrderModal').style.display = 'flex';
            };
            document.getElementById('openBulkListBtn').onclick = function() {
                document.getElementById('bulkListModal').style.display = 'flex';
            };

            document.getElementById('addGoMemberBtn').onclick = function() {
                var row = document.createElement('div');
                row.className = 'go-row';
                row.style.cssText = 'display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;';
                row.innerHTML = '<input type="text" placeholder="اسم الطالب" class="go-student" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"><input type="text" placeholder="الملازم" class="go-items" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"><input type="number" placeholder="السعر" class="go-price" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;">';
                document.getElementById('goMembersList').appendChild(row);
            };

            function calcGroupSplit() {
                var rows = Array.from(document.querySelectorAll('.go-row'));
                var deliv = parseInt(document.getElementById('goDeliveryFee').value || '0', 10);
                var activeMembers = [];
                rows.forEach(function(r, i) {
                    var name = r.querySelector('.go-student').value.trim() || ('طالب ' + (i + 1));
                    var items = r.querySelector('.go-items').value.trim();
                    var price = parseInt(r.querySelector('.go-price').value || '0', 10);
                    if (items || price > 0) activeMembers.push({ name: name, items: items, price: price });
                });

                var box = document.getElementById('goSummaryBox');
                if (!activeMembers.length) {
                    box.innerHTML = 'اكتب أسماء الطلاب وأسعار ملازمهم أعلاه ليتم حساب حصة كل طالب تلقائياً.';
                    return '';
                }

                var share = Math.round(deliv / activeMembers.length);
                var grandTotal = deliv;
                var htmlLines = ['<b>📊 ملخص تقسيم الفاتورة (حصة التوصيل لكل طالب: ' + share.toLocaleString() + ' د.ع):</b>'];
                var waLines = ['مرحباً مكتبة ياسين المولى، لدينا طلب جماعي مقسّم:'];

                activeMembers.forEach(function(m) {
                    var studentTotal = m.price + share;
                    grandTotal += m.price;
                    htmlLines.push('• <b>' + m.name + '</b> (' + (m.items || 'ملازم') + '): يدفع <b>' + studentTotal.toLocaleString() + ' د.ع</b>');
                    waLines.push('👤 ' + m.name + ': ' + (m.items || 'ملازم') + ' -> المجموع مع حصته من التوصيل: ' + studentTotal.toLocaleString() + ' د.ع');
                });

                htmlLines.push('<div style="margin-top:6px;padding-top:6px;border-top:1px dashed #cbd5e1;color:#4f46e5;font-weight:800;">الإجمالي الكلي للطلب: ' + grandTotal.toLocaleString() + ' د.ع</div>');
                waLines.push('💰 الإجمالي الكلي للفاتورة (شامل التوصيل): ' + grandTotal.toLocaleString() + ' د.ع');
                box.innerHTML = htmlLines.join('<br>');
                return waLines.join('\n');
            }

            document.getElementById('groupOrderModal').addEventListener('input', calcGroupSplit);

            document.getElementById('sendGroupOrderWa').onclick = function() {
                var text = calcGroupSplit();
                if (!text) { alert('يرجى إدخال بيانات طالب واحد على الأقل'); return; }
                window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent(text), '_blank');
            };

            document.getElementById('sendBulkListWa').onclick = function() {
                var list = document.getElementById('bulkListText').value.trim();
                var gov = document.getElementById('bulkListGov').value.trim();
                if (!list) { alert('يرجى كتابة أو لصق قائمة الملازم أولاً'); return; }
                var msg = 'مرحباً مكتبة ياسين المولى، أرغب بتجهيز هذه القائمة كاملة:\n\n' + list + '\n\n📍 العنوان: ' + (gov || 'غير محدد');
                window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent(msg), '_blank');
            };
        } catch(e) {
            console.error('Super features error:', e);
        }
    });
})();

(function() {
    window.addEventListener('load', function() {
        try {
            var hub = document.getElementById('yassinExclusiveHub');
            if (!hub) return;

            var grid = hub.querySelector('div');
            if (grid && !document.getElementById('openScratchCardBtn')) {
                grid.insertAdjacentHTML('beforeend', `
                    <div id="openScratchCardBtn" style="background:linear-gradient(135deg,#be123c,#e11d48);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(225,29,72,0.28);transition:0.2s;">
                        <div style="background:#fde047;color:#0f172a;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🎁</div>
                        <div>
                            <div style="font-weight:800;font-size:1.05rem;">امسح واربح هديتك الآن</div>
                            <div style="font-size:0.82rem;opacity:0.9;">بطاقة حظ فورية لكل طالب يزور المكتبة</div>
                        </div>
                    </div>

                    <div id="openChecklistBtn" style="background:linear-gradient(135deg,#0369a1,#0284c7);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(2,132,199,0.25);transition:0.2s;">
                        <div style="background:#fff;color:#0369a1;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">✅</div>
                        <div>
                            <div style="font-weight:800;font-size:1.05rem;">كاشف نواقص الحقيبة المدرسية</div>
                            <div style="font-size:0.82rem;opacity:0.9;">حدد ما لديك وسنستخرج نواقصك تلقائياً</div>
                        </div>
                    </div>
                `);
            }

            // شريط تحفيزي + عداد تنازلي للامتحانات أعلى الأدوات
            if (!document.getElementById('studentMotivationBanner')) {
                var quotes = [
                    "💡 نصيحة اليوم: تقسيم المادة إلى أجزاء صغيرة مع ملزمة مرتبة يختصر نصف وقت المراجعة!",
                    "🔥 تذكّر: كل ساعة دراسة اليوم تقرّبك خطوة من الكلية التي تحلم بها!",
                    "📚 التنظيم نصف النجاح: جهّز دفاترك وأقلامك الملونة لتثبيت المعلومات بصرياً."
                ];
                var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                var banner = document.createElement('div');
                banner.id = 'studentMotivationBanner';
                banner.style.cssText = 'background:linear-gradient(90deg,#0f172a,#1e293b);color:#f8fafc;padding:12px 18px;border-radius:14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-right:4px solid #f25011;font-size:0.88rem;';
                banner.innerHTML = '<div>' + randomQuote + '</div><div style="background:#f25011;color:#fff;padding:4px 12px;border-radius:8px;font-weight:800;font-size:0.8rem;">موسم التفوق 2026 - 2027</div>';
                hub.prepend(banner);
            }

            var wowModals = `
            <!-- نافذة بطاقة الخدش التفاعلية -->
            <div id="scratchModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:3700;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:420px;border-radius:22px;padding:24px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.4);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:1.15rem;">🎁 بطاقة حظ طلاب مكتبة ياسين المولى</h3>
                        <button type="button" onclick="document.getElementById('scratchModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <p style="font-size:0.85rem;color:#475569;margin-top:0;">امسح البطاقة الفضية أدناه بإصبعك أو بالماوس لكشف هديتك الفورية:</p>
                    
                    <div style="position:relative;width:300px;height:140px;margin:16px auto;border-radius:16px;overflow:hidden;border:2px dashed #f25011;background:#fffbeb;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <div id="prizeText" style="font-weight:900;font-size:1.15rem;color:#be123c;padding:10px;">🎉 كبس حراري مجاني لملزمتك!<br><span style="font-size:0.85rem;color:#0f172a;">الكود: YASSIN-FREE</span></div>
                        <canvas id="scratchCanvas" width="300" height="140" style="position:absolute;inset:0;cursor:pointer;touch-action:none;"></canvas>
                    </div>

                    <button type="button" id="claimPrizeWaBtn" style="display:none;background:#16a34a;color:#fff;border:none;padding:12px 20px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;margin-top:10px;">
                        تفعيل الهدية وإرسالها للواتساب الآن
                    </button>
                </div>
            </div>

            <!-- نافذة كاشف نواقص الحقيبة -->
            <div id="checklistModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:3700;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:22px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.4);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;">✅ كاشف نواقص الحقيبة المدرسية</h3>
                        <button type="button" onclick="document.getElementById('checklistModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                    </div>
                    <p style="font-size:0.85rem;color:#475569;margin-top:0;">ضع علامة (✓) على الأغراض <b>المتوفرة عندك حالياً</b>، وسنرسل النواقص فقط للمكتبة:</p>
                    <div id="checklistItems" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;max-height:240px;overflow-y:auto;">
                        <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="دفاتر سلك 100 ورقة"> دفاتر سلك 100 ورقة (مجموعة مواد)</label>
                        <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="أقلام جاف أزرق وأسود وأحمر"> طقم أقلام جاف (أزرق / أسود / أحمر)</label>
                        <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="أقلام تحديد فسفورية (Highlighter)"> أقلام تحديد فسفورية للمراجعة</label>
                        <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="دفتر ملاحظات صغير (نوت بوك)"> دفتر ملاحظات صغير للقوانين والتعاريف</label>
                        <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="حافظة أوراق وملفات شفافة"> حافظة أوراق وملفات شفافة للملازم</label>
                        <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="أدوات هندسة ومسطرة"> أدوات هندسة ومسطرة وممحاة</label>
                    </div>
                    <button type="button" id="sendMissingItemsWa" style="background:#0369a1;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">
                        اطلب النواقص غير المحددة عبر واتساب
                    </button>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', wowModals);

            function getWaNumber() {
                var waLink = document.querySelector('a[href*="wa.me/"]');
                if (waLink) {
                    var m = waLink.href.match(/wa\.me\/(\d+)/);
                    if (m) return m[1];
                }
                return '9647700000000';
            }

            // منطق بطاقة الخدش
            var prizes = [
                '🎉 كبس حراري مجاني لملزمتك!<br><span style="font-size:0.85rem;color:#0f172a;">الكود: YASSIN-BIND</span>',
                '🔥 خصم 10% على طلبك القادم!<br><span style="font-size:0.85rem;color:#0f172a;">الكود: STUDENT10</span>',
                '🎁 تغليف سبايرول مجاني!<br><span style="font-size:0.85rem;color:#0f172a;">الكود: SPIRAL-FREE</span>',
                '🚚 تخفيض 2,000 د.ع على التوصيل!<br><span style="font-size:0.85rem;color:#0f172a;">الكود: FAST2000</span>'
            ];

            document.getElementById('openScratchCardBtn').onclick = function() {
                var chosen = prizes[Math.floor(Math.random() * prizes.length)];
                document.getElementById('prizeText').innerHTML = chosen;
                document.getElementById('claimPrizeWaBtn').style.display = 'none';
                document.getElementById('scratchModal').style.display = 'flex';

                var canvas = document.getElementById('scratchCanvas');
                var ctx = canvas.getContext('2d');
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 18px Cairo, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✨ امسح هنا لكشف هديتك ✨', 150, 75);

                var isDrawing = false;
                var scratchCount = 0;

                function scratch(x, y) {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();
                    ctx.arc(x, y, 22, 0, Math.PI * 2);
                    ctx.fill();
                    scratchCount++;
                    if (scratchCount > 15) {
                        document.getElementById('claimPrizeWaBtn').style.display = 'block';
                    }
                }

                canvas.onmousedown = function() { isDrawing = true; };
                canvas.onmouseup = function() { isDrawing = false; };
                canvas.onmousemove = function(e) {
                    if (!isDrawing) return;
                    var rect = canvas.getBoundingClientRect();
                    scratch(e.clientX - rect.left, e.clientY - rect.top);
                };
                canvas.ontouchmove = function(e) {
                    e.preventDefault();
                    var rect = canvas.getBoundingClientRect();
                    var touch = e.touches[0];
                    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
                };
            };

            document.getElementById('claimPrizeWaBtn').onclick = function() {
                var prizePlain = document.getElementById('prizeText').innerText.replace(/\n/g, ' - ');
                var msg = 'مرحباً مكتبة ياسين المولى، ربحت هذه الهدية من بطاقة الحظ في موقعكم وأرغب باستخدامها في طلبي:\n🎁 ' + prizePlain;
                window.open('https://wa.me/' + getWaNumber() + '?text=' + encodeURIComponent(msg), '_blank');
            };

            // منطق كاشف النواقص
            document.getElementById('openChecklistBtn').onclick = function() {
                document.getElementById('checklistModal').style.display = 'flex';
            };

            document.getElementById('sendMissingItemsWa').onclick = function() {
                var boxes = Array.from(document.querySelectorAll('#checklistItems input[type="checkbox"]'));
                var missing = boxes.filter(function(b) { return !b.checked; }).map(function(b) { return '• ' + b.value; });
                if (!missing.length) {
                    alert('رائع! جميع المستلزمات الأساسية متوفرة لديك.');
                    return;
                }
                var msg = 'مرحباً مكتبة ياسين المولى، استخدمت كاشف النواقص في موقعكم وهذه المستلزمات التي تنقصني:\n\n' + missing.join('\n') + '\n\nيرجى تزويدي بالسعر الإجمالي مع التوصيل.';
                window.open('https://wa.me/' + getWaNumber() + '?text=' + encodeURIComponent(msg), '_blank');
            };

        } catch(e) {
            console.error('Wow features error:', e);
        }
    });
})();

(function() {
    window.addEventListener('load', function() {
        try {
            var hub = document.getElementById('yassinExclusiveHub');
            if (!hub) return;

            var grid = hub.querySelector('div');
            if (grid && !document.getElementById('openStudyTimerBtn')) {
                grid.insertAdjacentHTML('beforeend', `
                    <div id="openStudyTimerBtn" style="background:linear-gradient(135deg,#1e293b,#334155);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(30,41,59,0.25);border:1px solid rgba(255,255,255,0.1);transition:0.2s;">
                        <div style="background:#38bdf8;color:#0f172a;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">⏱️</div>
                        <div>
                            <div style="font-weight:800;font-size:1.05rem;">مؤقت الدراسة والتركيز الذكي</div>
                            <div style="font-size:0.82rem;opacity:0.9;">ادرس بنظام البومودورو مع منبه الاستراحة</div>
                        </div>
                    </div>
                `);
            }

            var timerModalHtml = `
            <div id="studyTimerModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:3800;align-items:center;justify-content:center;padding:16px;">
                <div style="background:#0f172a;color:#fff;width:100%;max-width:400px;border-radius:24px;padding:26px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.12);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                        <h3 style="margin:0;font-size:1.1rem;color:#38bdf8;">⏱️ مؤقت المذاكرة (مكتبة ياسين المولى)</h3>
                        <button type="button" onclick="document.getElementById('studyTimerModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:#94a3b8;">✖</button>
                    </div>
                    <p id="timerModeLabel" style="font-size:0.85rem;color:#cbd5e1;margin-top:0;">وقت التركيز والدراسة العميقة 🎯</p>
                    <div id="timerDisplay" style="font-size:3.5rem;font-weight:900;font-family:monospace;letter-spacing:2px;margin:16px 0;color:#f25011;background:rgba(255,255,255,0.05);padding:16px;border-radius:18px;">25:00</div>
                    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">
                        <button type="button" id="setFocus25" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.82rem;">دراسة 25 د</button>
                        <button type="button" id="setFocus50" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.82rem;">دراسة 50 د</button>
                        <button type="button" id="setBreak5" style="background:#1e293b;color:#38bdf8;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:0.82rem;">استراحة 5 د</button>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <button type="button" id="startTimerBtn" style="flex:1;background:#16a34a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;font-size:1rem;">▶ ابدأ الآن</button>
                        <button type="button" id="pauseTimerBtn" style="flex:1;background:#f25011;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;font-size:1rem;">⏸ إيقاف مؤقت</button>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', timerModalHtml);

            var timerSeconds = 25 * 60;
            var timerInterval = null;

            function renderTimer() {
                var m = Math.floor(timerSeconds / 60);
                var s = timerSeconds % 60;
                document.getElementById('timerDisplay').textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
            }

            document.getElementById('openStudyTimerBtn').onclick = function() {
                document.getElementById('studyTimerModal').style.display = 'flex';
            };
            document.getElementById('setFocus25').onclick = function() {
                clearInterval(timerInterval); timerInterval = null; timerSeconds = 25 * 60;
                document.getElementById('timerModeLabel').textContent = 'وقت التركيز والدراسة العميقة (25 دقيقة) 🎯';
                renderTimer();
            };
            document.getElementById('setFocus50').onclick = function() {
                clearInterval(timerInterval); timerInterval = null; timerSeconds = 50 * 60;
                document.getElementById('timerModeLabel').textContent = 'جلسة مذاكرة مكثفة (50 دقيقة) 🔥';
                renderTimer();
            };
            document.getElementById('setBreak5').onclick = function() {
                clearInterval(timerInterval); timerInterval = null; timerSeconds = 5 * 60;
                document.getElementById('timerModeLabel').textContent = 'وقت الاستراحة وتجديد النشاط ☕';
                renderTimer();
            };
            document.getElementById('startTimerBtn').onclick = function() {
                if (timerInterval) return;
                timerInterval = setInterval(function() {
                    if (timerSeconds > 0) {
                        timerSeconds--;
                        renderTimer();
                    } else {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        alert('🔔 انتهى الوقت! أحسنت صنعاً يا بطل.');
                    }
                }, 1000);
            };
            document.getElementById('pauseTimerBtn').onclick = function() {
                clearInterval(timerInterval);
                timerInterval = null;
            };
        } catch(e) {
            console.error('Study timer error:', e);
        }
    });
})();

(function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./sw.js').catch(function(err) {
                console.log('SW registration note:', err);
            });
        });
    }

    var deferredPrompt;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;

        var hub = document.getElementById('yassinExclusiveHub');
        var grid = hub ? hub.querySelector('div') : null;
        if (grid && !document.getElementById('installPwaAppBtn')) {
            grid.insertAdjacentHTML('beforeend', `
                <div id="installPwaAppBtn" style="background:linear-gradient(135deg,#f25011,#ea580c);color:#fff;padding:18px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:14px;box-shadow:0 8px 20px rgba(242,80,17,0.3);border:2px solid #fde047;transition:0.2s;">
                    <div style="background:#fff;color:#f25011;width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">📲</div>
                    <div>
                        <div style="font-weight:800;font-size:1.05rem;">ثبّت تطبيق المكتبة على هاتفك</div>
                        <div style="font-size:0.82rem;opacity:0.95;">افتح المكتبة كـ تطبيق سريع بضغطة واحدة</div>
                    </div>
                </div>
            `);

            document.getElementById('installPwaAppBtn').onclick = function() {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(function(choiceResult) {
                        if (choiceResult.outcome === 'accepted') {
                            document.getElementById('installPwaAppBtn').style.display = 'none';
                        }
                        deferredPrompt = null;
                    });
                }
            };
        }
    });
})();
