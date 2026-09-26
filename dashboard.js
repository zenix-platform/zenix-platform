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
});

const auth = getAuth(app), db = getFirestore(app);
let uName = "", currLang = localStorage.getItem('zenix_lang') || 'fa', allMessages = [], currentUserId = null;

const ld = {
fa: { wel: 'خوش آمدید', sub: 'پنل مدیریت کاربری', st: 'تایید شده', s1: 'موجودی', s2: 'زیرمجموعه', c1: 'کوانتیفیکیشن', d1: 'معاملات هوشمند', c2: 'واریز', d2: 'شارژ حساب', c3: 'برداشت', d3: 'برداشت دارایی', c4: 'تیم', d4: 'زیرمجموعه‌ها', c5: 'تراکنش‌ها', d5: 'تاریخچه مالی', c6: 'پروفایل', d6: 'تنظیمات امنیت', m1: 'صفحه اصلی', m2: 'کوانتیفیکیشن', m3: 'واریز', m4: 'برداشت', m5: 'تراکنش', m6: 'پروفایل', m7: 'پشتیبانی', m_about: 'درباره پلتفرم', m8: 'خروج', tMkt: 'بازار ارزهای دیجیتال (۳ ارز برتر از ۵۰ ارز رصد شده)', tLive: 'زنده', tNode: 'سرور فعال (US-East)', phoneErr: 'وارد کردن شماره تلفن الزامی است.', modalTitle: 'صندوق پیام‌های مدیریت', noMsg: 'هیچ پیام جدیدی از طرف مدیریت وجود ندارد.' },
en: { wel: 'Welcome', sub: 'User Panel', st: 'Verified', s1: 'Balance', s2: 'Referrals', c1: 'Quantification', d1: 'Smart trading', c2: 'Deposit', d2: 'Fund account', c3: 'Withdraw', d3: 'Withdraw assets', c4: 'Team', d4: 'Referrals', c5: 'Transactions', d5: 'History', c6: 'Profile', d6: 'Settings', m1: 'Home', m2: 'Quantification', m3: 'Deposit', m4: 'Withdraw', m5: 'Transactions', m6: 'Profile', m7: 'Support', m_about: 'About Platform', m8: 'Logout', tMkt: 'Crypto Market (Top 3 out of 50 Monitored)', tLive: 'LIVE', tNode: 'Node Active (US-East)', phoneErr: 'Phone number is required.', modalTitle: 'Admin Messages', noMsg: 'No new messages from admin.' },
ar: { wel: 'أهلاً بك', sub: 'لوحة التحكم', st: 'موثق', s1: 'الرصيد', s2: 'الإحالات', c1: 'الكمية', d1: 'التداول الذكي', c2: 'إيداع', d2: 'شحن الرصيد', c3: 'سحب', d3: 'سحب الأصول', c4: 'الفريق', d4: 'الإحالات', c5: 'المعاملات', d5: 'السجل', c6: 'الملف', d6: 'الإعدادات', m1: 'الرئيسية', m2: 'الكمية', m3: 'إيداع', m4: 'سحب', m5: 'المعاملات', m6: 'الملف الشخصي', m7: 'الدعم', m_about: 'عن المنصة', m8: 'خروج', tMkt: 'سوق العملات', tLive: 'مباشر', tNode: 'خادم نشط', phoneErr: 'رقم الهاتف مطلوب.', modalTitle: 'رسائل الإدارة', noMsg: 'لا توجد رسائل جديدة من الإدارة.' },
tr: { wel: 'Hoş Geldiniz', sub: 'Kullanıcı Paneli', st: 'Doğrulanmış', s1: 'Bakiye', s2: 'Referans', c1: 'Kantifikasyon', d1: 'Akıllı ticaret', c2: 'Para Yatırma', d2: 'Bakiye yükle', c3: 'Çek', d3: 'Varlık çek', c4: 'Takım', d4: 'Referanslar', c5: 'İşlemler', c6: 'Profil', d6: 'Ayarlar', m1: 'Ana Sayfa', m2: 'Kantifikasyon', m3: 'Para Yatırma', m4: 'Çek', m5: 'İşlem', m6: 'Profil', m7: 'Destek', m_about: 'Platform Hakkında', m8: 'Çıkış', tMkt: 'Kripto Piyasası', tLive: 'CANLI', tNode: 'Aktif Sunucu', phoneErr: 'Telefon numarası gereklidir.', modalTitle: 'Yönetici Mesajları', noMsg: 'Yöneticiden yeni mesaj yok.' },
ru: { wel: 'Добро пожаловать', sub: 'Панель', st: 'Проверено', s1: 'Баланс', s2: 'Рефералы', c1: 'Квантификация', d1: 'Умная торговля', c2: 'Депозит', d2: 'Пополнение', c3: 'Вывод', d3: 'Вывод', c4: 'Команда', d4: 'Рефералы', c5: 'Транзакции', d5: 'История', c6: 'Профиль', d6: 'Настройки', m1: 'Главная', m2: 'Квантификация', m3: 'Депозит', m4: 'Вывод', m5: 'Транзакция', m6: 'Профиль', m7: 'Поддержка', m_about: 'О платформе', m8: 'Выйти', tMkt: 'Крипто Рынок', tLive: 'LIVE', tNode: 'Сервер активен', phoneErr: 'Номер телефона обязателен.', modalTitle: 'Сообщения админа', noMsg: 'Нет новых сообщений от администратора.' },
es: { wel: 'Bienvenido', sub: 'Panel', st: 'Verificado', s1: 'Saldo', s2: 'Referidos', c1: 'Cuantificación', d1: 'Trading inteligente', c2: 'Depósito', d2: 'Fondear', c3: 'Retirar', d3: 'Retirar', c4: 'Equipo', d4: 'Referidos', c5: 'Transacciones', d5: 'Historial', c6: 'Perfil', d6: 'Ajustes', m1: 'Inicio', m2: 'Cuantificación', m3: 'Depósito', m4: 'Retirar', m5: 'Transacción', m6: 'Perfil', m7: 'Soporte', m_about: 'Acerca de', m8: 'Salir', tMkt: 'Mercado Cripto', tLive: 'EN VIVO', tNode: 'Servidor Activo', phoneErr: 'El número de teléfono es obligatorio.', modalTitle: 'Mensajes del Admin', noMsg: 'No hay mensajes nuevos del admin.' },
fr: { wel: 'Bienvenue', sub: 'Tableau', st: 'Vérifié', s1: 'Solde', s2: 'Filleuls', c1: 'Quantification', d1: 'Trading intelligent', c2: 'Dépôt', d2: 'Alimenter', c3: 'Retirer', d3: 'Retirer', c4: 'Équipe', d4: 'Filleuls', c5: 'Transactions', d5: 'Historique', c6: 'Profil', d6: 'Paramètres', m1: 'Accueil', m2: 'Quantification', m3: 'Dépôt', m4: 'Retirer', m5: 'Transaction', m6: 'Profil', m7: 'Support', m_about: 'À propos', m8: 'Sortie', tMkt: 'Marché Crypto', tLive: 'EN DIRECT', tNode: 'Serveur Actif', phoneErr: 'Le numéro de téléphone est obligatoire.', modalTitle: 'Messages Admin', noMsg: 'Aucun nouveau message de l’administrateur.' },
de: { wel: 'Willkommen', sub: 'Dashboard', st: 'Verifiziert', s1: 'Guthaben', s2: 'Empfehlungen', c1: 'Quantifizierung', d1: 'Intelligenter Handel', c2: 'Einzahlen', d2: 'Konto aufladen', c3: 'Abheben', d3: 'Abheben', c4: 'Team', d4: 'Empfehlungen', c5: 'Transaktionen', d5: 'Historie', c6: 'Profil', d6: 'Einstellungen', m1: 'Startseite', m2: 'Quantifizierung', m3: 'Einzahlen', m4: 'Abheben', m5: 'Transaktion', m6: 'Profil', m7: 'Support', m_about: 'Über uns', m8: 'Abmelden', tMkt: 'Krypto-Markt', tLive: 'LIVE', tNode: 'Server Aktiv', phoneErr: 'Telefonnummer ist erforderlich.', modalTitle: 'Admin-Nachrichten', noMsg: 'Keine neuen Nachrichten vom Admin.' }
};

async function fetchUserMessages(uid) {
try {
let snap = await getDocs(collection(db, "users", uid, "notifications"));
let messages = snap.docs.map(d => {
let dt = d.data();
return { id: d.id, subject: dt.title || dt.subject || 'Announcement', body: dt.message || dt.text || dt.body || '', time: dt.createdAt || dt.timestamp || dt.time || new Date().toISOString(), read: dt.read === true || dt.isRead === true };
});
messages.sort((a, b) => {
const getTimeMs = t => !t ? 0 : typeof t.toDate === 'function' ? t.toDate().getTime() : typeof t.seconds === 'number' ? t.seconds * 1000 : isNaN(new Date(t).getTime()) ? 0 : new Date(t).getTime();
return getTimeMs(b.time) - getTimeMs(a.time);
});
return messages;
} catch (e) { console.error(e); return []; }
}

window.openMessageModal = async () => {
let c = document.getElementById('modal-msg-container'), t = ld[currLang] || ld.fa;
if (currentUserId) {
allMessages = await fetchUserMessages(currentUserId);
let unread = allMessages.filter(m => !m.read).length, b = document.getElementById('bell-badge');
if (b) { b.textContent = unread; b.classList.toggle('show', unread > 0); }
}
if (allMessages.length > 0) renderMessageList();
else c.innerHTML = <div style="text-align:center;padding:20px;color:#94a3b8">${t.noMsg}</div>;
document.getElementById('m-msg')?.classList.add('show');
};

function renderMessageList() {
let c = document.getElementById('modal-msg-container'), html = '';
allMessages.forEach((m, idx) => {
let dTime = m.time ? (d => isNaN(d.getTime()) ? String(m.time) : d.toUTCString())(typeof m.time.toDate === 'function' ? m.time.toDate() : new Date(m.time)) : '';
let unread = !m.read;
html += <div class="msg-body-box" style="cursor:pointer;border-right:${unread ? '3px solid #38bdf8' : '1px solid rgba(255,255,255,.08)'};" onclick="window.readAdminMessage(${idx})"> <div style="display:flex;justify-content:space-between;align-items:center;"> <div class="msg-title-text" style="${unread ? 'color:#fff;font-weight:800;' : ''}"><i class="fas fa-envelope${unread ? '' : '-open'}-text" style="color:#38bdf8;margin-left:5px;"></i> ${m.subject}</div> ${unread ? '<span style="font-size:9px;background:#38bdf8;color:#0f172a;padding:2px 6px;border-radius:4px;font-weight:700;">جدید</span>' : ''} </div> <div class="msg-desc-text" style="margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${m.body}</div> <div style="font-size:10px;color:#64748b;margin-top:6px;text-align:left" dir="ltr">${dTime}</div> </div>;
});
c.innerHTML = html;
}

window.readAdminMessage = async idx => {
let m = allMessages[idx]; if (!m) return;
if (!m.read && currentUserId && m.id) {
allMessages[idx].read = true;
try {
await updateDoc(doc(db, "users", currentUserId, "notifications", m.id), { read: true, isRead: true });
let unread = allMessages.filter(i => !i.read).length, b = document.getElementById('bell-badge');
if (b) { b.textContent = unread; b.classList.toggle('show', unread > 0); }
} catch (e) { console.error(e); }
}
let c = document.getElementById('modal-msg-container'), dTime = m.time ? (d => isNaN(d.getTime()) ? String(m.time) : d.toUTCString())(typeof m.time.toDate === 'function' ? m.time.toDate() : new Date(m.time)) : '';
c.innerHTML = <button onclick="renderMessageList()" style="background:transparent;border:none;color:#38bdf8;font-size:12px;cursor:pointer;margin-bottom:12px;"><i class="fas fa-arrow-right"></i> بازگشت به لیست پیام‌ها</button><div style="color:#fff;font-weight:bold;font-size:14px;margin-bottom:8px;">${m.subject}</div><div style="font-size:10px;color:#64748b;margin-bottom:12px;" dir="ltr">${dTime}</div><div style="font-size:12px;color:#cbd5e1;line-height:1.6;white-space:pre-wrap;">${m.body}</div>;
};

window.closeMessageModal = () => { document.getElementById('m-msg')?.classList.remove('show'); document.getElementById('m-message')?.classList.remove('show'); };
window.closeMsgModal = window.closeMessageModal;
window.closeHelpModal = () => document.getElementById('m-help')?.classList.remove('show');
window.closeAboutModal = () => document.getElementById('m-about')?.classList.remove('show');
window.openHelpModal = () => document.getElementById('m-help')?.classList.add('show');
window.openAboutModal = () => document.getElementById('m-about')?.classList.add('show');

document.getElementById('bell-btn')?.addEventListener('click', e => { e.stopPropagation(); window.openMessageModal(); });
document.getElementById('help-btn')?.addEventListener('click', e => { e.stopPropagation(); window.openHelpModal(); });
window.addEventListener('pageshow', () => document.querySelectorAll('.menu').forEach(x => x.classList.remove('show')));

onAuthStateChanged(auth, async u => {
if (!u) { window.location.href = 'index.html'; return; }
currentUserId = u.uid;
try {
let d = await getDoc(doc(db, "users", u.uid));
if (d.exists()) {
let data = d.data();
uName = data.fullName || data.fullname || data.name || "";
setLang(currLang);
let numericBalance = parseFloat(data.balance ?? data.depositAmount ?? data.wallet ?? data.amount ?? 0);
if (isNaN(numericBalance)) numericBalance = 0;
let elBal = document.getElementById('val-balance');
if (elBal) elBal.textContent = $${numericBalance.toFixed(2)};

  let totalRef = 0, refCode = data.referralCode;
  if (refCode) {
    try {
      let snapAll = await getDocs(collection(db, "users")), allUsers = [];
      snapAll.forEach(ds => allUsers.push(ds.data()));
      let l1 = allUsers.filter(i => i.referredBy === refCode),
          l1c = l1.map(i => i.referralCode).filter(Boolean),
          l2 = allUsers.filter(i => l1c.includes(i.referredBy)),
          l2c = l2.map(i => l1c.includes(i.referredBy)),
          l3 = allUsers.filter(i => l2c.includes(i.referredBy));
      totalRef = l1.length + l2.length + l3.length;
    } catch (refErr) {
      totalRef = Number(data.totalReferrals || data.refCount || 0) || (Number(data.gen1Count || data.generation1 || 0) + Number(data.gen2Count || data.generation2 || 0) + Number(data.gen3Count || data.generation3 || 0));
    }
  } else {
    totalRef = Number(data.totalReferrals || data.refCount || 0) || (Number(data.gen1Count || data.generation1 || 0) + Number(data.gen2Count || data.generation2 || 0) + Number(data.gen3Count || data.generation3 || 0));
  }
  let elRef = document.getElementById('val-ref'); if (elRef) elRef.textContent = totalRef;

  allMessages = await fetchUserMessages(u.uid);
  let unread = allMessages.filter(m => !m.read).length, b = document.getElementById('bell-badge');
  if (b && unread > 0) { b.textContent = unread; b.classList.add('show'); }

  let phone = data.phone || data.phoneNumber;
  if (!phone) {
    localStorage.setItem('profile_error', (ld[currLang] || ld.fa).phoneErr);
    window.location.replace('profile.html');
    return;
  }
}


} catch (e) { console.error("خطا در دریافت اطلاعات کاربر:", e); }
});

const mBtn = document.getElementById('menu-btn'), nMenu = document.getElementById('nav-menu'), lBtn = document.getElementById('lang-btn'), lMenu = document.getElementById('lang-menu');
function toggleM(m, e) { e?.stopPropagation(); [nMenu, lMenu].forEach(x => { if (x && x !== m) x.classList.remove('show'); }); m?.classList.toggle('show'); }
mBtn?.addEventListener('click', e => toggleM(nMenu, e));
lBtn?.addEventListener('click', e => toggleM(lMenu, e));
document.addEventListener('click', e => { if (!e.target.closest('.menu') && !e.target.closest('#menu-btn') && !e.target.closest('#lang-btn')) [nMenu, lMenu].forEach(x => x?.classList.remove('show')); });
window.addEventListener('scroll', () => [nMenu, lMenu].forEach(x => x?.classList.remove('show')));
document.querySelectorAll('.menu').forEach(m => m.addEventListener('click', e => e.stopPropagation()));

function setLang(l) {
currLang = l; localStorage.setItem('zenix_lang', l);
[nMenu, lMenu].forEach(x => x?.classList.remove('show'));
let t = ld[l] || ld.fa, r = l === 'fa' || l === 'ar';
document.documentElement.setAttribute('dir', r ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', l);
for (let i = 1; i <= 6; i++) { let el = document.getElementById('i' + i); if (el) el.className = r ? 'fas fa-chevron-left' : 'fas fa-chevron-right'; }
let elWel = document.getElementById('t-wel'); if (elWel) elWel.textContent = uName ? (t.wel + '، ' + uName) : t.wel;
['t-sub', 't-st', 'ts1', 'ts2'].forEach((id, idx) => { let el = document.getElementById(id); if (el) el.textContent = t[['sub', 'st', 's1', 's2'][idx]]; });
let elMkt = document.getElementById('t-mkt'); if (elMkt) elMkt.innerHTML = ' ' + t.tMkt;
let elLive = document.getElementById('t-live'); if (elLive) elLive.textContent = t.tLive;
let elNode = document.getElementById('t-node'); if (elNode) elNode.textContent = t.tNode;
let elModalTitle = document.getElementById('t-modal-title'); if (elModalTitle) elModalTitle.textContent = t.modalTitle;
let elAbout = document.getElementById('m_about'); if (elAbout) elAbout.textContent = t.m_about;
for (let i = 1; i <= 6; i++) {
let c = document.getElementById('c' + i), d = document.getElementById('d' + i);
if (c) c.textContent = t['c' + i] || '';
if (d) d.textContent = t['d' + i] || '';
}
for (let i = 1; i <= 8; i++) { let m = document.getElementById('m' + i); if (m) m.textContent = t['m' + i] || ''; }
}

document.querySelectorAll('#lang-menu .mi').forEach(i => i.addEventListener('click', () => setLang(i.dataset.lang)));
document.getElementById('logout-btn')?.addEventListener('click', async e => { e.preventDefault(); try { await signOut(auth); } catch (e) {} localStorage.clear(); window.location.href = 'index.html'; });
setLang(currLang);

const rawCrypto = [
['btc','Bitcoin','BTC',94517.19,'fab fa-bitcoin','#f7931a',1.85],
['eth','Ethereum','ETH',3480.20,'fab fa-ethereum','#627eea',2.12],
['sol','Solana','SOL',189.30,'fas fa-sun','#14f195',3.41],
['bnb','Binance Coin','BNB',615.40,'fas fa-cube','#f3ba2f',0.95],
['xrp','XRP','XRP',1.45,'fas fa-bolt','#23292f',4.20],
['doge','Dogecoin','DOGE',0.38,'fas fa-dog','#c2a633',5.65],
['ada','Cardano','ADA',0.75,'fas fa-circle-nodes','#0033ad',1.10],
['avax','Avalanche','AVAX',32.40,'fas fa-mountain','#e84142',2.30],
['link','Chainlink','LINK',18.50,'fas fa-link','#375bd2',2.80],
['matic','Polygon','MATIC',0.55,'fas fa-chess-board','#8247e5',1.50],
['uni','Uniswap','UNI',8.20,'fas fa-code-branch','#ff007a',0.40],
['dot','Polkadot','DOT',7.10,'fas fa-circle','#e6007a',-0.50],
['ltc','Litecoin','LTC',85.40,'fas fa-litecoin','#345d9d',1.20],
['bch','Bitcoin Cash','BCH',380.00,'fab fa-bitcoin','#8dc351',3.10],
['near','NEAR Protocol','NEAR',5.40,'fas fa-network-wired','#000000',4.50],
['apt','Aptos','APT',9.20,'fas fa-layer-group','#222222',2.10],
['sui','Sui','SUI',3.10,'fas fa-water','#3d70b2',6.20],
['atom','Cosmos','ATOM',6.50,'fas fa-globe','#2e3148',-1.20],
['arb','Arbitrum','ARB',0.75,'fas fa-feather','#28a0f0',1.80],
['op','Optimism','OP',1.80,'fas fa-shield-alt','#ff0420',2.40],
['inj','Injective','INJ',24.50,'fas fa-syringe','#00f2fe',5.10],
['render','Render','RENDER',7.80,'fas fa-server','#b53636',3.80],
['fet','Artificial Superintelligence','FET',1.40,'fas fa-brain','#1d2859',4.10],
['tao','Bittensor','TAO',450.00,'fas fa-brain','#ffffff',7.50],
['shib','Shiba Inu','SHIB',0.000025,'fas fa-dog','#e4a81d',3.20],
['pepe','Pepe','PEPE',0.000012,'fas fa-frog','#3d9970',8.40],
['bonk','Bonk','BONK',0.000022,'fas fa-bone','#e65c00',5.90],
['floki','Floki','FLOKI',0.00015,'fas fa-shield-dog','#b8860b',2.60],
['trx','TRON','TRX',0.24,'fas fa-gem','#ff0000',0.80],
['xlm','Stellar','XLM',0.35,'fas fa-star','#14b6eb',1.90],
['etc','Ethereum Classic','ETC',28.90,'fab fa-ethereum','#3cfa70',-0.40],
['fil','Filecoin','FIL',5.20,'fas fa-file','#0090ff',1.30],
['algo','Algorand','ALGO',0.28,'fas fa-project-diagram','#000000',2.20],
['hbar','Hedera','HBAR',0.18,'fas fa-cube','#222222',3.50],
['vet','VeChain','VET',0.035,'fas fa-check-double','#15abd8',0.60],
['grt','The Graph','GRT',0.21,'fas fa-project-diagram','#6f4cff',2.50],
['ftm','Fantom','FTM',0.72,'fas fa-ghost','#1969ff',4.80],
['mkr','Maker','MKR',2100.00,'fas fa-coins','#1aab9b',0.30],
['aave','Aave','AAVE',180.00,'fas fa-ghost','#b6509e',3.60],
['kava','Kava','KAVA',0.62,'fas fa-shield-alt','#ff433e',1.40],
['crv','Curve DAO','CRV',0.42,'fas fa-chart-pie','#ff3333',-0.80],
['snx','Synthetix','SNX',1.90,'fas fa-wave-square','#00d1b2',2.00],
['comp','Compound','COMP',58.00,'fas fa-university','#00d395',0.90],
['cake','PancakeSwap','CAKE',2.40,'fas fa-birthday-cake','#d18844',1.70],
['flow','Flow','FLOW',0.75,'fas fa-water','#00ef8b',2.30],
['sand','The Sandbox','SAND',0.38,'fas fa-cube','#0084ff',3.90],
['mana','Decentraland','MANA',0.39,'fas fa-vr-cardboard','#ff2d55',1.60],
['theta','Theta Network','THETA',2.20,'fas fa-video','#00a3e0',2.70],
['axs','Axie Infinity','AXS',5.10,'fas fa-gamepad','#0055ff',3.00],
['chz','Chiliz','CHZ',0.075,'fas fa-futbol','#cd0101',1.90]
];

const cryptoPool = rawCrypto.map(([id, name, symbol, price, cls, color, change]) => ({ id, name, symbol, price, cls, color, change }));

function renderTop3() {
let c = document.getElementById('crypto-ticker-list'); if (!c) return;
const famousCoins = cryptoPool.filter(coin => ['btc', 'eth', 'sol'].includes(coin.id));
c.innerHTML = '';
famousCoins.forEach(coin => {
let up = coin.change >= 0, pCls = up ? 'price-up' : 'price-down';
c.innerHTML += <div class="crypto-row" id="crypto-row-${coin.id}"> <div class="crypto-info"> <div class="crypto-icon" style="background:${coin.color};"><i class="${coin.cls}"></i></div> <div> <div style="font-weight:bold;color:#f8fafc;">${coin.symbol}</div> <div style="font-size:10px;color:#94a3b8;">${coin.name}</div> </div> </div> <div style="text-align:right;"> <div class="${pCls}">$${coin.price < 1 ? coin.price.toFixed(6) : (coin.price < 10 ? coin.price.toFixed(3) : coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</div> <div style="font-size:10px;" class="${pCls}">${up ? '+' : ''}${coin.change.toFixed(2)}%</div> </div> </div>;
});
}

setInterval(() => {
cryptoPool.forEach(coin => {
coin.price = Math.max(0.000001, coin.price + (Math.random() - 0.48) * (coin.price * 0.001));
coin.change += (Math.random() - 0.47) * 0.15;
});
renderTop3();
}, 2000);

renderTop3();
