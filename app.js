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
khoHoa["Bó Hoa"] = [
  { file: "1 (1).jpg", ten: "Bó Hoa Tình Yêu Tone Đỏ Lãng Mạn", moTa: "Bó hoa hồng đỏ rực rỡ, món quà tuyệt vời để bày tỏ tình yêu." },
  { file: "1 (2).jpg", ten: "Bó Hoa Hồng Phấn Ngọt Ngào", moTa: "Sắc hồng pastel nhẹ nhàng, phù hợp tặng sinh nhật, kỷ niệm." },
  { file: "1 (3).jpg", ten: "Bó Hoa Xanh Blue Huyền Bí", moTa: "Tone xanh dương lạ mắt, mang ý nghĩa tình yêu vĩnh cửu." },
  { file: "1 (4).jpg", ten: "Bó Hoa Hướng Dương Tỏa Nắng", moTa: "Món quà tuyệt vời dành tặng ngày lễ tốt nghiệp, thăng chức." },
  { file: "1 (5).jpg", ten: "Bó Hoa Mix Màu Pastel Hiện Đại", moTa: "Phong cách Hàn Quốc nữ tính, dịu dàng và cực kỳ sang trọng." },
  { file: "1 (6).jpg", ten: "Bó Hoa Hồng Đỏ Khổng Lồ", moTa: "Bó hoa size lớn ôm trọn vòng tay, gây ấn tượng mạnh mẽ." },
  { file: "1 (7).jpg", ten: "Bó Hoa Cúc Tana Mix Nhẹ Nhàng", moTa: "Mang vẻ đẹp mộc mạc, hoang dại như hơi thở đồng quê." },
  { file: "1 (8).jpg", ten: "Bó Hoa Hồng Cam Cháy Trendy", moTa: "Màu cam cháy đang là xu hướng được giới trẻ yêu thích nhất." },
  { file: "1 (9).jpg", ten: "Bó Hoa Baby Trắng Tinh Khôi", moTa: "Hoa baby trắng bồng bềnh, đại diện cho tình yêu thuần khiết." },
  { file: "1 (10).jpg", ten: "Bó Hoa Ly Hồng Thơm Ngát", moTa: "Hoa ly vươn cao sang trọng, phù hợp tặng mẹ hoặc tặng sếp." },
  { file: "1 (11).jpg", ten: "Bó Hoa Tone Tím Mộng Mơ", moTa: "Sự kết hợp hoàn hảo cho những ai yêu thích sự thủy chung, lãng mạn." },
  { file: "1 (12).jpg", ten: "Bó Hoa Tulip Cầm Tay Sang Chảnh", moTa: "Loài hoa nữ hoàng mang đẳng cấp hoàng gia, nâng tầm người nhận." },
  { file: "1 (13).jpg", ten: "Bó Hoa Dâu Tây Dễ Thương", moTa: "Mix hoa và trái cây độc đáo, vừa đẹp mắt vừa thực tế." },
  { file: "1 (14).jpg", ten: "Bó Hoa Cát Tường Rực Rỡ", moTa: "Mang thông điệp vạn sự như ý, cát tường bình an." },
  { file: "1 (15).jpg", ten: "Bó Hoa Hồng Dâu Phối Lá Bạc", moTa: "Lá bạc nhập khẩu làm nổi bật lên những đóa hồng dâu xinh xắn." },
  { file: "1 (16).jpg", ten: "Bó Hoa Kỷ Niệm Ngày Cưới", moTa: "Gửi trọn yêu thương cùng bó hoa mix tone đỏ hồng nồng nàn." },
  { file: "1 (17).jpg", ten: "Bó Hoa Xin Lỗi Chân Thành", moTa: "Tone màu nhã nhặn giúp bạn gửi gắm lời xin lỗi đến người thương." },
  { file: "1 (18).jpg", ten: "Bó Hoa Hồng Trắng Gói Giấy Đen", moTa: "Sự tương phản ấn tượng tạo nên nét quyến rũ, bí ẩn." },
  { file: "1 (19).jpg", ten: "Bó Hoa Mẫu Đơn Peony Nhập Khẩu", moTa: "Loài hoa vương giả, bông to xòe rộng cực kỳ đẳng cấp." },
  { file: "1 (20).jpg", ten: "Bó Hoa Baby Hồng Khổng Lồ", moTa: "Baby nhuộm hồng ngọt ngào, món quà khiến mọi cô gái tan chảy." },
  { file: "1 (21).jpg", ten: "Bó Hoa Mix 3 Bông Hướng Dương", moTa: "Biểu tượng của niềm tin và sự hi vọng luôn hướng về mặt trời." },
  { file: "1 (22).jpg", ten: "Bó Hoa Sinh Nhật Tặng Bạn Gái", moTa: "Tone hồng sen rực rỡ, thiết kế gói xếp lớp phong cách mới." },
  { file: "1 (23).jpg", ten: "Bó Hoa Lan Hồ Điệp Cầm Tay", moTa: "Đẳng cấp VIP với những cành lan hồ điệp quý phái." },
  { file: "1 (24).jpg", ten: "Bó Hoa Cúc Pingpong Tròn Xoe", moTa: "Những viên pingpong dễ thương, mang lại nụ cười rạng rỡ." },
  { file: "1 (25).jpg", ten: "Bó Hoa Tình Bạn Tươi Vui", moTa: "Mix nhiều loại hoa rực rỡ sắc màu, tượng trưng cho tình bạn đẹp." },
  { file: "1 (26).jpg", ten: "Bó Hoa Cầu Hôn Lãng Mạn", moTa: "Giúp bạn ghi điểm tuyệt đối trong khoảnh khắc quan trọng nhất." },
  { file: "1 (27).jpg", ten: "Bó Hoa Tone Vàng Năng Động", moTa: "Màu vàng tươi tắn xua tan mỏi mệt, truyền năng lượng tích cực." },
  { file: "1 (28).jpg", ten: "Bó Hoa Hồng Đỏ Cổ Điển", moTa: "Bó hoa gói dáng tròn truyền thống, vẻ đẹp không bao giờ lỗi thời." },
  { file: "1 (29).jpg", ten: "Bó Hoa Gói Giấy Kraft Xi Măng", moTa: "Phong cách mộc mạc, vintage dành cho những tâm hồn nghệ sĩ." },
  { file: "1 (30).jpg", ten: "Bó Hoa Chúc Mừng 8/3 Nổi Bật", moTa: "Thiết kế đặc biệt dành riêng cho một nửa thế giới." },
  { file: "1 (31).jpg", ten: "Bó Hoa Tặng Ngày 20/10", moTa: "Món quà thay ngàn lời cảm ơn gửi đến mẹ, vợ và chị em gái." },
  { file: "1 (32).jpg", ten: "Bó Hoa Hướng Dương Phối Baby", moTa: "Sự kết hợp quốc dân không thể thiếu trong các mùa kỷ yếu." },
  { file: "1 (33).jpg", ten: "Bó Hoa Cẩm Chướng Thanh Cao", moTa: "Hoa cẩm chướng mang ý nghĩa về sự ái mộ và lòng tôn kính." },
  { file: "1 (34).jpg", ten: "Bó Hoa Đồng Tiền Chúc Sức Khỏe", moTa: "Màu sắc rực rỡ mang lời chúc bình an, mau bình phục." },
  { file: "1 (35).jpg", ten: "Bó Hoa Hồng Juliet Quý Tộc", moTa: "Hồng Juliet triệu đô mang vẻ đẹp kiêu sa lộng lẫy." },
  { file: "1 (36).jpg", ten: "Bó Hoa Đón Sân Bay", moTa: "Thiết kế dáng dài ôm tay, trang trọng đón khách quý, người thân." },
  { file: "1 (37).jpg", ten: "Bó Hoa Hồng Trắng Tinh Khiết", moTa: "Một tình yêu không vụ lợi, trong sáng và chân thành." },
  { file: "1 (38).jpg", ten: "Bó Hoa Mix Phong Cách Tây Âu", moTa: "Cắm hoa dáng thả tự nhiên, phóng khoáng và hiện đại." },
  { file: "1 (39).jpg", ten: "Bó Hoa Tặng Sếp Nam Sang Trọng", moTa: "Tone màu mạnh mẽ, trầm ấm, lịch sự tôn vinh người lãnh đạo." },
  { file: "1 (40).jpg", ten: "Bó Hoa Tặng Đồng Nghiệp", moTa: "Nhỏ gọn, tinh tế, gửi gắm tình cảm gắn bó nơi công sở." },
  { file: "1 (41).jpg", ten: "Bó Hoa Hồng Tím Chung Thủy", moTa: "Sắc tím lavender mộng mơ, gửi gắm lời hứa bên nhau trọn đời." },
  { file: "1 (42).jpg", ten: "Bó Hoa Thạch Thảo Dịu Dàng", moTa: "Những cánh hoa li ti mang vẻ đẹp mong manh, thuần khiết." },
  { file: "1 (43).jpg", ten: "Bó Hoa Phối Lưới Voan Lãng Mạn", moTa: "Lớp lưới bồng bềnh tựa như chiếc váy cưới của cô dâu." },
  { file: "1 (44).jpg", ten: "Bó Hoa Hồng Cam Cà Rốt", moTa: "Màu sắc mới lạ, cá tính dành cho những cô nàng độc lập." },
  { file: "1 (45).jpg", ten: "Bó Hoa Baby Xanh Mát Mắt", moTa: "Hoa baby nhuộm xanh blue, mang lại cảm giác bình yên thư thái." },
  { file: "1 (46).jpg", ten: "Bó Hoa 1 Bông Siêu To", moTa: "Thiết kế 1 bông hướng dương hoặc hồng size đại cực kỳ dễ thương." },
  { file: "1 (47).jpg", ten: "Bó Hoa Lan Vũ Nữ Rực Rỡ", moTa: "Lan vũ nữ vàng ươm vươn mình như những nàng công vũ nhảy múa." },
  { file: "1 (48).jpg", ten: "Bó Hoa Sen Trắng Gói Giấy Mộc", moTa: "Hoa sen ngát hương thơm, thanh tao và thoát tục." },
  { file: "1 (49).jpg", ten: "Bó Hoa Tặng Giáo Viên 20/11", moTa: "Món quà tri ân sâu sắc gửi đến những người lái đò thầm lặng." },
  { file: "1 (50).jpg", ten: "Bó Hoa Chúc Mừng Khai Trương", moTa: "Tone đỏ vàng rực rỡ mang lời chúc hồng phát, thành công." },
  { file: "1 (51).jpg", ten: "Bó Hoa Thiết Kế Riêng Theo Yêu Cầu", moTa: "Thanh Ngọc Flower thiết kế bó hoa độc bản mang đậm dấu ấn cá nhân." },
  { file: "1 (52).jpg", ten: "Bó Hoa Tone Đỏ Rượu Vang", moTa: "Sắc đỏ burgundy quyền lực, sang trọng bậc nhất." },
  { file: "1 (53).jpg", ten: "Bó Hoa Mix Lan Trần Mộng", moTa: "Vẻ đẹp kiêu kỳ, đắt giá của dòng hoa lan cao cấp." },
  { file: "1 (54).jpg", ten: "Bó Hoa Dáng Dài Thanh Thoát", moTa: "Kỹ thuật bó dáng dài giúp đóa hoa vươn cao kiêu hãnh." },
  { file: "1 (55).jpg", ten: "Bó Hoa Hồng Cẩm Thạch", moTa: "Màu hoa độc đáo với những đường vân lạ mắt." },
  { file: "1 (56).jpg", ten: "Bó Hoa Kỷ Niệm 1 Năm Yêu Nhau", moTa: "Ghi dấu cột mốc quan trọng với bó hoa tươi thắm rực rỡ." },
  { file: "1 (57).jpg", ten: "Bó Hoa Hồng Bạc Bí Ẩn", moTa: "Hoa hồng xịt nhũ bạc lấp lánh, món quà đầy tính nghệ thuật." },
  { file: "1 (58).jpg", ten: "Bó Hoa Dành Cho Người Ấy", moTa: "Mỗi đóa hoa là một lời thì thầm yêu thương chưa dám ngỏ." },
  { file: "1 (59).jpg", ten: "Bó Hoa Rực Sáng Góc Trời", moTa: "Mix đa dạng các loại hoa tone nóng rực rỡ nhất tiệm." },
  { file: "1 (60).jpg", ten: "Bó Hoa Chữa Lành Tâm Hồn", moTa: "Tone màu xanh lá và trắng mát mắt, mang lại bình yên." },
  { file: "1 (61).jpg", ten: "Bó Hoa Cúc Họa Mi", moTa: "Loài hoa báo hiệu mùa đông đến, nhẹ nhàng và lãng mạn." },
  { file: "1 (62).jpg", ten: "Bó Hoa Tone Cam Đào Ngọt Ngào", moTa: "Sắc cam đào peach dễ thương tôn lên vẻ nữ tính." },
  { file: "1 (63).jpg", ten: "Bó Hoa Tặng Ngày Valentine 14/2", moTa: "Tuyệt phẩm hoa hồng cháy bỏng cho ngày Lễ Tình Nhân." },
  { file: "1 (64).jpg", ten: "Bó Hoa Trắng Đen Đối Lập", moTa: "Sự kết hợp phá cách mang đậm tính thời trang." },
  { file: "1 (65).jpg", ten: "Bó Hoa Hồng Dáng Tròn Ôm", moTa: "Kiểu dáng nhỏ xinh xòe đều, dễ dàng ôm trọn vào lòng." },
  { file: "1 (66).jpg", ten: "Bó Hoa Tặng Mẹ Ý Nghĩa", moTa: "Những bông hoa thay lời biết ơn công sinh thành dưỡng dục." },
  { file: "1 (67).jpg", ten: "Bó Hoa Tặng Chị Gái Dễ Thương", moTa: "Mix hoa tone màu tươi vui, rạng rỡ và tràn đầy sức sống." },
  { file: "1 (68).jpg", ten: "Bó Hoa Ly Kép Sang Trọng", moTa: "Hoa ly kép nhiều lớp cánh, thơm lâu và cực kỳ hoành tráng." },
  { file: "1 (69).jpg", ten: "Bó Hoa Nhỏ Gọn Kèm Quà", moTa: "Size mini phù hợp để tặng kèm hộp quà, trang sức." },
  { file: "1 (70).jpg", ten: "Bó Hoa Thanh Xuân Rực Rỡ", moTa: "Lưu giữ tuổi trẻ với những đóa hoa tỏa nắng tươi tắn." },
  { file: "1 (71).jpg", ten: "Bó Hoa Hồng Song Hỷ", moTa: "Hồng song hỷ viền hồng lõi trắng mang vẻ đẹp cuốn hút." },
  { file: "1 (72).jpg", ten: "Bó Hoa Gói Giấy Nhám Hàn Quốc", moTa: "Giấy gói cao cấp chống nước, giữ phom dáng hoa chuẩn nhất." },
  { file: "1 (73).jpg", ten: "Bó Hoa Lan Ý Nhẹ Nhàng", moTa: "Hoa lan ý thanh lịch, vẻ đẹp không phô trương." },
  { file: "1 (74).jpg", ten: "Bó Hoa Đinh Hương Rực Rỡ", moTa: "Đinh hương thơm ngát tỏa hương quyến rũ." },
  { file: "1 (75).jpg", ten: "Bó Hoa Phong Lữ Thảo", moTa: "Hoa phong lữ nhỏ xinh, mix cùng lá phụ bay bổng." },
  { file: "1 (76).jpg", ten: "Bó Hoa Nụ Cầm Tay Khéo Léo", moTa: "Thiết kế hoa nụ chúm chím mang hy vọng rạng ngời." },
  { file: "1 (77).jpg", ten: "Bó Hoa Trạng Nguyên", moTa: "Chúc mừng thi đỗ, đỗ đạt thành danh với hoa trạng nguyên." },
  { file: "1 (78).jpg", ten: "Bó Hoa Cúc Cu", moTa: "Hoa cúc họa mi nhỏ nhắn tựa như những vì sao." },
  { file: "1 (79).jpg", ten: "Bó Hoa Thủy Tiên", moTa: "Thủy tiên kiêu hãnh, vươn cao trong nắng mai." },
  { file: "1 (80).jpg", ten: "Bó Hoa Dành Tặng Ngày Gặp Mặt", moTa: "Ghi ấn tượng ban đầu với bó hoa nhã nhặn, lịch thiệp." },
  { file: "1 (81).jpg", ten: "Bó Hoa Dạ Lan Hương", moTa: "Hương thơm nồng nàn quyến rũ lưu giữ kỷ niệm khó phai." },
  { file: "1 (82).jpg", ten: "Bó Hoa Mix Tone Lạnh Mùa Thu", moTa: "Phối màu thu đông lãng mạn, mang vẻ đẹp buồn man mác." },
  { file: "1 (83).jpg", ten: "Bó Hoa Trà Mi Tinh Khôi", moTa: "Hoa trà mi mang ý nghĩa về sự duyên dáng, đáng yêu." },
  { file: "1 (84).jpg", ten: "Bó Hoa Mùa Cưới Cầm Tay", moTa: "Hoa cô dâu cầm tay thiết kế tinh tế, sang trọng." },
  { file: "1 (85).jpg", ten: "Bó Hoa Hồng Gấp Cánh Nở To", moTa: "Kỹ thuật gấp cánh hoa hồng hiện đại giúp hoa nở bung lộng lẫy." },
  { file: "1 (86).jpg", ten: "Bó Hoa Đỗ Quyên Xinh Xắn", moTa: "Hoa đỗ quyên mang thông điệp ôn hòa, nữ tính." },
  { file: "1 (87).jpg", ten: "Bó Hoa Tử Đinh Hương", moTa: "Tử đinh hương mang xúc cảm của mối tình đầu lãng mạn." },
  { file: "1 (88).jpg", ten: "Bó Hoa Mừng Thọ Người Lớn Tuổi", moTa: "Thiết kế đằm thắm, màu sắc truyền thống gửi lời chúc sống lâu." },
  { file: "1 (89).jpg", ten: "Bó Hoa Tri Ân Khách Hàng", moTa: "Quà tặng doanh nghiệp sang trọng, tinh tế thắt chặt mối quan hệ." },
  { file: "1 (90).jpg", ten: "Bó Hoa Mix Cỏ Lau Tự Nhiên", moTa: "Phong cách du mục boho hoang dã cực kỳ thu hút." },
  { file: "1 (91).jpg", ten: "Bó Hoa Tường Vi Mỏng Manh", moTa: "Hoa tường vi nhẹ nhàng, thanh tao và đầy thơ mộng." },
  { file: "1 (92).jpg", ten: "Bó Hoa Hồng Mix Nụ Nhỏ Li Ti", moTa: "Sự kết hợp giữa hoa chính to và các loại hoa phụ bay bổng." },
  { file: "1 (93).jpg", ten: "Bó Hoa Tình Yêu Vĩnh Cửu", moTa: "Bó hoa 99 đóa hồng thay cho lời hứa mãi không lìa xa." },
  { file: "1 (94).jpg", ten: "Bó Hoa Màu Nắng Ban Mai", moTa: "Mang trọn vẹn ánh nắng ấm áp buổi sớm mai gửi đến bạn." },
  { file: "1 (95).jpg", ten: "Bó Hoa Thiết Kế 1 Mặt Đẹp", moTa: "Kỹ thuật cắm một mặt phô diễn toàn bộ vẻ đẹp của các loài hoa." },
  { file: "1 (96).jpg", ten: "Bó Hoa Giấy Gói Hàn Quốc Voan Lụa", moTa: "Sử dụng voan lụa mềm mại tạo nên kiệt tác nghệ thuật hoa tươi." },
  { file: "1 (97).jpg", ten: "Bó Hoa Yêu Thương Gửi Trọn", moTa: "Bó hoa gói trọn tình cảm chân thành từ người tặng." },
  { file: "1 (98).jpg", ten: "Bó Hoa Mix Hoa Cỏ Tự Nhiên", moTa: "Hòa mình vào thiên nhiên với phong cách cắm hoa lá tự do." },
  { file: "1 (99).jpg", ten: "Bó Hoa Chúc Mừng Tân Gia", moTa: "Sắc vàng, đỏ chủ đạo rực rỡ đón chào những điều may mắn." },
  { file: "1 (100).jpg", ten: "Bó Hoa Hạnh Phúc Lứa Đôi", moTa: "Chứng nhân cho những khoảnh khắc ngọt ngào nhất của tình yêu." },
  { file: "1 (101).jpg", ten: "Bó Hoa Phối Màu Cá Tính Độc Bản", moTa: "Không đụng hàng, thể hiện gu thẩm mỹ cực chất của bạn." },
  { file: "1 (102).jpg", ten: "Bó Hoa Dành Tặng Bản Thân", moTa: "Đừng quên tự thưởng cho mình một bó hoa rực rỡ ngày cuối tuần." },
  { file: "1 (103).jpg", ten: "Bó Hoa Gắn Kết Yêu Thương", moTa: "Nối lại những nhịp cầu tình cảm bằng bó hoa đầy ý nghĩa." },
  { file: "1 (104).jpg", ten: "Bó Hoa Chào Đón Thành Viên Mới", moTa: "Quà tặng tuyệt vời dành cho mẹ bỉm sữa đón em bé chào đời." },
  { file: "1 (105).jpg", ten: "Bó Hoa Chúc Mừng Thăng Chức", moTa: "Thể hiện sự ngưỡng mộ và chúc mừng nấc thang sự nghiệp mới." },
  { file: "1 (106).jpg", ten: "Bó Hoa Thanh Ngọc Signature", moTa: "Tác phẩm đinh của Hoa Tươi Thanh Ngọc, đẹp hoàn hảo mọi góc nhìn." }
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