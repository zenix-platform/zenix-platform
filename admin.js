import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    collection, 
    getDocs, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ۱. تنظیمات فایربیس پروژه خود را در این قسمت جایگزین کنید
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// مقداردهی فایربیس
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ۲. بررسی سطح دسترسی کاربر لاگین‌شده
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // اگر کاربر لاگین نکرده باشد، به صفحه ورود منتقل می‌شود
        window.location.href = "index.html";
        return;
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // اگر کاربر در Firestore نباشد یا فیلد role آن admin نباشد
        if (!userDocSnap.exists() || userDocSnap.data().role !== "admin") {
            alert("دسترس غیرمجاز! حساب شما سطح دسترسی مدیریت (admin) ندارد.");
            window.location.href = "dashboard.html";
            return;
        }

        // احراز هویت موفقیت‌آمیز
        document.getElementById("admin-email").innerText = user.email || user.uid;
        loadAdminDashboard();

    } catch (error) {
        console.error("خطا در بررسی دسترسی ادمین:", error);
        alert("خطایی در تایید سطح دسترسی رخ داد.");
        window.location.href = "dashboard.html";
    }
});

// ۳. دریافت و نمایش لیست کاربران از Firestore
async function loadAdminDashboard() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const tableBody = document.getElementById("users-table-body");
        tableBody.innerHTML = "";

        let totalBalance = 0;
        let totalUsers = 0;

        querySnapshot.forEach((docSnap) => {
            totalUsers++;
            const data = docSnap.data();
            const balance = parseFloat(data.balance || 0);
            totalBalance += balance;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td style="font-size:11px;color:#64748b;">${docSnap.id.substring(0, 8)}...</td>
                <td>${data.email || data.name || 'کاربر بدون نام'}</td>
                <td style="color:#22c55e;font-weight:bold;">$${balance.toFixed(2)}</td>
                <td><span style="color:${data.role === 'admin' ? '#ef4444' : '#38bdf8'}">${data.role || 'user'}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="editUserBalance('${docSnap.id}', ${balance})">تغییر موجودی</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById("stat-total-users").innerText = totalUsers;
        document.getElementById("stat-total-balance").innerText = "$" + totalBalance.toFixed(2);

    } catch (error) {
        console.error("خطا در دریافت لیست کاربران:", error);
    }
}

// ۴. تابع ویرایش موجودی کاربر توسط ادمین
window.editUserBalance = async function(userId, currentBalance) {
    const newBalance = prompt("موجودی جدید دلار را وارد کنید:", currentBalance);
    if (newBalance !== null && !isNaN(newBalance)) {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { balance: parseFloat(newBalance) });
            alert("موجودی کاربر با موفقیت بروزرسانی شد.");
            loadAdminDashboard();
        } catch (error) {
            alert("خطا در بروزرسانی موجودی: " + error.message);
        }
    }
};

// ۵. خروج از حساب
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});
