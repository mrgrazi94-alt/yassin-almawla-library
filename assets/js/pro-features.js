(function() {
    function initYassinSuperHub() {
        if (document.getElementById('yassinExclusiveHub')) return;

        var targetAnchor = document.querySelector('.products-section, #productsGrid, main section:nth-of-type(2)') || document.querySelector('main');
        if (!targetAnchor) return;

        var hub = document.createElement('section');
        hub.id = 'yassinExclusiveHub';
        hub.style.cssText = 'max-width:1240px;margin:24px auto;padding:0 16px;direction:rtl;';
        hub.innerHTML = `
            <div style="background:linear-gradient(90deg,#0f172a,#1e293b);color:#f8fafc;padding:12px 18px;border-radius:14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-right:4px solid #f25011;font-size:0.9rem;">
                <div>💡 <b>نصيحة التفوق:</b> نظّم ملازمك ودفاترك مبكراً لتختصر نصف وقت المراجعة في الامتحانات!</div>
                <div style="background:#f25011;color:#fff;padding:4px 12px;border-radius:8px;font-weight:800;font-size:0.8rem;">خدمات مكتبة ياسين المولى الحصرية</div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;">
                <div id="openPrintCalcBtn" style="background:linear-gradient(135deg,#f25011,#c2410c);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(242,80,17,0.22);">
                    <div style="background:#0f172a;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🖨️</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">حاسبة الاستنساخ والطباعة</div>
                        <div style="font-size:0.8rem;opacity:0.92;">احسب سعر طباعة PDF والتسليك فوراً</div>
                    </div>
                </div>

                <div id="openBundleModalBtn" style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(15,23,42,0.2);">
                    <div style="background:#f25011;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🎒</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">مُكوّن الحقيبة الذكي</div>
                        <div style="font-size:0.8rem;opacity:0.9;">باقات جاهزة لمرحلتك بخصم خاص</div>
                    </div>
                </div>

                <div id="openGroupOrderBtn" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(79,70,229,0.22);">
                    <div style="background:#fbbf24;color:#0f172a;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🤝</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">اطلب وية جماعتك</div>
                        <div style="font-size:0.8rem;opacity:0.9;">قسّم الفاتورة والتوصيل بين أصدقائك</div>
                    </div>
                </div>

                <div id="openBulkListBtn" style="background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(13,148,136,0.22);">
                    <div style="background:#fff;color:#0f766e;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">📋</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">اطلب قائمة ملازم كاملة</div>
                        <div style="font-size:0.8rem;opacity:0.9;">الصق قائمة المدرس ونجهزها دفعة واحدة</div>
                    </div>
                </div>

                <div id="openScratchCardBtn" style="background:linear-gradient(135deg,#be123c,#e11d48);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(225,29,72,0.25);">
                    <div style="background:#fde047;color:#0f172a;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🎁</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">امسح واربح هديتك</div>
                        <div style="font-size:0.8rem;opacity:0.9;">بطاقة حظ فورية لكل طالب يزور المتجر</div>
                    </div>
                </div>

                <div id="openChecklistBtn" style="background:linear-gradient(135deg,#0369a1,#0284c7);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(2,132,199,0.22);">
                    <div style="background:#fff;color:#0369a1;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">✅</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">كاشف نواقص الحقيبة</div>
                        <div style="font-size:0.8rem;opacity:0.9;">حدد ما لديك وسنستخرج نواقصك</div>
                    </div>
                </div>

                <div id="openSpecialReqBtn" style="background:linear-gradient(135deg,#065f46,#047857);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(6,95,70,0.22);">
                    <div style="background:#fbbf24;color:#0f172a;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🔍</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">اطلب ملزمة غير موجودة</div>
                        <div style="font-size:0.8rem;opacity:0.9;">اكتب اسم الملزمة والأستاذ ونوفّرها لك</div>
                    </div>
                </div>

                <div id="openStudyTimerBtn" style="background:linear-gradient(135deg,#1e293b,#334155);color:#fff;padding:16px;border-radius:16px;cursor:pointer;display:flex;align-items:center;gap:12px;box-shadow:0 8px 18px rgba(30,41,59,0.22);">
                    <div style="background:#38bdf8;color:#0f172a;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">⏱️</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;">مؤقت الدراسة والتركيز</div>
                        <div style="font-size:0.8rem;opacity:0.9;">ادرس بنظام البومودورو مع منبه الاستراحة</div>
                    </div>
                </div>
            </div>
        `;

        if (targetAnchor.tagName.toLowerCase() === 'main') {
            targetAnchor.prepend(hub);
        } else {
            targetAnchor.parentNode.insertBefore(hub, targetAnchor);
        }

        // النوافذ التفاعلية لجميع الأدوات
        var modalsHtml = `
        <!-- حاسبة الاستنساخ -->
        <div id="printCalcModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:450px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
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
                        <div style="font-size:0.85rem;color:#475569;">التكلفة الإجمالية:</div>
                        <div id="pcResultPrice" style="font-size:1.45rem;font-weight:900;color:#f25011;margin-top:4px;">9,500 د.ع</div>
                        <div id="pcBindNote" style="font-size:0.78rem;color:#64748b;margin-top:4px;"></div>
                    </div>
                    <button type="button" id="sendPrintOrderWa" style="background:#16a34a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;font-size:1rem;">إرسال طلب الطباعة عبر واتساب</button>
                </div>
            </div>
        </div>

        <!-- مكون الحقيبة -->
        <div id="bundleModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🎒 مُكوّن الحقيبة المدرسية الذكي</h3>
                    <button type="button" onclick="document.getElementById('bundleModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <button type="button" class="bundle-preset-btn" data-name="باقة السادس الإعدادي المتكاملة (دفاتر سلك + أقلام تحديد + ملحقات وزارية)" data-price="18000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                        <div style="font-weight:800;">🎓 باقة السادس الإعدادي (علمي / أدبي)</div>
                        <div style="font-size:0.82rem;color:#f25011;font-weight:700;">18,000 د.ع (بدلاً من 22,000)</div>
                    </button>
                    <button type="button" class="bundle-preset-btn" data-name="باقة المرحلة المتوسطة (6 دفاتر فاخرة + طقم أقلام + هندسة)" data-price="14000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                        <div style="font-weight:800;">📚 باقة المرحلة المتوسطة</div>
                        <div style="font-size:0.82rem;color:#f25011;font-weight:700;">14,000 د.ع (بدلاً من 17,000)</div>
                    </button>
                    <button type="button" class="bundle-preset-btn" data-name="باقة الفنون والرسم الاحترافية (ألوان مائية + كراسة رسم + أقلام تخطيط)" data-price="15000" style="padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;text-align:right;cursor:pointer;font-family:inherit;">
                        <div style="font-weight:800;">🎨 باقة الفنون والرسم الاحترافية</div>
                        <div style="font-size:0.82rem;color:#f25011;font-weight:700;">15,000 د.ع (بدلاً من 19,000)</div>
                    </button>
                </div>
            </div>
        </div>

        <!-- الطلب الجماعي -->
        <div id="groupOrderModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:480px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🤝 الطلب الجماعي (تقسيم التوصيل)</h3>
                    <button type="button" onclick="document.getElementById('groupOrderModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
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
                <button type="button" id="sendGroupOrderWa" style="background:#4f46e5;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">إرسال الفاتورة المقسّمة عبر واتساب</button>
            </div>
        </div>

        <!-- طلب قائمة كاملة -->
        <div id="bulkListModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">📋 اطلب قائمة ملازم كاملة دفعة واحدة</h3>
                    <button type="button" onclick="document.getElementById('bulkListModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <textarea id="bulkListText" rows="5" placeholder="اكتب أو الصق قائمة الملازم والقرطاسية هنا..." style="width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:12px;font-family:inherit;font-size:0.9rem;margin-bottom:12px;"></textarea>
                <input type="text" id="bulkListGov" placeholder="المحافظة والمنطقة للتوصيل" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;margin-bottom:12px;">
                <button type="button" id="sendBulkListWa" style="background:#0d9488;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">إرسال القائمة لتجهيزها عبر واتساب</button>
            </div>
        </div>

        <!-- بطاقة الخدش -->
        <div id="scratchModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:420px;border-radius:22px;padding:24px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.4);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="margin:0;font-size:1.15rem;">🎁 بطاقة حظ طلاب مكتبة ياسين المولى</h3>
                    <button type="button" onclick="document.getElementById('scratchModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <p style="font-size:0.85rem;color:#475569;margin-top:0;">امسح البطاقة الفضية أدناه بإصبعك أو بالماوس لكشف هديتك:</p>
                <div style="position:relative;width:300px;height:140px;margin:16px auto;border-radius:16px;overflow:hidden;border:2px dashed #f25011;background:#fffbeb;display:flex;align-items:center;justify-content:center;">
                    <div id="prizeText" style="font-weight:900;font-size:1.1rem;color:#be123c;padding:10px;"></div>
                    <canvas id="scratchCanvas" width="300" height="140" style="position:absolute;inset:0;cursor:pointer;touch-action:none;"></canvas>
                </div>
                <button type="button" id="claimPrizeWaBtn" style="display:none;background:#16a34a;color:#fff;border:none;padding:12px 20px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">تفعيل الهدية عبر واتساب</button>
            </div>
        </div>

        <!-- كاشف النواقص -->
        <div id="checklistModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:460px;border-radius:22px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.4);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">✅ كاشف نواقص الحقيبة المدرسية</h3>
                    <button type="button" onclick="document.getElementById('checklistModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <p style="font-size:0.85rem;color:#475569;margin-top:0;">ضع علامة (✓) على الأغراض <b>المتوفرة عندك حالياً</b>، وسنطلب النواقص فقط:</p>
                <div id="checklistItems" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="دفاتر سلك 100 ورقة"> دفاتر سلك 100 ورقة</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="طقم أقلام جاف"> طقم أقلام جاف (أزرق / أسود / أحمر)</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="أقلام تحديد فسفورية"> أقلام تحديد فسفورية للمراجعة</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="دفتر ملاحظات صغير"> دفتر ملاحظات صغير للقوانين</label>
                    <label style="display:flex;align-items:center;gap:10px;padding:8px;background:#f8fafc;border-radius:8px;cursor:pointer;"><input type="checkbox" value="ملفات شفافة وحافظة أوراق"> ملفات شفافة وحافظة أوراق</label>
                </div>
                <button type="button" id="sendMissingItemsWa" style="background:#0369a1;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;font-size:1rem;">اطلب النواقص غير المحددة عبر واتساب</button>
            </div>
        </div>

        <!-- طلب خاص -->
        <div id="specialReqModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#fff;color:#0f172a;width:100%;max-width:440px;border-radius:20px;padding:24px;box-shadow:0 25px 50px rgba(0,0,0,0.35);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">
                    <h3 style="margin:0;font-size:1.15rem;">🔍 اطلب ملزمة أو كتاباً غير متوفر</h3>
                    <button type="button" onclick="document.getElementById('specialReqModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;">✖</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <input type="text" id="srBookName" placeholder="اسم الملزمة أو الكتاب" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                    <input type="text" id="srTeacher" placeholder="اسم الأستاذ أو دار النشر + الصف" style="padding:10px;border:1px solid #cbd5e1;border-radius:10px;font-family:inherit;">
                    <button type="button" id="sendSpecialReqWa" style="background:#0f172a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">إرسال الطلب للمكتبة عبر واتساب</button>
                </div>
            </div>
        </div>

        <!-- مؤقت الدراسة -->
        <div id="studyTimerModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:4000;align-items:center;justify-content:center;padding:16px;">
            <div style="background:#0f172a;color:#fff;width:100%;max-width:400px;border-radius:24px;padding:26px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 style="margin:0;font-size:1.1rem;color:#38bdf8;">⏱️ مؤقت المذاكرة الذكي</h3>
                    <button type="button" onclick="document.getElementById('studyTimerModal').style.display='none'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:#94a3b8;">✖</button>
                </div>
                <div id="timerDisplay" style="font-size:3.5rem;font-weight:900;font-family:monospace;margin:16px 0;color:#f25011;background:rgba(255,255,255,0.05);padding:16px;border-radius:18px;">25:00</div>
                <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">
                    <button type="button" id="setFocus25" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;">25 دقيقة</button>
                    <button type="button" id="setFocus50" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;">50 دقيقة</button>
                    <button type="button" id="setBreak5" style="background:#1e293b;color:#38bdf8;border:1px solid #334155;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit;">استراحة 5 د</button>
                </div>
                <div style="display:flex;gap:10px;">
                    <button type="button" id="startTimerBtn" style="flex:1;background:#16a34a;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">▶ ابدأ</button>
                    <button type="button" id="pauseTimerBtn" style="flex:1;background:#f25011;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:inherit;">⏸ إيقاف</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalsHtml);

        function getWaNum() {
            var waLink = document.querySelector('a[href*="wa.me/"]');
            if (waLink) {
                var m = waLink.href.match(/wa\.me\/(\d+)/);
                if (m) return m[1];
            }
            return '9647700000000';
        }

        // ربط الأحداث
        function updatePrintPrice() {
            var pages = Math.max(1, parseInt(document.getElementById('pcPages').value || '1', 10));
            var rate = parseInt(document.getElementById('pcType').value || '75', 10);
            var bindVal = document.getElementById('pcBind').value;
            var bindCost = bindVal === 'spiral' ? (pages >= 200 ? 4000 : 2000) : parseInt(bindVal || '0', 10);
            var total = (pages * rate) + bindCost;
            document.getElementById('pcResultPrice').textContent = total.toLocaleString() + ' د.ع';
            document.getElementById('pcBindNote').textContent = bindVal === 'spiral'
                ? (pages >= 200 ? '(شامل سبايرول 200 صفحة فما فوق: 4,000 د.ع)' : '(شامل سبايرول قياسي: 2,000 د.ع)')
                : (bindCost > 0 ? '(شامل التغليف: ' + bindCost.toLocaleString() + ' د.ع)' : '(بدون تغليف)');
            return { pages: pages, total: total, bindCost: bindCost };
        }

        document.getElementById('openPrintCalcBtn').onclick = function() { updatePrintPrice(); document.getElementById('printCalcModal').style.display = 'flex'; };
        document.getElementById('pcPages').oninput = updatePrintPrice;
        document.getElementById('pcType').onchange = updatePrintPrice;
        document.getElementById('pcBind').onchange = updatePrintPrice;
        document.getElementById('sendPrintOrderWa').onclick = function() {
            var info = updatePrintPrice();
            var msg = 'مرحباً مكتبة ياسين المولى، طلب استنساخ PDF:\n- الصفحات: ' + info.pages + '\n- النوع: ' + document.getElementById('pcType').selectedOptions[0].text + '\n- الإجمالي: ' + info.total.toLocaleString() + ' د.ع';
            window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent(msg), '_blank');
        };

        document.getElementById('openBundleModalBtn').onclick = function() { document.getElementById('bundleModal').style.display = 'flex'; };
        document.querySelectorAll('.bundle-preset-btn').forEach(function(b) {
            b.onclick = function() {
                var msg = 'مرحباً مكتبة ياسين المولى، أرغب بطلب:\n🎒 ' + b.dataset.name + '\n💰 السعر: ' + Number(b.dataset.price).toLocaleString() + ' د.ع';
                window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent(msg), '_blank');
            };
        });

        document.getElementById('openGroupOrderBtn').onclick = function() { document.getElementById('groupOrderModal').style.display = 'flex'; };
        document.getElementById('addGoMemberBtn').onclick = function() {
            document.getElementById('goMembersList').insertAdjacentHTML('beforeend', '<div class="go-row" style="display:grid;grid-template-columns:1fr 1.3fr 90px;gap:6px;"><input type="text" placeholder="اسم الطالب" class="go-student" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"><input type="text" placeholder="الملازم" class="go-items" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"><input type="number" placeholder="السعر" class="go-price" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:0.85rem;"></div>');
        };
        function calcGroup() {
            var rows = Array.from(document.querySelectorAll('.go-row'));
            var deliv = parseInt(document.getElementById('goDeliveryFee').value || '0', 10);
            var active = rows.map(function(r, i) {
                return { name: r.querySelector('.go-student').value.trim() || ('طالب ' + (i+1)), items: r.querySelector('.go-items').value.trim(), price: parseInt(r.querySelector('.go-price').value || '0', 10) };
            }).filter(function(m) { return m.items || m.price > 0; });
            var box = document.getElementById('goSummaryBox');
            if (!active.length) { box.innerHTML = 'أدخل بيانات الطلاب أعلاه لحساب حصة كل طالب.'; return ''; }
            var share = Math.round(deliv / active.length);
            var total = deliv;
            var lines = ['حصة التوصيل لكل طالب: ' + share.toLocaleString() + ' د.ع'];
            active.forEach(function(m) { total += m.price; lines.push('• ' + m.name + ' (' + m.items + '): ' + (m.price + share).toLocaleString() + ' د.ع'); });
            lines.push('الإجمالي الكلي: ' + total.toLocaleString() + ' د.ع');
            box.innerHTML = lines.join('<br>');
            return 'مرحباً مكتبة ياسين المولى، طلب جماعي مقسّم:\n' + lines.join('\n');
        }
        document.getElementById('groupOrderModal').addEventListener('input', calcGroup);
        document.getElementById('sendGroupOrderWa').onclick = function() {
            var t = calcGroup(); if (t) window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent(t), '_blank');
        };

        document.getElementById('openBulkListBtn').onclick = function() { document.getElementById('bulkListModal').style.display = 'flex'; };
        document.getElementById('sendBulkListWa').onclick = function() {
            var txt = document.getElementById('bulkListText').value.trim();
            if (!txt) return;
            var msg = 'مرحباً مكتبة ياسين المولى، أرغب بتجهيز هذه القائمة:\n' + txt + '\n📍 العنوان: ' + document.getElementById('bulkListGov').value;
            window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent(msg), '_blank');
        };

        document.getElementById('openScratchCardBtn').onclick = function() {
            var prizes = ['🎉 كبس حراري مجاني لملزمتك! (YASSIN-BIND)', '🔥 خصم 10% على طلبك! (STUDENT10)', '🎁 تغليف سبايرول مجاني! (SPIRAL-FREE)'];
            document.getElementById('prizeText').textContent = prizes[Math.floor(Math.random() * prizes.length)];
            document.getElementById('claimPrizeWaBtn').style.display = 'none';
            document.getElementById('scratchModal').style.display = 'flex';
            var c = document.getElementById('scratchCanvas'), ctx = c.getContext('2d');
            ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#94a3b8'; ctx.fillRect(0,0,300,140);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✨ امسح هنا لكشف هديتك ✨', 150, 75);
            var draw = false, cnt = 0;
            function scratch(x, y) { ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI*2); ctx.fill(); if (++cnt > 12) document.getElementById('claimPrizeWaBtn').style.display = 'block'; }
            c.onmousedown = function() { draw = true; }; c.onmouseup = function() { draw = false; };
            c.onmousemove = function(e) { if (draw) { var r = c.getBoundingClientRect(); scratch(e.clientX - r.left, e.clientY - r.top); } };
            c.ontouchmove = function(e) { e.preventDefault(); var r = c.getBoundingClientRect(); scratch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); };
        };
        document.getElementById('claimPrizeWaBtn').onclick = function() {
            window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، ربحت هدية من بطاقة الحظ: ' + document.getElementById('prizeText').textContent), '_blank');
        };

        document.getElementById('openChecklistBtn').onclick = function() { document.getElementById('checklistModal').style.display = 'flex'; };
        document.getElementById('sendMissingItemsWa').onclick = function() {
            var miss = Array.from(document.querySelectorAll('#checklistItems input:not(:checked)')).map(function(i) { return '• ' + i.value; });
            if (!miss.length) { alert('جميع المستلزمات متوفرة لديك!'); return; }
            window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، هذه النواقص التي أحتاجها:\n' + miss.join('\n')), '_blank');
        };

        document.getElementById('openSpecialReqBtn').onclick = function() { document.getElementById('specialReqModal').style.display = 'flex'; };
        document.getElementById('sendSpecialReqWa').onclick = function() {
            var b = document.getElementById('srBookName').value.trim();
            if (!b) return;
            window.open('https://wa.me/' + getWaNum() + '?text=' + encodeURIComponent('مرحباً مكتبة ياسين المولى، أطلب توفير: ' + b + ' - ' + document.getElementById('srTeacher').value), '_blank');
        };

        var tSec = 1500, tInt = null;
        function updT() { var m = Math.floor(tSec/60), s = tSec%60; document.getElementById('timerDisplay').textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s; }
        document.getElementById('openStudyTimerBtn').onclick = function() { document.getElementById('studyTimerModal').style.display = 'flex'; };
        document.getElementById('setFocus25').onclick = function() { clearInterval(tInt); tInt=null; tSec=1500; updT(); };
        document.getElementById('setFocus50').onclick = function() { clearInterval(tInt); tInt=null; tSec=3000; updT(); };
        document.getElementById('setBreak5').onclick = function() { clearInterval(tInt); tInt=null; tSec=300; updT(); };
        document.getElementById('startTimerBtn').onclick = function() { if (!tInt) tInt = setInterval(function() { if (tSec>0) { tSec--; updT(); } else { clearInterval(tInt); tInt=null; alert('انتهى الوقت!'); } }, 1000); };
        document.getElementById('pauseTimerBtn').onclick = function() { clearInterval(tInt); tInt=null; };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYassinSuperHub);
    } else {
        initYassinSuperHub();
    }
})();
