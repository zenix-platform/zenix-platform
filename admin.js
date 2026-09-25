<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Zenix - Admin Panel</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        *{box-sizing:border-box;margin:0;padding:0;font-family:'Plus Jakarta Sans','Vazirmatn',sans-serif}
        body{background:#030712;min-height:100vh;color:#f8fafc;display:flex;flex-direction:column}
        header{background:rgba(15,23,42,.9);border-bottom:1px solid rgba(255,255,255,.1);padding:10px 18px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;backdrop-filter:blur(10px)}
        .logo{display:flex;align-items:center;gap:10px}
        .logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#ef4444,#9333ea);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Orbitron',sans-serif;font-size:18px;font-weight:900;font-style:italic;transform:skewX(-6deg);box-shadow:0 0 15px rgba(239,68,68,.4)}
        .logo-text{font-family:'Orbitron',sans-serif;font-size:19px;font-weight:900;letter-spacing:2px;font-style:italic;transform:skewX(-6deg);background:linear-gradient(135deg,#f87171,#c084fc,#f43f5e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 20px rgba(248,113,113,0.4)}
        .hr{display:flex;align-items:center;gap:8px}.wrap{position:relative}
        .lb{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);height:36px;width:36px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;color:#38bdf8;text-decoration:none}
        .badge{position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;font-size:9px;width:16px;height:16px;border-radius:50%;display:none;align-items:center;justify-content:center;font-weight:700}.badge.show{display:flex}
        .menu{display:none;position:absolute;top:42px;background:#0f172a;border:1px solid rgba(255,255,255,.2);border-radius:8px;min-width:170px;padding:6px;z-index:999;box-shadow:0 8px 25px rgba(0,0,0,.8)}
        [dir="rtl"] .wrap .menu{left:0}[dir="ltr"] .wrap .menu{right:0}.menu.show{display:block}
        .mi{padding:7px 10px;font-size:12px;color:#cbd5e1;cursor:pointer;border-radius:6px;display:flex;align-items:center;gap:8px;text-decoration:none}
        .mi:hover{background:rgba(56,189,248,.2);color:#38bdf8}
        .c{max-width:1000px;width:100%;margin:15px auto;padding:0 12px;flex:1}
        .wel{background:linear-gradient(135deg,rgba(239,68,68,.15),rgba(147,51,234,.15));border:1px solid rgba(239,68,68,.3);border-radius:12px;padding:15px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
        .wel h1{font-size:16px;margin-bottom:3px;color:#f87171}.wel p{color:#94a3b8;font-size:11px}
        .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px}
        .sc{border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;position:relative;overflow:hidden}
        .sc-bal{background:linear-gradient(135deg,rgba(15,23,42,.95),rgba(14,165,233,.18));border:1px solid rgba(56,189,248,.4)}
        .sc-ref{background:linear-gradient(135deg,rgba(15,23,42,.95),rgba(239,68,68,.18));border:1px solid rgba(239,68,68,.4)}
        .sc-bal .si{width:40px;height:40px;background:rgba(56,189,248,.2);border:1px solid #38bdf8;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#38bdf8;font-size:16px}
        .sc-ref .si{width:40px;height:40px;background:rgba(239,68,68,.2);border:1px solid #ef4444;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#f87171;font-size:16px}
        .sn span{font-size:11px;color:#94a3b8;display:block;margin-bottom:2px}.sn h3{font-size:16px;font-weight:800;color:#fff}
        
        /* استایل جدول مدیریت کاربران */
        .table-box{background:rgba(15,23,42,.85);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px;margin-bottom:12px;overflow-x:auto}
        table{width:100%;border-collapse:collapse;text-align:right;font-size:12px}
        th,td{padding:10px;border-bottom:1px solid rgba(255,255,255,.08)}
        th{color:#94a3b8;font-weight:600}
        .btn-edit{background:#38bdf8;color:#0f172a;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:11px}
        .btn-edit:hover{background:#0284c7;color:#fff}
        .btn-logout{background:rgba(239,68,68,.2);border:1px solid #ef4444;color:#ef4444;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:11px}
        .btn-logout:hover{background:#ef4444;color:#fff}

        .modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(2,6,23,.85);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(10px)}.modal.show{display:flex}
        .modal-content{background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(56,189,248,.3);border-radius:20px;width:100%;max-width:440px;max-height:85vh;display:flex;flex-direction:column;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.9)}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;color:#38bdf8;font-weight:800;font-size:14px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:10px}
        .modal-close{background:rgba(255,255,255,.05);border:none;color:#94a3b8;cursor:pointer;font-size:14px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .modal-close:hover{background:rgba(239,68,68,.2);color:#ef4444}
        footer{text-align:center;padding:10px;font-size:11px;color:#64748b;border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center;max-width:1000px;margin:0 auto;width:100%;padding-left:12px;padding-right:12px}
    </style>
</head>
<body>
    <header>
        <div class="logo"><div class="logo-icon"><i class="fas fa-shield-alt"></i></div><div class="logo-text">ZENIX ADMIN</div></div>
        <div class="hr">
            <div class="wrap"><button type="button" class="lb" id="help-btn" title="راهنمای پنل ادمین"><i class="fas fa-circle-question" style="color:#38bdf8"></i></button></div>
            <a href="dashboard.html" class="lb" title="بازگشت به داشبورد"><i class="fas fa-home" style="color:#22c55e"></i></a>
            <span id="admin-email" style="font-size:11px;color:#94a3b8;margin-right:8px;">در حال بررسی...</span>
            <button id="logout-btn" class="btn-logout"><i class="fas fa-power-off"></i> خروج</button>
        </div>
    </header>

    <div class="c">
        <div class="wel">
            <div>
                <h1>پنل مدیریت اختصاصی Zenix</h1>
                <p>مدیریت اعضا، موجودی‌ها و سطح دسترسی‌ها</p>
            </div>
            <div style="font-size:11px;background:rgba(239,68,68,.2);border:1px solid #ef4444;padding:4px 8px;border-radius:6px;color:#f87171">
                <i class="fas fa-user-shield"></i> <span>مدیر کل</span>
            </div>
        </div>

        <!-- کارت‌های آمار ادمین -->
        <div class="stats">
            <div class="sc sc-bal">
                <div class="si"><i class="fas fa-users" style="color:#38bdf8"></i></div>
                <div class="sn"><span>کل کاربران</span><h3 id="stat-total-users">0</h3></div>
            </div>
            <div class="sc sc-ref">
                <div class="si"><i class="fas fa-wallet" style="color:#f87171"></i></div>
                <div class="sn"><span>مجموع موجودی‌ها</span><h3 id="stat-total-balance">$0.00</h3></div>
            </div>
        </div>

        <!-- جدول مدیریت کاربران -->
        <div class="table-box">
            <h3 style="font-size:14px;color:#38bdf8;margin-bottom:12px;"><i class="fas fa-users-cog"></i> لیست کاربران ثبت‌نام شده</h3>
            <table>
                <thead>
                    <tr>
                        <th>شناسه (UID)</th>
                        <th>ایمیل / کاربر</th>
                        <th>موجودی ($)</th>
                        <th>نقش (Role)</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody id="users-table-body">
                    <tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:20px;">در حال بارگذاری اطلاعات از پایگاه داده...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- مدال راهنما -->
    <div class="modal" id="m-help">
        <div class="modal-content">
            <div class="modal-header"><span>راهنمای پنل ادمین</span><button class="modal-close" onclick="document.getElementById('m-help').classList.remove('show')"><i class="fas fa-times"></i></button></div>
            <div style="font-size:12px;color:#cbd5e1;line-height:1.6">
                از این پنل می‌توانید موجودی هر کاربر را ویرایش کنید یا دسترسی‌های آن‌ها را مدیریت نمایید.
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; 2026 Zenix. All rights reserved.</p>
        <p style="color:#22c55e;"><i class="fas fa-circle" style="font-size:6px;"></i> <span>سرور ادمین فعال</span></p>
    </footer>

    <!-- اتصال فایل ادمین جی‌اس -->
    <script type="module" src="admin.js"></script>
</body>
</html>
