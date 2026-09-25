import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// تابع کمکی برای دریافت پیام‌ها از ساب‌کالکشن notifications کاربر
async function fetchUserMessages(userId) {
    try {
        let notifSnap = await getDocs(collection(db, "users", userId, "notifications"));
        let msgs = [];
        notifSnap.forEach(docSnap => {
            let data = docSnap.data();
            msgs.push({
                id: docSnap.id,
                subject: data.title || data.subject || 'Announcement',
                body: data.message || data.text || data.body || '',
                time: data.createdAt || data.timestamp || data.time || new Date().toISOString(),
                read: data.read === true || data.isRead === true
            });
        });
        return msgs;
    } catch (e) {
        console.error("Error fetching messages:", e);
        return [];
    }
}

// اتصال توابع مدال به window در بالاترین سطح جهت اجرا در همه حالات
window.openMessageModal = async () => {
    let c = document.getElementById('modal-msg-container'), t = ld[currLang] || ld.fa;
    
    if (currentUserId) {
        allMessages = await fetchUserMessages(currentUserId);
        let unread = allMessages.filter(m => !m.read).length;
        let b = document.getElementById('bell-badge');
        if (b) {
            if (unread > 0) { b.textContent = unread; b.classList.add('show'); }
            else { b.textContent = '0'; b.classList.remove('show'); }
        }
    }

    if (allMessages.length > 0) {
        renderMessageList();
    } else {
        c.innerHTML = `<div style="text-align:center;padding:20px;color:#94a3b8">${t.noMsg}</div>`;
    }
    const m = document.getElementById('m-msg'); if (m) m.classList.add('show');
};

function renderMessageList() {
    let c = document.getElementById('modal-msg-container');
    let html = '<div style="display:flex;flex-direction:column;gap:10px;">';
    allMessages.forEach((m, idx) => {
        let dTime = '';
        if (m.time) {
            let d = (typeof m.time.toDate === 'function') ? m.time.toDate() : new Date(m.time);
            dTime = isNaN(d.getTime()) ? String(m.time) : d.toUTCString();
        }
        let isUnread = !m.read;
        html += `<div class="msg-body-box" style="cursor:pointer;border-right: ${isUnread ? '3px solid #38bdf8' : '1px solid rgba(255,255,255,.08)'};" onclick="window.readAdminMessage(${idx})">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div class="msg-title-text" style="${isUnread ? 'color:#fff;font-weight:800;' : ''}"><i class="fas fa-envelope${isUnread ? '' : '-open'}-text" style="color:#38bdf8;margin-left:5px;"></i> ${m.subject || 'Announcement'}</div>
                ${isUnread ? '<span style="font-size:9px;background:#38bdf8;color:#0f172a;padding:2px 6px;border-radius:4px;font-weight:700;">جدید</span>' : ''}
            </div>
            <div class="msg-desc-text" style="margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${m.body || ''}</div>
            <div style="font-size:10px;color:#64748b;margin-top:6px;text-align:left" dir="ltr">${dTime}</div>
        </div>`;
    });
    html += '</div>';
    c.innerHTML = html;
}

window.readAdminMessage = async (idx) => {
    let m = allMessages[idx];
    if (!m) return;
    
    if (!m.read && currentUserId && m.id) {
        allMessages[idx].read = true;
        try {
            await updateDoc(doc(db, "users", currentUserId, "notifications", m.id), { 
                read: true, 
                isRead: true 
            });
            let unreadCount = allMessages.filter(item => !item.read).length;
            let b = document.getElementById('bell-badge');
            if (b) {
                if (unreadCount > 0) {
                    b.textContent = unreadCount;
                    b.classList.add('show');
                } else {
                    b.textContent = '0';
                    b.classList.remove('show');
                }
            }
        } catch (e) { console.error(e); }
    }

    let c = document.getElementById('modal-msg-container'), t = ld[currLang] || ld.fa;
    let dTime = '';
    if (m.time) {
        let d = (typeof m.time.toDate === 'function') ? m.time.toDate() : new Date(m.time);
        dTime = isNaN(d.getTime()) ? String(m.time) : d.toUTCString();
    }
    c.innerHTML = `
        <button onclick="window.openMessageModal()" style="background:none;border:none;color:#38bdf8;cursor:pointer;font-size:12px;margin-bottom:12px;display:flex;align-items:center;gap:5px;padding:0;"><i class="fas fa-arrow-right"></i> بازگشت به لیست پیام‌ها</button>
        <div class="msg-body-box" style="padding:16px;">
            <div class="msg-title-text" style="font-size:15px;margin-bottom:8px;"><i class="fas fa-envelope-open-text" style="color:#38bdf8;"></i> ${m.subject || 'Announcement'}</div>
            <div class="msg-desc-text" style="font-size:13px;line-height:1.8;color:#f8fafc;white-space:pre-wrap;">${m.body || ''}</div>
            <div style="font-size:11px;color:#64748b;margin-top:14px;text-align:left;border-top:1px solid rgba(255,255,255,.05);padding-top:8px;" dir="ltr">${dTime}</div>
        </div>
    `;
};

window.closeMessageModal = () => { const m = document.getElementById('m-msg'); if (m) m.classList.remove('show'); };
window.openHelpModal = () => { const m = document.getElementById('m-help'); if (m) m.classList.add('show'); };
window.closeHelpModal = () => { const m = document.getElementById('m-help'); if (m) m.classList.remove('show'); };
window.openAboutModal = () => { const m = document.getElementById('m-about'); if (m) m.classList.add('show'); };
window.closeAboutModal = () => { const m = document.getElementById('m-about'); if (m) m.classList.remove('show'); };

const app = initializeApp({
    apiKey: "AIzaSyAqIksPfjCCQZNQDVx3MEdDyJyNMaTvtlk",
    authDomain: "zenix-platform.firebaseapp.com",
    projectId: "zenix-platform",
    storageBucket: "zenix-platform.firebasestorage.app",
    messagingSenderId: "594936010622",
    appId: "1:594936010622:web:9f4159c80111245062052f",
    measurementId: "G-LXSGYB8WKM"
}),
auth = getAuth(app),
db = getFirestore(app);

let uName = "", currLang = localStorage.getItem('zenix_lang') || 'fa', allMessages = [], currentUserId = null;

const ld = {
    fa: {wel:'خوش آمدید',sub:'پنل مدیریت کاربری',st:'تایید شده',s1:'موجودی',s2:'زیرمجموعه',c1:'کوانتیفیکیشن',d1:'معاملات هوشمند',c2:'واریز',d2:'شارژ حساب',c3:'برداشت',d3:'برداشت دارایی',c4:'تیم',d4:'زیرمجموعه‌ها',c5:'تراکنش‌ها',d5:'تاریخچه مالی',c6:'پروفایل',d6:'تنظیمات امنیت',m1:'صفحه اصلی',m2:'کوانتیفیکیشن',m3:'واریز',m4:'برداشت',m5:'تراکنش',m6:'پروفایل',m7:'پشتیبانی',m_about:'درباره پلتفرم',m8:'خروج',tMkt:'بازار ارزهای دیجیتال (۳ ارز برتر از ۵۰ ارز رصد شده)',tLive:'زنده',tNode:'سرور فعال (US-East)',phoneErr:'وارد کردن شماره تلفن الزامی است.',modalTitle:'صندوق پیام‌های مدیریت',noMsg:'هیچ پیام جدیدی از طرف مدیریت وجود ندارد.'},
    en: {wel:'Welcome',sub:'User Panel',st:'Verified',s1:'Balance',s2:'Referrals',c1:'Quantification',d1:'Smart trading',c2:'Deposit',d2:'Fund account',c3:'Withdraw',d3:'Withdraw assets',c4:'Team',d4:'Referrals',c5:'Transactions',d5:'History',c6:'Profile',d6:'Settings',m1:'Home',m2:'Quantification',m3:'Deposit',m4:'Withdraw',m5:'Transactions',m6:'Profile',m7:'Support',m_about:'About Platform',m8:'Logout',tMkt:'Crypto Market (Top 3 out of 50 Monitored)',tLive:'LIVE',tNode:'Node Active (US-East)',phoneErr:'Phone number is required.',modalTitle:'Admin Messages',noMsg:'No new messages from admin.'},
    ar: {wel:'أهلاً بك',sub:'لوحة التحكم',st:'موثق',s1:'الرصيد',s2:'الإحالات',c1:'الكمية',d1:'التداول الذكي',c2:'إيداع',d2:'شحن الرصيد',c3:'سحب',d3:'سحب الأصول',c4:'الفريق',d4:'الإحالات',c5:'المعاملات',d5:'السجل',c6:'الملف',d6:'الإعدادات',m1:'الرئيسية',m2:'الكمية',m3:'إيداع',m4:'سحب',m5:'المعاملات',m6:'الملف الشخصي',m7:'الدعم',m_about:'عن المنصة',m8:'خروج',tMkt:'سوق العملات',tLive:'مباشر',tNode:'خادم نشط',phoneErr:'رقم الهاتف مطلوب.',modalTitle:'رسائل الإدارة',noMsg:'لا توجد رسائل جديدة من الإدارة.'},
    tr: {wel:'Hoş Geldiniz',sub:'Kullanıcı Paneli',st:'Doğrulanmış',s1:'Bakiye',s2:'Referans',c1:'Kantifikasyon',d1:'Akıllı ticaret',c2:'Para Yatırma',d2:'Bakiye yükle',c3:'Çek',d3:'Varlık çek',c4:'Takım',d4:'Referanslar',c5:'İşlemler',c6:'Profil',d6:'Ayarlar',m1:'Ana Sayfa',m2:'Kantifikasyon',m3:'Para Yatırma',m4:'Çek',m5:'İşlem',m6:'Profil',m7:'Destek',m_about:'Platform Hakkında',m8:'Çıkış',tMkt:'Kripto Piyasası',tLive:'CANLI',tNode:'Aktif Sunucu',phoneErr:'Telefon numarası gereklidir.',modalTitle:'Yönetici Mesajları',noMsg:'Yöneticiden yeni mesaj yok.'},
    ru: {wel:'Добро пожаловать',sub:'Панель',st:'Проверено',s1:'Баланс',s2:'Рефералы',c1:'Квантификация',d1:'Умная торговля',c2:'Депозит',d2:'Пополнение',c3:'Вывод',d3:'Вывод',c4:'Команда',d4:'Рефералы',c5:'Транзакции',d5:'История',c6:'Профиль',d6:'Настройки',m1:'Главная',m2:'Квантификация',m3:'Депозит',m4:'Вывод',m5:'Транзакция',m6:'Профиль',m7:'Поддержка',m_about:'О платформе',m8:'Выйти',tMkt:'Крипто Рынок',tLive:'LIVE',tNode:'Сервер активен',phoneErr:'Номер телефона обязателен.',modalTitle:'Сообщения админа',noMsg:'Нет новых сообщений от администратора.'},
    es: {wel:'Bienvenido',sub:'Panel',st:'Verificado',s1:'Saldo',s2:'Referidos',c1:'Cuantificación',d1:'Trading inteligente',c2:'Depósito',d2:'Fondear',c3:'Retirar',d3:'Retirar',c4:'Equipo',d4:'Referidos',c5:'Transacciones',d5:'Historial',c6:'Perfil',d6:'Ajustes',m1:'Inicio',m2:'Cuantificación',m3:'Depósito',m4:'Retirar',m5:'Transacción',m6:'Perfil',m7:'Soporte',m_about:'Acerca de',m8:'Salir',tMkt:'Mercado Cripto',tLive:'EN VIVO',tNode:'Servidor Activo',phoneErr:'El número de teléfono es obligatorio.',modalTitle:'Mensajes del Admin',noMsg:'No hay mensajes nuevos del admin.'},
    fr: {wel:'Bienvenue',sub:'Tableau',st:'Vérifié',s1:'Solde',s2:'Filleuls',c1:'Quantification',d1:'Trading intelligent',c2:'Dépôt',d2:'Alimenter',c3:'Retirer',d3:'Retirer',c4:'Équipe',d4:'Filleuls',c5:'Transactions',d5:'Historique',c6:'Profil',d6:'Paramètres',m1:'Accueil',m2:'Quantification',m3:'Dépôt',m4:'Retirer',m5:'Transaction',m6:'Profil',m7:'Support',m_about:'À propos',m8:'Sortie',tMkt:'Marché Crypto',tLive:'EN DIRECT',tNode:'Serveur Actif',phoneErr:'Le numéro de téléphone est obligatoire.',modalTitle:'Messages Admin',noMsg:'Aucun nouveau message de l’administrateur.'},
    de: {wel:'Willkommen',sub:'Dashboard',st:'Verifiziert',s1:'Guthaben',s2:'Empfehlungen',c1:'Quantifizierung',d1:'Intelligenter Handel',c2:'Einzahlen',d2:'Konto aufladen',c3:'Abheben',d3:'Abheben',c4:'Team',d4:'Empfehlungen',c5:'Transaktionen',d5:'Historie',c6:'Profil',d6:'Einstellungen',m1:'Startseite',m2:'Quantifizierung',m3:'Einzahlen',m4:'Abheben',m5:'Transaktion',m6:'Profil',m7:'Support',m_about:'Über uns',m8:'Abmelden',tMkt:'Krypto-Markt',tLive:'LIVE',tNode:'Server Aktiv',phoneErr:'Telefonnummer ist erforderlich.',modalTitle:'Admin-Nachrichten',noMsg:'Keine নতুন Nachrichten vom Admin.'}
};

const bellBtn = document.getElementById('bell-btn'), helpBtn = document.getElementById('help-btn');
if (bellBtn) bellBtn.onclick = e => { e.stopPropagation(); window.openMessageModal(); };
if (helpBtn) helpBtn.onclick = e => { e.stopPropagation(); window.openHelpModal(); };

window.addEventListener('pageshow', () => {
    document.querySelectorAll('.menu').forEach(x => x.classList.remove('show'));
});

try {
    onAuthStateChanged(auth, async u => {
        if (!u) { window.location.href = 'index.html'; return; }
        try {
            currentUserId = u.uid;
            const d = await getDoc(doc(db, "users", u.uid));
            if (d.exists()) {
                const data = d.data();
                const phone = data.phone || data.phoneNumber;
                if (!phone) {
                    localStorage.setItem('profile_error', (ld[currLang] || ld.fa).phoneErr);
                    window.location.replace('profile.html');
                    return;
                }
                uName = data.fullName || data.fullname || data.name || "";
                setLang(currLang);
                const elBal = document.getElementById('val-balance');
                if (elBal) elBal.textContent = `$${Number(data.balance !== undefined && data.balance !== null ? data.balance : (data.depositAmount || 0)).toFixed(2)}`;
                
                allMessages = await fetchUserMessages(u.uid);
                let unread = allMessages.filter(m => !m.read).length;
                if (unread > 0) {
                    let b = document.getElementById('bell-badge');
                    if (b) { b.textContent = unread; b.classList.add('show'); }
                }

                let totalRef = 0, refCode = data.referralCode;
                if (refCode) {
                    const snapAll = await getDocs(collection(db, "users"));
                    let allUsers = [];
                    snapAll.forEach(ds => allUsers.push(ds.data()));
                    let l1 = allUsers.filter(i => i.referredBy === refCode),
                        l1c = l1.map(i => i.referralCode).filter(Boolean),
                        l2 = allUsers.filter(i => l1c.includes(i.referredBy)),
                        l2c = l2.map(i => i.referralCode).filter(Boolean),
                        l3 = allUsers.filter(i => l2c.includes(i.referredBy));
                    totalRef = l1.length + l2.length + l3.length;
                } else {
                    totalRef = Number(data.gen1Count || data.generation1 || 0) + Number(data.gen2Count || data.generation2 || 0) + Number(data.gen3Count || data.generation3 || 0);
                }
                const elRef = document.getElementById('val-ref');
                if (elRef) elRef.textContent = totalRef;
            }
        } catch (e) { console.error(e); }
    });
} catch (err) { console.error("Auth error:", err); }

const mBtn = document.getElementById('menu-btn'), nMenu = document.getElementById('nav-menu'), lBtn = document.getElementById('lang-btn'), lMenu = document.getElementById('lang-menu'), logoutBtn = document.getElementById('logout-btn');

function toggleM(m, e) {
    if (e) e.stopPropagation();
    [nMenu, lMenu].forEach(x => { if (x && x !== m) x.classList.remove('show'); });
    if (m) m.classList.toggle('show');
}

if (mBtn) mBtn.onclick = e => toggleM(nMenu, e);
if (lBtn) lBtn.onclick = e => toggleM(lMenu, e);

document.onclick = e => {
    if (!e.target.closest('.menu') && !e.target.closest('#menu-btn') && !e.target.closest('#lang-btn')) {
        [nMenu, lMenu].forEach(x => { if (x) x.classList.remove('show'); });
    }
};

window.addEventListener('scroll', () => {
    [nMenu, lMenu].forEach(x => { if (x) x.classList.remove('show'); });
});

document.querySelectorAll('.menu').forEach(m => m.onclick = e => e.stopPropagation());

function setLang(l) {
    currLang = l;
    localStorage.setItem('zenix_lang', l);
    [nMenu, lMenu].forEach(x => { if (x) x.classList.remove('show'); });
    const t = ld[l] || ld.fa, r = l === 'fa' || l === 'ar';
    document.documentElement.setAttribute('dir', r ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', l);
    for (let i = 1; i <= 6; i++) {
        let el = document.getElementById(`i${i}`);
        if (el) el.className = r ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
    }
    const elWel = document.getElementById('t-wel');
    if (elWel) elWel.textContent = uName ? `${t.wel}، ${uName}` : t.wel;
    ['t-sub', 't-st', 'ts1', 'ts2'].forEach((id, idx) => {
        const keys = ['sub', 'st', 's1', 's2'];
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[idx]];
    });
    if (document.getElementById('t-mkt')) document.getElementById('t-mkt').innerHTML = `<i class="fas fa-chart-line" style="color:#22c55e"></i> ${t.tMkt || 'بازار ارزهای دیجیتال'}`;
    if (document.getElementById('t-live')) document.getElementById('t-live').textContent = t.tLive || 'زنده';
    if (document.getElementById('t-node')) document.getElementById('t-node').textContent = t.tNode;
    if (document.getElementById('t-modal-title')) document.getElementById('t-modal-title').textContent = t.modalTitle || 'صندوق پیام‌های مدیریت';
    if (document.getElementById('m_about')) document.getElementById('m_about').textContent = t.m_about || 'درباره پلتفرم';
    for (let i = 1; i <= 6; i++) {
        let cEl = document.getElementById(`c${i}`), dEl = document.getElementById(`d${i}`);
        if (cEl) cEl.textContent = t[`c${i}`] || '';
        if (dEl) dEl.textContent = t[`d${i}`] || '';
    }
    for (let i = 1; i <= 8; i++) {
        let mEl = document.getElementById(`m${i}`);
        if (mEl) mEl.textContent = t[`m${i}`] || '';
    }
}

document.querySelectorAll('#lang-menu .mi').forEach(i => i.onclick = () => setLang(i.dataset.lang));

if (logoutBtn) {
    logoutBtn.onclick = async e => {
        e.preventDefault();
        try { await signOut(auth); } catch (e) {}
        localStorage.clear();
        window.location.href = 'index.html';
    };
}

setLang(currLang);

// استخر کامل ۵۰ ارز دیجیتال برتر برای رصد زنده و جابجایی پویای سوددهی
const cryptoPool = [
    {id:'btc', name:'Bitcoin', symbol:'BTC', price:94517.19, cls:'fab fa-bitcoin', color:'#f7931a', change:1.85},
    {id:'eth', name:'Ethereum', symbol:'ETH', price:3480.20, cls:'fab fa-ethereum', color:'#627eea', change:2.12},
    {id:'sol', name:'Solana', symbol:'SOL', price:189.30, cls:'fas fa-sun', color:'#14f195', change:3.41},
    {id:'bnb', name:'Binance Coin', symbol:'BNB', price:615.40, cls:'fas fa-cube', color:'#f3ba2f', change:0.95},
    {id:'xrp', name:'XRP', symbol:'XRP', price:1.45, cls:'fas fa-bolt', color:'#23292f', change:4.20},
    {id:'doge', name:'Dogecoin', symbol:'DOGE', price:0.38, cls:'fas fa-dog', color:'#c2a633', change:5.65},
    {id:'ada', name:'Cardano', symbol:'ADA', price:0.75, cls:'fas fa-circle-nodes', color:'#0033ad', change:1.10},
    {id:'avax', name:'Avalanche', symbol:'AVAX', price:32.40, cls:'fas fa-mountain', color:'#e84142', change:2.30},
    {id:'link', name:'Chainlink', symbol:'LINK', price:18.50, cls:'fas fa-link', color:'#375bd2', change:2.80},
    {id:'matic', name:'Polygon', symbol:'MATIC', price:0.55, cls:'fas fa-chess-board', color:'#8247e5', change:1.50},
    {id:'uni', name:'Uniswap', symbol:'UNI', price:8.20, cls:'fas fa-code-branch', color:'#ff007a', change:0.40},
    {id:'dot', name:'Polkadot', symbol:'DOT', price:7.10, cls:'fas fa-circle', color:'#e6007a', change:-0.50},
    {id:'ltc', name:'Litecoin', symbol:'LTC', price:85.40, cls:'fas fa-litecoin', color:'#345d9d', change:1.20},
    {id:'bch', name:'Bitcoin Cash', symbol:'BCH', price:380.00, cls:'fab fa-bitcoin', color:'#8dc351', change:3.10},
    {id:'near', name:'NEAR Protocol', symbol:'NEAR', price:5.40, cls:'fas fa-network-wired', color:'#000000', change:4.50},
    {id:'apt', name:'Aptos', symbol:'APT', price:9.20, cls:'fas fa-layer-group', color:'#222222', change:2.10},
    {id:'sui', name:'Sui', symbol:'SUI', price:3.10, cls:'fas fa-water', color:'#3d70b2', change:6.20},
    {id:'atom', name:'Cosmos', symbol:'ATOM', price:6.50, cls:'fas fa-globe', color:'#2e3148', change:-1.20},
    {id:'arb', name:'Arbitrum', symbol:'ARB', price:0.75, cls:'fas fa-feather', color:'#28a0f0', change:1.80},
    {id:'op', name:'Optimism', symbol:'OP', price:1.80, cls:'fas fa-shield-alt', color:'#ff0420', change:2.40},
    {id:'inj', name:'Injective', symbol:'INJ', price:24.50, cls:'fas fa-syringe', color:'#00f2fe', change:5.10},
    {id:'render', name:'Render', symbol:'RENDER', price:7.80, cls:'fas fa-server', color:'#b53636', change:3.80},
    {id:'fet', name:'Artificial Superintelligence', symbol:'FET', price:1.40, cls:'fas fa-brain', color:'#1d2859', change:4.10},
    {id:'tao', name:'Bittensor', symbol:'TAO', price:450.00, cls:'fas fa-brain', color:'#ffffff', change:7.50},
    {id:'shib', name:'Shiba Inu', symbol:'SHIB', price:0.000025, cls:'fas fa-dog', color:'#e4a81d', change:3.20},
    {id:'pepe', name:'Pepe', symbol:'PEPE', price:0.000012, cls:'fas fa-frog', color:'#3d9970', change:8.40},
    {id:'bonk', name:'Bonk', symbol:'BONK', price:0.000022, cls:'fas fa-bone', color:'#e65c00', change:5.90},
    {id:'floki', name:'Floki', symbol:'FLOKI', price:0.00015, cls:'fas fa-shield-dog', color:'#b8860b', change:2.60},
    {id:'trx', name:'TRON', symbol:'TRX', price:0.24, cls:'fas fa-gem', color:'#ff0000', change:0.80},
    {id:'xlm', name:'Stellar', symbol:'XLM', price:0.35, cls:'fas fa-star', color:'#14b6eb', change:1.90},
    {id:'etc', name:'Ethereum Classic', symbol:'ETC', price:28.90, cls:'fab fa-ethereum', color:'#3cfa70', change:-0.40},
    {id:'fil', name:'Filecoin', symbol:'FIL', price:5.20, cls:'fas fa-file', color:'#0090ff', change:1.30},
    {id:'algo', name:'Algorand', symbol:'ALGO', price:0.28, cls:'fas fa-project-diagram', color:'#000000', change:2.20},
    {id:'hbar', name:'Hedera', symbol:'HBAR', price:0.18, cls:'fas fa-cube', color:'#222222', change:3.50},
    {id:'vet', name:'VeChain', symbol:'VET', price:0.035, cls:'fas fa-check-double', color:'#15abd8', change:0.60},
    {id:'grt', name:'The Graph', symbol:'GRT', price:0.21, cls:'fas fa-project-diagram', color:'#6f4cff', change:2.50},
    {id:'ftm', name:'Fantom', symbol:'FTM', price:0.72, cls:'fas fa-ghost', color:'#1969ff', change:4.80},
    {id:'mkr', name:'Maker', symbol:'MKR', price:2100.00, cls:'fas fa-coins', color:#1aab9b', change:0.30},
    {id:'aave', name:'Aave', symbol:'AAVE', price:180.00, cls:'fas fa-ghost', color:'#b6509e', change:3.60},
    {id:'kava', name:'Kava', symbol:'KAVA', price:0.62, cls:'fas fa-shield-alt', color:'#ff433e', change:1.40},
    {id:'crv', name:'Curve DAO', symbol:'CRV', price:0.42, cls:'fas fa-chart-pie', color:'#ff3333', change:-0.80},
    {id:'snx', name:'Synthetix', symbol:'SNX', price:1.90, cls:'fas fa-wave-square', color:'#00d1b2', change:2.00},
    {id:'comp', name:'Compound', symbol:'COMP', price:58.00, cls:'fas fa-university', color:'#00d395', change:0.90},
    {id:'cake', name:'PancakeSwap', symbol:'CAKE', price:2.40, cls:'fas fa-birthday-cake', color:'#d18844', change:1.70},
    {id:'flow', name:'Flow', symbol:'FLOW', price:0.75, cls:'fas fa-water', color:'#00ef8b', change:2.30},
    {id:'sand', name:'The Sandbox', symbol:'SAND', price:0.38, cls:'fas fa-cube', color:'#0084ff', change:3.90},
    {id:'mana', name:'Decentraland', symbol:'MANA', price:0.39, cls:'fas fa-vr-cardboard', color:'#ff2d55', change:1.60},
    {id:'theta', name:'Theta Network', symbol:'THETA', price:2.20, cls:'fas fa-video', color:'#00a3e0', change:2.70},
    {id:'axs', name:'Axie Infinity', symbol:'AXS', price:5.10, cls:'fas fa-gamepad', color:'#0055ff', change:3.00},
    {id:'chz', name:'Chiliz', symbol:'CHZ', price:0.075, cls:'fas fa-futbol', color:'#cd0101', change:1.90}
];

function initCryptoTicker() {
    renderTop3();
    setInterval(updateLivePrices, 2000);
}

function renderTop3() {
    const c = document.getElementById('crypto-ticker-list');
    if (!c) return;
    
    // مرتب‌سازی کل ۵۰ ارز بر اساس بیشترین سوددهی (نزولی)
    cryptoPool.sort((a, b) => b.change - a.change);
    
    // انتخاب ۳ ارز برتر از بین ۵۰ ارز
    const top3 = cryptoPool.slice(0, 3);
    
    c.innerHTML = '';
    top3.forEach(coin => {
        const r = document.createElement('div');
        r.className = 'crypto-row';
        r.id = `crypto-row-${coin.id}`;
        const up = coin.change >= 0, pCls = up ? 'price-up' : 'price-down';
        r.innerHTML = `
            <div class="crypto-info">
                <div class="crypto-icon" style="background:${coin.color};"><i class="${coin.cls}"></i></div>
                <div>
                    <div style="font-weight:bold;color:#f8fafc;">${coin.symbol}</div>
                    <div style="font-size:10px;color:#94a3b8;">${coin.name}</div>
                </div>
            </div>
            <div style="text-align:right;">
                <div id="p-${coin.id}" class="${pCls}">$${coin.price < 1 ? coin.price.toFixed(6) : (coin.price < 10 ? coin.price.toFixed(3) : coin.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</div>
                <div id="ch-${coin.id}" style="font-size:10px;" class="${pCls}">${up ? '+' : ''}${coin.change.toFixed(2)}%</div>
            </div>`;
        c.appendChild(r);
    });
}

function updateLivePrices() {
    // اعمال نوسانات زنده به تمامی ارزها جهت جابجایی رتبه‌های اول تا سوم
    cryptoPool.forEach(coin => {
        const delta = (Math.random() - 0.48) * (coin.price * 0.001);
        coin.price = Math.max(0.000001, coin.price + delta);
        coin.change += (Math.random() - 0.47) * 0.15;
    });
    renderTop3();
}

initCryptoTicker();
