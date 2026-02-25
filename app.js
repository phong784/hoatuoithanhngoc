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

// Hàm Radar: Tự tìm đuôi ảnh
function timFileAnh(tenGoc) {
  const cacDuoi = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];
  for (let duoi of cacDuoi) {
    if (fs.existsSync(path.join(__dirname, 'public', tenGoc + duoi))) {
      return tenGoc + duoi;
    }
  }
  return null;
}

// ==========================================
// 1. TỪ ĐIỂN SEO KHAI TRƯƠNG (Tự động nối với ảnh 138)
// ==========================================
const seoKhaiTruong = [
  { ten: "Lẵng Hoa Khai Trương Vàng Cam VIP", moTa: "Kệ hoa 2 tầng rực rỡ mang ý nghĩa tài lộc." },
  { ten: "Lẵng Hoa Khai Trương Tone Hồng Dâu", moTa: "Thiết kế hiện đại, sang trọng với tone màu hồng." },
  { ten: "Lẵng Hoa Khai Trương Tone Trắng Xanh", moTa: "Kệ hoa khai trương trang nhã, thanh lịch." },
  { ten: "Lẵng Hoa Khai Trương Tone Đỏ Rực Rỡ", moTa: "Sắc đỏ may mắn bùng nổ, lời chúc làm ăn phát đạt." },
  { ten: "Lẵng Khai Trương Hoa Lan Sang Trọng", moTa: "Sự kết hợp của hoa lan hồ điệp." },
  { ten: "Lẵng Khai Trương Đỏ Hồng Phát 1 Tầng", moTa: "Thiết kế 1 tầng gọn gàng nhưng không kém phần nổi bật." },
  { ten: "Lẵng Khai Trương Tone Đỏ Quyền Lực", moTa: "Kệ đứng sang trọng, màu đỏ chủ đạo." },
  { ten: "Lẵng Hoa Khai Trương Trắng Tím", moTa: "Sự chung thủy và thịnh vượng được gửi gắm." },
  { ten: "Lẵng Hoa Khai Trương 2 Tầng Tone Hồng", moTa: "Sang trọng và ngọt ngào." },
  { ten: "Lẵng Hoa Hiện Đại Trắng Đỏ", moTa: "Thiết kế bất đối xứng nghệ thuật." },
  { ten: "Lẵng Khai Trương Hồng Tươi Tắn", moTa: "Kệ hoa đứng tone hồng mix trắng." },
  { ten: "Lẵng Hoa Khai Trương Khung Tranh", moTa: "Thiết kế kệ khung hiện đại kiểu mới." },
  { ten: "Lẵng Khai Trương Trắng Hồ Điệp", moTa: "Kệ hoa VIP sử dụng Lan Hồ Điệp trắng." },
  { ten: "Lẵng Khai Trương Tone Hồng Lãng Mạn", moTa: "Thiết kế riêng mẫu kệ hoa hồng pastel." },
  { ten: "Lẵng Khai Trương Trắng Xanh Tinh Tế", moTa: "Gam màu lạnh sang trọng, thanh lịch." },
  { ten: "Lẵng Khai Trương Trắng Vàng Tươi Sáng", moTa: "Sự kết hợp hoàn hảo giữa sắc trắng và vàng." },
  { ten: "Lẵng Hoa Khai Trương Tone Đỏ Hiện Đại", moTa: "Kệ đứng 2 tầng bọc lưới voan bồng bềnh." },
  { ten: "Lẵng Hoa Mừng Thọ Tone Đỏ Đậm", moTa: "Sắc đỏ trầm ấm áp." },
  { ten: "Lẵng Khai Trương Trắng Tím Trang Nhã", moTa: "Kệ hoa phong cách Tây Âu." },
  { ten: "Lẵng Khai Trương Hồng Pastel Voan", moTa: "Kệ hoa được quấn voan điệu đà." },
  { ten: "Lẵng Khai Trương Trắng Mix Lá Nhiệt Đới", moTa: "Thiết kế khác biệt với các loại hoa trắng." },
  { ten: "Lẵng Hoa Khai Trương Hồng Phấn Voan Nhẹ", moTa: "Nhẹ nhàng, bay bổng." },
  { ten: "Lẵng Khai Trương Tone Trắng Tinh Tế", moTa: "Kệ hoa sang trọng, mix đa dạng các loại hoa trắng." },
  { ten: "Lẵng Khai Trương Hồng Sen Đậm", moTa: "Tone màu nổi bật, thu hút ánh nhìn." },
  { ten: "Lẵng Khai Trương Vàng Lá Bạc Tỏa Đều", moTa: "Thiết kế xòe tròn đều đặn." },
  { ten: "Bình Hoa Mừng Khai Trương Rực Rỡ", moTa: "Bình hoa cắm vòm hoành tráng đặt trên đôn gỗ." },
  { ten: "Kệ Khai Trương Xanh Blue Đẳng Cấp", moTa: "Kệ hoa 2 tầng sử dụng hoa hồng xanh blue." },
  { ten: "Lẵng Khai Trương Tone Xanh Trắng VIP", moTa: "Kệ hoa sảnh tone màu lạnh sang trọng." },
  { ten: "Kệ Khai Trương Đại Sảnh Vàng Cam Đỏ", moTa: "Kệ hoa siêu cao cấp thiết kế dành riêng cho đại sảnh." },
  { ten: "Kệ Khai Trương Sảnh Đỏ Hồng Vàng VIP", moTa: "Sự pha trộn màu sắc khéo léo tạo nên kệ hoa hoành tráng." },
  { ten: "Kệ Khai Trương Quyền Lực Đỏ Cam", moTa: "Kết cấu 2 tầng đồ sộ, thể hiện sự uy quyền." },
  { ten: "Kệ Khai Trương Trắng Xanh Tinh Khôi Đại Sảnh", moTa: "Kệ hoa VIP mang nét đẹp Tây Âu sang trọng." },
  { ten: "Kệ Khai Trương VIP Xanh Blue Hoàng Gia", moTa: "Một tác phẩm nghệ thuật hoa tươi đẳng cấp." }
];

seoKhaiTruong.forEach((item, index) => {
  let fileChuan = timFileAnh(`138 (${index + 1})`);
  if (fileChuan) khoHoa["Hoa Khai Trương"].push({ file: fileChuan, ten: item.ten, moTa: item.moTa });
});

// ==========================================
// 2. TỪ ĐIỂN SEO KÍNH VIẾNG (Tự động nối với ảnh 139)
// ==========================================
const seoKinhVieng = [
  { ten: "Kệ Hoa Kính Viếng Lan Trắng 2 Tầng", moTa: "Thiết kế 2 tầng trang trọng với hoa lan trắng, gửi lời thành kính phân ưu." },
  { ten: "Kệ Hoa Chia Buồn Trắng Tinh Khôi", moTa: "Kệ hoa 1 tầng tone trắng nhẹ nhàng, xoa dịu nỗi đau mất mát." },
  { ten: "Kệ Hoa Tang Lễ Hoa Ly Trắng", moTa: "Hoa ly trắng thơm ngát, vươn cao thể hiện sự tôn kính và tiếc thương." },
  { ten: "Kệ Hoa Viếng 2 Tầng Tone Vàng Tím", moTa: "Sự kết hợp giữa sắc vàng rực rỡ và tím đượm buồn." },
  { ten: "Kệ Hoa Kính Viếng Lan Trắng Xanh", moTa: "Tone màu xanh trắng thanh tao, mang lại cảm giác bình yên." },
  { ten: "Kệ Hoa Chia Buồn Hồng Tím Nhẹ Nhàng", moTa: "Kệ hoa phong cách hiện đại, gửi trọn niềm xót thương." },
  { ten: "Kệ Đôi Vòng Hoa Trắng Thành Kính", moTa: "Thiết kế 2 vòng hoa trắng đôi độc đáo, vô cùng hoành tráng." },
  { ten: "Kệ Hoa Tang Lễ Lan Hồ Điệp Trắng", moTa: "Lan hồ điệp trắng cao cấp, thể hiện sự sang trọng và kính trọng bậc nhất." },
  { ten: "Vòng Hoa Kính Viếng Cúc Trắng", moTa: "Vòng cúc trắng đan kết tỉ mỉ, vòng hoa truyền thống của người Việt." },
  { ten: "Kệ Hoa Chia Buồn Hồng Trắng Sang Trọng", moTa: "Hoa hồng trắng đại diện cho sự tinh khiết và lời chào tạm biệt." },
  { ten: "Kệ Hoa Viếng 2 Tầng Trắng Xanh Lá", moTa: "Màu xanh hi vọng kết hợp cùng hoa trắng trang nhã." },
  { ten: "Kệ Hoa Tang Lan Trắng 2 Tầng VIP", moTa: "Kệ hoa VIP sử dụng 100% lan Thái trắng cao cấp." },
  { ten: "Kệ Hoa Kính Viếng Dáng Oval Trắng", moTa: "Thiết kế dáng oval tràn đầy, hoành tráng và bề thế." },
  { ten: "Kệ Hoa Chia Buồn Trắng Xanh Thanh Lịch", moTa: "Nhẹ nhàng, thanh lịch, gửi lời chia buồn sâu sắc nhất." },
  { ten: "Vòng Hoa Tang Lễ Trắng Điểm Nơ", moTa: "Vòng hoa trắng nổi bật với dải lụa nơ đen/trắng trang trọng." },
  { ten: "Kệ Hoa Viếng 2 Tầng Hiện Đại", moTa: "Kiểu dáng cắm hiện đại, thoát khỏi khuôn khổ truyền thống." },
  { ten: "Kệ Hoa Chia Buồn Lan Thái Trắng", moTa: "Lan Thái vươn dài bồng bềnh như đám mây trắng." },
  { ten: "Vòng Hoa Kính Viếng Nhỏ Gọn", moTa: "Thiết kế nhỏ gọn, tinh tế, phù hợp viếng đám tang tại nhà." },
  { ten: "Kệ Kính Viếng Đôi Vòng Trắng VIP", moTa: "Hai vòng tròn trắng biểu tượng cho sự trọn vẹn và luân hồi." },
  { ten: "Kệ Hoa Tang Lễ 2 Tầng Lan Vàng", moTa: "Sắc vàng truyền thống, phù hợp viếng người lớn tuổi, phật tử." },
  { ten: "Kệ Hoa Chia Buồn Lan Trắng Cúc Đại Đóa", moTa: "Sự hòa quyện giữa các loài hoa đặc trưng của tang lễ." },
  { ten: "Kệ Hoa Viếng Tone Tím Đượm Buồn", moTa: "Màu tím chung thủy, một lời hứa không bao giờ lãng quên." },
  { ten: "Kệ Hoa Tang Lễ Hình Thánh Giá", moTa: "Thiết kế Thánh Giá đặc biệt dành cho đám tang người Công Giáo." },
  { ten: "Kệ Hoa Kính Viếng 2 Tầng Vàng Rực", moTa: "Lời cầu chúc người ra đi sớm siêu thoát về miền cực lạc." },
  { ten: "Kệ Hoa Chia Buồn Lan Trắng Tầng Cao", moTa: "Thiết kế vươn cao đồ sộ, nổi bật nhất trong buổi lễ." },
  { ten: "Kệ Hoa Tang 2 Tầng Tone Tím Môn", moTa: "Sắc tím môn nhẹ nhàng, xoa dịu bầu không khí đau thương." },
  { ten: "Kệ Hoa Kính Viếng Tone Hồng Sen", moTa: "Dành cho những người mang tâm hồn nhẹ nhàng, nữ tính." },
  { ten: "Kệ Hoa Chia Buồn 1 Tầng Nhã Nhặn", moTa: "Đơn giản, lịch sự, thể hiện lòng thành kính sâu sắc." },
  { ten: "Kệ Hoa Viếng Trắng Điểm Tím", moTa: "Nền hoa trắng tinh khôi điểm xuyết những bông tím nhớ thương." },
  { ten: "Kệ Hoa Tang Lễ Trắng Dải Lụa", moTa: "Dải lụa trắng rủ xuống tạo cảm giác mềm mại, bi thương." },
  { ten: "Kệ Hoa Chia Buồn 2 Vòng Tròn Độc Đáo", moTa: "Thiết kế 2 tầng hình vòng tròn lạ mắt, sang trọng." },
  { ten: "Kệ Hoa Kính Viếng Vòng Cúc Tím", moTa: "Cúc tím mang lại sự hoài niệm và nhớ nhung da diết." },
  { ten: "Kệ Hoa Viếng Thiết Kế Riêng", moTa: "Hoa Tươi Thanh Ngọc nhận thiết kế hoa viếng theo yêu cầu." },
  { ten: "Kệ Hoa Tang Lễ 2 Tầng Lan Trắng", moTa: "Kệ lan trắng 2 tầng truyền thống luôn là lựa chọn hàng đầu." },
  { ten: "Kệ Hoa Kính Viếng Trắng Cúc Mẫu Đơn", moTa: "Sử dụng cúc mẫu đơn cao cấp tạo độ phồng và xòe rộng." },
  { ten: "Vòng Hoa Chia Buồn Trắng Truyền Thống", moTa: "Vòng hoa tròn trịa truyền thống, gửi gắm sự trân trọng." },
  { ten: "Kệ Hoa Viếng Vòng Tròn Mix Lan", moTa: "Lan Thái được cắm xòe rộng ôm trọn vòng hoa tâm điểm." },
  { ten: "Kệ Hoa Tang Lễ 2 Tầng Vàng Tươi", moTa: "Hoa lan và ly vàng tạo nên kệ hoa rực rỡ, bề thế." },
  { ten: "Kệ Hoa Chia Buồn Lan Trắng Khổng Lồ", moTa: "Sử dụng hàng trăm cành lan Thái cắm xòe siêu to." },
  { ten: "Vòng Hoa Kính Viếng Tím Lan Điệp", moTa: "Vòng hoa tím đậm chất hoài niệm, trang trọng." },
  { ten: "Kệ Hoa Tang 1 Tầng Trắng Dải Băng", moTa: "Hoa trắng kết hợp dải băng rôn đen/trắng truyền thống." },
  { ten: "Kệ Hoa Viếng 2 Tầng Trắng Phối Tím", moTa: "Sự phân chia màu sắc tinh tế giữa 2 tầng hoa." },
  { ten: "Kệ Chia Buồn Hồ Điệp Tím Trắng", moTa: "Lan hồ điệp luôn khẳng định đẳng cấp của người viếng." },
  { ten: "Kệ Hoa Kính Viếng Trắng Tinh Khôi", moTa: "Một màu trắng bao phủ, thay cho vạn lời đau xót." },
  { ten: "Vòng Hoa Tang Lễ Tone Tím Môn Nhẹ", moTa: "Sắc hoa tím xoa dịu những trái tim đang tổn thương." },
  { ten: "Kệ 2 Tầng Vòng Tròn Hoa Ly Trắng", moTa: "Mùi hương hoa ly sẽ đưa tiễn linh hồn người quá cố." },
  { ten: "Kệ Hoa Viếng Lan Tím 2 Tầng VIP", moTa: "Kệ hoa đồ sộ, màu tím sang trọng, phù hợp không gian lớn." },
  { ten: "Kệ Hoa Chia Buồn Tone Đỏ Vàng", moTa: "Màu sắc mạnh mẽ, phù hợp với phong tục một số vùng miền." },
  { ten: "Kệ Hoa Tang Lễ Lan Vàng Rực Rỡ", moTa: "Hoa lan vàng biểu tượng cho sự tái sinh và phước lành." },
  { ten: "Kệ Kính Viếng Phù Hợp Người Trẻ", moTa: "Tone trắng tinh khiết, xót thương cho một kiếp người dở dang." }
];

seoKinhVieng.forEach((item, index) => {
  let fileChuan = timFileAnh(`139 (${index + 1})`);
  if (fileChuan) khoHoa["Hoa Kính Viếng"].push({ file: fileChuan, ten: item.ten, moTa: item.moTa });
});

// ==========================================
// 3. QUÉT BÓ HOA (130+ ảnh) VÀ TẠO TÊN TỰ ĐỘNG
// ==========================================
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

// ==========================================
// 4. QUÉT CÁC DANH MỤC CÒN LẠI (Tên tĩnh)
// ==========================================
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
    let fileChuan = timFileAnh(sp.file.split('.')[0]); // Tự fix đuôi cho các ảnh cũ luôn
    if (fileChuan) khoHoa[dm].push({ file: fileChuan, ten: sp.ten, moTa: sp.moTa });
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