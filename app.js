/* global EXPERIENCE, SKILL_GROUPS, CERTIFICATES, PROJECTS, FILTERS */

(function () {
  "use strict";

  /* Certificates are listed in chronological order (oldest first). */
  CERTIFICATES.sort((a, b) => String(a.issued || "").localeCompare(String(b.issued || "")));

  const ICON = {
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    pin:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    spark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    chevron:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    plus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    zoom:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    server:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 6.5h.01M6 17.5h.01"/></svg>',
    net:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5 6.5 16.8M12 11.5l5.5 5.3"/></svg>',
    code:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 4-6-4-6M8 6l-4 6 4 6"/></svg>',
    cloud:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.3 10.5A3.75 3.75 0 0 0 7 19h10.5Z"/></svg>',
    pen:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7-3-3-7 7v3h3Z"/><path d="M18 5l1 1"/><path d="M4 20h16"/></svg>',
    cpu:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/></svg>',
    chat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.4-5A8 8 0 1 1 21 12Z"/></svg>',
    db:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="m8.4 10.7 7.2-3.4M8.4 13.3l7.2 3.4"/></svg>',
    window:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01"/></svg>',
    terminal:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 10 2.5 2L7 14M12.5 14H17"/></svg>',
    gear:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/></svg>',
    megaphone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M14 8a5 5 0 0 1 0 8M17.5 5a9 9 0 0 1 0 14"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    globe:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/></svg>',
    award:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-2 8 5.5-3 5.5 3-2-8"/></svg>',
    layers:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
    briefcase:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
    questions:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/></svg>',
    gamepad:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><path d="M7 10v4M5 12h4M16 11h.01M18.5 13.5h.01"/></svg>',
  };

  /* Country flags for certificates, drawn inline so they render on every OS. */
  const FLAG = {
    la: '<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#CE1126"/><rect y="5" width="30" height="10" fill="#002868"/><circle cx="15" cy="10" r="3.4" fill="#fff"/></svg>',
    th: '<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#A51931"/><rect y="3.3" width="30" height="13.4" fill="#F4F5F8"/><rect y="6.7" width="30" height="6.6" fill="#2D2A4A"/></svg>',
    kh: '<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#032EA1"/><rect y="5" width="30" height="10" fill="#E00025"/><path d="M15 6.4l1.2 1.9h-2.4zM11.5 7.4l1.7 1.5h-3.4zM18.5 7.4l1.7 1.5h-3.4zM10.2 9.8h9.6v1.8h-9.6z" fill="#fff"/></svg>',
    vn: '<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#DA251D"/><path d="M15 4.6l1.55 4.77h5.02l-4.06 2.95 1.55 4.77L15 14.14l-4.06 2.95 1.55-4.77-4.06-2.95h5.02z" fill="#FF0"/></svg>',
  };

  /* Certificates without a stated country default to the Lao flag. */
  function flagHtml(flag) {
    const codes = Array.isArray(flag) ? flag : flag ? [flag] : [];
    const valid = codes.filter((code) => FLAG[code]);
    return (valid.length ? valid : ["la"])
      .map((code) => `<i class="cert-flag">${FLAG[code]}</i>`)
      .join("");
  }

  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[ch]);

  /* Project tech chips: each label gets its own hue and a fitting icon. */
  const TECH_HUES = [8, 30, 48, 88, 128, 155, 178, 196, 215, 238, 268, 295, 325];

  const TECH_ICON_RULES = [
    [/\bai\b|ml|tensorflow|scikit|opencv|langchain|llm|openai|gpt|dialogflow|vision|ocr|prompt|fairness|model cards|pandas/i, "spark"],
    [/sql|database|record|vector|data/i, "db"],
    [/server|backup|vpn|kubernetes|docker|mqtt|node-red|home assistant|remote desktop|iot/i, "server"],
    [/network|cisco|telecom|infrastructure|monitoring|camera|rfid|gps/i, "net"],
    [/report|crystal|power bi|dashboard|presentation/i, "layers"],
    [/web|node\.js|fastapi|python|visual basic|api|selenium|mobile/i, "code"],
    [/office|excel|word|powerpoint|accounting|payroll|billing|budget/i, "window"],
    [/photoshop|illustrator|indesign|design/i, "pen"],
    [/security|auth|face recognition|governance|risk/i, "shield"],
    [/school|education|student|training|curriculum|knowledge|e-learning/i, "briefcase"],
    [/hospital|patient|medical|safety|incident|maintenance|inventory|warehouse|stock|payment|e-commerce/i, "gear"],
  ];

  function techIcon(label) {
    const rule = TECH_ICON_RULES.find(([pattern]) => pattern.test(label));
    return ICON[rule ? rule[1] : "gear"];
  }

  /* Deterministic hue per label, nudged so chips on the same card never share one. */
  function techChips(list) {
    const used = new Set();
    return list
      .map((label) => {
        const text = String(label);
        let seed = 0;
        for (let i = 0; i < text.length; i += 1) seed = (seed * 31 + text.charCodeAt(i)) % 997;
        let index = seed % TECH_HUES.length;
        while (used.has(TECH_HUES[index])) index = (index + 1) % TECH_HUES.length;
        used.add(TECH_HUES[index]);
        return `<span class="tech" style="--t: ${TECH_HUES[index]}" title="${esc(text)}"><i class="tech-ico">${techIcon(
          text
        )}</i>${esc(text)}</span>`;
      })
      .join("");
  }

  /* ---------------- experience artwork (built from card data) ---------------- */

  const EXP_THEMES = {
    ai: { a: "#4338ca", b: "#0891b2", tint: "#7dd3fc" },
    cloud: { a: "#0369a1", b: "#4f46e5", tint: "#93c5fd" },
    network: { a: "#0e7490", b: "#4338ca", tint: "#67e8f9" },
    data: { a: "#6d28d9", b: "#0e7490", tint: "#c4b5fd" },
    security: { a: "#047857", b: "#155e75", tint: "#6ee7b7" },
    hardware: { a: "#b45309", b: "#9f1239", tint: "#fdba74" },
    gaming: { a: "#9d174d", b: "#6d28d9", tint: "#f9a8d4" },
    mentor: { a: "#5b21b6", b: "#0e7490", tint: "#ddd6fe" },
  };

  /* Each card gets the motif of whatever it actually talks about most:
     title words count triple, body words once. */
  const EXP_RULES = {
    mentor: "mentor|workshop|teach|course|knowledge|ສຳມະນາ|ວິທະຍາກອນ",
    gaming: "gaming|game|overclock",
    hardware: "hardware|repair|pc build|performance|cpu|gpu|ຮາດແວ",
    security: "security|cyber|compliance|zero-trust|firewall|safety officer|ຄວາມປອດໄພ",
    data: "database|sql|analytics|dashboard|big data|data|ຂໍ້ມູນ",
    network: "network|vpn|router|switch|infrastructure|lan|wan|wifi|ເຄືອຂ່າຍ",
    cloud: "cloud|azure|aws|virtual|kubernetes|container|m365|office 365",
    ai: "\\bai\\b|machine learning|automation|rpa|chatbot|iot|blockchain",
  };

  const EXP_INSIGHT_ICONS = {
    mentor: "award",
    ai: "spark",
    cloud: "cloud",
    network: "net",
    data: "db",
    security: "shield",
    hardware: "cpu",
    gaming: "gamepad",
  };

  function detectTheme(item) {
    const titleHay = [item.title, item.subtitle].join(" ").toLowerCase();
    const bodyHay = [item.description, item.insights]
      .concat(item.responsibilities || [])
      .join(" ")
      .toLowerCase();
    let best = "ai";
    let bestScore = -1;
    Object.keys(EXP_RULES).forEach((key) => {
      const re = new RegExp(EXP_RULES[key], "g");
      const titleHits = (titleHay.match(re) || []).length;
      const bodyHits = (bodyHay.match(re) || []).length;
      const score = titleHits * 3 + bodyHits;
      if (score > bestScore) {
        bestScore = score;
        best = key;
      }
    });
    return best;
  }

  function artMotif(theme, t) {
    const cx = 450;
    const cy = 500;
    const orbit = `<g fill="none" stroke="url(#ring)" opacity="0.9">
      <circle cx="${cx}" cy="${cy}" r="214" stroke-opacity="0.16" stroke-width="1.2" stroke-dasharray="3 13"/>
      <circle cx="${cx}" cy="${cy}" r="168" stroke-opacity="0.42" stroke-width="1.6" stroke-dasharray="230 95"/>
      <ellipse cx="${cx}" cy="${cy}" rx="250" ry="95" stroke-opacity="0.22" stroke-width="1.4" transform="rotate(-20 ${cx} ${cy})"/>
      <ellipse cx="${cx}" cy="${cy}" rx="250" ry="95" stroke-opacity="0.18" stroke-width="1.4" transform="rotate(26 ${cx} ${cy})"/>
    </g>`;

    const halo = `<circle cx="${cx}" cy="${cy}" r="160" fill="url(#core)" opacity="0.85"/>`;

    if (theme === "mentor") {
      const spokes = [0, 1, 2, 3, 4]
        .map((i) => {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          const x = cx + 210 * Math.cos(ang);
          const y = cy + 190 * Math.sin(ang);
          return `<path d="M${cx} ${cy} ${x.toFixed(0)} ${y.toFixed(0)}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="14" fill="${t}" fill-opacity="0.5" stroke="none"/>`;
        })
        .join("");
      return `${orbit}${halo}<g stroke="url(#wire)" stroke-width="1.8" fill="none">${spokes}</g>
        <circle cx="${cx}" cy="${cy}" r="96" fill="#0b1024" fill-opacity="0.5" stroke="url(#ring)" stroke-width="2.4" filter="url(#g9)"/>
        <circle cx="${cx}" cy="${cy}" r="40" fill="${t}" fill-opacity="0.16" stroke="url(#ring)" stroke-width="1.6"/>`;
    }

    if (theme === "security") {
      return `${orbit}${halo}
        <path d="M${cx} 320 L${cx + 132} 372 v104 c0 96 -66 152 -132 184 c-66 -32 -132 -88 -132 -184 V372 Z" fill="#0b1024" fill-opacity="0.5" stroke="url(#ring)" stroke-width="2.4" filter="url(#g9)"/>
        <path d="M${cx - 44} 512 l32 34 60 -70" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
    }

    if (theme === "data") {
      const db = [0, 1, 2]
        .map((i) => {
          const y = 360 + i * 84;
          return `<ellipse cx="${cx}" cy="${y}" rx="118" ry="34" fill="#0b1024" fill-opacity="0.55" stroke="url(#ring)" stroke-width="1.8"/>
            <path d="M${cx - 118} ${y} v54 a118 34 0 0 0 236 0 v-54" fill="#0b1024" fill-opacity="0.3" stroke="url(#ring)" stroke-width="1.6"/>`;
        })
        .join("");
      return `${orbit}<g filter="url(#g9)">${db}</g>`;
    }

    if (theme === "cloud") {
      return `${orbit}${halo}
        <path d="M${cx - 170} 560 a86 86 0 0 1 14 -170 a116 116 0 0 1 214 -34 a94 94 0 0 1 108 118 a74 74 0 0 1 -40 86 Z" fill="#0b1024" fill-opacity="0.42" stroke="url(#ring)" stroke-width="2.2" filter="url(#g9)"/>
        <path d="M${cx - 120} 610 h240" stroke="${t}" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 12"/>`;
    }

    if (theme === "network") {
      const nodes = [
        [cx - 180, cy - 150],
        [cx + 170, cy - 170],
        [cx + 210, cy + 110],
        [cx - 200, cy + 120],
        [cx - 40, cy - 220],
        [cx + 60, cy + 210],
      ];
      const links = nodes.map(([x, y]) => `<path d="M${cx} ${cy} ${x} ${y}"/>`).join("");
      const dots = nodes
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${t}" fill-opacity="0.6" stroke="none"/>`)
        .join("");
      return `${orbit}<g stroke="url(#wire)" stroke-width="1.6" fill="none">${links}</g>${dots}${halo}
        <circle cx="${cx}" cy="${cy}" r="86" fill="#0b1024" fill-opacity="0.55" stroke="url(#ring)" stroke-width="2.4" filter="url(#g9)"/>`;
    }

    if (theme === "hardware" || theme === "gaming") {
      const fan = (fx) => `<circle cx="${fx}" cy="${cy}" r="62" fill="#0b1024" fill-opacity="0.5" stroke="url(#ring)" stroke-width="2"/>
        <g stroke="${t}" stroke-opacity="0.55" stroke-width="2.4" fill="none">
          <path d="M${fx - 40} ${cy} h80 M${fx} ${cy - 40} v80 M${fx - 28} ${cy - 28} l56 56 M${fx + 28} ${cy - 28} l-56 56"/>
        </g>`;
      return `${orbit}
        <rect x="${cx - 250}" y="${cy - 128}" width="500" height="256" rx="26" fill="#0b1024" fill-opacity="0.45" stroke="url(#ring)" stroke-width="2" filter="url(#g9)"/>
        ${fan(cx - 110)}${fan(cx + 110)}
        <path d="M${cx - 250} ${cy - 80} h-56 M${cx - 250} ${cy} h-56 M${cx - 250} ${cy + 80} h-56 M${cx + 250} ${cy - 80} h56 M${cx + 250} ${cy} h56 M${cx + 250} ${cy + 80} h56" stroke="${t}" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>`;
    }

    // ai (default): neural lattice + core
    const pts = [
      [cx - 120, cy - 120],
      [cx + 120, cy - 120],
      [cx - 180, cy + 10],
      [cx + 180, cy + 10],
      [cx - 90, cy + 140],
      [cx + 90, cy + 140],
    ];
    const mesh = pts.map(([x, y]) => `<path d="M${cx} ${cy} ${x} ${y}"/><circle cx="${x}" cy="${y}" r="8" fill="${t}" fill-opacity="0.55" stroke="none"/>`).join("");
    return `${orbit}${halo}<g stroke="url(#wire)" stroke-width="1.6" fill="none">${mesh}</g>
      <circle cx="${cx}" cy="${cy}" r="92" fill="#0b1024" fill-opacity="0.55" stroke="url(#ring)" stroke-width="2.4" filter="url(#g9)"/>
      <circle cx="${cx}" cy="${cy}" r="14" fill="${t}" fill-opacity="0.6" stroke="none" filter="url(#b18)"/>`;
  }

  /* Deterministic helpers: every poster is composed from the card's own data,
     so the fifteen cards never share the same palette, backdrop or layout. */
  function hashSeed(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hexToHsl(hex) {
    const value = hex.replace("#", "");
    const r = parseInt(value.slice(0, 2), 16) / 255;
    const g = parseInt(value.slice(2, 4), 16) / 255;
    const b = parseInt(value.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l * 100];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h, s, l) {
    const hue = ((h % 360) + 360) % 360;
    const sat = Math.min(100, Math.max(0, s)) / 100;
    const light = Math.min(100, Math.max(0, l)) / 100;
    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = light - c / 2;
    let rgb;
    if (hue < 60) rgb = [c, x, 0];
    else if (hue < 120) rgb = [x, c, 0];
    else if (hue < 180) rgb = [0, c, x];
    else if (hue < 240) rgb = [0, x, c];
    else if (hue < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    return (
      "#" +
      rgb
        .map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function shiftPalette(pal, degrees, satScale = 1, lightShift = 0) {
    const shift = (hex) => {
      const [h, s, l] = hexToHsl(hex);
      return hslToHex(h + degrees, s * satScale, l + lightShift);
    };
    return { a: shift(pal.a), b: shift(pal.b), tint: shift(pal.tint) };
  }

  /* Five completely different backdrops so no two cards read as the same image. */
  function artBackdrop(kind, pal) {
    const base = `<rect width="900" height="1300" fill="url(#sky)"/>`;

    if (kind === 1) {
      return `${base}
  <g>
    <path d="M-180 1240 L540 -180 L720 -180 L0 1240 Z" fill="${pal.a}" opacity="0.3"/>
    <path d="M140 1320 L860 -140 L1000 -140 L280 1320 Z" fill="${pal.b}" opacity="0.22"/>
    <path d="M470 1320 L1190 -140 L1250 -140 L530 1320 Z" fill="${pal.tint}" opacity="0.08"/>
  </g>
  <rect width="900" height="1300" fill="url(#dots)" opacity="0.8"/>
  <ellipse cx="740" cy="250" rx="230" ry="200" fill="${pal.b}" opacity="0.3" filter="url(#b40)"/>`;
    }

    if (kind === 2) {
      return `${base}
  <g fill="none" stroke="url(#ring)">
    <circle cx="770" cy="270" r="380" stroke-opacity="0.1"/>
    <circle cx="770" cy="270" r="292" stroke-opacity="0.16" stroke-dasharray="4 16"/>
    <circle cx="770" cy="270" r="204" stroke-opacity="0.22"/>
    <circle cx="770" cy="270" r="116" stroke-opacity="0.3"/>
  </g>
  <rect width="900" height="1300" fill="url(#grid)" opacity="0.7"/>
  <ellipse cx="190" cy="800" rx="270" ry="240" fill="${pal.a}" opacity="0.26" filter="url(#b40)"/>`;
    }

    if (kind === 3) {
      const waves = [180, 260, 340, 430, 540, 670, 810, 960]
        .map(
          (y, i) =>
            `<path d="M-30 ${y} C 210 ${y - 74} 480 ${y + 86} 930 ${y - 24}" stroke-opacity="${(
              0.05 +
              i * 0.016
            ).toFixed(3)}"/>`
        )
        .join("");
      return `${base}
  <g fill="none" stroke="${pal.tint}" stroke-width="1.5">${waves}</g>
  <rect width="900" height="1300" fill="url(#dots)" opacity="0.55"/>
  <ellipse cx="450" cy="380" rx="320" ry="260" fill="${pal.a}" opacity="0.28" filter="url(#b40)"/>`;
    }

    if (kind === 4) {
      const layers = [0, 1, 2, 3, 4]
        .map(
          (i) =>
            `<path d="M300 ${360 + i * 52} L610 ${268 + i * 52} L845 ${348 + i * 52} L525 ${
              452 + i * 52
            } Z" fill="none" stroke="${pal.tint}" stroke-opacity="${(0.18 - i * 0.024).toFixed(
              3
            )}" stroke-width="1.6"/>`
        )
        .join("");
      return `${base}
  <g>${layers}</g>
  <rect width="900" height="1300" fill="url(#grid)" opacity="0.55"/>
  <ellipse cx="640" cy="760" rx="300" ry="230" fill="${pal.b}" opacity="0.24" filter="url(#b40)"/>`;
    }

    return `${base}
  <rect width="900" height="1300" fill="url(#grid)"/>
  <ellipse cx="240" cy="300" rx="290" ry="240" fill="${pal.a}" opacity="0.34" filter="url(#b40)"/>
  <ellipse cx="700" cy="980" rx="270" ry="230" fill="${pal.b}" opacity="0.24" filter="url(#b40)"/>
  <g stroke="#ffffff" stroke-opacity="0.05">
    <path d="M0 900 H900"/><path d="M0 948 H900"/><path d="M0 996 H900"/>
  </g>`;
  }

  function artSignature(kind, pal, rand) {
    if (kind === 0) {
      let out = "";
      for (let i = 0; i < 6; i += 1) {
        const x = 100 + rand() * 700;
        const y = 240 + rand() * 760;
        const size = 6 + rand() * 9;
        out += `<path d="M${x.toFixed(0)} ${(y - size).toFixed(0)} v${(size * 2).toFixed(
          0
        )} M${(x - size).toFixed(0)} ${y.toFixed(0)} h${(size * 2).toFixed(
          0
        )}" stroke="${pal.tint}" stroke-opacity="0.4" stroke-width="1.4" stroke-linecap="round"/>`;
      }
      return out;
    }

    if (kind === 1) {
      let out = "";
      for (let i = 0; i < 7; i += 1) {
        out += `<rect x="${70 + i * 24}" y="${192 + (i % 2) * 12}" width="8" height="${
          20 + i * 5
        }" rx="4" fill="${pal.tint}" fill-opacity="0.28"/>`;
      }
      return out;
    }

    if (kind === 2) {
      return `<g fill="none" stroke="${pal.tint}" stroke-opacity="0.35">
        <path d="M70 210 a120 120 0 0 1 120 -120" stroke-width="1.6"/>
        <path d="M70 250 a160 160 0 0 1 160 -160" stroke-width="1.2" stroke-dasharray="3 12"/>
      </g>`;
    }

    if (kind === 3) {
      let out = "";
      for (let i = 0; i < 9; i += 1) {
        const x = 90 + i * 84;
        const y = 214 + Math.sin(i * 0.9) * 26;
        out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${2 + (i % 3)}" fill="${
          pal.tint
        }" fill-opacity="0.4"/>`;
      }
      return out;
    }

    let out = "";
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        out += `<rect x="${716 + i * 16}" y="${214 + j * 16}" width="6" height="6" rx="1.5" fill="${
          pal.tint
        }" fill-opacity="${(0.1 + (i + j) * 0.04).toFixed(2)}"/>`;
      }
    }
    return out;
  }

  const MOTIF_VARIANTS = [
    { dx: 0, dy: 0, scale: 1, rotate: 0, flip: 1 },
    { dx: 26, dy: -8, scale: 1.05, rotate: -5, flip: 1 },
    { dx: -24, dy: 6, scale: 0.94, rotate: 6, flip: -1 },
    { dx: 10, dy: 22, scale: 1.1, rotate: 0, flip: -1 },
    { dx: -12, dy: 10, scale: 0.9, rotate: -9, flip: 1 },
  ];

  function experienceArt(item, index = 0) {
    const theme = detectTheme(item);
    const base = EXP_THEMES[theme] || EXP_THEMES.ai;
    const seed = hashSeed(`${item.title || ""}|${item.period || ""}`);
    const rand = seededRandom(seed + index);
    const themeIndex =
      EXPERIENCE.slice(0, index + 1).filter((entry) => detectTheme(entry) === theme).length - 1;
    const kind = (index + themeIndex) % 5;
    const plate = (index + themeIndex) % 3;
    const pal = shiftPalette(base, [-24, 12, 36, -8, 22, 54, -38, 18][index % 8], 1.04, 0);
    const period = String(item.period || "").replace(/[^0-9\-– ]/g, "");
    const stats = item.stats || [];
    const head = stats.length ? String(stats[0].value) : "";
    const tag = String(item.title || "")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/&/g, "and")
      .trim()
      .toUpperCase()
      .slice(0, 26);
    const bars = stats.slice(1, 5).map((s) => parseFloat(String(s.value)) || 0);
    const maxBar = Math.max(...bars, 1);
    const barSvg = bars
      .map((value, i) => {
        const height = 20 + (value / maxBar) * 72;
        const x = 830 - bars.length * 30 + i * 30;
        return `<rect x="${x}" y="${(940 - height).toFixed(0)}" width="16" height="${height.toFixed(
          0
        )}" rx="8" fill="${pal.tint}" fill-opacity="${(0.26 + i * 0.12).toFixed(2)}"/>`;
      })
      .join("");
    const total = String(EXPERIENCE.length).padStart(2, "0");
    const variant = MOTIF_VARIANTS[(index + themeIndex + Math.floor(seed / 13)) % MOTIF_VARIANTS.length];
    const FONT = `font-family="Segoe UI, Arial, sans-serif"`;

    let plateSvg = "";
    if (plate === 0) {
      plateSvg = `
  <text x="70" y="912" ${FONT} font-size="30" letter-spacing="7" fill="#ffffff" fill-opacity="0.64">${period}</text>
  <text x="70" y="1258" ${FONT} font-size="20" letter-spacing="4" fill="#ffffff" fill-opacity="0.5">${tag}</text>
  <text x="830" y="1188" text-anchor="end" ${FONT} font-size="190" font-weight="700" fill="url(#num)">${head}</text>`;
    } else if (plate === 1) {
      plateSvg = `
  <text x="70" y="912" ${FONT} font-size="30" letter-spacing="7" fill="#ffffff" fill-opacity="0.64">${period}</text>
  <text x="830" y="1258" text-anchor="end" ${FONT} font-size="20" letter-spacing="4" fill="#ffffff" fill-opacity="0.5">${tag}</text>
  <text x="70" y="1188" ${FONT} font-size="190" font-weight="700" fill="url(#num)">${head}</text>`;
    } else {
      plateSvg = `
  <text x="450" y="912" text-anchor="middle" ${FONT} font-size="30" letter-spacing="7" fill="#ffffff" fill-opacity="0.64">${period}</text>
  <text x="450" y="1258" text-anchor="middle" ${FONT} font-size="20" letter-spacing="4" fill="#ffffff" fill-opacity="0.5">${tag}</text>
  <text x="450" y="1188" text-anchor="middle" ${FONT} font-size="190" font-weight="700" fill="url(#num)">${head}</text>`;
    }

    const headerSvg = `
  <g ${FONT} font-size="19" letter-spacing="6" fill="#ffffff" fill-opacity="0.55">
    <circle cx="70" cy="114" r="4.5" fill="${pal.tint}" fill-opacity="0.9"/>
    <text x="90" y="121">${theme.toUpperCase()}</text>
    <text x="830" y="121" text-anchor="end" fill-opacity="0.3">${String(index + 1).padStart(
      2,
      "0"
    )} / ${total}</text>
  </g>
  <path d="M70 148 H230" stroke="${pal.tint}" stroke-opacity="0.45" stroke-width="1.6"/>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1300">
  <defs>
    <radialGradient id="sky" cx="50%" cy="40%" r="78%">
      <stop offset="0%" stop-color="${pal.a}" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#0a1022"/>
      <stop offset="100%" stop-color="#04060d"/>
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pal.tint}"/><stop offset="48%" stop-color="#818cf8"/><stop offset="100%" stop-color="${pal.b}"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="46%" r="60%">
      <stop offset="0%" stop-color="${pal.tint}" stop-opacity="0.8"/><stop offset="60%" stop-color="${pal.a}" stop-opacity="0.26"/><stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wire" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${pal.tint}" stop-opacity="0.65"/><stop offset="100%" stop-color="#c084fc" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="num" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="${pal.tint}"/><stop offset="100%" stop-color="${pal.b}"/>
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0v60" fill="none" stroke="#8b9dff" stroke-opacity="0.075" stroke-width="1"/>
    </pattern>
    <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.5" fill="#a5b4fc" fill-opacity="0.16"/>
    </pattern>
    <filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="46"/></filter>
    <filter id="b18" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
    <filter id="g9" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9" result="bb"/><feMerge><feMergeNode in="bb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  ${artBackdrop(kind, pal)}
  ${artSignature(kind, pal, rand)}
  <g transform="translate(450 500) rotate(${variant.rotate}) translate(${variant.dx} ${
      variant.dy + 60
    }) scale(${variant.flip * variant.scale} ${variant.scale}) translate(-450 -500)">${artMotif(
      theme,
      pal.tint
    )}</g>
  <path d="M70 960 H830" stroke="#ffffff" stroke-opacity="0.14"/>
  <path d="M70 954 v12 M260 954 v12 M450 954 v12 M640 954 v12 M830 954 v12" stroke="#ffffff" stroke-opacity="0.18"/>
  ${barSvg}
  ${headerSvg}
  ${plateSvg}
</svg>`;

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* Soft highlight for numbers and technology terms only. */
  const RESP_TERM =
    /(\d+(?:[.,]\d+)?\+?|\b(?:Big Data|Machine Learning|Digital Transformation|Knowledge Sharing Platform|Microsoft Office|Cybersecurity|Infrastructure|Programming|Automation|Kubernetes|Gaming PC|Database|Hardware|Software|Security|Network|Windows|Linux|Docker|DevOps|Cloud|Azure|AWS|API|SQL|CPU|GPU|RAM|SSD|NVMe|BIOS|OBS|RGB|VR|AR|VPN|LAN|WAN|WiFi|IT|AI|IoT|Data|Web|Mobile|Platform|Troubleshooting)\b)/gi;

  function highlightResp(line) {
    return String(line)
      .split(RESP_TERM)
      .map((part, i) => (i % 2 === 1 ? `<mark>${esc(part)}</mark>` : esc(part)))
      .join("");
  }

  /* Splits Lao text into grapheme clusters so it can run in one by one. */
  const GLYPH_SEGMENTER =
    typeof Intl !== "undefined" && Intl.Segmenter
      ? new Intl.Segmenter("lo", { granularity: "grapheme" })
      : null;

  function glyphHtml(text) {
    const value = String(text);
    const glyphs = GLYPH_SEGMENTER
      ? Array.from(GLYPH_SEGMENTER.segment(value), (part) => part.segment)
      : Array.from(value);
    let index = 0;
    return glyphs
      .map((glyph) => {
        if (glyph === " ") return " ";
        const html = `<span class="glyph" style="--i:${index}">${esc(glyph)}</span>`;
        index += 1;
        return html;
      })
      .join("");
  }

  /* ---------------- experience ---------------- */

  function renderExperience() {
    const mount = document.getElementById("experience-list");
    if (!mount) return;

    const iconUsed = new Set();
    const insightIcons = EXPERIENCE.map((entry) => {
      const preferred = EXP_INSIGHT_ICONS[detectTheme(entry)] || "spark";
      const pool = [
        preferred,
        "layers",
        "server",
        "globe",
        "clock",
        "code",
        "questions",
        "cpu",
        "award",
        "pen",
        "db",
        "net",
        "cloud",
        "shield",
        "spark",
      ];
      const picked = pool.find((key) => ICON[key] && !iconUsed.has(key)) || "spark";
      iconUsed.add(picked);
      return picked;
    });

    mount.innerHTML = EXPERIENCE.map((item, index) => {
      const isCurrent = /ປັດຈຸບັນ/.test(item.period);
      const stats = (item.stats || [])
        .map(
          (stat) =>
            `<div class="exp-stat"><b>${esc(stat.value)}</b><span>${esc(stat.label)}</span></div>`
        )
        .join("");

      const resp = (item.responsibilities || [])
        .map((line) => `<li>${ICON.check}<span>${highlightResp(line)}</span></li>`)
        .join("");

      const insight = item.insights
        ? `<div class="insight"><strong>${ICON[insightIcons[index] || "spark"]} ຂໍ້ມູນເຕັກໂນໂລຊີໃນໄລຍະນັ້ນ</strong><p>${esc(
            item.insights
          )}</p></div>`
        : "";

      const accentHue = 190 + (index % 15) * 11;

      return `
        <article class="exp-item reveal${index % 2 === 1 ? " flip" : ""}${isCurrent ? " current" : ""}" style="--exp-accent:hsl(${accentHue} 90% 68%);--exp-accent-soft:hsl(${accentHue} 90% 60% / 0.1);--exp-accent-mid:hsl(${accentHue} 90% 60% / 0.22);--exp-accent-line:hsl(${accentHue} 90% 60% / 0.55)">
          <span class="exp-dot"></span>
          <div class="exp-card glass hover-glow">
            <div class="exp-media" tabindex="0" role="button" aria-label="ເບິ່ງຮູບ: ${esc(
              item.title
            )}" data-exp-index="${index}">
              <img src="${item.image || experienceArt(item, index)}" alt="${esc(item.title)}" loading="lazy" />
              <span class="exp-media-label">${ICON.briefcase} ${esc(item.kind)}</span>
              <span class="exp-media-zoom">${ICON.zoom}</span>
            </div>
            <div class="exp-body">
              <div class="exp-top">
                <span class="period${isCurrent ? " period-now" : ""}">${ICON.calendar} ${esc(
        item.period
      )}</span>
                <span class="place">${ICON.pin} ${esc(item.location)}</span>
              </div>
              <h3>${esc(item.title)}</h3>
              <p class="exp-sub">${glyphHtml(item.subtitle)}</p>
              <p class="exp-desc">${esc(item.description)}</p>
              ${stats ? `<div class="exp-stats">${stats}</div>` : ""}
              <p class="exp-block-title">ໜ້າທີ່ຮັບຜິດຊອບຫຼັກ:</p>
              <ul class="exp-resp">${resp}</ul>
              ${insight}
            </div>
          </div>
        </article>`;
    }).join("");

    Array.from(mount.querySelectorAll(".exp-media")).forEach((media) => {
      const index = Number(media.dataset.expIndex);
      media.addEventListener("click", () => openViewer("exp", index));
      media.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openViewer("exp", index);
        }
      });
    });

    initExpSubtitles();
  }

  /* The subtitle runs in, fades, and runs in again while its card is on screen. */
  function initExpSubtitles() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const subs = document.querySelectorAll(".exp-sub");
    if (!subs.length || reduceMotion) return;

    const loops = [];

    subs.forEach((sub) => {
      const count = sub.querySelectorAll(".glyph").length;
      if (!count) return;
      const playMs = count * 38 + 500 + 2200;
      let timer = 0;

      const run = () => {
        sub.classList.remove("is-out", "is-run");
        void sub.offsetWidth;
        sub.classList.add("is-run");
        timer = window.setTimeout(() => {
          sub.classList.add("is-out");
          timer = window.setTimeout(run, 420);
        }, playMs);
      };

      const stop = () => {
        window.clearTimeout(timer);
        timer = 0;
        sub.classList.remove("is-run", "is-out");
      };

      loops.push({ sub, run, stop });
    });

    if (!("IntersectionObserver" in window)) {
      loops.forEach((loop) => loop.run());
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const loop = loops.find((item) => item.sub === entry.target);
          if (!loop) return;
          if (entry.isIntersecting) {
            if (!loop.sub.classList.contains("is-run")) loop.run();
          } else {
            loop.stop();
          }
        });
      },
      { threshold: 0.4 }
    );

    loops.forEach((loop) => observer.observe(loop.sub));
  }

  /* ---------------- skills ---------------- */

  function renderSkills() {
    const mount = document.getElementById("skills-list");
    if (!mount) return;

    /* every bar gets its own hue: 5° apart across all 72 rows */
    let barIndex = 0;

    mount.innerHTML = SKILL_GROUPS.map(
      (group, index) => `
      <section class="skill-card glass hover-glow reveal" style="--skill-accent: hsl(${(190 + index * 27) % 360} 88% 64%)">
        <div class="skill-head">
          <span class="skill-icon">${ICON[group.icon] || ICON.cpu}</span>
          <div>
            <h3>${esc(group.title)}</h3>
            <span>${esc(group.subtitle)}</span>
          </div>
        </div>
        <div class="skill-list">
          ${group.skills
            .map((skill) => {
              const hue = (190 + barIndex * 26) % 360;
              barIndex += 1;
              return `
            <div class="skill" style="--bar-hue: ${hue}">
              <div class="skill-row-top"><span class="skill-name">${
                ICON[skill.icon] ? `<i class="skill-item-icon">${ICON[skill.icon]}</i>` : ""
              }${esc(skill.name)}</span><b>${skill.level}%</b></div>
              <div class="skill-track"><div class="skill-fill" data-level="${skill.level}"></div></div>
            </div>`;
            })
            .join("")}
        </div>
      </section>`
    ).join("");
  }

  /* ---------------- certificates ---------------- */

  /* one hue per certificate category, used for the badge icon */
  const CERT_TAG_HUES = {
    "ວິຊາຊີບ": 215,
    "ເຄືອຂ່າຍ": 265,
    "ການອອກແບບ": 330,
    "ຖານຂໍ້ມູນ": 190,
    "ຂໍ້ມູນ": 200,
    "ຄວາມປອດໄພ": 0,
    "ຄລາວ": 174,
    "ຄອນເທນເນີ": 230,
    "ການຈັດການ": 40,
    "ການພັດທະນາ": 150,
    "ຫ້ອງການ": 285,
    "ການຕະຫຼາດ": 299,
    "ຮາດແວ": 25,
    "ນາໆຊາດ": 120,
    "ການສຶກສາ": 55,
    "ພາສາ": 340,
    "ການບໍລິການ": 160,
    AI: 275,
  };

  /* certificate badge icons, chosen by category (tag) */
  const CERT_TAG_ICONS = {
    "ວິຊາຊີບ": "briefcase",
    "ເຄືອຂ່າຍ": "net",
    "ການອອກແບບ": "pen",
    "ຖານຂໍ້ມູນ": "db",
    "ຂໍ້ມູນ": "layers",
    "ຄວາມປອດໄພ": "shield",
    "ຄລາວ": "cloud",
    "ຄອນເທນເນີ": "gear",
    "ການຈັດການ": "briefcase",
    "ການພັດທະນາ": "code",
    "ຫ້ອງການ": "window",
    "ການຕະຫຼາດ": "megaphone",
    "ຮາດແວ": "cpu",
    "ນາໆຊາດ": "globe",
    "ການສຶກສາ": "award",
    "ພາສາ": "chat",
    "ການບໍລິການ": "clock",
    AI: "spark",
  };

  function renderCertificates() {
    const mount = document.getElementById("cert-list");
    if (!mount) return;

    mount.innerHTML = CERTIFICATES.map(
      (cert) => `
      <article class="cert-card glass hover-glow reveal" style="--badge-hue: ${CERT_TAG_HUES[cert.tag] ?? 299}">
        <div class="cert-thumb">
          <img src="${esc(cert.image)}" alt="${esc(cert.title)}" loading="lazy" />
          <span class="cert-badge">${
            ICON[cert.icon] || ICON[CERT_TAG_ICONS[cert.tag]]
              ? `<i class="cert-badge-icon">${ICON[cert.icon] || ICON[CERT_TAG_ICONS[cert.tag]]}</i>`
              : ""
          }${esc(cert.tag)}</span>
        </div>
        <div class="cert-body">
          <h3>${esc(cert.title)}</h3>
          <p class="cert-type">${glyphHtml(cert.focus)}</p>
          <span class="cert-issuer"><i class="cert-issuer-icon">${ICON.award}</i>${esc(
            cert.issuer
          )}${flagHtml(cert.flag)}</span>
          <span class="cert-date"><i class="cert-issuer-icon">${ICON.calendar}</i>${esc(
            cert.date || ""
          )}</span>
        </div>
      </article>`
    ).join("");

    Array.from(mount.querySelectorAll(".cert-card")).forEach((card, index) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `ເບິ່ງລາຍລະອຽດ: ${CERTIFICATES[index].title}`);
      card.addEventListener("click", () => openViewer("cert", index));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openViewer("cert", index);
        }
      });
    });

    initCertType();
  }

  /* ---------------- media viewer (certificates & experience) ---------------- */

  const certViewer = document.getElementById("cert-viewer");
  const certViewerBody = document.getElementById("cert-viewer-content");
  const VIEWER_ZOOM_MIN = 1;
  const VIEWER_ZOOM_MAX = 3;
  const VIEWER_ZOOM_STEP = 0.5;
  let viewerZoom = 1;
  let viewerKind = "cert";
  let viewerIndex = 0;

  /* Builds the entry list of a section; each entry feeds the same overlay. */
  function viewerEntries(kind) {
    if (kind === "exp") {
      return EXPERIENCE.map((item, index) => {
        const hue = 190 + (index % 15) * 11;
        return {
          image: item.image || experienceArt(item, index),
          title: item.title,
          hue,
          badge: `<i class="cert-badge-icon">${ICON.briefcase}</i>${esc(item.kind)}`,
          lines: [
            `<span class="cert-issuer"><i class="cert-issuer-icon">${ICON.calendar}</i>${esc(
              item.period
            )} · ${esc(item.location)}</span>`,
            `<span class="cert-viewer-focus">${esc(item.subtitle)}</span>`,
            `<p class="cert-viewer-focus exp-viewer-desc">${esc(item.description)}</p>`,
          ],
        };
      });
    }

    return CERTIFICATES.map((cert) => {
      const icon = ICON[cert.icon] || ICON[CERT_TAG_ICONS[cert.tag]];
      return {
        image: cert.image,
        title: cert.title,
        hue: CERT_TAG_HUES[cert.tag] ?? 299,
        badge: `${icon ? `<i class="cert-badge-icon">${icon}</i>` : ""}${esc(cert.tag)}`,
        lines: [
          `<span class="cert-viewer-focus">${esc(cert.focus)}</span>`,
          `<span class="cert-issuer"><i class="cert-issuer-icon">${ICON.award}</i>${esc(
            cert.issuer
          )}${flagHtml(cert.flag)}</span>`,
          `<span class="cert-date"><i class="cert-issuer-icon">${ICON.calendar}</i>${esc(
            cert.date || ""
          )}</span>`,
        ],
      };
    });
  }

  function applyViewerZoom() {
    if (!certViewerBody) return;
    certViewerBody.style.setProperty("--cert-zoom", String(viewerZoom));
    const value = certViewerBody.querySelector(".cert-viewer-zoom-value");
    if (value) value.textContent = `${Math.round(viewerZoom * 100)}%`;
    const out = certViewerBody.querySelector('[data-zoom="-1"]');
    const add = certViewerBody.querySelector('[data-zoom="1"]');
    if (out) out.disabled = viewerZoom <= VIEWER_ZOOM_MIN;
    if (add) add.disabled = viewerZoom >= VIEWER_ZOOM_MAX;
  }

  function setViewerZoom(delta) {
    viewerZoom = Math.min(
      VIEWER_ZOOM_MAX,
      Math.max(VIEWER_ZOOM_MIN, Math.round((viewerZoom + delta) * 2) / 2)
    );
    applyViewerZoom();
  }

  function resetViewerZoom() {
    viewerZoom = 1;
    applyViewerZoom();
    const figure = certViewerBody.querySelector(".cert-viewer-figure");
    if (figure) figure.scrollTo({ top: 0, left: 0 });
  }

  function openViewer(kind, index) {
    if (!certViewer) return;
    const entries = viewerEntries(kind);
    if (!entries.length) return;

    const total = entries.length;
    const position = ((index % total) + total) % total;
    const entry = entries[position];
    viewerKind = kind;
    viewerIndex = position;

    document.body.style.overflow = "hidden";
    certViewer.classList.add("open");
    certViewer.dataset.index = String(position);
    certViewer.dataset.kind = kind;
    certViewerBody.style.setProperty("--badge-hue", entry.hue);
    viewerZoom = 1;
    certViewerBody.innerHTML = `
      <button class="modal-close" type="button" aria-label="ປິດ">${ICON.close}</button>
      <div class="cert-viewer-figure">
        <img src="${esc(entry.image)}" alt="${esc(entry.title)}" />
      </div>
      <div class="cert-viewer-body">
        <span class="cert-badge">${entry.badge}</span>
        <h3>${esc(entry.title)}</h3>
        ${entry.lines.join("")}
        <div class="cert-viewer-zoom">
          <span class="cert-viewer-zoom-label">${ICON.zoom} ຂະໜາດ</span>
          <button type="button" data-zoom="-1" aria-label="ຫຍໍ້ເຂົ້າ">${
            ICON.minus
          }</button>
          <button type="button" class="cert-viewer-zoom-value" data-zoom-reset="1" aria-label="ຂະໜາດປົກກະຕິ">100%</button>
          <button type="button" data-zoom="1" aria-label="ຂະຫຍາຍ">${ICON.plus}</button>
        </div>
        <div class="cert-viewer-nav">
          <button type="button" data-step="-1" aria-label="ກ່ອນໜ້າ">${ICON.chevron}</button>
          <span>${position + 1} / ${total}</span>
          <button type="button" data-step="1" aria-label="ຕໍ່ໄປ">${ICON.chevron}</button>
        </div>
      </div>`;

    applyViewerZoom();
  }

  function stepViewer(delta) {
    if (!certViewer || !certViewer.classList.contains("open")) return;
    openViewer(viewerKind, viewerIndex + delta);
  }

  function closeCertViewer() {
    if (!certViewer) return;
    certViewer.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* The focus line reveals letter by letter, left to right, then loops while on screen. */
  function initCertType() {
    const lines = document.querySelectorAll(".cert-type");
    if (!lines.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loops = [];

    lines.forEach((line) => {
      const count = line.querySelectorAll(".glyph").length;
      if (!count) return;
      const playMs = count * 55 + 500 + 2400;
      let timer = 0;

      const run = () => {
        line.classList.remove("is-out", "is-run");
        void line.offsetWidth;
        line.classList.add("is-run");
        timer = window.setTimeout(() => {
          line.classList.add("is-out");
          timer = window.setTimeout(run, 600);
        }, playMs);
      };

      const stop = () => {
        window.clearTimeout(timer);
        timer = 0;
        line.classList.remove("is-run", "is-out");
      };

      loops.push({ line, run, stop });
    });

    if (!("IntersectionObserver" in window)) {
      loops.forEach((loop) => loop.run());
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const loop = loops.find((item) => item.line === entry.target);
          if (!loop) return;
          if (entry.isIntersecting) {
            if (!loop.line.classList.contains("is-run")) loop.run();
          } else {
            loop.stop();
          }
        });
      },
      { threshold: 0.4 }
    );

    loops.forEach((loop) => observer.observe(loop.line));
  }

  /* ---------------- social bar ---------------- */

  const SOCIALS = [
    {
      name: "WhatsApp",
      href: "https://wa.me/8562058855817",
      color: "37, 211, 102",
      icon: '<path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.9-5.2c-.4-.7-.6-1.4-.6-2 0-.5.3-1.1.6-1.4.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6.5.9 1.1 1.6 1.9 2.2.5.3.8.5 1 .6.2.1.3.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3.1.2.1.6-.1 1.1Z"/>',
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/Ama.suvannavong",
      color: "24, 119, 242",
      icon: '<path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.5V14h2.8v8h3.2Z"/>',
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/channel/UC--n0eU77DMyF46_0iDIRrg",
      color: "255, 0, 0",
      icon: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z"/>',
    },
    {
      name: "LINE",
      href: "https://line.me/ti/p/lvU_odepsU",
      color: "6, 199, 85",
      icon: '<path d="M12 3C6.8 3 2.6 6.4 2.6 10.6c0 3.8 3.4 7 7.9 7.6.3.1.7.3.8.6.1.3.1.7 0 1l-.1.8c0 .2-.2.9.8.5s5.2-3 6.8-5.2c1.3-1.4 1.9-2.9 1.9-4.6C20.7 6.4 17.2 3 12 3Z"/>',
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@hongkhamsuvannavongama",
      color: "254, 44, 85",
      icon: '<path d="M16.6 2h-3v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.4a5.9 5.9 0 1 0 4.9 5.8V8.6a6.4 6.4 0 0 0 3.7 1.2V6.7a3.6 3.6 0 0 1-3.7-3.6V2Z"/>',
    },
    {
      name: "ອີເມວ",
      href: "mailto:hongkham.svnv@outlook.com",
      color: "139, 92, 246",
      icon: '<path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm2.5.7L12 13l7.5-5.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      color: "228, 64, 95",
      icon: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2"/>',
    },
    {
      name: "X",
      href: "https://x.com/",
      color: "22, 22, 24",
      icon: '<path d="M17.5 3h3l-7.4 8.5L21.7 21h-6.1l-4.8-6.3L5.3 21H2.3l7.9-9L2 3h6.2l4.4 5.8L17.5 3Z"/>',
    },
    {
      name: "Telegram",
      href: "https://telegram.org/",
      color: "34, 158, 217",
      icon: '<path d="M21.5 4.3l-3 15.2c-.2 1-.8 1.2-1.6.8l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.6 8.2-7.4c.4-.3-.1-.5-.5-.2L7.3 13.6l-4.3-1.3c-.9-.3-.9-.9.2-1.3L19.8 3.2c.8-.3 1.5.2 1.7 1.1Z"/>',
    },
    {
      name: "Discord",
      href: "https://discord.com/",
      color: "88, 101, 242",
      icon: '<path d="M18.9 5.5A16 16 0 0 0 15 4.3l-.4.9a12 12 0 0 0-5.2 0L9 4.3a16 16 0 0 0-3.9 1.2C2.4 9.4 1.8 13.2 2.3 17a16 16 0 0 0 4.9 2.5l1-1.6c-.5-.2-1-.4-1.5-.7l.4-.3a11.4 11.4 0 0 0 9.8 0l.4.3c-.5.3-1 .5-1.5.7l1 1.6a16 16 0 0 0 4.9-2.5c.6-4.3-.4-8-2.8-11.5ZM9.3 14.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
    },
    {
      name: "Reddit",
      href: "https://www.reddit.com/",
      color: "255, 69, 0",
      icon: '<path d="M22 12a2.2 2.2 0 0 0-3.7-1.6c-1.9-1.3-4.4-2.1-7.1-2.2l1.3-4.1 3.6.9a1.6 1.6 0 1 0 .2-1.5l-4.2-1a.7.7 0 0 0-.8.5l-1.5 4.7c-2.8.1-5.4.9-7.3 2.2A2.2 2.2 0 1 0 5 15.4c0 .3-.1.6-.1.9 0 3.5 3.2 6.3 7.1 6.3s7.1-2.8 7.1-6.3c0-.3 0-.6-.1-.9A2.2 2.2 0 0 0 22 12Zm-13.3 1.7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7 3.6c-.9.9-2.4 1.3-3.7 1.3s-2.8-.4-3.7-1.3a.5.5 0 0 1 .7-.7c.6.6 1.8 1 3 1s2.4-.4 3-1a.5.5 0 1 1 .7.7Z"/>',
    },
    {
      name: "Pinterest",
      href: "https://www.pinterest.com/",
      color: "230, 0, 35",
      icon: '<path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.1-3.8-3 0-4.9 2.2-4.9 4.7 0 .9.3 1.6.7 2.1.2.2.2.3.1.6l-.2.9c-.1.3-.3.4-.6.3-1.6-.7-2.4-2.6-2.4-4.7C5.1 6.6 7.8 3 12.6 3c3.9 0 6.5 2.8 6.5 5.8 0 4-2.2 7-5.5 7-1.1 0-2.2-.6-2.6-1.3l-.7 2.7c-.3 1-.9 2-1.4 2.7A10 10 0 1 0 12 2Z"/>',
    },
    {
      name: "Snapchat",
      href: "https://www.snapchat.com/",
      color: "255, 252, 0",
      light: true,
      icon: '<path d="M12 3c2.6 0 4.3 2 4.3 4.6 0 .8 0 1.5-.1 2.1.5.3 1 .1 1.4-.1.6-.2 1.1.3 1 .9-.1.6-.8 1.1-1.6 1.4-.5.2-.8.4-.8.7 0 .5 1.1 2.5 3.1 3.3.4.2.3.7-.1 1-.6.4-1.5.6-2 .6-.3 0-.4.2-.5.5-.1.5-.6.7-1.1.6-.6-.1-1.2-.2-1.7-.1-.9.1-1.3.4-2 .9-.6.4-1.2.6-1.9.6-.8 0-1.4-.3-2-.7-.6-.4-1.1-.7-1.8-.8-.5-.1-1.1 0-1.7.1-.6.1-1-.2-1.1-.6-.1-.3-.2-.5-.5-.5-.5 0-1.4-.2-2-.6-.4-.3-.5-.8-.1-1 2-.8 3.1-2.8 3.1-3.3 0-.3-.3-.5-.8-.7-.8-.3-1.5-.8-1.6-1.4-.1-.6.4-1.1 1-.9.4.2.9.4 1.4.1 0-.6-.1-1.3-.1-2.1C7.7 5 9.4 3 12 3Z"/>',
    },
    {
      name: "Twitch",
      href: "https://www.twitch.tv/",
      color: "145, 70, 255",
      icon: '<path d="M4 3h16v11l-4 4h-3l-3 3H8v-3H4V3Zm2 2v9h3v3l3-3h3l3-3V5H6Zm5 2h2v5h-2V7Zm4 0h2v5h-2V7Z"/>',
    },
    {
      name: "Spotify",
      href: "https://open.spotify.com/",
      color: "29, 185, 84",
      icon: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.5 14.4a.8.8 0 0 1-1.1.3c-2.9-1.8-6.6-2.2-10.9-1.2a.8.8 0 1 1-.4-1.5c4.7-1.1 8.8-.6 12 1.3.4.2.5.7.4 1.1Zm1.2-2.7a1 1 0 0 1-1.4.3c-3.3-2-8.3-2.6-12.2-1.4a1 1 0 1 1-.6-1.9c4.4-1.3 10-.7 13.8 1.6.5.3.6.9.4 1.4Zm.1-2.8C14.1 8.6 7.4 8.3 3.9 9.4a1.2 1.2 0 1 1-.7-2.3c4-1.2 11.5-.9 15.8 1.6a1.2 1.2 0 0 1-1.2 2.1Z"/>',
    },
    {
      name: "Netflix",
      href: "https://www.netflix.com/",
      color: "229, 9, 20",
      icon: '<path d="M6.5 2h3.1l5 12.6V2H19v20h-3.2L9.6 7.9V22H6.5V2Z"/>',
    },
    {
      name: "Threads",
      href: "https://www.threads.net/",
      color: "22, 22, 24",
      icon: '<path d="M12.2 22c-3.1 0-5.5-1.1-7-3.2C3.8 16.9 3 14.6 3 12s.8-4.9 2.2-6.8C6.7 3.1 9.1 2 12.2 2c2.6 0 4.7.8 6.2 2.3 1.2 1.2 1.9 2.8 2.2 4.6h-2.3c-.6-2.9-2.6-4.6-6-4.6-2.4 0-4.2.8-5.3 2.3-1 1.4-1.5 3.3-1.5 5.4s.5 4 1.5 5.4c1.1 1.5 2.9 2.3 5.3 2.3 2.1 0 3.6-.5 4.6-1.5.9-.9 1.3-2.1 1.1-3.4-.2-1.6-1.4-2.7-3.2-2.9-1.3-.2-2.5.2-3 .9-.4.6-.4 1.4.1 2 .6.8 1.7 1.1 2.8.9 1.4-.3 2.2-1.4 2.2-3h2.2c0 2.6-1.4 4.6-4 5.1-2 .4-4-.2-5-1.7-1-1.3-.8-3 .3-4.1 1.1-1.2 3-1.6 5-1.3 2.7.4 4.5 2.1 4.8 4.6.3 2.1-.5 4-2.1 5.2-1.3 1-3.1 1.5-5.5 1.5Z"/>',
    },
    {
      name: "Messenger",
      href: "https://www.messenger.com/",
      color: "0, 132, 255",
      icon: '<path d="M12 2C6.5 2 2 6.2 2 11.4c0 3 1.4 5.6 3.7 7.4V22l3.4-1.9c.9.2 1.9.4 2.9.4 5.5 0 10-4.2 10-9.4S17.5 2 12 2Zm1 12.6-2.6-2.7-5 2.7L11 9.1l2.7 2.7 4.9-2.7-5.6 5.5Z"/>',
    },
    {
      name: "Viber",
      href: "https://www.viber.com/",
      color: "115, 96, 242",
      icon: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2.4 5.3c.3 0 .6.2.8.6l.7 1.6c.1.3 0 .6-.2.8l-.5.5c.7 1.4 1.8 2.4 3.2 3l.5-.6c.2-.2.5-.3.8-.2l1.6.7c.4.2.6.5.6.8v1.3c0 .9-.8 1.6-1.7 1.5-2.1-.2-4-1.2-5.4-2.6-1.4-1.4-2.4-3.3-2.6-5.4-.1-.9.6-1.7 1.5-1.7h.7Z"/>',
    },
    {
      name: "GitHub",
      href: "https://github.com/",
      color: "36, 41, 46",
      icon: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/>',
    },
  ];

  function renderSocialBar() {
    const mount = document.getElementById("social-bar");
    if (!mount) return;
    mount.innerHTML = SOCIALS.map(
      (item) => `
      <a class="brand-tile${item.light ? " is-light" : ""}" style="--c: ${item.color}"
         href="${item.href}"
         ${item.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
         title="${item.name}" aria-label="${item.name}">
        <svg viewBox="0 0 24 24" fill="currentColor">${item.icon}</svg>
      </a>`
    ).join("");
  }

  /* ---------------- projects ---------------- */

  let activeFilter = "all";
  const projectGrid = document.getElementById("project-list");
  const filterBar = document.getElementById("filter-bar");

  function projectCard(project) {
    const features = project.features.slice(0, 3);
    const extra = project.features.length - features.length;

    return `
      <article class="project-card glass hover-glow reveal in" data-category="${esc(project.category)}">
        <div class="project-thumb">
          <img src="${esc(project.image)}" alt="${esc(project.title)}" loading="lazy" />
          <div class="thumb-tags">
            <span class="tag-year">${esc(project.period)}</span>
            <span class="tag-status">${esc(project.status)}</span>
          </div>
        </div>
        <div class="project-body">
          <h3>${esc(project.title)}</h3>
          <p class="project-desc">${esc(project.description)}</p>
          <p class="mini-title">ຄຸນສົມບັດຫຼັກ:</p>
          <ul class="feature-list">
            ${features.map((f) => `<li>${ICON.check}<span>${esc(f)}</span></li>`).join("")}
            ${extra > 0 ? `<li><span class="more-count">+${extra} ອື່ນໆ</span></li>` : ""}
          </ul>
          <p class="mini-title">ເຕັກໂນໂລຊີທີ່ໃຊ້:</p>
          <div class="tech-row">
            ${techChips(project.tech.slice(0, 4))}
            ${project.tech.length > 4 ? `<span class="tech tech-more">+${project.tech.length - 4}</span>` : ""}
          </div>
          <button class="project-detail-btn" type="button" data-project="${esc(project.id)}">
            ລາຍລະອຽດເພີ່ມເຕີມ ${ICON.arrow}
          </button>
        </div>
      </article>`;
  }

  function renderProjects() {
    if (!projectGrid) return;
    const list = PROJECTS.filter((p) => activeFilter === "all" || p.category === activeFilter);
    projectGrid.innerHTML = list.map(projectCard).join("");
  }

  function renderFilters() {
    if (!filterBar) return;
    filterBar.innerHTML = FILTERS.map(
      (filter) =>
        `<button class="filter${filter.id === activeFilter ? " active" : ""}" type="button" data-filter="${esc(
          filter.id
        )}">${esc(filter.label)} <span style="opacity:.6">${filter.count}</span></button>`
    ).join("");
  }

  /* ---------------- project modal ---------------- */

  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-content");

  function openProject(id) {
    const project = PROJECTS.find((p) => p.id === id);
    if (!project || !modal) return;

    document.body.style.overflow = "hidden";
    modal.classList.add("open");
    modalBody.innerHTML = `
      <div class="modal-hero">
        <img src="${esc(project.image)}" alt="${esc(project.title)}" />
        <button class="modal-close" type="button" aria-label="ປິດ">${ICON.close}</button>
      </div>
      <div class="modal-body">
        <h3>${esc(project.title)}</h3>
        <div class="modal-meta">
          <span class="period">${ICON.calendar} ${esc(project.period)}</span>
          <span class="period period-now">${esc(project.status)}</span>
          <span class="place">${ICON.pin} ${esc(project.location)}</span>
        </div>
        <p>${esc(project.description)}</p>
        <p class="modal-section-title">ຄຸນສົມບັດຫຼັກ:</p>
        <ul class="modal-list">
          ${project.features.map((f) => `<li>${ICON.check}<span>${esc(f)}</span></li>`).join("")}
        </ul>
        <p class="modal-section-title">ເຕັກໂນໂລຊີທີ່ໃຊ້:</p>
        <div class="tech-row">
          ${techChips(project.tech)}
        </div>
        ${
          project.stats
            ? `<div class="modal-stats">${project.stats
                .map(
                  (s) =>
                    `<div class="exp-stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`
                )
                .join("")}</div>`
            : ""
        }
        <p class="modal-section-title">ຜົນລັບທີ່ໄດ້ຮັບ:</p>
        <p>${esc(project.impact)}</p>
      </div>`;
  }

  function closeProject() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- scroll behaviour ---------------- */

  function initScroll() {
    const nav = document.getElementById("nav");
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const onScroll = () => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle("scrolled", y > 20);

      let current = sections[0];
      sections.forEach((section) => {
        if (y >= section.offsetTop - 160) current = section;
      });
      links.forEach((link) => {
        link.classList.toggle(
          "active",
          current && link.getAttribute("href") === `#${current.id}`
        );
      });

      const timeline = document.querySelector(".timeline");
      const progress = document.querySelector(".timeline-progress");
      if (timeline && progress) {
        const rect = timeline.getBoundingClientRect();
        const travelled = Math.min(
          Math.max(window.innerHeight * 0.55 - rect.top, 0),
          rect.height
        );
        progress.style.height = `${travelled}px`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");

          entry.target.querySelectorAll(".skill-fill").forEach((fill, i) => {
            setTimeout(() => {
              fill.style.width = `${fill.dataset.level}%`;
            }, i * 90);
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ---------------- counting stat ---------------- */

  function runCounter(el, start, end, stepMs, holdMs) {
    let value = start;

    const tick = () => {
      if (value >= end) {
        value = start;
        el.textContent = value + "+";
        setTimeout(tick, stepMs);
        return;
      }

      value += 1;
      el.textContent = value + "+";
      setTimeout(tick, value >= end ? holdMs : stepMs);
    };

    setTimeout(tick, holdMs);
  }

  function initStatCounters() {
    const counters = [
      { el: document.getElementById("stat-clients"), start: 50, end: 200, stepMs: 180, holdMs: 3600 },
      { el: document.getElementById("stat-years"), start: 10, end: 18, stepMs: 750, holdMs: 3600 },
    ];
    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    counters.forEach(({ el, start, end, stepMs, holdMs }) => {
      if (!el) return;
      if (reduceMotion) {
        el.textContent = end + "+";
        return;
      }
      runCounter(el, start, end, stepMs, holdMs);
    });
  }

  /* Stars fill in one step at a time (2 → 3 → 4 → 5) when the block is in view. */
  function initStars() {
    const row = document.querySelector(".stars");
    if (!row) return;
    const stars = Array.from(row.querySelectorAll("span"));
    if (!stars.length) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      row.classList.add("is-lit");
      return;
    }

    row.classList.add("is-armed");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.6) {
            row.classList.add("is-lit");
            return;
          }
          /* Reset only once it is fully out of view, so the stars replay on the way back. */
          if (entry.intersectionRatio === 0) {
            row.classList.remove("is-lit");
          }
        });
      },
      { threshold: [0, 0.6] }
    );
    observer.observe(row);
  }

  /* ---------------- left IT rail ---------------- */

  const IT_TOPICS = [
    {
      label: "ອຸປະກອນມືຖື",
      color: "219, 39, 119",
      icon: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/>',
    },
    {
      label: "AI & ອັດຕະໂນມັດ",
      color: "34, 211, 238",
      icon: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V5M9 13h.01M15 13h.01M9 16h6"/>',
    },
    {
      label: "AI / Machine Learning",
      color: "139, 92, 246",
      icon: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="M8 8.5 10.5 15M16 8.5 13.5 15M8 7h8"/>',
    },
    {
      label: "ຊີວະມິຕິ (Biometric)",
      color: "163, 230, 53",
      icon: '<path d="M12 3a9 9 0 0 0-9 9v3M21 12a9 9 0 0 0-4-7.5"/><path d="M5.5 12a6.5 6.5 0 0 1 11-4.7"/><path d="M9 12a3 3 0 0 1 6 0v4M12 12v7M15 19a4 4 0 0 0 3.5 2"/>',
    },
    {
      label: "IoT & Embedded",
      color: "45, 212, 191",
      icon: '<rect x="4" y="4" width="16" height="16" rx="3"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M8 2v2M16 2v2M8 20v2M16 20v2M2 8h2M2 16h2M20 8h2M20 16h2"/>',
    },
    {
      label: "Low-Code / No-Code",
      color: "244, 114, 182",
      icon: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    },
    {
      label: "Workflow Automation",
      color: "234, 179, 8",
      icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a3.5 3.5 0 0 1 3.5 3.5v4"/>',
    },
    {
      label: "Cloud-Native",
      color: "56, 189, 248",
      icon: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.3 10.5A3.75 3.75 0 0 0 7 19h10.5Z"/><path d="m12 12 1.5 1.5L12 15"/>',
    },
    {
      label: "Cybersecurity",
      color: "34, 197, 94",
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 11.5 2 2 4-4"/>',
    },
    {
      label: "Zero Trust",
      color: "239, 68, 68",
      icon: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/>',
    },
    {
      label: "Edge Computing",
      color: "249, 115, 22",
      icon: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><path d="M11 7h5a1 1 0 0 1 1 1v3M13 17H8a1 1 0 0 1-1-1v-3"/>',
    },
    {
      label: "5G & Connectivity",
      color: "168, 85, 247",
      icon: '<path d="M4 20V9M9 20V5M14 20v-8M19 20V7"/><path d="M2 20h20"/>',
    },
    {
      label: "Data Analytics",
      color: "6, 182, 212",
      icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    },
    {
      label: "Big Data",
      color: "99, 102, 241",
      icon: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    },
    {
      label: "DevOps & CI/CD",
      color: "20, 184, 166",
      icon: '<path d="M8.5 15.5A3.5 3.5 0 1 1 11 9.5l2 5a3.5 3.5 0 1 0 2.5-6"/>',
    },
    {
      label: "Containers & K8s",
      color: "59, 130, 246",
      icon: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    },
    {
      label: "RPA",
      color: "250, 204, 21",
      icon: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    },
    {
      label: "Blockchain",
      color: "217, 70, 239",
      icon: '<path d="M9 8H7a4 4 0 0 0 0 8h2M15 8h2a4 4 0 0 1 0 8h-2M8.5 12h7"/>',
    },
    {
      label: "AR / VR",
      color: "236, 72, 153",
      icon: '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a3 3 0 0 1-3 3h-2.5a2 2 0 0 1-1.6-.8l-1-1.4a1 1 0 0 0-1.6 0l-1 1.4a2 2 0 0 1-1.6.8H6a3 3 0 0 1-3-3V9Z"/><path d="M8 11h.01M16 11h.01"/>',
    },
    {
      label: "GPU Computing",
      color: "132, 204, 22",
      icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/>',
    },
  ];

  function renderItRail() {
    const tracks = [
      document.getElementById("it-rail-track"),
      document.getElementById("it-rail-track-right"),
    ].filter(Boolean);
    if (!tracks.length) return;

    const card = (item) => `
      <div class="it-card" style="--c: ${item.color}">
        <span class="it-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
        </span>
        <span class="it-card-label">${esc(item.label)}</span>
      </div>`;

    const group = IT_TOPICS.map(card).join("");
    tracks.forEach((track) => {
      track.innerHTML = `<div class="it-rail-group">${group}</div><div class="it-rail-group">${group}</div>`;
    });
  }

  /* ---------------- rotating role line ---------------- */

  const ROLE_TITLES = [
    "ຜູ້ຊ່ຽວຊານ IT Support & ຜູ້ດູແລລະບົບ ຢູ່ວຽງຈັນ, ສປປ ລາວ",
    "ຜູ້ຊ່ຽວຊານ System Administrator",
    "ຜູ້ຊ່ຽວຊານ Network Infrastructure",
    "ຜູ້ຊ່ຽວຊານ AI / Machine Learning Engineer",
    "ຜູ້ຊ່ຽວຊານ Prompt Engineer",
    "ຜູ້ຊ່ຽວຊານ Database Development",
    "ຜູ້ຊ່ຽວຊານ MLOps Engineer",
    "ຜູ້ຊ່ຽວຊານ Cloud & Virtualization",
    "ຜູ້ຊ່ຽວຊານ Cybersecurity & Governance",
    "ຜູ້ຊ່ຽວຊານ Automation & RPA",
  ];

  function initRoleTyper() {
    const el = document.getElementById("role-typer");
    if (!el) return;

    const line = el.closest(".hero-role");
    const roles = ROLE_TITLES.filter(Boolean);
    if (!roles.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof Intl === "undefined" || !Intl.Segmenter) {
      el.textContent = roles[0];
      return;
    }

    /* Lao vowels and tone marks belong to their consonant, so split by
       grapheme cluster — never by code unit — to keep the shaping correct. */
    const segmenter = new Intl.Segmenter("lo", { granularity: "grapheme" });
    const split = (text) => Array.from(segmenter.segment(text), (part) => part.segment);

    /* Reserve the height of the tallest role so the hero never jumps. */
    let tallest = 0;
    roles.forEach((role) => {
      el.textContent = role;
      tallest = Math.max(tallest, line.getBoundingClientRect().height);
    });
    line.style.minHeight = `${Math.ceil(tallest)}px`;

    const paint = (text) => {
      const glyphs = split(text);
      const fragment = document.createDocumentFragment();
      glyphs.forEach((glyph, index) => {
        /* Keep real text nodes for spaces: an inline-block span would swallow
           the line-break opportunity and the line could never wrap. */
        if (glyph === " ") {
          fragment.appendChild(document.createTextNode(" "));
          return;
        }
        const span = document.createElement("span");
        span.className = "glyph";
        span.style.setProperty("--i", String(index));
        span.textContent = glyph;
        fragment.appendChild(span);
      });
      el.textContent = "";
      el.appendChild(fragment);
      return glyphs.length;
    };

    let index = 0;

    const cycle = () => {
      const glyphCount = paint(roles[index % roles.length]);
      index += 1;
      window.setTimeout(() => {
        el.classList.add("fade");
        window.setTimeout(() => {
          el.classList.remove("fade");
          cycle();
        }, 240);
      }, glyphCount * 38 + 2600);
    };

    cycle();
  }

  function initParticles() {
    const mount = document.getElementById("particles");
    if (!mount) return;
    const total = window.innerWidth < 700 ? 12 : 22;
    const shapes = [];
    for (let i = 0; i < total; i += 1) {
      const size = 3 + Math.random() * 9;
      shapes.push(
        `<span class="particle" style="width:${size}px;height:${size}px;left:${Math.random() *
          100}%;top:${Math.random() * 100}%;opacity:${0.25 + Math.random() * 0.5}"></span>`
      );
    }
    mount.innerHTML = shapes.join("");
  }

  function initNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  function initForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const message = form.querySelector("#message");
    const counter = form.querySelector("#counter");
    const success = document.getElementById("form-success");

    if (message && counter) {
      const update = () => {
        counter.textContent = `${message.value.length}/2000`;
      };
      message.addEventListener("input", update);
      update();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.reset();
      if (counter) counter.textContent = "0/2000";
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => success.classList.remove("show"), 8000);
      }
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-q").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest(".faq-item").classList.toggle("open");
      });
    });
  }

  function initEvents() {
    if (filterBar) {
      filterBar.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        activeFilter = button.dataset.filter;
        filterBar.querySelectorAll(".filter").forEach((el) => {
          el.classList.toggle("active", el === button);
        });
        renderProjects();
      });
    }

    if (projectGrid) {
      projectGrid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-project]");
        if (button) openProject(button.dataset.project);
      });
    }

    if (modal) {
      modal.addEventListener("click", (event) => {
        if (
          event.target === modal ||
          event.target.closest(".modal-close")
        ) {
          closeProject();
        }
      });
    }

    if (certViewer) {
      certViewer.addEventListener("click", (event) => {
        const zoom = event.target.closest("[data-zoom]");
        if (zoom) {
          setViewerZoom(Number(zoom.dataset.zoom) * VIEWER_ZOOM_STEP);
          return;
        }
        if (event.target.closest("[data-zoom-reset]")) {
          resetViewerZoom();
          return;
        }
        const step = event.target.closest("[data-step]");
        if (step) {
          stepViewer(Number(step.dataset.step));
          return;
        }
        if (event.target === certViewer || event.target.closest(".modal-close")) {
          closeCertViewer();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeProject();
        closeCertViewer();
      }
      if (!certViewer || !certViewer.classList.contains("open")) return;
      if (event.key === "ArrowLeft") stepViewer(-1);
      if (event.key === "ArrowRight") stepViewer(1);
    });

    const fab = document.getElementById("fab");
    if (fab) {
      fab.addEventListener("click", () => {
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      });
    }

    document.querySelectorAll("[data-totop]").forEach((button) => {
      button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function init() {
    initParticles();
    initStatCounters();
    initStars();
    renderItRail();
    initRoleTyper();
    renderExperience();
    renderSkills();
    renderCertificates();
    renderSocialBar();
    renderFilters();
    renderProjects();
    initNav();
    initScroll();
    initReveal();
    initForm();
    initFaq();
    initEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
