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

## Phần 2 — Tuần trăng, thời gian và lịch (ĐÃ LÀM, 22/10/2026)

Không nhét vào `index.html` nữa mà tách thành **cây trang** kiểu blog: trang gốc Phần 1 có khối
"Phần 2" dẫn vào trang chủ đề, mỗi trang lá có thẻ "Đọc tiếp" ở cuối và sơ đồ cây đánh dấu
"Bạn đang ở đây". Cây khai báo một chỗ (`TREE` trong `giay.js`), thêm trang = thêm một nút.

```
/mat-trang/                         Phần 1 · Khóa thủy triều
└── /mat-trang/lich/                Phần 2 · Tuần trăng và lịch (trang chủ đề, "hôm nay âm lịch")
    ├── tuan-trang/                 01 · Vì sao trăng khuyết rồi tròn (tuần trăng, 29,53 vs 27,32, thực)
    ├── dem-trang/                  02 · Những người đầu tiên đếm trăng (Lebombo/Ishango = giả thuyết, Warren Field)
    ├── ba-kieu-lich/               03 · Âm, dương, âm dương (Meton, Tết/Ramadan/Giáng sinh, Julius → Gregory)
    └── am-lich-viet-nam/           04 · 24 tiết khí, tháng nhuận, QĐ 121-CP, Tết 1985 lệch cả tháng, máy đổi ngày
```

- Dùng chung: `giay.css` (vỏ + bộ đổi ngày), `giay.js` (`window.MT`: sân khấu, cắt giấy, cây),
  `lich/amlich.js` (`window.AL`: Sóc, kinh độ Mặt Trời, đổi âm ↔ dương, can chi; chạy được cả
  trong Node để kiểm). Bộ tính tự viết lại theo Meeus + phương pháp Hồ Ngọc Đức, không chép mã
  của ông (giấy phép chỉ cho dùng cá nhân, phi thương mại).
- Đã kiểm bằng Node: Tết UTC+7 vs UTC+8 chỉ khác nhau năm 1968, 1969, 1985, 2007, 2030, 2053
  trong 1968–2100; nhuận 1984 (CN tháng 10) / 1985 (VN tháng 2); Tết 2027 = 6/2.
- Ảnh chụp 430 px + 1440 px từng trang: không lỗi console, không tràn ngang, ~60 fps.
- Còn mở: số liệu tuần trăng/thực tính gần đúng (Meeus rút gọn), có thể lệch vài phút.
