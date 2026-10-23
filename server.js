const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// معالجة بيانات الطلبات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تحديد مجلد الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// قاعدة بيانات مؤقتة
let adsDatabase = [];

// API الإعلانات
app.get('/api/ads', (req, res) => {
    res.json(adsDatabase);
});

app.post('/api/ads', (req, res) => {
    const { title, category, price, phone, details } = req.body;
    if (!title || !price || !phone || !details) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }
    const newAd = { id: Date.now(), title, category: category || 'عام', price, phone, details, createdAt: new Date() };
    adsDatabase.unshift(newAd);
    res.status(201).json({ success: true, message: 'تم نشر الإعلان بنجاح', ad: newAd });
});

app.post('/api/verify', (req, res) => {
    const { storeName, phone } = req.body;
    if (!storeName || !phone) {
        return res.status(400).json({ error: 'يرجى إدخال اسم المتجر ورقم الهاتف' });
    }
    res.json({ success: true, message: 'تم استلام طلب التوثيق بنجاح! سيتم مراجعته والتواصل معكم.' });
});

// المسار الرئيسي لتشغيل الصفحة
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
