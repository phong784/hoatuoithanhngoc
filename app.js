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

khoHoa["Hoa Khai Trương"] = [
  { file: "IMG_3426.JPG", ten: "Lẵng Hoa Khai Trương Vàng Cam VIP", moTa: "Kệ hoa 2 tầng rực rỡ mang ý nghĩa tài lộc." },
  { file: "IMG_3427.JPG", ten: "Lẵng Hoa Khai Trương Tone Hồng Dâu", moTa: "Thiết kế hiện đại, sang trọng với tone màu hồng." },
  { file: "IMG_3432.JPG", ten: "Lẵng Hoa Khai Trương Tone Trắng Xanh", moTa: "Kệ hoa khai trương trang nhã, thanh lịch." },
  { file: "IMG_3433.JPG", ten: "Lẵng Hoa Khai Trương Tone Đỏ Rực Rỡ", moTa: "Sắc đỏ may mắn bùng nổ, lời chúc làm ăn phát đạt." },
  { file: "IMG_3435.JPG", ten: "Lẵng Khai Trương Hoa Lan Sang Trọng", moTa: "Sự kết hợp của hoa lan hồ điệp." },
  { file: "IMG_3436.JPG", ten: "Lẵng Khai Trương Đỏ Hồng Phát 1 Tầng", moTa: "Thiết kế 1 tầng gọn gàng nhưng không kém phần nổi bật." },
  { file: "IMG_3438.JPG", ten: "Lẵng Khai Trương Tone Đỏ Quyền Lực", moTa: "Kệ đứng sang trọng, màu đỏ chủ đạo." },
  { file: "IMG_3440.JPG", ten: "Lẵng Hoa Khai Trương Trắng Tím", moTa: "Sự chung thủy và thịnh vượng được gửi gắm." },
  { file: "IMG_3442.JPG", ten: "Lẵng Hoa Khai Trương 2 Tầng Tone Hồng", moTa: "Sang trọng và ngọt ngào." },
  { file: "IMG_3443.JPG", ten: "Lẵng Hoa Hiện Đại Trắng Đỏ", moTa: "Thiết kế bất đối xứng nghệ thuật." },
  { file: "IMG_3448.JPG", ten: "Lẵng Khai Trương Hồng Tươi Tắn", moTa: "Kệ hoa đứng tone hồng mix trắng." },
  { file: "IMG_3449.JPG", ten: "Lẵng Hoa Khai Trương Khung Tranh", moTa: "Thiết kế kệ khung hiện đại kiểu mới." },
  { file: "IMG_3452.JPG", ten: "Lẵng Khai Trương Trắng Hồ Điệp", moTa: "Kệ hoa VIP sử dụng Lan Hồ Điệp trắng." },
  { file: "IMG_3453.JPG", ten: "Lẵng Khai Trương Tone Hồng Lãng Mạn", moTa: "Thiết kế riêng mẫu kệ hoa hồng pastel." },
  { file: "IMG_3455.JPG", ten: "Lẵng Khai Trương Trắng Xanh Tinh Tế", moTa: "Gam màu lạnh sang trọng, thanh lịch." },
  { file: "IMG_3457.JPG", ten: "Lẵng Khai Trương Trắng Vàng Tươi Sáng", moTa: "Sự kết hợp hoàn hảo giữa sắc trắng và vàng." },
  { file: "IMG_3458.JPG", ten: "Lẵng Hoa Khai Trương Tone Đỏ Hiện Đại", moTa: "Kệ đứng 2 tầng bọc lưới voan bồng bềnh." },
  { file: "IMG_3461.JPG", ten: "Lẵng Hoa Mừng Thọ Tone Đỏ Đậm", moTa: "Sắc đỏ trầm ấm áp." },
  { file: "IMG_3468.JPG", ten: "Lẵng Khai Trương Trắng Tím Trang Nhã", moTa: "Kệ hoa phong cách Tây Âu." },
  { file: "IMG_3470.JPG", ten: "Lẵng Khai Trương Hồng Pastel Voan", moTa: "Kệ hoa được quấn voan điệu đà." },
  { file: "IMG_3471.JPG", ten: "Lẵng Khai Trương Trắng Mix Lá Nhiệt Đới", moTa: "Thiết kế khác biệt với các loại hoa trắng." },
  { file: "IMG_3474.JPG", ten: "Lẵng Hoa Khai Trương Hồng Phấn Voan Nhẹ", moTa: "Nhẹ nhàng, bay bổng." },
  { file: "IMG_3475.JPG", ten: "Lẵng Khai Trương Tone Trắng Tinh Tế", moTa: "Kệ hoa sang trọng, mix đa dạng các loại hoa trắng." },
  { file: "IMG_3482.JPG", ten: "Lẵng Khai Trương Hồng Sen Đậm", moTa: "Tone màu nổi bật, thu hút ánh nhìn." },
  { file: "IMG_3487.JPG", ten: "Lẵng Khai Trương Vàng Lá Bạc Tỏa Đều", moTa: "Thiết kế xòe tròn đều đặn." },
  { file: "IMG_3502.JPG", ten: "Bình Hoa Mừng Khai Trương Rực Rỡ", moTa: "Bình hoa cắm vòm hoành tráng đặt trên đôn gỗ." },
  { file: "IMG_3503.JPG", ten: "Kệ Khai Trương Xanh Blue Đẳng Cấp", moTa: "Kệ hoa 2 tầng sử dụng hoa hồng xanh blue." },
  { file: "IMG_3508.JPG", ten: "Lẵng Khai Trương Tone Xanh Trắng VIP", moTa: "Kệ hoa sảnh tone màu lạnh sang trọng." },
  { file: "IMG_3742.JPG", ten: "Kệ Khai Trương Đại Sảnh Vàng Cam Đỏ", moTa: "Kệ hoa siêu cao cấp thiết kế dành riêng cho đại sảnh." },
  { file: "IMG_3743.JPG", ten: "Kệ Khai Trương Sảnh Đỏ Hồng Vàng VIP", moTa: "Sự pha trộn màu sắc khéo léo tạo nên kệ hoa hoành tráng." },
  { file: "IMG_3744.JPG", ten: "Kệ Khai Trương Quyền Lực Đỏ Cam", moTa: "Kết cấu 2 tầng đồ sộ, thể hiện sự uy quyền." },
  { file: "IMG_3745.JPG", ten: "Kệ Khai Trương Trắng Xanh Tinh Khôi Đại Sảnh", moTa: "Kệ hoa VIP mang nét đẹp Tây Âu sang trọng." },
  { file: "IMG_3746.JPG", ten: "Kệ Khai Trương VIP Xanh Blue Hoàng Gia", moTa: "Một tác phẩm nghệ thuật hoa tươi đẳng cấp." }
]

khoHoa["Bó Hoa"] = [
  { file: "hoa-hong.jpg", ten: "Bó Hoa Hồng Vàng Tươi Sáng", moTa: "Bó hoa hồng vàng mix baby trắng rạng rỡ." },
  { file: "IMG_3411.JPG", ten: "Bó Hoa Hồng Dâu Giấy Đen", moTa: "Hoa hồng màu dâu cá tính gói trong giấy đen huyền bí." },
  { file: "IMG_3413.JPG", ten: "Bó Hoa Hồng Kem Cổ Điển", moTa: "Tone màu kem pastel nhẹ nhàng gói giấy lưới." },
  { file: "IMG_3414.JPG", ten: "Bó Hoa Mix Tone Pastel Xinh Xắn", moTa: "Sự kết hợp tinh tế giữa hoa hồng và lá phụ." },
  { file: "IMG_3417.JPG", ten: "Bó Hoa Hồng Vàng Giấy Lưới", moTa: "Hồng vàng rực rỡ tượng trưng cho tình bạn." },
  { file: "IMG_3428.JPG", ten: "Bó Hoa Sen Trắng Thanh Lịch", moTa: "Hoa sen trắng ngát hương, thuần khiết." },
  { file: "IMG_3429.JPG", ten: "Bó Hoa Hướng Dương 3 Bông Tươi Tắn", moTa: "Món quà ý nghĩa ngày tốt nghiệp." },
  { file: "IMG_3430.JPG", ten: "Bó Hoa Hướng Dương Giấy Xanh", moTa: "Mix cùng giấy gói tone xanh dương hiện đại." },
  { file: "IMG_3434.JPG", ten: "Bó Hoa Hồng Trắng Tinh Khôi", moTa: "Những đóa hồng trắng muốt." },
  { file: "IMG_3437.JPG", ten: "Bó Hoa Hồng Cam Mix Giấy Vàng", moTa: "Tone màu cam đào rực rỡ, ấm áp." },
  { file: "IMG_3444.JPG", ten: "Bó Hoa Hồng Xinh Gói Giấy Kraft", moTa: "Vẻ đẹp tự nhiên, mộc mạc." },
  { file: "IMG_3450.JPG", ten: "Bó Hoa Hướng Dương Giấy Kraft Đẹp", moTa: "Mix hoa baby và lá bạc eucalyptus." },
  { file: "IMG_3456.JPG", ten: "Bó Hoa Hồng Trắng Gói Giấy Trắng", moTa: "Tuyết trắng tinh khôi." },
  { file: "IMG_3460.JPG", ten: "Bó Hoa Hồng Cam Giấy Trong Suốt", moTa: "Bó hoa tone cam cháy rực rỡ." },
  { file: "IMG_3466.JPG", ten: "Bó Hoa Hồng Cam Đào Nhẹ Nhàng", moTa: "Gam màu ngọt ngào, tinh tế." },
  { file: "IMG_3472.JPG", ten: "Bó Hoa Hồng Phấn Giấy Đen Cuốn Hút", moTa: "Sự đối lập giữa hoa hồng phấn và giấy gói đen." },
  { file: "IMG_3480.JPG", ten: "Bó Hoa Hồng Phấn Giấy Xếp Lớp", moTa: "Kỹ thuật gói hoa xếp lớp hiện đại." },
  { file: "IMG_3483.JPG", ten: "Bó Hoa Hướng Dương Giấy Lưới Vàng", moTa: "Đồng bộ tone vàng từ hoa đến giấy gói." },
  { file: "IMG_3496.JPG", ten: "Bó Hoa Hồng Đỏ Giấy Trắng Trong", moTa: "Hoa hồng đỏ bọc voan/giấy mờ." },
  { file: "IMG_3497.JPG", ten: "Bó Hoa Hướng Dương Baby Khổng Lồ", moTa: "Bó hoa siêu bự, ôm trọn vòng tay." },
  { file: "IMG_3498.JPG", ten: "Bó Hoa Cúc Pingpong Trắng Nhẹ Nhàng", moTa: "Hình dáng tròn xoe đáng yêu." },
  { file: "IMG_3500.JPG", ten: "Bó Hoa Hồng Trắng Phối Giấy Ghi Trầm", moTa: "Tone trắng mix cùng giấy màu xám ghi." },
  { file: "IMG_3501.JPG", ten: "Bó Hoa Hồng Xanh Rực Rỡ Cực Lạ", moTa: "Hoa hồng xanh mang thông điệp kỳ diệu." },
  { file: "IMG_3506.JPG", ten: "Bó Hoa Trắng Xanh Tinh Tế", moTa: "Hoa hồng trắng mix lá phụ xanh mát." },
  { file: "IMG_3510.JPG", ten: "Bó Hoa Hồng Trắng Mini Xinh Xắn", moTa: "Bó hoa hồng trắng nhỏ nhắn." },
  { file: "IMG_3511.JPG", ten: "Bó Hoa Hồng Đỏ Lưới Voan Bồng Bềnh", moTa: "Hoa hồng đỏ rực bọc trong lớp lưới voan." },
  { file: "IMG_3706.JPG", ten: "Bó Hoa Hồng Vàng Giấy Xanh Nhạt", moTa: "Sắc vàng tươi tắn kết hợp giấy gói xanh pastel." },
  { file: "IMG_3707.JPG", ten: "Bó Hoa Hồng Đỏ Tình Yêu Bí Ẩn", moTa: "Hồng đỏ quyến rũ bọc giấy đen thắt nơ đỏ." },
  { file: "IMG_3708.JPG", ten: "Bó Hoa Tone Trắng Hồng Trong Trẻo", moTa: "Tone màu pastel dịu dàng." },
  { file: "IMG_3709.JPG", ten: "Bó Hoa Tone Tím Mộng Mơ", moTa: "Hoa mix tone tím thủy chung, lãng mạn." },
  { file: "IMG_3710.JPG", ten: "Set 2 Bó Hoa Hồng Tone Nóng", moTa: "Gợi ý tuyệt vời mua hoa cặp tặng 2 người." },
  { file: "IMG_3711.JPG", ten: "Bó Hoa Mix Màu Sắc Tươi Vui", moTa: "Hoa hồng phối nhiều màu sắc rực rỡ." },
  { file: "IMG_3712.JPG", ten: "Bó Hoa Hồng Vàng Cam Ấm Áp", moTa: "Sắc màu rực rỡ của nắng mặt trời." },
  { file: "IMG_3713.JPG", ten: "Bó Hoa Hồng Phấn Ngọt Ngào", moTa: "Bó hoa quốc dân cho dịp sinh nhật." },
  { file: "IMG_3714.JPG", ten: "Hoa Cặp Đôi Đỏ Phấn", moTa: "Sự kết hợp giữa 2 bó hoa đỏ và nhẹ nhàng." },
  { file: "IMG_3715.JPG", ten: "Bó Hoa Hồng Giấy Xanh Lạ Mắt", moTa: "Hoa hồng phấn mix cùng giấy gói xanh ngọc." },
  { file: "IMG_3716.JPG", ten: "Bó Hoa Mix Tone Tím Lãng Mạn", moTa: "Màu tím chung thủy mix bồng bềnh." },
  { file: "IMG_3717.JPG", ten: "Bó Hoa Hồng Phấn Dáng Dài", moTa: "Kỹ thuật bó dáng dài hiện đại thanh thoát." },
  { file: "IMG_3718.JPG", ten: "Bó Hoa Hồng Tinh Khôi Phối Cam", moTa: "Sự đan xen nhẹ nhàng trắng và cam nhạt." },
  { file: "IMG_3719.JPG", ten: "Bó Hoa Hồng Dâu Voan Lụa", moTa: "Sử dụng voan lụa cao cấp tạo độ rủ mềm mại." },
  { file: "IMG_3720.JPG", ten: "Set Bó Hoa Đôi Tone Cam Phấn", moTa: "Hai phiên bản màu sắc rực rỡ và nền nã." },
  { file: "IMG_3721.JPG", ten: "Set Bó Hoa Đôi Tone Tím Hồng", moTa: "Hai bó hoa nhỏ xinh tone màu lãng mạn." },
  { file: "IMG_3722.JPG", ten: "Bó Hoa Mix Cúc Tana Và Hồng", moTa: "Hoa mix phong cách đồng quê nhẹ nhàng." },
  { file: "IMG_3723.JPG", ten: "Bó Hoa Ly Phối Hồng Giấy Kraft", moTa: "Hoa ly thơm ngát vươn cao, bọc giấy mộc." },
  { file: "IMG_3724.JPG", ten: "Bó Hoa Hồng Vàng Tràn Đầy Năng Lượng", moTa: "Tone cam vàng rực lửa tạo bất ngờ mạnh." },
  { file: "IMG_3725.JPG", ten: "Bó Hoa Tím Hồng Tone Đậm Cuốn Hút", moTa: "Màu hoa đậm đà rực rỡ bọc giấy màu sen." },
  { file: "IMG_3726.JPG", ten: "Bó Hoa Hồng Đỏ Giấy Đỏ Quyền Lực", moTa: "Lựa chọn số 1 cho ngày Valentine." },
  { file: "IMG_3727.JPG", ten: "Hoa Cặp Tình Yêu Hồng Đỏ", moTa: "Hồng đỏ minh chứng cho tình yêu nồng cháy." },
  { file: "IMG_3728.JPG", ten: "Bó Hoa Hồng Đỏ Giấy Rêu Cổ Điển", moTa: "Phối màu phong cách hoàng gia Đỏ Xanh rêu." },
  { file: "IMG_3729.JPG", ten: "Bó Hoa Hồng Đỏ Black Valentine", moTa: "Đỏ và Đen sự kết hợp đẳng cấp." },
  { file: "IMG_3730.JPG", ten: "Bó Hoa Phối Màu Độc Lạ Cá Tính", moTa: "Mix phá cách đóa hoa xanh dương làm điểm nhấn." },
  { file: "IMG_3731.JPG", ten: "Bó Hoa Hồng Đỏ Nằm Xinh Xắn", moTa: "Bó hồng tròn xoe gọn gàng." },
  { file: "IMG_3732.JPG", ten: "Bó Hoa Trắng Xanh Lá Tự Nhiên", moTa: "Phong cách chữa lành trắng tinh khiết." },
  { file: "IMG_3733.JPG", ten: "Bó Hoa Hồng Đỏ Cổ Điển Form Tròn", moTa: "Bó sát xòe tròn truyền thống, giấy đen sang chảnh." },
  { file: "IMG_3734.JPG", ten: "Bó Hoa Hồng Đỏ Mix Nụ Nhỏ", moTa: "Bó hồng nhung mix cùng các lá li ti." },
  { file: "IMG_3735.JPG", ten: "Bó Hoa Tone Hồng Tím Cẩm Lệ", moTa: "Phù hợp tặng sếp nữ hoặc đối tác." },
  { file: "IMG_3736.JPG", ten: "Bó Hoa Lan Vũ Nữ Vàng Sang Trọng", moTa: "Hàng trăm bông lan vàng ươm rủ xuống." },
  { file: "IMG_3737.JPG", ten: "Bó Hoa Tulip Phối Hồng Baby", moTa: "Hoa nữ hoàng Tulip vươn cao đắt giá." },
  { file: "IMG_3738.JPG", ten: "Hoa Cặp Hướng Dương Nhỏ Xinh", moTa: "Kích thước mini dễ thương làm quà tặng tốt nghiệp." },
  { file: "IMG_3739.JPG", ten: "Bó Hướng Dương Cắm Một Mặt", moTa: "Phô diễn trọn vẹn vẻ đẹp mặt trời nhỏ." },
  { file: "IMG_3740.JPG", ten: "Bó Hoa Tình Yêu Đỏ Hồng Xòe Rộng", moTa: "Bó hoa size lớn xòe rộng ôm trọn lòng." },
  { file: "IMG_3741.JPG", ten: "Bó Hoa Xanh Blue Cực Nổi Bật", moTa: "Sắc xanh dương huyền thoại kết hợp nơ xanh." }
];

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