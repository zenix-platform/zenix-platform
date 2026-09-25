import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// تنظیمات واقعی فایربیس پروژه شما (zenix-platform)
const firebaseConfig = {
    apiKey: "AIzaSyAqIksPfjCCQZNQDVx3MEdDyJyNMaTvtlk",
    authDomain: "zenix-platform.firebaseapp.com",
    projectId: "zenix-platform",
    storageBucket: "zenix-platform.firebasestorage.app",
    messagingSenderId: "594936010622",
    appId: "1:594936010622:web:9f4159c80111245062052f",
    measurementId: "G-LXSGYB8WKM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let allUsersCache = [];

// کنترلرهای سراسری مدال‌ها جهت هماهنگی با قالب شما
window.openMessageModal = () => { document.getElementById('m-msg')?.classList.add('show'); };
window.closeMessageModal = () => { document.getElementById('m-msg')?.classList.remove('show'); };
window.openHelpModal = () => { document.getElementById('m-help')?.classList.add('show'); };
window.closeHelpModal = () => { document.getElementById('m-help')?.classList.remove('show'); };
window.openAboutModal = () => { document.getElementById('m-about')?.classList.add('show'); };
window.closeAboutModal = () => { document.getElementById('m-about')?.classList.remove('show'); };

// بررسی سطح دسترسی ادمین (Auth Guard)
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // اگر کاربر نقش ادمین نداشت، برگردد به داشبورد معمولی
        if (!userDocSnap.exists() || userDocSnap.data().role !== "admin") {
            alert("دسترسی غیرمجاز! حساب شما سطح مدیریت ندارد.");
            window.location.href = "dashboard.html";
            return;
        }

        // اگر ادمین بود، اطلاعات جدول و آمار بارگذاری شود
        loadAdminDashboardData();

    } catch (error) {
        console.error("خطا در بررسی دسترسی ادمین:", error);
        window.location.href = "dashboard.html";
    }
});

// دریافت لیست کل کاربران و محاسبه آمار
async function loadAdminDashboardData() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        allUsersCache = [];
        let totalBalance = 0;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const balance = parseFloat(data.balance || 0);
            totalBalance += balance;
            allUsersCache.push({ id: docSnap.id, ...data, balance });
        });

        // نمایش آمار در کارت‌های بالای صفحه
        const totalUsersEl = document.getElementById("val-ref");
        if (totalUsersEl) totalUsersEl.innerText = allUsersCache.length;

        const totalBalEl = document.getElementById("val-balance");
        if (totalBalEl) totalBalEl.innerText = "$" + totalBalance.toFixed(2);

        // رندر جدول کاربران
        renderUsersTable(allUsersCache);

    } catch (error) {
        console.error("خطا در بارگذاری اطلاعات ادمین:", error);
    }
}

// تابع رندر جدول کاربران در صفحه
function renderUsersTable(users) {
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px; color:#94a3b8;">هیچ کاربری یافت نشد.</td></tr>`;
        return;
    }

    users.forEach((u) => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
        row.innerHTML = `
            <td style="padding:10px; font-size:11px; color:#64748b;">${u.id.substring(0, 8)}...</td>
            <td style="padding:10px; color:#f8fafc;">${u.email || u.name || 'بدون نام'}</td>
            <td style="padding:10px; color:#22c55e; font-weight:bold;">$${u.balance.toFixed(2)}</td>
            <td style="padding:10px;"><span style="color:${u.role === 'admin' ? '#ef4444' : '#38bdf8'}">${u.role || 'user'}</span></td>
            <td style="padding:10px;">
                <button style="background:#38bdf8; color:#0f172a; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; font-size:11px; font-weight:bold;" onclick="editUserAccount('${u.id}', ${u.balance}, '${u.role || 'user'}')">ویرایش</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تابع ویرایش موجودی یا نقش کاربر توسط ادمین
window.editUserAccount = async function(userId, currentBalance, currentRole) {
    const newBalance = prompt("موجودی جدید دلاری را وارد کنید:", currentBalance);
    if (newBalance === null) return;

    const newRole = prompt("نقش جدید کاربر را وارد کنید (user یا admin):", currentRole);
    if (newRole === null) return;

    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { 
            balance: parseFloat(newBalance) || 0,
            role: newRole.trim().toLowerCase()
        });
        alert("اطلاعات کاربر با موفقیت بروزرسانی شد.");
        loadAdminDashboardData();
    } catch (error) {
        alert("خطا در بروزرسانی: " + error.message);
    }
};

// جستجوی زنده و دکمه خروج
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("admin-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allUsersCache.filter(u => (u.email || '').toLowerCase().includes(query));
            renderUsersTable(filtered);
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                window.location.href = "index.html";
            });
        });
    }
});
