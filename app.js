const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// --- BẬT BỘ NHỚ ĐỆM (CACHE) 30 NGÀY -> KHẮC PHỤC TRIỆT ĐỂ LỖI GIẬT LAG LÙI TRANG ---
app.use(express.static('public', { maxAge: 30 * 24 * 60 * 60 * 1000 }));

// --- THÔNG TIN CỬA HÀNG ---
const thongTinCuaHang = {
  tenShop: "Hoa Tươi Thanh Ngọc",
  slogan: "Thay Lời Muốn Nói, Gửi Trọn Yêu Thương",
  diaChi: "8 Phan Văn Hân, Phường 19, Bình Thạnh, TP.HCM",
  dienThoai: "0777 110 959",
  zalo: "0777110959",
  banDo: "https://maps.google.com/?cid=12711485143305872964&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
};

// =========================================================================
// KHO HOA ĐƯỢC CHIA SẴN 5 DANH MỤC. BẠN CHỈ CẦN THÊM ẢNH VÀO ĐÚNG DANH MỤC!
// Cấu trúc thêm hoa mới: { file: "ten-anh.jpg", ten: "Tên hiển thị", moTa: "Mô tả SEO" }
// =========================================================================
const khoHoa = {};

// --- ĐOẠN CODE MA THUẬT: TỰ ĐỘNG THÊM 50 ẢNH KÍNH VIẾNG ---
// --- BỘ TỪ ĐIỂN SEO HOA KÍNH VIẾNG CHUẨN XÁC TỪNG TẤM ẢNH ---
khoHoa["Hoa Kính Viếng"] = [
  { file: "1 (1).jpg", ten: "Kệ Hoa Kính Viếng Lan Trắng 2 Tầng", moTa: "Thiết kế 2 tầng trang trọng với hoa lan trắng, gửi lời thành kính phân ưu." },
  { file: "1 (2).jpg", ten: "Kệ Hoa Chia Buồn Trắng Tinh Khôi", moTa: "Kệ hoa 1 tầng tone trắng nhẹ nhàng, xoa dịu nỗi đau mất mát." },
  { file: "1 (3).jpg", ten: "Kệ Hoa Tang Lễ Hoa Ly Trắng", moTa: "Hoa ly trắng thơm ngát, vươn cao thể hiện sự tôn kính và tiếc thương." },
  { file: "1 (4).jpg", ten: "Kệ Hoa Viếng 2 Tầng Tone Vàng Tím", moTa: "Sự kết hợp giữa sắc vàng rực rỡ và tím đượm buồn." },
  { file: "1 (5).jpg", ten: "Kệ Hoa Kính Viếng Lan Trắng Xanh", moTa: "Tone màu xanh trắng thanh tao, mang lại cảm giác bình yên." },
  { file: "1 (6).jpg", ten: "Kệ Hoa Chia Buồn Hồng Tím Nhẹ Nhàng", moTa: "Kệ hoa phong cách hiện đại, gửi trọn niềm xót thương." },
  { file: "1 (7).jpg", ten: "Kệ Đôi Vòng Hoa Trắng Thành Kính", moTa: "Thiết kế 2 vòng hoa trắng đôi độc đáo, vô cùng hoành tráng." },
  { file: "1 (8).jpg", ten: "Kệ Hoa Tang Lễ Lan Hồ Điệp Trắng", moTa: "Lan hồ điệp trắng cao cấp, thể hiện sự sang trọng và kính trọng bậc nhất." },
  { file: "1 (9).jpg", ten: "Vòng Hoa Kính Viếng Cúc Trắng", moTa: "Vòng cúc trắng đan kết tỉ mỉ, vòng hoa truyền thống của người Việt." },
  { file: "1 (10).jpg", ten: "Kệ Hoa Chia Buồn Hồng Trắng Sang Trọng", moTa: "Hoa hồng trắng đại diện cho sự tinh khiết và lời chào tạm biệt." },
  { file: "1 (11).jpg", ten: "Kệ Hoa Viếng 2 Tầng Trắng Xanh Lá", moTa: "Màu xanh hi vọng kết hợp cùng hoa trắng trang nhã." },
  { file: "1 (12).jpg", ten: "Kệ Hoa Tang Lan Trắng 2 Tầng VIP", moTa: "Kệ hoa VIP sử dụng 100% lan Thái trắng cao cấp." },
  { file: "1 (13).jpg", ten: "Kệ Hoa Kính Viếng Dáng Oval Trắng", moTa: "Thiết kế dáng oval tràn đầy, hoành tráng và bề thế." },
  { file: "1 (14).jpg", ten: "Kệ Hoa Chia Buồn Trắng Xanh Thanh Lịch", moTa: "Nhẹ nhàng, thanh lịch, gửi lời chia buồn sâu sắc nhất." },
  { file: "1 (15).jpg", ten: "Vòng Hoa Tang Lễ Trắng Điểm Nơ", moTa: "Vòng hoa trắng nổi bật với dải lụa nơ đen/trắng trang trọng." },
  { file: "1 (16).jpg", ten: "Kệ Hoa Viếng 2 Tầng Hiện Đại", moTa: "Kiểu dáng cắm hiện đại, thoát khỏi khuôn khổ truyền thống." },
  { file: "1 (17).jpg", ten: "Kệ Hoa Chia Buồn Lan Thái Trắng", moTa: "Lan Thái vươn dài bồng bềnh như đám mây trắng." },
  { file: "1 (18).jpg", ten: "Vòng Hoa Kính Viếng Nhỏ Gọn", moTa: "Thiết kế nhỏ gọn, tinh tế, phù hợp viếng đám tang tại nhà." },
  { file: "1 (19).jpg", ten: "Kệ Kính Viếng Đôi Vòng Trắng VIP", moTa: "Hai vòng tròn trắng biểu tượng cho sự trọn vẹn và luân hồi." },
  { file: "1 (20).jpg", ten: "Kệ Hoa Tang Lễ 2 Tầng Lan Vàng", moTa: "Sắc vàng truyền thống, phù hợp viếng người lớn tuổi, phật tử." },
  { file: "1 (21).jpg", ten: "Kệ Hoa Chia Buồn Lan Trắng Cúc Đại Đóa", moTa: "Sự hòa quyện giữa các loài hoa đặc trưng của tang lễ." },
  { file: "1 (22).jpg", ten: "Kệ Hoa Viếng Tone Tím Đượm Buồn", moTa: "Màu tím chung thủy, một lời hứa không bao giờ lãng quên." },
  { file: "1 (23).jpg", ten: "Kệ Hoa Tang Lễ Hình Thánh Giá", moTa: "Thiết kế Thánh Giá đặc biệt dành cho đám tang người Công Giáo." },
  { file: "1 (24).jpg", ten: "Kệ Hoa Kính Viếng 2 Tầng Vàng Rực", moTa: "Lời cầu chúc người ra đi sớm siêu thoát về miền cực lạc." },
  { file: "1 (25).jpg", ten: "Kệ Hoa Chia Buồn Lan Trắng Tầng Cao", moTa: "Thiết kế vươn cao đồ sộ, nổi bật nhất trong buổi lễ." },
  { file: "1 (26).jpg", ten: "Kệ Hoa Tang 2 Tầng Tone Tím Môn", moTa: "Sắc tím môn nhẹ nhàng, xoa dịu bầu không khí đau thương." },
  { file: "1 (27).jpg", ten: "Kệ Hoa Kính Viếng Tone Hồng Sen", moTa: "Dành cho những người mang tâm hồn nhẹ nhàng, nữ tính." },
  { file: "1 (28).jpg", ten: "Kệ Hoa Chia Buồn 1 Tầng Nhã Nhặn", moTa: "Đơn giản, lịch sự, thể hiện lòng thành kính sâu sắc." },
  { file: "1 (29).jpg", ten: "Kệ Hoa Viếng Trắng Điểm Tím", moTa: "Nền hoa trắng tinh khôi điểm xuyết những bông tím nhớ thương." },
  { file: "1 (30).jpg", ten: "Kệ Hoa Tang Lễ Trắng Dải Lụa", moTa: "Dải lụa trắng rủ xuống tạo cảm giác mềm mại, bi thương." },
  { file: "1 (31).jpg", ten: "Kệ Hoa Chia Buồn 2 Vòng Tròn Độc Đáo", moTa: "Thiết kế 2 tầng hình vòng tròn lạ mắt, sang trọng." },
  { file: "1 (32).jpg", ten: "Kệ Hoa Kính Viếng Vòng Cúc Tím", moTa: "Cúc tím mang lại sự hoài niệm và nhớ nhung da diết." },
  { file: "1 (33).jpg", ten: "Kệ Hoa Viếng Thiết Kế Riêng", moTa: "Hoa Tươi Thanh Ngọc nhận thiết kế hoa viếng theo yêu cầu." },
  { file: "1 (34).jpg", ten: "Kệ Hoa Tang Lễ 2 Tầng Lan Trắng", moTa: "Kệ lan trắng 2 tầng truyền thống luôn là lựa chọn hàng đầu." },
  { file: "1 (35).jpg", ten: "Kệ Hoa Kính Viếng Trắng Cúc Mẫu Đơn", moTa: "Sử dụng cúc mẫu đơn cao cấp tạo độ phồng và xòe rộng." },
  { file: "1 (36).jpg", ten: "Vòng Hoa Chia Buồn Trắng Truyền Thống", moTa: "Vòng hoa tròn trịa truyền thống, gửi gắm sự trân trọng." },
  { file: "1 (37).jpg", ten: "Kệ Hoa Viếng Vòng Tròn Mix Lan", moTa: "Lan Thái được cắm xòe rộng ôm trọn vòng hoa tâm điểm." },
  { file: "1 (38).jpg", ten: "Kệ Hoa Tang Lễ 2 Tầng Vàng Tươi", moTa: "Hoa lan và ly vàng tạo nên kệ hoa rực rỡ, bề thế." },
  { file: "1 (39).jpg", ten: "Kệ Hoa Chia Buồn Lan Trắng Khổng Lồ", moTa: "Sử dụng hàng trăm cành lan Thái cắm xòe siêu to." },
  { file: "1 (40).jpg", ten: "Vòng Hoa Kính Viếng Tím Lan Điệp", moTa: "Vòng hoa tím đậm chất hoài niệm, trang trọng." },
  { file: "1 (41).jpg", ten: "Kệ Hoa Tang 1 Tầng Trắng Dải Băng", moTa: "Hoa trắng kết hợp dải băng rôn đen/trắng truyền thống." },
  { file: "1 (42).jpg", ten: "Kệ Hoa Viếng 2 Tầng Trắng Phối Tím", moTa: "Sự phân chia màu sắc tinh tế giữa 2 tầng hoa." },
  { file: "1 (43).jpg", ten: "Kệ Chia Buồn Hồ Điệp Tím Trắng", moTa: "Lan hồ điệp luôn khẳng định đẳng cấp của người viếng." },
  { file: "1 (44).jpg", ten: "Kệ Hoa Kính Viếng Trắng Tinh Khôi", moTa: "Một màu trắng bao phủ, thay cho vạn lời đau xót." },
  { file: "1 (45).jpg", ten: "Vòng Hoa Tang Lễ Tone Tím Môn Nhẹ", moTa: "Sắc hoa tím xoa dịu những trái tim đang tổn thương." },
  { file: "1 (46).jpg", ten: "Kệ 2 Tầng Vòng Tròn Hoa Ly Trắng", moTa: "Mùi hương hoa ly sẽ đưa tiễn linh hồn người quá cố." },
  { file: "1 (47).jpg", ten: "Kệ Hoa Viếng Lan Tím 2 Tầng VIP", moTa: "Kệ hoa đồ sộ, màu tím sang trọng, phù hợp không gian lớn." },
  { file: "1 (48).jpg", ten: "Kệ Hoa Chia Buồn Tone Đỏ Vàng", moTa: "Màu sắc mạnh mẽ, phù hợp với phong tục một số vùng miền." },
  { file: "1 (49).jpg", ten: "Kệ Hoa Tang Lễ Lan Vàng Rực Rỡ", moTa: "Hoa lan vàng biểu tượng cho sự tái sinh và phước lành." },
  { file: "1 (50).jpg", ten: "Kệ Kính Viếng Phù Hợp Người Trẻ", moTa: "Tone trắng tinh khiết, xót thương cho một kiếp người dở dang." }
];

// --- BỘ TỪ ĐIỂN SEO BÓ HOA (106 MẪU) ---
// --- BỘ TỪ ĐIỂN TỰ ĐỘNG CHO BÓ HOA (CHUẨN SEO, KHÔNG BAO GIỜ SAI MÀU) ---
khoHoa["Bó Hoa"] = [];
for (let i = 1; i <= 106; i++) { // Nếu bạn có 100 tấm thì sửa số 106 thành 100 nhé
  khoHoa["Bó Hoa"].push({
    file: `bohoa (${i}).jpg`, // Code sẽ tự tìm đúng file bohoa (1).jpg, bohoa (2).jpg...
    ten: `Bó Hoa Thiết Kế Cao Cấp #${i}`,
    moTa: "Mẫu bó hoa tươi thiết kế sang trọng, phong cách hiện đại. Phù hợp tặng sinh nhật, kỷ niệm và các dịp lễ quan trọng tại Hoa Tươi Thanh Ngọc."
  });
}

khoHoa["Hoa Để Bàn"] = [
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
];

khoHoa["Lẵng/Giỏ Hoa"] = [
  { file: "IMG_3454.JPG", ten: "Lẵng Hoa Đỏ Mix Lá Bạc Sang Trọng", moTa: "Sắc đỏ thắm của hoa hồng nổi bật trên lá bạc." },
  { file: "IMG_3478.JPG", ten: "Giỏ Hoa Trắng Xanh Lá Mộc Mạc", moTa: "Giỏ hoa phong cách đồng quê." },
  { file: "IMG_3485.JPG", ten: "Giỏ Hoa Hồng Đỏ Tình Yêu Mộc", moTa: "Hoa hồng đỏ rực mix trong hộp gỗ." }
];

khoHoa["Hoa Baby"] = [
  { file: "IMG_3425.JPG", ten: "Chậu Hoa Baby Xanh Blue Cô Gái", moTa: "Hoa baby nhuộm xanh blue cắm chậu nghệ thuật." },
  { file: "IMG_3463.JPG", ten: "Bó Hoa Baby Hồng Khổng Lồ", moTa: "Hoa baby nhuộm hồng bồng bềnh siêu to." },
  { file: "IMG_3465.JPG", ten: "Bình Hoa Baby Xanh Giấy Bạc", moTa: "Thiết kế cắm hộp vuông bọc giấy lấp lánh." },
  { file: "IMG_3486.JPG", ten: "Chậu Cô Gái Baby Xanh Mini", moTa: "Phiên bản nhỏ gọn xinh xắn." },
  { file: "IMG_3499.JPG", ten: "Bó Hoa Baby Trắng Tinh Khôi", moTa: "Đơn giản mà đẹp mãi mãi." },
  { file: "IMG_3507.JPG", ten: "Bó Hoa Baby Trắng Siêu Khổng Lồ", moTa: "Baby trắng tinh khôi gói thành bó siêu to." },
  { file: "IMG_3704.JPG", ten: "Bó Hoa Baby Trắng Giấy Đen Cuốn Hút", moTa: "Tương phản ấn tượng với giấy bọc đen nhám." },
  { file: "IMG_3705.JPG", ten: "Bó Hoa Baby Trắng Giấy Mộc", moTa: "Bó hoa baby bọc giấy kraft xi măng." }
];

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

// Gom tất cả vào mảng để trang web hiển thị
let danhSachHoa = [];
let idCounter = 1;

for (const [tenDanhMuc, mangSanPham] of Object.entries(khoHoa)) {
  mangSanPham.forEach(sp => {
    // CHỈ LOAD NHỮNG ẢNH CÓ KHAI BÁO TRONG KHO HOA Ở TRÊN
    const duongDanAnh = path.join(__dirname, 'public', sp.file);
    if (fs.existsSync(duongDanAnh)) {
      danhSachHoa.push({
        id: idCounter,
        slug: taoSlug(sp.ten) + '-' + idCounter,
        ten: sp.ten,
        danhMuc: tenDanhMuc,
        hinhAnh: `/${sp.file}`,
        moTa: sp.moTa
      });
      idCounter++;
    }
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