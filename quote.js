/* ==========================================================================
   Quotation builder — builds an A4 quotation in the browser and downloads it
   as a PDF. Nothing is sent anywhere; the form never leaves the page.
   ========================================================================== */

(function () {
  "use strict";

  const FONT_STACK =
    '"Noto Sans Lao", "Phetsarath OT", "Saysettha OT", "Leelawadee UI", system-ui, sans-serif';
  const PAGE_W = 1240;
  const PAGE_H = 1754;
  /* Raster scale for the on-screen preview: 2 gives 2480 x 3508 px, about
     300 DPI on A4. The downloaded PDF is vector, so it does not use this. */
  const SCALE = 2;
  const MX = 96;
  const PAGE_PRICE = 350000;
  const VAT_RATE = 0.1;

  const BRAND = {
    name: "ຫົງຄຳ ສຸວັນນະວົງ",
    role: "Software Development Consultant",
    email: "hongkham.svnv@outlook.com",
    phone: "+856 20 5885 5817",
    address: "ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ",
    site: "amasvnv.github.io/Profile",
    hours: "ຈັນ–ສຸກ 09:00–16:00 · ເສາ 10:00–16:00",
  };

  const TERMS = [
    "ລາຄານີ້ຍຶນຍັນຕາມກຳນົດທີ່ລະບຸໄວ້ ນັບຈາກວັນທີ່ອອກໃບສະເໜີ.",
    "ຊຳລະ 50% ກ່ອນເລີ່ມງານ ແລະ 50% ເມື່ອກວດຮັບສົ່ງມອບ.",
    "ຮັບຊຳລະເປັນກີບ (₭), ໂດລາ ຫຼື ບາດ ຕາມອັດຕາແລກປ່ຽນ.",
    "ຄ່າໂຮສ ແລະ ໂດເມນລາຍປີຕໍ່ໄປ ບໍ່ລວມຢູ່ໃນລາຄານີ້.",
    "ການແກ້ໄຂນອກຂອບເຂດວຽກ ຄິດໄລ່ 400,000 ₭ ຕໍ່ຊົ່ວໂມງ.",
    "ຮັບປະກັນແກ້ໄຂຂໍ້ຜິດພາດ 30 ວັນ ຫຼັງສົ່ງມອບ.",
  ];

  let quoteNo = "";

  function $(id) {
    return document.getElementById(id);
  }

  function value(id) {
    const el = $(id);
    return el ? String(el.value || "") : "";
  }

  function clampInt(raw, min, max) {
    const n = parseInt(raw, 10);
    if (!isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function money(n) {
    return new Intl.NumberFormat("en-US").format(Math.round(n || 0));
  }

  function esc(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function dateText(d) {
    return pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function addDays(d, days) {
    const copy = new Date(d.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function makeQuoteNo(d) {
    const tail = String(Math.floor(Math.random() * 900) + 100);
    return "Q-" + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + "-" + tail;
  }

  /* ------------------------------------------------------------------ state */

  function collect() {
    const select = $("q-package");
    const option = select && select.options[select.selectedIndex];
    const pkgName = option ? option.getAttribute("data-name") || option.textContent.trim() : "";
    const pkgDays = option ? option.getAttribute("data-days") || "" : "";
    const pkgPrice = option ? Number(option.value) || 0 : 0;

    const pages = clampInt(value("q-pages"), 0, 40);
    const discountPct = clampInt(value("q-discount"), 0, 50);
    const validity = clampInt(value("q-validity"), 7, 90);
    const vatOn = $("q-vat") ? $("q-vat").checked : true;

    const items = [
      {
        label: pkgName + (pkgDays ? " · ສົ່ງມອບ " + pkgDays : ""),
        qty: 1,
        price: pkgPrice,
      },
    ];

    if (pages > 0) {
      items.push({ label: "ໜ້າເພີ່ມ (" + pages + " ໜ້າ · 350,000 ₭/ໜ້າ)", qty: pages, price: PAGE_PRICE });
    }

    Array.prototype.forEach.call(document.querySelectorAll('input[name="q-addon"]:checked'), function (el) {
      items.push({
        label: el.getAttribute("data-label") || "",
        qty: 1,
        price: Number(el.getAttribute("data-price")) || 0,
      });
    });

    let subtotal = 0;
    items.forEach(function (item) {
      subtotal += item.qty * item.price;
    });
    const discount = Math.round((subtotal * discountPct) / 100);
    const taxable = subtotal - discount;
    const vatAmount = vatOn ? Math.round(taxable * VAT_RATE) : 0;
    const total = taxable + vatAmount;

    const today = new Date();
    if (!quoteNo) quoteNo = makeQuoteNo(today);

    return {
      no: quoteNo,
      dateText: dateText(today),
      validText: dateText(addDays(today, validity)),
      validity: validity,
      name: value("q-name").trim(),
      company: value("q-company").trim(),
      tin: value("q-tin").trim(),
      phone: value("q-phone").trim(),
      email: value("q-email").trim(),
      address: value("q-address").trim(),
      note: value("q-note").trim().slice(0, 400),
      items: items,
      subtotal: subtotal,
      discountPct: discountPct,
      discount: discount,
      vatOn: vatOn,
      vatAmount: vatAmount,
      total: total,
      deposit: Math.round(total / 2),
    };
  }

  /* ---------------------------------------------------------------- preview */

  function renderPreview(s) {
    const box = $("quote-doc");
    if (!box) return;
    /* The card is the A4 page itself, painted at the same scale as the PDF,
       so the thumbnail and the download always line up. */
    const canvas = paintPage(s, SCALE, false);
    canvas.style.width = "100%";
    box.innerHTML = "";
    box.appendChild(canvas);
  }

  /* ------------------------------------------------------------ canvas / pdf */

  /* Everything on the A4 page is drawn a little larger: at preview size the
     old scale read as grey mush, here the type stays legible. */
  const TYPE_SCALE = 1.12;

  function setFont(ctx, size, weight) {
    const px = Math.round(size * TYPE_SCALE * 100) / 100;
    ctx.font = (weight || 400) + " " + px + "px " + FONT_STACK;
  }

  function txt(ctx, text, x, y, opts) {
    const o = opts || {};
    ctx.save();
    setFont(ctx, o.size || 16, o.weight);
    ctx.fillStyle = o.color || "#1e293b";
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = o.baseline || "alphabetic";
    if (o.spacing) {
      try {
        ctx.letterSpacing = o.spacing + "px";
      } catch (err) {
        /* older browsers: ignore */
      }
    }
    ctx.fillText(String(text), x, y);
    ctx.restore();
  }

  function wrapLines(ctx, text, maxWidth, size, weight) {
    ctx.save();
    setFont(ctx, size, weight);
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach(function (word) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width <= maxWidth) {
        line = test;
      } else if (line) {
        lines.push(line);
        line = ctx.measureText(word).width <= maxWidth ? word : "";
        if (!line) {
          let chunk = "";
          Array.from(word).forEach(function (ch) {
            if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
              lines.push(chunk);
              chunk = ch;
            } else {
              chunk += ch;
            }
          });
          line = chunk;
        }
      } else {
        lines.push(word);
      }
    });
    if (line) lines.push(line);
    ctx.restore();
    return lines.length ? lines : [""];
  }

  function fitText(ctx, text, maxWidth, size, weight) {
    ctx.save();
    setFont(ctx, size, weight);
    let out = String(text);
    if (ctx.measureText(out).width > maxWidth) {
      while (out.length > 1 && ctx.measureText(out + "…").width > maxWidth) {
        out = out.slice(0, -1);
      }
      out += "…";
    }
    ctx.restore();
    return out;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /* ------------------------------------------------------------ brand mark */

  const LOGO_SRC = "assets/logo-hongkham.webp";
  const LOGO = { img: null, ready: null, done: false };

  /* The artwork file is used exactly as supplied: nothing is redrawn. */
  function loadLogo() {
    if (LOGO.ready) return LOGO.ready;
    const img = new Image();
    LOGO.img = img;
    LOGO.ready = new Promise(function (resolve) {
      img.onload = function () {
        LOGO.done = true;
        resolve(img);
      };
      img.onerror = function () {
        resolve(null);
      };
      img.src = LOGO_SRC;
    });
    return LOGO.ready;
  }

  function drawLogoMark(ctx, x, y, s) {
    if (LOGO.done && LOGO.img) {
      ctx.drawImage(LOGO.img, x, y, s, s);
      return;
    }
    /* before the file is decoded the header keeps a tile so nothing jumps */
    ctx.fillStyle = "#170a33";
    roundRect(ctx, x, y, s, s, s * 0.22);
    ctx.fill();
    txt(ctx, "ຫ", x + s / 2, y + s / 2, {
      size: s * 0.46,
      weight: 700,
      color: "#ffffff",
      align: "center",
      baseline: "middle",
    });
  }

  function paintPage(s, scale, record) {
    const ratio = scale || SCALE;
    const canvas = document.createElement("canvas");
    canvas.width = PAGE_W * ratio;
    canvas.height = PAGE_H * ratio;
    canvas.style.width = PAGE_W + "px";
    const base = canvas.getContext("2d");
    base.scale(ratio, ratio);
    const withOps = record !== false;
    const ctx = withOps ? new CanvasRecorder(base) : base;
    if (withOps) canvas.__ops = ctx.ops;
    const CW = PAGE_W - MX * 2;
    const RX = MX + CW;

    const accent = ctx.createLinearGradient(0, 0, PAGE_W, 0);
    accent.addColorStop(0, "#3b82f6");
    accent.addColorStop(0.55, "#8b5cf6");
    accent.addColorStop(1, "#f97316");
    const band = ctx.createLinearGradient(RX - 384, 0, RX, 0);
    band.addColorStop(0, "#3b82f6");
    band.addColorStop(1, "#8b5cf6");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, PAGE_W, PAGE_H);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, PAGE_W, 10);

    /* header: the artwork file already carries the HONGKHAM wordmark, so the
       box has to be big enough for that word to stay readable on paper. The
       text column is centred on the box and clears it by 18px. */
    const logoSize = 128;
    const logoTop = 58;
    const logoText = MX + logoSize + 18;
    drawLogoMark(ctx, MX, logoTop, logoSize);
    txt(ctx, BRAND.name, logoText, 104, { size: 28, weight: 700, color: "#0f172a" });
    txt(ctx, BRAND.role, logoText, 132, { size: 15, color: "#475569" });
    txt(ctx, fitText(ctx, BRAND.email + " · " + BRAND.phone, 500, 14, 400), logoText, 158, {
      size: 14,
      color: "#475569",
    });

    txt(ctx, "ໃບສະເໜີລາຄາ", RX, 94, { size: 25, weight: 700, color: "#0f172a", align: "right" });
    txt(ctx, "QUOTATION", RX, 114, { size: 10, weight: 600, color: "#64748b", align: "right", spacing: 3 });
    txt(ctx, "ເລກທີ: " + s.no, RX, 142, { size: 13.5, color: "#334155", align: "right" });
    txt(ctx, "ວັນທີ: " + s.dateText, RX, 162, { size: 13.5, color: "#334155", align: "right" });
    txt(ctx, "ຍຶນຍັນເຖິງ: " + s.validText + " · " + s.validity + " ວັນ", RX, 182, {
      size: 13.5,
      color: "#334155",
      align: "right",
    });

    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(MX, 206, CW, 1.5);

    /* parties */
    const panelTop = 232;
    const panelH = 232;
    const leftW = 620;
    const rightX = MX + 650;
    ctx.fillStyle = "#f1f5f9";
    roundRect(ctx, MX, panelTop, leftW, panelH, 16);
    ctx.fill();
    roundRect(ctx, rightX, panelTop, RX - rightX, panelH, 16);
    ctx.fill();

    const lx = MX + 24;
    const lv = MX + 128;
    txt(ctx, "ຂໍ້ມູນລູກຄ້າ", lx, panelTop + 28, { size: 10.5, weight: 700, color: "#5b6b80", spacing: 1.2 });
    let ly = panelTop + 58;
    if (s.company) {
      txt(ctx, fitText(ctx, s.company, 468, 19, 700), lx, ly, { size: 19, weight: 700, color: "#0f172a" });
      ly += 26;
      txt(ctx, fitText(ctx, s.name || "—", 468, 15.5, 400), lx, ly, { size: 15.5, color: "#334155" });
      ly += 26;
    } else {
      txt(ctx, fitText(ctx, s.name || "—", 468, 19, 700), lx, ly, { size: 19, weight: 700, color: "#0f172a" });
      ly += 28;
    }
    txt(ctx, "ເລກ ID / TIN", lx, ly, { size: 10.5, color: "#64748b" });
    txt(ctx, fitText(ctx, s.tin || "—", 440, 13.5, 400), lv, ly, { size: 13.5, color: "#334155" });
    ly += 24;

    txt(ctx, "ທີ່ຢູ່", lx, ly, { size: 10.5, color: "#64748b" });
    const addrLines = wrapLines(ctx, s.address || "—", 440, 13.5, 400).slice(0, 2);
    addrLines.forEach(function (line, index) {
      txt(ctx, line, lv, ly + index * 20, { size: 13.5, color: "#334155" });
    });
    ly += 20 * addrLines.length;

    txt(ctx, "ໂທ", lx, ly, { size: 10.5, color: "#64748b" });
    txt(ctx, s.phone || "—", lv, ly, { size: 13.5, color: "#334155" });
    ly += 24;
    txt(ctx, "ອີເມວ", lx, ly, { size: 10.5, color: "#64748b" });
    txt(ctx, fitText(ctx, s.email || "—", 440, 13.5, 400), lv, ly, { size: 13.5, color: "#334155" });

    const px = rightX + 24;
    const pv = rightX + 76;
    const pvMax = RX - pv - 24;
    txt(ctx, "ຜູ້ໃຫ້ບໍລິການ", px, panelTop + 28, { size: 10.5, weight: 700, color: "#5b6b80", spacing: 1.2 });
    txt(ctx, fitText(ctx, BRAND.name, RX - px - 24, 16, 700), px, panelTop + 58, {
      size: 16,
      weight: 700,
      color: "#0f172a",
    });
    [
      ["ໂທ", BRAND.phone],
      ["ອີເມວ", BRAND.email],
      ["ທີ່ຢູ່", BRAND.address],
      ["ເວລາ", BRAND.hours],
    ].forEach(function (row, index) {
      const y = panelTop + 86 + index * 26;
      txt(ctx, row[0], px, y, { size: 10.5, color: "#64748b" });
      txt(ctx, fitText(ctx, row[1], pvMax, 12.5, 400), pv, y, { size: 12.5, color: "#334155" });
    });

    /* item count + table rhythm */
    const headH = 44;
    const baseRowH = 50;
    const stripH = 42;
    const gapSection = 40;
    const gapTable = 34;
    const gapSign = 70;
    const signY = PAGE_H - 300;
    const termsW = 588;
    const termLines = [];
    TERMS.forEach(function (term, index) {
      wrapLines(ctx, index + 1 + ". " + term, termsW, 14, 400).forEach(function (line) {
        termLines.push(line);
      });
    });
    const noteLines = s.note ? wrapLines(ctx, s.note, 520, 13.5, 400).slice(0, 2) : [];
    const termsH = 26 + termLines.length * 24 + (noteLines.length ? 28 + noteLines.length * 23 : 0);
    const totalRows = s.discount > 0 ? 4 : 2;
    const cardH = 26 + totalRows * 28 + 20 + 54 + 16 + 48 + 12;
    const blockH = Math.max(termsH, cardH);

    const slack = Math.max(
      0,
      signY -
        gapSign -
        (panelTop +
          panelH +
          gapSection +
          18 +
          headH +
          s.items.length * baseRowH +
          stripH +
          gapTable +
          blockH)
    );
    const rowH = baseRowH + Math.min(10, Math.floor((slack * 0.25) / Math.max(1, s.items.length)));
    const remaining = slack - (rowH - baseRowH) * s.items.length;
    const gapShare = Math.max(0, Math.min(150, Math.round((remaining + gapSign - gapSection) / 3)));

    const sectionY = panelTop + panelH + gapSection + gapShare;
    txt(ctx, "ລາຍການສະເໜີລາຄາ", MX, sectionY, { size: 10.5, weight: 700, color: "#5b6b80", spacing: 1.4 });
    txt(ctx, "ຈຳນວນ " + s.items.length + " ລາຍການ", RX, sectionY, {
      size: 10.5,
      color: "#64748b",
      align: "right",
    });

    const tableTop = sectionY + 18;
    const colNum = MX + 22;
    const labelX = MX + 56;
    const qtyX = RX - 400;
    const unitX = RX - 232;
    const amountX = RX - 20;
    ctx.fillStyle = "#0f172a";
    roundRect(ctx, MX, tableTop, CW, headH, 10);
    ctx.fill();
    txt(ctx, "#", colNum, tableTop + 27, { size: 11, weight: 600, color: "#94a3b8" });
    txt(ctx, "ລາຍການ / ລາຍລະອຽດ", labelX, tableTop + 27, { size: 11, weight: 600, color: "#e2e8f0" });
    txt(ctx, "ຈຳນວນ", qtyX, tableTop + 27, { size: 11, weight: 600, color: "#e2e8f0", align: "center" });
    txt(ctx, "ລາຄາ / ໜ່ວຍ", unitX, tableTop + 27, { size: 11, weight: 600, color: "#e2e8f0", align: "right" });
    txt(ctx, "ຈຳນວນເງິນ", amountX, tableTop + 27, { size: 11, weight: 600, color: "#e2e8f0", align: "right" });

    let rowY = tableTop + headH;
    s.items.forEach(function (item, index) {
      const mid = rowY + rowH / 2 + 6;
      txt(ctx, String(index + 1), colNum, mid, { size: 12.5, color: "#475569" });
      txt(ctx, fitText(ctx, item.label, qtyX - labelX - 120, 15, 400), labelX, mid, {
        size: 15,
        color: "#1e293b",
      });
      txt(ctx, String(item.qty), qtyX, mid, { size: 14.5, color: "#334155", align: "center" });
      txt(ctx, money(item.price), unitX, mid, { size: 14.5, color: "#334155", align: "right" });
      txt(ctx, money(item.qty * item.price), amountX, mid, {
        size: 15.5,
        weight: 600,
        color: "#0f172a",
        align: "right",
      });
      ctx.fillStyle = "#e8edf4";
      ctx.fillRect(MX, rowY + rowH - 1, CW, 1);
      rowY += rowH;
    });

    const stripTop = rowY;
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(MX, stripTop, CW, stripH);
    txt(ctx, "ລວມ " + s.items.length + " ລາຍການ", MX + 22, stripTop + 26, { size: 11.5, color: "#475569" });
    txt(ctx, "ລວມເປັນເງິນ " + money(s.subtotal) + " ₭", RX - 22, stripTop + 26, {
      size: 13,
      weight: 600,
      color: "#0f172a",
      align: "right",
    });

    /* terms + note (left) */
    const bottomY = stripTop + stripH + gapTable + gapShare;
    let ty = bottomY;
    txt(ctx, "ເງື່ອນໄຂ ແລະ ຂໍ້ກຳນົດ", MX, ty, { size: 10.5, weight: 700, color: "#5b6b80", spacing: 1.2 });
    ty += 26;
    termLines.forEach(function (line) {
      txt(ctx, line, MX, ty, { size: 14, color: "#334155" });
      ty += 24;
    });
    if (noteLines.length) {
      noteLines.forEach(function (line, index) {
        if (index === 0) {
          ctx.fillStyle = "#f8fafc";
          roundRect(ctx, MX, ty - 13, 588, 24 + noteLines.length * 23, 10);
          ctx.fill();
          txt(ctx, "ໝາຍເຫດ", MX + 14, ty + 5, { size: 9.5, weight: 700, color: "#5b6b80", spacing: 1.2 });
          ty += 24;
        }
        txt(ctx, line, MX + 14, ty, { size: 13.5, color: "#334155" });
        ty += 23;
      });
    }

    /* totals card (right) */
    const cardX = RX - 384;
    const cardTop = bottomY - 10;
    ctx.fillStyle = "#f1f5f9";
    roundRect(ctx, cardX, cardTop, 384, cardH, 14);
    ctx.fill();
    let totY = cardTop + 36;
    function totalRow(label, amount, strong) {
      txt(ctx, label, cardX + 22, totY, { size: 12.5, color: "#475569" });
      txt(ctx, amount, cardX + 362, totY, {
        size: strong ? 14 : 13,
        weight: 600,
        color: "#0f172a",
        align: "right",
      });
      totY += 28;
    }
    totalRow("ລວມເປັນເງິນ", money(s.subtotal) + " ₭", true);
    if (s.discount > 0) {
      totalRow("ສ່ວນຫຼຸດ " + s.discountPct + "%", "-" + money(s.discount) + " ₭", false);
      totalRow("ຍອດກ່ອນ VAT", money(s.subtotal - s.discount) + " ₭", true);
    }
    totalRow(
      s.vatOn ? "VAT " + Math.round(VAT_RATE * 100) + "%" : "VAT",
      s.vatOn ? money(s.vatAmount) + " ₭" : "ບໍ່ລວມ",
      true
    );

    ctx.fillStyle = "#dbe3ee";
    ctx.fillRect(cardX + 22, totY - 9, 340, 1);

    const bandTop = totY + 15;
    ctx.fillStyle = band;
    roundRect(ctx, cardX + 14, bandTop, 356, 54, 12);
    ctx.fill();
    txt(ctx, "ລວມທັງໝົດ", cardX + 32, bandTop + 35, { size: 14, weight: 600, color: "#eef2ff" });
    txt(ctx, money(s.total) + " ₭", cardX + 350, bandTop + 36, {
      size: 19,
      weight: 700,
      color: "#ffffff",
      align: "right",
    });

    const payY = bandTop + 54 + 28;
    txt(ctx, "ມັດຈຳ 50% · ກ່ອນເລີ່ມງານ", cardX + 22, payY, { size: 11, color: "#475569" });
    txt(ctx, money(s.deposit) + " ₭", cardX + 362, payY, { size: 12.5, weight: 600, color: "#0f172a", align: "right" });
    txt(ctx, "ຍອດຄ້າງຊຳລະ · ຕອນສົ່ງມອບ", cardX + 22, payY + 24, { size: 11, color: "#475569" });
    txt(ctx, money(s.total - s.deposit) + " ₭", cardX + 362, payY + 24, {
      size: 12.5,
      weight: 600,
      color: "#0f172a",
      align: "right",
    });

    /* signatures */
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(MX, signY, 300, 1);
    ctx.fillRect(RX - 300, signY, 300, 1);
    txt(ctx, "ລາຍເຊັນຜູ້ສະເໜີ", MX + 150, signY + 26, { size: 12.5, color: "#475569", align: "center" });
    txt(ctx, BRAND.name, MX + 150, signY + 50, { size: 14, weight: 700, color: "#0f172a", align: "center" });
    txt(ctx, "ວັນທີ ......../......../........", MX + 150, signY + 72, {
      size: 11.5,
      color: "#64748b",
      align: "center",
    });

    txt(ctx, "ລາຍເຊັນຜູ້ອະນຸມັດ (ລູກຄ້າ)", RX - 150, signY + 26, {
      size: 12.5,
      color: "#475569",
      align: "center",
    });
    txt(ctx, fitText(ctx, s.company || s.name || "—", 280, 14, 700), RX - 150, signY + 50, {
      size: 14,
      weight: 700,
      color: "#0f172a",
      align: "center",
    });
    txt(ctx, "ວັນທີ ......../......../........", RX - 150, signY + 72, {
      size: 11.5,
      color: "#64748b",
      align: "center",
    });

    /* footer */
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(MX, PAGE_H - 96, CW, 1);
    txt(ctx, BRAND.site + " · " + BRAND.email, MX, PAGE_H - 66, { size: 11.5, color: "#64748b" });
    txt(ctx, "ເອກະສານສ້າງອັດຕະໂນມັດ · ໜ້າ 1/1", RX, PAGE_H - 66, {
      size: 11.5,
      color: "#64748b",
      align: "right",
    });

    return canvas;
  }

  /* ------------------------------------------------------ vector pdf writer */

  /* The PDF reuses the canvas layout, but every text run is shaped with HarfBuzz
     and written as glyph outlines, so letters stay sharp at any zoom level
     instead of being one 300 DPI picture. */

  const HARFBUZZ_URL = "./assets/vendor/harfbuzz/index.mjs";

  const FONT_FILES = {
    400: "assets/fonts/NotoSansLao-Regular.ttf",
    600: "assets/fonts/NotoSansLao-SemiBold.ttf",
    700: "assets/fonts/NotoSansLao-Bold.ttf",
  };

  let shaperPromise = null;

  function loadShaper() {
    if (shaperPromise) return shaperPromise;
    shaperPromise = import(HARFBUZZ_URL).then(function (hb) {
      const weights = [400, 600, 700];
      return Promise.all(
        weights.map(function (weight) {
          return fetch(FONT_FILES[weight])
            .then(function (response) {
              if (!response.ok) throw new Error("font " + weight);
              return response.arrayBuffer();
            })
            .then(function (buffer) {
              const face = new hb.Face(new hb.Blob(buffer));
              return { face: face, font: new hb.Font(face), upem: face.upem || 1000 };
            });
        })
      ).then(function (list) {
        const fonts = {};
        weights.forEach(function (weight, index) {
          fonts[weight] = list[index];
        });
        return { hb: hb, fonts: fonts, runs: new Map(), outlines: new Map() };
      });
    });
    shaperPromise.catch(function () {
      shaperPromise = null;
    });
    return shaperPromise;
  }

  function familyFor(shaper, weight) {
    return shaper.fonts[weight] ? weight : 400;
  }

  function shapeRun(shaper, text, family) {
    const key = family + "|" + text;
    const hit = shaper.runs.get(key);
    if (hit) return hit;

    const font = shaper.fonts[family] || shaper.fonts[400];
    const buffer = new shaper.hb.Buffer();
    buffer.addText(text);
    buffer.guessSegmentProperties();
    shaper.hb.shape(font.font, buffer);
    const infos = buffer.getGlyphInfos();
    const positions = buffer.getGlyphPositions();

    const glyphs = [];
    for (let i = 0; i < infos.length; i += 1) {
      const position = positions[i] || {};
      glyphs.push({
        gid: infos[i].codepoint,
        advance: position.xAdvance || 0,
        dx: position.xOffset || 0,
        dy: position.yOffset || 0,
      });
    }

    const run = { upem: font.upem, glyphs: glyphs };
    shaper.runs.set(key, run);
    return run;
  }

  function glyphOutline(shaper, family, gid) {
    const key = family + ":" + gid;
    const hit = shaper.outlines.get(key);
    if (hit) return hit;
    const font = shaper.fonts[family] || shaper.fonts[400];
    let data = "";
    try {
      data = font.font.glyphToPath(gid) || "";
    } catch (err) {
      data = "";
    }
    const outline = parseSvgPath(data);
    shaper.outlines.set(key, outline);
    return outline;
  }

  /* Font outlines arrive as SVG "M/L/Q/Z" path data with y pointing up. */
  function parseSvgPath(data) {
    const out = [];
    const tokens = String(data).match(/[a-zA-Z]|-?\d*\.?\d+(?:[eE][-+]?\d+)?/g) || [];
    let i = 0;
    let cmd = "";
    let cx = 0;
    let cy = 0;
    let sx = 0;
    let sy = 0;

    function next() {
      const value = parseFloat(tokens[i]);
      i += 1;
      return isFinite(value) ? value : 0;
    }

    while (i < tokens.length) {
      const token = tokens[i];
      if (/[a-zA-Z]/.test(token)) {
        cmd = token;
        i += 1;
        if (cmd === "Z" || cmd === "z") {
          out.push(["Z"]);
          cx = sx;
          cy = sy;
        }
        continue;
      }
      const relative = cmd === cmd.toLowerCase();
      const ox = relative ? cx : 0;
      const oy = relative ? cy : 0;
      switch (cmd.toUpperCase()) {
        case "M": {
          const x = next() + ox;
          const y = next() + oy;
          out.push(["M", x, y]);
          cx = x;
          cy = y;
          sx = x;
          sy = y;
          cmd = relative ? "l" : "L";
          break;
        }
        case "L": {
          const x = next() + ox;
          const y = next() + oy;
          out.push(["L", x, y]);
          cx = x;
          cy = y;
          break;
        }
        case "H": {
          const x = next() + ox;
          out.push(["L", x, cy]);
          cx = x;
          break;
        }
        case "V": {
          const y = next() + oy;
          out.push(["L", cx, y]);
          cy = y;
          break;
        }
        case "Q": {
          const qx = next() + ox;
          const qy = next() + oy;
          const x = next() + ox;
          const y = next() + oy;
          out.push(["Q", qx, qy, x, y]);
          cx = x;
          cy = y;
          break;
        }
        case "C": {
          const c1x = next() + ox;
          const c1y = next() + oy;
          const c2x = next() + ox;
          const c2y = next() + oy;
          const x = next() + ox;
          const y = next() + oy;
          out.push(["C", c1x, c1y, c2x, c2y, x, y]);
          cx = x;
          cy = y;
          break;
        }
        default:
          i += 1;
          break;
      }
    }
    return out;
  }

  /* ---------------------------------------------------- canvas op recorder */

  function makeGradient(real, x0, y0, x1, y1) {
    return {
      __gradient: true,
      real: real,
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      stops: [],
      addColorStop: function (offset, color) {
        this.stops.push([offset, color]);
        real.addColorStop(offset, color);
      },
    };
  }

  function paintOf(style) {
    return style && style.__gradient ? style.real : style;
  }

  function hexToRgb(hex) {
    let raw = String(hex == null ? "#000000" : hex).replace("#", "").trim();
    if (raw.length === 3) raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
    const value = parseInt(raw, 16);
    if (!isFinite(value) || raw.length < 6) return [0, 0, 0];
    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
  }

  function parseFont(font) {
    const match = /^\s*(\d+)\s+([\d.]+)px/.exec(String(font || ""));
    if (!match) return { weight: 400, size: 16 };
    return { weight: parseInt(match[1], 10) || 400, size: parseFloat(match[2]) || 16 };
  }

  /* Mirrors the calls paintPage() makes so the same layout can be replayed as
     PDF operators; it draws to the real canvas and records every stroke. */
  function CanvasRecorder(base) {
    this.base = base;
    this.ops = [];
    this.stack = [];
    this.path = [];
    this.font = "400 16px sans-serif";
    this.fillStyle = "#000000";
    this.textAlign = "left";
    this.textBaseline = "alphabetic";
    this.letterSpacing = "0px";
  }

  CanvasRecorder.prototype.save = function () {
    this.stack.push({
      font: this.font,
      fillStyle: this.fillStyle,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      letterSpacing: this.letterSpacing,
    });
    this.base.save();
  };

  CanvasRecorder.prototype.restore = function () {
    const state = this.stack.pop();
    if (state) {
      this.font = state.font;
      this.fillStyle = state.fillStyle;
      this.textAlign = state.textAlign;
      this.textBaseline = state.textBaseline;
      this.letterSpacing = state.letterSpacing;
    }
    this.base.restore();
  };

  CanvasRecorder.prototype.scale = function (x, y) {
    this.base.scale(x, y);
  };

  CanvasRecorder.prototype.createLinearGradient = function (x0, y0, x1, y1) {
    return makeGradient(this.base.createLinearGradient(x0, y0, x1, y1), x0, y0, x1, y1);
  };

  CanvasRecorder.prototype.beginPath = function () {
    this.path = [];
    this.base.beginPath();
  };

  CanvasRecorder.prototype.moveTo = function (x, y) {
    this.path.push(["M", x, y]);
    this.base.moveTo(x, y);
  };

  CanvasRecorder.prototype.lineTo = function (x, y) {
    this.path.push(["L", x, y]);
    this.base.lineTo(x, y);
  };

  CanvasRecorder.prototype.quadraticCurveTo = function (cx, cy, x, y) {
    this.path.push(["Q", cx, cy, x, y]);
    this.base.quadraticCurveTo(cx, cy, x, y);
  };

  CanvasRecorder.prototype.closePath = function () {
    this.path.push(["Z"]);
    this.base.closePath();
  };

  CanvasRecorder.prototype.fill = function () {
    if (this.path.length) this.ops.push({ t: "path", path: this.path.slice(), fill: this.fillStyle });
    this.base.fillStyle = paintOf(this.fillStyle);
    this.base.fill();
  };

  CanvasRecorder.prototype.fillRect = function (x, y, w, h) {
    this.ops.push({ t: "rect", x: x, y: y, w: w, h: h, fill: this.fillStyle });
    this.base.fillStyle = paintOf(this.fillStyle);
    this.base.fillRect(x, y, w, h);
  };

  CanvasRecorder.prototype.drawImage = function (image, x, y, w, h) {
    this.ops.push({ t: "image", image: image, x: x, y: y, w: w, h: h });
    this.base.drawImage(image, x, y, w, h);
  };

  CanvasRecorder.prototype.fillText = function (text, x, y) {
    const font = parseFont(this.font);
    this.ops.push({
      t: "text",
      text: String(text),
      x: x,
      y: y,
      size: font.size,
      weight: font.weight,
      color: this.fillStyle,
      align: this.textAlign || "left",
      baseline: this.textBaseline || "alphabetic",
      spacing: parseFloat(this.letterSpacing) || 0,
    });
    /* The recorded canvas is also the one shown in the viewer, so the text
       state has to reach the real context as well: without it every run was
       painted with the default font, left aligned, and spilled out of the
       page margins. */
    this.base.save();
    this.base.font = this.font;
    this.base.fillStyle = paintOf(this.fillStyle);
    this.base.textAlign = this.textAlign || "left";
    this.base.textBaseline = this.textBaseline || "alphabetic";
    try {
      this.base.letterSpacing = this.letterSpacing || "0px";
    } catch (err) {
      /* older browsers: ignore */
    }
    this.base.fillText(String(text), x, y);
    this.base.restore();
  };

  CanvasRecorder.prototype.measureText = function (text) {
    /* wrapLines() and fitText() set the font here before measuring, so the
       real context has to see that font too or the recorded page would wrap
       and truncate at a different width than the preview. */
    this.base.save();
    this.base.font = this.font;
    try {
      this.base.letterSpacing = this.letterSpacing || "0px";
    } catch (err) {
      /* older browsers: ignore */
    }
    const metrics = this.base.measureText(String(text));
    this.base.restore();
    return metrics;
  };

  /* ------------------------------------------------------------ pdf replay */

  const PDF_W = 595.28;
  const PDF_H = 841.89;

  function pdfNumber(value) {
    return String(Math.round(value * 100) / 100);
  }

  function pdfColorNumber(value) {
    return String(Math.round(value * 1000) / 1000);
  }

  function pdfContent(ops, shaper, imageNames) {
    const out = [
      "q " +
        (PDF_W / PAGE_W).toFixed(6) +
        " 0 0 " +
        (PDF_H / PAGE_H).toFixed(6) +
        " 0 0 cm",
    ];

    const shadings = [];
    const shadingNames = new Map();

    function color(rgb) {
      return pdfColorNumber(rgb[0]) + " " + pdfColorNumber(rgb[1]) + " " + pdfColorNumber(rgb[2]) + " rg";
    }

    function rgbList(rgb) {
      return pdfColorNumber(rgb[0]) + " " + pdfColorNumber(rgb[1]) + " " + pdfColorNumber(rgb[2]);
    }

    /* Gradients become axial shadings: no seams at any zoom, unlike strips. */
    function shadingDict(gradient) {
      const stops = (gradient.stops || []).slice();
      if (stops.length < 2) return null;
      stops.sort(function (a, b) {
        return a[0] - b[0];
      });
      const clean = [];
      stops.forEach(function (stop) {
        const offset = Math.min(1, Math.max(0, Number(stop[0]) || 0));
        const rgb = hexToRgb(stop[1]);
        if (clean.length && clean[clean.length - 1][0] === offset) clean[clean.length - 1] = [offset, rgb];
        else clean.push([offset, rgb]);
      });
      if (clean.length === 1) clean.push([1, clean[0][1]]);

      const functions = [];
      const bounds = [];
      const encode = [];
      for (let i = 1; i < clean.length; i += 1) {
        functions.push(
          "<< /FunctionType 2 /Domain [0 1] /C0 [" +
            rgbList(clean[i - 1][1]) +
            "] /C1 [" +
            rgbList(clean[i][1]) +
            "] /N 1 >>"
        );
        encode.push("0 1");
        if (i < clean.length - 1) bounds.push(String(clean[i][0]));
      }

      const fn =
        functions.length === 1
          ? functions[0]
          : "<< /FunctionType 3 /Domain [0 1] /Functions [" +
            functions.join(" ") +
            "] /Bounds [" +
            bounds.join(" ") +
            "] /Encode [" +
            encode.join(" ") +
            "] >>";

      return (
        "<< /ShadingType 2 /ColorSpace /DeviceRGB /Coords [" +
        pdfNumber(gradient.x0) +
        " " +
        pdfNumber(PAGE_H - gradient.y0) +
        " " +
        pdfNumber(gradient.x1) +
        " " +
        pdfNumber(PAGE_H - gradient.y1) +
        "] /Function " +
        fn +
        " /Extend [true true] >>"
      );
    }

    function shadingName(gradient) {
      if (shadingNames.has(gradient)) return shadingNames.get(gradient);
      const dict = shadingDict(gradient);
      const name = dict ? "Sh" + shadings.length : null;
      if (dict) shadings.push(dict);
      shadingNames.set(gradient, name);
      return name;
    }

    /* Coordinates arrive as page pixels with y pointing down; the page matrix
       already scales them, so only the vertical axis has to be flipped. */
    function solidRect(x, y, w, h, rgb) {
      if (w <= 0 || h <= 0) return;
      out.push(
        color(rgb) +
          " " +
          pdfNumber(x) +
          " " +
          pdfNumber(PAGE_H - y - h) +
          " " +
          pdfNumber(w) +
          " " +
          pdfNumber(h) +
          " re f"
      );
    }

    function rectShape(x, y, w, h) {
      return (
        pdfNumber(x) +
        " " +
        pdfNumber(PAGE_H - y - h) +
        " " +
        pdfNumber(w) +
        " " +
        pdfNumber(h) +
        " re"
      );
    }

    function gradientFill(shape, name) {
      out.push("q " + shape + " W n /" + name + " sh Q");
    }

    function pathString(cmds, dx, dy, scale, flip) {
      const parts = [];
      let px = 0;
      let py = 0;

      function point(x, y) {
        return pdfNumber(dx + x * scale) + " " + pdfNumber(dy + (flip ? -y * scale : y * scale));
      }

      cmds.forEach(function (cmd) {
        const kind = cmd[0];
        if (kind === "M") {
          px = cmd[1];
          py = cmd[2];
          parts.push(point(px, py) + " m");
        } else if (kind === "L") {
          px = cmd[1];
          py = cmd[2];
          parts.push(point(px, py) + " l");
        } else if (kind === "Q") {
          const qx = cmd[1];
          const qy = cmd[2];
          const ex = cmd[3];
          const ey = cmd[4];
          parts.push(
            point(px + (2 / 3) * (qx - px), py + (2 / 3) * (qy - py)) +
              " " +
              point(ex + (2 / 3) * (qx - ex), ey + (2 / 3) * (qy - ey)) +
              " " +
              point(ex, ey) +
              " c"
          );
          px = ex;
          py = ey;
        } else if (kind === "C") {
          parts.push(
            point(cmd[1], cmd[2]) + " " + point(cmd[3], cmd[4]) + " " + point(cmd[5], cmd[6]) + " c"
          );
          px = cmd[5];
          py = cmd[6];
        } else {
          parts.push("h");
        }
      });
      return parts.join(" ");
    }

    function fillPath(cmds, style) {
      const body = pathString(cmds, 0, PAGE_H, 1, true);
      if (!body) return;
      if (style && style.__gradient) {
        const name = shadingName(style);
        if (name) {
          gradientFill(body, name);
          return;
        }
      }
      const flat = style && style.__gradient ? (style.stops[0] ? style.stops[0][1] : "#000000") : style;
      out.push(color(hexToRgb(flat)) + " " + body + " f");
    }

    /* An embedded picture, placed in page pixels like every other shape. */
    function drawImage(op) {
      const name = imageNames && imageNames.get(op.image);
      if (!name) return;
      out.push(
        "q " +
          pdfNumber(op.w) +
          " 0 0 " +
          pdfNumber(op.h) +
          " " +
          pdfNumber(op.x) +
          " " +
          pdfNumber(PAGE_H - op.y - op.h) +
          " cm /" +
          name +
          " Do Q"
      );
    }

    function drawText(op) {
      const family = familyFor(shaper, op.weight);
      const run = shapeRun(shaper, op.text, family);
      const scale = op.size / run.upem;
      const spacing = op.spacing || 0;

      let width = 0;
      run.glyphs.forEach(function (glyph) {
        width += glyph.advance * scale + spacing;
      });

      let x = op.x;
      if (op.align === "center") x -= width / 2;
      else if (op.align === "right" || op.align === "end") x -= width;

      let baseline = PAGE_H - op.y;
      if (op.baseline === "middle") baseline -= op.size * 0.34;
      else if (op.baseline === "top" || op.baseline === "hanging") baseline -= op.size * 0.78;

      const glyphs = [];
      let pen = x;
      run.glyphs.forEach(function (glyph) {
        const outline = glyphOutline(shaper, family, glyph.gid);
        if (outline.length) {
          glyphs.push(
            pathString(outline, pen + glyph.dx * scale, baseline + glyph.dy * scale, scale, false)
          );
        }
        pen += glyph.advance * scale + spacing;
      });
      if (!glyphs.length) return;
      out.push(color(hexToRgb(op.color)) + " " + glyphs.join(" ") + " f");
    }

    ops.forEach(function (op) {
      if (!op) return;
      if (op.t === "rect") {
        if (op.fill && op.fill.__gradient) {
          const name = shadingName(op.fill);
          if (name) gradientFill(rectShape(op.x, op.y, op.w, op.h), name);
          else solidRect(op.x, op.y, op.w, op.h, hexToRgb(op.fill.stops[0] ? op.fill.stops[0][1] : "#000000"));
        } else {
          solidRect(op.x, op.y, op.w, op.h, hexToRgb(op.fill));
        }
      } else if (op.t === "path") {
        fillPath(op.path, op.fill);
      } else if (op.t === "image") {
        drawImage(op);
      } else if (op.t === "text") {
        drawText(op);
      }
    });

    out.push("Q");
    return { content: out.join("\n"), shadings: shadings };
  }

  function assembleTextPdf(content, shadings, images) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(content);
    return deflateBytes(bytes).then(function (deflated) {
      const stream = deflated && deflated.length ? deflated : bytes;
      const filter = stream === bytes ? "" : " /Filter /FlateDecode";
      const parts = [];
      const offsets = {};
      const resources = (shadings || []).map(function (dict, index) {
        return { number: 6 + index, dict: dict };
      });
      const pictures = (images || []).map(function (image, index) {
        return { number: 6 + resources.length + index, image: image };
      });
      let size = 6 + resources.length + pictures.length;
      let total = 0;

      function put(chunk) {
        const data = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
        parts.push(data);
        total += data.length;
      }

      function startObject(number) {
        offsets[number] = total;
        put(number + " 0 obj\n");
      }

      put("%PDF-1.4\n");
      put(new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

      startObject(1);
      put("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
      startObject(2);
      put("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
      startObject(3);
      put(
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " +
          PDF_W +
          " " +
          PDF_H +
          "] /Resources << /ProcSet [/PDF]" +
          (resources.length
            ? " /Shading << " +
              resources
                .map(function (item) {
                  return "/Sh" + (item.number - 6) + " " + item.number + " 0 R";
                })
                .join(" ") +
              " >>"
            : "") +
          (pictures.length
            ? " /XObject << " +
              pictures
                .map(function (item) {
                  return "/" + item.image.name + " " + item.number + " 0 R";
                })
                .join(" ") +
              " >>"
            : "") +
          " >> /Contents 4 0 R >>\nendobj\n"
      );
      startObject(4);
      put("<< /Length " + stream.length + filter + " >>\nstream\n");
      put(stream);
      put("\nendstream\nendobj\n");
      startObject(5);
      put("<< /Producer (Hongkham Portfolio quotation builder) >>\nendobj\n");
      resources.forEach(function (item) {
        startObject(item.number);
        put(item.dict + "\nendobj\n");
      });
      pictures.forEach(function (item) {
        startObject(item.number);
        put(
          "<< /Type /XObject /Subtype /Image /Width " +
            item.image.width +
            " /Height " +
            item.image.height +
            " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter " +
            item.image.filter +
            " /Length " +
            item.image.bytes.length +
            " >>\nstream\n"
        );
        put(item.image.bytes);
        put("\nendstream\nendobj\n");
      });

      const xrefStart = total;
      let xref = "xref\n0 " + size + "\n0000000000 65535 f \n";
      for (let i = 1; i < size; i += 1) {
        xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
      }
      put(xref);
      put("trailer\n<< /Size " + size + " /Root 1 0 R /Info 5 0 R >>\nstartxref\n" + xrefStart + "\n%%EOF\n");

      return new Blob(parts, { type: "application/pdf" });
    });
  }

  /* The artwork is rasterised once, well above the size it prints at. */
  function imageForPdf(img) {
    const w = img.naturalWidth || img.width || 1;
    const h = img.naturalHeight || img.height || 1;
    const k = Math.min(1, 480 / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * k));
    canvas.height = Math.max(1, Math.round(h * k));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return imageFromCanvas(canvas).then(function (image) {
      return {
        name: "",
        bytes: image.bytes,
        filter: image.filter,
        width: canvas.width,
        height: canvas.height,
      };
    });
  }

  function vectorPdf(canvas) {
    const ops = canvas && canvas.__ops;
    if (!ops || !ops.length) return Promise.resolve(null);
    const used = [];
    ops.forEach(function (op) {
      if (op && op.t === "image" && op.image && used.indexOf(op.image) === -1) used.push(op.image);
    });
    return Promise.all([
      loadShaper(),
      Promise.all(
        used.map(function (img) {
          return imageForPdf(img).catch(function () {
            return null;
          });
        })
      ),
    ]).then(function (result) {
      const shaper = result[0];
      const pictures = [];
      const names = new Map();
      result[1].forEach(function (image, index) {
        if (!image) return;
        image.name = "Im" + pictures.length;
        names.set(used[index], image.name);
        pictures.push(image);
      });
      const page = pdfContent(ops, shaper, names);
      return assembleTextPdf(page.content, page.shadings, pictures);
    });
  }


  function base64ToBytes(dataUrl) {
    const base64 = String(dataUrl).split(",")[1] || "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  /* Lossless PDF image: raw RGB rows filtered with the PNG "Up" predictor and
     deflated (FlateDecode). JPEG stays as a fallback for browsers without
     CompressionStream; its artifacts are what made small text look soft. */
  function rgbRowsWithPredictor(rgba, width, height) {
    const stride = width * 3;
    const out = new Uint8Array((stride + 1) * height);
    let prev = new Uint8Array(stride);
    let o = 0;
    for (let y = 0; y < height; y += 1) {
      out[o] = 2; /* PNG filter type "Up" */
      o += 1;
      const row = new Uint8Array(stride);
      const base = y * width * 4;
      for (let x = 0; x < width; x += 1) {
        const s = base + x * 4;
        const d = x * 3;
        row[d] = rgba[s];
        row[d + 1] = rgba[s + 1];
        row[d + 2] = rgba[s + 2];
      }
      for (let i = 0; i < stride; i += 1) out[o + i] = (row[i] - prev[i]) & 0xff;
      o += stride;
      prev = row;
    }
    return out;
  }

  function deflateBytes(bytes) {
    if (typeof CompressionStream !== "function") return Promise.resolve(null);
    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate"));
      return new Response(stream)
        .arrayBuffer()
        .then(function (buffer) {
          return new Uint8Array(buffer);
        })
        .catch(function () {
          return null;
        });
    } catch (err) {
      return Promise.resolve(null);
    }
  }

  function imageFromCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return deflateBytes(rgbRowsWithPredictor(rgba, canvas.width, canvas.height)).then(function (deflated) {
      if (deflated && deflated.length) {
        return {
          bytes: deflated,
          filter:
            "/FlateDecode /DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns " +
            canvas.width +
            " >>",
        };
      }
      return {
        bytes: base64ToBytes(canvas.toDataURL("image/jpeg", 0.95)),
        filter: "/DCTDecode",
      };
    });
  }

  function buildPdf(image, width, height) {
    const pageW = 595.28;
    const pageH = 841.89;
    const encoder = new TextEncoder();
    const content = "q " + pageW + " 0 0 " + pageH + " 0 0 cm /Im0 Do Q\n";
    const parts = [];
    const offsets = {};
    let total = 0;

    function put(bytes) {
      parts.push(bytes);
      total += bytes.length;
    }
    function putText(text) {
      put(encoder.encode(text));
    }
    function startObject(n) {
      offsets[n] = total;
      putText(n + " 0 obj\n");
    }

    putText("%PDF-1.4\n");
    put(new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

    startObject(1);
    putText("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    startObject(2);
    putText("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    startObject(3);
    putText(
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " +
        pageW +
        " " +
        pageH +
        "] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n"
    );
    startObject(4);
    putText(
      "<< /Type /XObject /Subtype /Image /Width " +
        width +
        " /Height " +
        height +
        " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter " +
        image.filter +
        " /Length " +
        image.bytes.length +
        " >>\nstream\n"
    );
    put(image.bytes);
    putText("\nendstream\nendobj\n");
    startObject(5);
    putText("<< /Length " + encoder.encode(content).length + " >>\nstream\n" + content + "endstream\nendobj\n");

    const xrefStart = total;
    let xref = "xref\n0 6\n0000000000 65535 f \n";
    for (let i = 1; i <= 5; i += 1) xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    putText(xref);
    putText("trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xrefStart + "\n%%EOF\n");

    return new Blob(parts, { type: "application/pdf" });
  }

  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 4000);
  }

  function ensureFonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const sample = "ສະບາຍດີ ໃບສະເໜີລາຄາ";
    return Promise.allSettled
      ? Promise.allSettled([
          document.fonts.load('400 20px "Noto Sans Lao"', sample),
          document.fonts.load('600 20px "Noto Sans Lao"', sample),
          document.fonts.load('700 20px "Noto Sans Lao"', sample),
        ]).catch(function () {
          return null;
        })
      : Promise.resolve();
  }

  function setStatus(message, isError) {
    const el = $("quote-status");
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("is-error", Boolean(isError));
  }

  /* -------------------------------------------------- download progress */

  /* The build shows up in the corner panel rather than in the button: the label
     says what is happening, the line fills with the percentage, and the panel
     stays above the viewer so the click always answers. */
  let downloadBusy = false;
  let downloadHide = 0;

  function downloadUI() {
    const toast = $("quote-dl-toast");
    const text = toast ? toast.querySelector(".dl-toast-text") : null;
    const pct = toast ? toast.querySelector(".dl-toast-pct") : null;
    if (!toast || !text || !pct) return null;
    return { toast: toast, text: text, pct: pct };
  }

  function paintProgress(ui, percent, text) {
    const value = Math.max(0, Math.min(100, percent));
    ui.toast.style.setProperty("--dl", value.toFixed(0) + "%");
    ui.pct.textContent = Math.round(value) + "%";
    if (text) ui.text.textContent = text;
  }

  function hideToast(ui, delay) {
    if (!ui) return;
    window.clearTimeout(downloadHide);
    downloadHide = window.setTimeout(function () {
      ui.toast.classList.remove("is-open", "is-busy", "is-done", "is-error");
      paintProgress(ui, 0, "ກຳລັງດາວໂຫຼດ PDF");
    }, delay || 0);
  }

  function startProgress(ui) {
    if (!ui) return null;
    window.clearTimeout(downloadHide);
    downloadHide = 0;
    ui.toast.classList.remove("is-done", "is-error");
    ui.toast.classList.add("is-open", "is-busy");
    let value = 8;
    paintProgress(ui, value, "ກຳລັງດາວໂຫຼດ PDF");
    const timer = window.setInterval(function () {
      if (value >= 92) return;
      value = Math.min(92, value + Math.max(0.8, (92 - value) * 0.14));
      paintProgress(ui, value);
    }, 140);
    return {
      step: function (percent) {
        if (percent <= value) return;
        value = percent;
        paintProgress(ui, value);
      },
      stop: function () {
        window.clearInterval(timer);
      },
    };
  }

  function endProgress(ui, ok) {
    if (!ui) return;
    ui.toast.classList.remove("is-busy");
    if (ok) {
      paintProgress(ui, 100, "ດາວໂຫຼດສຳເລັດ");
      ui.toast.classList.add("is-done");
      hideToast(ui, 2800);
      return;
    }
    paintProgress(ui, 0, "ດາວໂຫຼດບໍ່ສຳເລັດ");
    ui.toast.classList.add("is-error");
    hideToast(ui, 3600);
  }
  async function download(s) {
    if (downloadBusy) return;
    const ui = downloadUI();
    if (!s.name && !s.company) {
      setStatus("ກະລຸນາຕື່ມຊື່ລູກຄ້າ ຫຼື ບໍລິສັດ ກ່ອນດາວໂຫຼດ", true);
      const field = $("q-name");
      if (field) field.focus();
      return;
    }

    downloadBusy = true;
    const progress = startProgress(ui);
    let ok = false;
    setStatus("ກຳລັງສ້າງໄຟລ໌ PDF...", false);
    try {
      await Promise.all([ensureFonts(), loadLogo()]);
      if (progress) progress.step(24);
      const canvas = paintPage(s);
      if (progress) progress.step(36);
      let blob = await vectorPdf(canvas).catch(function (err) {
        console.warn("vector pdf failed, falling back to a raster page", err);
        return null;
      });
      if (!blob) {
        const image = await imageFromCanvas(canvas);
        blob = buildPdf(image, canvas.width, canvas.height);
      }
      if (progress) progress.step(96);
      saveBlob(blob, "quotation-" + s.no + ".pdf");
      ok = true;
      setStatus("ດາວໂຫຼດໃບສະເໜີລາຄາແລ້ວ: quotation-" + s.no + ".pdf", false);
    } catch (err) {
      setStatus("ສ້າງໄຟລ໌ PDF ບໍ່ສຳເລັດ ກະລຸນາລອງອີກເທື່ອ", true);
    } finally {
      if (progress) progress.stop();
      endProgress(ui, ok);
      downloadBusy = false;
    }
  }

  /* --------------------------------------------------------------- viewer */

  const VIEWER_MIN = 0.5;
  const VIEWER_MAX = 2.5;
  const VIEWER_STEP = 0.15;

  const viewer = { open: false, canvas: null, fit: 0, zoom: 1, lastFocus: null, state: null };

  function viewerBody() {
    return $("quote-viewer-body");
  }

  function fitWidth() {
    const body = viewerBody();
    if (!body) return 700;
    const pad = window.innerWidth <= 640 ? 24 : 40;
    return Math.max(260, Math.min(980, body.clientWidth - pad));
  }

  function applyZoom() {
    if (!viewer.canvas) return;
    viewer.canvas.style.width = Math.round(viewer.fit * viewer.zoom) + "px";
    const label = $("quote-zoom");
    if (label) label.textContent = Math.round(viewer.zoom * 100) + "%";
    const out = $("quote-zoom-out");
    const plus = $("quote-zoom-in");
    if (out) out.disabled = viewer.zoom <= VIEWER_MIN + 0.001;
    if (plus) plus.disabled = viewer.zoom >= VIEWER_MAX - 0.001;
  }

  function zoomBy(step) {
    const next = Math.round((viewer.zoom + step) * 100) / 100;
    viewer.zoom = Math.min(VIEWER_MAX, Math.max(VIEWER_MIN, next));
    applyZoom();
  }

  function closeViewer() {
    const root = $("quote-viewer");
    if (!root || !viewer.open) return;
    viewer.open = false;
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const stage = $("quote-viewer-stage");
    if (stage) stage.innerHTML = "";
    viewer.canvas = null;
    viewer.state = null;
    viewer.zoom = 1;
    if (viewer.lastFocus && viewer.lastFocus.focus) viewer.lastFocus.focus();
    viewer.lastFocus = null;
  }

  async function openViewer(s) {
    const root = $("quote-viewer");
    const stage = $("quote-viewer-stage");
    const trigger = $("quote-view");
    if (!root || !stage) return;

    if (!s.name && !s.company) {
      setStatus("ກະລຸນາຕື່ມຊື່ລູກຄ້າ ຫຼື ບໍລິສັດ ກ່ອນເບິ່ງໃບສະເໜີລາຄາ", true);
      const field = $("q-name");
      if (field) field.focus();
      return;
    }

    if (trigger) trigger.classList.add("is-loading");
    setStatus("ກຳລັງສ້າງໃບສະເໜີລາຄາ...", false);
    try {
      await Promise.all([ensureFonts(), loadLogo()]);
      const canvas = paintPage(s);
      viewer.state = s;
      viewer.lastFocus = document.activeElement;
      viewer.canvas = canvas;
      viewer.zoom = 1;
      stage.innerHTML = "";
      stage.appendChild(canvas);
      const meta = $("quote-viewer-meta");
      if (meta) {
        meta.textContent = "ເລກທີ " + s.no + " · " + s.dateText + " · " + money(s.total) + " ₭";
      }
      root.classList.add("open");
      root.setAttribute("aria-hidden", "false");
      viewer.open = true;
      document.body.style.overflow = "hidden";
      viewer.fit = fitWidth();
      applyZoom();
      setStatus("", false);
      const body = viewerBody();
      if (body) body.scrollTop = 0;
      const close = $("quote-viewer-close");
      if (close) close.focus();
    } catch (err) {
      setStatus("ສ້າງໃບສະເໜີລາຄາບໍ່ສຳເລັດ ກະລຸນາລອງອີກເທື່ອ", true);
    } finally {
      if (trigger) trigger.classList.remove("is-loading");
    }
  }

  function initViewer() {
    const root = $("quote-viewer");
    if (!root) return;

    const viewButton = $("quote-view");
    if (viewButton) {
      viewButton.addEventListener("click", function () {
        openViewer(collect());
      });
    }

    /* the preview card itself is the second way in to the full page */
    const card = $("quote-doc");
    if (card) {
      card.addEventListener("click", function () {
        openViewer(collect());
      });
      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openViewer(collect());
      });
    }

    const closeButton = $("quote-viewer-close");
    if (closeButton) closeButton.addEventListener("click", closeViewer);

    root.addEventListener("click", function (event) {
      if (event.target === root) closeViewer();
    });

    const modalDownload = $("quote-download-2");
    if (modalDownload) {
      modalDownload.addEventListener("click", function () {
        download(viewer.state || collect());
      });
    }

    const zoomOut = $("quote-zoom-out");
    if (zoomOut) zoomOut.addEventListener("click", function () { zoomBy(-VIEWER_STEP); });

    const zoomIn = $("quote-zoom-in");
    if (zoomIn) zoomIn.addEventListener("click", function () { zoomBy(VIEWER_STEP); });

    document.addEventListener("keydown", function (event) {
      if (!viewer.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      }
    });

    window.addEventListener("resize", function () {
      if (!viewer.open || !viewer.canvas) return;
      const next = fitWidth();
      if (next === viewer.fit) return;
      viewer.fit = next;
      applyZoom();
    });
  }

  function init() {
    const form = $("quote-form");
    const button = $("quote-download");
    if (!form || !$("quote-doc")) return;

    let frame = 0;
    function refresh() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        const state = collect();
        if (viewer.open) viewer.state = state;
        renderPreview(state);
      });
    }

    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });

    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
      }
    });

    if (button) {
      button.addEventListener("click", function () {
        download(collect());
      });
    }

    initViewer();

    loadLogo().then(function () {
      renderPreview(collect());
    });
    /* the first paint can land before the webfont is ready */
    ensureFonts()
      .then(function () {
        renderPreview(collect());
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
