async function fetchUserMessages(uid) {
  try {
    let snap = await getDocs(collection(db, "users", uid, "notifications"));
    let messages = snap.docs.map(d => {
      let dt = d.data();
      return {
        id: d.id,
        subject: dt.title || dt.subject || 'Announcement',
        body: dt.message || dt.text || dt.body || '',
        time: dt.createdAt || dt.timestamp || dt.time || new Date().toISOString(),
        read: dt.read === true || dt.isRead === true
      };
    });

    // مرتب‌سازی پیام‌ها از جدیدترین به قدیمی‌ترین بر اساس تاریخ و ساعت
    messages.sort((a, b) => {
      const getTimeMs = (timeVal) => {
        if (!timeVal) return 0;
        if (typeof timeVal.toDate === 'function') return timeVal.toDate().getTime();
        if (typeof timeVal.seconds === 'number') return timeVal.seconds * 1000;
        const parsed = new Date(timeVal).getTime();
        return isNaN(parsed) ? 0 : parsed;
      };
      return getTimeMs(b.time) - getTimeMs(a.time);
    });

    return messages;
  } catch (e) {
    console.error("خطا در دریافت پیام‌ها:", e);
    return [];
  }
}
