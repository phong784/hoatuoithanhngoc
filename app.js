const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public', { maxAge: 30 * 24 * 60 * 60 * 1000 }));

const thongTinCuaHang = {
  tenShop: "Hoa Tươi Thanh Ngọc",
  slogan: "Thay Lời Muốn Nói, Gửi Trọn Yêu Thương",
  diaChi: "8 Phan Văn Hân, Phường 19, Bình Thạnh, TP.HCM",
  dienThoai: "0777 110 959",
  zalo: "0777110959",
  banDo: "https://maps.google.com/?cid=12711485143305872964&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
};

const khoHoa = {
  "Hoa Khai Trương": [],
  "Hoa Kính Viếng": [],
  "Bó Hoa": [],
  "Hoa Để Bàn": [],
  "Lẵng/Giỏ Hoa": [],
  "Hoa Baby": []
};

// --- HÀM RADAR: Tự động tìm file bất chấp đuôi .jpg, .JPG hay .png ---
function timFileAnh(tenGoc) {
  const cacDuoi = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];
  for (let duoi of cacDuoi) {
    if (fs.existsSync(path.join(__dirname, 'public', tenGoc + duoi))) {
      return tenGoc + duoi;
    }
  }
  return null;
}

// 1. TỰ ĐỘNG QUÉT BÓ HOA (Tiền tố "1 (x)")
for (let i = 1; i <= 150; i++) {
  let tenFile = timFileAnh(`1 (${i})`);
  if (tenFile) {
    khoHoa["Bó Hoa"].push({
      file: tenFile,
      ten: `Bó Hoa Thiết Kế Hiện Đại #${i}`,
      moTa: "Mẫu bó hoa tươi thiết kế sang trọng, phong cách hiện đại tại Hoa Tươi Thanh Ngọc."
    });
  }
}

// 2. TỰ ĐỘNG QUÉT HOA KHAI TRƯƠNG (Tiền tố "138 (x)")
for (let i = 1; i <= 100; i++) {
  let tenFile = timFileAnh(`138 (${i})`);
  if (tenFile) {
    khoHoa["Hoa Khai Trương"].push({
      file: tenFile,
      ten: `Lẵng Hoa Khai Trương Cao Cấp #${i}`,
      moTa: "Kệ hoa khai trương thiết kế hoành tráng, mang ý nghĩa tài lộc, hồng phát."
    });
  }
}

// 3. TỰ ĐỘNG QUÉT HOA KÍNH VIẾNG (Tiền tố "139 (x)")
for (let i = 1; i <= 100; i++) {
  let tenFile = timFileAnh(`139 (${i})`);
  if (tenFile) {
    khoHoa["Hoa Kính Viếng"].push({
      file: tenFile,
      ten: `Kệ Hoa Kính Viếng Thành Kính #${i}`,
      moTa: "Kệ hoa viếng trang trọng, gửi lời thành kính phân ưu cùng gia quyến."
    });
  }
}

// 4. QUÉT CÁC DANH MỤC CŨ (Để bàn, Giỏ, Baby...)
const danhMucCu = {
  "Hoa Để Bàn": [
    { file: "IMG_3439.JPG", ten: "Bình Hoa Xanh Blue Huyền Bí", moTa: "Bình hoa để bàn với tone xanh dương lạ mắt." },
    { file: "IMG_3441.JPG", ten: "Chậu Hoa Để Bàn Vàng Lan Vũ Nữ", moTa: "Mẫu hoa cắm bình nghệ thuật rực rỡ." },
    { file: "IMG_3445.JPG", ten: "Bình Hoa Khai Trương Mini Tone Cam", moTa: "Bình hoa để quầy lễ tân tone cam rực rỡ." },
    { file: "IMG_3446.JPG", ten: "Chậu Hoa Cô Gái Mùa Xuân", moTa: "Mix hoa tươi tắn trên nền chậu cô gái." },
    { file: "IMG_3447.JPG", ten: "Bình Hoa Thiên Điểu Đỏ Quyền Lực", moTa: "Hoa Thiên Điểu vươn cao tượng trưng thăng tiến." },
    { file: "IMG_3451.JPG", ten: "Hộp Hoa Để Bàn Tone Cam Sữa", moTa: "Hộp hoa cắm xòe tròn đều đặn." },
    { file: "IMG_3459.JPG", ten: "Bình Hoa Hồng Đỏ Rủ Nghệ Thuật", moTa: "Cắm bình phong cách tự do hoa rủ mềm mại." },
    { file: "IMG_3462.JPG", ten: "Hộp Hoa Cam Cháy Trendy", moTa: "Màu cam cháy đang là xu hướng." },
    { file: "IMG_3464.JPG", ten: "Hộp Hoa Chúc Mừng Tone Đỏ Cam", moTa: "Thích hợp đặt trên bàn tiệc." },
    { file: "IMG_3467.JPG", ten: "Chậu Cô Gái Cắm Hoa Đỏ May Mắn", moTa: "Chậu hoa nghệ thuật mix tone đỏ rực." },
    { file: "IMG_3469.JPG", ten: "Hộp Hoa Lan Vũ Nữ Vàng", moTa: "Màu vàng mang lại sự sung túc." },
    { file: "IMG_3473.JPG", ten: "Bình Hoa Cam Vàng Mùa Thu", moTa: "Tone màu ấm áp, cắm theo dáng vươn cao." },
    { file: "IMG_3476.JPG", ten: "Chậu Hoa Cô Gái Cam Rực Rỡ", moTa: "Sự kết hợp màu sắc tươi vui." },
    { file: "IMG_3477.JPG", ten: "Bình Hoa Đỏ Vàng Hoàng Gia", moTa: "Cắm chậu nghệ thuật, sang trọng." },
    { file: "IMG_3479.JPG", ten: "Lẵng Hoa Đôi Để Bàn Mềm Mại", moTa: "Thiết kế trải dài đặt trên bàn họp." },
    { file: "IMG_3484.JPG", ten: "Hộp Hoa Xanh Dương Độc Lạ", moTa: "Gam màu xanh dương mang lại sự bình yên." },
    { file: "IMG_3509.JPG", ten: "Hộp Hoa Đỏ Cam Để Bàn Quyền Lực", moTa: "Tone màu cháy bỏng rực rỡ cắm trên hộp trụ." }
  ],
  "Lẵng/Giỏ Hoa": [
    { file: "IMG_3454.JPG", ten: "Lẵng Hoa Đỏ Mix Lá Bạc Sang Trọng", moTa: "Sắc đỏ thắm của hoa hồng nổi bật trên lá bạc." },
    { file: "IMG_3478.JPG", ten: "Giỏ Hoa Trắng Xanh Lá Mộc Mạc", moTa: "Giỏ hoa phong cách đồng quê." },
    { file: "IMG_3485.JPG", ten: "Giỏ Hoa Hồng Đỏ Tình Yêu Mộc", moTa: "Hoa hồng đỏ rực mix trong hộp gỗ." }
  ],
  "Hoa Baby": [
    { file: "IMG_3425.JPG", ten: "Chậu Hoa Baby Xanh Blue Cô Gái", moTa: "Hoa baby nhuộm xanh blue cắm chậu nghệ thuật." },
    { file: "IMG_3463.JPG", ten: "Bó Hoa Baby Hồng Khổng Lồ", moTa: "Hoa baby nhuộm hồng bồng bềnh siêu to." },
    { file: "IMG_3465.JPG", ten: "Bình Hoa Baby Xanh Giấy Bạc", moTa: "Thiết kế cắm hộp vuông bọc giấy lấp lánh." },
    { file: "IMG_3486.JPG", ten: "Chậu Cô Gái Baby Xanh Mini", moTa: "Phiên bản nhỏ gọn xinh xắn." },
    { file: "IMG_3499.JPG", ten: "Bó Hoa Baby Trắng Tinh Khôi", moTa: "Đơn giản mà đẹp mãi mãi." },
    { file: "IMG_3507.JPG", ten: "Bó Hoa Baby Trắng Siêu Khổng Lồ", moTa: "Baby trắng tinh khôi gói thành bó siêu to." },
    { file: "IMG_3704.JPG", ten: "Bó Hoa Baby Trắng Giấy Đen Cuốn Hút", moTa: "Tương phản ấn tượng với giấy bọc đen nhám." },
    { file: "IMG_3705.JPG", ten: "Bó Hoa Baby Trắng Giấy Mộc", moTa: "Bó hoa baby bọc giấy kraft xi măng." }
  ]
};

for (const [dm, mang] of Object.entries(danhMucCu)) {
  mang.forEach(sp => {
    // Chỉ đưa vào web nếu bạn chưa xóa ảnh đó khỏi máy tính
    if (fs.existsSync(path.join(__dirname, 'public', sp.file))) {
      khoHoa[dm].push(sp);
    }
  });
}

// Hàm tự động tạo URL chuẩn SEO
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

let danhSachHoa = [];
let idCounter = 1;

for (const [tenDanhMuc, mangSanPham] of Object.entries(khoHoa)) {
  mangSanPham.forEach(sp => {
    danhSachHoa.push({
      id: idCounter,
      slug: taoSlug(sp.ten) + '-' + idCounter,
      ten: sp.ten,
      danhMuc: tenDanhMuc,
      hinhAnh: `/${sp.file}`,
      moTa: sp.moTa
    });
    idCounter++;
  });
}

// --- ROUTES ---
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
  const item = danhSachHoa.find(h => h.slug === param || h.id === parseInt(param));
  if (item) res.render('chi-tiet', { duLieu: thongTinCuaHang, sanPham: item });
  else res.status(404).send('Không tìm thấy sản phẩm! <a href="/">Quay lại trang chủ</a>');
});

app.listen(port, () => { console.log(`Server chạy tại: http://localhost:${port}`); });