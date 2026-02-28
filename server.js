/* AUTO-GENERATED server.js - no redirect middleware (to avoid redirect loops) */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

/* Store info (basic) */
const thongTinCuaHang = {
  tenShop: "Hoa Tươi Thanh Ngọc",
  slogan: "Thay Lời Muốn Nói, Gửi Trọn Yêu Thương",
  diaChi: "8 Phan Văn Hân, Phường 19, Bình Thạnh, TP.HCM",
  dienThoai: "0777 110 959",
  zalo: "0777110959"
};

// Try to load existing SEO dictionary if present (optional)
let tuDienSEO = {};
try {
  // if you have a separate tuDienSEO.json, it will be loaded. otherwise keep empty.
  const possible = path.join(__dirname, 'tuDienSEO.json');
  if (fs.existsSync(possible)) {
    tuDienSEO = JSON.parse(fs.readFileSync(possible,'utf8'));
  }
} catch(e) { tuDienSEO = {}; }

// helper functions
function chuanHoaTen(str) { if (!str) return ''; return String(str).toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i,'').trim(); }
function taoSlug(str) {
  if (!str) return '';
  let slug = String(str).toLowerCase();
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g,''); // remove diacritics
  slug = slug.replace(/[^0-9a-z\s-]/g,'');
  slug = slug.replace(/\s+/g,'-');
  slug = slug.replace(/-+/g,'-').replace(/^-|-$/g,'');
  return slug;
}
function doanDanhMuc(tenHoa) {
  const t = (tenHoa||'').toLowerCase();
  if (t.includes('khai trương') || t.includes('kệ')) return 'Hoa Khai Trương';
  if (t.includes('bó') || t.includes('hoa cặp')) return 'Bó Hoa';
  if (t.includes('lẵng') || t.includes('giỏ')) return 'Lẵng/Giỏ Hoa';
  if (t.includes('chậu') || t.includes('bình') || t.includes('hộp') || t.includes('để bàn')) return 'Hoa Để Bàn';
  if (t.includes('baby')) return 'Hoa Baby';
  if (t.includes('chia buồn') || t.includes('đám tang')) return 'Hoa Chia Buồn';
  return 'Hoa Thiết Kế';
}

// read images from public folder
const thuMucAnh = path.join(__dirname, 'public');
if (!fs.existsSync(thuMucAnh)) {
  try { fs.mkdirSync(thuMucAnh); } catch(e) {}
}
let cacFileAnh = [];
try {
  cacFileAnh = fs.readdirSync(thuMucAnh).filter(f => {
    const L = f.toLowerCase();
    return L.endsWith('.jpg')||L.endsWith('.jpeg')||L.endsWith('.png')||L.endsWith('.webp');
  });
} catch(e) { cacFileAnh = []; }

// create product list
const danhSachHoa = cacFileAnh.map((tenFile, idx) => {
  const key = chuanHoaTen(tenFile);
  const info = tuDienSEO[key] || {};
  const ten = info.ten || `Mẫu Hoa Thiết Kế #${idx+1}`;
  return {
    id: idx+1,
    slug: `${taoSlug(ten)}-${idx+1}`,
    ten,
    danhMuc: doanDanhMuc(ten),
    hinhAnh: `/${tenFile}`,
    moTa: info.moTa || ''
  };
});

/* ROUTES */
app.get('/', (req, res) => {
  const danhmuc = req.query.danhmuc;
  let ds = danhSachHoa;
  if (danhmuc) ds = danhSachHoa.filter(h => h.danhMuc === danhmuc);
  res.render('trang-chu', { duLieu: thongTinCuaHang, danhSach: ds });
});

app.get('/san-pham/:id_or_slug', (req, res) => {
  const p = req.params.id_or_slug;
  const item = danhSachHoa.find(h => h.slug === p || String(h.id) === String(p));
  if (item) return res.render('chi-tiet', { duLieu: thongTinCuaHang, sanPham: item });
  res.status(404).send('Không tìm thấy sản phẩm! <a href="/">Quay lại</a>');
});

app.get('/blog-1', (req, res) => res.render('blog-1', { duLieu: thongTinCuaHang }));

// health check
app.get('/health', (req, res) => res.json({ status:'ok' }));

app.listen(port, () => console.log(`Server chạy tại: http://localhost:${port}`));
