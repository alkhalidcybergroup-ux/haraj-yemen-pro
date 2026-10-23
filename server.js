const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// قاعدة بيانات مؤقتة في الذاكرة (أو ربطها بـ MongoDB)
let adsDatabase = [];

// API لجلب الإعلانات
app.get('/api/ads', (req, res) => {
    res.json(adsDatabase);
});

// API لإضافة إعلان جديد
app.post('/api/ads', (req, res) => {
    const { title, category, price, phone, details } = req.body;
    
    if (!title || !price || !phone || !details) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const newAd = {
        id: Date.now(),
        title,
        category: category || 'عام',
        price,
        phone,
        details,
        createdAt: new Date()
    };

    adsDatabase.unshift(newAd);
    res.status(201).json({ success: true, message: 'تم نشر الإعلان بنجاح', ad: newAd });
});

// API لطلب توثيق المتجر
app.post('/api/verify', (req, res) => {
    const { storeName, phone } = req.body;
    if (!storeName || !phone) {
        return res.status(400).json({ error: 'يرجى إدخال اسم المتجر ورقم الهاتف' });
    }
    res.json({ success: true, message: 'تم استلام طلب التوثيق بنجاح! سيتم مراجعته والتواصل معكم.' });
});

// إعادة توجيه كافة المسارات لصفحة index.html (PWA Support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// منع خادم Render من النوم (Keep-Alive Self-Ping)
const RENDER_URL = 'https://haraj-yemen-pro.onrender.com';
setInterval(() => {
    https.get(RENDER_URL, (res) => {
        console.log(`Keep-Alive Ping Sent - Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.log('Keep-Alive Error:', err.message);
    });
}, 10 * 60 * 1000); // كل 10 دقائق

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
