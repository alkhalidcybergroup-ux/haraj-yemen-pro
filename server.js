const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// رابط الاتصال بقاعدة البيانات السحابية
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jdjdjshsvhdhdhejej_db_user:z3ifoHkRH0gfriLyz@cluster0.p0qsokq.mongodb.net/haraj_yemen?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة بيانات MongoDB Atlas بنجاح!'))
  .catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// تعريف مخطط الإعلان (Ad Schema)
const adSchema = new mongoose.Schema({
  title: String,
  price: String,
  currency: String,
  category: String,
  city: String,
  phone: String,
  details: String,
  image: String,
  isFeatured: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Ad = mongoose.model('Ad', adSchema);

// جلب جميع الإعلانات
app.get('/api/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: 'فشل في جلب الإعلانات' });
  }
});

// إضافة إعلان جديد
app.post('/api/ads', async (req, res) => {
  try {
    const newAd = new Ad(req.body);
    await newAd.save();
    res.status(201).json(newAd);
  } catch (err) {
    res.status(500).json({ error: 'فشل في حفظ الإعلان' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
