import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    fa: {wel:'خوش آمدید',sub:'پنل مدیریت کاربری',st:'تایید شده',s1:'موجودی',s2:'زیرمجموعه',c1:'کوانتیفیکیشن',d1:'معاملات هوشمند',c2:'واریز',d2:'شارژ حساب',c3:'برداشت',d3:'برداشت دارایی',c4:'تیم',d4:'زیرمجموعه‌ها',c5:'تراکنش‌ها',d5:'تاریخچه مالی',c6:'پروفایل',d6:'تنظیمات امنیت',m1:'صفحه اصلی',m2:'کوانتیفیکیشن',m3:'واریز',m4:'برداشت',m5:'تراکنش',m6:'پروفایل',m7:'پشتیبانی',m_about:'درباره پلتفرم',m8:'خروج',tMkt:'بازار ارزهای دیجیتال (۳ ارز برتر از ۳۰ ارز رصد شده)',tLive:'زنده',tNode:'سرور فعال (US-East)',phoneErr:'وارد کردن شماره تلفن الزامی است.',modalTitle:'صندوق پیام‌های مدیریت',noMsg:'هیچ پیام جدیدی از طرف مدیریت وجود ندارد.'},
    en: {wel:'Welcome',sub:'User Panel',st:'Verified',s1:'Balance',s2:'Referrals',c1:'Quantification',d1:'Smart trading',c2:'Deposit',d2:'Fund account',c3:'Withdraw',d3:'Withdraw assets',c4:'Team',d4:'Referrals',c5:'Transactions',d5:'History',c6:'Profile',d6:'Settings',m1:'Home',m2:'Quantification',m3:'Deposit',m4:'Withdraw',m5:'Transactions',m6:'Profile',m7:'Support',m_about:'About Platform',m8:'Logout',tMkt:'Crypto Market (Top 3 out of 30 Monitored)',tLive:'LIVE',tNode:'Node Active (US-East)',phoneErr:'Phone number is required.',modalTitle:'Admin Messages',noMsg:'No new messages from admin.'},
    ar: {wel:'أهلاً بك',sub:'لوحة التحكم',st:'موثق',s1:'الرصيد',s2:'الإحالات',c1:'الكمية',d1:'التداول الذكي',c2:'إيداع',d2:'شحن الرصيد',c3:'سحب',d3:'سحب الأصول',c4:'الفريق',d4:'الإحالات',c5:'المعاملات',d5:'السجل',c6:'الملف',d6:'الإعدادات',m1:'الرئيسية',m2:'الكمية',m3:'إيداع',m4:'سحب',m5:'المعاملات',m6:'الملف الشخصي',m7:'الدعم',m_about:'عن المنصة',m8:'خروج',tMkt:'سوق العملات',tLive:'مباشر',tNode:'خادم نشط',phoneErr:'رقم الهاتف مطلوب.',modalTitle:'رسائل الإدارة',noMsg:'لا توجد رسائل جديدة من الإدارة.'},
    tr: {wel:'Hoş Geldiniz',sub:'Kullanıcı Paneli',st:'Doğrulanmış',s1:'Bakiye',s2:'Referans',c1:'Kantifikasyon',d1:'Akıllı ticaret',c2:'Para Yatırma',d2:'Bakiye yükle',c3:'Çek',d3:'Varlık çek',c4:'Takım',d4:'Referanslar',c5:'İşlemler',c6:'Profil',d6:'Ayarlar',m1:'Ana Sayfa',m2:'Kantifikasyon',m3:'Para Yatırma',m4:'Çek',m5:'İşlem',m6:'Profil',m7:'Destek',m_about:'Platform Hakkında',m8:'Çıkış',tMkt:'Kripto Piyasası',tLive:'CANLI',tNode:'Aktif Sunucu',phoneErr:'Telefon numarası gereklidir.',modalTitle:'Yönetici Mesajları',noMsg:'Yöneticiden yeni mesaj yok.'},
    ru: {wel:'Добро пожаловать',sub:'Панель',st:'Проверено',s1:'Баланс',s2:'Рефералы',s3:'Вывод',c1:'Квантификация',d1:'Умная торговля',c2:'Депозит',d2:'Пополнение',c3:'Вывод',d3:'Вывод',c4:'Команда',d4:'Рефералы',c5:'Транзакции',d5:'История',c6:'Профиль',d6:'Настройки',m1:'Главная',m2:'Квантификация',m3:'Депозит',m4:'Вывод',m5:'Транзакция',m6:'Профиль',m7:'Поддержка',m_about:'О платформе',m8:'Выйти',tMkt:'Крипто Рынок',tLive:'LIVE',tNode:'Сервер активен',phoneErr:'Номер телефона обязателен.',modalTitle:'Сообщения админа',noMsg:'Нет новых сообщений от администратора.'},
    es: {wel:'Bienvenido',sub:'Panel',st:'Verificado',s1:'Saldo',s2:'Referidos',c1:'Cuantificación',d1:'Trading inteligente',c2:'Depósito',d2:'Fondear',c3:'Retirar',d3:'Retirar',c4:'Equipo',d4:'Referidos',c5:'Transacciones',d5:'Historial',c6:'Perfil',d6:'Ajustes',m1:'Inicio',m2:'Cuantificación',m3:'Depósito',m4:'Retirar',m5:'Transacción',m6:'Perfil',m7:'Soporte',m_about:'Acerca de',m8:'Salir',tMkt:'Mercado Cripto',tLive:'EN VIVO',tNode:'Servidor Activo',phoneErr:'El número de teléfono es obligatorio.',modalTitle:'Mensajes del Admin',noMsg:'No hay mensajes nuevos del admin.'},
    fr: {wel:'Bienvenue',sub:'Tableau',st:'Vérifié',s1:'Solde',s2:'Filleuls',c1:'Quantification',d1:'Trading intelligent',c2:'Dépôt',d2:'Alimenter',c3:'Retirer',d3:'Retirer',c4:'Équipe',d4:'Filleuls',c5:'Transactions',d5:'Historique',c6:'Profil',d6:'Paramètres',m1:'Accueil',m2:'Quantification',m3:'Dépôt',m4:'Retirer',m5:'Transaction',m6:'Profil',m7:'Support',m_about:'À propos',m8:'Sortie',tMkt:'Marché Crypto',tLive:'EN DIRECT',tNode:'Serveur Actif',phoneErr:'Le numéro de téléphone est obligatoire.',modalTitle:'Messages Admin',noMsg:'Aucun nouveau message de l’administrateur.'},
    de: {wel:'Willkommen',sub:'Dashboard',st:'Verifiziert',s1:'Guthaben',s2:'Empfehlungen',c1:'Quantifizierung',d1:'Intelligenter Handel',c2:'Einzahlen',d2:'Konto aufladen',c3:'Abheben',d3:'Abheben',c4:'Team',d4:'Empfehlungen',c5:'Transaktionen',d5:'Historie',c6:'Profil',d6:'Einstellungen',m1:'Startseite',m2:'Quantifizierung',m3:'Einzahlen',m4:'Abheben',m5:'Transaction',m6:'Profil',m7:'Support',m_about:'Über uns',m8:'Abmelden',tMkt:'Krypto-Markt',tLive:'LIVE',tNode:'Server Aktiv',phoneErr:'Telefonnummer ist erforderlich.',modalTitle:'Admin-Nachrichten',noMsg:'Keine neuen Nachrichten vom Admin.'}
};

window.openMessageModal = async () => {
    let c = document.getElementById('modal-msg-container'), t = ld[currLang] || ld.fa;
    if (allMessages.length > 0) {
        let html = '';
        allMessages.forEach(m => {
            let dTime = '';
            if (m.time) {
                let d = new Date(m.time);
                dTime = isNaN(d.getTime()) ? m.time : d.toUTCString();
            }
            html += `<div class="msg-body-box"><div class="msg-title-text"><i class="fas fa-envelope-open-text"></i> ${m.subject || 'Announcement'}</div><div class="msg-desc-text">${m.body || ''}</div><div style="font-size:10px;color:#64748b;margin-top:8px;text-align:left" dir="ltr">${dTime}</div></div>`;
        });
        c.innerHTML = html;
        if (currentUserId) {
            try {
                let upd = allMessages.map(m => ({ ...m, read: true }));
                await updateDoc(doc(db, "users", currentUserId), { "adminMessage": upd });
                allMessages = upd;
                let b = document.getElementById('bell-badge');
                b.textContent = '0';
                b.classList.remove('show');
            } catch (e) { console.error(e); }
        }
    } else {
        c.innerHTML = `<div style="text-align:center;padding:20px;color:#94a3b8">${t.noMsg}</div>`;
    }
    document.getElementById('m-msg').classList.add('show');
};

window.closeMessageModal = () => document.getElementById('m-msg').classList.remove('show');

window.openHelpModal = () => document.getElementById('m-help').classList.add('show');
window.closeHelpModal = () => document.getElementById('m-help').classList.remove('show');

window.openAboutModal = () => document.getElementById('m-about').classList.add('show');
window.closeAboutModal = () => document.getElementById('m-about').classList.remove('show');

document.getElementById('bell-btn').onclick = e => { e.stopPropagation(); openMessageModal(); };
document.getElementById('help-btn').onclick = e => { e.stopPropagation(); openHelpModal(); };

window.addEventListener('pageshow', () => {
    document.querySelectorAll('.menu').forEach(x => x.classList.remove('show'));
});

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
            document.getElementById('val-balance').textContent = `$${Number(data.balance !== undefined && data.balance !== null ? data.balance : (data.depositAmount || 0)).toFixed(2)}`;
            if (data.adminMessage) {
                allMessages = Array.isArray(data.adminMessage) ? data.adminMessage : [data.adminMessage];
                let unread = allMessages.filter(m => !m.read).length;
                if (unread > 0) {
                    let b = document.getElementById('bell-badge');
                    b.textContent = unread;
                    b.classList.add('show');
                }
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
            document.getElementById('val-ref').textContent = totalRef;
        }
    } catch (e) { console.error(e); }
});

const mBtn = document.getElementById('menu-btn'), nMenu = document.getElementById('nav-menu'), lBtn = document.getElementById('lang-btn'), lMenu = document.getElementById('lang-menu'), logoutBtn = document.getElementById('logout-btn');

function toggleM(m, e) {
    e.stopPropagation();
    [nMenu, lMenu].forEach(x => { if (x !== m) x.classList.remove('show'); });
    m.classList.toggle('show');
}

if (mBtn) {
    mBtn.onclick = e => toggleM(nMenu, e);
    mBtn.ontouchstart = e => { e.preventDefault(); toggleM(nMenu, e); };
}
if (lBtn) {
    lBtn.onclick = e => toggleM(lMenu, e);
    lBtn.ontouchstart = e => { e.preventDefault(); toggleM(lMenu, e); };
}

document.onclick = e => {
    if (!e.target.closest('.menu') && !e.target.closest('#menu-btn') && !e.target.closest('#lang-btn')) {
        [nMenu, lMenu].forEach(x => x.classList.remove('show'));
    }
};

window.addEventListener('scroll', () => {
    [nMenu, lMenu].forEach(x => x.classList.remove('show'));
});

document.querySelectorAll('.menu').forEach(m => m.onclick = e => e.stopPropagation());

function setLang(l) {
    currLang = l;
    localStorage.setItem('zenix_lang', l);
    [nMenu, lMenu].forEach(x => x.classList.remove('show'));
    const t = ld[l] || ld.fa, r = l === 'fa' || l === 'ar';
    document.documentElement.setAttribute('dir', r ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', l);
    for (let i = 1; i <= 6; i++) document.getElementById(`i${i}`).className = r ? 'fas fa-chevron-left' : 'fas fa-chevron-right';
    document.getElementById('t-wel').textContent = uName ? `${t.wel}، ${uName}` : t.wel;
    ['t-sub', 't-st', 'ts1', 'ts2'].forEach((id, idx) => {
        const keys = ['sub', 'st', 's1', 's2'];
        if (document.getElementById(id)) document.getElementById(id).textContent = t[keys[idx]];
    });
    if (document.getElementById('t-mkt')) document.getElementById('t-mkt').innerHTML = `<i class="fas fa-chart-line" style="color:#22c55e"></i> ${t.tMkt || 'بازار ارزهای دیجیتال'}`;
    if (document.getElementById('t-live')) document.getElementById('t-live').textContent = t.tLive || 'زنده';
    if (document.getElementById('t-node')) document.getElementById('t-node').textContent = t.tNode;
    if (document.getElementById('t-modal-title')) document.getElementById('t-modal-title').textContent = t.modalTitle || 'صندوق پیام‌های مدیریت';
    if (document.getElementById('m_about')) document.getElementById('m_about').textContent = t.m_about || 'درباره پلتفرم';
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`c${i}`).textContent = t[`c${i}`];
        document.getElementById(`d${i}`).textContent = t[`d${i}`];
    }
    for (let i = 1; i <= 8; i++) document.getElementById(`m${i}`).textContent = t[`m${i}`];
}

document.querySelectorAll('#lang-menu .mi').forEach(i => i.onclick = () => setLang(i.dataset.lang));

if (logoutBtn) {
    logoutBtn.onclick = async e => {
        e.preventDefault();
        await signOut(auth);
        localStorage.clear();
        window.location.href = 'index.html';
    };
}

setLang(currLang);

const cryptoPool = [
    {id:'btc', name:'Bitcoin', symbol:'BTC', price:94517.19, cls:'fab fa-bitcoin', color:'#f7931a', change:1.85},
    {id:'eth', name:'Ethereum', symbol:'ETH', price:3480.20, cls:'fab fa-ethereum', color:'#627eea', change:2.12},
    {id:'sol', name:'Solana', symbol:'SOL', price:189.30, cls:'fas fa-sun', color:'#14f195', change:3.41},
    {id:'bnb', name:'Binance Coin', symbol:'BNB', price:615.40, cls:'fas fa-cube', color:'#f3ba2f', change:0.95},
    {id:'xrp', name:'XRP', symbol:'XRP', price:1.45, cls:'fas fa-bolt', color:'#23292f', change:4.20},
    {id:'doge', name:'Dogecoin', symbol:'DOGE', price:0.38, cls:'fas fa-dog', color:'#c2a633', change:5.65},
    {id:'ada', name:'Cardano', symbol:'ADA', price:0.75, cls:'fas fa-circle-nodes', color:'#0033ad', change:1.10},
    {id:'avax', name:'Avalanche', symbol:'AVAX', price:32.40, cls:'fas fa-mountain', color:'#e84142', change:2.30}
];

function initCryptoTicker() {
    renderTop3();
    setInterval(updateLivePrices, 2000);
}

function renderTop3() {
    const c = document.getElementById('crypto-ticker-list');
    if (!c) return;
    cryptoPool.sort((a, b) => b.change - a.change);
    const top3 = cryptoPool.slice(0, 3);
    c.innerHTML = '';
    top3.forEach(coin => {
        const r = document.createElement('div');
        r.className = 'crypto-row';
        r.id = `crypto-row-${coin.id}`;
        const up = coin.change >= 0, pCls = up ? 'price-up' : 'price-down';
        r.innerHTML = `<div class="crypto-info"><div class="crypto-icon" style="background:${coin.color};"><i class="${coin.cls}"></i></div><div><div style="font-weight:bold;color:#f8fafc;">${coin.symbol}</div><div style="font-size:10px;color:#94a3b8;">${coin.name}</div></div></div><div style="text-align:right;"><div id="p-${coin.id}" class="${pCls}">$${coin.price < 1 ? coin.price.toFixed(6) : (coin.price < 10 ? coin.price.toFixed(3) : coin.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</div><div id="ch-${coin.id}" style="font-size:10px;" class="${pCls}">${up ? '+' : ''}${coin.change.toFixed(2)}%</div></div>`;
        c.appendChild(r);
    });
}

function updateLivePrices() {
    cryptoPool.forEach(coin => {
        const delta = (Math.random() - 0.48) * (coin.price * 0.001);
        coin.price = Math.max(0.000001, coin.price + delta);
        coin.change += (Math.random() - 0.48) * 0.05;
    });
    renderTop3();
}

initCryptoTicker();
