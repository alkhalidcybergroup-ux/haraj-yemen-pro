const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let adsDatabase = [];

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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
