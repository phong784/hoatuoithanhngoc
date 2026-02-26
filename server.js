const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
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

// --- TỪ ĐIỂN SEO CHUẨN ---
const tuDienSEO = {
  "hoa-hong.jpg": { ten: "Bó Hoa Hồng Vàng Tươi Sáng", moTa: "Bó hoa hồng vàng mix baby trắng rạng rỡ. Phù hợp tặng tốt nghiệp hoặc chúc mừng thành công." },
  "IMG_3411.JPG": { ten: "Bó Hoa Hồng Dâu Giấy Đen", moTa: "Hoa hồng màu dâu cá tính gói trong giấy đen huyền bí. Tuyệt phẩm để chinh phục phái đẹp." },
  "IMG_3413.JPG": { ten: "Bó Hoa Hồng Kem Cổ Điển", moTa: "Tone màu kem pastel nhẹ nhàng gói giấy lưới mộc mạc, mang hơi hướng vintage sang trọng." },
  "IMG_3414.JPG": { ten: "Bó Hoa Mix Tone Pastel Xinh Xắn", moTa: "Sự kết hợp tinh tế giữa hoa hồng và các loại hoa lá phụ tươi mát." },
  "IMG_3417.JPG": { ten: "Bó Hoa Hồng Vàng Giấy Lưới", moTa: "Hồng vàng rực rỡ tượng trưng cho tình bạn và niềm vui. Hoa Tươi Thanh Ngọc cam kết tươi mới mỗi ngày." },
  "IMG_3425.JPG": { ten: "Chậu Hoa Baby Xanh Blue Cô Gái", moTa: "Hoa baby nhuộm xanh blue bồng bềnh cắm trong chậu cô gái nghệ thuật. Mẫu best-seller để bàn làm việc." },
  "IMG_3426.JPG": { ten: "Lẵng Hoa Khai Trương Vàng Cam VIP", moTa: "Kệ hoa 2 tầng rực rỡ mang ý nghĩa tài lộc, hồng phát. Miễn phí in banner chúc mừng đối tác." },
  "IMG_3427.JPG": { ten: "Lẵng Hoa Khai Trương Tone Hồng Dâu", moTa: "Thiết kế hiện đại, sang trọng với tone màu hồng nữ tính. Phù hợp khai trương spa, thẩm mỹ viện." },
  "IMG_3428.JPG": { ten: "Bó Hoa Sen Trắng Thanh Lịch", moTa: "Hoa sen trắng ngát hương, thuần khiết. Sự lựa chọn hoàn hảo để tặng mẹ, bà hoặc dâng lễ." },
  "IMG_3429.JPG": { ten: "Bó Hoa Hướng Dương 3 Bông Tươi Tắn", moTa: "Hoa hướng dương luôn hướng về mặt trời. Món quà ý nghĩa ngày tốt nghiệp." },
  "IMG_3430.JPG": { ten: "Bó Hoa Hướng Dương Giấy Xanh", moTa: "Mix cùng giấy gói tone xanh dương hiện đại, mang năng lượng tích cực cho người nhận." },
  "IMG_3432.JPG": { ten: "Lẵng Hoa Khai Trương Tone Trắng Xanh", moTa: "Kệ hoa khai trương trang nhã, thanh lịch. Thể hiện sự khởi đầu mới suôn sẻ và tinh khôi." },
  "IMG_3433.JPG": { ten: "Lẵng Hoa Khai Trương Tone Đỏ Rực Rỡ", moTa: "Sắc đỏ may mắn bùng nổ, lời chúc làm ăn phát đạt mạnh mẽ nhất gửi đến gia chủ." },
  "IMG_3434.JPG": { ten: "Bó Hoa Hồng Trắng Tinh Khôi", moTa: "Những đóa hồng trắng muốt được chọn lọc kỹ càng, đại diện cho tình yêu thuần khiết." },
  "IMG_3435.JPG": { ten: "Lẵng Khai Trương Hoa Lan Sang Trọng", moTa: "Sự kết hợp của hoa lan hồ điệp và các loài hoa cao cấp. Đẳng cấp của sự thành công." },
  "IMG_3436.JPG": { ten: "Lẵng Khai Trương Đỏ Hồng Phát 1 Tầng", moTa: "Thiết kế 1 tầng gọn gàng nhưng không kém phần nổi bật. Phù hợp không gian tiệc vừa và nhỏ." },
  "IMG_3437.JPG": { ten: "Bó Hoa Hồng Cam Mix Giấy Vàng", moTa: "Tone màu cam đào rực rỡ, ấm áp. Hoa Tươi Thanh Ngọc thiết kế riêng theo yêu cầu." },
  "IMG_3438.JPG": { ten: "Lẵng Khai Trương Tone Đỏ Quyền Lực", moTa: "Kệ đứng sang trọng, màu đỏ chủ đạo thu hút mọi ánh nhìn trong buổi lễ." },
  "IMG_3439.JPG": { ten: "Bình Hoa Xanh Blue Huyền Bí", moTa: "Bình hoa để bàn với tone xanh dương lạ mắt mix cùng lá vàng sang chảnh." },
  "IMG_3440.JPG": { ten: "Lẵng Hoa Khai Trương Trắng Tím", moTa: "Sự chung thủy và thịnh vượng được gửi gắm qua tone màu trắng tím cao cấp." },
  "IMG_3441.JPG": { ten: "Chậu Hoa Để Bàn Vàng Lan Vũ Nữ", moTa: "Mẫu hoa cắm bình nghệ thuật rực rỡ, mang không khí mùa xuân và tài lộc." },
  "IMG_3442.JPG": { ten: "Lẵng Hoa Khai Trương 2 Tầng Tone Hồng", moTa: "Sang trọng và ngọt ngào, phù hợp tặng đối tác nữ nhân dịp khai trương cửa hàng mới." },
  "IMG_3443.JPG": { ten: "Lẵng Hoa Hiện Đại Trắng Đỏ", moTa: "Thiết kế bất đối xứng nghệ thuật, phối màu trắng đỏ quyền lực và khác biệt." },
  "IMG_3444.JPG": { ten: "Bó Hoa Hồng Xinh Gói Giấy Kraft", moTa: "Vẻ đẹp tự nhiên, mộc mạc nhưng cực kỳ thu hút. Quà tặng sinh nhật hoàn hảo." },
  "IMG_3445.JPG": { ten: "Bình Hoa Khai Trương Mini Tone Cam", moTa: "Bình hoa để quầy lễ tân tone cam rực rỡ, thu hút vượng khí cho ngày mở hàng." },
  "IMG_3446.JPG": { ten: "Chậu Hoa Cô Gái Mùa Xuân", moTa: "Mix đa dạng các loại hoa tươi tắn trên nền chậu cô gái nhắm mắt mơ màng." },
  "IMG_3447.JPG": { ten: "Bình Hoa Thiên Điểu Đỏ Quyền Lực", moTa: "Hoa Thiên Điểu vươn cao tượng trưng cho sự thăng tiến, phát triển không ngừng." },
  "IMG_3448.JPG": { ten: "Lẵng Khai Trương Hồng Tươi Tắn", moTa: "Kệ hoa đứng tone hồng mix trắng nhẹ nhàng, lịch sự và đầy thiện ý." },
  "IMG_3449.JPG": { ten: "Lẵng Hoa Khai Trương Khung Tranh", moTa: "Thiết kế kệ khung hiện đại kiểu mới, hoa hồng dâu cắm tinh tế chuẩn xu hướng." },
  "IMG_3450.JPG": { ten: "Bó Hoa Hướng Dương Giấy Kraft Đẹp", moTa: "Mix hoa baby và lá bạc eucalyptus, bó hoa tỏa nắng dành tặng ngày kỷ niệm." },
  "IMG_3451.JPG": { ten: "Hộp Hoa Để Bàn Tone Cam Sữa", moTa: "Hộp hoa cắm xòe tròn đều đặn, màu sắc trang nhã phù hợp phòng khách, phòng làm việc." },
  "IMG_3452.JPG": { ten: "Lẵng Khai Trương Trắng Hồ Điệp", moTa: "Kệ hoa VIP sử dụng Lan Hồ Điệp trắng muốt làm điểm nhấn sang trọng bậc nhất." },
  "IMG_3453.JPG": { ten: "Lẵng Khai Trương Tone Hồng Lãng Mạn", moTa: "Hoa Tươi Thanh Ngọc thiết kế riêng mẫu kệ hoa hồng pastel dành cho các sự kiện cao cấp." },
  "IMG_3454.JPG": { ten: "Lẵng Hoa Đỏ Mix Lá Bạc Sang Trọng", moTa: "Sắc đỏ thắm của hoa hồng nổi bật trên nền lá bạc, mang lời chúc đại cát đại lợi." },
  "IMG_3455.JPG": { ten: "Lẵng Khai Trương Trắng Xanh Tinh Tế", moTa: "Gam màu lạnh sang trọng, thanh lịch. Khẳng định gu thẩm mỹ của người tặng." },
  "IMG_3456.JPG": { ten: "Bó Hoa Hồng Trắng Gói Giấy Trắng", moTa: "Tuyết trắng tinh khôi, một bó hoa mang lại cảm giác bình yên và chân thành." },
  "IMG_3457.JPG": { ten: "Lẵng Khai Trương Trắng Vàng Tươi Sáng", moTa: "Sự kết hợp hoàn hảo giữa sắc trắng và vàng, mang đến năng lượng tươi mới, rạng rỡ." },
  "IMG_3458.JPG": { ten: "Lẵng Hoa Khai Trương Tone Đỏ Hiện Đại", moTa: "Kệ đứng 2 tầng bọc lưới voan bồng bềnh. Chắc chắn làm hài lòng gia chủ." },
  "IMG_3459.JPG": { ten: "Bình Hoa Hồng Đỏ Rủ Nghệ Thuật", moTa: "Cắm bình phong cách tự do, hoa lan đỏ rủ mềm mại tạo điểm nhấn sang trọng." },
  "IMG_3460.JPG": { ten: "Bó Hoa Hồng Cam Giấy Trong Suốt", moTa: "Bó hoa tone cam cháy rực rỡ mix cùng giấy gói trong suốt phong cách Hàn Quốc." },
  "IMG_3461.JPG": { ten: "Lẵng Hoa Mừng Thọ Tone Đỏ Đậm", moTa: "Sắc đỏ trầm ấm áp, kệ hoa phù hợp tặng kỷ niệm thành lập hoặc mừng thọ người lớn tuổi." },
  "IMG_3462.JPG": { ten: "Hộp Hoa Cam Cháy Trendy", moTa: "Màu cam cháy (burnt orange) đang là xu hướng được yêu thích nhất năm nay." },
  "IMG_3463.JPG": { ten: "Bó Hoa Baby Hồng Khổng Lồ", moTa: "Hoa baby nhuộm hồng bồng bềnh siêu to khổng lồ. Món quà khiến mọi cô gái vỡ òa." },
  "IMG_3464.JPG": { ten: "Hộp Hoa Chúc Mừng Tone Đỏ Cam", moTa: "Nhỏ gọn nhưng rực rỡ. Thích hợp đặt trên bàn tiệc hoặc quầy lễ tân." },
  "IMG_3465.JPG": { ten: "Bình Hoa Baby Xanh Giấy Bạc", moTa: "Thiết kế cắm hộp vuông bọc giấy lấp lánh, tone xanh mát mắt." },
  "IMG_3466.JPG": { ten: "Bó Hoa Hồng Cam Đào Nhẹ Nhàng", moTa: "Gam màu ngọt ngào, tinh tế. Dành tặng cho những người mang vẻ đẹp nhẹ nhàng." },
  "IMG_3467.JPG": { ten: "Chậu Cô Gái Cắm Hoa Đỏ May Mắn", moTa: "Chậu hoa nghệ thuật mix tone đỏ rực, mang lại năng lượng tích cực cho căn phòng." },
  "IMG_3468.JPG": { ten: "Lẵng Khai Trương Trắng Tím Trang Nhã", moTa: "Kệ hoa phong cách Tây Âu, nhẹ nhàng nhưng cực kỳ cuốn hút." },
  "IMG_3469.JPG": { ten: "Hộp Hoa Lan Vũ Nữ Vàng", moTa: "Màu vàng của hoa lan vũ nữ mang lại sự sung túc, thịnh vượng." },
  "IMG_3470.JPG": { ten: "Lẵng Khai Trương Hồng Pastel Voan", moTa: "Kệ hoa được quấn voan điệu đà, tone màu siêu ngọt ngào cho phái đẹp." },
  "IMG_3471.JPG": { ten: "Lẵng Khai Trương Trắng Mix Lá Nhiệt Đới", moTa: "Thiết kế khác biệt với các loại hoa trắng và lá môn xanh bắt mắt." },
  "IMG_3472.JPG": { ten: "Bó Hoa Hồng Phấn Giấy Đen Cuốn Hút", moTa: "Sự đối lập giữa hoa hồng phấn và giấy gói đen tạo nên vẻ đẹp bí ẩn." },
  "IMG_3473.JPG": { ten: "Bình Hoa Cam Vàng Mùa Thu", moTa: "Tone màu ấm áp, cắm theo dáng vươn cao đầy sức sống." },
  "IMG_3474.JPG": { ten: "Lẵng Hoa Khai Trương Hồng Phấn Voan Nhẹ", moTa: "Nhẹ nhàng, bay bổng. Một trong những mẫu kệ đứng bán chạy nhất của tiệm." },
  "IMG_3475.JPG": { ten: "Lẵng Khai Trương Tone Trắng Tinh Tế", moTa: "Kệ hoa sang trọng, mix đa dạng các loại hoa trắng nhập khẩu cao cấp." },
  "IMG_3476.JPG": { ten: "Chậu Hoa Cô Gái Cam Rực Rỡ", moTa: "Sự kết hợp màu sắc tươi vui, làm bừng sáng góc làm việc của bạn." },
  "IMG_3477.JPG": { ten: "Bình Hoa Đỏ Vàng Hoàng Gia", moTa: "Cắm chậu nghệ thuật, sang trọng. Món quà biếu sếp hoặc đối tác quan trọng." },
  "IMG_3478.JPG": { ten: "Giỏ Hoa Trắng Xanh Lá Mộc Mạc", moTa: "Giỏ hoa phong cách đồng quê, mộc mạc và thân thiện với thiên nhiên." },
  "IMG_3479.JPG": { ten: "Lẵng Hoa Đôi Để Bàn Mềm Mại", moTa: "Thiết kế trải dài độc đáo, phù hợp đặt trên bàn họp hoặc bàn hội nghị." },
  "IMG_3480.JPG": { ten: "Bó Hoa Hồng Phấn Giấy Xếp Lớp", moTa: "Kỹ thuật gói hoa xếp lớp hiện đại, làm bó hoa trông to và hoành tráng hơn." },
  "IMG_3482.JPG": { ten: "Lẵng Khai Trương Hồng Sen Đậm", moTa: "Tone màu nổi bật, thu hút ánh nhìn ngay từ giây đầu tiên." },
  "IMG_3483.JPG": { ten: "Bó Hoa Hướng Dương Giấy Lưới Vàng", moTa: "Đồng bộ tone vàng từ hoa đến giấy gói, tỏa sáng rực rỡ." },
  "IMG_3484.JPG": { ten: "Hộp Hoa Xanh Dương Độc Lạ", moTa: "Gam màu xanh dương mang lại sự bình yên, thư giãn." },
  "IMG_3485.JPG": { ten: "Giỏ Hoa Hồng Đỏ Tình Yêu Mộc", moTa: "Hoa hồng đỏ rực mix trong hộp gỗ mộc mạc, sự kết hợp hoàn hảo." },
  "IMG_3486.JPG": { ten: "Chậu Cô Gái Baby Xanh Mini", moTa: "Phiên bản nhỏ gọn xinh xắn, quà lưu niệm ý nghĩa." },
  "IMG_3487.JPG": { ten: "Lẵng Khai Trương Vàng Lá Bạc Tỏa Đều", moTa: "Thiết kế xòe tròn đều đặn, hoành tráng và vô cùng vững chãi." },
  "IMG_3496.JPG": { ten: "Bó Hoa Hồng Đỏ Giấy Trắng Trong", moTa: "Hoa hồng đỏ bọc voan/giấy mờ tạo vẻ đẹp lãng mạn như phim Hàn Quốc." },
  "IMG_3497.JPG": { ten: "Bó Hoa Hướng Dương Baby Khổng Lồ", moTa: "Bó hoa siêu bự, ôm trọn vòng tay. Quà tốt nghiệp ấn tượng nhất." },
  "IMG_3498.JPG": { ten: "Bó Hoa Cúc Pingpong Trắng Nhẹ Nhàng", moTa: "Thiết kế tone trắng tinh khôi, hình dáng tròn xoe đáng yêu." },
  "IMG_3499.JPG": { ten: "Bó Hoa Baby Trắng Tinh Khôi", moTa: "Đơn giản mà đẹp mãi mãi. Phù hợp tặng sinh nhật mọi lứa tuổi." },
  "IMG_3500.JPG": { ten: "Bó Hoa Hồng Trắng Phối Giấy Ghi Trầm", moTa: "Tone trắng mix cùng giấy màu xám ghi tạo vẻ đẹp sang trọng, nam tính." },
  "IMG_3501.JPG": { ten: "Bó Hoa Hồng Xanh Rực Rỡ Cực Lạ", moTa: "Hoa hồng xanh mang thông điệp về một tình yêu vĩnh cửu và những điều kỳ diệu." },
  "IMG_3502.JPG": { ten: "Bình Hoa Mừng Khai Trương Rực Rỡ", moTa: "Bình hoa cắm vòm hoành tráng với tone cam đỏ vàng, đặt trên đôn gỗ sang trọng." },
  "IMG_3503.JPG": { ten: "Kệ Khai Trương Xanh Blue Đẳng Cấp", moTa: "Kệ hoa 2 tầng sử dụng hoa hồng xanh blue nhập khẩu." },
  "IMG_3506.JPG": { ten: "Bó Hoa Trắng Xanh Tinh Tế", moTa: "Hoa hồng trắng mix lá phụ xanh mát bọc trong giấy màu xanh ngọc." },
  "IMG_3507.JPG": { ten: "Bó Hoa Baby Trắng Siêu Khổng Lồ", moTa: "Baby trắng tinh khôi gói thành bó siêu to bồng bềnh." },
  "IMG_3508.JPG": { ten: "Lẵng Khai Trương Tone Xanh Trắng VIP", moTa: "Kệ hoa sảnh tone màu lạnh sang trọng, thanh lịch." },
  "IMG_3509.JPG": { ten: "Hộp Hoa Đỏ Cam Để Bàn Quyền Lực", moTa: "Tone màu cháy bỏng rực rỡ cắm xòe trên hộp trụ tròn." },
  "IMG_3510.JPG": { ten: "Bó Hoa Hồng Trắng Mini Xinh Xắn", moTa: "Bó hoa hồng trắng nhỏ nhắn, gói giấy xám tro tối giản." },
  "IMG_3511.JPG": { ten: "Bó Hoa Hồng Đỏ Lưới Voan Bồng Bềnh", moTa: "Hoa hồng đỏ rực mix baby trắng, bọc trong lớp lưới voan lãng mạn." },
  "IMG_3704.JPG": { ten: "Bó Hoa Baby Trắng Giấy Đen Cuốn Hút", moTa: "Sự tương phản ấn tượng giữa hoa baby trắng và giấy bọc đen nhám." },
  "IMG_3705.JPG": { ten: "Bó Hoa Baby Trắng Giấy Mộc", moTa: "Bó hoa baby bọc giấy kraft xi măng vintage." },
  "IMG_3706.JPG": { ten: "Bó Hoa Hồng Vàng Giấy Xanh Nhạt", moTa: "Sắc vàng tươi tắn kết hợp giấy gói xanh pastel êm dịu." },
  "IMG_3707.JPG": { ten: "Bó Hoa Hồng Đỏ Tình Yêu Bí Ẩn", moTa: "Hồng đỏ quyến rũ bọc giấy đen thắt nơ đỏ." },
  "IMG_3708.JPG": { ten: "Bó Hoa Tone Trắng Hồng Trong Trẻo", moTa: "Tone màu pastel dịu dàng, ngọt ngào dành cho những cô nàng nữ tính." },
  "IMG_3709.JPG": { ten: "Bó Hoa Tone Tím Mộng Mơ", moTa: "Hoa mix tone tím thủy chung, lãng mạn. Giấy bọc tím đồng điệu." },
  "IMG_3710.JPG": { ten: "Set 2 Bó Hoa Hồng Tone Nóng", moTa: "Gợi ý tuyệt vời khi bạn muốn mua hoa cặp để tặng cho 2 người." },
  "IMG_3711.JPG": { ten: "Bó Hoa Mix Màu Sắc Tươi Vui", moTa: "Hoa hồng, hoa cắm phối nhiều màu sắc, mang năng lượng rực rỡ yêu đời." },
  "IMG_3712.JPG": { ten: "Bó Hoa Hồng Vàng Cam Ấm Áp", moTa: "Sắc màu rực rỡ của nắng mặt trời. Bó hoa mang lại niềm vui tươi cho ngày mới." },
  "IMG_3713.JPG": { ten: "Bó Hoa Hồng Phấn Ngọt Ngào", moTa: "Màu hồng pastel chưa bao giờ ngừng hot. Bó hoa quốc dân cho dịp sinh nhật." },
  "IMG_3714.JPG": { ten: "Hoa Cặp Đôi Đỏ Phấn", moTa: "Sự kết hợp giữa 2 bó hoa một rực rỡ, một nhẹ nhàng." },
  "IMG_3715.JPG": { ten: "Bó Hoa Hồng Giấy Xanh Lạ Mắt", moTa: "Hoa hồng phấn nhạt mix cùng giấy gói xanh ngọc và xanh đậm." },
  "IMG_3716.JPG": { ten: "Bó Hoa Mix Tone Tím Lãng Mạn", moTa: "Màu tím của sự chung thủy, mix hoa bồng bềnh lãng mạn." },
  "IMG_3717.JPG": { ten: "Bó Hoa Hồng Phấn Dáng Dài", moTa: "Kỹ thuật bó dáng dài hiện đại giúp bó hoa trông thanh thoát hơn." },
  "IMG_3718.JPG": { ten: "Bó Hoa Hồng Tinh Khôi Phối Cam", moTa: "Sự đan xen nhẹ nhàng giữa trắng và cam nhạt." },
  "IMG_3719.JPG": { ten: "Bó Hoa Hồng Dâu Voan Lụa", moTa: "Sử dụng voan lụa cao cấp tạo độ rủ mềm mại." },
  "IMG_3720.JPG": { ten: "Set Bó Hoa Đôi Tone Cam Phấn", moTa: "Hai phiên bản màu sắc rực rỡ và nền nã." },
  "IMG_3721.JPG": { ten: "Set Bó Hoa Đôi Tone Tím Hồng", moTa: "Hai bó hoa nhỏ xinh tone màu lãng mạn." },
  "IMG_3722.JPG": { ten: "Bó Hoa Mix Cúc Tana Và Hồng", moTa: "Hoa mix phong cách đồng quê nhẹ nhàng, nữ tính." },
  "IMG_3723.JPG": { ten: "Bó Hoa Ly Phối Hồng Giấy Kraft", moTa: "Hoa ly thơm ngát vươn cao, phối hồng tươi tắn bọc giấy mộc." },
  "IMG_3724.JPG": { ten: "Bó Hoa Hồng Vàng Tràn Đầy Năng Lượng", moTa: "Tone cam vàng rực lửa, một món quà tạo bất ngờ cực mạnh." },
  "IMG_3725.JPG": { ten: "Bó Hoa Tím Hồng Tone Đậm Cuốn Hút", moTa: "Màu hoa đậm đà rực rỡ bọc trong giấy màu sen sang trọng." },
  "IMG_3726.JPG": { ten: "Bó Hoa Hồng Đỏ Giấy Đỏ Quyền Lực", moTa: "Đỏ tone-sur-tone từ hoa đến giấy. Lựa chọn số 1 cho ngày Valentine." },
  "IMG_3727.JPG": { ten: "Hoa Cặp Tình Yêu Hồng Đỏ", moTa: "Hồng đỏ cổ điển luôn là minh chứng rõ nét nhất cho tình yêu nồng cháy." },
  "IMG_3728.JPG": { ten: "Bó Hoa Hồng Đỏ Giấy Rêu Cổ Điển", moTa: "Sự phối màu theo phong cách hoàng gia: Đỏ thẫm và Xanh rêu." },
  "IMG_3729.JPG": { ten: "Bó Hoa Hồng Đỏ Black Valentine", moTa: "Đỏ và Đen - sự kết hợp đẳng cấp, mạnh mẽ." },
  "IMG_3730.JPG": { ten: "Bó Hoa Phối Màu Độc Lạ Cá Tính", moTa: "Mix phá cách với những đóa hoa xanh dương mập mạp làm điểm nhấn." },
  "IMG_3731.JPG": { ten: "Bó Hoa Hồng Đỏ Nằm Xinh Xắn", moTa: "Bó hồng tròn xoe gọn gàng, phù hợp bỏ vào hộp quà." },
  "IMG_3732.JPG": { ten: "Bó Hoa Trắng Xanh Lá Tự Nhiên", moTa: "Phong cách chữa lành. Trắng tinh khiết điểm xuyết lá xanh êm dịu." },
  "IMG_3733.JPG": { ten: "Bó Hoa Hồng Đỏ Cổ Điển Form Tròn", moTa: "Bó sát xòe tròn truyền thống, giấy gói đen sang chảnh." },
  "IMG_3734.JPG": { ten: "Bó Hoa Hồng Đỏ Mix Nụ Nhỏ", moTa: "Bó hồng nhung đỏ rực rỡ mix cùng các loại lá li ti." },
  "IMG_3735.JPG": { ten: "Bó Hoa Tone Hồng Tím Cẩm Lệ", moTa: "Tone màu sang trọng, phù hợp tặng sếp nữ hoặc đối tác." },
  "IMG_3736.JPG": { ten: "Bó Hoa Lan Vũ Nữ Vàng Sang Trọng", moTa: "Hàng trăm bông lan vũ nữ vàng ươm rủ xuống như một dải lụa." },
  "IMG_3737.JPG": { ten: "Bó Hoa Tulip Phối Hồng Baby", moTa: "Giống hoa nữ hoàng Tulip vươn cao đắt giá." },
  "IMG_3738.JPG": { ten: "Hoa Cặp Hướng Dương Nhỏ Xinh", moTa: "Kích thước mini dễ thương, phù hợp làm quà tặng tốt nghiệp." },
  "IMG_3739.JPG": { ten: "Bó Hướng Dương Cắm Một Mặt", moTa: "Phô diễn trọn vẹn vẻ đẹp của mặt trời nhỏ." },
  "IMG_3740.JPG": { ten: "Bó Hoa Tình Yêu Đỏ Hồng Xòe Rộng", moTa: "Bó hoa size lớn hoành tráng, xòe rộng ôm trọn vào lòng." },
  "IMG_3741.JPG": { ten: "Bó Hoa Xanh Blue Cực Nổi Bật", moTa: "Sắc xanh dương huyền thoại kết hợp nơ xanh tone-sur-tone." },
  "IMG_3742.JPG": { ten: "Kệ Khai Trương Đại Sảnh Vàng Cam Đỏ", moTa: "Kệ hoa siêu cao cấp thiết kế dành riêng cho đại sảnh." },
  "IMG_3743.JPG": { ten: "Kệ Khai Trương Sảnh Đỏ Hồng Vàng VIP", moTa: "Sự pha trộn màu sắc khéo léo tạo nên kệ hoa hoành tráng." },
  "IMG_3744.JPG": { ten: "Kệ Khai Trương Quyền Lực Đỏ Cam", moTa: "Kết cấu 2 tầng đồ sộ, thể hiện sự uy quyền và phát triển vươn tầm." },
  "IMG_3745.JPG": { ten: "Kệ Khai Trương Trắng Xanh Tinh Khôi Đại Sảnh", moTa: "Kệ hoa VIP mang nét đẹp Tây Âu sang trọng." },
  "IMG_3746.JPG": { ten: "Kệ Khai Trương VIP Xanh Blue Hoàng Gia", moTa: "Một tác phẩm nghệ thuật hoa tươi đẳng cấp." }
};

// --- HỆ THỐNG TỰ ĐỘNG ---
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
  const t = tenHoa.toLowerCase();
  if (t.includes('khai trương') || t.includes('kệ')) return 'Hoa Khai Trương';
  if (t.includes('bó') || t.includes('hoa cặp')) return 'Bó Hoa';
  if (t.includes('lẵng') || t.includes('giỏ')) return 'Lẵng/Giỏ Hoa';
  if (t.includes('chậu') || t.includes('bình') || t.includes('hộp') || t.includes('để bàn')) return 'Hoa Để Bàn';
  if (t.includes('baby')) return 'Hoa Baby';
  if (t.includes('chia buồn') || t.includes('đám tang')) return 'Hoa Chia Buồn';
  return 'Hoa Thiết Kế';
}

const thuMucAnh = path.join(__dirname, 'public');
if (!fs.existsSync(thuMucAnh)) fs.mkdirSync(thuMucAnh);

const cacFileAnh = fs.readdirSync(thuMucAnh).filter(file =>
  (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) &&
  !['IMG_3390.jpg', 'banner-ai.jpg', 'nen-web.jpg'].includes(file)
);

const danhSachHoa = cacFileAnh.map((tenFile, index) => {
  const keyChuan = chuanHoaTen(tenFile);
  const thongTin = tuDienDaChuanHoa[keyChuan];
  const tenHienThi = thongTin ? thongTin.ten : `Mẫu Hoa Thiết Kế #${index + 1}`;
  return {
    id: index + 1,
    slug: taoSlug(tenHienThi) + '-' + (index + 1), // ĐÂY CHÍNH LÀ TRÁI TIM CỦA ĐƯỜNG LINK!
    ten: tenHienThi,
    danhMuc: doanDanhMuc(tenHienThi),
    hinhAnh: `/${tenFile}`,
    moTa: thongTin ? thongTin.moTa : "Mẫu hoa tươi thiết kế sang trọng tại Thanh Ngọc."
  };
});

// --- ROUTES ---
app.get('/', (req, res) => {
  // TÍNH NĂNG MỚI: Tự động lọc hoa khi bấm vào danh mục vuốt ngang!
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