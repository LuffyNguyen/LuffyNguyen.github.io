// Âm lịch Việt Nam tính bằng thiên văn: điểm Sóc theo Meeus, trung khí theo kinh độ Mặt Trời.
// Viết lại từ đầu theo phương pháp Hồ Ngọc Đức công bố (bản lưu: https://web.archive.org/web/20250123093939/http://www.informatik.uni-leipzig.de/~duc/amlich/calrules.html)
// và công thức trong Jean Meeus, Astronomical Algorithms. Không chép mã gốc của ông (mã đó chỉ cho dùng cá nhân).
// tz = múi giờ: Việt Nam dùng 7 từ 1968, Trung Quốc dùng 8. Đổi múi giờ là đổi được ngày Sóc.
(function () {
  'use strict';
  var PI = Math.PI, INT = Math.floor;

  function jd(dd, mm, yy) {
    var a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    var j = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    // Trước 15/10/1582 dùng lịch Julius.
    if (j < 2299161) j = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    return j;
  }
  function fromJd(j) {
    var a, b, c;
    if (j > 2299160) { a = j + 32044; b = INT((4 * a + 3) / 146097); c = a - INT(b * 146097 / 4); }
    else { b = 0; c = j + 32082; }
    var d = INT((4 * c + 3) / 1461), e = c - INT(1461 * d / 4), m = INT((5 * e + 2) / 153);
    return [e - INT((153 * m + 2) / 5) + 1, m + 3 - 12 * INT(m / 10), b * 100 + d - 4800 + INT(m / 10)];
  }

  // Lúc Sóc thứ k tính từ 1/1/1900, ra ngày Julius có phần lẻ (giờ quốc tế).
  function newMoon(k) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
    var J = 2415020.75933 + 29.53058868 * k + .0001178 * T2 - .000000155 * T3 +
      .00033 * Math.sin((166.56 + 132.87 * T - .009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - .0000333 * T2 - .00000347 * T3;
    var Mp = 306.0253 + 385.81691806 * k + .0107306 * T2 + .00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - .0016528 * T2 - .00000239 * T3;
    var c = (.1734 - .000393 * T) * Math.sin(M * dr) + .0021 * Math.sin(2 * dr * M) -
      .4068 * Math.sin(Mp * dr) + .0161 * Math.sin(dr * 2 * Mp) - .0004 * Math.sin(dr * 3 * Mp) +
      .0104 * Math.sin(dr * 2 * F) - .0051 * Math.sin(dr * (M + Mp)) - .0074 * Math.sin(dr * (M - Mp)) +
      .0004 * Math.sin(dr * (2 * F + M)) - .0004 * Math.sin(dr * (2 * F - M)) -
      .0006 * Math.sin(dr * (2 * F + Mp)) + .001 * Math.sin(dr * (2 * F - Mp)) + .0005 * Math.sin(dr * (2 * Mp + M));
    // ΔT: chênh giữa giờ thiên văn và giờ đồng hồ, xem Phần 1 chương 8.
    var dt = T < -11 ? .001 + .000839 * T + .0002261 * T2 - .00000845 * T3 - .000000081 * T * T3
      : -.000278 + .000265 * T + .000262 * T2;
    return J + c - dt;
  }
  // Kinh độ hoàng đạo của Mặt Trời (radian) tại ngày Julius jdn.
  function sunLong(jdn) {
    var T = (jdn - 2451545) / 36525, T2 = T * T, dr = PI / 180;
    var M = 357.5291 + 35999.0503 * T - .0001559 * T2 - .00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + .0003032 * T2;
    var DL = (1.9146 - .004817 * T - .000014 * T2) * Math.sin(dr * M) +
      (.019993 - .000101 * T) * Math.sin(dr * 2 * M) + .00029 * Math.sin(dr * 3 * M);
    var L = (L0 + DL) * dr;
    return L - PI * 2 * INT(L / (PI * 2));
  }
  function newMoonDay(k, tz) { return INT(newMoon(k) + .5 + tz / 24); }
  // Mặt Trời đang ở cung 30° thứ mấy (0 = Xuân phân) lúc nửa đêm đầu ngày, giờ địa phương.
  function sunSector(dn, tz) { return INT(sunLong(dn - .5 - tz / 24) / PI * 6); }
  function sunDeg(dn, tz) { return sunLong(dn - .5 - tz / 24) * 180 / PI; }

  // Ngày bắt đầu tháng 11 âm (tháng chứa Đông chí) của năm dương yy.
  function month11(yy, tz) {
    var off = jd(31, 12, yy) - 2415021, k = INT(off / 29.530588853), nm = newMoonDay(k, tz);
    if (sunSector(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
    return nm;
  }
  // Tháng nhuận nằm sau tháng 11 bao nhiêu tháng: tháng đầu tiên không chứa trung khí nào.
  function leapOffset(a11, tz) {
    var k = INT((a11 - 2415021.076998695) / 29.530588853 + .5), last, i = 1, arc = sunSector(newMoonDay(k + i, tz), tz);
    do { last = arc; i++; arc = sunSector(newMoonDay(k + i, tz), tz); } while (arc !== last && i < 14);
    return i - 1;
  }

  // Dương → âm: [ngày, tháng, năm, nhuận?]
  function toLunar(dd, mm, yy, tz) {
    var day = jd(dd, mm, yy), k = INT((day - 2415021.076998695) / 29.530588853);
    var start = newMoonDay(k + 1, tz);
    if (start > day) start = newMoonDay(k, tz);
    var a11 = month11(yy, tz), b11 = a11, ly;
    if (a11 >= start) { ly = yy; a11 = month11(yy - 1, tz); }
    else { ly = yy + 1; b11 = month11(yy + 1, tz); }
    var ld = day - start + 1, diff = INT((start - a11) / 29), leap = 0, lm = diff + 11;
    if (b11 - a11 > 365) {
      var lo = leapOffset(a11, tz);
      if (diff >= lo) { lm = diff + 10; if (diff === lo) leap = 1; }
    }
    if (lm > 12) lm -= 12;
    if (lm >= 11 && diff < 4) ly -= 1;
    return [ld, lm, ly, leap];
  }
  // Âm → dương: [ngày, tháng, năm], hoặc null nếu tháng nhuận đó không có.
  function toSolar(ld, lm, ly, leap, tz) {
    var a11, b11;
    if (lm < 11) { a11 = month11(ly - 1, tz); b11 = month11(ly, tz); }
    else { a11 = month11(ly, tz); b11 = month11(ly + 1, tz); }
    var k = INT(.5 + (a11 - 2415021.076998695) / 29.530588853), off = lm - 11;
    if (off < 0) off += 12;
    if (b11 - a11 > 365) {
      var lo = leapOffset(a11, tz), lmo = lo - 2;
      if (lmo < 0) lmo += 12;
      if (leap && lm !== lmo) return null;
      if (leap || off >= lo) off += 1;
    } else if (leap) return null;
    return fromJd(newMoonDay(k + off, tz) + ld - 1);
  }
  // Tháng nhuận của năm âm ly (0 nếu không có).
  function leapMonth(ly, tz) {
    for (var m = 1; m <= 12; m++) if (toSolar(1, m, ly, 1, tz)) return m;
    return 0;
  }
  var CAN = [['Giáp', 'Jia'], ['Ất', 'Yi'], ['Bính', 'Bing'], ['Đinh', 'Ding'], ['Mậu', 'Wu'], ['Kỷ', 'Ji'], ['Canh', 'Geng'], ['Tân', 'Xin'], ['Nhâm', 'Ren'], ['Quý', 'Gui']];
  var CHI = [['Tý', 'Rat'], ['Sửu', 'Ox'], ['Dần', 'Tiger'], ['Mão', 'Cat'], ['Thìn', 'Dragon'], ['Tỵ', 'Snake'], ['Ngọ', 'Horse'], ['Mùi', 'Goat'], ['Thân', 'Monkey'], ['Dậu', 'Rooster'], ['Tuất', 'Dog'], ['Hợi', 'Pig']];
  function canChi(ly) { return [CAN[(ly + 6) % 10], CHI[(ly + 8) % 12]]; }

  var api = { jd: jd, fromJd: fromJd, newMoon: newMoon, sunLong: sunLong, newMoonDay: newMoonDay, sunDeg: sunDeg, sunSector: sunSector,
    month11: month11, leapOffset: leapOffset, toLunar: toLunar, toSolar: toSolar, leapMonth: leapMonth, canChi: canChi };
  if (typeof module !== 'undefined') module.exports = api; else window.AL = api;
})();
