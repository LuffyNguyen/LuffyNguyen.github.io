# Mặt Trăng · kế hoạch dựng trang

Trang: `https://luffynguyen.github.io/mat-trang/` — một file `index.html` tĩnh, cùng repo với
các trang con khác (`catherine-the-great`, `hieu-co-the`). Deploy = `git push origin main`.

Phong cách: **cắt giấy** — mỗi cảnh là các lớp giấy phẳng chồng lên nhau, bóng mềm giữa các lớp,
mép hơi gồ ghề (SVG `feTurbulence` + `feDisplacementMap`), không gradient. Vỏ trang giữ kiểu
Apple tối giản: nền giấy kem, chữ Inter Tight / Inter, một màu nhấn cam giấy `#E07A3F`.

Song ngữ: nút VI / EN góc phải, mặc định VI, nhớ bằng `localStorage` (bọc try/catch), hỗ trợ
`?lang=en`. Văn xuôi viết cặp `<p lang="vi">` / `<p lang="en">`; nhãn động trong JS qua `t(vi, en)`.

---

## Phần 1 — Khóa thủy triều (ĐÃ LÀM, 22/10/2026)

Theo video Neil deGrasse Tyson về tidal lock (0:00–13:00).

| # | Chương | Tương tác |
|---|---|---|
| 1 | Lực thủy triều | Kéo Mặt Trăng gần/xa; bật "lực hút" ↔ "phần chênh lệch"; bướu nước co giãn theo 1/d³ |
| 2 | Khóa thủy triều | Thanh trượt số vòng tự quay / vòng quỹ đạo (0 → 6); nút "để thủy triều phanh"; ô "nhìn từ Trái Đất" |
| 3 | Bướu nước đứng yên | Trái Đất quay dưới bướu nước, bãi biển thấy nước lên xuống, biểu đồ mực nước 48 giờ |
| 4 | Phanh và cú kéo | Góc lệch bướu (phóng đại), tách lực kéo thành hướng tâm + tiếp tuyến; tua 1 tỷ năm |
| 5 | Khóa kép | Thanh trượt "tương lai": Trái Đất chậm dần tới khi bướu thẳng hàng, thủy triều đứng yên; Pluto–Charon |
| 6 | Gương trên Mặt Trăng | Gương góc 2D (chỉnh góc tới) + bắn laser đo 2,56 giây |
| 7 | Hết nhật thực toàn phần | Thanh trượt 0–1.500 triệu năm, đĩa Mặt Trăng co lại trên Mặt Trời, bầu trời tối theo độ che |
| 8 | Ngày dài ra | 27 giây nhuận 1972–2016; thanh trượt ΔT từ năm −720 (Babylon) tới nay |

Ghi chú trung thực đã đưa vào trang:
- Video nói ~1,2 tỷ năm cho mốc hết nhật thực toàn phần; tính với tốc độ 3,8 cm/năm hiện nay thì
  ~600 triệu năm. Trang ghi cả hai và nói con số phụ thuộc giả định.
- Khóa kép ≈ ngày = tháng ≈ 47 ngày hôm nay, mất hàng chục tỷ năm — lâu hơn tuổi thọ còn lại
  của Mặt Trời, nên có thể không bao giờ xảy ra.
- Hình minh họa không theo tỉ lệ; góc lệch bướu nước bị phóng đại (thật chỉ vài độ).

---

## Phần 2 — Tuần trăng, thời gian và lịch (CHƯA LÀM)

Thêm vào cùng `index.html`, sau chương 8, thay khối "Phần 2 sắp có". Mỗi dữ kiện phải tra lại
bằng web search và gắn link nguồn (quy tắc §6 của repo agent).

### 9. Vì sao có tuần trăng
- Cảnh cắt giấy nhìn từ trên: Mặt Trời bên trái, Trái Đất giữa, Mặt Trăng chạy quỹ đạo; nửa sáng
  luôn quay về Mặt Trời. Ô nhỏ "nhìn từ Trái Đất" vẽ hình trăng tương ứng (khuyết, bán nguyệt, rằm).
- Thanh trượt ngày 0 → 29,5; nhãn mùng 1, mùng 8, rằm, 23.
- Tháng giao hội 29,53 ngày vs tháng thiên văn 27,32 ngày: hoạt hình cho thấy vì sao phải chạy
  thêm ~2,2 ngày (Trái Đất đã đi một đoạn quanh Mặt Trời).
- Vì sao không tháng nào cũng có nhật/nguyệt thực: quỹ đạo nghiêng ~5°, nút giao.

### 10. Con người đếm Mặt Trăng — dòng thời gian
Dòng thời gian ngang cuộn được, mỗi mốc là một tấm giấy cắt; ghi rõ mốc nào còn tranh cãi.
- Xương Lebombo (~43.000 năm), xương Ishango (~20.000 năm): vạch khắc có thể là đếm ngày trăng —
  **ghi là giả thuyết**.
- Warren Field, Scotland (~10.000 năm): dãy hố được cho là "lịch" theo Mặt Trăng (nghiên cứu 2013).
- Ai Cập: lịch dân sự 365 ngày (12 × 30 + 5), gắn với lúc sao Sirius mọc trước bình minh và lũ sông Nile.
- Babylon: lịch âm dương, tháng bắt đầu khi thấy trăng non; ghi chép nhật thực (nối lại chương 8).
- Chu kỳ Meton: 19 năm ≈ 235 tháng (Meton, 432 TCN; Babylon dùng trước đó).
- La Mã: lịch Julius (45 TCN, năm nhuận 4 năm/lần) → Gregory (1582, bỏ 10 ngày).
- Hồi giáo: lịch Hijri thuần âm, 354/355 ngày, Ramadan trôi qua các mùa.
- Trung Hoa / Việt Nam: âm lịch thực chất là **âm dương lịch** — tháng theo trăng, năm theo 24
  tiết khí, tháng nhuận khi một tháng không chứa trung khí.
- Việt Nam tính lịch theo múi giờ UTC+7 (từ 1967–1968): Tết Mậu Thân 1968 miền Bắc và miền Nam
  lệch một ngày; năm 1985 Tết Việt Nam sớm hơn Trung Quốc một tháng. **Tra lại ngày cụ thể trước khi đăng.**

### 11. Lịch âm, lịch dương, lịch âm dương — bàn so sánh
- Ba vòng giấy đồng tâm: 12 tháng trăng = 354,37 ngày vs năm Mặt Trời 365,24 ngày; khoảng hụt
  ~11 ngày/năm cộng dồn.
- Tương tác: chọn kiểu lịch, tua 1–19 năm, xem Tết / Ramadan / Giáng sinh trôi hay đứng so với mùa.
- Máy đổi ngày dương → âm đơn giản (thuật toán Hồ Ngọc Đức, có mã nguồn mở — kiểm tra giấy phép
  trước khi nhúng).

### 12. Kết + nguồn
- Nối hai phần: thủy triều làm ngày dài ra → ngày xưa ngắn hơn → lịch cổ phải hiệu chỉnh ΔT.
- Danh sách nguồn đầy đủ (Wikipedia + bài gốc khi có).

### Kiểm tra trước khi xong phần 2
- Chụp màn 430 px và 1440 px (skill `playwright-cli`), cả sáng/tối, cả VI/EN.
- Không tràn ngang trên mobile; mọi thanh trượt dùng được bằng ngón tay.
- Commit (tiếng Việt không dấu) và `git push origin main`.
