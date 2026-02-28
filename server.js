// @ts-nocheck
/* cspell:disable */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// --- BEGIN: Robust redirect non-www -> www ---
/**
 * Use a robust redirect that:
 * - trusts proxy headers (Render/Cloudflare),
 * - checks x-forwarded-host if present,
 * - redirects only when the original host ends with our domain and does NOT start with 'www.'
 *
 * This prints DEBUG lines prefixed with [REDIRECT-MW] so you can inspect Render logs.
 */
app.set('trust proxy', true);

app.use((req, res, next) => {
  try {
    const hostHeader = (req.headers.host || '').toLowerCase();
    const xfHost = (req.headers['x-forwarded-host'] || '').toLowerCase();
    const originalHost = (xfHost || hostHeader || (req.hostname || '')).split(':')[0];
    const xfProto = (req.headers['x-forwarded-proto'] || '').toLowerCase();

    console.log(`[REDIRECT-MW] hostHeader=${hostHeader} originalHost=${originalHost} x-forwarded-proto=${xfProto} originalUrl=${req.originalUrl}`);

    if (originalHost &&
        originalHost.endsWith('hoatuoithanhngoc.com') &&
        !originalHost.startsWith('www.')) {
      const target = `https://www.hoatuoithanhngoc.com${req.originalUrl || '/'}`;
      console.log(`[REDIRECT-MW] redirecting ${originalHost} -> ${target}`);
      return res.redirect(301, target);
    }
  } catch (err) {
    console.error('[REDIRECT-MW] error', err && (err.stack || err.message || err));
  }
  next();
});
// --- END: Robust redirect non-www -> www ---

// App config
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

// --- THÔNG TIN CỬA HÀNG ---
const thongTinCuaHang = {
  tenShop: "Hoa Tươi Thanh Ngọc",
  slogan: "Thay Lời Muốn Nói, Gửi Trọn Yêu Thương",
  diaChi: "8 Phan Văn Hân, Phường 19, Bình Thạnh, TP.HCM",
  dienThoai: "0777 110 959",
  zalo: "0777110959",
  banDo: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.290575308696!2d106.70275817508892!3d10.78904258935987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4ae1b90159%3A0x6b488cbdd827ed7e!2zOCBQaGFuIFbEg24gSMOibiwgUGjGsOG7nW5nIDE5LCBCw6xuaCBUaOG6oW5oLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
};

// --- TỪ ĐIỂN SEO CHUẨN --- (giữ nguyên dữ liệu bạn đã có)
const tuDienSEO = {
  "hoa-hong.jpg": { ten: "Bó Hoa Hồng Vàng Tươi Sáng", moTa: "Bó hoa hồng vàng mix baby trắng rạng rỡ. Phù hợp tặng tốt nghiệp hoặc chúc mừng thành công." },
  "IMG_3411.JPG": { ten: "Bó Hoa Hồng Dâu Giấy Đen", moTa: "Hoa hồng màu dâu cá tính gói trong giấy đen huyền bí. Tuyệt phẩm để chinh phục phái đẹp." },
  /* ... giữ nguyên tất cả mục từ tuDienSEO bạn đã cung cấp ... */
  "Kệ Khai Trương VIP Xanh Blue Hoàng Gia": { ten: "Kệ Khai Trương VIP Xanh Blue Hoàng Gia", moTa: "Một tác phẩm nghệ thuật hoa tươi đẳng cấp." }
};

// --- HỖ TRỢ CHUẨN HOÁ TÊN / SLUG ---
function chuanHoaTen(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i, '').trim();
}
function taoSlug(str) {
  if (!str) return '';
  let slug = str.toLowerCase();
  slug = slug.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  slug = slug.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  slug = slug.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  slug = slug.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  slug = slug.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  slug = slug.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  slug = slug.replace(/(đ)/g, 'd');
  slug = slug.replace(/([^0-9a-z-\s])/g, '');
  slug = slug.replace(/(\s+)/g, '-');
  slug = slug.replace(/^-+/g, '');
  slug = slug.replace(/-+$/g, '');
  return slug;
}

const tuDienDaChuanHoa = {};
for (let key in tuDienSEO) {
  tuDienDaChuanHoa[chuanHoaTen(key)] = tuDienSEO[key];
}

function doanDanhMuc(tenHoa) {
  const t = (tenHoa || '').toLowerCase();
  if (t.includes('khai trương') || t.includes('kệ')) return 'Hoa Khai Trương';
  if (t.includes('bó') || t.includes('hoa cặp')) return 'Bó Hoa';
  if (t.includes('lẵng') || t.includes('giỏ')) return 'Lẵng/Giỏ Hoa';
  if (t.includes('chậu') || t.includes('bình') || t.includes('hộp') || t.includes('để bàn')) return 'Hoa Để Bàn';
  if (t.includes('baby')) return 'Hoa Baby';
  if (t.includes('chia buồn') || t.includes('đám tang')) return 'Hoa Chia Buồn';
  return 'Hoa Thiết Kế';
}

// --- ĐỌC ẢNH TỪ THƯ MỤC PUBLIC ---
const thuMucAnh = path.join(__dirname, 'public');
if (!fs.existsSync(thuMucAnh)) fs.mkdirSync(thuMucAnh);

const cacFileAnh = fs.readdirSync(thuMucAnh).filter(file =>
  (file.toLowerCase().endsWith('.jpg') ||
   file.toLowerCase().endsWith('.jpeg') ||
   file.toLowerCase().endsWith('.png') ||
   file.toLowerCase().endsWith('.webp')) &&
  !['IMG_3390.jpg', 'banner-ai.jpg', 'nen-web.jpg'].includes(file)
);

// TẠO DANH SÁCH SẢN PHẨM
const danhSachHoa = cacFileAnh.map((tenFile, index) => {
  const keyChuan = chuanHoaTen(tenFile);
  const thongTin = tuDienDaChuanHoa[keyChuan];
  const tenHienThi = thongTin ? thongTin.ten : `Mẫu Hoa Thiết Kế #${index + 1}`;
  return {
    id: index + 1,
    slug: `${taoSlug(tenHienThi)}-${index + 1}`,
    ten: tenHienThi,
    danhMuc: doanDanhMuc(tenHienThi),
    hinhAnh: `/${tenFile}`,
    moTa: thongTin ? thongTin.moTa : "Mẫu hoa tươi thiết kế sang trọng tại Thanh Ngọc."
  };
});

// --- ROUTES ---
app.get('/blog-1', (req, res) => {
  res.render('blog-1', { duLieu: thongTinCuaHang });
});

app.get('/', (req, res) => {
  const danhmuc = req.query.danhmuc;
  let danhSachHienThi = danhSachHoa;
  if (danhmuc) {
    danhSachHienThi = danhSachHoa.filter(h => h.danhMuc === danhmuc);
  }
  res.render('trang-chu', { duLieu: thongTinCuaHang, danhSach: danhSachHienThi });
});

app.get('/san-pham/:id_or_slug', (req, res) => {
  const param = req.params.id_or_slug;
  const item = danhSachHoa.find(h => h.slug === param || h.id === parseInt(param, 10));
  if (item) res.render('chi-tiet', { duLieu: thongTinCuaHang, sanPham: item });
  else res.status(404).send('Không tìm thấy sản phẩm! <a href="/">Quay lại trang chủ</a>');
});

// health check (for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => { console.log(`Server chạy tại: http://localhost:${port}`); });

/* cspell:enable */