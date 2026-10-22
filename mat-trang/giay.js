// Bộ giấy dùng chung cho các trang Mặt Trăng: màu, bộ lọc giấy, song ngữ, vòng lặp, sân khấu.
// Mỗi trang nạp file này ở cuối <body>, rồi lấy công cụ từ window.MT.
(function () {
  'use strict';
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n' +
    '  <defs>\n' +
    '    <filter id="pc" x="-30%" y="-30%" width="160%" height="160%">\n' +
    '      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#070A1A" flood-opacity=".45"/>\n' +
    '    </filter>\n' +
    '    <filter id="pcs" x="-30%" y="-30%" width="160%" height="160%">\n' +
    '      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#070A1A" flood-opacity=".4"/>\n' +
    '    </filter>\n' +
    '    <filter id="cut" x="-10%" y="-10%" width="120%" height="120%">\n' +
    '      <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="7" result="t"/>\n' +
    '      <feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>\n' +
    '      <feDropShadow in="d" dx="0" dy="4" stdDeviation="4" flood-color="#070A1A" flood-opacity=".42"/>\n' +
    '    </filter>\n' +
    '  </defs>\n' +
    '</svg>');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var D = Math.PI / 180;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG = document.documentElement.dataset.lang || 'vi';
  var T = function (vi, en) { return LANG === 'en' ? en : vi; };
  var hooks = [];
  var fmt = function (n, d) {
    return n.toLocaleString(LANG === 'en' ? 'en-US' : 'vi-VN', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var wrapA = function (a) { a = (a + Math.PI) % (2 * Math.PI); if (a < 0) a += 2 * Math.PI; return a - Math.PI; };

  // ---------- ngôn ngữ ----------
  var langBtns = document.querySelectorAll('.seg.lang button');
  function setLang(l) {
    LANG = l;
    document.documentElement.dataset.lang = l;
    document.documentElement.lang = l;
    langBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === l ? 'true' : 'false'); });
    try { localStorage.setItem('mt-lang', l); } catch (e) {}
    hooks.forEach(function (f) { f(); });
  }
  langBtns.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.l); }); });
  langBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === LANG ? 'true' : 'false'); });

  // ---------- vẽ giấy ----------
  var C = {
    night: '#1A2140', n2: '#1F2850', n3: '#25305C', n4: '#2C3968',
    cream: '#F3E9D2', crater: '#DCCDA9', sea: '#4A93B5', deep: '#2B5F84', land: '#86AE6E', land2: '#6E9758',
    orange: '#F08A4B', orange2: '#E0703A', grey: '#9FA6C2', sand: '#E6D2A2'
  };
  // Hạt giống cố định: sao rơi cùng chỗ mỗi lần tải.
  function rnd(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function stars(w, h, n, seed) {
    var r = rnd(seed), out = '';
    for (var i = 0; i < n; i++) {
      var x = r() * w, y = r() * h, s = 1.5 + r() * 3.2, o = .35 + r() * .5;
      out += '<path d="M' + x + ',' + (y - s) + 'L' + (x + s * .3) + ',' + (y - s * .3) + 'L' + (x + s) + ',' + y + 'L' + (x + s * .3) + ',' + (y + s * .3) + 'L' + x + ',' + (y + s) + 'L' + (x - s * .3) + ',' + (y + s * .3) + 'L' + (x - s) + ',' + y + 'L' + (x - s * .3) + ',' + (y - s * .3) + 'Z" fill="' + C.cream + '" opacity="' + o.toFixed(2) + '"/>';
    }
    return out;
  }
  function night(w, h, seed) {
    var m = Math.max(w, h);
    return '<rect width="' + w + '" height="' + h + '" fill="' + C.night + '"/>' +
      '<g filter="url(#cut)"><circle cx="' + w * .5 + '" cy="' + h * .55 + '" r="' + m * .62 + '" fill="' + C.n2 + '"/>' +
      '<circle cx="' + w * .5 + '" cy="' + h * .55 + '" r="' + m * .45 + '" fill="' + C.n3 + '"/></g>' +
      stars(w, h, Math.round(w * h / 9000), seed);
  }
  function svgEl(fig, vb, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', vb); s.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    if (cls) s.setAttribute('class', cls);
    // Cảnh đứng trên sân khấu: lớp trời đêm đầu tiên đã có ở nền sân khấu, không vẽ lại.
    if (fig.dataset.bg === 'stage' && !fig.dataset.skipped) { fig.dataset.skipped = '1'; return s; }
    s.setAttribute('aria-hidden', 'true');
    fig.appendChild(s); return s;
  }
  var LAND = [
    'M-0.62,-0.38C-0.45,-0.62 -0.12,-0.66 0.02,-0.5C0.14,-0.36 -0.02,-0.2 -0.16,-0.12C-0.3,-0.04 -0.34,0.12 -0.5,0.1C-0.68,0.06 -0.76,-0.18 -0.62,-0.38Z',
    'M0.18,0.22C0.34,0.1 0.58,0.16 0.62,0.34C0.66,0.52 0.48,0.66 0.3,0.62C0.16,0.58 0.02,0.44 0.18,0.22Z',
    'M0.36,-0.42C0.46,-0.5 0.6,-0.42 0.56,-0.3C0.52,-0.2 0.38,-0.22 0.36,-0.42Z',
    'M-0.42,0.36C-0.3,0.3 -0.16,0.4 -0.2,0.54C-0.26,0.66 -0.44,0.62 -0.48,0.5C-0.5,0.44 -0.48,0.4 -0.42,0.36Z'
  ];
  function earth(cx, cy, R, id) {
    return '<g transform="translate(' + cx + ',' + cy + ')"><circle r="' + R + '" fill="' + C.deep + '"/>' +
      '<g' + (id ? ' id="' + id + '"' : '') + ' transform="scale(' + R + ')">' +
      LAND.map(function (d, i) { return '<path d="' + d + '" fill="' + (i % 2 ? C.land2 : C.land) + '"/>'; }).join('') + '</g></g>';
  }
  function moonArt(r) {
    return '<circle r="' + r + '" fill="' + C.cream + '"/>' +
      '<circle cx="' + (-.32 * r) + '" cy="' + (-.22 * r) + '" r="' + (.24 * r) + '" fill="' + C.crater + '"/>' +
      '<circle cx="' + (.26 * r) + '" cy="' + (.2 * r) + '" r="' + (.17 * r) + '" fill="' + C.crater + '"/>' +
      '<circle cx="' + (-.06 * r) + '" cy="' + (.46 * r) + '" r="' + (.1 * r) + '" fill="' + C.crater + '"/>';
  }
  function arrow(x1, y1, x2, y2, head) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 2.5) return '';
    var ux = dx / L, uy = dy / L, h = Math.min(head || 11, L * .6);
    var bx = x2 - ux * h, by = y2 - uy * h, px = -uy * h * .55, py = ux * h * .55;
    return 'M' + x1.toFixed(1) + ',' + y1.toFixed(1) + 'L' + bx.toFixed(1) + ',' + by.toFixed(1) +
      'M' + x2.toFixed(1) + ',' + y2.toFixed(1) + 'L' + (bx + px).toFixed(1) + ',' + (by + py).toFixed(1) + 'L' + (bx - px).toFixed(1) + ',' + (by - py).toFixed(1) + 'Z';
  }
  function txt(x, y, cls, anchor, id) {
    return '<text x="' + x + '" y="' + y + '"' + (cls ? ' class="' + cls + '"' : '') + ' text-anchor="' + (anchor || 'middle') + '"' + (id ? ' id="' + id + '"' : '') + '></text>';
  }
  function say(svg, map) {
    var f = function () { for (var k in map) { var el = svg.querySelector('#' + k); if (el) el.textContent = T(map[k][0], map[k][1]); } };
    hooks.push(f); f();
  }

  // Vòng lặp chỉ chạy khi cảnh nằm trong màn hình.
  var playing = {};
  function loop(el, tick) {
    var vis = false, last = 0, raf = 0;
    function f(now) {
      raf = 0; if (!vis) return;
      var dt = Math.min(.05, (now - last) / 1000); last = now;
      tick(dt); raf = requestAnimationFrame(f);
    }
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      if (vis && !raf) { last = performance.now(); raf = requestAnimationFrame(f); }
    }, { rootMargin: '80px' }).observe(el);
  }
  var ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  document.querySelectorAll('[data-play]').forEach(function (b) {
    var k = b.dataset.play; playing[k] = !reduce;
    var draw = function () { b.innerHTML = playing[k] ? ICON_PAUSE : ICON_PLAY; b.setAttribute('aria-label', playing[k] ? T('Tạm dừng', 'Pause') : T('Chạy', 'Play')); };
    b.addEventListener('click', function () { playing[k] = !playing[k]; draw(); });
    hooks.push(draw); draw();
  });
  function segment(id, cb) {
    var g = document.getElementById(id), bs = g.querySelectorAll('button');
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        cb(b.dataset.v);
      });
    });
  }

  // ---------- tuần trăng ----------
  // Phần sáng của Mặt Trăng nhìn từ Bắc bán cầu; f = tuổi trăng / 29,53 (0 trăng mới, .5 rằm).
  function phase(f, r) {
    f = ((f % 1) + 1) % 1;
    var c = Math.cos(2 * Math.PI * f), rx = (r * Math.abs(c)).toFixed(2), thin = c > 0;
    if (f < .5) return 'M0,' + -r + 'A' + r + ',' + r + ' 0 0 1 0,' + r + 'A' + rx + ',' + r + ' 0 0 ' + (thin ? 0 : 1) + ' 0,' + -r + 'Z';
    return 'M0,' + -r + 'A' + r + ',' + r + ' 0 0 0 0,' + r + 'A' + rx + ',' + r + ' 0 0 ' + (thin ? 1 : 0) + ' 0,' + -r + 'Z';
  }
  function phaseIcon(f) {
    return '<svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="11" class="pd"/><path class="pl" d="' + phase(f, 11) + '"/></svg>';
  }

  // Mặt Trăng nhìn từ Trái Đất: đĩa tối, phần sáng cắt theo tuần trăng, miệng hố chỉ hiện trên phần sáng.
  function moonDisc(f, r, id) {
    return '<clipPath id="' + id + 'c"><path id="' + id + 'p" d="' + phase(f, r) + '"/></clipPath>' +
      '<circle r="' + r + '" fill="#2B3462"/><g clip-path="url(#' + id + 'c)">' + moonArt(r) + '</g>';
  }
  var PHASES = [
    ['Trăng mới', 'New moon'], ['Trăng lưỡi liềm đầu tháng', 'Waxing crescent'], ['Thượng huyền', 'First quarter'],
    ['Trăng gần rằm', 'Waxing gibbous'], ['Trăng tròn', 'Full moon'], ['Trăng sau rằm', 'Waning gibbous'],
    ['Hạ huyền', 'Last quarter'], ['Trăng lưỡi liềm cuối tháng', 'Waning crescent']
  ];
  var SYN = 29.530589;
  function phaseName(age) {
    var f = ((age / SYN) % 1 + 1) % 1, i;
    if (f < .034 || f > .966) i = 0; else if (f < .216) i = 1; else if (f < .284) i = 2; else if (f < .466) i = 3;
    else if (f < .534) i = 4; else if (f < .716) i = 5; else if (f < .784) i = 6; else i = 7;
    return T(PHASES[i][0], PHASES[i][1]);
  }
  function lunarDay(d) {
    return LANG === 'en' ? 'day ' + d : d <= 10 ? 'mùng ' + d : d === 15 ? 'rằm' : 'ngày ' + d;
  }
  // Nền vẽ kín sân khấu hero, vẽ lại khi đổi cỡ.
  function backdrop(bg, draw) {
    var s = svgEl(bg, '0 0 10 10'), st = bg.parentNode;
    function build() {
      var r = st.getBoundingClientRect(), W = Math.max(320, Math.round(r.width)), H = Math.max(320, Math.round(r.height));
      s.setAttribute('viewBox', '0 0 ' + W + ' ' + H); s.setAttribute('preserveAspectRatio', 'none');
      s.innerHTML = draw(W, H, W >= H);
    }
    build();
    var rs = 0;
    addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(build, 150); });
    return s;
  }
  function skyAt(W, H, cx, cy, seed, h) {
    var m = Math.max(W, H);
    return '<rect width="' + W + '" height="' + H + '" fill="' + C.night + '"/>' +
      '<g filter="url(#cut)"><circle cx="' + cx + '" cy="' + cy + '" r="' + m * .6 + '" fill="' + C.n2 + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + m * .38 + '" fill="' + C.n3 + '"/></g>' +
      stars(W, h || H, Math.round(W * (h || H) / 7000), seed);
  }

  // ---------- cây trang ----------
  // Trang chính (Phần 1) dẫn tới nhánh Phần 2, nhánh dẫn tới bốn trang lá.
  var TREE = {
    k: 'p1', href: '/mat-trang/', f: .5, tag: ['Phần 1', 'Part 1'],
    t: ['Khóa thủy triều', 'Tidal locking'],
    d: ['Vì sao ta chỉ thấy một mặt của Mặt Trăng', 'Why we only ever see one side of the Moon'],
    kids: [{
      k: 'lich', href: '/mat-trang/lich/', f: .3, tag: ['Phần 2', 'Part 2'],
      t: ['Tuần trăng và lịch', 'Phases and calendars'],
      d: ['Cách loài người đếm thời gian bằng Mặt Trăng', 'How people learned to count time by the Moon'],
      kids: [
        { k: 'tuan-trang', href: '/mat-trang/lich/tuan-trang/', f: .1, n: '01',
          t: ['Vì sao trăng khuyết rồi tròn', 'Why the Moon waxes and wanes'],
          d: ['Tuần trăng, tháng 29,5 ngày, và vì sao không tháng nào cũng có nhật thực', 'Phases, the 29.5-day month, and why eclipses are not monthly'] },
        { k: 'dem-trang', href: '/mat-trang/lich/dem-trang/', f: .22, n: '02',
          t: ['Những người đầu tiên đếm trăng', 'The first Moon-counters'],
          d: ['Vạch khắc trên xương, hố đào ở Scotland, rồi tới lịch của các đế chế', 'Notched bones, pits in Scotland, then the calendars of empires'] },
        { k: 'ba-kieu-lich', href: '/mat-trang/lich/ba-kieu-lich/', f: .38, n: '03',
          t: ['Âm, dương, hay cả hai', 'Lunar, solar, or both'],
          d: ['Vì sao Ramadan trôi qua các mùa, Giáng sinh thì không, còn Tết thì nhích qua lại', 'Why Ramadan drifts through the seasons, Christmas stays, and Tết wobbles'] },
        { k: 'am-lich-viet-nam', href: '/mat-trang/lich/am-lich-viet-nam/', f: .6, n: '04',
          t: ['Âm lịch Việt Nam', 'The Vietnamese calendar'],
          d: ['24 tiết khí, tháng nhuận, và năm Tết Việt Nam sớm hơn Trung Quốc cả tháng', '24 solar terms, leap months, and the year Vietnam had Tết a month before China'] }
      ]
    }]
  };
  function bi(p, tag, cls) {
    return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' lang="vi">' + p[0] + '</' + tag + '><' + tag + (cls ? ' class="' + cls + '"' : '') + ' lang="en">' + p[1] + '</' + tag + '>';
  }
  function nodeCard(n, cur) {
    var here = n.k === cur;
    return '<a class="tnode' + (here ? ' here' : '') + '" href="' + n.href + '"' + (here ? ' aria-current="page"' : '') + '>' +
      '<span class="ic">' + phaseIcon(n.f) + '</span><span class="tx">' +
      '<span class="tt">' + (n.tag ? bi(n.tag, 'span', 'tg') : n.n ? '<span class="tg">' + n.n + '</span>' : '') +
      (here ? bi(['Bạn đang ở đây', 'You are here'], 'span', 'hb') : '') + '</span>' +
      bi(n.t, 'strong') + bi(n.d, 'span', 'dd') + '</span></a>';
  }
  function branch(n, cur) {
    return '<li>' + nodeCard(n, cur) + (n.kids ? '<ol>' + n.kids.map(function (c) { return branch(c, cur); }).join('') + '</ol>' : '') + '</li>';
  }
  function flat(n, out) { out = out || []; out.push(n); (n.kids || []).forEach(function (c) { flat(c, out); }); return out; }
  document.querySelectorAll('[data-tree]').forEach(function (el) {
    el.innerHTML = '<ol class="tree">' + branch(TREE, el.dataset.tree) + '</ol>';
  });
  // Thẻ "đọc tiếp": trang kế theo thứ tự cây; trang cuối quay về trang chính.
  document.querySelectorAll('[data-next]').forEach(function (el) {
    var all = flat(TREE), i = all.map(function (n) { return n.k; }).indexOf(el.dataset.next), n = all[i + 1];
    var lbl = n ? ['Đọc tiếp', 'Read next'] : ['Quay về đầu cây', 'Back to the top'];
    n = n || all[0];
    el.innerHTML = '<a class="nextcard" href="' + n.href + '">' + bi(lbl, 'span', 'tg') + bi(n.t, 'strong') + bi(n.d, 'span', 'dd') +
      '<span class="go"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.6l-4.3-4.3a1 1 0 0 1 0-1.4Z"/></svg></span></a>';
  });

  // ================= SÂN KHẤU =================
  // Mỗi cảnh dính màn hình; trời sao vẽ một lần cho cả sân khấu, cảnh lăn vào rồi chữ mới hiện.
  function stage() {
    var stages = document.querySelectorAll('.act .stage');
    function sky(st) {
      var bg = st.querySelector('.bg'), fit = st.querySelector('.fit');
      if (!fit) return;
      var h = st.offsetHeight;
      if (!h) return;
      // Đo theo layout (offset), không theo khung đang xoay lúc cảnh còn lăn vào.
      var v = st.querySelector('.vis'), k = 900 / h, W = Math.round(st.offsetWidth * k), H = 900;
      var fx = (v.offsetLeft + fit.offsetLeft) * k, fy = (v.offsetTop + fit.offsetTop) * k, fw = fit.offsetWidth * k, fh = fit.offsetHeight * k;
      var cx = (fx + fw / 2).toFixed(0), cy = (fy + fh / 2).toFixed(0), M = Math.max(fw, fh), out;
      if (st.dataset.sky === 'plain') {
        // Đồi giấy kéo dài hai bên cảnh nhật thực, nối liền với đồi trong hình.
        var hill = function (y, a, ph, fill) {
          var d = 'M-20,' + (H + 20);
          for (var x = -20; x <= W + 20; x += 30) d += 'L' + x + ',' + (y + Math.sin(x / 140 + ph) * a).toFixed(1);
          return '<path d="' + d + 'L' + (W + 20) + ',' + (H + 20) + 'Z" fill="' + fill + '"/>';
        };
        out = '<g filter="url(#cut)">' + hill(fy + fh * .8, 9, 0, '#2A3A5E') + hill(fy + fh * .915, 6, 2, '#33496F') + '</g>';
      } else {
        out = '<g filter="url(#cut)"><circle cx="' + cx + '" cy="' + cy + '" r="' + (M * .62).toFixed(0) + '" fill="' + C.n2 + '"/>' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + (M * .42).toFixed(0) + '" fill="' + C.n3 + '"/></g>';
      }
      var svg = bg.querySelector('svg') || svgEl(bg, '0 0 1 1');
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.innerHTML = '<g class="st">' + stars(W, H, Math.round(W * H / 9000), 5 + W % 97) + '</g>' + out;
    }
    function ratio(fit) {
      var inv = 0;
      fit.querySelectorAll('.scene').forEach(function (fg) {
        var p = getComputedStyle(fg).getPropertyValue('--ar').split('/');
        inv += (+p[1] || 9) / (+p[0] || 16);
      });
      fit.style.setProperty('--arn', (1 / inv).toFixed(4));
    }
    document.querySelectorAll('.fit').forEach(ratio);
    stages.forEach(sky);
    var rs = 0;
    addEventListener('resize', function () {
      clearTimeout(rs);
      rs = setTimeout(function () { stages.forEach(sky); }, 200);
    });

    var acts = document.querySelectorAll('.act');
    if (reduce || !('IntersectionObserver' in window)) {
      acts.forEach(function (a) { a.classList.add('in', 'ready'); });
      document.querySelectorAll('.tcard').forEach(function (c) { c.classList.add('seen'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = e.target; io.unobserve(a);
        a.classList.add('in');
        setTimeout(function () { a.classList.add('ready'); }, 1150);
      });
    }, { rootMargin: '0px 0px -30% 0px' });
    acts.forEach(function (a) { io.observe(a); });
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); co.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.story .tcard').forEach(function (c) { co.observe(c); });
  }

  window.MT = {
    $: $, D: D, reduce: reduce, T: T, hooks: hooks, fmt: fmt, clamp: clamp, wrapA: wrapA,
    lang: function () { return LANG; }, C: C, rnd: rnd, stars: stars, night: night, svgEl: svgEl,
    earth: earth, moonArt: moonArt, arrow: arrow, txt: txt, say: say, loop: loop, playing: playing,
    segment: segment, stage: stage, phase: phase, phaseIcon: phaseIcon, bi: bi,
    moonDisc: moonDisc, phaseName: phaseName, lunarDay: lunarDay, SYN: SYN, backdrop: backdrop, skyAt: skyAt
  };
})();
