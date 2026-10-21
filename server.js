
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => cb(null, 'rec-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbPath = './data/db.json';
const getDB = () => JSON.parse(fs.readFileSync(dbPath));
const saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

app.get('/api/data', (req, res) => res.json(getDB()));

app.post('/api/auth', (req, res) => {
    const db = getDB();
    const { phone, name } = req.body;
    let user = db.users.find(u => u.phone === phone);
    if (!user) {
        user = { id: Date.now(), phone, name: name || 'مستخدم يمني', createdAt: new Date() };
        db.users.push(user);
        saveDB(db);
    }
    res.json({ success: true, user });
});

app.post('/api/listings', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'receipt', maxCount: 1 }]), (req, res) => {
    const db = getDB();
    const isPromoted = req.body.isPromoted === 'true';
    
    const newListing = {
        id: Date.now(),
        title: req.body.title,
        price: req.body.price,
        currency: req.body.currency || 'ريال يمني',
        location: req.body.location || 'صنعاء',
        category: req.body.category || 'عام',
        description: req.body.description || '',
        sellerPhone: req.body.sellerPhone || '',
        sellerName: req.body.sellerName || 'مستخدم',
        isPromoted: isPromoted,
        status: isPromoted ? 'pending_payment' : 'active',
        image: req.files && req.files.image ? '/uploads/' + req.files.image[0].filename : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80',
        receipt: req.files && req.files.receipt ? '/uploads/' + req.files.receipt[0].filename : null,
        createdAt: new Date()
    };
    
    db.listings.unshift(newListing);
    saveDB(db);
    res.json({ success: true, listing: newListing });
});

// Admin: Approve Promoted Ad
app.post('/api/admin/approve/:id', (req, res) => {
    const db = getDB();
    const l = db.listings.find(x => x.id == req.params.id);
    if(l) {
        l.status = 'active';
        saveDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, error: 'Not found' });
    }
});

// Admin: Delete Listing
app.delete('/api/admin/delete/:id', (req, res) => {
    const db = getDB();
    db.listings = db.listings.filter(x => x.id != req.params.id);
    saveDB(db);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Haraj Pro V4 with Admin Panel Active on 3000'));
