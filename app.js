/*! © 2026 Смета 3D. Все права защищены. Копирование, изменение и использование кода на других сайтах запрещены. */
window.__SMETA_SITE__ = 1;
(() => {
  function te(t) {
    return (String(t || "").match(/-?\d+(?:\.\d+)?/g) || []).map(Number)
  }

  function Wn(t) {
    let e = 0;
    const n = /(\d+(?:\.\d+)?)\s*([dhms])/gi;
    let a;
    for (; a = n.exec(t || "");) e += +a[1] * {
      d: 86400,
      h: 3600,
      m: 60,
      s: 1
    } [a[2].toLowerCase()];
    return e
  }

  function Na(t) {
    return String(t || "").replace(/[^0-9a-zA-Zа-яА-ЯёЁ]/g, "").toLowerCase()
  }
  async function Ba(t, e) {
    const n = [],
      a = [],
      o = new Map;
    let s = null,
      i = null,
      r = null,
      c = 0,
      d = !0,
      u = !1,
      p = 0,
      x = 0,
      m = 0,
      L = 3e3;
    const P = {},
      M = (h, C, F) => Na(h) + "|" + C + "|" + F,
      E = (h, C, F) => {
        const w = Na(h) + "|" + C;
        let T = o.get(w);
        return T ? h.includes("[") && !T.name.includes("[") && (T.name = h) : (T = {
          name: h,
          copies: new Set,
          e: {},
          t: 0,
          boxes: {}
        }, o.set(w, T)), T.copies.add(String(F)), T
      },
      k = (h, C, F) => {
        s = E(h, C, F), i = M(h, C, F), r = s.boxes[F] || (s.boxes[F] = [1e9, 1e9, -1e9, -1e9])
      };
    let g = 0,
      y = 0;
    const b = h => {
        g++, g < 4e3 && n.push(h), a.push(h), a.length > 6e3 && a.splice(0, 3e3);
        const C = h.charCodeAt(0);
        if (C === 71) {
          const F = h.slice(1, 3);
          if (F === "1 " || F === "0 " || F === "2 " || F === "3 ") {
            const w = h.indexOf(";"),
              T = (w >= 0 ? h.slice(0, w) : h).split(/\s+/);
            let q = p,
              Y = x,
              I = 0;
            for (let X = 1; X < T.length; X++) {
              const U = T[X];
              if (!U) continue;
              const Z = U[0],
                A = parseFloat(U.slice(1));
              isFinite(A) && (Z === "X" ? q = u ? p + A : A : Z === "Y" ? Y = u ? x + A : A : Z === "E" ? d ? I = A : (I = A - m, m = A) : Z === "F" && A > 0 && (L = A))
            }
            const R = Math.hypot(q - p, Y - x);
            p = q, x = Y, s && (s.t += (R > 0 ? R : Math.abs(I)) / L * 60, I > 0 && R > 0 && (s.e[c] = (s.e[c] || 0) + I, q < r[0] ? r[0] = q : q > r[2] && (r[2] = q), Y < r[1] ? r[1] = Y : Y > r[3] && (r[3] = Y)))
          } else if (h.startsWith("G92")) {
            const w = /E(-?[\d.]+)/.exec(h.split(";")[0]);
            w && (m = +w[1])
          } else h.startsWith("G90") ? u = !1 : h.startsWith("G91") && (u = !0);
          return
        }
        if (C === 84) {
          const F = parseInt(h.slice(1), 10);
          F >= 0 && F < 64 && (c = F);
          return
        }
        if (C === 77) {
          if (h.startsWith("M83")) d = !0;
          else if (h.startsWith("M82")) d = !1;
          else if (h.startsWith("M620 S")) {
            const F = parseInt(h.slice(6), 10);
            /^M620 S\d+A/.test(h) && F < 64 && (c = F)
          } else if (h.startsWith("M486")) {
            const F = /^M486 S(-?\d+)(?: A"?([^"\n]*)"?)?/.exec(h);
            if (F) {
              const w = +F[1];
              F[2] != null ? P[w] = F[2] : w < 0 ? s = i = null : k(P[w] || "Модель " + (w + 1), String(w), "0")
            }
          }
          return
        }
        if (C === 59) {
          if (h.startsWith("; printing object")) {
            const F = /^; printing object (.+?)(?: id:(\d+) copy (\d+))?\s*$/.exec(h);
            F && k(F[1], F[2] || F[1], F[3] || "0")
          } else if (h.startsWith("; stop printing object")) {
            const F = /^; stop printing object (.+?)(?: id:(\d+) copy (\d+))?\s*$/.exec(h);
            (!F || M(F[1], F[2] || F[1], F[3] || "0") === i) && (s = i = null)
          } else if (h.startsWith("; MANUAL_TOOL_CHANGE T")) {
            const F = parseInt(h.slice(22), 10);
            F >= 0 && (c = F)
          }
          return
        }
        if (C === 69 && h.startsWith("EXCLUDE_OBJECT_")) {
          const F = /^EXCLUDE_OBJECT_(START|END) NAME=(\S+)/.exec(h);
          if (!F) return;
          const w = /^(.*)_id_(\d+)_copy_(\d+)$/.exec(F[2]),
            T = w ? w[1] : F[2],
            q = w ? w[2] : F[2],
            Y = w ? w[3] : "0";
          F[1] === "END" ? M(T, q, Y) === i && (s = i = null) : M(T, q, Y) !== i && k(T, q, Y)
        }
      },
      $ = t.stream().getReader(),
      j = new TextDecoder;
    let v = "";
    for (;;) {
      const {
        value: h,
        done: C
      } = await $.read();
      if (C) break;
      y += h.byteLength;
      const F = v + j.decode(h, {
          stream: !0
        }),
        w = F.split(`
`);
      v = w.pop();
      for (const T of w) b(T.endsWith("\r") ? T.slice(0, -1) : T);
      e && e(y / t.size)
    }
    return v && b(v), Pi(n.join(`
`) + `
` + a.join(`
`), o)
  }

  function Pi(t, e) {
    const n = w => {
        const T = w.exec(t);
        return T ? T[1].trim() : null
      },
      a = w => {
        const T = new RegExp("^; " + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + " = (.*)$", "m").exec(t);
        return T ? T[1].trim() : null
      },
      o = w => {
        const T = a(w);
        return T ? T.split(";").map(q => q.trim().replace(/^"|"$/g, "")) : []
      };
    let s = te(n(/^; filament used \[g\]\s*=\s*([\d.,\s]+?)$/m));
    s.length || (s = te(n(/total filament weight \[g\]\s*[:=]\s*([\d.,\s]+?)$/m)));
    const i = te(n(/^; filament used \[mm\]\s*=\s*([\d.,\s]+?)$/m)),
      r = te(n(/^; filament cost\s*=\s*([\d.,\s]+?)$/m)),
      c = o("filament_settings_id"),
      d = te(a("filament_cost")),
      u = te(a("filament_density")),
      p = (a("filament_type") || "").split(/[;,]/).map(w => w.trim().replace(/^"|"$/g, "")).filter(Boolean),
      x = [];
    s.forEach((w, T) => {
      w > 0 && x.push({
        slot: T + 1,
        name: c[T] || "Пластик " + (T + 1),
        grams: w,
        orcaPrice: d[T] || null,
        orcaCost: r[T] ?? null,
        density: u[T] || null,
        type: p[T] || ""
      })
    });
    const m = n(/total estimated time:\s*([^;\n]+)/) || n(/estimated printing time \(normal mode\)\s*=\s*([^\n]+)/),
      L = n(/model printing time:\s*([^;\n]+)/);
    let P = m ? Wn(m) : L ? Wn(L) : null;
    if (!P) {
      const w = /;TIME:(\d+)/.exec(t);
      w && (P = +w[1])
    }
    const M = te(a("activate_chamber_temp_control")),
      E = te(a("chamber_temperature") || a("chamber_temperatures"));
    let k = 0;
    x.forEach(w => {
      const T = w.slot - 1;
      T < E.length && (!M.length || M[T] > 0) && (k = Math.max(k, E[T]))
    });
    const y = ((a("printable_area") || "").match(/(-?[\d.]+)x(-?[\d.]+)/g) || []).map(w => w.split("x").map(Number)),
      b = y.length >= 3 ? [Math.min(...y.map(w => w[0])), Math.min(...y.map(w => w[1])), Math.max(...y.map(w => w[0])), Math.max(...y.map(w => w[1]))] : null,
      $ = [];
    for (const w of e.values()) {
      const T = w.copies.size,
        q = Object.values(w.e).reduce((R, X) => R + X, 0) / Math.max(1, T),
        Y = $.find(R => R.name === w.name && Math.abs(R._e - q) <= .02 * Math.max(q, R._e, 1e-9)),
        I = Object.values(w.boxes).filter(R => R[2] > R[0]);
      if (Y) {
        Y.copies += T, Y.t += w.t;
        for (const R in w.e) Y.e[R] = (Y.e[R] || 0) + w.e[R];
        Y.boxes.push(...I)
      } else $.push({
        name: w.name,
        copies: T,
        t: w.t,
        e: {
          ...w.e
        },
        _e: q,
        boxes: I
      })
    }
    const j = {},
      v = $.map(w => {
        const T = {};
        return x.forEach(q => {
          const Y = q.slot - 1,
            I = i[Y] > 0 ? q.grams / i[Y] : Math.PI * .875 * .875 * (q.density || 1.24) / 1e3;
          T[q.slot] = (w.e[Y] || 0) * I, j[q.slot] = (j[q.slot] || 0) + T[q.slot]
        }), T
      }),
      h = Object.values(j).reduce((w, T) => w + T, 0) || 1,
      C = $.reduce((w, T) => w + T.t, 0) || 1,
      F = $.map((w, T) => {
        const q = v[T],
          Y = Object.values(q).reduce((R, X) => R + X, 0),
          I = x.map(R => {
            const X = Math.max(0, R.grams - (j[R.slot] || 0)),
              U = j[R.slot] ? q[R.slot] / j[R.slot] : Y / h;
            return q[R.slot] + X * U
          });
        return {
          name: w.name.replace(/\.(stl|3mf|step|stp|obj|amf)$/i, ""),
          copies: w.copies,
          gramsBySlot: I,
          grams: I.reduce((R, X) => R + X, 0),
          timeS: (P || 0) * w.t / C,
          boxes: w.boxes
        }
      });
    return {
      filaments: x,
      grams: x.reduce((w, T) => w + T.grams, 0),
      machineS: P,
      chamberC: k,
      bed: b,
      objects: F,
      overheadG: Math.max(0, x.reduce((w, T) => w + T.grams, 0) - Object.values(j).reduce((w, T) => w + T, 0)),
      orcaCost: +n(/^; total filament cost\s*=\s*([\d.]+)/m) || (x.some(w => w.orcaCost) ? x.reduce((w, T) => w + (T.orcaCost || 0), 0) : null),
      printer: (a("printer_settings_id") || "").replace(/^"|"$/g, ""),
      process: (a("print_settings_id") || "").replace(/^"|"$/g, ""),
      model: (a("printer_model") || "").replace(/^"|"$/g, ""),
      changes: +n(/total filament change\s*=\s*(\d+)/) || 0,
      settings: {
        layer: +a("layer_height") || null,
        walls: +(a("wall_loops") || a("perimeters")) || null,
        infill: parseFloat(a("sparse_infill_density") || a("fill_density") || "") || null,
        top: +(a("top_shell_layers") || a("top_solid_layers")) || null,
        bottom: +(a("bottom_shell_layers") || a("bottom_solid_layers")) || null,
        nozzle: te(a("nozzle_diameter"))[0] || null,
        supports: /^(1|true)$/i.test(a("enable_support") || a("support_material") || "0"),
        modelS: L ? Wn(L) : null
      }
    }
  }
  const Kn = Math.PI * .875 * .875,
    Fi = -Math.cos(Math.PI / 4),
    ee = ["fdm", "sla", "dlp", "lcd", "sls"],
    tt = new Set(["sla", "dlp", "lcd"]),
    Nt = {
      fdm: {
        name: "FDM",
        long: "FDM (печать пластиковой нитью)",
        plates: "Столов",
        mat: "Пластик"
      },
      sla: {
        name: "SLA",
        long: "SLA (лазерная стереолитография)",
        plates: "Столов",
        mat: "Смола"
      },
      dlp: {
        name: "DLP",
        long: "DLP (фотополимер, засветка проектором)",
        plates: "Столов",
        mat: "Смола"
      },
      lcd: {
        name: "LCD",
        long: "LCD/MSLA (фотополимер, засветка через экран)",
        plates: "Столов",
        mat: "Смола"
      },
      sls: {
        name: "SLS",
        long: "SLS (спекание порошка)",
        plates: "Запусков",
        mat: "Порошок"
      }
    },
    cn = t => tt.has(t) ? "resin" : t,
    me = {
      tContour: .95,
      vOuter: 200,
      vInner: 300,
      vInfill: 270,
      vSolid: 250,
      vSupport: 150,
      vFirst: 50,
      accel: 8e3,
      vOv2: 50,
      vOv3: 30,
      vOv4: 10,
      vBridge: 50
    },
    dn = {
      tContour: .95,
      vOv2: 40,
      vOv3: 25,
      vOv4: 10,
      vBridge: 30
    },
    un = [{
      id: "d600",
      tech: "fdm",
      name: "CreatBot D600 Pro3 HS",
      bedX: 620,
      bedY: 620,
      bedZ: 620,
      price: 1e6,
      life: 2e4,
      maint: 50,
      power: 450,
      warmup: 12,
      chamberPower: 1200,
      chamberMin: 25,
      maxFlow: 60,
      vOuter: 150,
      vInner: 250,
      vInfill: 300,
      vSolid: 200,
      vSupport: 150,
      vFirst: 40,
      accel: 5e3,
      ...dn,
      tContour: 1.1,
      timeCal: 1
    }, {
      id: "k1max",
      tech: "fdm",
      off: !0,
      name: "Creality K1 Max",
      bedX: 300,
      bedY: 300,
      bedZ: 300,
      price: 85e3,
      life: 5e3,
      maint: 15,
      power: 300,
      warmup: 3,
      chamberPower: 0,
      chamberMin: 0,
      maxFlow: 32,
      ...me,
      timeCal: 1
    }, {
      id: "p1s",
      tech: "fdm",
      off: !0,
      name: "Bambu Lab P1S",
      bedX: 256,
      bedY: 256,
      bedZ: 256,
      price: 75e3,
      life: 6e3,
      maint: 12,
      power: 130,
      warmup: 6,
      maxFlow: 28,
      ...me,
      timeCal: 1
    }, {
      id: "x1c",
      tech: "fdm",
      off: !0,
      name: "Bambu Lab X1 Carbon",
      bedX: 256,
      bedY: 256,
      bedZ: 256,
      price: 13e4,
      life: 6e3,
      maint: 15,
      power: 140,
      warmup: 7,
      maxFlow: 28,
      ...me,
      timeCal: 1
    }, {
      id: "a1",
      tech: "fdm",
      off: !0,
      name: "Bambu Lab A1",
      bedX: 256,
      bedY: 256,
      bedZ: 256,
      price: 45e3,
      life: 5e3,
      maint: 10,
      power: 95,
      warmup: 5,
      maxFlow: 25,
      ...me,
      timeCal: 1
    }, {
      id: "a1m",
      tech: "fdm",
      off: !0,
      name: "Bambu Lab A1 mini",
      bedX: 180,
      bedY: 180,
      bedZ: 180,
      price: 28e3,
      life: 4e3,
      maint: 8,
      power: 80,
      warmup: 4,
      maxFlow: 22,
      ...me,
      timeCal: 1
    }, {
      id: "mk4s",
      tech: "fdm",
      off: !0,
      name: "Prusa MK4S",
      bedX: 250,
      bedY: 210,
      bedZ: 220,
      price: 12e4,
      life: 7e3,
      maint: 12,
      power: 100,
      warmup: 4,
      maxFlow: 25,
      vOuter: 170,
      vInner: 200,
      vInfill: 200,
      vSolid: 200,
      vSupport: 120,
      vFirst: 40,
      accel: 4e3,
      ...dn,
      timeCal: 1
    }, {
      id: "k1c",
      tech: "fdm",
      off: !0,
      name: "Creality K1C",
      bedX: 220,
      bedY: 220,
      bedZ: 250,
      price: 45e3,
      life: 4e3,
      maint: 12,
      power: 150,
      warmup: 5,
      maxFlow: 24,
      ...me,
      timeCal: 1
    }, {
      id: "e3v3",
      tech: "fdm",
      off: !0,
      name: "Creality Ender-3 V3 SE",
      bedX: 220,
      bedY: 220,
      bedZ: 250,
      price: 18e3,
      life: 3e3,
      maint: 8,
      power: 120,
      warmup: 6,
      maxFlow: 15,
      vOuter: 120,
      vInner: 180,
      vInfill: 180,
      vSolid: 150,
      vSupport: 100,
      vFirst: 40,
      accel: 2500,
      ...dn,
      timeCal: 1
    }, {
      id: "voron",
      tech: "fdm",
      off: !0,
      name: "Voron 2.4 (350)",
      bedX: 350,
      bedY: 350,
      bedZ: 340,
      price: 18e4,
      life: 8e3,
      maint: 18,
      power: 250,
      warmup: 10,
      maxFlow: 30,
      vOuter: 200,
      vInner: 300,
      vInfill: 300,
      vSolid: 250,
      vSupport: 150,
      vFirst: 60,
      accel: 7e3,
      ...dn,
      timeCal: 1
    }, {
      id: "plus4",
      tech: "fdm",
      off: !0,
      name: "Qidi Plus4",
      bedX: 305,
      bedY: 305,
      bedZ: 280,
      price: 85e3,
      life: 6e3,
      maint: 15,
      power: 220,
      warmup: 8,
      maxFlow: 28,
      ...me,
      timeCal: 1
    }, {
      id: "isla600",
      tech: "sla",
      name: "Промышленный SLA 600×600×400",
      bedX: 600,
      bedY: 600,
      bedZ: 400,
      price: 9e6,
      life: 3e4,
      maint: 400,
      power: 2500,
      warmup: 20,
      overhead: 12,
      areaRate: 600,
      timeCal: 1
    }, {
      id: "isla450",
      tech: "sla",
      name: "Промышленный SLA 450×450×350",
      bedX: 450,
      bedY: 450,
      bedZ: 350,
      price: 6e6,
      life: 3e4,
      maint: 300,
      power: 2e3,
      warmup: 20,
      overhead: 11,
      areaRate: 450,
      timeCal: 1
    }, {
      id: "form3p",
      tech: "sla",
      name: "Formlabs Form 3+",
      bedX: 145,
      bedY: 145,
      bedZ: 185,
      price: 4e5,
      life: 6e3,
      maint: 60,
      power: 70,
      warmup: 10,
      overhead: 8,
      areaRate: 45,
      timeCal: 1
    }, {
      id: "form3l",
      tech: "sla",
      name: "Formlabs Form 3L (2 лазера)",
      bedX: 335,
      bedY: 200,
      bedZ: 300,
      price: 15e5,
      life: 8e3,
      maint: 150,
      power: 150,
      warmup: 15,
      overhead: 14,
      areaRate: 90,
      timeCal: 1
    }, {
      id: "idlp",
      tech: "dlp",
      name: "Промышленный DLP 190×120×200",
      bedX: 192,
      bedY: 120,
      bedZ: 200,
      price: 3e6,
      life: 2e4,
      maint: 150,
      power: 400,
      warmup: 10,
      exp: 1.2,
      bottomExp: 10,
      bottomLayers: 4,
      lift: 3,
      timeCal: 1
    }, {
      id: "d2",
      tech: "dlp",
      name: "Anycubic Photon D2 (DLP)",
      bedX: 131,
      bedY: 73,
      bedZ: 165,
      price: 35e3,
      life: 5e3,
      maint: 12,
      power: 55,
      warmup: 5,
      exp: 1.6,
      bottomExp: 20,
      bottomLayers: 4,
      lift: 4,
      timeCal: 1
    }, {
      id: "asiga",
      tech: "dlp",
      name: "Asiga MAX UV (DLP)",
      bedX: 119,
      bedY: 67,
      bedZ: 75,
      price: 18e5,
      life: 15e3,
      maint: 90,
      power: 120,
      warmup: 8,
      exp: .9,
      bottomExp: 8,
      bottomLayers: 3,
      lift: 2.4,
      timeCal: 1
    }, {
      id: "sat4u",
      tech: "lcd",
      name: "Elegoo Saturn 4 Ultra 16K",
      bedX: 211,
      bedY: 118,
      bedZ: 220,
      price: 45e3,
      life: 3e3,
      maint: 25,
      power: 70,
      warmup: 5,
      exp: 2.2,
      bottomExp: 25,
      bottomLayers: 4,
      lift: 2.6,
      timeCal: 1
    }, {
      id: "m7pro",
      tech: "lcd",
      name: "Anycubic Photon Mono M7 Pro",
      bedX: 223,
      bedY: 126,
      bedZ: 230,
      price: 38e3,
      life: 3e3,
      maint: 25,
      power: 70,
      warmup: 5,
      exp: 2,
      bottomExp: 25,
      bottomLayers: 4,
      lift: 4,
      timeCal: 1
    }, {
      id: "mighty",
      tech: "lcd",
      name: "Phrozen Sonic Mighty Revo",
      bedX: 298,
      bedY: 164,
      bedZ: 300,
      price: 6e4,
      life: 3e3,
      maint: 30,
      power: 90,
      warmup: 5,
      exp: 1.8,
      bottomExp: 22,
      bottomLayers: 4,
      lift: 4.5,
      timeCal: 1
    }, {
      id: "form4",
      tech: "lcd",
      name: "Formlabs Form 4 (MSLA)",
      bedX: 200,
      bedY: 125,
      bedZ: 210,
      price: 6e5,
      life: 6e3,
      maint: 60,
      power: 150,
      warmup: 8,
      exp: .8,
      bottomExp: 8,
      bottomLayers: 4,
      lift: 1.6,
      timeCal: 1
    }, {
      id: "fuse1",
      tech: "sls",
      name: "Formlabs Fuse 1+ 30W",
      bedX: 165,
      bedY: 165,
      bedZ: 300,
      price: 35e5,
      life: 15e3,
      maint: 150,
      power: 1500,
      warmup: 60,
      recoat: 12,
      scanRate: 230,
      cool: 0,
      timeCal: 1
    }, {
      id: "lisax",
      tech: "sls",
      name: "Sinterit Lisa X",
      bedX: 130,
      bedY: 180,
      bedZ: 330,
      price: 22e5,
      life: 12e3,
      maint: 120,
      power: 1100,
      warmup: 90,
      recoat: 25,
      scanRate: 100,
      cool: 120,
      timeCal: 1
    }, {
      id: "eos396",
      tech: "sls",
      name: "EOS P 396 (промышленный)",
      bedX: 340,
      bedY: 340,
      bedZ: 600,
      price: 35e6,
      life: 3e4,
      maint: 900,
      power: 6e3,
      warmup: 120,
      recoat: 6,
      scanRate: 1500,
      cool: 0,
      timeCal: 1
    }],
    Hi = "октябрь 2026",
    fn = [{
      id: "pla",
      tech: "fdm",
      name: "PLA",
      price: 1700,
      density: 1.24,
      maxFlow: 21,
      minLayer: 4
    }, {
      id: "plam",
      tech: "fdm",
      name: "PLA Matte",
      price: 1800,
      density: 1.32,
      maxFlow: 18,
      minLayer: 4
    }, {
      id: "petg",
      tech: "fdm",
      name: "PETG",
      price: 1700,
      density: 1.27,
      maxFlow: 16,
      minLayer: 8
    }, {
      id: "abs",
      tech: "fdm",
      name: "ABS",
      price: 1700,
      density: 1.04,
      maxFlow: 20,
      minLayer: 5
    }, {
      id: "asa",
      tech: "fdm",
      name: "ASA",
      price: 1800,
      density: 1.07,
      maxFlow: 18,
      minLayer: 5
    }, {
      id: "hips",
      tech: "fdm",
      name: "HIPS",
      price: 1600,
      density: 1.04,
      maxFlow: 18,
      minLayer: 5
    }, {
      id: "tpu",
      tech: "fdm",
      name: "TPU 95A",
      price: 2400,
      density: 1.21,
      maxFlow: 4,
      minLayer: 10
    }, {
      id: "petgcf",
      tech: "fdm",
      name: "PETG-CF",
      price: 2600,
      density: 1.29,
      maxFlow: 12,
      minLayer: 8
    }, {
      id: "pa",
      tech: "fdm",
      name: "PA (нейлон)",
      price: 3300,
      density: 1.14,
      maxFlow: 12,
      minLayer: 6
    }, {
      id: "pacf",
      tech: "fdm",
      name: "PA6-CF (нейлон)",
      price: 6500,
      density: 1.12,
      maxFlow: 12,
      minLayer: 6
    }, {
      id: "pc",
      tech: "fdm",
      name: "PC (поликарбонат)",
      price: 3400,
      density: 1.2,
      maxFlow: 14,
      minLayer: 6
    }, {
      id: "ppsgf",
      tech: "fdm",
      name: "PPS-GF",
      price: 6500,
      density: 1.3,
      maxFlow: 10,
      minLayer: 8
    }, {
      id: "r_ind",
      tech: "resin",
      name: "Промышленная SLA-смола",
      price: 12e3,
      density: 1.13,
      expMult: 1
    }, {
      id: "r_std",
      tech: "resin",
      name: "Стандартная смола",
      price: 1900,
      density: 1.1,
      expMult: 1
    }, {
      id: "r_abs",
      tech: "resin",
      name: "ABS-like смола",
      price: 2500,
      density: 1.12,
      expMult: 1.15
    }, {
      id: "r_wash",
      tech: "resin",
      name: "Водосмываемая смола",
      price: 2500,
      density: 1.1,
      expMult: 1.1
    }, {
      id: "r_8k",
      tech: "resin",
      name: "Детализированная 8K",
      price: 3100,
      density: 1.1,
      expMult: 1.1
    }, {
      id: "r_tough",
      tech: "resin",
      name: "Инженерная (Tough)",
      price: 3500,
      density: 1.15,
      expMult: 1.3
    }, {
      id: "r_ind2",
      tech: "resin",
      name: "Промышленная инженерная (HARZ Industrial)",
      price: 10500,
      density: 1.15,
      expMult: 1.3
    }, {
      id: "r_dent",
      tech: "resin",
      name: "Стоматологическая (модели)",
      price: 1e4,
      density: 1.12,
      expMult: 1.1
    }, {
      id: "r_cast",
      tech: "resin",
      name: "Выжигаемая (литьё)",
      price: 9e3,
      density: 1.08,
      expMult: 1.4
    }, {
      id: "pa12",
      tech: "sls",
      name: "PA12 (нейлон)",
      price: 9e3,
      density: 1.01,
      bulk: .45,
      refresh: 30
    }, {
      id: "pa11",
      tech: "sls",
      name: "PA11",
      price: 11e3,
      density: 1.05,
      bulk: .48,
      refresh: 30
    }, {
      id: "pa12gf",
      tech: "sls",
      name: "PA12 GF (стекловолокно)",
      price: 11500,
      density: 1.3,
      bulk: .62,
      refresh: 30
    }, {
      id: "tpu90",
      tech: "sls",
      name: "TPU 90A",
      price: 14e3,
      density: 1.1,
      bulk: .45,
      refresh: 20
    }],
    re = {
      fdm: {
        printer: "d600",
        material: "abs"
      },
      sla: {
        printer: "isla600",
        material: "r_ind"
      },
      dlp: {
        printer: "idlp",
        material: "r_std"
      },
      lcd: {
        printer: "sat4u",
        material: "r_std"
      },
      sls: {
        printer: "fuse1",
        material: "pa12"
      }
    },
    Ri = {
      pla: {
        minLayer: [6, 4],
        price: [1400, 1700]
      },
      plam: {
        minLayer: [6, 4],
        price: [1600, 1800]
      },
      petg: {
        price: [1500, 1700]
      },
      abs: {
        price: [2500, 1700]
      },
      asa: {
        price: [2e3, 1800]
      },
      tpu: {
        price: [2600, 2400]
      },
      pacf: {
        price: [5500, 6500]
      },
      pc: {
        price: [3500, 3400]
      },
      ppsgf: {
        price: [5500, 6500]
      },
      r_ind: {
        price: [9e3, 12e3]
      },
      r_std: {
        price: [2500, 1900]
      },
      r_abs: {
        price: [3e3, 2500]
      },
      r_wash: {
        price: [3200, 2500]
      },
      r_8k: {
        price: [4e3, 3100]
      },
      r_tough: {
        price: [6500, 3500]
      },
      fuse1: {
        recoat: [14, 12],
        scanRate: [110, 230]
      },
      lisax: {
        recoat: [16, 25],
        scanRate: [60, 100],
        cool: [0, 120]
      },
      eos396: {
        recoat: [9, 6],
        scanRate: [600, 1500]
      }
    },
    Ya = {
      preset: "standard",
      nozzle: .6,
      layer: .3,
      walls: 2,
      top: 5,
      bottom: 3,
      infill: 15,
      supports: "auto",
      supportType: "tree",
      brim: !1
    },
    Jn = {
      share: "shared",
      fill: 60,
      preset: "draft",
      layer: .1,
      supports: "auto",
      density: "medium",
      tilt: 0,
      hollow: !1,
      wall: 2.5,
      washMin: 20,
      washCost: 120
    },
    Xa = {
      layer: .11,
      packing: 10,
      unpackMin: 40,
      mG: 0,
      mH: 0,
      mT: 0,
      share: "own",
      fill: 60
    },
    mn = {
      leadDays: 0,
      name: "Стакан-корпус",
      qty: 1,
      perPlate: 0,
      postMin: 3,
      inserts: 0,
      paintOn: !1,
      packOn: !1,
      minOn: !0,
      scaleLock: !0,
      color: ""
    },
    Qn = {
      markup: 100,
      adjust: 0,
      minOrder: 500,
      taxRev: 0,
      vat: 22,
      rate: 600,
      setupMin: 15,
      plateMin: 5,
      cadH: 0,
      cadRate: 1500,
      packaging: 100,
      paintPrice: 300,
      insertPrice: 12,
      kwh: 7.5,
      risk: 5,
      waste: 5,
      printers: 1,
      hoursPerDay: 20,
      twoRate: !1,
      kwhNight: 3.5,
      nightFrom: 23,
      nightTo: 7,
      rushPct: 30,
      chamber: !1,
      deadline: "",
      start: "",
      busyUntil: "",
      presets: [{
        n: "Розница",
        v: 100
      }, {
        n: "Опт",
        v: 50
      }, {
        n: "Свои",
        v: 30
      }],
      mgrTol: 25,
      baseMarkup: null,
      shopName: "",
      shopInfo: "",
      kpPay: "",
      kpDays: 14,
      maxDays: 60,
      cEmail: "",
      cTg: "",
      cWa: "",
      offDays: "",
      kpTpl: "",
      logo: "",
      logoBg: !1,
      brand: "",
      modMin: 1000,
      modH: {
        foto: {
          s: [1, 2],
          m: [3, 6],
          c: [8, 16]
        },
        draw: {
          s: [.5, 1],
          m: [2, 4],
          c: [5, 10]
        },
        mod: {
          s: [.5, 1],
          m: [1, 3],
          c: [3, 6]
        },
        scan: {
          s: [2, 4],
          m: [4, 8],
          c: [10, 20]
        }
      },
      modK: {
        dims: 25,
        fit: 30,
        rush: 50,
        more: 70
      },
      modE: {
        shape: {
          plate: .75,
          box: 1.5,
          rev: .75,
          org: 6
        },
        type: {
          foto: 1,
          draw: .7,
          mod: .5,
          scan: 1.2
        },
        size: {
          s: 1,
          m: 1.15,
          l: 1.35
        },
        acc: {
          a: 1,
          e: 1.3
        },
        feat: {
          hole: 5,
          thread: 15,
          clip: 20,
          edge: 3,
          rib: 10,
          text: 30,
          fit: 45
        },
        lo: 80,
        hi: 140
      },
      prepMk: 0,
      minMode: "gross",
      optOn: !0,
      opt: [{
        q: 10,
        d: 5
      }, {
        q: 50,
        d: 10
      }, {
        q: 100,
        d: 15
      }]
    },
    pn = {
      fdm: {
        draft: {
          name: "Черновой",
          spec: "0.28 · 10%",
          set: t => ({
            layer: t >= .6 ? .4 : .28,
            walls: 2,
            top: 4,
            bottom: 3,
            infill: 10
          })
        },
        standard: {
          name: "Стандарт",
          spec: "0.20 · 15%",
          set: t => ({
            layer: t >= .6 ? .3 : .2,
            walls: 2,
            top: 5,
            bottom: 3,
            infill: 15
          })
        },
        strong: {
          name: "Прочный",
          spec: "4 стенки · 40%",
          set: t => ({
            layer: t >= .6 ? .3 : .2,
            walls: 4,
            top: 6,
            bottom: 4,
            infill: 40
          })
        },
        fine: {
          name: "Детальный",
          spec: "0.12 · 15%",
          set: t => ({
            layer: t <= .2 ? .08 : .12,
            walls: 3,
            top: 7,
            bottom: 5,
            infill: 15
          })
        }
      },
      resin: {
        draft: {
          name: "Быстрый",
          spec: "0.10",
          set: () => ({
            layer: .1,
            hollow: !1
          })
        },
        standard: {
          name: "Стандарт",
          spec: "0.05",
          set: () => ({
            layer: .05,
            hollow: !1
          })
        },
        fine: {
          name: "Детальный",
          spec: "0.03",
          set: () => ({
            layer: .03,
            hollow: !1
          })
        },
        hollow: {
          name: "Полый",
          spec: "0.05 · стенка 2.5",
          set: () => ({
            layer: .05,
            hollow: !0,
            wall: 2.5
          })
        }
      }
    },
    Ua = [{
      k: "batch",
      l: "Тираж",
      d: "Несколько штук, раскладка по столам, цена за тираж"
    }, {
      k: "post",
      l: "Постобработка",
      d: "Минуты ручной работы на каждую деталь"
    }, {
      k: "extras",
      l: "Моделирование",
      d: "Моделирование, добавленное из раздела «Моделирование»"
    }, {
      k: "schedule",
      l: "Сроки",
      d: "Срок клиента, очередь принтера, наценка за срочность"
    }, {
      k: "labor",
      l: "Оператор",
      d: "Приём заказа, обслуживание стола или камеры, мойка"
    }, {
      k: "energy",
      l: "Электричество",
      d: "Расход принтера и камеры, день и ночь по тарифу"
    }, {
      k: "risk",
      l: "Брак и потери",
      d: "Резерв на перепечатки и отходы материала"
    }, {
      k: "discount",
      l: "Скидки, минимум",
      d: "Скидка или срочность, минимальная сумма заказа"
    }, {
      k: "tax",
      l: "Налоги",
      d: "Налог с выручки и НДС"
    }, {
      k: "basket",
      l: "Список заказа",
      d: "Несколько разных деталей в одном расчёте"
    }, {
      k: "kp",
      l: "Текст КП",
      d: "Готовый текст предложения для клиента"
    }],
    hn = Object.fromEntries(Ua.map(t => [t.k, !0])),
    Oi = [.06, .08, .1, .12, .16, .2, .24, .28, .32, .4, .48, .56],
    pe = "fdmcalc.v1.",
    nt = {
      get(t, e) {
        try {
          const n = localStorage.getItem(pe + t);
          return n ? JSON.parse(n) : e
        } catch {
          return e
        }
      },
      set(t, e) {
        try {
          localStorage.setItem(pe + t, JSON.stringify(e))
        } catch {}
      },
      del(t) {
        try {
          localStorage.removeItem(pe + t)
        } catch {}
      },
      has(t) {
        try {
          return localStorage.getItem(pe + t) !== null
        } catch {
          return !1
        }
      }
    },
    st = t => JSON.parse(JSON.stringify(t)),
    he = (t, e) => Number.isFinite(+t) ? +t : e;

  function zi(t, e) {
    return e === "printers" ? t.tech === "sla" && t.exp !== void 0 && t.areaRate === void 0 ? "lcd" : t.tech || "fdm" : t.tech === "sla" || t.tech === "resin" ? "resin" : t.tech || "fdm"
  }
  let loK = !1,
    loCh = nt.get("lo.chamber", {}) || {};

  function loC(m) {
    return m && m.id != null && m.id in loCh && !(l.mode !== "staff" && l.mode !== "pro" && typeof ei == "function" && ei("chamber") === !1) ? loCh[m.id] : m && m.chamber
  }

  function loDA(c, b) {
    c = c || [], b = b || [];
    const d = {
      c: {},
      a: [],
      r: []
    };
    for (const o of c) {
      const x = b.find(y => y.id === o.id);
      if (!x) {
        d.a.push(o);
        continue
      }
      const h = {};
      for (const k in o) Ot(o[k], x[k]) || (h[k] = o[k]);
      for (const k in x) k in o || (h[k] = "~del~");
      Object.keys(h).length && (d.c[o.id] = h)
    }
    for (const x of b) c.some(o => o.id === x.id) || d.r.push(x.id);
    return d.a.length || d.r.length || Object.keys(d.c).length ? d : null
  }

  function loAA(b, d) {
    let r = st(b || []);
    if (!d) return r;
    r = r.filter(o => !(d.r || []).includes(o.id));
    for (const o of r) {
      const h = (d.c || {})[o.id];
      if (h)
        for (const k in h) h[k] === "~del~" ? delete o[k] : o[k] = st(h[k])
    }
    for (const o of d.a || []) r.some(x => x.id === o.id) || r.push(st(o));
    return r
  }

  function loDO(c, b) {
    c = c || {}, b = b || {};
    const h = {};
    for (const k in c) Ot(c[k], b[k]) || (h[k] = c[k]);
    for (const k in b) k in c || (h[k] = "~del~");
    return Object.keys(h).length ? h : null
  }

  function loAO(b, d) {
    const r = st(b || {});
    if (d)
      for (const k in d) d[k] === "~del~" ? delete r[k] : r[k] = st(d[k]);
    return r
  }

  function loN(d) {
    return d ? Array.isArray(d.a) ? d.a.length + d.r.length + Object.keys(d.c).length : Object.keys(d).length : 0
  }

  function loSync(o) {
    const cli = !["staff", "pro", "friend"].includes(l.access);
    let n = 0;
    for (const t of ["printers", "materials", "vis", "blocks", "massCal"]) {
      const A = Array.isArray(K[t]);
      let d = nt.get(t + ".d", null);
      if (!d && o[t]) {
        if (t === "materials" && cli)
          for (const m of l.materials) {
            const x = K.materials.find(y => y.id === m.id);
            m.chamber != null && x && !Ot(m.chamber, x.chamber) && (loCh[m.id] = !!m.chamber)
          }
        d = cli ? null : A ? loDA(l[t], K[t]) : loDO(l[t], K[t]), nt.del(t), d && nt.set(t + ".d", d)
      }
      l[t] = A ? loAA(K[t], d) : loAO(K[t], d), n += loN(d)
    }
    nt.set("lo.chamber", loCh);
    const p = nt.get("ratesAt", null);
    nt.set("ratesAt", K.at || null), p && K.at && p !== K.at && !nt.get("fr.state", null) && (n ? setTimeout(() => {
      xe("Ставки обновлены", `<p>Мастерская опубликовала новые ставки${K.at?" от "+new Date(K.at).toLocaleString("ru-RU"):""}, они уже применены.</p><p>В этом браузере есть ваши правки принтеров, материалов или настроек (${n}). Они наложены поверх новых ставок. Сбросить их, чтобы считать точно по ставкам мастерской?</p>`, '<div class="right"><button class="btn" type="button" id="loKeep">Оставить мои правки</button><button class="btn primary" type="button" id="loReset">Сбросить мои правки</button></div>'), f("loKeep").onclick = Mt, f("loReset").onclick = () => {
        Mt(), loReset()
      }
    }, 0) : setTimeout(() => V("Ставки мастерской обновлены"), 0))
  }

  function loReset() {
    for (const t of ["printers", "materials", "vis", "blocks", "massCal"]) nt.del(t + ".d"), nt.del(t);
    loCh = {}, nt.del("lo.chamber"), tr()
  }

  function Za(t, e) {
    {
      const D = nt.get(t + ".d", null);
      if (D) return loAA(e, D)
    }
    const n = new Set(nt.get("seen." + t, []));
    let a = nt.get(t, null);
    if (!Array.isArray(a) || !a.length) a = st(e);
    else {
      a = a.map(o => {
        const s = zi(o, t),
          r = e.find(u => u.id === o.id) || e.find(u => u.tech === s) || e[0],
          c = {
            ...r,
            ...o,
            tech: s
          };
        for (const u in r) typeof r[u] == "number" && !Number.isFinite(+c[u]) && (c[u] = r[u]);
        const d = Ri[o.id];
        if (d)
          for (const u in d) + c[u] === d[u][0] && (c[u] = d[u][1]);
        return c
      });
      for (const o of e) !n.has(o.id) && !a.some(s => s.id === o.id) && a.push(st(o))
    }
    return nt.set("seen." + t, e.map(o => o.id)), a
  }

  function Ii() {
    const t = nt.get("sel", null) || {},
      e = st(re);
    for (const a of ee) t[a] && (e[a] = {
      ...e[a],
      ...t[a]
    });
    t.sla && t.sla.printer && !["form3p", "form3l"].includes(t.sla.printer) && !t.lcd && (e.lcd = {
      ...e.lcd,
      ...t.sla
    }, e.sla = st(re.sla)), nt.get("v4sla", !1) || (e.sla = st(re.sla), e.dlp = st(re.dlp), nt.set("v4sla", !0));
    const n = nt.get("printerId", null);
    return !nt.get("sel", null) && n && (e.fdm = {
      printer: n,
      material: nt.get("materialId", "pla")
    }), e
  }

  function ji() {
    const t = nt.get("manual", {}) || {};
    return {
      g: Number.isFinite(+t.g) ? +t.g : +t.vol > 0 ? +t.vol * 1.24 : 0,
      h: he(t.h, 0),
      m: he(t.m, 0),
      chamber: t.chamber ?? null
    }
  }

  function qi() {
    const t = nt.get("manualResin", null) || nt.get("manualSla", {}) || {};
    return {
      ml: he(t.ml ?? t.vol, 0),
      h: he(t.h, 0),
      m: he(t.m, 0)
    }
  }

  function Di() {
    const t = nt.get("sup", {}) || {};
    return {
      cfg: {
        fdm: {
          ...(t.cfg || {}).fdm || {}
        },
        resin: {
          ...(t.cfg || {}).resin || {}
        },
        fdm2: {
          ...(t.cfg || {}).fdm2 || {}
        }
      },
      raft: {
        fdm: "none",
        resin: "std",
        ...t.raft || {}
      },
      lift: +t.lift > 0 ? +t.lift : 5,
      lattice: ["none", "braces", "scaffold"].includes(t.lattice) ? t.lattice : "braces",
      stab: t.stab !== !1
    }
  }
  const ta = {
      staff: {
        s: "976d8469da111b9d3ebd6f85a5ae2bf3",
        i: 6e5,
        h: "05505099ef2e904a8e75b3283e769a81cdbc781aa0ef60166a21bf57e32f5f73"
      },
      pro: {
        s: "31a34cadd517d24819e857e8d89ca12b",
        i: 6e5,
        h: "cb742b414494436a025cf7278c283a795d2010f075d914b93ec952efbd79626c"
      },
      friend: {
        s: "6b46344da5315cae6d7b2279cd6f844e",
        i: 6e5,
        h: "89fdd5956a9aab66bc2a5a5f8e73ff0a4724b57aed4dedee48f073d86ea0c8e4"
      }
    },
    Va = t => [...new Uint8Array(t)].map(e => e.toString(16).padStart(2, "0")).join(""),
    _i = t => new Uint8Array(t.match(/../g).map(e => parseInt(e, 16)));
  async function Ga(t, e, n) {
    const a = await crypto.subtle.importKey("raw", new TextEncoder().encode(t), "PBKDF2", !1, ["deriveBits"]);
    return Va(await crypto.subtle.deriveBits({
      name: "PBKDF2",
      hash: "SHA-256",
      salt: _i(e),
      iterations: n
    }, a, 256))
  }
  let loD = null,
    loRem = !1;
  const loM0 = nt.get("mode", "simple");
  async function loSha(h) {
    return Va(await crypto.subtle.digest("SHA-256", _i(h)))
  }
  async function loChk(D, e) {
    return !!e && !!D && (e.h2 ? await loSha(D) === e.h2 : D === e.h)
  }
  async function ea(t, e) {
    if (!e || !t) return !1;
    const D = await Ga(t, e.s, e.i);
    return await loChk(D, e) ? (loD = D, !0) : !1
  }

  function loPass() {
    return fe ? K.pass : l.pass || K.pass
  }
  async function loRestore() {
    let j = null;
    try {
      if (j = JSON.parse(sessionStorage.getItem("fdmcalc.acc2") || "null"), !j) {
        const q = JSON.parse(localStorage.getItem("fdmcalc.acc2") || "null");
        q && q.exp > Date.now() ? (j = q, loRem = !0) : q && localStorage.removeItem("fdmcalc.acc2")
      }
    } catch {}
    if (!j || !["staff", "pro", "friend"].includes(j.r) || !j.k) return;
    if (await loChk(j.k, (loPass() || {})[j.r])) {
      loD = j.k, l.access = j.r, j.r === "friend" && loFrLoad(), Ue(["simple", "adv", "staff", "pro"].includes(loM0) ? loM0 : j.r === "friend" ? "pro" : j.r), Ze(), ue()
    } else try {
      sessionStorage.removeItem("fdmcalc.acc2"), localStorage.removeItem("fdmcalc.acc2")
    } catch {}
  }
  async function na(t) {
    const e = Va(crypto.getRandomValues(new Uint8Array(16))),
      n = 6e5;
    return {
      s: e,
      i: n,
      h2: await loSha(await Ga(t, e, n))
    }
  }

  function Wa(t) {
    l.access = t;
    try {
      sessionStorage.removeItem("fdmcalc.acc"), t === "none" || !loD ? (sessionStorage.removeItem("fdmcalc.acc2"), loD = null) : sessionStorage.setItem("fdmcalc.acc2", JSON.stringify({
        r: t,
        k: loD
      })), t === "none" || !loD ? localStorage.removeItem("fdmcalc.acc2") : loRem && localStorage.setItem("fdmcalc.acc2", JSON.stringify({
        r: t,
        k: loD,
        exp: Date.now() + 30 * 864e5
      }))
    } catch {}
  }
  const ke = ["minMode", "prepMk", "markup", "minOrder", "taxRev", "vat", "rate", "setupMin", "plateMin", "cadRate", "kwh", "twoRate", "kwhNight", "nightFrom", "nightTo", "risk", "waste", "printers", "hoursPerDay", "rushPct", "opt", "optOn", "presets", "mgrTol", "paintPrice", "packaging", "insertPrice", "chamber", "adjust", "shopName", "shopInfo", "kpPay", "kpDays", "maxDays", "cEmail", "cTg", "cWa", "offDays", "modMin", "modH", "modK", "modE", "kpTpl", "logo", "logoBg", "brand"],
    Ee = ["washMin", "washCost", "fill", "share"],
    Se = (t, e) => Object.fromEntries(e.filter(n => t && t[n] !== void 0).map(n => [n, st(t[n])])),
    Ot = (t, e) => JSON.stringify(t) === JSON.stringify(e),
    K = {
      vis: {},
      printers: null,
      materials: null,
      money: null,
      sla: null,
      blocks: null,
      massCal: {
        fdm: 1,
        resin: 1
      },
      pass: ta,
      at: null
    };

  function Ni() {
    K.printers = st(un), K.materials = st(fn), K.money = Se(Qn, ke), K.sla = Se(Jn, Ee), K.sls = Se(Xa, ["share", "fill"]), K.blocks = {
      ...hn
    }
  }
  Ni();
  const Je = nt.get("massCal", 1),
    Ka = nt.get("tech", "fdm"),
    l = {
      printers: Za("printers", un),
      materials: Za("materials", fn),
      sel: Ii(),
      tech: ee.includes(Ka) ? Ka : "fdm",
      resinSub: ["sla", "dlp", "lcd"].includes(nt.get("resinSub", "sla")) ? nt.get("resinSub", "sla") : "sla",
      sup: Di(),
      slicer: {
        ...Ya,
        ...nt.get("slicer", {})
      },
      sla: {
        ...Jn,
        ...nt.get("sla", {})
      },
      sls: {
        ...Xa,
        ...nt.get("sls", {})
      },
      part: {
        ...mn,
        ...nt.get("part", {})
      },
      money: {
        ...Qn,
        mgrTol: 25,
        paintPrice: 300,
        packaging: 100,
        insertPrice: 12,
        ...nt.get("money", {})
      },
      manual: ji(),
      manualResin: qi(),
      massCal: typeof Je == "number" ? {
        fdm: Je,
        resin: 1
      } : {
        fdm: he(Je.fdm, 1),
        resin: he(Je.resin ?? Je.sla, 1)
      },
      source: nt.get("source", "model"),
      basket: (nt.get("basket", []) || []).filter(t => t && Nt[t.tech === "sla" && t.ml !== void 0 && t.fixedS === void 0 ? "lcd" : t.tech || "fdm"]).map(t => (t.tech === "sla" && t.fixedS === void 0 && (t.tech = "lcd", t.fixedS = (t.plateHours || 0) * 3600, t.perPartS = 0), t.tech || (t.tech = "fdm"), t)),
      blocks: {
        ...hn,
        ...nt.get("blocks", {})
      },
      vis: nt.get("vis", null) || {},
      orca: {
        machine: "",
        process: "",
        filament: "",
        infill: "",
        walls: "",
        support: "profile",
        auto: !0,
        useCost: !1,
        ...nt.get("orca", {})
      },
      mode: ["simple", "adv", "staff", "pro"].includes(nt.get("mode", "simple")) ? nt.get("mode", "simple") : "simple",
      pass: nt.get("pass", null) || st(ta),
      access: (() => {
        try {
          return "none"
        } catch {
          return "none"
        }
      })(),
      pal: "grad"
    },
    aa = ["vis", "printers", "materials", "sel", "tech", "slicer", "sla", "sls", "part", "money", "manual", "manualResin", "massCal", "source", "basket", "blocks", "mode", "orca", "resinSub", "sup", "pass"];
  for (const t of ["vis", "blocks", "massCal"]) {
    const d = nt.get(t + ".d", null);
    d && (l[t] = loAO(l[t], d))
  }
  function gt() {
    for (const t of aa) {
      if (["vis", "printers", "materials", "blocks", "massCal"].includes(t)) {
        if (!(loK || !fe)) continue;
        nt.del(t);
        const d = Array.isArray(l[t]) ? loDA(l[t], K[t]) : loDO(l[t], K[t]);
        d ? nt.set(t + ".d", d) : nt.del(t + ".d");
        continue
      }
      if (t === "pass") {
        l[t] == null || Ot(l[t], K[t]) ? nt.del(t) : nt.set(t, l[t]);
        continue
      }
      if (t === "money") {
        const e = {};
        for (const [n, a] of Object.entries(l.money))(!ke.includes(n) || !Ot(a, K.money[n])) && (e[n] = a);
        nt.set("money", e);
        continue
      }
      if (t === "sls") {
        const e = {};
        for (const [n, a] of Object.entries(l.sls))(!["share", "fill"].includes(n) || !Ot(a, K.sls[n])) && (e[n] = a);
        nt.set("sls", e);
        continue
      }
      if (t === "sla") {
        const e = {};
        for (const [n, a] of Object.entries(l.sla))(!Ee.includes(n) || !Ot(a, K.sla[n])) && (e[n] = a);
        nt.set("sla", e);
        continue
      }
      nt.set(t, l[t])
    }
    nt.set("techV2", !0)
  }
  const yn = (t = l.tech) => l.printers.filter(e => e.tech === t),
    gn = (t = l.tech) => l.materials.filter(e => e.tech === cn(t)),
    Qe = t => {
      const e = t.filter(n => !n.off);
      return e.length ? e : t
    };

  function ht() {
    const t = Qe(yn());
    return t.find(e => e.id === l.sel[l.tech].printer) || t[0] || l.printers[0]
  }

  function Ct() {
    const t = Qe(gn());
    return t.find(e => e.id === l.sel[l.tech].material) || t[0] || l.materials[0]
  }
  const f = t => document.getElementById(t),
    S = (t, e = 0) => (Number.isFinite(t) ? t : 0).toLocaleString("ru-RU", {
      minimumFractionDigits: e,
      maximumFractionDigits: e
    }),
    Q = (t, e = 0) => S(t, e) + " ₽",
    mt = t => Q(t, t < 100 ? 2 : 0);

  function vt(t) {
    t = Math.max(0, Math.round(t));
    const e = Math.floor(t / 86400),
      n = Math.floor(t % 86400 / 3600),
      a = Math.round(t % 3600 / 60);
    return e ? `${e} д ${n} ч` : n ? `${n} ч ${String(a).padStart(2,"0")} мин` : `${a} мин`
  }
  const J = t => String(t).replace(/[&<>"']/g, e => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[e]);
  let ts;

  function V(t) {
    const e = f("toast");
    e.textContent = t, e.classList.add("show"), clearTimeout(ts), ts = setTimeout(() => e.classList.remove("show"), 3800)
  }

  function tn(t) {
    let e = 1 / 0,
      n = 1 / 0,
      a = 1 / 0,
      o = -1 / 0,
      s = -1 / 0,
      i = -1 / 0;
    for (let d = 0; d < t.length; d += 3) {
      const u = t[d],
        p = t[d + 1],
        x = t[d + 2];
      u < e && (e = u), u > o && (o = u), p < n && (n = p), p > s && (s = p), x < a && (a = x), x > i && (i = x)
    }
    const r = (e + o) / 2,
      c = (n + s) / 2;
    for (let d = 0; d < t.length; d += 3) t[d] -= r, t[d + 1] -= c, t[d + 2] -= a;
    return t
  }

  function Le(t, e) {
    for (let n = 0; n < t.length; n += 3) {
      const a = t[n],
        o = t[n + 1],
        s = t[n + 2];
      t[n] = e[0] * a + e[4] * o + e[8] * s, t[n + 1] = e[1] * a + e[5] * o + e[9] * s, t[n + 2] = e[2] * a + e[6] * o + e[10] * s
    }
    return tn(t)
  }

  function Yi(t, e) {
    for (let n = 0; n < t.length; n++) t[n] *= e;
    return tn(t)
  }

  function vn(t, e = {}) {
    const n = t.length / 9;
    let a = 0;
    for (let v = 0; v < n; v++) {
      const h = v * 9,
        C = t[h],
        F = t[h + 1],
        w = t[h + 2],
        T = t[h + 3],
        q = t[h + 4],
        Y = t[h + 5],
        I = t[h + 6],
        R = t[h + 7],
        X = t[h + 8];
      a += C * (q * X - Y * R) - F * (T * X - Y * I) + w * (T * R - q * I)
    }
    if (a /= 6, a < 0) {
      for (let v = 0; v < n; v++) {
        const h = v * 9;
        for (let C = 0; C < 3; C++) {
          const F = t[h + 3 + C];
          t[h + 3 + C] = t[h + 6 + C], t[h + 6 + C] = F
        }
      }
      a = -a
    }
    let o = 1 / 0,
      s = 1 / 0,
      i = -1 / 0,
      r = -1 / 0,
      c = 0;
    for (let v = 0; v < t.length; v += 3) {
      const h = t[v],
        C = t[v + 1],
        F = t[v + 2];
      h < o && (o = h), h > i && (i = h), C < s && (s = C), C > r && (r = C), F > c && (c = F)
    }
    let d = 0,
      u = 0,
      p = 0,
      x = 0,
      m = 0,
      L = 0,
      P = 0;
    const M = new Float64Array(40),
      E = new Uint8Array(n),
      k = new Float32Array(n),
      g = new Float32Array(n);
    for (let v = 0; v < n; v++) {
      const h = v * 9,
        C = t[h + 3] - t[h],
        F = t[h + 4] - t[h + 1],
        w = t[h + 5] - t[h + 2],
        T = t[h + 6] - t[h],
        q = t[h + 7] - t[h + 1],
        Y = t[h + 8] - t[h + 2],
        I = F * Y - w * q,
        R = w * T - C * Y,
        X = C * q - F * T,
        U = Math.hypot(I, R, X);
      if (U < 1e-12) continue;
      const Z = U / 2,
        A = X / U,
        O = (t[h + 2] + t[h + 5] + t[h + 8]) / 3;
      d += Z, k[v] = A, g[v] = Z, u += Z * Math.sqrt(Math.max(0, 1 - A * A)), A > 0 ? p += Z * A : x += Z * -A, A < -.95 && O < .05 && (m += Z * -A), A < Fi && O > .3 && (E[v] = 1, L += Z * -A), A < 0 && O > .3 && (M[Math.min(39, Math.floor(-A * 40))] += Z * Math.sqrt(Math.max(0, 1 - A * A)), A < -.95 && (P += Z * -A))
    }
    let y = 0,
      b = 0;
    if (L > 0) {
      const v = Math.max(.001, i - o),
        h = Math.max(.001, r - s),
        C = Math.max(v, h) / Math.min(256, Math.max(16, Math.round(Math.sqrt(n)))),
        F = Math.ceil(v / C) + 1,
        w = Math.ceil(h / C) + 1,
        T = new Array(F * w);
      for (let I = 0; I < n; I++) {
        if (k[I] <= .02) continue;
        const R = I * 9,
          X = Math.min(t[R], t[R + 3], t[R + 6]),
          U = Math.max(t[R], t[R + 3], t[R + 6]),
          Z = Math.min(t[R + 1], t[R + 4], t[R + 7]),
          A = Math.max(t[R + 1], t[R + 4], t[R + 7]),
          O = Math.floor((X - o) / C),
          _ = Math.floor((U - o) / C),
          z = Math.floor((Z - s) / C),
          D = Math.floor((A - s) / C);
        for (let N = O; N <= _; N++)
          for (let B = z; B <= D; B++) {
            const W = B * F + N;
            (T[W] || (T[W] = [])).push(I)
          }
      }
      const q = (I, R, X) => {
          const U = T[Math.floor((R - s) / C) * F + Math.floor((I - o) / C)];
          let Z = 0;
          if (U)
            for (const A of U) {
              const O = A * 9,
                _ = t[O],
                z = t[O + 1],
                D = t[O + 3],
                N = t[O + 4],
                B = t[O + 6],
                W = t[O + 7],
                et = (N - W) * (_ - B) + (B - D) * (z - W);
              if (Math.abs(et) < 1e-12) continue;
              const ot = ((N - W) * (I - B) + (B - D) * (R - W)) / et,
                rt = ((W - z) * (I - B) + (_ - B) * (R - W)) / et,
                wt = 1 - ot - rt;
              if (ot < -1e-6 || rt < -1e-6 || wt < -1e-6) continue;
              const Tt = ot * t[O + 2] + rt * t[O + 5] + wt * t[O + 8];
              Tt < X - .05 && Tt > Z && (Z = Tt)
            }
          return Z
        },
        Y = [
          [1 / 3, 1 / 3, 1 / 3],
          [2 / 3, 1 / 6, 1 / 6],
          [1 / 6, 2 / 3, 1 / 6],
          [1 / 6, 1 / 6, 2 / 3]
        ];
      for (let I = 0; I < n; I++) {
        if (!E[I]) continue;
        const R = I * 9,
          X = g[I] * -k[I];
        let U = 0,
          Z = 0;
        for (const A of Y) {
          const O = A[0] * t[R] + A[1] * t[R + 3] + A[2] * t[R + 6],
            _ = A[0] * t[R + 1] + A[1] * t[R + 4] + A[2] * t[R + 7],
            z = A[0] * t[R + 2] + A[1] * t[R + 5] + A[2] * t[R + 8],
            D = q(O, _, z);
          U += z - D, D > 0 && Z++
        }
        y += X * U / 4, b += X * Z / 4
      }
    }
    let $ = -1,
      j = -1;
    if (!e.light && n <= 4e5) {
      const v = new Map;
      let h = 0;
      const C = (T, q, Y) => {
          const I = Math.round(T * 1e3) + "," + Math.round(q * 1e3) + "," + Math.round(Y * 1e3);
          let R = v.get(I);
          return R === void 0 && (R = h++, v.set(I, R)), R
        },
        F = new Map,
        w = (T, q) => {
          const Y = T < q ? T * 4194304 + q : q * 4194304 + T,
            I = F.get(Y),
            R = T < q ? 1 : -1;
          I ? (I[0]++, I[1] += R) : F.set(Y, [1, R])
        };
      for (let T = 0; T < n; T++) {
        const q = T * 9,
          Y = C(t[q], t[q + 1], t[q + 2]),
          I = C(t[q + 3], t[q + 4], t[q + 5]),
          R = C(t[q + 6], t[q + 7], t[q + 8]);
        Y === I || I === R || Y === R || (w(Y, I), w(I, R), w(R, Y))
      }
      $ = 0, j = 0;
      for (const T of F.values()) T[0] !== 2 ? $++ : T[1] !== 0 && j++
    }
    return {
      light: !!e.light,
      ovHist: M,
      bridgeA: P,
      pos: t,
      tris: n,
      dimX: i - o,
      dimY: r - s,
      dimZ: c,
      volMm3: a,
      areaMm2: d,
      aSide: u,
      aTop: p,
      aBot: x,
      aContact: m,
      overProj: L,
      supColumn: y,
      supOnModel: b,
      over: E,
      openEdges: $,
      badDir: j
    }
  }

  function Xi(t) {
    const e = t.length / 9;
    let n = 1 / 0,
      a = 1 / 0,
      o = 1 / 0,
      s = -1 / 0,
      i = -1 / 0,
      r = -1 / 0;
    for (let A = 0; A < t.length; A += 3) {
      const O = t[A],
        _ = t[A + 1],
        z = t[A + 2];
      O < n && (n = O), O > s && (s = O), _ < a && (a = _), _ > i && (i = _), z < o && (o = z), z > r && (r = z)
    }
    const c = Math.hypot(s - n, i - a, r - o) || 1,
      d = Math.max(1e-6, c * 2e-6),
      u = [],
      p = new Map,
      x = (A, O, _) => {
        const z = Math.round(A / d) + "," + Math.round(O / d) + "," + Math.round(_ / d);
        let D = p.get(z);
        return D === void 0 && (D = u.length / 3, u.push(A, O, _), p.set(z, D)), D
      };
    let m = [],
      L = 0,
      P = 0;
    const M = new Set;
    for (let A = 0; A < e; A++) {
      const O = A * 9,
        _ = x(t[O], t[O + 1], t[O + 2]),
        z = x(t[O + 3], t[O + 4], t[O + 5]),
        D = x(t[O + 6], t[O + 7], t[O + 8]);
      if (_ === z || z === D || _ === D) {
        L++;
        continue
      }
      const N = u[z * 3] - u[_ * 3],
        B = u[z * 3 + 1] - u[_ * 3 + 1],
        W = u[z * 3 + 2] - u[_ * 3 + 2],
        et = u[D * 3] - u[_ * 3],
        ot = u[D * 3 + 1] - u[_ * 3 + 1],
        rt = u[D * 3 + 2] - u[_ * 3 + 2];
      if (Math.hypot(B * rt - W * ot, W * et - N * rt, N * ot - B * et) < d * d) {
        L++;
        continue
      }
      const wt = [_, z, D].sort((Tt, yt) => Tt - yt).join(",");
      if (M.has(wt)) {
        P++;
        continue
      }
      M.add(wt), m.push(_, z, D)
    }
    const E = e * 3 - u.length / 3,
      k = () => {
        const A = new Map;
        for (let O = 0; O < m.length / 3; O++)
          for (let _ = 0; _ < 3; _++) {
            const z = m[O * 3 + _],
              D = m[O * 3 + (_ + 1) % 3],
              N = z < D ? z * 4194304 + D : D * 4194304 + z,
              B = A.get(N);
            B ? B.push(O) : A.set(N, [O])
          }
        return A
      },
      g = (A, O, _) => {
        for (let z = 0; z < 3; z++)
          if (m[A * 3 + z] === O && m[A * 3 + (z + 1) % 3] === _) return !0;
        return !1
      },
      y = A => {
        const O = m[A * 3 + 1];
        m[A * 3 + 1] = m[A * 3 + 2], m[A * 3 + 2] = O
      };
    let b = k(),
      $ = 0,
      j = 0;
    for (const A of b.values()) A.length > 2 && j++;
    const v = () => m.length / 3;
    let h = new Int32Array(v()).fill(-1),
      C = 0;
    for (let A = 0; A < v(); A++) {
      if (h[A] >= 0) continue;
      h[A] = C;
      const O = [A];
      for (; O.length;) {
        const _ = O.pop();
        for (let z = 0; z < 3; z++) {
          const D = m[_ * 3 + z],
            N = m[_ * 3 + (z + 1) % 3],
            B = b.get(D < N ? D * 4194304 + N : N * 4194304 + D);
          if (!B || B.length !== 2) continue;
          const W = B[0] === _ ? B[1] : B[0];
          h[W] >= 0 || (g(W, D, N) && (y(W), $++), h[W] = C, O.push(W))
        }
      }
      C++
    }
    let F = 0,
      w = 0;
    const T = new Map;
    for (const [, A] of b) {
      if (A.length !== 1) continue;
      const O = A[0];
      for (let _ = 0; _ < 3; _++) {
        const z = m[O * 3 + _],
          D = m[O * 3 + (_ + 1) % 3],
          N = z < D ? z * 4194304 + D : D * 4194304 + z;
        b.get(N) === A && (T.get(D) || T.set(D, []).get(D)).push(z)
      }
    }
    for (const A of [...T.keys()])
      for (;
        (T.get(A) || []).length;) {
        const O = [A];
        let _ = A,
          z = 0;
        for (; z++ < 1e6;) {
          const D = T.get(_);
          if (!D || !D.length) break;
          const N = D.pop();
          if (N === A) break;
          O.push(N), _ = N
        }
        if (!(O.length < 3))
          if (F++, O.length === 3) m.push(O[0], O[1], O[2]), w++;
          else {
            let D = 0,
              N = 0,
              B = 0;
            for (const et of O) D += u[et * 3], N += u[et * 3 + 1], B += u[et * 3 + 2];
            const W = u.length / 3;
            u.push(D / O.length, N / O.length, B / O.length);
            for (let et = 0; et < O.length; et++) m.push(O[et], O[(et + 1) % O.length], W), w++
          }
      }
    b = k(), h = new Int32Array(v()).fill(-1), C = 0;
    for (let A = 0; A < v(); A++) {
      if (h[A] >= 0) continue;
      h[A] = C;
      const O = [A];
      for (; O.length;) {
        const _ = O.pop();
        for (let z = 0; z < 3; z++) {
          const D = m[_ * 3 + z],
            N = m[_ * 3 + (z + 1) % 3],
            B = b.get(D < N ? D * 4194304 + N : N * 4194304 + D);
          if (B)
            for (const W of B) h[W] < 0 && (B.length === 2 && g(W, D, N) && (y(W), $++), h[W] = C, O.push(W))
        }
      }
      C++
    }
    const q = new Float64Array(C),
      Y = new Int32Array(C).fill(-1);
    for (let A = 0; A < v(); A++) {
      const O = m[A * 3] * 3,
        _ = m[A * 3 + 1] * 3,
        z = m[A * 3 + 2] * 3;
      q[h[A]] += (u[O] * (u[_ + 1] * u[z + 2] - u[_ + 2] * u[z + 1]) - u[O + 1] * (u[_] * u[z + 2] - u[_ + 2] * u[z]) + u[O + 2] * (u[_] * u[z + 1] - u[_ + 1] * u[z])) / 6, Y[h[A]] < 0 && (Y[h[A]] = A)
    }
    const I = (A, O, _, z) => {
      let D = 0;
      for (let N = 0; N < v(); N++) {
        if (h[N] !== z) continue;
        const B = m[N * 3] * 3,
          W = m[N * 3 + 1] * 3,
          et = m[N * 3 + 2] * 3,
          ot = u[W + 1] - u[B + 1],
          rt = u[W + 2] - u[B + 2],
          wt = u[et + 1] - u[B + 1],
          Tt = u[et + 2] - u[B + 2],
          yt = ot * Tt - rt * wt;
        if (Math.abs(yt) < 1e-12) continue;
        const _t = O - u[B + 1] - 1e-7,
          ie = _ - u[B + 2] - 13e-8,
          Qt = (_t * Tt - ie * wt) / yt,
          oe = (ot * ie - rt * _t) / yt;
        if (Qt < 0 || oe < 0 || Qt + oe > 1) continue;
        u[B] + Qt * (u[W] - u[B]) + oe * (u[et] - u[B]) > A && D++
      }
      return D % 2 === 1
    };
    let R = 0,
      X = 0,
      U = 0;
    if (C <= 60)
      for (let A = 0; A < C; A++) {
        const O = m[Y[A] * 3] * 3,
          _ = u[O],
          z = u[O + 1],
          D = u[O + 2];
        let N = 0;
        for (let B = 0; B < C; B++) B !== A && Math.abs(q[B]) > 1e-9 && I(_, z, D, B) && N++;
        if (N === 0 && q[A] < 0) {
          for (let B = 0; B < v(); B++) h[B] === A && y(B);
          q[A] = -q[A], R++
        } else N > 0 && q[A] < 0 ? X++ : N > 0 && q[A] > 0 && U++
      } else
        for (let A = 0; A < C; A++)
          if (q[A] < 0) {
            for (let O = 0; O < v(); O++) h[O] === A && y(O);
            R++
          } const Z = new Float32Array(m.length * 3);
    for (let A = 0; A < m.length; A++) Z[A * 3] = u[m[A] * 3], Z[A * 3 + 1] = u[m[A] * 3 + 1], Z[A * 3 + 2] = u[m[A] * 3 + 2];
    return {
      pos: Z,
      report: {
        trisBefore: e,
        trisAfter: v(),
        weldedVerts: E,
        degenerate: L,
        duplicates: P,
        flipped: $,
        holes: F,
        holeTris: w,
        inverted: R,
        nested: X,
        overlapping: U,
        nonManifold: j,
        shells: C
      }
    }
  }

  function sa(t, e, n, a = 2) {
    const o = Object.keys(t);
    for (; o.length >= a;) delete t[o.shift()];
    return t[e] = n, n
  }

  function Mn(t, e, n) {
    t._ras = t._ras || {};
    const a = e.toFixed(4) + "|" + n;
    if (t._ras[a]) return t._ras[a];
    const o = t.pos,
      s = o.length / 9,
      i = Math.max(t.dimZ, 1e-6),
      r = Math.max(1, Math.round(i / e)),
      c = i / r,
      d = t.dimX,
      u = t.dimY,
      p = Math.min(25e4, Math.max(3e3, n / r)),
      x = Math.max(.05, Math.sqrt((d + 2) * (u + 2) / p)),
      m = Math.max(1, 2 * x),
      L = -d / 2 - m,
      P = -u / 2 - m,
      M = Math.ceil((d + 2 * m) / x),
      E = Math.ceil((u + 2 * m) / x),
      k = M * E,
      g = new Uint32Array(r + 1),
      y = new Int32Array(s),
      b = new Int32Array(s);
    for (let I = 0; I < s; I++) {
      const R = I * 9,
        X = o[R + 2],
        U = o[R + 5],
        Z = o[R + 8],
        A = Math.min(X, U, Z),
        O = Math.max(X, U, Z);
      let _ = Math.max(0, Math.ceil(A / c - .5)),
        z = Math.min(r - 1, Math.floor(O / c - .5));
      if (O - A < 1e-9 || z < _) {
        y[I] = 1, b[I] = 0;
        continue
      }
      y[I] = _, b[I] = z;
      for (let D = _; D <= z; D++) g[D + 1]++
    }
    for (let I = 0; I < r; I++) g[I + 1] += g[I];
    const $ = new Float32Array(g[r] * 4),
      j = g.slice(0, r),
      v = [0, 0, 0],
      h = [0, 0, 0],
      C = [0, 0, 0];
    for (let I = 0; I < s; I++) {
      if (b[I] < y[I]) continue;
      const R = I * 9;
      for (let N = 0; N < 3; N++) v[N] = o[R + N * 3], h[N] = o[R + N * 3 + 1], C[N] = o[R + N * 3 + 2];
      const X = v[1] - v[0],
        U = h[1] - h[0],
        Z = C[1] - C[0],
        A = v[2] - v[0],
        O = h[2] - h[0],
        _ = C[2] - C[0],
        z = U * _ - Z * O,
        D = Z * A - X * _;
      for (let N = y[I]; N <= b[I]; N++) {
        const B = (N + .5) * c + 1e-7;
        let W = 0,
          et = 0,
          ot = 0,
          rt = 0,
          wt = 0;
        for (let yt = 0; yt < 3; yt++) {
          const _t = yt,
            ie = (yt + 1) % 3,
            Qt = C[_t],
            oe = C[ie];
          if (Qt < B != oe < B) {
            const $e = (B - Qt) / (oe - Qt),
              Ke = v[_t] + (v[ie] - v[_t]) * $e,
              Ai = h[_t] + (h[ie] - h[_t]) * $e;
            W === 0 ? (et = Ke, ot = Ai) : (rt = Ke, wt = Ai), W++
          }
        }
        if (W !== 2) continue;
        if ((rt - et) * -D + (wt - ot) * z < 0) {
          const yt = et,
            _t = ot;
          et = rt, ot = wt, rt = yt, wt = _t
        }
        const Tt = j[N] * 4;
        $[Tt] = et, $[Tt + 1] = ot, $[Tt + 2] = rt, $[Tt + 3] = wt, j[N]++
      }
    }
    const F = new Uint8Array(r * k),
      w = new Float64Array(r),
      T = M + 1,
      q = new Int16Array(E * T);
    for (let I = 0; I < r; I++) {
      q.fill(0);
      for (let U = g[I]; U < j[I]; U++) {
        const Z = U * 4,
          A = $[Z],
          O = $[Z + 1],
          _ = $[Z + 2],
          z = $[Z + 3];
        if (O === z) continue;
        const D = z < O ? 1 : -1,
          N = Math.min(O, z),
          B = Math.max(O, z),
          W = Math.max(0, Math.ceil((N - P) / x - .5)),
          et = Math.min(E - 1, Math.ceil((B - P) / x - .5) - 1),
          ot = (_ - A) / (z - O);
        for (let rt = W; rt <= et; rt++) {
          const wt = P + (rt + .5) * x,
            Tt = A + ot * (wt - O);
          let yt = Math.ceil((Tt - L) / x - .5);
          yt < 0 ? yt = 0 : yt > M && (yt = M), q[rt * T + yt] += D
        }
      }
      const R = I * k;
      let X = 0;
      for (let U = 0; U < E; U++) {
        const Z = U * T;
        let A = 0;
        for (let _ = 0; _ <= M; _++) A += q[Z + _];
        let O = 0;
        for (let _ = 0; _ < M; _++) O += q[Z + _], O !== 0 && A - O !== 0 && (F[R + U * M + _] = 1, X++)
      }
      w[I] = X * x * x
    }
    let Y = 0;
    for (let I = 0; I < r; I++) Y += w[I] * c;
    return sa(t._ras, a, {
      N: r,
      dz: c,
      res: x,
      nx: M,
      ny: E,
      np: k,
      inside: F,
      A: w,
      vol: Y
    }, 3)
  }
  const be = {
    f: null,
    d: null,
    v: null,
    z: null,
    col: null
  };

  function es(t, e, n, a, o) {
    let s = 0;
    a[0] = 0, o[0] = -1e20, o[1] = 1e20;
    for (let i = 1; i < e; i++) {
      let r = (t[i] + i * i - (t[a[s]] + a[s] * a[s])) / (2 * i - 2 * a[s]);
      for (; r <= o[s];) s--, r = (t[i] + i * i - (t[a[s]] + a[s] * a[s])) / (2 * i - 2 * a[s]);
      s++, a[s] = i, o[s] = r, o[s + 1] = 1e20
    }
    s = 0;
    for (let i = 0; i < e; i++) {
      for (; o[s + 1] < i;) s++;
      const r = i - a[s];
      n[i] = r * r + t[a[s]]
    }
  }

  function ia(t, e, n, a, o) {
    const s = Math.max(n, a);
    (!be.f || be.f.length < s) && (be.f = new Float64Array(s), be.d = new Float64Array(s), be.v = new Int32Array(s), be.z = new Float64Array(s + 1));
    const {
      f: i,
      d: r,
      v: c,
      z: d
    } = be, u = 1e12;
    for (let p = 0; p < a; p++) {
      const x = e + p * n;
      for (let m = 0; m < n; m++) i[m] = t[x + m] ? u : 0;
      es(i, n, r, c, d);
      for (let m = 0; m < n; m++) o[p * n + m] = r[m]
    }
    for (let p = 0; p < n; p++) {
      for (let x = 0; x < a; x++) i[x] = o[x * n + p];
      es(i, a, r, c, d);
      for (let x = 0; x < a; x++) o[x * n + p] = r[x]
    }
  }

  function Ui(t) {
    if (t.contours) return t.contours;
    const {
      N: e,
      nx: n,
      ny: a,
      np: o,
      inside: s
    } = t, i = new Int32Array(o), r = new Int32Array(o), c = new Float64Array(e);
    for (let d = 0; d < e; d++) {
      const u = d * o;
      i.fill(0);
      let p = 0,
        x = 0;
      for (let m = 1; m >= 0; m--)
        for (let L = 0; L < o; L++) {
          if (s[u + L] !== m || i[L]) continue;
          p++;
          let P = 0,
            M = !1;
          for (r[P++] = L, i[L] = p; P;) {
            const E = r[--P],
              k = E % n,
              g = (E - k) / n;
            (k === 0 || g === 0 || k === n - 1 || g === a - 1) && (M = !0), k > 0 && !i[E - 1] && s[u + E - 1] === m && (i[E - 1] = p, r[P++] = E - 1), k < n - 1 && !i[E + 1] && s[u + E + 1] === m && (i[E + 1] = p, r[P++] = E + 1), g > 0 && !i[E - n] && s[u + E - n] === m && (i[E - n] = p, r[P++] = E - n), g < a - 1 && !i[E + n] && s[u + E + n] === m && (i[E + n] = p, r[P++] = E + n)
          }(m === 1 || !M) && x++
        }
      c[d] = x
    }
    return t.contours = c
  }

  function ns(t) {
    if (t._uvol !== void 0) return t._uvol;
    const e = Mn(t, Math.max(.1, t.dimZ / 300), 6e6);
    return t._uvol = e.vol
  }

  function Te(t) {
    if (t.volMm3 <= 0) return 0;
    const e = ns(t);
    return e < t.volMm3 * .97 ? e : t.volMm3
  }
  const Zi = 16e6;

  function as(t, e, n, a) {
    t._fw = t._fw || {};
    const o = [e, n, a].map(y => y.toFixed(4)).join("|");
    if (t._fw[o]) return t._fw[o];
    const s = Mn(t, e, t.light ? 4e6 : Zi),
      {
        N: i,
        np: r,
        nx: c,
        ny: d,
        res: u,
        inside: p
      } = s,
      x = new Uint8Array(i * r),
      m = new Float64Array(i),
      L = new Float64Array(i),
      P = new Float64Array(i),
      M = new Float64Array(r),
      E = u * u,
      k = Math.pow(n / u + .5, 2),
      g = Math.pow(a / u + .5, 2);
    for (let y = 0; y < i; y++) {
      if (s.A[y] <= 0) continue;
      ia(p, y * r, c, d, M);
      const b = y * r;
      let $ = 0,
        j = 0,
        v = 0;
      for (let h = 0; h < r; h++) {
        if (!p[b + h]) continue;
        const C = M[h];
        C <= g ? (j++, $++) : C <= k ? $++ : (x[b + h] = 1, v++)
      }
      m[y] = $ * E, L[y] = j * E, P[y] = v * E
    }
    return sa(t._fw, o, {
      R: s,
      core: x,
      ringA: m,
      outerA: L,
      coreA: P
    })
  }

  function Vi(t, e, n, a, o, s) {
    t._fs = t._fs || {};
    const i = [e, n, a, o, s].join("|");
    if (t._fs[i]) return t._fs[i];
    const r = as(t, e, n, a),
      {
        N: c,
        np: d,
        res: u
      } = r.R,
      p = r.core,
      x = new Uint8Array(c * d),
      m = new Uint8Array(d),
      L = new Float64Array(c),
      P = u * u;
    for (let M = 0; M < c; M++) {
      const E = M * d,
        k = E - d;
      for (let g = 0; g < d; g++) x[E + g] = p[E + g] ? M > 0 ? Math.min(255, x[k + g] + 1) : 1 : 0
    }
    for (let M = c - 1; M >= 0; M--) {
      const E = M * d;
      let k = 0;
      for (let g = 0; g < d; g++)
        if (p[E + g]) {
          const y = m[g] < 255 ? m[g] + 1 : 255;
          m[g] = y, (y <= o || x[E + g] <= s) && k++
        } else m[g] = 0;
      L[M] = k * P
    }
    return sa(t._fs, i, L, 4)
  }

  function ss(t, e, n, a, o) {
    const s = e.nozzle,
      i = e.layer,
      r = s * 1.05,
      c = s * 1.125,
      d = s,
      u = e.walls * r,
      p = as(t, i, u, r),
      x = p.R,
      m = x.N,
      L = x.dz,
      P = Vi(t, i, u, r, e.top, e.bottom),
      M = Math.max(1, Math.min(n.maxFlow, a.maxFlow)),
      E = Math.max(200, n.accel),
      k = (z, D, N) => {
        if (z <= 0) return 0;
        const B = N >= D * D / E ? N / D + D / E : 2 * Math.sqrt(N / E);
        return z / N * B
      },
      g = (z, D, N) => Math.max(5, Math.min(N ? n.vFirst : z, M / (D * L))),
      y = {
        outer: 0,
        inner: 0,
        solid: 0,
        infill: 0
      },
      b = {
        outer: 0,
        inner: 0,
        solid: 0,
        infill: 0,
        wait: 0,
        travel: 0
      },
      $ = new Float64Array(m);
    let j = 0;
    const v = Ui(x),
      h = n.tContour ?? .95;
    for (let z = 0; z < m; z++) {
      const D = x.A[z];
      if (D <= 0) {
        $[z] = .3, b.travel += .3;
        continue
      }
      const N = p.ringA[z],
        B = p.outerA[z],
        W = P[z],
        et = Math.max(0, p.coreA[z] - W);
      p.coreA[z] <= 0 && j++, y.outer += B * L, y.inner += (N - B) * L, y.solid += W * L, y.infill += et * L * e.infill / 100;
      const ot = z === 0,
        rt = B / r,
        wt = Math.min(80, Math.max(3, rt / 8)),
        Tt = Math.min(80, Math.max(3, Math.sqrt(D))),
        yt = Math.min(25, Math.max(3, Math.sqrt(D) / 2)),
        _t = k(rt, g(n.vOuter, r, ot), wt),
        ie = k((N - B) / r, g(n.vInner, r, ot), wt),
        Qt = k(W / r, g(n.vSolid, r, ot), Tt),
        oe = k(et * e.infill / 100 / c, g(n.vInfill, c, ot), yt),
        $e = _t + ie + Qt + oe,
        Ke = .6 + $e * .06 + v[z] * h;
      b.outer += _t, b.inner += ie, b.solid += Qt, b.infill += oe, b.travel += Ke, b.wait += Math.max(0, a.minLayer - $e - Ke), $[z] = $e + Ke
    }
    let C = 0;
    t.userSup && !t.userSup.resin ? C = t.userSup.vol : e.supports === "auto" && t.overProj > 25 && (C = t.supColumn * (e.supportType === "tree" ? .09 : .15) + t.overProj * 2 * i * .8);
    const F = !t.userSup && l.sup && sn("fdm").key === "raft" ? (t.dimX + 6) * (t.dimY + 6) * .7 * .9 * .7 : 0,
      w = (e.brim ? 2 * (t.dimX + t.dimY) * 5 * i : 0) + F;
    let T = 0;
    if (t.ovHist) {
      const z = [n.vOv2 || 40, n.vOv3 || 25, n.vOv4 || 10];
      for (let D = 0; D < 40; D++) {
        const N = t.ovHist[D] / i;
        if (N <= 0) continue;
        const B = (D + .5) / 40,
          W = i * B / Math.sqrt(Math.max(1e-6, 1 - B * B)) / r,
          et = W >= .75 ? z[2] : W >= .5 ? z[1] : W >= .25 ? z[0] : 0;
        et && (T += N * (Math.max(0, 1 / et - 1 / g(n.vOuter, r, !1)) + (e.walls - 1) * Math.max(0, 1 / et - 1 / g(n.vInner, r, !1))))
      }
      T += (t.bridgeA || 0) / r * Math.max(0, 1 / (n.vBridge || 30) - 1 / g(n.vSolid, r, !1))
    }
    const q = k(C / (d * i), g(n.vSupport, d, !1), 8) + C / 1e3 * 2,
      Y = k(w / (r * i), g(n.vFirst, r, !0), Math.max(10, (t.dimX + t.dimY) / 2)),
      I = n.timeCal || 1,
      R = (z, D, N, B) => ({
        name: z,
        c: D,
        vol: N,
        grams: N / 1e3 * a.density * o,
        t: B * I
      }),
      X = [R("Внешний периметр", "#e8833a", y.outer, b.outer), R("Внутренние периметры", "#d9a521", y.inner, b.inner), R("Сплошные слои", "#8a63d2", y.solid, b.solid), R(`Заполнение ${e.infill}%`, "#c8423b", y.infill, b.infill), R(t.userSup && !t.userSup.resin ? `Поддержки: ${ze[t.userSup.type].toLowerCase()}, ${t.userSup.type==="tree"?"веток":t.userSup.type==="normal"?"столбиков":"опор"} ${t.userSup.n}` : "Поддержки", "#2e9e74", C, q), R(F ? "Плот" : "Кайма", "#2a8fb0", w, Y)].filter(z => z.vol > .5);
    T > 1 && X.push(R("Замедление на нависаниях и мостах", "#4b7bd1", 0, T)), X.push(R("Перемещения, смена слоя", "#7d8b95", 0, b.travel)), b.wait > 1 && X.push(R("Пауза на охлаждение слоя", "#a7b4bd", 0, b.wait));
    const U = y.outer + y.inner + y.solid + y.infill + C + w,
      Z = b.outer + b.inner + b.solid + b.infill + b.travel + b.wait + q + Y + T,
      A = Array.from($).sort((z, D) => z - D),
      O = [],
      _ = Math.min(32, m);
    for (let z = 0; z < _; z++) {
      const D = Math.floor(z * m / _),
        N = Math.floor((z + 1) * m / _);
      if (N <= D) continue;
      let B = 0;
      for (let W = D; W < N; W++) B += A[W];
      O.push([N - D, B / (N - D)])
    }
    return {
      hist: O,
      minLayer: a.minLayer,
      extraS: q + Y + T,
      k: I,
      rows: X,
      layers: m,
      solid: j > m * .8,
      grams: U / 1e3 * a.density * o,
      gramsRaw: U / 1e3 * a.density,
      timeS: Z * I,
      timeRaw: Z,
      supGrams: C / 1e3 * a.density * o,
      fillPct: t.volMm3 > 0 ? U / Te(t) * 100 : 0
    }
  }

  function Gi(t, e) {
    t._sh = t._sh || {};
    const n = e.toFixed(3);
    if (t._sh[n] !== void 0) return t._sh[n];
    const a = Mn(t, Math.max(.1, t.dimZ / 300), 6e6),
      {
        N: o,
        np: s,
        nx: i,
        ny: r,
        res: c,
        dz: d,
        inside: u
      } = a,
      p = Math.ceil(e / d - 1e-9),
      x = Math.pow(e / c, 2),
      m = new Uint16Array(o * s),
      L = new Uint16Array(s),
      P = new Float64Array(s);
    for (let g = 0; g < o; g++) {
      const y = g * s,
        b = y - s;
      for (let $ = 0; $ < s; $++) m[y + $] = u[y + $] ? g > 0 ? m[b + $] + 1 : 1 : 0
    }
    let M = 0,
      E = 0;
    for (let g = o - 1; g >= 0; g--) {
      const y = g * s;
      let b = !1;
      for (let $ = 0; $ < s; $++) u[y + $] ? (L[$]++, E++, L[$] > p && m[y + $] > p && (b = !0)) : L[$] = 0;
      if (b) {
        ia(u, y, i, r, P);
        for (let $ = 0; $ < s; $++) u[y + $] && L[$] > p && m[y + $] > p && P[$] > x && M++
      }
    }
    const k = (E - M) * c * c * d;
    return t._sh[n] = Math.min(Te(t), k * Te(t) / Math.max(1, a.vol))
  }

  function is(t, e, n, a, o) {
    const s = n.tech,
      i = Te(t);
    let r = i,
      c = !1;
    if (e.hollow) {
      const $ = Gi(t, e.wall);
      $ < i * .98 && (r = $, c = !0)
    }
    const d = t.userSup && t.userSup.resin ? t.userSup : null,
      u = d ? 0 : (e.tilt || 0) * Math.PI / 180,
      p = !!d || e.supports !== "off",
      x = (u > 0 ? t.dimZ * Math.cos(u) + Math.max(t.dimX, t.dimY) * Math.sin(u) : t.dimZ) + (p ? 5 : 0);
    let m = 0;
    if (d) m = d.vol;
    else if (p) {
      const $ = {
          light: .6,
          medium: 1,
          heavy: 1.5
        } [e.density] || 1,
        j = sn("resin"),
        v = j.t ? (t.dimX + 2 * j.m) * (t.dimY + 2 * j.m) * .7 * j.t * j.fill : 0;
      m = (t.supColumn * .035 + t.overProj * .25 + v) * $ * (1 + Math.sin(u))
    }
    const L = (r + m) / 1e3 * o,
      P = Math.max(1, Math.ceil(x / e.layer)),
      M = n.timeCal || 1,
      E = (a.expMult || 1) * Math.pow(e.layer / .05, .6);
    let k, g, y;
    if (s === "sla") {
      const $ = (r + m) / e.layer / Math.max(1, n.areaRate) * E;
      k = P * n.overhead * M, g = $ * M, y = [{
        name: "Обход сечений лазером",
        c: "#d9a521",
        t: g
      }, {
        name: "Отрыв и разравнивание слоя",
        c: "#7d8b95",
        t: k
      }]
    } else {
      const $ = Math.min(P, n.bottomLayers),
        j = ($ * n.bottomExp + (P - $) * n.exp) * E * M,
        v = P * n.lift * M;
      k = j + v, g = 0, y = [{
        name: "Засветка слоёв",
        c: "#d9a521",
        t: j
      }, {
        name: "Подъём платформы",
        c: "#7d8b95",
        t: v
      }]
    }
    const b = [{
      name: c ? `Деталь, полая (стенка ${e.wall} мм)` : "Деталь",
      c: "#0b6a89",
      ml: r / 1e3 * o
    }, {
      name: d ? `Поддержки: ${ze[d.type].toLowerCase()}, ${d.n} опор` : "Поддержки и подложка",
      c: "#2e9e74",
      ml: m / 1e3 * o
    }].filter($ => $.ml > 5e-4);
    return b.forEach($ => $.grams = $.ml * a.density), {
      kind: s,
      ml: L,
      grams: L * a.density,
      mlRaw: (r + m) / 1e3,
      fixedS: k,
      perPartS: g,
      plateS: k + g,
      plateRaw: (k + g) / M,
      layers: P,
      height: x,
      rows: b,
      tRows: y,
      hollowed: c,
      saved: c ? (i - r) / 1e3 : 0,
      supMl: m / 1e3 * o
    }
  }

  function wn(t, e, n = l.tech) {
    if (!t) return 1;
    if (n === "sls") return t.dimZ > e.bedZ - 10 ? 0 : t.dimX <= e.bedX && t.dimY <= e.bedY || t.dimY <= e.bedX && t.dimX <= e.bedY ? 1 : 0;
    let a = t.dimX,
      o = t.dimY,
      s = t.dimZ;
    if (tt.has(n) && l.sla.tilt > 0) {
      const c = l.sla.tilt * Math.PI / 180;
      a = t.dimX * Math.cos(c) + t.dimZ * Math.sin(c), s = t.dimZ * Math.cos(c) + t.dimX * Math.sin(c) + 5
    }
    if (s > e.bedZ) return 0;
    const i = tt.has(n) ? 3 : 5,
      r = (c, d) => Math.max(0, Math.floor((e.bedX + i) / (c + i))) * Math.max(0, Math.floor((e.bedY + i) / (d + i)));
    return Math.min(500, Math.max(r(a, o), r(o, a)))
  }

  function os(t, e, n, a) {
    if (t.mT > 0) {
      const o = e.bedX * e.bedY,
        u = Math.min(e.bedZ, Math.max(5, t.mH || (t.dimZ || 0) + 4)),
        P = (e.warmup + e.cool) / 60,
        M = o * (u + 10) / 1e3 * n.bulk,
        E = t.grams * a,
        k = Math.max(E * 1.03, M * n.refresh / 100);
      return {
        jobs: 1,
        H: u,
        layers: u / (t.layer || .11),
        tLayers: t.mT,
        tScan: 0,
        tHeat: P,
        jobH: t.mT + P,
        loaded: M,
        fresh: k,
        partsMass: E,
        perJob: a,
        manual: !0
      }
    }
    const o = e.bedX * e.bedY,
      s = Math.max(10, e.bedZ - 10),
      i = t.vol * 1e3,
      r = Math.max(i / Math.max(.01, (t.packing || 10) / 100), (t.bboxVol || 0) * 1e3 * .6),
      c = r * a,
      d = Math.max(1, Math.ceil(c / (o * s))),
      u = Math.min(e.bedZ, Math.max((t.dimZ || 0) + 4, c / d / o + 4)),
      p = u / (t.layer || .11),
      x = e.timeCal || 1,
      m = p * e.recoat / 3600 * x,
      L = i * a / d / 1e3 / Math.max(1, e.scanRate) * x,
      P = (e.warmup + e.cool) / 60,
      M = o * (u + 10) / 1e3 * n.bulk,
      E = t.grams * a / d,
      k = Math.max(E * 1.03, M * n.refresh / 100);
    return {
      jobs: d,
      H: u,
      layers: p,
      tLayers: m,
      tScan: L,
      tHeat: P,
      jobH: m + L + P,
      loaded: M,
      fresh: k,
      partsMass: E,
      perJob: Math.max(1, Math.floor(o * s / r))
    }
  }

  function rs(t, e) {
    if (!t.hist || !t.hist.length) return t.hours * 3600 * e;
    let n = 0;
    for (const [a, o] of t.hist) n += a * Math.max(t.minLayer, e * o);
    return (n + e * (t.extraS || 0)) * (t.k || 1)
  }
  const oa = (t, e) => t.share > 0 ? Math.min(1, Math.max(.05, e / (Math.max(1, t.cap || 1) * t.share / 100))) : 1,
    ls = (t, e) => (t.fixedS || 0) * oa(t, e) + e * (t.perPartS || 0);

  function Sc(m) {
    if (!m || (m.tech && m.tech !== "fdm")) return !1;
    const lc = loC(m);
    if (lc != null) return !!lc;
    return loSa(m)
  }

  function loSa(m) {
    return /\b(ABS|ASA|HIPS|PC|PA\d*|PPA|PPS|PEEK|PEKK|PEI|ULTEM|POM|PP)\b|нейлон|nylon|поликарбонат/i.test(m.name || "")
  }

  function Yc() {
    const e = f("chamberChk");
    if (!e) return;
    const m = Ct(),
      p = ht(),
      c = f("chamberCap");
    e.checked = Sc(m);
    c && (c.textContent = (loC(m) != null ? "Задано вручную для «" + m.name + "». Снимите и поставьте снова, чтобы вернуть авто." : Sc(m) ? "Авто: " + m.name + " — материал с усадкой, камера нужна." : "Авто: " + m.name + " печатается без нагрева камеры.") + (Sc(m) && !(+p.chamberPower > 0) ? " У принтера нет нагревателя камеры — в цене не учитывается." : ""))
  }

  function cs(t) {
    return t && t.tech && t.tech !== "fdm" ? !1 : t && t.chamber != null ? !!t.chamber : Sc(t && t.materialId && l.materials.find(e => e.id === t.materialId) || Ct())
  }

  function ra(t) {
    if (!t) return null;
    const e = Date.parse(t);
    return Number.isFinite(e) ? e : null
  }

  function loIsWd(D) {
    const g = D.getDay();
    return g !== 0 && g !== 6 && !to(D)
  }

  function loWork(x, H) {
    const A = 9,
      B = 17;
    let D = new Date(x);
    const nx = () => {
      for (let k = 0; k < 800; k++) {
        const h = D.getHours() + D.getMinutes() / 60;
        if (loIsWd(D) && h >= A && h < B) return;
        loIsWd(D) && h < A ? D.setHours(A, 0, 0, 0) : (D.setDate(D.getDate() + 1), D.setHours(A, 0, 0, 0))
      }
    };
    nx();
    let m = Math.max(0, H || 0);
    for (let k = 0; k < 800 && m > 1e-6; k++) {
      const h = D.getHours() + D.getMinutes() / 60 + D.getSeconds() / 3600,
        c = Math.min(m, B - h);
      D = new Date(D.getTime() + c * 36e5), m -= c, m > 1e-6 && (D.setDate(D.getDate() + 1), D.setHours(A, 0, 0, 0), nx())
    }
    return D.getTime()
  }

  function loReady(r, T, H) {
    const p = Math.min(24, Math.max(1, +l.money.hoursPerDay || 24)),
      d = Math.floor(T / p + 1e-9);
    return loWork(r + (d * 24 + Math.max(0, T - d * p)) * 36e5, H)
  }

  function loWd(x) {
    const D = new Date(Date.now());
    D.setHours(12, 0, 0, 0);
    const E = new Date(x);
    E.setHours(12, 0, 0, 0);
    let k = 0;
    for (let i = 0; i < 2e4 && D < E; i++) D.setDate(D.getDate() + 1), loIsWd(D) && k++;
    return Math.max(1, k)
  }

  function Wi(t, H = 0) {
    const e = l.money,
      n = Date.now(),
      a = ra(e.busyUntil),
      o = ra(e.start),
      s = ra(e.deadline),
      F = x => loReady(x, t, H);
    let r = o ?? Math.max(n, a || 0),
      c = F(r),
      d = l.blocks.schedule && s ? "ok" : "none";
    if (d === "ok" && c > s) {
      const u = F(n);
      a && a > n && u <= s ? (d = "rush", r = n, c = u) : (d = "late", u < c && (r = n, c = u))
    }
    return {
      start: r,
      end: c,
      mode: d,
      dl: s,
      busy: a
    }
  }

  function Ki(t, e) {
    const n = l.money;
    if (!n.twoRate || e <= 0) return 0;
    const a = (+n.nightFrom || 0) % 24,
      o = (+n.nightTo || 0) % 24;
    if (ra(n.start) == null && !((ra(n.busyUntil) || 0) > Date.now())) {
      const h = (o - a + 24) % 24,
        d = Math.min(24, Math.max(1, +n.hoursPerDay || 24));
      return Math.min(h, d) / d
    }
    const s = 600,
      i = e * 36e5 / s;
    let r = 0;
    for (let c = 0; c < s; c++) {
      const d = new Date(t + (c + .5) * i),
        u = d.getHours() + d.getMinutes() / 60;
      (a < o ? u >= a && u < o : u >= a || u < o) && r++
    }
    return r / s
  }
  const At = () => Math.max(0, Math.round(+l.part.leadDays || 0)),
    Ji = new Set(["01-01", "01-02", "01-05", "01-06", "01-07", "01-08", "01-09", "02-23", "03-09", "05-01", "05-11", "06-12", "11-04", "12-31"]),
    Qi = new Set(["01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07", "01-08", "02-23", "03-08", "05-01", "05-09", "06-12", "11-04"]),
    to = t => {
      const e = String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
      const y = t.getFullYear(),
        dk = y + "-" + e;
      if (loOff().has(dk)) return !0;
      if (y === 2026) return Ji.has(e);
      if (Qi.has(e)) return !0;
      const g = t.getDay();
      if (g === 1) {
        const p = new Date(t);
        for (const k of [2, 1]) {
          p.setTime(t.getTime() - k * 864e5);
          const s = String(p.getMonth() + 1).padStart(2, "0") + "-" + String(p.getDate()).padStart(2, "0");
          if (Qi.has(s) && !/^01-0/.test(s)) return !0
        }
      }
      return !1
    };

  function loOff() {
    const s = (l.money && l.money.offDays || "") + "";
    return loOff.c && loOff.k === s ? loOff.c : (loOff.k = s, loOff.c = new Set((s.match(/\d{4}-\d{2}-\d{2}/g) || [])))
  }

  function xn(t, e) {
    const n = new Date(t);
    n.setHours(12, 0, 0, 0);
    let a = 0;
    for (; a < e;) {
      n.setDate(n.getDate() + 1);
      const o = n.getDay();
      o !== 0 && o !== 6 && !to(n) && a++
    }
    return n
  }
  const la = t => {
      const e = t % 10,
        n = t % 100;
      return e === 1 && n !== 11 ? "рабочий день" : e >= 2 && e <= 4 && (n < 12 || n > 14) ? "рабочих дня" : "рабочих дней"
    },
    $n = t => t.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit"
    });

  function Rt(t) {
    const e = new Date(t);
    return e.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit"
    }) + " " + e.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  function ca(t, e) {
    const n = l.blocks,
      a = t.tech || "fdm",
      o = l.printers.find(R => R.id === t.printerId) || ht(),
      s = l.materials.find(R => R.id === t.materialId) || Ct(),
      i = Math.max(1, Math.round(t.qty)),
      r = n.risk ? e.waste / 100 : 0;
    let c, d, u, p, x, m = null,
      L = 0,
      P = 0,
      M = 0,
      E = null;
    if (a === "sls") m = os(t, o, s, i), c = m.jobs, d = m.jobs * m.jobH, u = t.grams * i, p = m.fresh * m.jobs, x = p / 1e3 * s.price, t.share > 0 && m.jobs === 1 && !m.manual && (m.F = Math.min(1, Math.max(.05, i / (Math.max(1, m.perJob) * t.share / 100))), c = m.F, d = m.jobH * m.F, p = Math.max(u * 1.03, m.fresh * m.F), x = p / 1e3 * s.price);
    else {
      const R = Math.max(1, Math.round(t.perPlate || 1));
      c = t._pl != null ? t._pl : Math.ceil(i / R);
      const X = Math.floor(i / R),
        U = i - X * R;
      if (tt.has(a)) {
        E = X * oa(t, R) + (U ? oa(t, U) : 0), L = (X * ls(t, R) + (U ? ls(t, U) : 0)) / 3600, t._pl != null && (E = t._pl, L = (E * (t._fx ?? (+t.fixedS || 0)) + i * (+t.perPartS || 0)) / 3600), P = E * o.warmup / 60, d = L + P;
        const Z = t.ml * i * (1 + r);
        u = t.ml * i * s.density, p = Z * s.density, x = Z / 1e3 * s.price + E * (t.plateCost || 0), m = {
          mlTot: Z
        }
      } else t.plateFree && (c = 0), L = (X * rs(t, R) + (U ? rs(t, U) : 0)) / 3600, P = c * o.warmup / 60, M = cs(t) ? c * Math.max(0, (+o.chamberMin || 0) - (+o.warmup || 0)) / 60 : 0, d = L + P + M, u = t.grams * i, p = u * (1 + r), x = p / 1e3 * (t.priceKg > 0 ? t.priceKg : s.price)
    }
    const k = d * (o.price / Math.max(1, o.life) + o.maint),
      g = (+o.power || 0) + (cs(t) && +o.chamberPower || 0),
      y = d * g / 1e3,
      b = n.energy ? y * (e._kwhEff ?? e.kwh) : 0,
      $ = Number.isFinite(t.plateMin) ? t.plateMin : e.plateMin,
      j = n.labor ? (E ?? c) * $ / 60 : 0,
      v = j * e.rate,
      h = n.post ? i * t.postMin / 60 : 0,
      C = h * e.rate,
      F = n.extras ? i * (t.inserts * t.insertPrice + t.paint) : 0,
      w = n.risk ? Math.min(.6, Math.max(0, e.risk / 100)) : 0,
      T = (x + k + b + v) * w / (1 - w),
      q = (P || 0) + (M || 0),
      Y = o.price / Math.max(1, o.life) + o.maint;
    return {
      prep: q * Y + (n.energy ? q * g / 1e3 * (e._kwhEff ?? e.kwh) : 0) + v + (tt.has(a) ? (E || 0) * (t.plateCost || 0) : 0),
      shareSum: E,
      tech: a,
      qty: i,
      plates: c,
      machineH: d,
      printH: L,
      warmH: P,
      chamberH: M,
      watts: g,
      kwhUsed: y,
      inserts: n.extras ? i * t.inserts * t.insertPrice : 0,
      paint: n.extras ? i * t.paint : 0,
      riskBase: x + k + b + v,
      gramsNet: u,
      gramsTot: p,
      mat: x,
      mach: k,
      energy: b,
      labor: v + C,
      postLabH: h,
      plateLabH: j,
      extra: F,
      risk: T,
      cost: x + k + b + v + C + F + T,
      pr: o,
      mt: s,
      detail: m,
      plateMin: $
    }
  }

  function loPlates(t) {
    if (!Array.isArray(t) || t.length < 2) return t;
    t = t.map(B => ({
      ...B
    }));
    const g = {};
    for (const B of t) {
      const a = B.tech || "fdm";
      if (a === "sls" || B.plateFree || tt.has(a) && B.share > 0) continue;
      const R = Math.max(1, Math.round(B.perPlate || 1)),
        q = Math.max(1, Math.round(B.qty || 1)),
        k = a + "|" + B.printerId + "|" + B.materialId + "|" + (a === "fdm" && cs(B) ? 1 : 0);
      (g[k] = g[k] || []).push([B, q / R])
    }
    for (const k in g) {
      const G = g[k];
      if (G.length < 2) continue;
      const s = G.reduce((x, y) => x + y[1], 0),
        p = Math.max(1, Math.ceil(s - 1e-9)),
        fx = Math.max(...G.map(y => +y[0].fixedS || 0));
      for (const [B, f] of G) B._pl = p * f / s, B._fx = fx
    }
    return t
  }

  function loPc(x) {
    const v = Math.round((+x || 0) * 1000) / 10;
    return S(v, v % 1 ? 1 : 0)
  }

  function loFloor(v, t, e, k) {
    if (!k || t.length !== 1 || t[0]._nf) return v;
    const q = Math.round(+k.q) - 1;
    if (q < 1) return v;
    const r = en([{
      ...t[0],
      qty: q,
      _nf: 1
    }], e);
    return Math.max(v, r.byMarkup)
  }

  function en(t, e) {
    t = loPlates(t);
    const n0 = t.map(B => ca(B, e)),
      n = n0.reduce((B, W) => B + W.machineH, 0),
      a = Wi(n / Math.max(1, +e.printers || 1), n0.reduce((B, W) => B + W.postLabH + W.plateLabH, 0) + (l.blocks.labor ? (+e.setupMin || 0) / 60 : 0)),
      o = Ki(a.start, n / Math.max(1, +e.printers || 1)),
      s = (1 - o) * (+e.kwh || 0) + o * (e.twoRate ? +e.kwhNight || 0 : +e.kwh || 0);
    e = {
      ...e,
      _kwhEff: s
    };
    const i = t.map(B => ({
        it: B,
        c: ca(B, e)
      })),
      r = B => i.reduce((W, et) => W + et.c[B], 0),
      c = l.blocks,
      d = c.labor ? e.setupMin / 60 : 0,
      u = l.part.packOn && +e.packaging || 0,
      p = c.extras ? e.cadH * e.cadRate + u : 0,
      x = c.discount ? e.adjust : 0,
      m = c.discount && l.part.minOn !== !1 ? e.minOrder : 0,
      L = {
        mat: r("mat"),
        mach: r("mach"),
        energy: r("energy"),
        labor: r("labor") + d * e.rate,
        extra: r("extra") + p,
        risk: r("risk")
      },
      P = L.mat + L.mach + L.energy + L.labor + L.extra + L.risk,
      M = a.mode === "rush" ? (+e.rushPct || 0) / 100 : 0,
      E = i.reduce((B, W) => B + W.c.qty, 0),
      k = c.discount && e.optOn ? (e.opt || []).filter(B => +B.q > 0 && E >= +B.q).sort((B, W) => W.q - B.q)[0] : null,
      g = k ? Math.min(90, Math.max(0, +k.d || 0)) / 100 : 0,
      y = r("prep") + d * e.rate,
      b = P - y,
      $ = Number.isFinite(+e.prepMk) ? +e.prepMk : 0,
      j = ((b - (c.extras ? e.cadH * e.cadRate : 0)) * (1 + e.markup / 100) + (c.extras ? e.cadH * e.cadRate : 0) + y * (1 + $ / 100)) * (1 + x / 100) * (1 + M),
      v = loFloor(j * (1 - g), t, e, k),
      h = c.tax ? Math.min(.9, Math.max(0, e.taxRev / 100)) : 0,
      C = 1 + (c.tax ? e.vat : 0) / 100,
      w = (e.minMode === "gross" ? m / C : m) * (1 - h),
      T = v < w,
      q = Math.max(v, w),
      Y = q / (1 - h),
      I = Y * (1 + (c.tax ? e.vat : 0) / 100),
      R = r("machineH"),
      X = r("postLabH"),
      U = loWd(a.end),
      Z = {
        setupH: d,
        cad: c.extras ? e.cadH * e.cadRate : 0,
        pack: c.extras ? u : 0,
        printH: r("printH"),
        warmH: r("warmH"),
        chamberH: r("chamberH"),
        kwhUsed: r("kwhUsed"),
        plateLabH: r("plateLabH"),
        postH: r("postLabH"),
        inserts: r("inserts"),
        paint: r("paint"),
        riskBase: r("riskBase"),
        night: o,
        kwhEff: s,
        adjust: x,
        rush: M,
        t: h
      },
      A = i.length === 1 && i[0].c.shareSum != null && i[0].it.share > 0 ? i[0].c.shareSum / Math.max(1, i[0].c.plates) : null;
    Z.share = A;
    const O = Y > 0 ? I / q : 1,
      _ = T ? 0 : j * M / (1 + M) * (1 - g) * O,
      z = T ? 0 : (j - v) * O,
      D = T ? 0 : y * (1 + $ / 100) * (1 + x / 100) * (1 + M) * (1 - g) * O;
    return {
      minClient: (c.discount && +e.minOrder || 0) * (e.minMode === "gross" ? 1 : 1 + (c.tax ? e.vat : 0) / 100),
      prep: y,
      prod: b,
      prepMk: $,
      prepCl: D,
      kCl: O,
      rushCl: _,
      optCl: z,
      det: Z,
      plan: a,
      rush: M,
      optD: g,
      optEff: j > 0 ? (j - v) / j : 0,
      optQ: k ? +k.q : 0,
      optAmt: j - v,
      lines: i,
      b: L,
      cost: P,
      byMarkup: v,
      net: q,
      minApplied: T,
      taxRev: Y - q,
      vatAmt: I - Y,
      client: I,
      profit: q - P,
      margin: q > 0 ? (q - P) / q * 100 : 0,
      machineH: R,
      gramsNet: r("gramsNet"),
      grams: r("gramsTot"),
      plates: r("plates"),
      qty: r("qty"),
      days: U,
      techs: [...new Set(i.map(B => B.c.tech))]
    }
  }
  let H = null,
    da = 0;
  const dt = typeof window < "u" && window.desktop || null;
  let ut = null,
    Ce = !1,
    ne = null,
    Pt = {
      status: null,
      presets: null
    },
    lt = null;

  function ua() {
    return !H || !H.st || H.st.volMm3 <= 0 ? null : l.tech === "fdm" ? ss(H.st, l.slicer, Ci(ht()), Ct(), l.massCal.fdm * (+Ct().massK || 1)) : tt.has(l.tech) ? is(H.st, l.sla, ht(), Ct(), l.massCal.resin) : null
  }
  const kn = () => l.source === "manual" && l.tech !== "sls",
    Ae = () => !!dt && l.source === "orca" && l.tech === "fdm",
    fa = () => !!(ut && H && ut.ver === H.ver && ut.grams > 0);

  function Pe() {
    const t = l.tech,
      e = ht(),
      n = Ct(),
      a = l.blocks,
      o = H ? wn(H.st, e, t) : 1,
      s = {
        id: "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        tech: t,
        name: (l.part.name || "Деталь").trim(),
        qty: a.batch ? Math.max(1, Math.round(+l.part.qty || 1)) : 1,
        perPlate: t === "sls" ? 1 : +l.part.perPlate > 0 ? Math.round(+l.part.perPlate) : Math.max(1, o),
        printerId: e.id,
        materialId: n.id,
        postMin: +l.part.postMin || 0,
        inserts: +l.part.inserts || 0,
        insertPrice: +l.money.insertPrice || 0,
        paint: l.part.paintOn && +l.money.paintPrice || 0,
        dims: H ? `${S(H.st.dimX,1)} × ${S(H.st.dimY,1)} × ${S(H.st.dimZ,1)} мм` : "",
        color: loColName()
      };
    if (t === "fdm")
      if (s.plateMin = +l.money.plateMin || 0, s.plateCost = 0, kn()) {
        if (!(l.manual.g > 0)) return null;
        s.grams = l.manual.g, s.hours = (+l.manual.h || 0) + (+l.manual.m || 0) / 60, l.manual.chamber != null && (s.chamber = !!l.manual.chamber || Sc(n))
      } else if (Ae() && fa()) {
      s.grams = ut.grams, s.hours = (ut.printS || 0) / 3600, s.orca = !0;
      const i = parseFloat((ut.settings || {}).cost);
      l.orca.useCost && i > 0 && (s.priceKg = i, s.priceSrc = (ut.settings.filament || "").replace(/"/g, ""))
    } else {
      if (!lt) return null;
      s.grams = lt.grams, s.hours = lt.timeS / 3600, s.hist = lt.hist, s.minLayer = lt.minLayer, s.extraS = lt.extraS, s.k = lt.k, Ae() && (s.orcaStale = !0)
    } else if (tt.has(t)) {
      if (s.plateMin = +l.sla.washMin || 0, s.plateCost = +l.sla.washCost || 0, s.cap = Math.max(1, o || +s.perPlate || 1), s.share = l.sla.share === "shared" ? Math.min(100, Math.max(10, +l.sla.fill || 60)) : 0, kn()) {
        if (!(l.manualResin.ml > 0)) return null;
        s.ml = l.manualResin.ml, s.fixedS = (+l.manualResin.h || 0) * 3600 + (+l.manualResin.m || 0) * 60, s.perPartS = 0, s.share = 0
      } else {
        if (!lt) return null;
        s.ml = lt.ml, s.fixedS = lt.fixedS, s.perPartS = lt.perPartS
      }
      s.grams = s.ml * n.density
    } else {
      const mm = +l.sls.mG > 0 && +l.sls.mT > 0;
      if (!mm && (!H || H.st.volMm3 <= 0)) return null;
      const i = H && H.st;
      i && (s.vol = Te(i) / 1e3, s.grams = s.vol * n.density, s.bboxVol = i.dimX * i.dimY * i.dimZ / 1e3, s.dimZ = i.dimZ), s.layer = +l.sls.layer || .11, s.packing = +l.sls.packing || 10, s.plateMin = +l.sls.unpackMin || 0, s.plateCost = 0, s.share = l.sls.share === "batch" ? Math.min(100, Math.max(10, +l.sls.fill || 60)) : 0, mm && (s.grams = +l.sls.mG, s.vol = s.grams / n.density, s.mH = +l.sls.mH || 0, s.mT = +l.sls.mT, s.perPlate = s.qty)
    }
    return s
  }
  const ds = t => !!t && (t.tech === "sls" ? t.vol > 0 : tt.has(t.tech) ? t.ml > 0 : t.grams > 0);
  let Yt, ye, Fe, Lt, ct, He, En = !0;
  const pt = {
    theta: .75,
    phi: 1,
    r: 300,
    ty: 20
  };
  let zt = !0,
    Re = !1;

  function eo() {
    const t = f("viewer");
    try {
      Yt = new THREE.WebGLRenderer({
        antialias: !0,
        alpha: !0
      })
    } catch {
      t.innerHTML = '<div class="no-gl">3D-просмотр недоступен: браузер не дал WebGL. Расчёты работают.</div>';
      return
    }
    Re = !0, Yt.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)), t.appendChild(Yt.domElement), ye = new THREE.Scene, Fe = new THREE.PerspectiveCamera(38, 1, .5, 2e4), ye.add(new THREE.HemisphereLight(16777215, 9083557, .75));
    const e = new THREE.DirectionalLight(16777215, .75);
    e.position.set(200, 400, 250), ye.add(e);
    const n = new THREE.DirectionalLight(12573951, .3);
    n.position.set(-250, 150, -200), ye.add(n), Lt = new THREE.Group, Lt.rotation.x = -Math.PI / 2, ye.add(Lt), He = new THREE.Group, ye.add(He), new ResizeObserver(us).observe(t), us();
    const o = new Map;
    let s = 0;
    t.addEventListener("pointerdown", r => {
      t.setPointerCapture(r.pointerId), o.set(r.pointerId, {
        x: r.clientX,
        y: r.clientY
      })
    }), t.addEventListener("pointermove", r => {
      if (!o.has(r.pointerId)) return;
      const c = o.get(r.pointerId);
      if (o.set(r.pointerId, {
          x: r.clientX,
          y: r.clientY
        }), o.size === 1) pt.theta -= (r.clientX - c.x) * .008, pt.phi = Math.min(Math.PI - .02, Math.max(.02, pt.phi - (r.clientY - c.y) * .008));
      else if (o.size === 2) {
        const [d, u] = [...o.values()], p = Math.hypot(d.x - u.x, d.y - u.y);
        s && (pt.r = Math.min(8e3, Math.max(20, pt.r * s / p))), s = p
      }
      ma()
    });
    const i = r => {
      o.delete(r.pointerId), o.size < 2 && (s = 0)
    };
    t.addEventListener("pointerup", i), t.addEventListener("pointercancel", i), t.addEventListener("wheel", r => {
      r.preventDefault(), pt.r = Math.min(8e3, Math.max(20, pt.r * (1 + Math.sign(r.deltaY) * .1))), ma()
    }, {
      passive: !1
    }), (function r() {
      requestAnimationFrame(r), zt && (Yt.render(ye, Fe), zt = !1)
    })()
  }

  function us() {
    if (!Re) return;
    const t = f("viewer"),
      e = t.clientWidth || 300,
      n = t.clientHeight || 300;
    Yt.setSize(e, n), Fe.aspect = e / n, Fe.updateProjectionMatrix(), zt = !0
  }

  function ma() {
    Re && (Fe.position.set(pt.r * Math.sin(pt.phi) * Math.sin(pt.theta), pt.ty + pt.r * Math.cos(pt.phi), pt.r * Math.sin(pt.phi) * Math.cos(pt.theta)), Fe.lookAt(0, pt.ty, 0), zt = !0)
  }

  function Sn() {
    if (!Re) return;
    const t = H && H.st,
      e = ht(),
      n = t ? Math.max(t.dimX, t.dimY, t.dimZ, 30) : Math.max(e.bedX, e.bedY);
    pt.r = Math.max(60, n * 2.4), pt.ty = t ? t.dimZ * .45 : 0, pt.theta = .75, pt.phi = 1, ma()
  }

  function Ln() {
    if (!Re) return;
    for (; He.children.length;) {
      const c = He.children.pop();
      c.geometry && c.geometry.dispose()
    }
    const t = ht(),
      e = t.bedX,
      n = t.bedY,
      a = t.bedZ,
      o = [],
      s = [];
    for (let c = -e / 2; c <= e / 2 + 1e-6; c += 10)(Math.abs(Math.round(c + e / 2)) % 50 === 0 ? s : o).push(c, 0, -n / 2, c, 0, n / 2);
    for (let c = -n / 2; c <= n / 2 + 1e-6; c += 10)(Math.abs(Math.round(c + n / 2)) % 50 === 0 ? s : o).push(-e / 2, 0, c, e / 2, 0, c);
    const i = (c, d, u) => {
      const p = new THREE.BufferGeometry;
      return p.setAttribute("position", new THREE.Float32BufferAttribute(c, 3)), new THREE.LineSegments(p, new THREE.LineBasicMaterial({
        color: d,
        transparent: !0,
        opacity: u
      }))
    };
    He.add(i(o, 8228248, .28), i(s, 8228248, .55));
    const r = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(e, a, n)), new THREE.LineBasicMaterial({
      color: 748169,
      transparent: !0,
      opacity: .35
    }));
    r.position.y = a / 2, He.add(r), zt = !0
  }

  function ge() {
    if (!Re || (ct && (Lt.remove(ct), ct.geometry.dispose(), ct = null), !H)) return;
    const t = new THREE.BufferGeometry;
    t.setAttribute("position", new THREE.BufferAttribute(H.pos, 3)), t.computeVertexNormals();
    const e = H.pos.length / 9,
      n = new Float32Array(H.pos.length),
      a = Ko(),
      o = [.93, .3, .36];
    for (let s = 0; s < e; s++) {
      const i = En && l.tech !== "sls" && H.st.over[s] ? o : a;
      for (let r = 0; r < 3; r++) n[s * 9 + r * 3] = i[0], n[s * 9 + r * 3 + 1] = i[1], n[s * 9 + r * 3 + 2] = i[2]
    }
    t.setAttribute("color", new THREE.BufferAttribute(n, 3)), ct = new THREE.Mesh(t, new THREE.MeshStandardMaterial({
      vertexColors: !0,
      roughness: .55,
      metalness: .05,
      side: THREE.DoubleSide
    })), Lt.add(ct), zt = !0
  }

  function fs(t) {
    const e = t.byteLength,
      n = new DataView(t),
      a = new TextDecoder().decode(new Uint8Array(t, 0, Math.min(e, 4096))),
      o = /^\s*solid/i.test(a) && /facet|endsolid/i.test(a),
      s = u => {
        const p = new Float32Array(u * 9);
        for (let x = 0, m = 84; x < u; x++, m += 50)
          for (let L = 0; L < 9; L++) p[x * 9 + L] = n.getFloat32(m + 12 + L * 4, !0);
        return p
      };
    if (e >= 84) {
      const u = n.getUint32(80, !0),
        p = Math.floor((e - 84) / 50);
      if (84 + u * 50 === e) return s(u);
      if (!o) return s(u > 0 && u <= p ? u : p)
    }
    const i = a.length < e ? new TextDecoder().decode(t) : a,
      r = /vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)/g,
      c = [];
    let d;
    for (; d = r.exec(i);) c.push(+d[1], +d[2], +d[3]);
    return new Float32Array(c.slice(0, Math.floor(c.length / 9) * 9))
  }

  function ms(t) {
    const e = [],
      n = [];
    for (const a of t.split(/\r?\n/)) {
      const o = a.trim();
      if (!o || o[0] === "#") continue;
      const s = o.split(/\s+/);
      if (s[0] === "v") e.push([+s[1], +s[2], +s[3]]);
      else if (s[0] === "f") {
        const i = s.slice(1).map(r => {
          const c = parseInt(r, 10);
          return c < 0 ? e.length + c : c - 1
        }).filter(r => e[r]);
        for (let r = 1; r < i.length - 1; r++) n.push(...e[i[0]], ...e[i[r]], ...e[i[r + 1]])
      }
    }
    return new Float32Array(n)
  }
  async function ps(t) {
    const e = await JSZip.loadAsync(t),
      n = g => new DOMParser().parseFromString(g, "application/xml");
    let a = null;
    const o = e.file("Metadata/slice_info.config");
    if (o) {
      const g = n(await o.async("string"));
      let y = 0,
        b = 0;
      for (const $ of g.getElementsByTagName("metadata")) $.getAttribute("key") === "prediction" && (y += +$.getAttribute("value") || 0), $.getAttribute("key") === "weight" && (b += +$.getAttribute("value") || 0);
      (y || b) && (a = {
        sec: y,
        g: b
      })
    }
    const s = new Map,
      NM = new Map,
      i = Object.keys(e.files).filter(g => /\.model$/i.test(g)),
      r = (g, y) => {
        for (const b of g.attributes)
          if (b.localName === y) return b.value;
        return null
      };
    let c = null;
    const d = e.file("_rels/.rels");
    if (d) {
      const g = (await d.async("string")).match(/Target="\/?([^"]+\.model)"/i);
      g && (c = g[1])
    }(!c || !i.includes(c)) && (c = i.find(g => /(^|\/)3dmodel\.model$/i.test(g)) || i[0]);
    const u = {
      micron: .001,
      millimeter: 1,
      centimeter: 10,
      inch: 25.4,
      foot: 304.8,
      meter: 1e3
    };
    let p = "millimeter";
    for (const g of i) {
      const y = n(await e.file(g).async("string")),
        b = g.replace(/^\//, "");
      b === c && (p = y.documentElement.getAttribute("unit") || "millimeter");
      for (const $ of y.getElementsByTagName("object")) {
        const j = $.getAttribute("id"),
          v = $.getElementsByTagName("mesh")[0];
        NM.set(b + "#" + j, $.getAttribute("name") || "");
        if (v) {
          const h = v.getElementsByTagName("vertex"),
            C = new Float64Array(h.length * 3);
          for (let T = 0; T < h.length; T++) C[T * 3] = +h[T].getAttribute("x"), C[T * 3 + 1] = +h[T].getAttribute("y"), C[T * 3 + 2] = +h[T].getAttribute("z");
          const F = v.getElementsByTagName("triangle"),
            w = new Uint32Array(F.length * 3);
          for (let T = 0; T < F.length; T++) w[T * 3] = +F[T].getAttribute("v1"), w[T * 3 + 1] = +F[T].getAttribute("v2"), w[T * 3 + 2] = +F[T].getAttribute("v3");
          s.set(b + "#" + j, {
            V: C,
            T: w
          })
        } else {
          const h = [...$.getElementsByTagName("component")].map(C => ({
            path: (r(C, "path") || "").replace(/^\//, "") || b,
            id: C.getAttribute("objectid"),
            m: x(C.getAttribute("transform"))
          }));
          s.set(b + "#" + j, {
            comps: h
          })
        }
      }
      b === c && s.set("__build", [...y.getElementsByTagName("item")].map($ => ({
        id: $.getAttribute("objectid"),
        path: (r($, "path") || "").replace(/^\//, "") || c,
        m: x($.getAttribute("transform"))
      })))
    }

    function x(g) {
      const y = (g || "").trim().split(/\s+/).map(Number);
      return y.length === 12 && y.every(Number.isFinite) ? y : [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    }

    function m(g, y) {
      const b = new Array(12);
      for (let $ = 0; $ < 3; $++)
        for (let j = 0; j < 3; j++) b[$ * 3 + j] = g[$ * 3] * y[j] + g[$ * 3 + 1] * y[3 + j] + g[$ * 3 + 2] * y[6 + j];
      for (let $ = 0; $ < 3; $++) b[9 + $] = g[9] * y[$] + g[10] * y[3 + $] + g[11] * y[6 + $] + y[9 + $];
      return b
    }
    const L = [];

    function P(g, y, b, $) {
      const j = s.get(g + "#" + y);
      if (!(!j || $ > 16))
        if (j.V) {
          const {
            V: v,
            T: h
          } = j;
          for (let C = 0; C < h.length; C++) {
            const F = h[C] * 3,
              w = v[F],
              T = v[F + 1],
              q = v[F + 2];
            L.push(w * b[0] + T * b[3] + q * b[6] + b[9], w * b[1] + T * b[4] + q * b[7] + b[10], w * b[2] + T * b[5] + q * b[8] + b[11])
          }
        } else
          for (const v of j.comps) P(v.path, v.id, m(v.m, b), $ + 1)
    }
    const M = s.get("__build") || [];
    const PR = [];
    for (const g of M) {
      const a0 = L.length;
      P(g.path, g.id, g.m, 0), L.length > a0 && PR.push({
        a: a0,
        b: L.length,
        name: NM.get(g.path + "#" + g.id) || ""
      })
    }
    const E = u[p] || 1,
      k = new Float32Array(L);
    if (E !== 1)
      for (let g = 0; g < k.length; g++) k[g] *= E;
    return {
      pos: k,
      slice: a,
      unit: p,
      parts: PR
    }
  }
  const hs = "https://cdn.jsdelivr.net/npm/occt-import-js@0.0.23/dist/";
  let Oe = null;

  function bs() {
    return Oe || (Oe = new Promise((t, e) => {
      const n = () => {
        if (typeof window.occtimportjs != "function") return e(new Error("модуль OpenCascade не загрузился"));
        window.occtimportjs({
          locateFile: o => hs + o
        }).then(t, () => e(new Error("не удалось запустить модуль OpenCascade (WebAssembly)")))
      };
      if (typeof window.occtimportjs == "function") return n();
      const a = document.createElement("script");
      a.src = hs + "occt-import-js.js", a.integrity = "sha384-Z8pO9JEhFZF+mvDKxMuLvPT85VP7nly8CqYjBatl0bMeW9OsaKCes4gEUPL4nihc", a.crossOrigin = "anonymous", a.onload = n, a.onerror = () => e(new Error("нет доступа к cdn.jsdelivr.net")), document.head.appendChild(a)
    }).catch(t => {
      throw Oe = null, t
    }), Oe)
  }
  async function no(t, e) {
    const n = await bs(),
      a = {
        linearUnit: "millimeter",
        linearDeflectionType: "bounding_box_ratio",
        linearDeflection: .0015,
        angularDeflection: .35
      },
      o = e === "iges" ? n.ReadIgesFile(new Uint8Array(t), a) : n.ReadStepFile(new Uint8Array(t), a);
    if (!o || !o.success || !o.meshes || !o.meshes.length) throw new Error("в файле не найдено твёрдых тел");
    let s = 0;
    for (const c of o.meshes) s += c.index ? c.index.array.length : c.attributes.position.array.length / 3;
    const i = new Float32Array(s * 3);
    let r = 0;
    for (const c of o.meshes) {
      const d = c.attributes.position.array,
        u = c.index ? c.index.array : null;
      if (u)
        for (let p = 0; p < u.length; p++) {
          const x = u[p] * 3;
          i[r++] = d[x], i[r++] = d[x + 1], i[r++] = d[x + 2]
        } else
          for (let p = 0; p < d.length; p++) i[r++] = d[p]
    }
    return {
      pos: i,
      bodies: o.meshes.length
    }
  }

  function br(t) {
    const e = m => {
        const L = t.match(m);
        return L ? L[1] : null
      },
      n = m => m.split(",").reduce((L, P) => L + (parseFloat(P) || 0), 0),
      a = "([\\d.]+(?:[ \\t]*,[ \\t]*[\\d.]+)*)",
      o = gn("fdm").find(m => m.id === l.sel.fdm.material) || {
        density: 1.24
      },
      s = parseFloat(e(/filament_density\s*[:=]\s*([\d.]+)/i)),
      i = s > 0 ? s : o.density;
    let r = null,
      c, d = "";
    (c = e(new RegExp("total filament (?:weight|used) \\[g\\][ \\t]*[:=][ \\t]*" + a, "i"))) || (c = e(new RegExp("filament used \\[g\\][ \\t]*[:=][ \\t]*" + a, "i"))) ? r = n(c): (c = e(/Plastic weights?:\s*([\d.]+)\s*g/i)) && (r = +c), !(r > 0) && (c = e(new RegExp("filament used \\[cm3\\][ \\t]*[:=][ \\t]*" + a, "i"))) && (r = n(c) * i, d = "по объёму"), !(r > 0) && (c = e(new RegExp("filament used \\[mm\\][ \\t]*[:=][ \\t]*" + a, "i"))) && (r = n(c) / 1e3 * Kn * i, d = "по длине нити"), !(r > 0) && (c = e(/;Filament used:[ \t]*([\d.]+)m/i)) && (r = +c * Kn * i, d = "по длине нити"), !(r > 0) && (c = e(/;\s*Material#1 Used:[ \t]*([\d.]+)/i)) && (r = +c / 1e3 * Kn * i, d = "по длине нити");
    const u = m => {
      let L = 0;
      const P = /(\d+(?:\.\d+)?)\s*([dhms])/gi;
      let M;
      for (; M = P.exec(m);) L += +M[1] * {
        d: 86400,
        h: 3600,
        m: 60,
        s: 1
      } [M[2].toLowerCase()];
      return L
    };
    let p = null;
    (c = e(/model printing time:[ \t]*([^;\n]+)/i)) || (c = e(/estimated printing time \(normal mode\)[ \t]*=[ \t]*([^\n]+)/i)) || (c = e(/total estimated time:[ \t]*([^;\n]+)/i)) ? p = u(c): (c = e(/;TIME:(\d+)/)) ? p = +c : (c = e(/;\s*Build time:[ \t]*([^\n]+)/i)) ? p = u(c) : (c = e(/;\s*Print Time:[ \t]*(\d+)/i)) && (p = +c);
    const x = d ? `вес посчитан ${d} при плотности ${S(i,2)} г/см³` : "";
    return {
      g: r > 0 ? r : null,
      sec: p > 0 ? p : null,
      note: x
    }
  }
  async function yr(t) {
    return t.size <= 2 * 15e5 ? await t.text() : await t.slice(0, 15e5).text() + `
` + await t.slice(t.size - 15e5).text()
  }

  function pa(t, e, n, a) {
    t > 0 && (l.manual.g = +t.toFixed(2)), e && (l.manual.h = Math.floor(e / 3600), l.manual.m = Math.round(e % 3600 / 60), l.manual.m === 60 && (l.manual.h++, l.manual.m = 0)), l.tech !== "fdm" && Ve("fdm", !0), Ge("manual"), ft(), f("manualNote").textContent = `Из ${n}: ${t?S(t,1)+" г":"вес не найден"}, ${e?vt(e):"время не найдено"}${a?", "+a:""}. Если на столе несколько деталей, это расход на весь стол.`
  }
  async function loG3(n, o) {
    try {
      const z = await JSZip.loadAsync(await n.arrayBuffer()),
        k = Object.keys(z.files).filter(x => /^Metadata\/plate_\d+\.gcode$/i.test(x)).sort((x, y) => x.localeCompare(y, void 0, {
          numeric: !0
        }));
      if (!k.length) return !1;
      const tx = await z.file(k[0]).async("string");
      k.length > 1 && setTimeout(() => V(`${n.name}: в файле ${k.length} стола — посчитан первый`), 2500);
      await ao(new File([tx], n.name), o);
      return !0
    } catch (e) {
      console.error(e), V(`${n.name}: не удалось прочитать нарезку Bambu (${e.message||e})`);
      return !0
    }
  }
  async function ha(t) {
    if (t = [...t], !t.length) return;
    const e = l.blocks.basket && (t.filter(n => /\.(stl|obj|3mf|step|stp|igs|iges)$/i.test(n.name)).length > 1 || !!loCur);
    for (const n of t) {
      const a = n.name.split(".").pop().toLowerCase(),
        o = n.name.replace(/\.[^.]+$/, "");
      try {
        if (/\.gcode\.3mf$/i.test(n.name) && await loG3(n, o.replace(/\.gcode$/i, ""))) continue;
        if (a === "bgcode") {
          V(`${n.name}: бинарный G-code Prusa не читается. Сохраните обычный .gcode (в PrusaSlicer снимите галочку «Двоичный G-code»).`);
          continue
        }
        if (a === "gcode" || a === "gco") {
          await ao(n, o);
          continue
        }
        let s, i = null,
          r = "",
          mp = null;
        if (!["stl", "gcode", "gco"].includes(a) && await hi(n) === "cancel") continue;
        if (["step", "stp", "igs", "iges"].includes(a)) {
          const c = !Oe;
          it(!0, c ? "Загружаю модуль чтения STEP (около 8 МБ, один раз)…" : `Разбираю ${n.name}…`);
          try {
            c && (await bs(), f("busyText").textContent = `Разбираю ${n.name}…`), await kt();
            const d = await no(await n.arrayBuffer(), a.startsWith("i") ? "iges" : "step");
            s = d.pos, r = d.bodies > 1 ? `, тел: ${d.bodies}` : ""
          } catch (d) {
            it(!1), V(`${n.name}: ${d.message}. ` + (/jsdelivr|WebAssembly|не загрузился/.test(d.message) ? "Нужен интернет для загрузки модуля OpenCascade." : "Экспортируйте модель в STL или 3MF."));
            continue
          }
          it(!1)
        } else if (a === "stl") {
          const c = await hi(n);
          if (c === "cancel") continue;
          if (c === "simplify") s = await Go(n), r = `, упрощено до ${S(s.length/9)} треугольников`;
          else {
            it(!0, `Читаю ${n.name}…`), await kt();
            try {
              s = fs(await n.arrayBuffer())
            } finally {
              it(!1)
            }
          }
        } else if (a === "obj") s = ms(await n.text());
        else if (a === "3mf") {
          it(!0, `Разбираю ${n.name}…`), await kt();
          try {
            const c = await ps(await n.arrayBuffer());
            s = c.pos, i = c.slice, mp = c.parts && c.parts.length > 1 && l.blocks.basket && !c.slice ? c.parts : null, c.unit && c.unit !== "millimeter" && (r = `, единицы файла: ${c.unit}`)
          } finally {
            it(!1)
          }
        } else {
          V(`${n.name}: формат не поддерживается`);
          continue
        }
        if (mp && s && s.length >= 9) {
          for (const [q, pp] of mp.entries()) await loAddGeom(s.slice(pp.a, pp.b), pp.name || o + " · " + (q + 1));
          V(`${n.name}: ${mp.length} объектов — отдельными деталями заказа`);
          continue
        }
        if (!s || s.length < 9) {
          if (i) {
            loGc = n.name, pa(i.g, i.sec, n.name), l.part.name = o.replace(/\.gcode$/i, ""), ue(), V(`Расчёт по нарезке: ${n.name}`);
            continue
          }
          V(`${n.name}: в файле не найдено треугольников`);
          continue
        }
        e && loStoreCur(), Zt.noAuto = !0;
        try {
          await Zt(s, n.name)
        } finally {
          Zt.noAuto = !1
        }
        try {
          await yi(!0)
        } catch (c) {
          console.error(c)
        }
        l.part.name = o;
        {
          const c = o.match(/(?:^|[_\s\-\[\]()])x(\d{1,3})(?=[_\s\-\[\]().]|$)/i);
          c && +c[1] > 0 ? (l.part.qty = +c[1], l.part.qtyFromName = !0, e || setTimeout(() => V(`Количество ${c[1]} шт взято из имени файла`), 1600)) : l.part.qtyFromName && (l.part.qty = 1, l.part.qtyFromName = !1)
        }
        i && pa(i.g, i.sec, n.name + " (нарезанный 3MF)"), ft(), at(), Vt(), e ? loNewPart() : l.mode !== "simple" && V(`${n.name}: ${S(H.st.dimX,1)} × ${S(H.st.dimY,1)} × ${S(H.st.dimZ,1)} мм, ${S(H.st.volMm3/1e3,2)} см³${r}. Положение подобрано само — поменять можно кнопками «Положение» и «На грань»`, 5e3)
      } catch (s) {
        console.error(s), it(!1), V(`${n.name}: не удалось прочитать файл (${s.message||s})`)
      }
    }
    e && V("Детали добавлены в список заказа с текущими настройками.")
  }
  async function ao(t, e) {
    it(!0, `Читаю ${t.name}…`);
    let n;
    try {
      n = await Ba(t, o => {
        f("busyText").textContent = `Читаю ${t.name}: ${Math.round(o*100)}%`
      })
    } finally {
      it(!1)
    }
    const a = n.chamberC > 0;
    if (n.objects.length > 1 && l.blocks.basket && document.body.classList.contains("money")) {
      const o = ht(),
        s = Ct(),
        i = "g" + Date.now().toString(36);
      n.objects.forEach((r, c) => {
        l.basket.push({
          id: i + c,
          tech: "fdm",
          name: r.name,
          qty: r.copies,
          perPlate: r.copies,
          printerId: o.id,
          materialId: s.id,
          postMin: +l.part.postMin || 0,
          inserts: +l.part.inserts || 0,
          insertPrice: +l.money.insertPrice || 0,
          paint: l.part.paintOn && +l.money.paintPrice || 0,
          grams: r.grams / r.copies,
          hours: r.timeS / r.copies / 3600,
          plateMin: +l.money.plateMin || 0,
          plateFree: c > 0,
          chamber: a,
          gcode: t.name,
          dims: ""
        })
      }), at(), V(`${t.name}: ${n.objects.length} ${loPl(n.objects.length,"деталь","детали","деталей")} со стола добавлены в список заказа · ${S(n.grams,1)} г · ${vt(n.machineS||0)}${a?" · камера "+S(n.chamberC)+" °C":""}`);
      return
    }
    l.manual.chamber = a;
    let mt0 = "";
    {
      const y = (n.filaments[0] || {}).type || "",
        g = y && gn("fdm").find(q => fi(q.name) === fi(y)) || y && gn("fdm").find(q => fi(q.name).startsWith(fi(y)));
      g ? (l.sel.fdm.material = g.id, mt0 = ", материал " + g.name) : y && (mt0 = `, материала «${y}» нет в списке — выберите вручную`)
    }
    loGc = t.name, pa(n.grams, n.machineS, t.name, a ? `камера ${S(n.chamberC)} °C` : ""), l.part.name = e, ue(), V(n.grams || n.machineS ? `Расчёт по G-code: ${t.name}${mt0}` : `${t.name}: в файле нет сводки слайсера`)
  }
  let loGc = null;
  const ze = {
      light: "Лёгкие",
      medium: "Средние",
      heavy: "Сложные",
      hybrid: "Гибридные",
      islands: "Только острова",
      stab: "Стабилизирующие",
      normal: "Обычные",
      tree: "Древовидные"
    },
    ba = {
      none: {
        l: "Нет",
        d: "Отдельные столбики без перемычек — меньше материала, легче снимать"
      },
      braces: {
        l: "Связи",
        d: "Зигзаг-перемычки у сложных и высоких опор"
      },
      scaffold: {
        l: "Леса",
        d: "Каждая опора связана с соседями горизонтальными балками и диагоналями — жёсткая решётка, как строительные леса"
      }
    },
    so = {
      resin: {
        light: {
          sp: 4,
          r: .45,
          tip: .22,
          tipL: 1.6,
          thr: 40,
          brace: 0,
          pad: 1.4
        },
        medium: {
          sp: 2.6,
          r: .6,
          tip: .32,
          tipL: 1.8,
          thr: 30,
          brace: 0,
          pad: 1.8
        },
        heavy: {
          sp: 1.8,
          r: .8,
          tip: .42,
          tipL: 2,
          thr: 20,
          brace: 7,
          pad: 2.2
        }
      },
      fdm: {
        light: {
          sp: 7,
          r: .6,
          tip: .4,
          tipL: 1.2,
          thr: 60,
          brace: 0,
          pad: 2
        },
        medium: {
          sp: 5,
          r: .75,
          tip: .5,
          tipL: 1.2,
          thr: 50,
          brace: 0,
          pad: 2.4
        },
        heavy: {
          sp: 3.5,
          r: .95,
          tip: .6,
          tipL: 1.2,
          thr: 40,
          brace: 10,
          pad: 3
        }
      }
    },
    ys = [{
      k: "sp",
      l: "Шаг опор",
      u: "мм",
      s: .1,
      d: "Расстояние между опорами"
    }, {
      k: "r",
      l: "Ствол Ø",
      u: "мм",
      s: .1,
      d: "Толщина опоры",
      x2: 1
    }, {
      k: "tip",
      l: "Касание Ø",
      u: "мм",
      s: .05,
      d: "Толщина в точке касания: тоньше — меньше след",
      x2: 1
    }, {
      k: "tipL",
      l: "Длина касания",
      u: "мм",
      s: .1,
      d: "Конус от касания до ствола"
    }, {
      k: "thr",
      l: "Угол нависания",
      u: "°",
      s: 1,
      d: "Опоры под гранями круче этого угла от вертикали"
    }, {
      k: "brace",
      l: "Связи через",
      u: "мм",
      s: 1,
      d: "Перемычки между опорами; 0 — без связей"
    }, {
      k: "pad",
      l: "Подошва Ø",
      u: "мм",
      s: .1,
      d: "Опора на платформе",
      x2: 1
    }],
    Tn = {
      fdm: {
        none: {
          l: "Нет"
        },
        brim: {
          l: "Кайма"
        },
        raft: {
          l: "Плот",
          t: .9,
          m: 3,
          fill: .7
        }
      },
      resin: {
        none: {
          l: "Без плота"
        },
        thin: {
          l: "Тонкий",
          t: .6,
          m: 1.5,
          fill: 1
        },
        std: {
          l: "Стандартный",
          t: 1.5,
          m: 2.5,
          fill: 1
        },
        grid: {
          l: "Решётчатый",
          t: 1.5,
          m: 2.5,
          fill: .45
        }
      }
    };
  let xt = null,
    G = null,
    It = null,
    jt = null,
    nn = null;
  const an = (t = l.tech) => tt.has(t) ? "resin" : "fdm";

  function ae(t, e) {
    const n = e ? "resin" : "fdm";
    return {
      ...so[n][t],
      ...(l.sup.cfg[n] || {})[t] || {},
      lift: e ? Math.max(1, +l.sup.lift || 5) : 0
    }
  }

  function sn(t = an()) {
    let e = l.sup.raft[t] in Tn[t] ? l.sup.raft[t] : "none";
    return t === "fdm" && e !== "raft" && (e = l.slicer.brim ? "brim" : "none"), {
      key: e,
      ...Tn[t][e]
    }
  }

  function Cn(t) {
    const e = sn(t ? "resin" : "fdm"),
      n = e.t || 0;
    if (t) {
      const a = Math.max(1, +l.sup.lift || 5);
      return {
        lift: a,
        plat: -a,
        base: -a + n,
        rc: e
      }
    }
    return {
      lift: n,
      plat: -n,
      base: 0,
      rc: e
    }
  }

  function Ie(t) {
    return t && Lt && (Lt.remove(t), t.geometry.dispose()), null
  }

  function je(t) {
    xt = Ie(xt), It = Ie(It), G = null, jt = null, nn = null, H && H.st && delete H.st.userSup, typeof ct < "u" && ct && (ct.position.z = 0), Ft(), typeof Gt == "function" && Gt(), typeof zt < "u" && (zt = !0), t || at()
  }

  function ya() {
    if (nn && nn.ver === H.ver) return nn;
    const t = H.pos,
      e = t.length / 9;
    let n = 1 / 0,
      a = 1 / 0,
      o = -1 / 0,
      s = -1 / 0;
    for (let E = 0; E < t.length; E += 3) {
      const k = t[E],
        g = t[E + 1];
      k < n && (n = k), k > o && (o = k), g < a && (a = g), g > s && (s = g)
    }
    const i = new Float32Array(e),
      r = new Float32Array(e);
    for (let E = 0; E < e; E++) {
      const k = E * 9,
        g = t[k + 3] - t[k],
        y = t[k + 4] - t[k + 1],
        b = t[k + 5] - t[k + 2],
        $ = t[k + 6] - t[k],
        j = t[k + 7] - t[k + 1],
        v = t[k + 8] - t[k + 2],
        h = y * v - b * j,
        C = b * $ - g * v,
        F = g * j - y * $,
        w = Math.hypot(h, C, F) || 1;
      i[E] = F / w, r[E] = Math.abs(F) / 2
    }
    const c = Math.max(1.5, Math.sqrt((o - n + 1) * (s - a + 1) / Math.max(400, Math.min(25e4, e / 2)))),
      d = Math.max(1, Math.ceil((o - n) / c) + 1),
      u = Math.max(1, Math.ceil((s - a) / c) + 1),
      p = new Int32Array(d * u + 1),
      x = E => {
        const k = E * 9;
        return [Math.floor((Math.min(t[k], t[k + 3], t[k + 6]) - n) / c), Math.floor((Math.max(t[k], t[k + 3], t[k + 6]) - n) / c), Math.floor((Math.min(t[k + 1], t[k + 4], t[k + 7]) - a) / c), Math.floor((Math.max(t[k + 1], t[k + 4], t[k + 7]) - a) / c)]
      };
    for (let E = 0; E < e; E++) {
      if (Math.abs(i[E]) < 1e-4) continue;
      const [k, g, y, b] = x(E);
      for (let $ = y; $ <= b; $++)
        for (let j = k; j <= g; j++) p[$ * d + j + 1]++
    }
    for (let E = 1; E < p.length; E++) p[E] += p[E - 1];
    const m = p.slice(),
      L = new Int32Array(p[p.length - 1]);
    for (let E = 0; E < e; E++) {
      if (Math.abs(i[E]) < 1e-4) continue;
      const [k, g, y, b] = x(E);
      for (let $ = y; $ <= b; $++)
        for (let j = k; j <= g; j++) L[m[$ * d + j]++] = E
    }
    const P = (E, k, g) => {
        const y = E * 9,
          b = t[y],
          $ = t[y + 1],
          j = t[y + 3],
          v = t[y + 4],
          h = t[y + 6],
          C = t[y + 7],
          F = (v - C) * (b - h) + (h - j) * ($ - C);
        if (Math.abs(F) < 1e-12) return NaN;
        const w = ((v - C) * (k - h) + (h - j) * (g - C)) / F,
          T = ((C - $) * (k - h) + (b - h) * (g - C)) / F,
          q = 1 - w - T;
        return w < -1e-6 || T < -1e-6 || q < -1e-6 ? NaN : w * t[y + 2] + T * t[y + 5] + q * t[y + 8]
      },
      M = (E, k) => {
        const g = Math.floor((E - n) / c),
          y = Math.floor((k - a) / c),
          b = [];
        if (g < 0 || y < 0 || g >= d || y >= u) return b;
        for (let $ = p[y * d + g]; $ < p[y * d + g + 1]; $++) {
          const j = L[$],
            v = P(j, E, k);
          Number.isFinite(v) && b.push({
            z: v,
            nz: i[j]
          })
        }
        return b
      };
    return nn = {
      ver: H.ver,
      pos: t,
      n: e,
      nz: i,
      ar: r,
      zAt: P,
      hits: M,
      x0: n,
      y0: a,
      x1: o,
      y1: s
    }
  }

  function An(t, e, n, a, o) {
    const s = t.pos,
      i = [],
      r = new Set,
      c = a ? -1 : .4;
    for (let d = 0; d < t.n && i.length < o; d++) {
      if (t.nz[d] >= e) continue;
      const u = d * 9,
        p = n(t.nz[d]);
      if (!a && Math.max(s[u + 2], s[u + 5], s[u + 8]) < c) continue;
      const x = Math.min(s[u], s[u + 3], s[u + 6]),
        m = Math.max(s[u], s[u + 3], s[u + 6]),
        L = Math.min(s[u + 1], s[u + 4], s[u + 7]),
        P = Math.max(s[u + 1], s[u + 4], s[u + 7]);
      let M = 0;
      for (let E = Math.ceil(L / p); E * p <= P; E++)
        for (let k = Math.ceil(x / p); k * p <= m; k++) {
          const g = k * p,
            y = E * p,
            b = t.zAt(d, g, y);
          if (!Number.isFinite(b) || b < c) continue;
          const $ = Math.round(g / p * 1e3) + "," + Math.round(y / p * 1e3) + "," + Math.round(b / (p * 1.5));
          r.has($) || (r.add($), i.push({
            x: g,
            y,
            z: b,
            nz: t.nz[d]
          }), M++)
        }
      if (!M && (m - x) * (P - L) > p * p * .12) {
        const E = (s[u] + s[u + 3] + s[u + 6]) / 3,
          k = (s[u + 1] + s[u + 4] + s[u + 7]) / 3,
          g = (s[u + 2] + s[u + 5] + s[u + 8]) / 3,
          y = "c" + Math.round(E / p) + "," + Math.round(k / p) + "," + Math.round(g / (p * 1.5));
        g >= c && !r.has(y) && (r.add(y), i.push({
          x: E,
          y: k,
          z: g,
          nz: t.nz[d]
        }))
      }
    }
    return i
  }

  function Pn(t, e, n, a) {
    const o = [];
    for (const s of e) {
      let i = -1 / 0,
        r = 0;
      for (const p of t.hits(s.x, s.y)) p.z < s.z - .3 && p.z > i && (i = p.z, r = p.nz);
      let c = n,
        d = !1;
      if (i > -1 / 0) {
        if (r <= 0) continue;
        i > n && (c = i, d = !0)
      }
      const u = a(s, s.z - c, d);
      s.z - c < u.tipL * .8 || o.push({
        x: s.x,
        y: s.y,
        z: s.z,
        land: c,
        onModel: d,
        r: u.r,
        tip: u.tip,
        tipL: u.tipL,
        pad: u.pad,
        brace: u.brace,
        kind: u.kind,
        island: !!s.island
      })
    }
    return o
  }
  async function qe(t) {
    if (!(!H || !H.st)) {
      if (!tt.has(l.tech)) {
        Xt[t] || (t = Xt[l.slicer.supportType] ? l.slicer.supportType : "tree"), it(!0, "Строю поддержки…"), await kt();
        try {
          const e = await xs(t);
          V(e.n ? `${Xt[t]} поддержки: ${t==="tree"?"веток":"столбиков"} ${S(e.n)}, ${S(e.vol/1e3*Ct().density,1)} г` : "Нависаний, которым нужны поддержки, не нашлось")
        } catch (e) {
          console.error(e), V("Не получилось построить поддержки: " + e.message)
        } finally {
          it(!1)
        }
        return
      }
      it(!0, t === "hybrid" ? "Подбираю поддержки по месту…" : "Строю поддержки…"), await kt();
      try {
        const e = tt.has(l.tech),
          n = ya(),
          a = Cn(e),
          o = 6e3,
          s = ae("light", e),
          i = ae("medium", e),
          r = ae("heavy", e);
        let c, d = 1;
        const u = L => {
          let P = 0;
          for (let M = 0; M < n.n; M++) n.nz[M] < L && (P += n.ar[M]);
          return P
        };
        if (t === "hybrid") {
          const L = -Math.sin(i.thr * Math.PI / 180),
            P = -.92,
            M = u(L);
          M / (i.sp * i.sp) > o && (d = Math.sqrt(M / (i.sp * i.sp) / o));
          const E = An(n, L, k => (k < P ? i.sp : s.sp) * d, e, o * 1.3);
          c = Pn(n, E, a.base, (k, g, y) => y ? {
            ...s,
            kind: "light"
          } : g > 25 ? {
            ...r,
            tip: k.nz < P ? i.tip : s.tip,
            kind: "heavy"
          } : k.nz < P ? {
            ...i,
            kind: "medium"
          } : {
            ...s,
            kind: "light"
          })
        } else {
          const L = ae(t, e),
            P = -Math.sin(L.thr * Math.PI / 180),
            M = u(P);
          M / (L.sp * L.sp) > o && (d = Math.sqrt(M / (L.sp * L.sp) / o));
          const E = An(n, P, () => L.sp * d, e, o * 1.3);
          c = Pn(n, E, a.base, () => ({
            ...L,
            kind: t
          }))
        }
        let p = {
          ok: !0,
          added: 0
        };
        if (l.sup.stab !== !1) {
          const L = ro(n, c, a, e, i, r, d, -Math.sin((t === "hybrid" ? i.thr : ae(t, e).thr) * Math.PI / 180));
          c = c.concat(L.add), p = L.info
        }
        const x = G ? G.pillars.filter(L => L.island) : [];
        G = {
          type: t,
          resin: e,
          pillars: c.concat(x),
          ver: H.ver,
          scaleSp: d,
          stab: p
        }, e ? (t !== "hybrid" && (l.sla.density = t), l.sla.supports = "auto", l.sla.tilt = 0) : l.slicer.supports = "auto", Fn();
        const m = G.kinds;
        V(c.length ? `${ze[t]} поддержки, опор: ${S(c.length)}${t==="hybrid"?` (лёгких ${m.light||0}, средних ${m.medium||0}, сложных ${m.heavy||0})`:""}${d>1.01?`, шаг увеличен ×${S(d,1)} — модель крупная`:""}${p.added?`, из них стабилизирующих ${p.added}`:""}` : "Нависаний, которым нужны поддержки, не нашлось")
      } catch (e) {
        console.error(e), V("Не получилось построить поддержки: " + e.message)
      } finally {
        it(!1)
      }
    }
  }

  function io(t) {
    let e = 0,
      n = 0,
      a = 0,
      o = 0;
    for (let s = 0; s < t.length; s += 9) {
      const i = t[s],
        r = t[s + 1],
        c = t[s + 2],
        d = t[s + 3],
        u = t[s + 4],
        p = t[s + 5],
        x = t[s + 6],
        m = t[s + 7],
        L = t[s + 8],
        P = (i * (u * L - p * m) - r * (d * L - p * x) + c * (d * m - u * x)) / 6;
      e += P, n += P * (i + d + x) / 4, a += P * (r + u + m) / 4, o += P * (c + p + L) / 4
    }
    return Math.abs(e) > 1e-9 ? {
      x: n / e,
      y: a / e,
      z: o / e,
      V: Math.abs(e)
    } : null
  }

  function oo(t, e, n) {
    let a = !1;
    for (let o = 0, s = n.length - 1; o < n.length; s = o++) {
      const [i, r] = n[o], [c, d] = n[s];
      r > e != d > e && t < (c - i) * (e - r) / (d - r) + i && (a = !a)
    }
    return a
  }

  function gs(t, e, n) {
    const a = t.filter(c => !c.onModel).map(c => [c.x, c.y]);
    if (!e) {
      const c = H.pos;
      for (let d = 0; d < c.length; d += 3) c[d + 2] < .3 && a.push([c[d], c[d + 1]])
    }
    const o = ga(a);
    if (o.length < 3) return {
      ok: !1,
      c: [a.length ? a[0][0] : 0, a.length ? a[0][1] : 0]
    };
    let s = 0,
      i = 0;
    o.forEach(([c, d]) => {
      s += c, i += d
    }), s /= o.length, i /= o.length;
    const r = o.map(([c, d]) => [s + (c - s) * .8, i + (d - i) * .8]);
    return {
      ok: oo(n.x, n.y, r),
      c: [s, i]
    }
  }

  function ro(t, e, n, a, o, s, i, r) {
    const c = io(H.pos);
    if (!c) return {
      add: [],
      info: {
        ok: !0,
        added: 0
      }
    };
    const d = gs(e, a, c),
      u = H.st.dimZ >= 30 || c.V / 1e3 * Ct().density >= 50;
    if (d.ok && !u) return {
      add: [],
      info: {
        ok: !0,
        added: 0
      }
    };
    const p = o.sp * (a ? 1.6 : 2) * i,
      x = p * 1.2,
      m = new Map,
      L = (y, b) => Math.floor(y / x) + "," + Math.floor(b / x);
    for (const y of e) {
      const b = L(y.x, y.y);
      m.has(b) || m.set(b, []), m.get(b).push(y)
    }
    const P = y => {
        const b = Math.floor(y.x / x),
          $ = Math.floor(y.y / x);
        for (let j = -1; j <= 1; j++)
          for (let v = -1; v <= 1; v++)
            for (const h of m.get(b + v + "," + ($ + j)) || [])
              if (Math.hypot(h.x - y.x, h.y - y.y) < x && Math.abs(h.z - y.z) < 4) return !0;
        return !1
      },
      M = c.x - d.c[0],
      E = c.y - d.c[1],
      k = An(t, -Math.sin(8 * Math.PI / 180), () => p, a, 4e3).filter(y => !P(y) && (d.ok ? y.nz >= r : (y.x - d.c[0]) * M + (y.y - d.c[1]) * E > 0)),
      g = Pn(t, k, n.base, () => ({
        ...s,
        tip: o.tip,
        kind: "stab"
      })).filter(y => !y.onModel).slice(0, 2e3);
    return {
      add: g,
      info: {
        ok: d.ok,
        big: u,
        added: g.length,
        fixed: gs(e.concat(g), a, c).ok
      }
    }
  }
  async function vs() {
    if (!(!H || !H.st)) {
      it(!0, "Ищу острова…"), await kt();
      try {
        const t = tt.has(l.tech),
          e = H.st,
          n = Math.max(t ? l.sla.layer : l.slicer.layer, .1),
          a = Mn(e, n, 6e6),
          {
            N: o,
            dz: s,
            res: i,
            nx: r,
            ny: c,
            np: d,
            inside: u
          } = a,
          p = -e.dimX / 2 - Math.max(1, 2 * i),
          x = -e.dimY / 2 - Math.max(1, 2 * i),
          m = new Int32Array(d),
          L = new Int32Array(d),
          P = [],
          M = Math.max(2, Math.round(.15 / (i * i)));
        for (let E = 1; E < o; E++) {
          const k = E * d,
            g = k - d;
          m.fill(0);
          let y = 0;
          for (let b = 0; b < d; b++) {
            if (!u[k + b] || m[b]) continue;
            y++;
            let $ = 0,
              j = 0,
              v = 0,
              h = 0,
              C = !1;
            const F = [];
            for (L[$++] = b, m[b] = y; $;) {
              const w = L[--$],
                T = w % r,
                q = w / r | 0;
              if (j++, v += T, h += q, F.length < 4e3 && F.push(w), !C)
                for (let Y = -1; Y <= 1 && !C; Y++)
                  for (let I = -1; I <= 1; I++) {
                    const R = T + I,
                      X = q + Y;
                    if (R >= 0 && X >= 0 && R < r && X < c && u[g + X * r + R]) {
                      C = !0;
                      break
                    }
                  }
              T > 0 && u[k + w - 1] && !m[w - 1] && (m[w - 1] = y, L[$++] = w - 1), T < r - 1 && u[k + w + 1] && !m[w + 1] && (m[w + 1] = y, L[$++] = w + 1), q > 0 && u[k + w - r] && !m[w - r] && (m[w - r] = y, L[$++] = w - r), q < c - 1 && u[k + w + r] && !m[w + r] && (m[w + r] = y, L[$++] = w + r)
            }
            C || j < M || P.push({
              x: p + (v / j + .5) * i,
              y: x + (h / j + .5) * i,
              z: E * s,
              area: j * i * i,
              pix: F.map(w => [p + (w % r + .5) * i, x + ((w / r | 0) + .5) * i])
            })
          }
          E % 40 === 0 && await kt()
        }
        jt = {
          ver: H.ver,
          list: P
        }, lo(), Ft(), V(P.length ? `Найдено островов: ${P.length}. Они подсвечены красным — можно подпереть их опорами` : "Островов нет: каждый слой опирается на предыдущий")
      } catch (t) {
        console.error(t), V("Не получилось проверить острова: " + t.message)
      } finally {
        it(!1)
      }
    }
  }

  function lo() {
    if (It = Ie(It), !jt || !jt.list.length || typeof THREE > "u" || !Lt) return;
    const t = H.st,
      e = Math.max(.8, Math.min(4, Math.max(t.dimX, t.dimY, t.dimZ) / 60)),
      n = [];
    for (const o of jt.list) {
      const s = [
          [o.x + e, o.y, o.z],
          [o.x - e, o.y, o.z],
          [o.x, o.y + e, o.z],
          [o.x, o.y - e, o.z],
          [o.x, o.y, o.z + e],
          [o.x, o.y, o.z - e]
        ],
        i = [
          [0, 2, 4],
          [2, 1, 4],
          [1, 3, 4],
          [3, 0, 4],
          [2, 0, 5],
          [1, 2, 5],
          [3, 1, 5],
          [0, 3, 5]
        ];
      for (const r of i)
        for (const c of r) n.push(...s[c])
    }
    const a = new THREE.BufferGeometry;
    a.setAttribute("position", new THREE.Float32BufferAttribute(n, 3)), a.computeVertexNormals(), It = new THREE.Mesh(a, new THREE.MeshBasicMaterial({
      color: 16723285,
      depthTest: !1,
      transparent: !0,
      opacity: .9
    })), It.renderOrder = 10, It.position.z = ct ? ct.position.z : 0, Lt.add(It), zt = !0, Gt()
  }
  async function co(t) {
    if (!H || ((!jt || jt.ver !== H.ver) && await vs(), !jt || !jt.list.length)) return;
    const e = tt.has(l.tech),
      n = ya(),
      a = Cn(e),
      o = e ? ae(t, e) : {
        sp: va(Xt[l.slicer.supportType] ? l.slicer.supportType : "tree").sp
      },
      s = [];
    for (const r of jt.list) {
      const c = [
          [r.x, r.y]
        ],
        d = o.sp,
        u = new Set;
      for (const [p, x] of r.pix) {
        const m = Math.round(p / d) + "," + Math.round(x / d);
        u.has(m) || (u.add(m), Math.hypot(p - r.x, x - r.y) > d * .6 && c.push([p, x]))
      }
      for (const [p, x] of c.slice(0, 60)) {
        let m = r.z;
        for (const L of n.hits(p, x)) L.nz < 0 && Math.abs(L.z - r.z) < Math.max(.6, l.slicer.layer * 2) && L.z < m + .6 && (m = Math.min(m, L.z));
        s.push({
          x: p,
          y: x,
          z: m,
          nz: -1,
          island: !0
        })
      }
    }
    if (!e) {
      it(!0, "Подпираю острова…"), await kt();
      try {
        await xs(G && G.fdm ? G.type : Xt[l.slicer.supportType] ? l.slicer.supportType : "tree", s), V(`Острова подпёрты: точек опоры ${s.length}`)
      } finally {
        it(!1)
      }
      return
    }
    const i = Pn(n, s, a.base, () => ({
      ...o,
      kind: t
    }));
    G || (G = {
      type: "islands",
      resin: e,
      pillars: [],
      ver: H.ver,
      scaleSp: 1
    }), G.pillars = G.pillars.filter(r => !r.island).concat(i), Fn(), V(`Острова подпёрты, опор: ${S(i.length)} (${ze[t].toLowerCase()})`)
  }

  function Fn() {
    if (!G || !H) return;
    if (G.fdm) return $s();
    const t = G.resin,
      e = Cn(t),
      n = [],
      a = [];
    let o = 0;
    const s = G.pillars.length > 3e3 ? 5 : 8,
      i = (m, L, P, M, E, k, g, y, b = s) => {
        const $ = M - m,
          j = E - L,
          v = k - P,
          h = Math.hypot($, j, v);
        if (h < 1e-6) return;
        const C = $ / h,
          F = j / h,
          w = v / h;
        let T = -F,
          q = C,
          Y = Math.hypot(T, q);
        Y < 1e-6 && (T = 1, q = 0, Y = 1), T /= Y, q /= Y;
        const I = -w * q,
          R = w * T,
          X = C * q - F * T,
          U = [];
        for (let A = 0; A < b; A++) {
          const O = A / b * Math.PI * 2,
            _ = Math.cos(O),
            z = Math.sin(O);
          U.push([T * _ + I * z, q * _ + R * z, X * z])
        }
        const Z = (A, O, _, z, D) => [A + D[0] * z, O + D[1] * z, _ + D[2] * z];
        for (let A = 0; A < b; A++) {
          const O = (A + 1) % b,
            _ = Z(m, L, P, g, U[A]),
            z = Z(m, L, P, g, U[O]),
            D = Z(M, E, k, y, U[A]),
            N = Z(M, E, k, y, U[O]);
          n.push(..._, ...D, ...N, ..._, ...N, ...z), a.push(...U[A], ...U[A], ...U[O], ...U[A], ...U[O], ...U[O])
        }
        o += Math.PI * h / 3 * (g * g + g * y + y * y)
      },
      r = G.pillars,
      c = {};
    for (const m of r) {
      c[m.kind] = (c[m.kind] || 0) + 1, m.land = m.onModel ? m.land : e.base;
      const L = m.z - m.tipL,
        P = m.onModel ? m.land + m.tipL * .7 : m.land + (e.rc.t ? .3 : .8);
      i(m.x, m.y, m.z, m.x, m.y, L, m.tip, m.r), L > P && i(m.x, m.y, L, m.x, m.y, P, m.r, m.r), m.onModel ? i(m.x, m.y, Math.min(L, P), m.x, m.y, m.land, m.r, m.tip) : i(m.x, m.y, Math.min(L, P), m.x, m.y, m.land, m.r, e.rc.t ? m.r * 1.6 : m.pad)
    }
    const d = ba[l.sup.lattice] ? l.sup.lattice : "braces",
      u = d === "scaffold",
      p = d === "none" ? [] : r.map((m, L) => L).filter(m => !r[m].onModel && (u || r[m].brace > 0));
    if (p.length > 1) {
      const m = (t ? 6 : 10) * (G.scaleSp || 1),
        L = (b, $) => Math.floor(b / m) + "," + Math.floor($ / m),
        P = new Map,
        M = new Set,
        E = p.length > 1500,
        k = u ? E ? 2 : 3 : 1,
        g = E ? 4 : 6;
      let y = 0;
      p.forEach(b => {
        const $ = L(r[b].x, r[b].y);
        P.has($) || P.set($, []), P.get($).push(b)
      });
      for (const b of p) {
        const $ = r[b],
          j = Math.floor($.x / m),
          v = Math.floor($.y / m),
          h = [];
        for (let C = -1; C <= 1; C++)
          for (let F = -1; F <= 1; F++)
            for (const w of P.get(j + F + "," + (v + C)) || []) {
              if (w === b) continue;
              const T = Math.hypot(r[w].x - $.x, r[w].y - $.y);
              T > .5 && T < m && h.push([T, w])
            }
        h.sort((C, F) => C[0] - F[0]);
        for (const [, C] of h.slice(0, k)) {
          const F = Math.min(b, C) + ":" + Math.max(b, C);
          if (M.has(F)) continue;
          M.add(F);
          const w = r[C],
            T = u ? Math.min($.brace || 0, w.brace || 0) || (t ? 5 : 8) : Math.min($.brace, w.brace),
            q = Math.min($.r, w.r) * (u ? .5 : .6),
            Y = Math.min($.z, w.z) - Math.max($.tipL, w.tipL) - 1,
            I = u ? T : T * .6;
          let R = !0;
          for (let X = e.base + 2; X < Y && y < 12e4; X += T) u && (i($.x, $.y, X, w.x, w.y, X, q, q, g), y++), X + I < Y && (R ? i($.x, $.y, X, w.x, w.y, X + I, q, q, g) : i(w.x, w.y, X, $.x, $.y, X + I, q, q, g), y++), R = !R
        }
      }
    }
    let x = 0;
    if (e.rc.t) {
      const m = r.filter(P => !P.onModel).map(P => [P.x, P.y]);
      if (!t || !m.length) {
        const P = H.pos;
        for (let M = 0; M < P.length; M += 3) P[M + 2] < .3 && m.push([P[M], P[M + 1]])
      }
      const L = ga(m);
      if (L.length >= 3) {
        let P = 0,
          M = 0;
        L.forEach(([b, $]) => {
          P += b, M += $
        }), P /= L.length, M /= L.length;
        const E = L.map(([b, $]) => {
            const j = Math.hypot(b - P, $ - M) || 1;
            return [b + (b - P) / j * e.rc.m, $ + ($ - M) / j * e.rc.m]
          }),
          k = e.plat,
          g = e.plat + e.rc.t;
        let y = 0;
        for (let b = 0; b < E.length; b++) {
          const [$, j] = E[b], [v, h] = E[(b + 1) % E.length];
          y += $ * h - v * j, n.push($, j, k, v, h, k, v, h, g, $, j, k, v, h, g, $, j, g), n.push(P, M, g, $, j, g, v, h, g, P, M, k, v, h, k, $, j, k)
        }
        x = Math.abs(y) / 2 * e.rc.t * e.rc.fill
      }
    }
    if (xt = Ie(xt), G.kinds = c, G.vol = o + x, G.raftV = x, G.lift = e.lift, G.n = r.length, H.st.userSup = {
        type: G.type,
        resin: t,
        n: r.length,
        vol: o + x
      }, (r.length || x) && typeof THREE < "u" && Lt) {
      const m = new THREE.BufferGeometry;
      m.setAttribute("position", new THREE.Float32BufferAttribute(n, 3)), m.setAttribute("normal", new THREE.Float32BufferAttribute(Ms(n, a), 3)), xt = new THREE.Mesh(m, Ia(new THREE.MeshStandardMaterial({
        color: t ? 11770600 : 9425306,
        roughness: .55,
        metalness: 0,
        side: THREE.DoubleSide
      }))), xt.position.z = e.lift, Lt.add(xt)
    }
    ct && (ct.position.z = e.lift), It && (It.position.z = e.lift), zt = !0, Gt(), Ft(), ft(), at()
  }

  function ga(t) {
    if (t.length < 3) return t.slice();
    const e = t.slice().sort((s, i) => s[0] - i[0] || s[1] - i[1]),
      n = (s, i, r) => (i[0] - s[0]) * (r[1] - s[1]) - (i[1] - s[1]) * (r[0] - s[0]),
      a = [],
      o = [];
    for (const s of e) {
      for (; a.length >= 2 && n(a[a.length - 2], a[a.length - 1], s) <= 0;) a.pop();
      a.push(s)
    }
    for (let s = e.length - 1; s >= 0; s--) {
      const i = e[s];
      for (; o.length >= 2 && n(o[o.length - 2], o[o.length - 1], i) <= 0;) o.pop();
      o.push(i)
    }
    return o.pop(), a.pop(), a.concat(o)
  }

  function uo(t) {
    const e = an();
    t in Tn[e] && (l.sup.raft[e] = t, e === "fdm" && (l.slicer.brim = t === "brim"), G ? Fn() : (Ft(), ft(), at()))
  }
  let $t = "medium";

  function Ft() {
    const t = f("btnSup");
    if (!t) return;
    const e = tt.has(l.tech),
      n = an();
    !e && !Xt[$t] && ($t = Xt[l.slicer.supportType] ? l.slicer.supportType : "tree"), e && Xt[$t] && ($t = "medium"), f("supTypes").innerHTML = e ? '<button type="button" data-sup="hybrid" class="wide"><b>Гибрид — программа решает сама</b><small>Пологие склоны — лёгкими, потолки — средними, высокие опоры — толще и со связями, опоры на детали — тонкими, чтобы не оставить следов</small></button><button type="button" data-sup="light"><b>Лёгкие</b><small>Редкие тонкие, легко снимать</small></button><button type="button" data-sup="medium"><b>Средние</b><small>Обычный шаг и толщина</small></button><button type="button" data-sup="heavy"><b>Сложные</b><small>Частые толстые со связями</small></button>' : '<button type="button" data-sup="tree"><b>Древовидные</b><small>Ветки сходятся в стволы: меньше пластика, легко снимать, меньше следов</small></button><button type="button" data-sup="normal"><b>Обычные</b><small>Решётка-столбики под всем нависанием: надёжно для плоских потолков</small></button>', f("latSec").hidden = !e, f("islFix").innerHTML = e ? '<span class="rot-l">Подпереть</span><button type="button" data-isl="light">Лёгкими</button><button type="button" data-isl="medium">Средними</button><button type="button" data-isl="heavy">Сложными</button>' : '<button type="button" data-isl="fdm">Подпереть острова</button>', f("supEditSeg").innerHTML = (e ? [
      ["light", "Лёгкие"],
      ["medium", "Средние"],
      ["heavy", "Сложные"]
    ] : [
      ["tree", "Древовидные"],
      ["normal", "Обычные"]
    ]).map(([d, u]) => `<button type="button" data-edit="${d}">${u}</button>`).join(""), f("supEditNote").textContent = e ? "Гибрид берёт параметры из всех трёх типов. Изменения сразу перестраивают опоры." : "Изменения сразу перестраивают опоры.", t.classList.toggle("on", !!G || !f("supPanel").hidden), t.title = G ? `Построены: ${ze[G.type].toLowerCase()}, опор: ${S(G.n)}` : "Поддержки, плот и острова", document.querySelectorAll("#supPanel [data-sup]").forEach(d => d.classList.toggle("on", !!G && d.dataset.sup === G.type)), f("latSeg").innerHTML = Object.entries(ba).map(([d, u]) => `<button type="button" data-lat="${d}" class="${(l.sup.lattice||"braces")===d?"on":""}">${u.l}</button>`).join(""), f("latNote").textContent = ba[l.sup.lattice || "braces"].d, f("stabChk").checked = l.sup.stab !== !1;
    const a = G && G.stab;
    f("stabNote").textContent = G ? !a || a.ok && !a.added ? "Деталь устойчива: центр масс над опорами, пологих стенок без опор нет." : a.ok ? `Деталь крупная и наклонена — под пологие нижние стенки добавлено стабилизирующих опор: ${a.added}` : `Центр масс выходил за опоры — добавлено стабилизирующих: ${a.added}${a.fixed?"":". Деталь всё ещё на краю — уменьшите наклон или выберите «Сложные»"}` : "Если центр масс выходит за опоры, программа добавит опоры под нижние грани с этой стороны.", f("raftSeg").innerHTML = Object.entries(Tn[n]).map(([d, u]) => `<button type="button" data-raft="${d}" class="${sn(n).key===d?"on":""}">${u.l}</button>`).join("");
    const o = sn(n);
    f("raftNote").textContent = o.t ? `${S(o.t,1)} мм${o.fill<1?`, заполнение ${S(o.fill*100)}%`:""}, запас по краю ${S(o.m,1)} мм` : n === "fdm" && o.key === "brim" ? "Кайма 5 мм вокруг первого слоя" : e ? "Опоры стоят прямо на платформе на подошвах" : "Деталь печатается прямо на столе";
    const s = G && G.kinds || {};
    G && G.fdm ? f("supInfo").textContent = `${Xt[G.type]}: ${G.type==="tree"?"веток":"столбиков"} ${S(G.n)} · ${S(G.vol/1e3*Ct().density,1)} г пластика${G.raftV?` · из них плот ${S(G.raftV/1e3*Ct().density,1)} г`:""}` : f("supInfo").textContent = G ? `Опор: ${S(G.n)}${G.type==="hybrid"||Object.keys(s).length>1?` (${Object.entries(s).map(([d,u])=>ze[d].toLowerCase()+" "+u).join(", ")})`:""} · ${S(G.vol/1e3,2)} см³ · ${S(G.vol/1e3*Ct().density,1)} г${G.raftV?` · из них плот ${S(G.raftV/1e3,2)} см³`:""}` : "Поддержки ещё не построены";
    const i = jt && H && jt.ver === H.ver ? jt.list : null;
    f("islInfo").textContent = i ? i.length ? `Найдено островов: ${i.length}. Самый нижний — на высоте ${S(Math.min(...i.map(d=>d.z)),1)} мм.` : "Островов нет." : "Остров — участок, который появляется в слое без опоры снизу. Без поддержки он печатается в воздухе.", f("islFix").hidden = !(i && i.length), document.querySelectorAll("#supEditSeg [data-edit]").forEach(d => d.classList.toggle("on", d.dataset.edit === $t));
    const r = e ? ae($t, e) : va($t),
      c = document.activeElement;
    !e && !(c && c.dataset && c.dataset.sp != null) ? f("supFields").innerHTML = po[$t].map(d => `<label class="field"><span class="lbl">${d.l}</span><span class="inp"><input type="number" min="0" step="${d.s}" data-sp="${d.k}" value="${+(+r[d.k]).toFixed(2)}"><em>${d.u}</em></span><small class="cap">${d.d}</small></label>`).join("") : c && c.dataset && c.dataset.sp != null || (f("supFields").innerHTML = ys.map(d => `<label class="field"><span class="lbl">${d.l}</span><span class="inp"><input type="number" min="0" step="${d.s}" data-sp="${d.k}" value="${+(d.x2?r[d.k]*2:r[d.k]).toFixed(2)}"><em>${d.u}</em></span><small class="cap">${d.d}</small></label>`).join("") + (e ? `<label class="field"><span class="lbl">Подъём над платформой</span><span class="inp"><input type="number" min="1" step="0.5" data-sp="lift" value="${+(+l.sup.lift||5)}"><em>мм</em></span><small class="cap">Высота опор под дном детали</small></label>` : ""))
  }

  function fo() {
    f("supPanel").addEventListener("click", t => {
      const e = t.target.closest("button");
      if (e) {
        if (e.dataset.sup) qe(e.dataset.sup);
        else if (e.dataset.raft) uo(e.dataset.raft);
        else if (e.dataset.lat) l.sup.lattice = e.dataset.lat, gt(), G ? Fn() : Ft();
        else if (e.dataset.isl) co(e.dataset.isl);
        else if (e.dataset.edit) $t = e.dataset.edit, Ft();
        else if (e.id === "islFind") vs();
        else if (e.id === "supClear") je();
        else if (e.id === "supReset") {
          const n = an();
          n === "fdm" && l.sup.cfg.fdm2 && delete l.sup.cfg.fdm2[$t], delete l.sup.cfg[n][$t], n === "resin" && (l.sup.lift = 5), Ft(), gt(), V("Параметры сброшены")
        }
      }
    }), f("supPanel").addEventListener("change", t => {
      const e = t.target;
      if (e.id === "stabChk") {
        l.sup.stab = e.checked, gt(), G && G.type !== "islands" ? qe(G.type) : Ft();
        return
      }
      if (e.dataset.sp == null) return;
      const n = parseFloat(e.value);
      if (!(n >= 0)) return;
      const a = an(),
        o = ys.find(s => s.k === e.dataset.sp);
      if (a === "fdm") {
        l.sup.cfg.fdm2 = l.sup.cfg.fdm2 || {}, l.sup.cfg.fdm2[$t] = {
          ...l.sup.cfg.fdm2[$t] || {},
          [e.dataset.sp]: n
        }, gt(), e.blur(), Ft(), G && G.fdm && G.type === $t && qe($t);
        return
      }
      e.dataset.sp === "lift" ? l.sup.lift = Math.max(1, n) : l.sup.cfg[a][$t] = {
        ...l.sup.cfg[a][$t] || {},
        [o.k]: o.x2 ? n / 2 : n
      }, gt(), e.blur(), Ft(), G && (G.type === $t || G.type === "hybrid" || e.dataset.sp === "lift") && qe(G.type)
    })
  }
  const Xt = {
      normal: "Обычные",
      tree: "Древовидные"
    },
    mo = {
      normal: {
        thr: 50,
        sp: 2.5,
        gap: .2,
        dens: 15
      },
      tree: {
        thr: 50,
        sp: 4,
        gap: .2,
        tip: .8,
        branch: 2,
        dang: 3,
        ang: 40,
        trunk: 6
      }
    },
    po = {
      normal: [{
        k: "thr",
        l: "Угол нависания",
        u: "°",
        s: 1,
        d: "Опоры под гранями круче этого угла от вертикали"
      }, {
        k: "sp",
        l: "Шаг сетки",
        u: "мм",
        s: .5,
        d: "Размер ячейки столбиков"
      }, {
        k: "gap",
        l: "Зазор до детали",
        u: "мм",
        s: .05,
        d: "Чем больше — тем легче отделить"
      }, {
        k: "dens",
        l: "Плотность",
        u: "%",
        s: 5,
        d: "Заполнение решётки поддержки"
      }],
      tree: [{
        k: "thr",
        l: "Угол нависания",
        u: "°",
        s: 1,
        d: "Опоры под гранями круче этого угла от вертикали"
      }, {
        k: "sp",
        l: "Шаг касаний",
        u: "мм",
        s: .5,
        d: "Расстояние между кончиками веток"
      }, {
        k: "tip",
        l: "Касание Ø",
        u: "мм",
        s: .1,
        d: "Толщина кончика ветки"
      }, {
        k: "branch",
        l: "Ветка Ø",
        u: "мм",
        s: .5,
        d: "Толщина ветки сразу под касанием"
      }, {
        k: "dang",
        l: "Рост толщины",
        u: "°",
        s: 1,
        d: "Насколько ветка толстеет книзу"
      }, {
        k: "ang",
        l: "Наклон веток",
        u: "°",
        s: 5,
        d: "Насколько ветки отклоняются, чтобы сойтись"
      }, {
        k: "trunk",
        l: "Ствол Ø до",
        u: "мм",
        s: .5,
        d: "Толще ствол не растёт"
      }, {
        k: "gap",
        l: "Зазор до детали",
        u: "мм",
        s: .05,
        d: "Чем больше — тем легче отделить"
      }]
    };

  function Ms(t, e) {
    const n = e.slice();
    for (let a = n.length; a < t.length; a += 9) {
      const o = t[a + 3] - t[a],
        s = t[a + 4] - t[a + 1],
        i = t[a + 5] - t[a + 2],
        r = t[a + 6] - t[a],
        c = t[a + 7] - t[a + 1],
        d = t[a + 8] - t[a + 2];
      let u = s * d - i * c,
        p = i * r - o * d,
        x = o * c - s * r;
      const m = Math.hypot(u, p, x) || 1;
      u /= m, p /= m, x /= m, n.push(u, p, x, u, p, x, u, p, x)
    }
    return n
  }

  function va(t) {
    return {
      ...mo[t],
      ...(l.sup.cfg.fdm2 || {})[t] || {}
    }
  }

  function ho(t, e, n, a) {
    let o = 0;
    for (const s of t.hits(e, n)) s.z > a && o++;
    return o % 2 === 1
  }

  function bo(t, e, n) {
    const a = [];
    for (const o of e) {
      let s = -1 / 0,
        i = 0;
      for (const u of t.hits(o.x, o.y)) u.z < o.z - .3 && u.z > s && (s = u.z, i = u.nz);
      let r = 0,
        c = !1;
      if (s > -1 / 0) {
        if (i <= 0) continue;
        s > 0 && (r = s + n.gap, c = !0)
      }
      const d = o.z - n.gap;
      d - r < .3 || a.push({
        x: o.x,
        y: o.y,
        z: d,
        land: r,
        onModel: c,
        kind: "normal",
        island: !!o.island
      })
    }
    return a
  }

  function yo(t, e, n, a) {
    const o = Math.max(.6, Math.min(1.5, a / 100)),
      s = o * Math.tan(n.ang * Math.PI / 180),
      i = n.tip / 2,
      r = Math.max(i, (+n.branch || 2) / 2),
      c = Math.tan((+n.dang || 5) * Math.PI / 180),
      d = Math.max(r, n.trunk / 2),
      u = [],
      p = [],
      x = [],
      m = [],
      L = k => Math.min(d, k < 1.5 ? i + (r - i) * k / 1.5 : r + (k - 1.5) * c);
    let P = e.map(k => {
        const g = k.z - n.gap,
          y = [
            [k.x, k.y, g, i]
          ];
        return u.push(y), x.push([k.x, k.y, g]), {
          x: k.x,
          y: k.y,
          z: g,
          r: i,
          d: 0,
          w: 1,
          t: y
        }
      }),
      M = 0,
      E = 0;
    for (; P.length && M++ < 3e3;) {
      const k = Math.max(4, n.sp * 2.5),
        g = new Map,
        y = (v, h) => Math.floor(v / k) + "," + Math.floor(h / k);
      P.forEach((v, h) => {
        const C = y(v.x, v.y);
        g.has(C) || g.set(C, []), g.get(C).push(h)
      });
      const b = [];
      P.forEach((v, h) => {
        let C = v.x,
          F = v.y,
          w = 1 / 0;
        const T = Math.floor(v.x / k),
          q = Math.floor(v.y / k);
        for (let A = -1; A <= 1; A++)
          for (let O = -1; O <= 1; O++)
            for (const _ of g.get(T + A + "," + (q + O)) || []) {
              if (_ === h) continue;
              const z = P[_],
                D = Math.hypot(z.x - v.x, z.y - v.y);
              D < w && (w = D, C = z.x, F = z.y)
            }
        let Y = v.x,
          I = v.y;
        if (w < 1 / 0 && v.d > 2.5) {
          const A = Math.min(s, w / 2);
          w > 1e-6 && (Y += (C - v.x) / w * A, I += (F - v.y) / w * A)
        }
        let R = v.z - o;
        ho(t, Y, I, R) && (Y = v.x, I = v.y);
        const X = v.d + Math.hypot(Y - v.x, I - v.y, o),
          U = Math.max(v.r, L(X));
        let Z = null;
        for (const A of t.hits(Y, I)) A.nz > 0 && A.z <= v.z - .3 && A.z >= R - 1e-6 && (Z === null || A.z > Z) && (Z = A.z);
        if (E++, Z !== null) {
          v.t.push([Y, I, Z + n.gap, Math.max(i, v.r * .7)]);
          return
        }
        if (R <= 0) {
          const A = v.z / (v.z - R),
            O = v.x + (Y - v.x) * A,
            _ = v.y + (I - v.y) * A;
          v.t.push([O, _, 0, U]), p.push([O, _, U]);
          return
        }
        v.t.push([Y, I, R, U]), b.push({
          ...v,
          x: Y,
          y: I,
          z: R,
          r: U,
          d: X
        })
      }), b.sort((v, h) => v.x - h.x);
      const $ = [],
        j = new Uint8Array(b.length);
      for (let v = 0; v < b.length; v++) {
        if (j[v]) continue;
        let h = b[v],
          C = [h];
        for (let F = v + 1; F < b.length && b[F].x - h.x < d * 2; F++) {
          if (j[F]) continue;
          const w = b[F];
          if (h.d > 2.5 && w.d > 2.5 && Math.hypot(h.x - w.x, h.y - w.y) < Math.max(.6, (h.r + w.r) * .55)) {
            j[F] = 1, C.push(w);
            const T = h.w + w.w;
            h = {
              ...h,
              x: (h.x * h.w + w.x * w.w) / T,
              y: (h.y * h.w + w.y * w.w) / T,
              r: Math.min(d, Math.max(h.r, w.r) + .3 * Math.min(h.r, w.r)),
              d: Math.max(h.d, w.d),
              w: T
            }
          }
        }
        if (C.length > 1) {
          for (const w of C) w.t.push([h.x, h.y, h.z, w.r]);
          const F = [
            [h.x, h.y, h.z, h.r]
          ];
          u.push(F), h.t = F, m.push([h.x, h.y, h.z, h.r])
        }
        $.push(h)
      }
      P = $
    }
    return {
      tracks: u,
      feet: p,
      tipPts: x,
      joints: m,
      tips: e.length,
      segs: {
        length: E
      }
    }
  }

  function ws(t) {
    if (t.length < 3) return t;
    const e = [t[0]];
    for (let n = 0; n < t.length - 1; n++) {
      const a = t[n],
        o = t[n + 1];
      n > 0 && e.push(a.map((s, i) => s * .75 + o[i] * .25)), n < t.length - 2 && e.push(a.map((s, i) => s * .25 + o[i] * .75))
    }
    return e.push(t[t.length - 1]), e
  }
  async function xs(t, e) {
    const n = ya(),
      a = va(t),
      o = -Math.sin(a.thr * Math.PI / 180),
      s = H.st.dimZ;
    let i = a.sp,
      r = 0;
    for (let x = 0; x < n.n; x++) n.nz[x] < o && (r += n.ar[x]);
    const c = t === "tree" ? 2500 : 9e3;
    r / (i * i) > c && (i *= Math.sqrt(r / (i * i) / c));
    const d = (e || []).concat(An(n, o, () => i, !1, c * 1.3)),
      u = G && G.fdm ? G.islPts || [] : [],
      p = d.concat(u.filter(x => !e));
    return t === "tree" ? G = {
      type: t,
      resin: !1,
      fdm: !0,
      ver: H.ver,
      scaleSp: i / a.sp,
      P: a,
      tree: yo(n, p, a, s),
      islPts: (e || []).concat(u)
    } : G = {
      type: t,
      resin: !1,
      fdm: !0,
      ver: H.ver,
      scaleSp: i / a.sp,
      P: a,
      cols: bo(n, p, {
        ...a,
        sp: i
      }),
      cell: i,
      islPts: (e || []).concat(u)
    }, l.slicer.supports = "auto", l.slicer.supportType = t, $s(), G
  }

  function $s() {
    const t = G,
      e = [],
      n = [],
      a = [],
      o = Cn(!1);
    let s = 0,
      i = 0;
    const r = M => {
        for (; a.length < e.length;) a.push(M[0], M[1], M[2])
      },
      c = [.3, .78, .36],
      d = [.13, .45, .2],
      u = [.55, .86, .55],
      p = (M, E, k, g, y, b = y) => {
        const $ = [M - y, M + y],
          j = [E - b, E + b],
          v = (C, F, w) => [$[C], j[F], w],
          h = (C, F, w, T) => e.push(...C, ...F, ...w, ...C, ...w, ...T);
        h(v(0, 0, k), v(1, 0, k), v(1, 0, g), v(0, 0, g)), h(v(1, 0, k), v(1, 1, k), v(1, 1, g), v(1, 0, g)), h(v(1, 1, k), v(0, 1, k), v(0, 1, g), v(1, 1, g)), h(v(0, 1, k), v(0, 0, k), v(0, 0, g), v(0, 1, g)), h(v(0, 0, g), v(1, 0, g), v(1, 1, g), v(0, 1, g))
      },
      x = (M, E, k, g, y, b, $, j, v, h) => {
        const C = g - M,
          F = y - E,
          w = b - k,
          T = Math.hypot(C, F, w);
        if (T < 1e-6) return;
        const q = C / T,
          Y = F / T,
          I = w / T;
        let R = -Y,
          X = q,
          U = Math.hypot(R, X);
        U < 1e-6 && (R = 1, X = 0, U = 1), R /= U, X /= U;
        const Z = -I * X,
          A = I * R,
          O = q * X - Y * R,
          _ = [];
        for (let D = 0; D < v; D++) {
          const N = D / v * Math.PI * 2,
            B = Math.cos(N),
            W = Math.sin(N);
          _.push([R * B + Z * W, X * B + A * W, O * W])
        }
        const z = (D, N, B, W, et) => [D + et[0] * W, N + et[1] * W, B + et[2] * W];
        for (let D = 0; D < v; D++) {
          const N = (D + 1) % v,
            B = z(M, E, k, $, _[D]),
            W = z(M, E, k, $, _[N]),
            et = z(g, y, b, j, _[D]),
            ot = z(g, y, b, j, _[N]);
          e.push(...B, ...et, ...ot, ...B, ...ot, ...W), n.push(..._[D], ..._[D], ..._[N], ..._[D], ..._[N], ..._[N])
        }
        if (h)
          for (let D = 0; D < v; D++) {
            const N = (D + 1) % v;
            e.push(g, y, b, ...z(g, y, b, j, _[N]), ...z(g, y, b, j, _[D])), n.push(q, Y, I, q, Y, I, q, Y, I)
          }
        s += Math.PI * T / 3 * ($ * $ + $ * j + j * j)
      },
      m = (M, E, k, g, y) => {
        const b = Math.max(3, y >> 1),
          $ = (j, v) => [Math.sin(j) * Math.cos(v), Math.sin(j) * Math.sin(v), Math.cos(j)];
        for (let j = 0; j < b; j++)
          for (let v = 0; v < y; v++) {
            const h = j / b * Math.PI,
              C = (j + 1) / b * Math.PI,
              F = v / y * Math.PI * 2,
              w = (v + 1) / y * Math.PI * 2,
              T = [$(h, F), $(C, F), $(C, w), $(h, w)];
            for (const q of [
                [0, 1, 2],
                [0, 2, 3]
              ])
              for (const Y of q) {
                const I = T[Y];
                e.push(M + I[0] * g, E + I[1] * g, k + I[2] * g), n.push(I[0], I[1], I[2])
              }
          }
      },
      L = (M, E) => {
        let k = 1,
          g = 0,
          y = 0,
          b = null;
        for (let $ = 0; $ < M.length; $++) {
          const j = M[Math.max(0, $ - 1)],
            v = M[Math.min(M.length - 1, $ + 1)];
          let h = v[0] - j[0],
            C = v[1] - j[1],
            F = v[2] - j[2];
          const w = Math.hypot(h, C, F) || 1;
          h /= w, C /= w, F /= w;
          const T = k * h + g * C + y * F;
          k -= T * h, g -= T * C, y -= T * F;
          let q = Math.hypot(k, g, y);
          q < 1e-4 && (k = -C, g = h, y = 0, q = Math.hypot(k, g) || 1, q < 1e-4 && (k = 1, g = 0, y = 0, q = 1)), k /= q, g /= q, y /= q;
          const Y = C * y - F * g,
            I = F * k - h * y,
            R = h * g - C * k,
            X = [];
          for (let U = 0; U < E; U++) {
            const Z = U / E * Math.PI * 2,
              A = Math.cos(Z),
              O = Math.sin(Z),
              _ = k * A + Y * O,
              z = g * A + I * O,
              D = y * A + R * O,
              N = M[$][3];
            X.push([M[$][0] + _ * N, M[$][1] + z * N, M[$][2] + D * N, _, z, D])
          }
          if (b) {
            for (let O = 0; O < E; O++) {
              const _ = (O + 1) % E,
                z = b[O],
                D = b[_],
                N = X[O],
                B = X[_];
              e.push(z[0], z[1], z[2], N[0], N[1], N[2], B[0], B[1], B[2], z[0], z[1], z[2], B[0], B[1], B[2], D[0], D[1], D[2]), n.push(z[3], z[4], z[5], N[3], N[4], N[5], B[3], B[4], B[5], z[3], z[4], z[5], B[3], B[4], B[5], D[3], D[4], D[5])
            }
            const U = M[$ - 1],
              Z = M[$],
              A = Math.hypot(Z[0] - U[0], Z[1] - U[1], Z[2] - U[2]);
            s += Math.PI * A / 3 * (U[3] * U[3] + U[3] * Z[3] + Z[3] * Z[3])
          }
          b = X
        }
      };
    if (t.type === "tree") {
      const M = t.tree,
        E = M.tracks.length > 3e3 ? 7 : 12,
        k = Math.max(.1, +l.slicer.layer || .2);
      for (const b of M.tracks) b.length > 1 && L(ws(ws(b)), E);
      for (const b of M.joints) b[3] > 1.2 && m(b[0], b[1], b[2], b[3] * 1, E);
      r(c), s *= .75;
      const g = s;
      for (const b of M.feet) x(b[0], b[1], 1.2, b[0], b[1], 0, b[2], b[2] * 1.3, E, !0);
      r(c);
      const y = Math.min(1.6, t.P.sp * .42);
      for (const b of M.tipPts) x(b[0], b[1], b[2], b[0], b[1], b[2] - 2 * k, y, y, E, !0);
      r(d), s = g + (s - g), i = M.tips
    } else {
      const M = t.cell * .47,
        E = Math.max(5, +t.P.dens || 15) / 100,
        k = Math.max(.1, +l.slicer.layer || .2),
        g = Math.max(.2, (+l.slicer.nozzle || .4) * .55),
        y = 2 * k;
      for (const b of t.cols) {
        const $ = Math.max(b.land, b.z - y);
        $ > b.land && p(b.x, b.y, b.land, $, t.cell * .42, g), p(b.x, b.y, $, b.z, t.cell * .5, t.cell * .5), s += t.cell * t.cell * ((b.z - b.land) * E + 2 * k * (1 - E))
      }
      i = t.cols.length
    }
    r(c);
    let P = 0;
    if (o.rc.t) {
      const M = [],
        E = H.pos;
      for (let g = 0; g < E.length; g += 3) E[g + 2] < .3 && M.push([E[g], E[g + 1]]);
      t.cols && t.cols.filter(g => !g.onModel).forEach(g => M.push([g.x, g.y])), t.tree && t.tree.feet.forEach(g => M.push([g[0], g[1]]));
      const k = ga(M);
      if (k.length >= 3) {
        let g = 0,
          y = 0;
        k.forEach(([h, C]) => {
          g += h, y += C
        }), g /= k.length, y /= k.length;
        const b = k.map(([h, C]) => {
            const F = Math.hypot(h - g, C - y) || 1;
            return [h + (h - g) / F * o.rc.m, C + (C - y) / F * o.rc.m]
          }),
          $ = o.plat,
          j = 0;
        let v = 0;
        for (let h = 0; h < b.length; h++) {
          const [C, F] = b[h], [w, T] = b[(h + 1) % b.length];
          v += C * T - w * F, e.push(C, F, $, w, T, $, w, T, j, C, F, $, w, T, j, C, F, j, g, y, j, C, F, j, w, T, j)
        }
        P = Math.abs(v) / 2 * o.rc.t * o.rc.fill
      }
    }
    if (xt = Ie(xt), t.vol = s + P, t.raftV = P, t.n = i, t.lift = o.lift, t.kinds = {
        [t.type]: i
      }, H.st.userSup = {
        type: t.type,
        resin: !1,
        n: i,
        vol: t.vol
      }, e.length && typeof THREE < "u" && Lt) {
      r(u);
      const M = new THREE.BufferGeometry;
      M.setAttribute("position", new THREE.Float32BufferAttribute(e, 3)), M.setAttribute("normal", new THREE.Float32BufferAttribute(Ms(e, n), 3)), M.setAttribute("color", new THREE.Float32BufferAttribute(a, 3)), xt = new THREE.Mesh(M, Ia(new THREE.MeshStandardMaterial({
        vertexColors: !0,
        roughness: .55,
        metalness: 0,
        side: THREE.DoubleSide
      }))), xt.position.z = o.lift, Lt.add(xt)
    }
    ct && (ct.position.z = o.lift), It && (It.position.z = o.lift), zt = !0, typeof Gt == "function" && Gt(), Ft(), ft(), at()
  }

  function Ma(t, e, n) {
    return new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(t, e, n, "XYZ")).elements
  }

  function ks(t, e, n, a) {
    const o = H.pos,
      s = o.length / 9,
      i = a || 1,
      r = -Math.sin(e * Math.PI / 180),
      c = t[2],
      d = t[6],
      u = t[10];
    let p = 1 / 0,
      x = -1 / 0;
    for (let P = 0; P < o.length; P += 3 * i) {
      const M = c * o[P] + d * o[P + 1] + u * o[P + 2];
      M < p && (p = M), M > x && (x = M)
    }
    let m = 0,
      L = 0;
    for (let P = 0; P < s; P += i) {
      const M = P * 9,
        E = o[M + 3] - o[M],
        k = o[M + 4] - o[M + 1],
        g = o[M + 5] - o[M + 2],
        y = o[M + 6] - o[M],
        b = o[M + 7] - o[M + 1],
        $ = o[M + 8] - o[M + 2],
        j = k * $ - g * b,
        v = g * y - E * $,
        h = E * b - k * y,
        C = Math.hypot(j, v, h) || 1,
        F = (c * j + d * v + u * h) / C,
        w = C / 2;
      if (F >= r) continue;
      const T = c * o[M] + d * o[M + 1] + u * o[M + 2],
        q = c * o[M + 3] + d * o[M + 4] + u * o[M + 5],
        Y = c * o[M + 6] + d * o[M + 7] + u * o[M + 8];
      Math.max(T, q, Y) - p < .3 && (L += w * -F, !n) || (m += w * -F)
    }
    return {
      ov: m * i,
      H: x - p,
      base: L * i
    }
  }
  const Es = (t, e) => e ? 0 : Math.max(0, 100 - t.base) * 1e3,
    Ss = {
      sup: {
        l: "Меньше поддержек",
        d: "Минимум площади нависаний — меньше опор, следов и смолы",
        f: (t, e) => t.ov + t.H * (e ? 5 : 10) + Es(t, e)
      },
      low: {
        l: "Ниже и быстрее",
        d: "Минимальная высота — меньше слоёв, быстрее печать",
        f: (t, e) => t.H * 1e3 + t.ov * .01 + Es(t, e)
      },
      stable: {
        l: "Устойчивее на столе",
        d: "Большая опорная площадь, меньше нависаний",
        f: t => -t.base * 3 + t.ov + t.H * .2
      }
    };
  async function go(t) {
    if (H) {
      it(!0, "Перебираю положения…"), await kt();
      try {
        const e = tt.has(l.tech),
          n = ae("medium", e).thr,
          a = Ss[t],
          o = H.pos.length / 9,
          s = Math.max(1, Math.floor(o / 6e4)),
          i = [
            [0, 0, 0]
          ];
        for (let u = 0; u < 24; u++)
          for (let p = -6; p <= 6; p++) i.push([u * Math.PI / 12, p * Math.PI / 12, 0]);
        let r = null,
          c = null,
          d = 0;
        for (const [u, p, x] of i) {
          const m = Ma(u, p, x),
            L = ks(m, n, e, s),
            P = a.f(L, e);
          c || (c = {
            s: P,
            m: L
          }), (!r || P < r.s - 1e-6) && (r = {
            s: P,
            e: m,
            m: L,
            rx: u,
            ry: p
          }), ++d % 40 === 0 && await kt()
        }
        if (it(!1), r.s >= c.s - Math.abs(c.s) * .01) {
          V("Текущее положение уже лучшее для этой цели");
          return
        }
        Le(H.pos, r.e), await Wt(), V(`${a.l}: нависания ${S(c.m.ov/100,1)} → ${S(r.m.ov/100,1)} см², высота ${S(c.m.H,1)} → ${S(r.m.H,1)} мм`)
      } catch (e) {
        it(!1), console.error(e), V("Не получилось подобрать положение: " + e.message)
      }
    }
  }
  async function wa(t, e, n) {
    if (!H || !(t || e || n)) return;
    const a = Math.PI / 180;
    Le(H.pos, Ma(t * a, e * a, n * a)), await Wt(!t && !e)
  }

  function Hn() {
    if (!H || !f("posPanel") || f("posPanel").hidden) return;
    const t = tt.has(l.tech),
      e = ks(Ma(0, 0, 0), ae("medium", t).thr, t, Math.max(1, Math.floor(H.pos.length / 9 / 6e4)));
    f("posInfo").textContent = `Сейчас: высота ${S(e.H,1)} мм · нависания ${S(e.ov/100,1)} см² · опора на столе ${S(e.base/100,1)} см²`, f("posGoals").innerHTML = Object.entries(Ss).map(([n, a]) => `<button type="button" data-goal="${n}" title="${a.d}"><b>${a.l}</b><small>${a.d}</small></button>`).join("") + (t ? '<button type="button" data-tilt="30" title="Наклон уменьшает площадь слоя и усилие отрыва"><b>Наклон 30° для смолы</b><small>Меньше площадь слоя и отрыв, ровнее поверхности</small></button>' : "")
  }

  function vo() {
    f("posPanel").addEventListener("click", t => {
      const e = t.target.closest("button");
      if (e)
        if (e.dataset.goal) go(e.dataset.goal);
        else if (e.dataset.tilt) wa(+e.dataset.tilt, 0, 0);
      else if (e.dataset.step) {
        const [n, a] = e.dataset.step.split(":"), o = (parseFloat(f("posStep").value) || 15) * +a;
        wa(n === "x" ? o : 0, n === "y" ? o : 0, n === "z" ? o : 0)
      } else e.id === "posApply" && (wa(parseFloat(f("posX").value) || 0, parseFloat(f("posY").value) || 0, parseFloat(f("posZ").value) || 0), f("posX").value = f("posY").value = f("posZ").value = 0)
    })
  }
  let qt = null,
    De = null,
    Ut = null,
    Rn = null,
    Ls = 0,
    xa = "high",
    Ts = 0;
  const _e = () => Math.max(.01, tt.has(l.tech) ? +l.sla.layer || .05 : +l.slicer.layer || .2);

  function Cs() {
    return H && H.st ? Math.max(1, Math.round(H.st.dimZ / _e())) : 1
  }

  function On() {
    bi.value = _e();
    const t = f("layerRange");
    if (!t) return;
    const e = f("layerBox");
    if (e.hidden = !H, !H) return;
    const n = Cs();
    t.max = n;
    const a = qt === null ? n : Math.max(1, Math.min(n, Math.round(qt / _e())));
    document.activeElement !== t && (t.value = a), f("layerVal").textContent = qt === null ? `Просмотр по слоям · всего ${n}` : `${a} / ${n} · ${S(Math.min(qt,H.st.dimZ),2)} мм`, f("layerAll").hidden = qt === null, xo()
  }

  function Mo(t) {
    if (!H) return;
    const e = Cs();
    qt = t >= e ? null : Math.max(1, t) * _e(), On(), xa = "low", cancelAnimationFrame(Ls), Ls = requestAnimationFrame(Gt), clearTimeout(Ts), Ts = setTimeout(() => {
      xa = "high", Gt()
    }, 280)
  }

  function Gt() {
    if (typeof THREE > "u" || !Yt || !Lt) return;
    Yt.localClippingEnabled = !0, Rn || (Rn = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0));
    const t = ct ? ct.position.z : 0,
      e = !!H && qt !== null;
    Rn.constant = e ? qt + t : 1e9;
    for (const n of [ct, xt, It]) n && (n.material.clippingPlanes = e ? [Rn] : [], n.material.needsUpdate = !0);
    if (De = Ie(De), Ut && (Lt.remove(Ut), Ut.geometry.dispose(), Ut.material.map && Ut.material.map.dispose(), Ut.material.dispose(), Ut = null), e) try {
      Ut = wo(qt, t), Ut && Lt.add(Ut)
    } catch (n) {
      console.warn("cap", n)
    }
    if (e && !Ut) {
      const n = H.pos,
        a = qt - _e() / 2,
        o = [];
      for (let s = 0; s < n.length; s += 9) {
        const i = n[s + 2],
          r = n[s + 5],
          c = n[s + 8];
        if (i < a && r < a && c < a || i > a && r > a && c > a) continue;
        const d = [];
        for (const [u, p] of [
            [0, 3],
            [3, 6],
            [6, 0]
          ]) {
          const x = n[s + u + 2],
            m = n[s + p + 2];
          if (x < a == m < a) continue;
          const L = (a - x) / (m - x);
          d.push(n[s + u] + (n[s + p] - n[s + u]) * L, n[s + u + 1] + (n[s + p + 1] - n[s + u + 1]) * L, a)
        }
        d.length === 6 && o.push(...d)
      }
      if (o.length) {
        const s = new THREE.BufferGeometry;
        s.setAttribute("position", new THREE.Float32BufferAttribute(o, 3)), De = new THREE.LineSegments(s, new THREE.LineBasicMaterial({
          color: 16752412,
          depthTest: !1
        })), De.renderOrder = 11, De.position.z = t, Lt.add(De)
      }
    }
    zt = !0
  }
  const Bt = {
    outer: [255, 128, 48],
    inner: [255, 206, 64],
    sparse: [196, 60, 52],
    solid: [156, 92, 214],
    gap: [28, 32, 38],
    resin: [196, 174, 242],
    resinEdge: [120, 90, 200]
  };

  function As(t, e, n, a, o, s) {
    const i = H.pos,
      r = Array.from({
        length: o
      }, () => []);
    for (let d = 0; d < i.length; d += 9) {
      const u = i[d + 2],
        p = i[d + 5],
        x = i[d + 8];
      if (u < t && p < t && x < t || u > t && p > t && x > t) continue;
      const m = [];
      for (const [b, $] of [
          [0, 3],
          [3, 6],
          [6, 0]
        ]) {
        const j = i[d + b + 2],
          v = i[d + $ + 2];
        if (j < t == v < t) continue;
        const h = (t - j) / (v - j);
        m.push(i[d + b] + (i[d + $] - i[d + b]) * h, i[d + b + 1] + (i[d + $ + 1] - i[d + b + 1]) * h)
      }
      if (m.length !== 4) continue;
      let [L, P, M, E] = m;
      if (P === E) continue;
      P > E && ([L, P, M, E] = [M, E, L, P]);
      const k = Math.max(0, Math.ceil((P - n) / s - .5)),
        g = Math.min(o - 1, Math.ceil((E - n) / s - .5) - 1),
        y = (M - L) / (E - P);
      for (let b = k; b <= g; b++) {
        const $ = n + (b + .5) * s;
        r[b].push(L + y * ($ - P))
      }
    }
    const c = new Uint8Array(a * o);
    for (let d = 0; d < o; d++) {
      const u = r[d];
      if (!(u.length < 2)) {
        u.sort((p, x) => p - x);
        for (let p = 0; p + 1 < u.length; p += 2) {
          const x = Math.max(0, Math.ceil((u[p] - e) / s - .5)),
            m = Math.min(a - 1, Math.floor((u[p + 1] - e) / s - .5));
          for (let L = x; L <= m; L++) c[d * a + L] = 1
        }
      }
    }
    return c
  }

  function wo(t, e) {
    if (!H || !H.st) return null;
    const n = H.st,
      a = tt.has(l.tech),
      o = _e(),
      s = Math.max(o * .5, t - o * .5),
      i = 1.5,
      r = Math.max(n.dimX, n.dimY) + 2 * i,
      c = Math.max(.025, r / (xa === "high" ? 1400 : 420)),
      d = Math.ceil((n.dimX + 2 * i) / c),
      u = Math.ceil((n.dimY + 2 * i) / c),
      p = d * u,
      x = -n.dimX / 2 - i,
      m = -n.dimY / 2 - i,
      L = As(s, x, m, d, u, c),
      P = new Float64Array(p);
    ia(L, 0, d, u, P);
    const M = Math.max(.2, (+l.slicer.nozzle || .4) * 1.05),
      E = Math.max(1, +l.slicer.walls || 2),
      k = M * 100 / Math.max(5, +l.slicer.infill || 15),
      g = +l.slicer.top || 4,
      y = +l.slicer.bottom || 3,
      b = Math.round(s / o),
      $ = b % 2 ? 1 : -1,
      j = Math.SQRT1_2;
    let v = null;
    if (!a) {
      v = new Uint8Array(p);
      const I = [];
      for (let Z = 1; Z <= g; Z++) I.push(s + Z * o);
      for (let Z = 1; Z <= y; Z++) I.push(s - Z * o);
      const R = Math.max(1, Math.round(Math.max(d, u) / 350)),
        X = Math.ceil(d / R),
        U = Math.ceil(u / R);
      for (const Z of I) {
        if (Z <= 0 || Z >= n.dimZ) {
          v.fill(1);
          break
        }
        const A = As(Z, x, m, X, U, c * R);
        for (let O = 0; O < u; O++) {
          const _ = Math.min(U - 1, O / R | 0) * X;
          for (let z = 0; z < d; z++) {
            const D = O * d + z;
            L[D] && !A[_ + Math.min(X - 1, z / R | 0)] && (v[D] = 1)
          }
        }
      }
    }
    const h = new Uint8Array(p * 4),
      C = (I, R, X, U) => {
        h[I * 4] = Math.min(255, R[0] * X), h[I * 4 + 1] = Math.min(255, R[1] * X), h[I * 4 + 2] = Math.min(255, R[2] * X), h[I * 4 + 3] = U
      },
      F = I => .55 + .6 * Math.sqrt(Math.max(0, 1 - I * I)),
      w = a && l.sla.hollow ? +l.sla.wall || 2.5 : 1 / 0;
    for (let I = 0; I < u; I++)
      for (let R = 0; R < d; R++) {
        const X = I * d + R;
        if (!L[X]) continue;
        const U = Math.sqrt(P[X]) * c,
          Z = x + (R + .5) * c,
          A = m + (I + .5) * c,
          O = U < c ? 160 : 255;
        if (a) {
          U > w ? C(X, Bt.gap, 1, 90) : C(X, U < Math.max(c * 2, .15) ? Bt.resinEdge : Bt.resin, .9 + .1 * Math.sin(U * 3), O);
          continue
        }
        if (U <= E * M) {
          const ot = Math.floor(U / M),
            rt = Math.abs((U - ot * M) / M * 2 - 1);
          if (rt > .9) {
            C(X, Bt.gap, 1, 200);
            continue
          }
          C(X, ot === 0 ? Bt.outer : Bt.inner, F(rt), O);
          continue
        }
        const _ = Z * j + $ * A * j;
        if (v[X]) {
          const ot = (_ % M + M) % M,
            rt = Math.abs(ot / M * 2 - 1);
          rt > .88 ? C(X, Bt.gap, 1, 200) : C(X, Bt.solid, F(rt), 255);
          continue
        }
        const z = Z * j - $ * A * j,
          D = (_ % k + k) % k,
          N = (z % k + k) % k,
          B = Math.min(D, k - D),
          W = Math.min(N, k - N),
          et = Math.min(B, W);
        et < M / 2 ? C(X, Bt.sparse, F(et / (M / 2)), 255) : C(X, Bt.gap, 1, 110)
      }
    const T = new THREE.DataTexture(h, d, u, THREE.RGBAFormat);
    T.magFilter = THREE.LinearFilter, T.minFilter = THREE.LinearMipmapLinearFilter, T.generateMipmaps = !0;
    try {
      T.anisotropy = Yt.capabilities.getMaxAnisotropy()
    } catch {}
    T.needsUpdate = !0;
    const q = new THREE.PlaneGeometry(d * c, u * c),
      Y = new THREE.Mesh(q, new THREE.MeshBasicMaterial({
        map: T,
        transparent: !0,
        side: THREE.DoubleSide,
        depthWrite: !1
      }));
    return Y.position.set(x + d * c / 2, m + u * c / 2, t - .01 + e), Y.renderOrder = 5, Y
  }

  function xo() {
    const t = f("layerLegend");
    t && (t.hidden = qt === null, t.innerHTML = tt.has(l.tech) ? `<span style="--c:rgb(${Bt.resin})">засвеченный слой</span>` : [
      ["outer", "внешний периметр"],
      ["inner", "внутренние"],
      ["sparse", "заполнение"],
      ["solid", "сплошной слой"]
    ].map(([e, n]) => `<span style="--c:rgb(${Bt[e]})">${n}</span>`).join(""))
  }

  function $a() {
    qt = null, On(), Gt()
  }

  function $o() {
    f("layerRange").addEventListener("input", t => Mo(+t.target.value)), f("layerAll").onclick = () => $a()
  }

  function ka() {
    if (!H || !f("scalePop")) return;
    const t = H.scale * 100;
    f("scaleNum").value = +t.toFixed(1), f("scaleRange").value = Math.min(400, Math.max(10, t)), f("scaleVal").textContent = S(t, t % 1 ? 1 : 0) + "%", Ea(1)
  }

  function Ea(t) {
    const e = H.st;
    f("scaleDims").textContent = `${S(e.dimX*t,1)} × ${S(e.dimY*t,1)} × ${S(e.dimZ*t,1)} мм`;
    for (const o of ["X", "Y", "Z"]) {
      const s = f("s" + o);
      s && document.activeElement !== s && (s.value = +(e["dim" + o] * t).toFixed(1))
    }
    const n = f("scaleLock"),
      a = f("scaleLock2");
    n && (n.checked = l.part.scaleLock !== !1), a && (a.checked = l.part.scaleLock !== !1)
  }

  function zn(t) {
    !H || !(t > 0) || (ct && ct.scale.setScalar(1), xt && xt.scale.setScalar(1), f("scalePct").value = +t.toFixed(2), f("scalePct").dispatchEvent(new Event("change")))
  }

  function ko() {
    if (!H) return;
    const t = ht(),
      e = H.st,
      n = tt.has(l.tech) ? 5 : 0,
      a = Math.min((t.bedX - 10) / e.dimX, (t.bedY - 10) / e.dimY, (t.bedZ - n - 5) / e.dimZ);
    zn(Math.floor(H.scale * 100 * a * 10) / 10)
  }

  function it(t, e) {
    f("busyText").textContent = e || "Считаю…", f("busy").hidden = !t
  }
  const kt = () => new Promise(t => setTimeout(t, 20));
  const loDB = {
    o() {
      return new Promise((r, j) => {
        try {
          const q = indexedDB.open("smeta3d", 1);
          q.onupgradeneeded = () => q.result.createObjectStore("m"), q.onsuccess = () => r(q.result), q.onerror = () => j(q.error)
        } catch (e) {
          j(e)
        }
      })
    },
    async put(v) {
      try {
        const d = await this.o();
        d.transaction("m", "readwrite").objectStore("m").put(v, "last")
      } catch {}
    },
    async get() {
      try {
        const d = await this.o();
        return await new Promise(r => {
          const q = d.transaction("m").objectStore("m").get("last");
          q.onsuccess = () => r(q.result), q.onerror = () => r(null)
        })
      } catch {
        return null
      }
    },
    async del() {
      try {
        const d = await this.o();
        d.transaction("m", "readwrite").objectStore("m").delete("last")
      } catch {}
    }
  };
  let loSt = 0;

  function loSaveM() {
    clearTimeout(loSt), loSt = setTimeout(() => {
      if (loCur && loGeo.size) {
        try {
          loStoreCur()
        } catch {}
        const P = [];
        for (const b of l.basket) {
          const g = loGeo.get(b.id);
          g && g.H && g.H.pos && P.push({
            id: b.id,
            name: g.H.name,
            pos: g.H.pos.slice(),
            scale: g.H.scale || 1,
            unit: g.H.unit || 1,
            s: g.s,
            d: g.d
          })
        }
        loDB.put({
          parts: P,
          cur: loCur
        });
        return
      }
      H && H.pos && (/ \(пример\)$/.test(H.name || "") ? loDB.del() : loDB.put({
        name: H.name,
        pos: H.pos.slice(),
        scale: H.scale || 1,
        unit: H.unit || 1
      }))
    }, 600)
  }
  async function loAddGeom(pos, name) {
    loStoreCur(), Zt.noAuto = !0;
    try {
      await Zt(pos, name)
    } finally {
      Zt.noAuto = !1
    }
    try {
      await yi(!0)
    } catch (e) {}
    l.part.name = name.replace(/\.[^.]+$/, ""), l.part.qty = 1, ft(), at(), loNewPart()
  }
  async function loBoot() {
    const m = await loDB.get();
    if (m && m.parts && m.parts.length) {
      try {
        {
          const q = nt.get("lo.parts", null);
          if (q && q.s) {
            for (const p of m.parts) q.s[p.id] && (p.s = q.s[p.id]);
            q.cur && m.parts.some(p => p.id === q.cur) && (m.cur = q.cur)
          }
        }
        for (const p of m.parts) l.basket.some(b => b.id === p.id) && loGeo.set(p.id, {
          H: {
            pos: p.pos instanceof Float32Array ? p.pos : new Float32Array(p.pos),
            name: p.name,
            unit: p.unit || 1,
            scale: p.scale || 1,
            ver: ++da
          },
          s: p.s,
          d: p.d
        });
        const c = loGeo.has(m.cur) ? m.cur : [...loGeo.keys()][0];
        if (c && loLoad(c)) return
      } catch (e) {
        console.error(e)
      }
      loGeo.clear(), loCur = null
    }
    if (m && m.pos && m.pos.length >= 9) {
      try {
        Zt.noAuto = !0, await Zt(m.pos instanceof Float32Array ? m.pos : new Float32Array(m.pos), m.name), H.scale = m.scale || 1, H.unit = m.unit || 1, f("scalePct").value = +(H.scale * 100).toFixed(2), f("unitSel").value = String(H.unit), ft(), at();
        return
      } catch (e) {
        console.error(e)
      } finally {
        Zt.noAuto = !1
      }
    }
    await Fs("case", !0)
  }
  let loWk = null,
    loWkN = 0;
  const loWkCb = new Map;

  function loWorker() {
    if (loWk !== null) return loWk;
    try {
      const src = `"use strict";const Fi=${Fi},Zi=${Zi},be={f:null,d:null,v:null,z:null,col:null};${sa};${es};${Mn};${ia};${Ui};${as};${Vi};${vn};const THREE={Vector3:function(x,y,z){this.x=x;this.y=y;this.z=z}};${Hs};
const bufs=(o,s,seen)=>{if(!o||typeof o!=="object"||seen.has(o))return;seen.add(o);if(ArrayBuffer.isView(o)){s.add(o.buffer);return}for(const k in o)bufs(o[k],s,seen)};
onmessage=e=>{const{id,pos,keys,fdm,light,hull}=e.data;if(hull){try{postMessage({id,v:Hs(hull,e.data.k).map(v=>[v.x,v.y,v.z])})}catch(x){postMessage({id,err:String(x)})}return}try{const st=vn(pos,{light:!!light});st._ras={};for(let[a,b]of keys){a<0&&(a=Math.max(.1,st.dimZ/300));a>0&&Mn(st,a,b)}if(fdm&&fdm.layer>0){const p=as(st,fdm.layer,fdm.u,fdm.r);Vi(st,fdm.layer,fdm.u,fdm.r,fdm.top,fdm.bottom);Ui(p.R)}const s=new Set;bufs(st,s,new Set);postMessage({id,st},[...s])}catch(x){postMessage({id,err:String(x)})}}`;
      loWk = new Worker(URL.createObjectURL(new Blob([src], {
        type: "text/javascript"
      }))), loWk.onmessage = e => {
        const c = loWkCb.get(e.data.id);
        c && (loWkCb.delete(e.data.id), c(e.data))
      }, loWk.onerror = () => {
        loWk = !1;
        for (const c of loWkCb.values()) c({
          err: "worker"
        });
        loWkCb.clear()
      }
    } catch {
      loWk = !1
    }
    return loWk
  }
  function loFdmKey() {
    const e = l.slicer,
      r = (+e.nozzle || 0) * 1.05;
    return e && +e.layer > 0 && r > 0 ? {
      layer: +e.layer,
      r,
      u: (+e.walls || 0) * r,
      top: e.top,
      bottom: e.bottom
    } : null
  }

  async function loHs(t, k) {
    const w = t.length / 9 >= 1e5 && typeof Worker < "u" ? loWorker() : !1;
    if (!w) return Hs(t, k);
    const id = ++loWkN,
      c = t.slice(),
      r = await new Promise(res => {
        loWkCb.set(id, res), w.postMessage({
          id,
          hull: c,
          k
        }, [c.buffer])
      });
    return r.err || !r.v ? Hs(t, k) : r.v.map(v => new THREE.Vector3(v[0], v[1], v[2]))
  }
  async function loVn(t, o = {}) {
    const w = t.length / 9 >= 1e5 && typeof Worker < "u" ? loWorker() : !1;
    if (!w) return vn(t, o);
    const id = ++loWkN,
      c = t.slice(),
      r = await new Promise(res => {
        loWkCb.set(id, res), w.postMessage({
          id,
          pos: c,
          keys: [
            [-1, 6e6],
            [+l.slicer.layer || 0, o.light ? 4e6 : Zi]
          ],
          fdm: loFdmKey(),
          light: !!o.light
        }, [c.buffer])
      });
    if (r.err || !r.st) return vn(t, o);
    return r.st
  }
  async function Zt(t, e) {
    je(!0), it(!0), await kt(), tn(t);
    const n = await loVn(t);
    t = n.pos;
    H = {
      pos: t,
      name: e,
      st: n,
      unit: 1,
      scale: 1,
      ver: ++da
    }, loGc = null, loSaveM(), f("autoOrient") && (f("autoOrient").hidden = !0), ne = null, f("unitSel").value = "1", f("scalePct").value = 100, it(!1), ge(), Sn(), Me(), ka(), Hn(), Ft(), $a(), l.mode === "simple" && !Zt.quiet && !Zt.noAuto && setTimeout(yi, 50)
  }
  async function Wt(t) {
    je(!0), it(!0), await kt();
    const h0 = H,
      s0 = await loVn(h0.pos);
    if (H !== h0) return;
    H.st = s0, H.pos = s0.pos, H.ver = ++da, loSaveM(), ne = null, it(!1), ge(), t || Sn(), Me(), at(), ka(), Hn(), Ft(), $a(), Vt()
  }

  function In(t) {
    const n = (t.index ? t.toNonIndexed() : t).attributes.position.array,
      a = new Float32Array(n.length);
    for (let o = 0; o < n.length; o += 3) a[o] = n[o], a[o + 1] = -n[o + 2], a[o + 2] = n[o + 1];
    return a
  }

  function Eo(t) {
    if (t === "bracket") {
      const n = new THREE.Shape;
      return n.moveTo(0, 0), n.lineTo(60, 0), n.lineTo(60, 6), n.lineTo(6, 6), n.lineTo(6, 45), n.lineTo(0, 45), n.closePath(), In(new THREE.ExtrudeGeometry(n, {
        depth: 30,
        bevelEnabled: !1
      }))
    }
    if (t === "arch") {
      const n = new THREE.Shape;
      return n.moveTo(-45, 0), n.lineTo(-45, 50), n.lineTo(45, 50), n.lineTo(45, 0), n.lineTo(25, 0), n.lineTo(25, 30), n.lineTo(-25, 30), n.lineTo(-25, 0), n.closePath(), In(new THREE.ExtrudeGeometry(n, {
        depth: 30,
        bevelEnabled: !1
      }))
    }
    if (t === "knot") return In(new THREE.TorusKnotGeometry(24, 8, 160, 24));
    const e = [
      [31, 3],
      [31, 60],
      [34, 60],
      [34, 0],
      [1e-4, 0],
      [1e-4, 3]
    ].map(n => new THREE.Vector2(n[0], n[1]));
    return e.push(e[0].clone()), In(new THREE.LatheGeometry(e.reverse(), 72))
  }
  const Ps = {
    case: "Стакан-корпус",
    bracket: "L-кронштейн",
    arch: "Арка с нависанием",
    knot: "Узел"
  };
  async function Fs(t, e) {
    await Zt(Eo(t), Ps[t] + " (пример)"), e || (l.part.name = Ps[t], (t === "knot" || t === "arch") && (l.slicer.supports = "auto", l.sla.supports = "auto"), l.source !== "orca" && Ge("model")), ft(), at(), e || Vt()
  }

  function Hs(t, e) {
    const n = new Map,
      a = t.length / 9;
    for (let r = 0; r < a; r++) {
      const c = r * 9,
        d = t[c + 3] - t[c],
        u = t[c + 4] - t[c + 1],
        p = t[c + 5] - t[c + 2],
        x = t[c + 6] - t[c],
        m = t[c + 7] - t[c + 1],
        L = t[c + 8] - t[c + 2];
      let P = u * L - p * m,
        M = p * x - d * L,
        E = d * m - u * x;
      const k = Math.hypot(P, M, E);
      if (k < 1e-12) continue;
      P /= k, M /= k, E /= k;
      const g = P * t[c] + M * t[c + 1] + E * t[c + 2],
        y = Math.round(P * 40) + "," + Math.round(M * 40) + "," + Math.round(E * 40) + "|" + Math.round(g * 4),
        b = n.get(y) || {
          a: 0,
          nx: 0,
          ny: 0,
          nz: 0,
          d: 0
        },
        $ = k / 2;
      b.a += $, b.nx += P * $, b.ny += M * $, b.nz += E * $, b.d += g * $, n.set(y, b)
    }
    const o = [...n.values()].sort((r, c) => c.a - r.a).slice(0, 40),
      s = Math.max(1, Math.floor(t.length / 3 / 3e4)),
      i = [];
    for (const r of o) {
      const c = Math.hypot(r.nx, r.ny, r.nz),
        d = r.nx / c,
        u = r.ny / c,
        p = r.nz / c,
        x = r.d / r.a;
      let m = !0;
      for (let L = 0; L < t.length / 3; L += s)
        if (d * t[L * 3] + u * t[L * 3 + 1] + p * t[L * 3 + 2] > x + .3) {
          m = !1;
          break
        } if (m && (i.push(new THREE.Vector3(d, u, p)), i.length >= e)) break
    }
    return i
  }

  function Rs(t) {
    const e = new THREE.Quaternion().setFromUnitVectors(t.clone().normalize(), new THREE.Vector3(0, 0, -1));
    return new THREE.Matrix4().makeRotationFromQuaternion(e).elements
  }
  async function Os() {
    if (!H) return;
    const t = Hs(H.pos, 1);
    if (!t.length) {
      V("Плоских опорных граней не найдено");
      return
    }
    Le(H.pos, Rs(t[0])), await Wt(), V("Модель лежит на самой большой плоской грани")
  }

  function zs(t, e, n) {
    if (wn(t, e) === 0) return {
      score: 1e12,
      label: ""
    };
    if (l.tech === "fdm") {
      const a = ss(t, {
        ...l.slicer,
        supports: "auto"
      }, Ci(e), n, l.massCal.fdm * (+n.massK || 1));
      return {
        score: a.timeS + a.supGrams * 25,
        label: `${vt(a.timeS)} на деталь, поддержки ${S(a.supGrams,1)} г`
      }
    }
    if (tt.has(l.tech)) {
      const a = is(t, {
        ...l.sla,
        supports: "auto"
      }, e, n, l.massCal.resin);
      return {
        score: a.plateS + a.supMl * 30,
        label: `${vt(a.plateS)} на стол, поддержки ${S(a.supMl,1)} мл`
      }
    }
    return {
      score: t.dimZ * 1e3 + t.dimX * t.dimY / 1e3,
      label: `высота ${S(t.dimZ,1)} мм`
    }
  }
  async function Sa(t) {
    if (!H) return;
    const H1 = H;
    it(!0, "Перебираю положения…"), await kt();
    const e = THREE.Matrix4,
      n = [new e().identity(), new e().makeRotationX(Math.PI / 2), new e().makeRotationX(-Math.PI / 2), new e().makeRotationX(Math.PI), new e().makeRotationY(Math.PI / 2), new e().makeRotationY(-Math.PI / 2)].map(i => i.elements);
    for (const i of await loHs(H.pos, 3)) n.push(Rs(i));
    if (H !== H1) return it(!1);
    const sig = () => [l.tech, (ht() || {}).id, (Ct() || {}).id, l.slicer.layer, l.slicer.nozzle, l.slicer.walls].join("|");
    let a, o, g, s = null;
    for (let k = 0; ;) {
      k === 0 && (a = ht(), o = Ct(), g = sig(), s = null);
      if (k >= n.length) break;
      const i = n[k],
        r = Le(new Float32Array(H.pos), i),
        c = zs(await loVn(r, {
          light: !0
        }), a, o);
      if (H !== H1) return it(!1);
      if (sig() !== g) {
        k = 0;
        continue
      }
      (!s || c.score < s.score - 1) && (s = {
        ...c,
        e: i
      }), await kt(), k++
    }
    Le(H.pos, s.e), it(!1), await Wt(), t || V(`Положение для ${Nt[l.tech].name}: ${zs(H.st,a,o).label}`)
  }
  const ve = t => Math.max(0, t.openEdges) + Math.max(0, t.badDir);
  async function La() {
    if (!H) return;
    it(!0, "Чиню сетку…"), await kt();
    const t = H.st,
      e = new Float32Array(H.pos),
      n = Xi(H.pos),
      a = tn(n.pos),
      o = vn(a);
    if (it(!1), ve(o) > ve(t) || ve(t) === 0 && Math.abs(o.volMm3 - t.volMm3) > t.volMm3 * .01) {
      H.repair = {
        ...n.report,
        rejected: !0
      }, Me(), V("Починка не улучшила сетку, модель оставлена как есть");
      return
    }
    H.prevPos = e, H.pos = a, H.st = o, H.repair = n.report, H.ver = ++da, loSaveM(), ne = null, ge(), Me(), at(), Vt(), V(ve(o) === 0 ? "Сетка починена и замкнута" : "Сетка починена частично")
  }
  async function So() {
    !H || !H.prevPos || (H.pos = H.prevPos, H.prevPos = null, H.repair = null, await Wt(!0), V("Починка отменена"))
  }

  function Lo(t, e) {
    if (t.rejected) return `<div class="alert warn"><p>Автопочинка не помогла: сетка с неоднозначными рёбрами (${S(t.nonManifold)}) или пересекающимися частями. Расчёт идёт по объединённому объёму; для точности почините модель в слайсере.</p></div>`;
    const n = [];
    t.degenerate && n.push(`удалено вырожденных граней: ${S(t.degenerate)}`), t.duplicates && n.push(`повторов: ${S(t.duplicates)}`), t.flipped && n.push(`развёрнуто граней: ${S(t.flipped)}`), t.holes && n.push(`закрыто дыр: ${S(t.holes)}`), t.inverted && n.push(`вывернутых оболочек: ${S(t.inverted)}`);
    const a = ve(e) === 0;
    return `<div class="alert ${a?"info":"warn"}"><p><b>${a?"Сетка починена.":"Починена частично."}</b> ${n.length?n.join(", ").replace(/^./,o=>o.toUpperCase())+".":"Серьёзных ошибок не найдено."}</p><button class="btn small" type="button" data-act="undo">Отменить</button></div>`
  }

  function Me() {
    const t = f("facts"),
      e = f("modelAlerts");
    if (!H) {
      t.innerHTML = "", e.innerHTML = '<div class="alert info"><p>Перетащите STL, 3MF, STEP, OBJ или G-code в окно просмотра.</p></div>';
      return
    }
    const n = H.st,
      a = ht(),
      o = wn(n, a),
      s = l.tech;
    f("pillName").textContent = kn() && loGc ? `Расчёт по G-code: ${loGc} · модель на экране не используется` : H.name, f("dimX").value = n.dimX.toFixed(1), f("dimY").value = n.dimY.toFixed(1), f("dimZ").value = n.dimZ.toFixed(1);
    const i = n.volMm3 > 0 ? Te(n) : 0;
    let r = o > 0 ? `${o>=500?"500+":S(o)} шт` : "не помещается",
      c = "На одном столе";
    if (s === "sls" && (c = "За один запуск", o > 0)) {
      const p = Pe();
      r = p ? `≈ ${S(os(p,a,Ct(),1).perJob)} шт` : "—"
    }
    t.innerHTML = [
      ["Габариты, мм", `${S(n.dimX,1)} × ${S(n.dimY,1)} × ${S(n.dimZ,1)}`],
      ["Объём", `${S(i/1e3,2)} см³`],
      [c, r, o > 0 ? "" : "bad"]
    ].map(([p, x, m]) => `<div class="fact"><div class="k">${p}</div><div class="v ${m||""}">${x}</div></div>`).join("");
    const d = [];
    Math.max(n.dimX, n.dimY, n.dimZ) < 3 && d.push('<div class="alert warn"><p>Модель меньше 3 мм — похоже, файл в других единицах.</p><span style="display:flex;gap:4px;flex-wrap:wrap"><button class="btn small" type="button" data-unit="10">См</button><button class="btn small" type="button" data-unit="25.4">Дюймы</button><button class="btn small" type="button" data-unit="1000">Метры</button></span></div>'), o === 0 && d.push(`<div class="alert bad"><p>Не помещается в ${J(a.name)} (${a.bedX}×${a.bedY}×${a.bedZ} мм).</p><button class="btn small" type="button" data-act="orient">Подобрать положение</button></div>`), n.volMm3 > 50 && ns(n) > n.volMm3 * .02 && ns(n) < n.volMm3 * .97 && d.push(`<div class="alert warn"><p>Части модели пересекаются: сумма объёмов ${S(n.volMm3/1e3,2)} см³, по объединению ${S(i/1e3,2)} см³. Считаю по объединению, как слайсер.</p></div>`), H.repair ? d.push(Lo(H.repair, n)) : ve(n) > 0 && d.push(`<div class="alert warn"><p>${l.mode==="simple"||l.mode==="adv"?"В файле есть ошибки сетки, цена может быть неточной. Нажмите «Починить»":n.openEdges>0?`Дыры или неоднозначные рёбра в сетке (${S(n.openEdges)})`:`Перевёрнутые грани (${S(n.badDir)} рёбер)`}${l.mode==="simple"||l.mode==="adv"?".":": объём и нависания могут быть неверны."}</p><button class="btn small primary" type="button" data-act="repair">Починить</button></div>`);
    const u = s === "fdm" && l.slicer.supports === "off" || tt.has(s) && l.sla.supports === "off";
    n.overProj > 25 && u && d.push('<div class="alert warn"><p>Есть нависания круче 45°, а поддержки выключены.</p></div>'), e.innerHTML = d.join(""), f("ppAuto").textContent = `авто ${Math.max(0,o)}`
  }

  function Is() {
    const t = f("layerSel"),
      e = l.slicer.nozzle,
      n = Oi.filter(a => a >= e * .2 - 1e-6 && a <= e * .8 + 1e-6);
    n.some(a => Math.abs(a - l.slicer.layer) < 1e-6) || (l.slicer.layer = n.reduce((a, o) => Math.abs(o - e / 2) < Math.abs(a - e / 2) ? o : a, n[0])), t.innerHTML = n.map(a => `<option value="${a}">${a.toFixed(2)}</option>`).join(""), t.value = String(l.slicer.layer)
  }
  const jn = () => l.tech === "fdm" ? "fdm" : tt.has(l.tech) ? "resin" : null,
    qn = () => l.tech === "fdm" ? l.slicer : l.sla;

  function js() {
    const t = jn();
    if (!t) {
      f("presets").innerHTML = "";
      return
    }
    const e = qn().preset;
    f("presets").innerHTML = Object.entries(pn[t]).map(([n, a]) => `<button type="button" class="chip ${e===n?"on":""}" data-preset="${n}"><b>${a.name}</b><span>${a.spec}</span></button>`).join("") + (pn[t][e] ? "" : '<button type="button" class="chip on" aria-disabled="true" title="Параметры изменены вручную — выберите качество, чтобы вернуть набор"><b>Своё</b><span>вручную</span></button>')
  }
  const Kt = t => `<span class="sw" style="background:${t}"></span>`,
    on = (t, e) => `<div class="table-wrap pro"><table><thead><tr>${t.map(n=>`<th>${n}</th>`).join("")}</tr></thead><tbody>${e.join("")}</tbody></table></div>`;

  function qs() {
    const t = f("estBox"),
      e = lt,
      n = l.tech,
      a = '<button class="btn small" type="button" id="btnCalib">Сверить со слайсером</button>';
    if (!H || H.st.volMm3 <= 0) {
      t.innerHTML = "";
      return
    }
    const o = i => `<div class="kpis">${i.map(([r,c])=>`<div><div class="k">${r}</div><div class="v">${c}</div></div>`).join("")}</div>`;
    if (n === "fdm" && e) {
      const i = e.rows.reduce((r, c) => r + c.t, 0);
      t.innerHTML = o([
        ["Пластик на 1 шт", `${S(e.grams,1)} г`],
        ["Печать 1 шт", vt(e.timeS) + " без подготовки стола"], ...l.mode === "pro" ? [
          ["Заполнено объёма", `${S(e.fillPct,0)}%`]
        ] : []
      ]) + on(["Линии", "Время", "Доля", "Масса"], e.rows.map(r => `<tr><td>${Kt(r.c)}${r.name}</td><td class="n">${vt(r.t)}</td><td class="n">${S(i?r.t/i*100:0,0)}%</td><td class="n">${r.grams?S(r.grams,1)+" г":"—"}</td></tr>`)) + `<div class="foot pro"><span>Поправка: время ×${S(ht().timeCal||1,2)}, вес ×${S(l.massCal.fdm*(+Ct().massK||1),2)}</span>${a}</div>`
    } else if (tt.has(n) && e) {
      const i = Pe();
      t.innerHTML = o([
        ["Смола на 1 шт", `${S(e.ml,1)} мл`],
        [e.kind === "sla" ? "Стол с 1 шт" : "Время стола", vt(e.plateS)],
        ["На столе", i ? `${S(i.perPlate)} шт` : "—"], ...e.hollowed ? [
          ["Экономия полой", `${S(e.saved,1)} мл`]
        ] : []
      ]) + on(["Смола", "мл", "г"], e.rows.map(r => `<tr><td>${Kt(r.c)}${r.name}</td><td class="n">${S(r.ml,1)}</td><td class="n">${S(r.grams,1)}</td></tr>`)) + on(["Время стола", "Время"], e.tRows.map(r => `<tr><td>${Kt(r.c)}${r.name}</td><td class="n">${vt(r.t)}</td></tr>`)) + `<div class="foot pro"><span>${e.kind==="sla"?"Лазер обходит каждое сечение: время растёт с числом деталей на столе.":"Слой засвечивается целиком: время не зависит от числа деталей."} Поправка: время ×${S(ht().timeCal||1,2)}, смола ×${S(l.massCal.resin,2)}</span>${a}</div>`
    } else if (n === "sls") {
      const i = Pe();
      if (!i) {
        t.innerHTML = "";
        return
      }
      const r = ca(i, l.money),
        c = r.detail;
      t.innerHTML = o([
        ["Масса 1 шт", `${S(i.grams,1)} г`], ...l.mode === "simple" ? [] : [
          ["Запусков", S(c.jobs)],
          ["Высота сборки", `${S(c.H,0)} мм`],
          ["Станок", vt(r.machineH * 3600)]
        ]
      ]) + on(["Порошок за запуск", "г"], [`<tr><td>${Kt("#0b6a89")}Насыпано в камеру</td><td class="n">${S(c.loaded,0)}</td></tr>`, `<tr><td>${Kt("#2e9e74")}В деталях</td><td class="n">${S(c.partsMass,0)}</td></tr>`, `<tr><td>${Kt("#d9a521")}Расход свежего (освежение ${r.mt.refresh}%)</td><td class="n">${S(c.fresh,0)}</td></tr>`]) + on(["Время запуска", "Время"], [`<tr><td>${Kt("#7d8b95")}Нанесение ${S(c.layers,0)} ${loPl(c.layers,"слоя","слоёв","слоёв")}</td><td class="n">${vt(c.tLayers*3600)}</td></tr>`, `<tr><td>${Kt("#c8423b")}Спекание</td><td class="n">${vt(c.tScan*3600)}</td></tr>`, `<tr><td>${Kt("#d9a521")}Нагрев и охлаждение</td><td class="n">${vt(c.tHeat*3600)}</td></tr>`])
    } else t.innerHTML = "";
    const s = f("btnCalib");
    s && (s.onclick = dr)
  }

  function Ne() {
    f("printerSel").innerHTML = Qe(yn()).map(t => `<option value="${J(t.id)}">${J(t.name)} · ${t.bedX}×${t.bedY}×${t.bedZ}</option>`).join(""), f("matSel").innerHTML = Qe(gn()).map(t => `<option value="${J(t.id)}">${J(t.name)}${l.mode==="staff"||l.mode==="pro"?` · ${S(t.price)} ₽/${t.tech==="resin"?"л":"кг"}`:""}</option>`).join(""), f("printerSel").value = ht().id, f("matSel").value = Ct().id, we()
  }
  let Be = "fdm";
  const Ds = {
    fdm: ["fdm"],
    resin: ["sla", "dlp", "lcd"],
    sls: ["sls"]
  };
  let Dt = {};
  const Ye = (t, e) => Dt[t.id] && e in Dt[t.id] ? Dt[t.id][e] : t[e];

  function Ta(t, e, n) {
    const a = Dt[t.id] = {
      ...Dt[t.id] || {}
    };
    Ot(n, e === "off" ? !!t.off : t[e]) ? delete a[e] : a[e] = n, Object.keys(a).length || delete Dt[t.id]
  }
  const Ca = () => Object.keys(Dt).length > 0;

  function we() {
    const t = f("eqPrinters");
    if (!t) return;
    const e = Ds[Be],
      n = Be === "fdm" || Be === "sls" ? Be : "resin",
      a = n === "resin" ? "л" : "кг";
    document.querySelectorAll("#eqTabs [data-g]").forEach(d => d.classList.toggle("on", d.dataset.g === Be));
    const o = l.printers.filter(d => e.includes(d.tech)),
      s = l.materials.filter(d => d.tech === n),
      i = d => d.price / Math.max(1, d.life) + d.maint,
      r = (d, u) => Dt[d.id] && u in Dt[d.id] ? " ch" : "";
    t.innerHTML = o.map(d => {
      const u = Ye(d, "off");
      return `<div class="eq-row${u?" off":""}"><label class="eq-on${r(d,"off")}"><input type="checkbox" data-eqp="${J(d.id)}" ${u?"":"checked"} aria-label="Есть в мастерской"></label>
    <div class="eq-name"><b>${J(d.name)}</b><small>${Nt[d.tech]?Nt[d.tech].name+" · ":""}${d.bedX}×${d.bedY}×${d.bedZ} мм · ${S(d.power)} Вт</small></div>
    <div class="eq-num"><b>${S(i(d),0)} ₽/ч</b><small>${S(d.price)} ₽ / ${S(d.life)} ч + ${S(d.maint)} ₽/ч</small></div>
    <button class="icon-btn" type="button" data-eqpe="${J(d.id)}" title="Изменить" aria-label="Изменить ${J(d.name)}">✎</button></div>`
    }).join(""), f("eqMats").innerHTML = s.map(d => {
      const u = fn.find(m => m.id === d.id),
        p = Ye(d, "off"),
        x = +Ye(d, "price");
      return `<div class="eq-row${p?" off":""}"><label class="eq-on${r(d,"off")}"><input type="checkbox" data-eqm="${J(d.id)}" ${p?"":"checked"} aria-label="Есть в мастерской"></label>
    <div class="eq-name"><b>${J(d.name)}</b><small>${S(d.density,2)} г/см³${u?` · рынок ${S(u.price)} ₽/${a}`:" · свой"}</small></div>
    <span class="inp eq-price${r(d,"price")?" ch":u&&u.price!==x?" changed":""}" title="${r(d,"price")?"Изменено, не сохранено":u&&u.price!==x?`Отличается от рыночной (${S(u.price)} ₽)`:""}"><input type="number" min="0" step="50" data-eqmp="${J(d.id)}" value="${x}" aria-label="Цена ${J(d.name)}"><em>₽/${a}</em></span>
    <button class="icon-btn" type="button" data-eqme="${J(d.id)}" title="Изменить" aria-label="Изменить ${J(d.name)}">✎</button></div>`
    }).join(""), f("eqMarketAt").textContent = Hi;
    const c = Object.values(Dt).reduce((d, u) => d + Object.keys(u).length, 0);
    f("eqSave").disabled = f("eqCancel").disabled = !c, f("eqState").textContent = c ? `Не сохранено изменений: ${c}` : "Всё сохранено", f("eqState").classList.toggle("warn-text", !!c), ii("secEquip", c ? `не сохранено: ${c}` : "")
  }

  function To() {
    if (!f("eqPrinters")) return;
    f("eqTabs").addEventListener("click", e => {
      const n = e.target.closest("[data-g]");
      n && (Be = n.dataset.g, we())
    });
    const t = (e, n, a) => {
      const o = e.find(i => i.id === n);
      if (!o) return;
      const s = e.filter(i => i.tech === o.tech && !Ye(i, "off"));
      if (!a && s.length <= 1 && !Ye(o, "off")) {
        V("Должен остаться хотя бы один"), we();
        return
      }
      Ta(o, "off", !a), we()
    };
    f("secEquip").addEventListener("change", e => {
      const n = e.target;
      if (n.dataset.eqp) t(l.printers, n.dataset.eqp, n.checked);
      else if (n.dataset.eqm) t(l.materials, n.dataset.eqm, n.checked);
      else if (n.dataset.eqmp) {
        const a = l.materials.find(s => s.id === n.dataset.eqmp),
          o = parseFloat(n.value);
        a && Number.isFinite(o) && o >= 0 && (Ta(a, "price", o), we())
      }
    }), f("secEquip").addEventListener("click", e => {
      const n = e.target.closest("[data-eqpe],[data-eqme]");
      n && (n.dataset.eqpe ? de("printer", "edit", l.printers.find(a => a.id === n.dataset.eqpe)) : de("material", "edit", l.materials.find(a => a.id === n.dataset.eqme)))
    }), f("eqAddP").onclick = () => {
      const e = Ds[Be][0],
        n = l.printers.find(a => a.tech === e) || un.find(a => a.tech === e);
      de("printer", "new", n)
    }, f("eqAddM").onclick = () => {
      const e = Be === "fdm" || Be === "sls" ? Be : "resin";
      de("material", "new", l.materials.find(n => n.tech === e))
    }, f("eqMarket").onclick = () => {
      let e = 0;
      for (const n of l.materials) {
        const a = fn.find(o => o.id === n.id);
        a && +Ye(n, "price") !== a.price && (Ta(n, "price", a.price), e++)
      }
      we(), V(e ? `Подставили рыночные цены: ${e}. Нажмите «Сохранить»` : "Цены уже рыночные")
    }, f("eqSave").onclick = () => {
      for (const e of [...l.printers, ...l.materials]) {
        const n = Dt[e.id];
        n && ("off" in n && (e.off = n.off), "price" in n && (e.price = n.price))
      }
      Dt = {}, ue(), gt(), V("Сохранено. Чтобы изменения увидели все — «Опубликовать на сайт» в блоке «Цена»")
    }, f("eqCancel").onclick = () => {
      Dt = {}, we(), V("Изменения отменены")
    }
  }

  function Co(t, e) {
    const n = l.money,
      a = l.blocks,
      o = e ? t.lines[0] : null,
      s = t.det,
      i = y => y >= 1e3 ? `${S(y/1e3,2)} кг` : `${S(y,1)} г`,
      r = o ? o.c.pr : ht(),
      c = o ? o.it.priceKg > 0 ? o.it.priceKg : o.c.mt.price : null,
      d = r.price / Math.max(1, r.life) + r.maint,
      u = {
        mat: o && tt.has(o.c.tech) ? `${S(o.c.detail.mlTot,1)} мл × ${S(o.c.mt.price/1e3,2)} ₽/мл + спирт` : o ? `${S(o.c.gramsTot,1)} г × ${S(c/1e3,2)} ₽/г` : `${i(t.grams)} с потерями`,
        mach: `${S(t.machineH,2)} ч × ${S(d,1)} ₽/ч`,
        energy: `${S(s.kwhUsed,2)} кВт·ч × ${S(s.kwhEff,2)} ₽${n.twoRate&&s.night>.005?` · ночью ${S(s.night*100,0)}%`:""}`,
        labor: [a.labor ? `приём ${n.setupMin} мин` : "", a.labor ? `${t.plates}×${S(o&&Number.isFinite(o.it.plateMin)?o.it.plateMin:n.plateMin)} мин` : "", a.post ? "постобработка" : ""].filter(Boolean).join(", ") + ` · ${S(n.rate)} ₽/ч`,
        extra: +n.cadH > 0 ? `${S(+n.cadH,1)} ч × ${S(n.cadRate)} ₽/ч, без наценки` : "не добавлено",
        risk: `${n.risk}% перепечаток`
      },
      p = (y, b) => `<div class="dl"><span>${y}</span><b>${b}</b></div>`,
      x = [...t.lines].sort((y, b) => b.c.mat - y.c.mat),
      m = x.length > 8 ? x.slice(0, 6) : x,
      P = {
        mat: m.map(({
          it: y,
          c: b
        }) => tt.has(b.tech) ? p(`${J(y.name)}: ${S(y.ml*b.qty,1)} мл + потери ${n.waste}% = ${S(b.detail.mlTot,1)} мл`, `${S(b.detail.mlTot/1e3*b.mt.price,2)} ₽`) + (y.plateCost ? p(`Спирт, перчатки: ${b.plates} × ${S(y.plateCost)} ₽`, Q(b.plates * y.plateCost, 2)) : "") : p(`${J(y.name)}: ${i(b.gramsNet)} + потери ${n.waste}% = ${i(b.gramsTot)}`, `${S(b.gramsTot/1e3*(y.priceKg>0?y.priceKg:b.mt.price),2)} ₽`)).join("") + (m.length < x.length ? p(`…ещё ${x.length-m.length} позиций`, Q(x.slice(m.length).reduce((y, b) => y + b.c.mat, 0), 2)) : "") + p(o && tt.has(o.c.tech) ? "Цена смолы" : "Цена пластика", o ? `${S(c)} ₽/${tt.has(o.c.tech)?"л":"кг"} (${J(o.c.mt.name)})` : t.lines.length === 1 ? `${J(t.lines[0].c.mt.name)}` : "по материалам позиций"),
        mach: p(tt.has(r.tech) ? r.tech === "sla" ? "Печать: лазер и разравнивание слоёв" : "Печать: засветка и подъём слоёв" : r.tech === "sls" ? "Печать: нанесение и спекание слоёв" : t.lines.length > 1 ? "Печать" : loGc && kn() ? "Печать (из G-code)" : kn() ? "Печать (из слайсера)" : "Печать (оценка по модели)", `${S(s.printH,2)} ч`) + p(`${tt.has(r.tech)?"Подготовка ванны":"Прогрев стола"}: ${t.plates} × ${S(r.warmup)} мин`, `${S(s.warmH,2)} ч`) + (s.chamberH > 0 ? p(`Прогрев камеры дольше стола: ${t.plates} × ${S(Math.max(0,r.chamberMin-r.warmup))} мин`, `${S(s.chamberH,2)} ч`) : "") + (s.share != null ? p(`Доля общего стола (загрузка ${S(o.it.share)}%)`, `${S(s.share*100,1)}%`) : "") + p(`Амортизация: ${S(r.price)} ₽ ÷ ${S(r.life)} ч`, `${S(r.price/Math.max(1,r.life),2)} ₽/ч`) + p("Расходники и ремонт", `${S(r.maint,2)} ₽/ч`) + p(`Итого ${S(t.machineH,2)} ч × ${S(d,2)} ₽/ч`, Q(t.b.mach, 2)),
        energy: p(`Мощность: принтер ${S(r.power)} Вт${(o?o.c.watts:t.lines.reduce((x,y)=>Math.max(x,y.c.watts||0),0))>(+r.power||0)?` + камера ${S(r.chamberPower)} Вт`:""}`, `${S(s.kwhUsed,2)} кВт·ч`) + (n.twoRate ? p(`День ${S((1-s.night)*100,0)}% × ${S(n.kwh,2)} ₽ · ночь ${S(s.night*100,0)}% × ${S(n.kwhNight,2)} ₽`, `${S(s.kwhEff,2)} ₽/кВт·ч`) : p("Тариф", `${S(n.kwh,2)} ₽/кВт·ч`)) + (n.twoRate ? p("Старт печати", ra(n.start) != null || (ra(n.busyUntil) || 0) > Date.now() ? Rt(t.plan.start) : "не задан — средний тариф за сутки") : ""),
        labor: (a.labor ? p(`Приём заказа: ${n.setupMin} мин`, Q(s.setupH * n.rate, 2)) + p(`${o&&tt.has(o.c.tech)?"Мойка и засветка":"Снятие со стола"}: ${t.plates} × ${S(o&&Number.isFinite(o.it.plateMin)?o.it.plateMin:n.plateMin)} мин`, Q(s.plateLabH * n.rate, 2)) : "") + (a.post ? p(`Постобработка: ${S(t.qty)} шт, всего ${S(s.postH*60,0)} мин`, Q(s.postH * n.rate, 2)) : "") + p("Ставка оператора", `${S(n.rate)} ₽/ч`),
        extra: p(`Моделирование: ${S(n.cadH,1)} ч × ${S(n.cadRate)} ₽`, Q(s.cad, 2)),
        risk: p("База: пластик + станок + энергия + снятие", Q(s.riskBase, 2)) + p(`× ${n.risk}% ÷ (1 − ${n.risk}%)`, Q(t.b.risk, 2))
      },
      M = [
        ["mat", o && o.c.tech === "sls" ? "Порошок" : o && tt.has(o.c.tech) ? "Смола и расходники" : !o && t.lines.some(y => tt.has(y.c.tech)) ? "Материалы" : "Пластик", "--c-mat"],
        ["mach", "Амортизация, обслуживание", "--c-mach"],
        ["energy", "Электроэнергия", "--c-en"],
        ["labor", "Работа", "--c-lab"],
        ["extra", "Моделирование", "--c-ext"],
        ["risk", "Резерв на брак", "--c-risk"]
      ].filter(([y]) => y === "mat" || y === "mach" || y === "energy" && a.energy || y === "labor" && (a.labor || a.post) || y === "extra" && a.extras || y === "risk" && a.risk),
      E = Math.max(.01, t.cost);
    f("sumBar").innerHTML = M.map(([y, , b]) => `<span style="width:${t.b[y]/E*100}%;background:var(${b})"></span>`).join("");
    const k = o && tt.has(o.c.tech),
      g = {
        mat: o ? k ? `${S(o.c.detail.mlTot,1)} мл с потерями` : `${S(o.c.gramsTot,1)} г с потерями` : `${i(t.grams)} с потерями`,
        mach: `${S(t.machineH,2)} ч работы станка`,
        energy: `${S(s.kwhUsed,2)} кВт·ч`,
        labor: [a.labor ? `приём ${n.setupMin} мин` : "", a.post ? `постобработка ${S(s.postH*60,0)} мин` : ""].filter(Boolean).join(", ") || "—",
        extra: [s.inserts > 0 ? "втулки" : "", s.paint > 0 ? "покраска" : "", s.cad > 0 ? `моделирование ${S(n.cadH,1)} ч` : "", s.pack > 0 ? "упаковка" : ""].filter(Boolean).join(", ") || "",
        risk: `${n.risk}% на возможную перепечатку`
      };
    return M.map(([y, b, $]) => `<div class="row"><div class="l"><span>${Kt(`var(${$})`)}${b}</span><small class="mgr">${u[y]}</small><small class="cli">${g[y]}</small><div class="det pro">${P[y]}</div></div><div class="r mgr">${Q(t.b[y])}<small class="pro">${S(t.b[y]/E*100,0)}%</small></div></div>`).join("")
  }
  let rn = null,
    Aa = null;

  function Ao() {
    const t = l.money,
      e = l.blocks,
      n = e.basket && l.basket.length > 0,
      a = Pe();
    f("scope").dataset.t = n && new Set(l.basket.map(q => q.tech)).size > 1 ? "mix" : l.tech, f("scope").textContent = n ? `Заказ · ${l.basket.length} поз.` : Nt[l.tech].name + (a && a.orca ? " · Orca" : a && a.orcaStale ? " · оценка" : ""), f("basketBox").hidden = !n, f("btnAddPart") && (f("btnAddPart").hidden = !!loCur || !H || !e.basket), f("basketBox").classList.toggle("vis-force", !!n), f("tiersBox").hidden = !1, f("tiersH") && (f("tiersH").textContent = n ? "Цена заказа при повторе" : "Цена за штуку при тираже"), n && e.batch && (f("tiers").innerHTML = [1, 2, 3, 5, 10].map(N => {
      const k = en(l.basket.map(b => ({
        ...b,
        qty: b.qty * N
      })), t);
      return `<div class="tier" title="Весь заказ ×${N}: ${Q(k.client)}"><span class="q">заказ ×${N}</span><span class="p">${Q(k.client)}</span><span class="d">${k.minApplied?"до минимума":k.optD>0?"опт −"+S(k.optD*100)+"%":"&nbsp;"}</span></div>`
    }).join(""));
    const o = n ? l.basket : ds(a) ? [a] : [];
    if (!o.length) {
      f("sumTotal").textContent = "—", f("sumUnit").textContent = kn() && H ? (tt.has(l.tech) ? "Введите расход смолы и время из слайсера" : "Введите вес и время из слайсера") : "Загрузите модель или введите данные слайсера";
      for (const M of ["sumFacts", "sumRows", "sumTotals", "sumBar", "tiers", "sumAlerts"]) f(M).innerHTML = "";
      f("mbTotal").textContent = "—", f("mbUnit").textContent = "", rn = null, Ys();
      return
    }
    const s = en(o, t);
    rn = s, Aa = n ? null : a;
    const i = s.minApplied ? `минимальный заказ · детали стоят ${Q(s.byMarkup*s.kCl)}` : n ? `${S(s.qty)} шт в ${l.basket.length} ${loPl(l.basket.length,"позиции","позициях","позициях")}` : s.qty > 1 ? `${mt(s.client/s.qty)} за шт · ${S(s.qty)} шт` : "за 1 деталь";
    f("sumTotal").textContent = Q(s.client), f("sumUnit").textContent = i, f("mbTotal").textContent = Q(s.client), f("mbUnit").textContent = i;
    !n && H && H.st && !kn() && wn(H.st, ht(), l.tech) === 0 && (f("sumTotal").textContent = f("mbTotal").textContent = "—", f("sumUnit").textContent = f("mbUnit").textContent = "Не помещается в принтер: уменьшите модель или свяжитесь с нами");
    const r = s.techs.length === 1 ? Nt[s.techs[0]] : null,
      c = M => M >= 1e3 ? `${S(M/1e3,2)} кг` : `${S(M,M<10?1:0)} г`,
      d = s.techs.every(M => tt.has(M)),
      u = s.lines.reduce((M, E) => M + (tt.has(E.c.tech) ? E.it.ml * E.c.qty : 0), 0),
      p = s.lines.reduce((M, E) => M + (E.c.detail && E.c.detail.mlTot || 0), 0),
      x = d ? [
        ["Смола", `${S(u,u<10?1:0)} мл`]
      ] : [
        [r ? r.mat : "Материал", c(s.gramsNet)]
      ];
    e.risk && s.grams > s.gramsNet * 1.001 && x.push(["с потерями", d ? `${S(p,p<10?1:0)} мл` : c(s.grams)]), x.push(["Печать", (() => {
      const q = (s.det.warmH || 0) + (s.det.chamberH || 0),
        p = s.machineH - q;
      return p > 0 && q > .01 ? vt(p * 3600) + " + подготовка " + vt(q * 3600) : vt(s.machineH * 3600)
    })()], [r ? r.plates : "Столов", s.plates > 0 && s.plates < 1 ? S(s.plates, 2) : S(s.plates)], ["Срок", At() ? `${At()} раб. дн. · до ${$n(xn(Date.now(),At()))}` : `≈ ${s.days} раб. дн. · ${$n(new Date(s.plan.end))}`]), s.techs.length > 1 && x.splice(0, x.length, ...loMix(s, x)), Po(s), Fo(s), Ns && f("vypText") && (f("vypText").value = _s()), f("sumFacts").innerHTML = x.map(([M, E]) => `<span class="tag${/^(с потерями|Столов|Запусков|Печать)$/.test(M)?" tag-tech":""}">${M}: <b>${E}</b></span>`).join("");
    const m = [];
    {
      const q = s.lines.find(M => M.c.tech === "sls");
      q && (q.c.detail && q.c.detail.F ? m.push(`<div class="alert info"><p><b>Запуск SLS общий с другими заказами</b> (загрузка ${S(q.it.share)}%): в цену входит ${S(q.c.detail.F*100)}% запуска — нагрева, спекания и освежения порошка.</p></div>`) : q.c.detail && !q.c.detail.manual && m.push('<div class="alert info"><p>Запуск SLS — только под этот заказ: нагрев, охлаждение и освежение порошка всей камеры входят в цену.</p></div>'))
    } + t.maxDays > 0 && s.days > +t.maxDays && m.push(`<div class="alert warn"><p><b>Такой заказ — по запросу.</b> Срок около ${S(s.days)} раб. дн. — больше ${S(+t.maxDays)}. Свяжитесь с нами: обсудим сроки, раскладку по принтерам и цену.</p></div>`);
    {
      const sh = s.lines.find(M => tt.has(M.c.tech) && M.it.share > 0);
      sh && m.push(`<div class="alert info"><p><b>Стол принтера общий с другими заказами</b> (загрузка ${S(sh.it.share)}%): в цену входит ${s.det.share!=null?S(Math.min(100,s.det.share*100))+"% ":"доля "}времени и подготовки стола, а не весь стол. Если печатать только этот заказ, цена будет выше.</p></div>`)
    }
    s.plan.mode === "rush" && m.push(`<div class="alert warn"><p>К сроку успеваем только вне очереди: наценка за срочность +${t.rushPct}%.</p></div>`), s.plan.mode === "late" && m.push(`<div class="alert bad"><p>К ${Rt(s.plan.dl)} не успеть: самое раннее ${Rt(s.plan.end)}.</p></div>`), (l.mode === "staff" || l.mode === "pro") && s.profit < 0 && m.push(`<div class="alert bad"><p>Цена ниже себестоимости на ${Q(-s.profit)}.</p></div>`), !n && H && wn(H.st, ht()) === 0 && m.push('<div class="alert bad"><p>Деталь не помещается в выбранный принтер.</p></div>'), f("sumAlerts").innerHTML = m.join(""), f("sumRows").innerHTML = Co(s, !n);
    const L = [
      ["cost strong mgr", "Себестоимость", Q(s.cost)],
      ["mgr", `Наценка ${t.markup}% на производство${s.prepMk?`, ${s.prepMk}% на подготовку`:", подготовка без наценки"}${e.discount&&t.adjust?`, ${t.adjust>0?"+":""}${t.adjust}%`:""}${s.rush?`, срочность +${t.rushPct}%`:""}${s.minApplied?", минимум":""}<small class="pro">${Q(s.cost)} × ${S(1+t.markup/100,2)}${e.discount&&t.adjust?` × ${S(1+t.adjust/100,2)}`:""}${s.rush?` × ${S(1+s.rush,2)}`:""}${s.minApplied?` → минимум ${Q(t.minOrder)}`:""}</small>`, Q(s.net - s.cost + (s.minApplied ? 0 : s.optAmt))], ...s.optD && !s.minApplied ? [
        ["mgr opt", `Скидка за опт ${loPc(s.optEff)}%<small class="pro">от ${S(s.optQ)} шт${s.optEff<s.optD-5e-4?` · по таблице ${S(s.optD*100)}%, но не дешевле, чем на 1 шт меньше порога`:""}</small>`, "−" + Q(s.optAmt)]
      ] : [],
      ["strong mgr", e.tax ? "Выручка без налогов" : "Выручка", Q(s.net)]
    ];
    e.tax && L.push(["mgr", `Налог ${t.taxRev}%<small class="pro">${Q(s.net)} ÷ (1 − ${t.taxRev}%) − ${Q(s.net)}</small>`, Q(s.taxRev)]), e.tax && t.vat > 0 && L.push(["mgr", `НДС ${t.vat}%<small class="pro">${Q(s.net+s.taxRev)} × ${t.vat}%</small>`, Q(s.vatAmt)]), L.push([(s.profit >= 0 ? "profit" : "loss") + " strong mgr", `Прибыль · маржа ${S(s.margin,1)}%`, (s.profit >= 0 ? "+" : "−") + Q(Math.abs(s.profit))]);
    const P = [];
    if (s.prepCl > .5 && (P.push(["cli", "Подготовка заказа<small>разово: приём, подготовка стола, снятие</small>", Q(s.prepCl)]), P.push(["cli", `Печать и материалы, ${S(s.qty)} шт<small>${Q((s.client-s.prepCl)/s.qty)} за штуку</small>`, Q(s.client - s.prepCl)])), s.det && s.det.cad > .5 && P.push(["cli", `Моделирование<small>≈ ${S(+l.money.cadH||0,1)} ч по ставке ${Q(+l.money.cadRate||0)}/ч</small>`, Q(s.det.cad * s.kCl)]), s.optCl > .5 && P.push(["cli opt", `Скидка за опт ${loPc(s.optEff)}% (от ${S(s.optQ)} шт)`, "−" + Q(s.optCl)]), s.rushCl > .5 && P.push(["cli", `Наценка за срочность +${S(s.rush*100)}%`, "+" + Q(s.rushCl)]), s.minApplied && P.push(["cli", `Минимальная сумма заказа<small>детали стоят ${Q(s.byMarkup*s.kCl)}, до минимума добавлено ${Q(s.client-s.byMarkup*s.kCl)}</small>`, Q(s.client)]), e.tax && t.vat > 0 && P.push(["cli", `в т.ч. НДС ${t.vat}%`, Q(s.vatAmt)]), L.push(...P), f("sumTotals").innerHTML = L.map(([M, E, k]) => `<div class="row ${M}"><div class="l">${E}</div><div class="r">${k}</div></div>`).join(""), !n && e.batch) {
      const M = en([{
        ...a,
        qty: 1
      }], t).client;
      f("tiers").innerHTML = [1, 5, 10, 25, 50, 100].map(E => {
        const k = en([{
            ...a,
            qty: E
          }], t),
          g = k.client / E,
          y = (k.optEff ?? k.optD) * 100;
        return `<button type="button" class="tier ${E===a.qty?"on":""}" data-qty="${E}" title="${E} шт — всего ${Q(k.client)}${k.minApplied?": меньше не берём, это минимальная сумма заказа":""}"><span class="q">${E} шт</span>${k.minApplied?`<span class="p" style="font-size:.8em">до минимума</span><span class="d">${Q(k.client)} за всё</span>`:`<span class="p">${Q(g,g<100?1:0)}</span>`}<span class="d" ${k.minApplied?"hidden":""}>${k.minApplied?"":y>0?"опт −"+S(y,0)+"%":"&nbsp;"}</span></button>`
      }).join("")
    }
    if (n) {
      const W = x => (x.cost - x.prep) * (1 + (+t.markup || 0) / 100) + x.prep * (1 + s.prepMk / 100),
        sw = s.lines.reduce((a, b) => a + W(b.c), 0),
        nm = s.byMarkup * s.kCl,
        su = (s.det && s.det.setupH || 0) * (+t.rate || 0) * (1 + s.prepMk / 100) * (1 + (s.det && s.det.adjust || 0) / 100) * (1 + s.rush) * (1 - s.optEff) * s.kCl,
        sx = ((s.det && s.det.cad || 0) + (s.det && s.det.pack || 0) * (1 + (+t.markup || 0) / 100)) * (1 + (s.det && s.det.adjust || 0) / 100) * (1 + s.rush) * (1 - s.optEff) * s.kCl,
        M = sw > 0 ? (nm - su - sx) / sw : 0;
      f("basket").innerHTML = s.lines.map(({
        it: E,
        c: k
      }) => {
        const g = W(k) * M / k.qty,
          y = tt.has(k.tech) ? `${S(E.ml,1)} мл` : `${S(E.grams,1)} г`;
        return `<div class="bi${E.id===loCur?" cur":""}" data-t="${k.tech}"><div class="n"><b ${loGeo.has(E.id)&&E.id!==loCur?`data-sel="${J(E.id)}" role="button" tabindex="0" style="cursor:pointer;text-decoration:underline dotted" title="Открыть деталь: положение, масштаб, параметры"`:""}>${E.id===loCur?"▸ ":""}${J(E.name)}</b><small><select data-bm="${J(E.id)}" aria-label="Материал позиции" style="font:inherit;max-width:180px">${gn(k.tech).filter(m=>!m.off||m.id===k.mt.id).map(m=>`<option value="${J(m.id)}" ${m.id===k.mt.id?"selected":""}>${J(m.name)}</option>`).join("")}</select> · ${y}${E.gcode?" · G-code":""}${E.chamber?" · камера":""}</small></div><div style="display:flex;align-items:center;gap:6px"><span class="inp" style="width:84px"><input type="number" min="1" max="100000" step="1" inputmode="numeric" value="${k.qty}" data-bq="${J(E.id)}" aria-label="Количество, шт"><em>шт</em></span><span class="p">${mt(g)}/шт</span><button class="btn small ghost" type="button" data-dup="${J(E.id)}" aria-label="Дублировать" title="Дублировать">⧉</button><button class="btn small ghost danger" type="button" data-del="${J(E.id)}" aria-label="Удалить">✕</button></div></div>`
      }).join("") + (su > .5 ? `<div class="bi"><div class="n"><b>Подготовка заказа</b><small>приём и подготовка, разово на весь заказ</small></div><span class="p">${Q(su)}</span></div>` : "") + (sx > .5 ? `<div class="bi"><div class="n"><b>Моделирование и упаковка</b><small>на весь заказ</small></div><span class="p">${Q(sx)}</span></div>` : "") + (s.minApplied ? `<div class="bi"><div class="n"><b>До минимальной суммы заказа</b><small>детали стоят ${Q(nm)}, минимум ${Q(s.client)}</small></div><span class="p">${Q(s.client-nm)}</span></div>` : "")
    }
    Ys()
  }

  function Po(t) {
    const e = f("whenBox");
    if (!e) return;
    const n = t.plan,
      a = l.money;
    e.className = "when " + (n.mode === "none" ? "" : n.mode), e.innerHTML = n.mode === "none" ? `Старт ${Rt(n.start)} → готово ≈ <b>${Rt(n.end)}</b>` : n.mode === "ok" ? `Успеваем: готово ≈ <b>${Rt(n.end)}</b>, срок ${Rt(n.dl)}` : n.mode === "rush" ? `В очереди не успеть — вне очереди: старт сейчас, готово ≈ <b>${Rt(n.end)}</b>. Наценка +${a.rushPct}%` : `Не успеть к ${Rt(n.dl)}: самое раннее <b>${Rt(n.end)}</b>`, At() && (e.innerHTML += `<br>Клиенту обещано: ${At()} ${la(At())} — до <b>${$n(xn(Date.now(),At()))}</b>`), f("busyAfter").dataset.end = n.end
  }

  function Fo(t) {
    const e = f("cliInfo");
    if (!e) return;
    const n = l.money,
      a = l.blocks,
      o = [],
      s = wi();
    s.length && o.push('<div class="mine">Расчёт по вашим настройкам <button type="button" class="pop-link" id="btnWorkshop">Вернуть параметры мастерской</button></div>'), a.discount && n.optOn && (n.opt || []).length && o.push(`<div class="opt-list">Скидки за объём: ${n.opt.map(d=>`от ${S(d.q)} шт −${S(d.d)}%`).join(" · ")}</div>`), a.discount && +n.minOrder > 0 && ei("minOn") && (t.minApplied || l.part.minOn === !1) && o.push(`<label class="check min-on"><input type="checkbox" id="minOn" ${l.part.minOn!==!1?"checked":""}><span>Учитывать минимальную сумму заказа (${Q(t.minClient)})<small>Снимите галочку, чтобы увидеть цену только этих деталей — например, если добавите их к другому заказу</small></span></label>`), e.innerHTML = o.join("");
    const i = f("btnWorkshop");
    i && (i.onclick = tr);
    const r = f("minOn");
    r && (r.onchange = () => {
      l.part.minOn = r.checked, at()
    });
    const c = f("cmpBox");
    if (c)
      if (!document.body.classList.contains("money") || !s.length) c.hidden = !0;
      else {
        const d = l.blocks.basket && l.basket.length,
          u = Qo(d ? l.basket : null);
        c.hidden = !1, c.innerHTML = '<p class="sub">Сравнение с параметрами мастерской</p>' + (u ? `<div class="cmp-row"><span>По параметрам мастерской</span><b>${Q(u.client)}</b></div><div class="cmp-row"><span>По вашим настройкам</span><b>${Q(t.client)}</b></div><div class="cmp-row"><span>Разница</span><b class="${t.client>=u.client?"up":"down"}">${t.client>=u.client?"+":"−"}${Q(Math.abs(t.client-u.client))} (${S((t.client/u.client-1)*100,1)}%)</b></div>` : "") + `<ul class="cmp-list">${s.slice(0,12).map(p=>`<li>${J(p)}</li>`).join("")}${s.length>12?`<li>…и ещё ${s.length-12}</li>`:""}</ul>`
      }
  }

  function _s() {
    const t = rn;
    if (!t) return "";
    const e = l.money,
      n = l.blocks,
      a = [`Выписка расчёта 3D-печати от ${new Date().toLocaleDateString("ru-RU")}`, ""],
      o = () => {
        const s = typeof jn == "function" ? jn() : null,
          i = typeof qn == "function" ? qn() : null;
        try {
          return s && i && pn[s][i.preset] ? pn[s][i.preset].name : ""
        } catch {
          return ""
        }
      };
    return t.lines.forEach(({
      it: s,
      c: i
    }, r) => {
      a.push(`${t.lines.length>1?r+1+". ":""}${s.name}`, `   Технология: ${Nt[i.tech].long}`, `   Материал: ${i.mt.name}${s.color?", "+s.color.toLowerCase():""}`);
      const c = o();
      c && t.lines.length === 1 && a.push(`   Качество: ${c}`), s.dims && a.push(`   Габариты: ${s.dims}`), a.push(`   Количество: ${S(i.qty)} шт`);
      const d = [s.inserts > 0 ? `втулки ×${s.inserts}` : "", s.paint > 0 ? "покраска" : "", l.part.packOn ? "упаковка" : "", e.cadH > 0 ? `моделирование ${S(e.cadH,1)} ч` : ""].filter(Boolean);
      n.extras && d.length && a.push(`   Доп. услуги: ${d.join(", ")}`)
    }), a.push(""), At() ? a.push(`Срок выполнения: ${At()} ${la(At())} (готово до ${$n(xn(Date.now(),At()))})`) : n.schedule && t.plan && a.push(`Готовность: к ${new Date(t.plan.end).toLocaleDateString("ru-RU",{day:"2-digit",month:"2-digit"})} (${new Date(t.plan.end).toLocaleDateString("ru-RU",{weekday:"short"})})${t.plan.dl?` (нужно к ${new Date(t.plan.dl).toLocaleDateString("ru-RU",{day:"2-digit",month:"2-digit"})})`:""}`), t.rushCl > .5 && a.push(`Наценка за срочность +${S(t.rush*100)}%: +${mt(t.rushCl)}`), t.optCl > .5 && a.push(`Скидка за опт ${S(t.optD*100)}%: −${mt(t.optCl)}`), t.minApplied && a.push(`Минимальная сумма заказа: ${mt(t.minClient)} (детали стоят ${mt(t.byMarkup*t.kCl)})`), t.prepCl > .5 && a.push(`Подготовка заказа (разово): ${mt(t.prepCl)}`, `Печать и материалы: ${mt(t.client-t.prepCl)} (${mt((t.client-t.prepCl)/t.qty)} за шт)`), t.qty > 1 && (t.lines.length === 1 ? a.push(`Цена за 1 шт с подготовкой: ${mt(t.client/t.qty)}`) : (() => {
      const W = x => (x.cost - x.prep) * (1 + (+e.markup || 0) / 100) + x.prep * (1 + t.prepMk / 100),
        sw = t.lines.reduce((p, q) => p + W(q.c), 0),
        K0 = sw > 0 ? t.byMarkup * t.kCl / sw : 0;
      a.push("Цена за 1 шт по позициям (с долей подготовки заказа):"), t.lines.forEach(({
        it: E,
        c: k
      }) => a.push(`  ${E.name}: ${mt(W(k)*K0/k.qty)} × ${S(k.qty)} шт`))
    })()), a.push(`Итого: ${mt(t.client)}${n.tax&&e.vat>0?`, в т.ч. НДС ${e.vat}% ${mt(t.vatAmt)}`:""}`), wi().length && a.push("", "Расчёт по собственным настройкам пользователя, не по параметрам мастерской."), n.discount && +e.minOrder > 0 && l.part.minOn === !1 && a.push("", `Цена указана без минимальной суммы заказа (${mt(t.minClient)}). При оформлении итог будет не меньше этой суммы.`), a.push("", "Расчёт предварительный. Калькулятор «Смета 3D»" + (typeof fe < "u" && fe ? ", neroartnuar.github.io/Calculator-3d-printing" : "") + "."), a.join(`
`)
  }
  let Ns = !1,
    Pa = "";

  function Fa() {
    const t = "ACEFHKLMNPRTUVWXY34679";
    Pa = Array.from({
      length: 5
    }, () => t[Math.floor(Math.random() * t.length)]).join("");
    const e = f("capCv"),
      n = e.getContext("2d");
    n.clearRect(0, 0, e.width, e.height), n.fillStyle = "#eef1f4", n.fillRect(0, 0, e.width, e.height);
    for (let a = 0; a < 6; a++) n.strokeStyle = `hsl(${Math.random()*360} 40% 55% / .6)`, n.beginPath(), n.moveTo(Math.random() * e.width, Math.random() * e.height), n.bezierCurveTo(Math.random() * e.width, Math.random() * e.height, Math.random() * e.width, Math.random() * e.height, Math.random() * e.width, Math.random() * e.height), n.stroke();
    [...Pa].forEach((a, o) => {
      n.save(), n.translate(18 + o * 26, 30 + (Math.random() * 8 - 4)), n.rotate((Math.random() - .5) * .6), n.font = `${24+Math.random()*6}px Georgia, serif`, n.fillStyle = `hsl(${Math.random()*360} 50% 30%)`, n.fillText(a, -8, 8), n.restore()
    });
    for (let a = 0; a < 80; a++) n.fillStyle = "rgba(0,0,0,.25)", n.fillRect(Math.random() * e.width, Math.random() * e.height, 1.5, 1.5)
  }

  function Bs() {
    Ns = !0, f("vypGate").hidden = !0, f("vypShow").hidden = !0, f("vypOut").hidden = !1, f("vypText").value = _s()
  }

  function Ho() {
    f("vypShow").onclick = () => {
      Bs();
      return;
      const t = f("vypGate");
      if (t.hidden = !1, f("vypShow").hidden = !0, l.mode === "adv") {
        t.innerHTML = '<p class="cap">Введите символы с картинки</p><div class="cap-row"><canvas id="capCv" width="150" height="48"></canvas><button type="button" class="pop-link" id="capNew">другой код</button></div><div class="cap-row"><span class="inp"><input id="capIn" maxlength="5" autocomplete="off" aria-label="Код с картинки"></span><button class="btn small primary" type="button" id="capOk">Показать</button></div><small class="bad-text" id="capErr" hidden>Неверно, попробуйте ещё</small>', Fa();
        const e = () => {
          f("capIn").value.trim().toUpperCase() === Pa ? Bs() : (f("capErr").hidden = !1, f("capIn").value = "", Fa())
        };
        f("capOk").onclick = e, f("capNew").onclick = Fa, f("capIn").onkeydown = n => {
          n.key === "Enter" && e()
        }
      } else {
        let e = 5;
        t.innerHTML = `<p class="cap">Готовим выписку… <b id="vypT">${e}</b></p>`;
        const n = setInterval(() => {
          e--;
          const a = f("vypT");
          a && (a.textContent = e), e <= 0 && (clearInterval(n), Bs())
        }, 1e3)
      }
    }, f("vypCopy").onclick = () => {
      const t = f("vypText");
      t.select(), (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => V("Выписка скопирована"), () => {
        document.execCommand("copy"), V("Выписка скопирована")
      })
    }
  }

  function loPl(n, a, b, c) {
    n = Math.abs(Math.round(n));
    const e = n % 10,
      h = n % 100;
    return e === 1 && h !== 11 ? a : e >= 2 && e <= 4 && (h < 12 || h > 14) ? b : c
  }

  function loMix(s, x) {
    const M = {},
      P = {};
    for (const {
        it: E,
        c: k
      }
      of s.lines) {
      const R = tt.has(k.tech),
        key = (R ? "смола " : "") + k.mt.name,
        v = R ? (+E.ml || 0) * k.qty : k.gramsNet;
      M[key] = M[key] || {
        v: 0,
        u: R ? "мл" : "г"
      }, M[key].v += v;
      const t = Nt[k.tech].name;
      P[t] = P[t] || {
        v: 0,
        sls: k.tech === "sls"
      }, P[t].v += k.plates
    }
    const ms = Object.entries(M).map(([n, {
        v,
        u
      }]) => `${J(n)} ${u==="г"&&v>=1e3?S(v/1e3,2)+" кг":S(v,v<10?1:0)+" "+u}`).join(" · "),
      ps = Object.entries(P).map(([n, {
        v,
        sls
      }]) => {
        const r = Math.round(v);
        return `${n}: ${S(r)} ${sls?loPl(r,"запуск","запуска","запусков"):loPl(r,"стол","стола","столов")}`
      }).join(" · ");
    return [
      ["Материалы", ms],
      ["Столы", ps], ...x.filter(([k]) => k === "Печать" || k === "Срок")
    ]
  }

  function loKp() {
    f("btnSaveKP").onclick = e => {
      e.preventDefault(), e.stopPropagation();
      const nm = `КП ${(l.part.name||"деталь").replace(/[\\/:*?"<>|]+/g," ")} ${new Date().toLocaleDateString("ru-RU")}.txt`;
      if (dt) {
        dt.saveText({
          name: nm,
          text: f("kpText").value
        }).then(n => {
          n.ok && n.data && V("КП сохранено: " + n.data)
        });
        return
      }
      const c = document.createElement("a");
      c.href = URL.createObjectURL(new Blob([f("kpText").value], {
        type: "text/plain;charset=utf-8"
      })), c.download = nm, document.body.appendChild(c), c.click(), setTimeout(() => {
        URL.revokeObjectURL(c.href), c.remove()
      }, 500)
    }, f("btnPrintKP").onclick = e => {
      e.preventDefault(), e.stopPropagation(), loKpPdf()
    }
  }

  function loSnapPng() {
    try {
      if (!Re || !Yt || !H) return "";
      return Yt.render(ye, Fe), Yt.domElement.toDataURL("image/png")
    } catch {
      return ""
    }
  }

  function loKpHtml(no0, cli0) {
    const s = rn;
    if (!s) return "";
    const m = l.money,
      B = l.blocks,
      bc = loHS(m.brand) ? m.brand : "#0b6a89",
      now = new Date,
      p2 = x => String(x).padStart(2, "0"),
      no = no0 || loKpNo(loKpSeq().n + 1),
      cli = (cli0 ?? (f("kpClient") ? f("kpClient").value : "")).trim(),
      shop = (m.shopName || "").trim(),
      img = loSnapPng(),
      n = l.basket.length > 0,
      rows = [];
    if (n) {
      const W = x => (x.cost - x.prep) * (1 + (+m.markup || 0) / 100) + x.prep * (1 + s.prepMk / 100),
        sw = s.lines.reduce((a, b) => a + W(b.c), 0),
        nm = s.byMarkup * s.kCl,
        dt = s.det || {},
        k1 = (1 + (dt.adjust || 0) / 100) * (1 + s.rush) * (1 - s.optEff) * s.kCl,
        su = (dt.setupH || 0) * (+m.rate || 0) * (1 + s.prepMk / 100) * k1,
        sx = ((dt.cad || 0) + (dt.pack || 0) * (1 + (+m.markup || 0) / 100)) * k1,
        M = sw > 0 ? (nm - su - sx) / sw : 0;
      s.lines.forEach(({
        it: E,
        c: k
      }) => rows.push([E.name, `${Nt[k.tech].name} · ${k.mt.name}${E.color?" · "+E.color.toLowerCase():""}`, k.qty, W(k) * M]));
      su > .5 && rows.push(["Подготовка заказа", "приём и подготовка файлов", 0, su]), sx > .5 && rows.push(["Моделирование и упаковка", "на весь заказ", 0, sx]), s.minApplied && rows.push(["До минимальной суммы заказа", "", 0, s.client - nm])
    } else {
      const a = Aa,
        k = s.lines[0].c;
      rows.push([a ? a.name : "Деталь", `${Nt[k.tech].name} · ${k.mt.name}${a&&a.color?" · "+a.color.toLowerCase():""}`, s.qty, s.client])
    }
    const tr = rows.map(([a, b, q, v], i) => `<tr><td class="nn">${i+1}</td><td><b>${J(a)}</b>${b?`<small>${J(b)}</small>`:""}</td><td class="r">${q?S(q)+" шт":""}</td><td class="r">${q>1?mt(v/q):""}</td><td class="r b">${mt(v)}</td></tr>`).join("");
    let tiers = "";
    if (!n && Aa && B.batch) {
      const t = [1, 5, 10, 25, 50, 100].map(q => {
        const r = en([{
          ...Aa,
          qty: q
        }], m);
        return `<div class="ti${q===s.qty?" on":""}"><span>${q} шт</span><b>${r.minApplied?mt(r.client):mt(r.client/q)}</b><small>${r.minApplied?"мин. заказ":"за шт"}</small></div>`
      }).join("");
      tiers = `<h3>Цена при другом тираже</h3><div class="tiers">${t}</div>`
    }
    const due = At() ? `${At()} ${la(At())} после согласования, ориентировочно до ${$n(xn(Date.now(),At()))}` : B.schedule && (s.plan.mode !== "none" || s.plan.busy) ? `${Rt(s.plan.end)}${s.rush?" (срочно)":""}` : `около ${s.days} раб. дн. после согласования модели`,
      terms = [
        ["Срок изготовления", due],
        (m.kpPay || "").trim() && ["Оплата", m.kpPay.trim()],
        +m.kpDays > 0 && ["Предложение действует до", new Date(Date.now() + +m.kpDays * 864e5).toLocaleDateString("ru-RU")]
      ].filter(Boolean).map(([a, b]) => `<div><span>${a}</span><b>${J(b)}</b></div>`).join(""),
      a0 = !n && Aa,
      k0 = s.lines[0].c,
      spec = a0 ? [
        ["Технология", Nt[k0.tech].long],
        ["Материал", k0.mt.name + (a0.color ? ", " + a0.color.toLowerCase() : "")],
        a0.dims && ["Габариты", a0.dims],
        ["Масса 1 шт", `≈ ${S(a0.grams,0)} г`]
      ].filter(Boolean).map(([a, b]) => `<div><span>${a}</span><b>${J(b)}</b></div>`).join("") : "",
      own = (m.kpTpl || "").trim() ? `<div class="own">${J(f("kpText").value)}</div>` : "",
      vat = B.tax && m.vat > 0 ? `<div class="tot-s">в том числе НДС ${S(m.vat)}%: ${mt(s.vatAmt)}</div>` : "",
      opt = s.optEff > 0 ? `<div class="tot-s">учтена скидка за объём −${S(s.optEff*100,0)}%</div>` : "",
      pic = img ? `<div class="pic"><img src="${img}" alt=""></div>` : "",
      css = `@page{size:A4;margin:14mm 14mm 16mm}*{box-sizing:border-box}body{margin:0;font:12.5px/1.45 system-ui,"Segoe UI",Roboto,Arial,sans-serif;color:#1c2329;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hd{display:flex;align-items:center;gap:14px;padding-bottom:12px;border-bottom:3px solid ${bc}}.hd img{max-height:52px;max-width:170px;object-fit:contain}.hd .sh{font-size:17px;font-weight:700}.hd .no{margin-left:auto;text-align:right;color:#5b6670;font-size:11.5px}.hd .no b{display:block;color:#1c2329;font-size:12.5px}.hd .no .to{display:block;color:#1c2329;font-size:12px;margin-top:2px}
h1{font-size:21px;margin:18px 0 4px;color:${bc}}h3{font-size:12px;margin:18px 0 8px;text-transform:uppercase;letter-spacing:.04em;color:#5b6670}
.top{display:flex;gap:18px;margin-top:12px;align-items:flex-start}.pic{flex:0 0 230px;height:170px;border:1px solid #e1e5e9;border-radius:10px;background:#eef1f4;display:flex;align-items:center;justify-content:center;overflow:hidden}.pic img{max-width:100%;max-height:100%}
.spec{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;align-content:start}.spec div,.terms div{display:flex;flex-direction:column}.spec span,.terms span{font-size:10.5px;color:#5b6670;text-transform:uppercase;letter-spacing:.03em}.spec b,.terms b{font-weight:600}
table{width:100%;border-collapse:collapse;margin-top:6px}th{font-size:10.5px;text-transform:uppercase;letter-spacing:.03em;color:#5b6670;text-align:left;padding:6px 8px;border-bottom:1.5px solid #1c2329}td{padding:8px;border-bottom:1px solid #e1e5e9;vertical-align:top}td small{display:block;color:#5b6670}td.nn{color:#8a949c;width:22px}.r{text-align:right;white-space:nowrap}th.r{text-align:right}.b{font-weight:700}
.tot{display:flex;justify-content:flex-end;margin-top:10px}.tot>div{min-width:250px;padding:12px 16px;border-radius:10px;background:${bc};color:#fff;text-align:right}.tot .v{font-size:22px;font-weight:800}.tot .k{font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.04em}.tot-s{font-size:11px;opacity:.9}
.tiers{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.ti{border:1px solid #e1e5e9;border-radius:8px;padding:6px 8px;text-align:center}.ti span,.ti small{display:block;font-size:10.5px;color:#5b6670}.ti b{font-size:13px}.ti.on{border-color:${bc};box-shadow:inset 0 0 0 1px ${bc}}
.terms{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 18px;padding:12px 14px;border:1px solid #e1e5e9;border-radius:10px}
.own{white-space:pre-wrap;margin-top:14px;padding:12px 14px;border-left:3px solid ${bc};background:#f7f9fa}
.ft{margin-top:22px;padding-top:10px;border-top:1px solid #e1e5e9;color:#5b6670;font-size:11px;white-space:pre-wrap}
@media screen{body{max-width:820px;margin:0 auto;padding:28px 24px}}`;
    return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>КП ${no}${shop?" — "+J(shop):""}</title><style>${css}</style></head><body>
<div class="hd">${m.logo?`<img src="${m.logo}" alt="">`:""}${shop?`<div class="sh">${J(shop)}</div>`:""}<div class="no"><b>Коммерческое предложение № ${no}</b>от ${now.toLocaleDateString("ru-RU")}${cli?`<span class="to">для: ${J(cli)}</span>`:""}</div></div>
<h1>${J(a0?a0.name:"Изготовление деталей на 3D-принтере")}</h1>
${a0?`<div class="top">${pic}<div class="spec">${spec}</div></div>`:pic?`<div class="top">${pic}</div>`:""}
<h3>Состав предложения</h3><table><thead><tr><th></th><th>Позиция</th><th class="r">Кол-во</th><th class="r">Цена за шт</th><th class="r">Сумма</th></tr></thead><tbody>${tr}</tbody></table>
<div class="tot"><div><div class="k">Итого</div><div class="v">${mt(s.client)}</div>${vat}${opt}</div></div>
${tiers}${own}<h3>Условия</h3><div class="terms">${terms}</div>
${(m.shopInfo||"").trim()?`<div class="ft">${J(m.shopInfo.trim())}</div>`:""}
</body></html>`
  }

  function loKpSeq() {
    const y = new Date().getFullYear(),
      q = nt.get("kpSeq", null);
    return q && q.y === y ? q : {
      y,
      n: 0
    }
  }

  function loKpNo(n) {
    return `${new Date().getFullYear()}-${String(n).padStart(3,"0")}`
  }

  function loKpLog() {
    const v = nt.get("kpLog", []);
    return Array.isArray(v) ? v : []
  }

  function loKpLogRender() {
    const tb = f("kpLogT"),
      nx = f("kpNext");
    if (nx && (nx.textContent = `Следующий № ${loKpNo(loKpSeq().n+1)}`), !tb) return;
    const q = (f("kpLogQ") ? f("kpLogQ").value : "").trim().toLowerCase(),
      all = loKpLog(),
      rows = all.filter(e => !q || [e.no, e.cli, e.name].join(" ").toLowerCase().includes(q));
    f("kpLogN") && (f("kpLogN").textContent = all.length ? `${all.length} шт` : ""), tb.innerHTML = rows.length ? rows.map(e => `<tr><td>${J(e.no)}</td><td>${new Date(e.at).toLocaleDateString("ru-RU")}</td><td>${J(e.cli||"—")}</td><td>${J(e.name)}</td><td class="r">${Q(e.sum)}</td><td><button type="button" class="icon-btn" data-kpdel="${J(e.no)}" title="Удалить из журнала" aria-label="Удалить ${J(e.no)}">×</button></td></tr>`).join("") : `<tr><td colspan="6" class="empty">${all.length?"Ничего не найдено":"Пока пусто. КП попадает сюда при нажатии «Печать / PDF»."}</td></tr>`
  }

  function loPlugCode() {
    const m = l.money,
      B = l.blocks,
      d = {
        v: 1,
        at: Date.now(),
        shop: (m.shopName || "").trim(),
        money: {
          rate: +m.rate || 0,
          setupMin: B.labor ? +m.setupMin || 0 : 0,
          plateMin: B.labor ? +m.plateMin || 0 : 0,
          kwh: B.energy ? +m.kwh || 0 : 0,
          twoRate: !!(B.energy && m.twoRate),
          kwhNight: +m.kwhNight || 0,
          nightFrom: +m.nightFrom || 0,
          nightTo: +m.nightTo || 0,
          risk: B.risk ? +m.risk || 0 : 0,
          waste: B.risk ? +m.waste || 0 : 0,
          markup: +m.markup || 0,
          prepMk: Number.isFinite(+m.prepMk) ? +m.prepMk : 0,
          minOrder: B.discount ? +m.minOrder || 0 : 0,
          minMode: m.minMode === "gross" ? "gross" : "net",
          taxRev: B.tax ? +m.taxRev || 0 : 0,
          vat: B.tax ? +m.vat || 0 : 0,
          opt: (m.opt || []).map(o => ({
            q: +o.q || 0,
            d: +o.d || 0
          })),
          optOn: !!(B.discount && m.optOn),
          presets: m.presets || [],
          rushPct: +m.rushPct || 0,
          insertPrice: +m.insertPrice || 0,
          cadRate: +m.cadRate || 0
        },
        printers: l.printers.filter(p => p.tech === "fdm" && !p.off).map(p => ({
          name: p.name,
          price: +p.price || 0,
          life: +p.life || 0,
          maint: +p.maint || 0,
          power: +p.power || 0,
          chamberPower: +p.chamberPower || 0,
          chamberMin: +p.chamberMin || 0
        })),
        materials: l.materials.filter(x => x.tech === "fdm" && !x.off).map(x => ({
          name: x.name,
          price: +x.price || 0
        }))
      },
      u = new TextEncoder().encode(JSON.stringify(d));
    let b = "";
    for (let i = 0; i < u.length; i += 8192) b += String.fromCharCode.apply(null, u.subarray(i, i + 8192));
    return "SMETA3D-FDM:" + btoa(b)
  }

  function loPlugInit() {
    const d = document.querySelector('[data-mp="prod"]');
    if (!d || f("plugBox")) return;
    d.insertAdjacentHTML("beforeend", `<div class="u-col" id="plugBox"><p class="sub">Плагин для OrcaSlicer</p><p class="cap">Код со ставками FDM: принтеры, пластики, работа, наценка, опт, минимум и налоги. Вставьте его в плагине: раздел «Ставки с сайта» → «Применить». Плагин посчитает цену по тем же правилам, что и сайт, но по весу и времени из нарезки Orca.</p><div class="u-row u-ac"><button type="button" class="btn small" id="btnPlugCode">Скопировать ставки для плагина</button><a class="cap" href="plugin.html">о плагине</a></div><textarea id="plugCode" class="u-wide u-mono" rows="3" readonly hidden aria-label="Код ставок для плагина"></textarea></div>`), f("btnPlugCode").addEventListener("click", () => {
      const c = loPlugCode(),
        t = f("plugCode"),
        ok = () => V("Код скопирован — вставьте его в плагине: «Ставки с сайта» → «Применить»"),
        show = () => {
          t.hidden = !1, t.value = c, t.focus(), t.select(), V("Скопируйте код из поля (Ctrl+C) и вставьте в плагине")
        };
      try {
        navigator.clipboard.writeText(c).then(ok, show)
      } catch (e) {
        show()
      }
    })
  }

  function loKpLogInit() {
    const d = document.querySelector('[data-mp="doc"]');
    if (!d || f("kpLogBox")) return;
    d.insertAdjacentHTML("beforeend", `<div class="kplog" id="kpLogBox"><div class="u-between u-mb6"><p class="sub">Выданные КП <small id="kpLogN"></small></p><span class="u-flex6"><button type="button" class="btn small" id="kpLogCsv">Скачать CSV</button><button type="button" class="btn small ghost" id="kpLogClr">Очистить</button></span></div><span class="inp u-mb6"><input type="search" id="kpLogQ" placeholder="Поиск: номер, клиент, изделие" aria-label="Поиск по журналу КП"></span><div class="kplog-w"><table><thead><tr><th>№</th><th>Дата</th><th>Клиент</th><th>Изделие</th><th class="r">Сумма</th><th></th></tr></thead><tbody id="kpLogT"></tbody></table></div><small class="cap">Журнал и нумерация хранятся в этом браузере. Номер растёт с каждым КП и начинается заново с нового года.</small></div>`), f("kpLogQ").addEventListener("input", loKpLogRender), f("kpLogT").addEventListener("click", e => {
      const b = e.target.closest("[data-kpdel]");
      b && (nt.set("kpLog", loKpLog().filter(x => x.no !== b.dataset.kpdel)), loKpLogRender())
    }), f("kpLogClr").addEventListener("click", e => {
      const b = e.currentTarget;
      if (!loKpLog().length) return;
      if (!b.dataset.sure) {
        b.dataset.sure = 1, b.textContent = "Точно очистить?", setTimeout(() => {
          delete b.dataset.sure, b.textContent = "Очистить"
        }, 3e3);
        return
      }
      delete b.dataset.sure, b.textContent = "Очистить", nt.set("kpLog", []), loKpLogRender()
    }), f("kpLogCsv").addEventListener("click", () => {
      const c = x => `"${String(x??"").replace(/"/g,'""')}"`,
        t = "\ufeff" + [["Номер", "Дата", "Клиент", "Изделие", "Позиций", "Сумма, ₽"].map(c).join(";")].concat(loKpLog().map(e => [e.no, new Date(e.at).toLocaleDateString("ru-RU"), e.cli, e.name, e.n, Math.round(e.sum)].map(c).join(";"))).join("\r\n"),
        a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([t], {
        type: "text/csv;charset=utf-8"
      })), a.download = "kp-journal.csv", document.body.appendChild(a), a.click(), setTimeout(() => {
        URL.revokeObjectURL(a.href), a.remove()
      }, 500)
    }), loKpLogRender()
  }

  function loKpPdf() {
    if (!rn) return V("Сначала загрузите модель или введите данные слайсера");
    const sq = loKpSeq(),
      no = loKpNo(sq.n + 1),
      cli = f("kpClient") ? f("kpClient").value.trim() : "",
      html = loKpHtml(no, cli);
    if (!html) return V("Сначала загрузите модель или введите данные слайсера");
    nt.set("kpSeq", {
      y: sq.y,
      n: sq.n + 1
    }), nt.set("kpLog", [{
      no,
      at: Date.now(),
      cli,
      name: l.basket.length ? `Заказ: ${l.basket.length} поз.` : (Aa && Aa.name || l.part.name || "Деталь").trim(),
      n: Math.max(1, l.basket.length),
      sum: rn.client
    }].concat(loKpLog()).slice(0, 1e3)), loKpLogRender();
    let fr = f("loPrintFr");
    fr || (fr = document.createElement("iframe"), fr.id = "loPrintFr", fr.setAttribute("aria-hidden", "true"), fr.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0", document.body.appendChild(fr));
    const w = fr.contentWindow;
    w.document.open(), w.document.write(html), w.document.close();
    Promise.all([...w.document.images].map(i => i.complete ? 0 : new Promise(r => i.onload = i.onerror = r))).then(() => setTimeout(() => {
      w.focus(), w.print()
    }, 150))
  }

  function loLead() {
    const b = f("leadBtns");
    if (!b) return;
    const m = l.money,
      e = (m.cEmail || "").trim(),
      t = (m.cTg || "").trim().replace(/^@|^https?:\/\/t\.me\//i, ""),
      w = (m.cWa || "").replace(/\D/g, ""),
      x = [];
    e && x.push(`<button class="btn small primary" type="button" data-lead="mail">Отправить заявку на почту</button>`), t && x.push(`<button class="btn small" type="button" data-lead="tg">Написать в Telegram</button>`), w && x.push(`<button class="btn small" type="button" data-lead="wa">Отправить в WhatsApp</button>`), x.push('<button class="btn small" type="button" data-lead="print">Печать / PDF</button>'), b.innerHTML = x.join("")
  }

  function loLeadGo(k) {
    const m = l.money,
      tx = rn ? _s() : "",
      sub = `Заявка на 3D-печать: ${(l.part.name||"деталь").trim()}`;
    if (k === "mail") {
      const u = `mailto:${encodeURIComponent((m.cEmail||"").trim())}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(tx.slice(0,1800)+"\n\nФайл модели приложу к письму.")}`;
      location.href = u
    } else if (k === "tg") {
      navigator.clipboard && navigator.clipboard.writeText(tx).catch(() => {}), V("Выписка скопирована — вставьте её в чат"), window.open("https://t.me/" + encodeURIComponent((m.cTg || "").trim().replace(/^@|^https?:\/\/t\.me\//i, "")), "_blank", "noopener")
    } else if (k === "wa") window.open(`https://wa.me/${(m.cWa||"").replace(/\D/g,"")}?text=${encodeURIComponent(tx.slice(0,1800))}`, "_blank", "noopener");
    else if (k === "print") {
      let fr = f("loPrintFr");
      fr || (fr = document.createElement("iframe"), fr.id = "loPrintFr", fr.setAttribute("aria-hidden", "true"), fr.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0", document.body.appendChild(fr));
      const w = fr.contentWindow;
      w.document.open(), w.document.write(`<!doctype html><meta charset="utf-8"><title>${J(sub)}</title><style>body{font:14px/1.5 system-ui,sans-serif;margin:24px;color:#000;background:#fff}pre{white-space:pre-wrap;font:inherit}</style><pre>${J(tx)}</pre>`), w.document.close(), w.focus(), setTimeout(() => w.print(), 200)
    }
  }

  function Ro() {
    const t = rn;
    if (!t) return "Сначала загрузите модель или введите данные слайсера.";
    const e = [],
      n = l.blocks;
    if (e.push(`Коммерческое предложение на 3D-печать от ${new Date().toLocaleDateString("ru-RU")}`), (l.money.shopName || "").trim() && e.push(l.money.shopName.trim()), e.push(""), Aa) {
      const a = Aa,
        o = t.lines[0].c;
      if (e.push(`Изделие: ${a.name}`, `Технология: ${Nt[o.tech].long}`), a.dims && e.push(`Габариты: ${a.dims}`), e.push(`Материал: ${o.mt.name}${a.color?", "+a.color.toLowerCase():""}`, `Масса 1 шт: ≈ ${S(a.grams,0)} г`), n.batch && e.push(`Тираж: ${S(a.qty)} шт`), e.push(""), a.qty > 1 && e.push(`Цена за 1 шт: ${mt(t.client/t.qty)}`), e.push(`Итого: ${mt(t.client)}`), t.minApplied && e.push(`Минимальная сумма заказа — ${mt(t.client)}, стоимость деталей ${mt(t.byMarkup*t.kCl)}`), t.optD && !t.minApplied && e.push(`С учётом скидки за объём ${loPc(t.optEff)}%`), n.tax && l.money.vat > 0 && e.push(`В том числе НДС ${l.money.vat}%: ${mt(t.vatAmt)}`), n.batch) {
        e.push("", "Цена за штуку при другом тираже:");
        for (const s of [1, 5, 10, 25, 50, 100]) {
          if (s === a.qty) continue;
          const i = en([{
            ...a,
            qty: s
          }], l.money);
          e.push(i.minApplied ? `  ${s} шт — ${mt(i.client)} за всё (минимальная сумма заказа)` : `  ${s} шт — ${mt(i.client/s)} за шт, всего ${mt(i.client)}`)
        }
      }
    } else {
      const a = t.cost > 0 ? t.client / t.cost : 0;
      e.push("Позиции:"), t.lines.forEach(({
        it: o,
        c: s
      }, i) => e.push(`  ${i+1}. ${o.name} — ${Nt[s.tech].name}, ${s.mt.name}, ${S(s.qty)} шт × ${mt(s.cost*a/s.qty)}`)), e.push("", `Итого: ${mt(t.client)}`), t.minApplied && e.push(`Минимальная сумма заказа — ${mt(t.client)}, стоимость деталей ${mt(t.byMarkup*t.kCl)}`), n.tax && l.money.vat > 0 && e.push(`В том числе НДС ${l.money.vat}%: ${mt(t.vatAmt)}`)
    }
    return e.push("", At() ? `Срок изготовления: ${At()} ${la(At())} после согласования модели (ориентировочно до ${$n(xn(Date.now(),At()))}).` : l.blocks.schedule && (t.plan.mode !== "none" || t.plan.busy) ? `Срок готовности: ${Rt(t.plan.end)}${t.rush?" (срочный заказ)":""}.` : `Срок изготовления: около ${t.days} раб. дн. после согласования модели.`), (l.money.kpPay || "").trim() && e.push(`Условия оплаты: ${l.money.kpPay.trim()}`), +l.money.kpDays > 0 && e.push(`Предложение действительно до ${new Date(Date.now()+ +l.money.kpDays*864e5).toLocaleDateString("ru-RU")}.`), (l.money.shopInfo || "").trim() && e.push("", l.money.shopInfo.trim()), fe && !(l.money.kpTpl || "").trim() && e.push("", "Расчёт: калькулятор «Смета 3D», neroartnuar.github.io/Calculator-3d-printing"), (l.money.kpTpl || "").trim() ? loKpFill(l.money.kpTpl, t) : e.join(`
`)
  }

  function Ys() {
    f("kpText").value = Ro();
    try {
      loKpPrev()
    } catch {}
  }
  const Xs = t => t.split(".").reduce((e, n) => e[n], l);

  function Us(t, e) {
    const n = t.split("."),
      a = n.pop();
    n.reduce((o, s) => o[s], l)[a] = e
  }

  function loQh(a, b) {
    const h = f("qtyHint");
    if (!h) return;
    const m = a < 1 ? "Минимум — 1 шт" : a > 1e5 ? "Больше 100 000 шт — по запросу, свяжитесь с нами. Считаем 100 000 шт" : a !== Math.round(a) ? `Только целое число — считаем ${S(b)} шт` : "";
    h.textContent = m, h.hidden = !m
  }

  function Oo(t, e) {
    const n = t.getAttribute("min"),
      a = t.getAttribute("max");
    return n !== null && n !== "" && e < +n && (e = +n), a !== null && a !== "" && e > +a && (e = +a), e
  }

  function ft() {
    Is(), gi(), Nn(), f("nightBox") && (f("nightBox").hidden = !l.money.twoRate), document.querySelectorAll("[data-bind]").forEach(a => {
      const o = Xs(a.dataset.bind);
      a.type === "checkbox" ? a.checked = !!o : document.activeElement !== a && (a.value = a.dataset.bind === "part.leadDays" && !+o ? "" : o)
    });
    const t = tt.has(l.tech),
      e = t ? l.manualResin : l.manual,
      n = t ? e.ml : e.g;
    document.activeElement !== f("manAmt") && (f("manAmt").value = n ? +(+n).toFixed(2) : ""), document.activeElement !== f("manH") && (f("manH").value = e.h || 0), document.activeElement !== f("manM") && (f("manM").value = e.m || 0), js()
  }
  const Zs = {
    slicer: ["nozzle", "layer", "walls", "top", "bottom", "infill"],
    sla: ["layer", "hollow", "wall"]
  };

  function zo() {
    document.querySelectorAll("[data-bind]").forEach(e => {
      const n = e.tagName === "SELECT" || e.type === "checkbox" ? "change" : "input";
      e.addEventListener(n, () => {
        const a = e.dataset.bind;
        let o;
        if (e.type === "checkbox") o = e.checked;
        else if (e.type === "number" || e.hasAttribute("data-num")) {
          if (o = parseFloat(e.value), !Number.isFinite(o)) {
            if (!/^sls\.m[GHT]$/.test(a)) return;
            o = 0
          } {
            const o0 = o;
            o = Oo(e, o), a === "part.qty" && (o = Math.max(1, Math.round(o)), loQh(o0, o))
          }
        } else o = e.value;
        Us(a, o);
        const [s, i] = a.split(".");
        Zs[s] && Zs[s].includes(i) && (l[s].preset = "custom", js()), a === "slicer.nozzle" && Is(), ["slicer.supports", "sla.supports", "sla.tilt"].includes(a) && Me(), at()
      }), e.type === "number" && e.addEventListener("change", () => {
        const a = Xs(e.dataset.bind); + e.value != +a && (e.value = a)
      })
    }), document.querySelectorAll("[data-quick]").forEach(e => e.addEventListener("click", n => {
      const a = n.target.closest("button");
      a && (Us(e.dataset.quick, parseFloat(a.dataset.v)), ft(), at())
    })), f("manAmt").addEventListener("input", e => {
      const n = Math.max(0, parseFloat(e.target.value) || 0);
      tt.has(l.tech) ? l.manualResin.ml = n : l.manual.g = n, at()
    });
    const t = () => tt.has(l.tech) ? l.manualResin : l.manual;
    f("manH").addEventListener("input", e => {
      t().h = Math.max(0, parseFloat(e.target.value) || 0), at()
    }), f("manM").addEventListener("input", e => {
      t().m = Math.min(59, Math.max(0, parseFloat(e.target.value) || 0)), at()
    })
  }
  const Vs = [
      ["simple", "Простой"],
      ["adv", "Расширенный"],
      ["staff", "Сотрудник"],
      ["friend", "Друзья"]
    ],
    Et = t => [...document.querySelectorAll(t)],
    Ht = t => Et(t).map(e => e.closest(".field, .check, label") || e),
    bt = t => Ht(`[data-bind="${t}"]`),
    Gs = [{
      g: "Модель",
      items: [
        ["demo", "Примеры моделей", () => Et("#demoSelect").map(t => t.closest(".inp") || t)],
        ["units", "Единицы файла", () => Ht("#unitSel")],
        ["dims", "Масштаб и размеры X / Y / Z", () => [...Ht("#scalePct"), ...Ht("#dimX"), ...Ht("#dimY"), ...Ht("#dimZ"), ...Ht("#scaleLock2")]],
        ["tFlat", "Кнопка «На грань»", () => Et("#btnFlat")],
        ["tOrient", "Кнопка «Подобрать»", () => Et("#btnOrient")],
        ["tPos", "Кнопка «Положение»", () => Et("#btnPos")],
        ["tRepair", "Кнопка «Починить»", () => Et("#btnRepair")],
        ["tSup", "Кнопка «Поддержки»", () => Et("#btnSup")],
        ["tScale", "Кнопка «Масштаб»", () => Et("#btnScale")]
      ]
    }, {
      g: "Печать",
      items: [
        ["techSub", "Кнопки технологий FDM / SLA / DLP / LCD / SLS", () => Et(".techbig")],
        ["source", "Оценка по модели / данные слайсера", () => Et("#srcSeg")],
        ["quality", "Кнопки качества", () => Et("#presets")],
        ["printer", "Выбор принтера", () => Ht("#printerSel")],
        ["printerEdit", "Свои профили принтера (✎ +)", () => Et("#editPrinter, #addPrinter")],
        ["material", "Выбор материала", () => Ht("#matSel")],
        ["matEdit", "Свои профили материала (✎ +)", () => Et("#editMat, #addMat")],
        ["nozzle", "Сопло", () => bt("slicer.nozzle")],
        ["layer", "Слой", () => Ht("#layerSel")],
        ["walls", "Стенки", () => bt("slicer.walls")],
        ["topbot", "Сверху / снизу", () => bt("slicer.top")],
        ["infill", "Заполнение", () => bt("slicer.infill")],
        ["supports", "Поддержки: где нужны / без", () => bt("slicer.supports")],
        ["supType", "Тип поддержек", () => bt("slicer.supportType")],
        ["brim", "Кайма / плот (панель «Поддержки»)", () => Et("#raftSeg").map(t => t.closest(".tp-sec") || t)],
        ["chamber", "Термокамера (FDM)", () => Et("#chamberChk").map(t => t.closest(".field"))]
      ]
    }, {
      g: "Фотополимер",
      items: [
        ["sLayer", "Слой", () => bt("sla.layer")],
        ["sSup", "Поддержки / на платформе", () => bt("sla.supports")],
        ["sDens", "Плотность поддержек", () => bt("sla.density")],
        ["sTilt", "Наклон", () => bt("sla.tilt")],
        ["sHollow", "Полая модель", () => bt("sla.hollow")],
        ["sWall", "Стенка полой", () => bt("sla.wall")]
      ]
    }, {
      g: "SLS",
      items: [
        ["lLayer", "Слой", () => bt("sls.layer")],
        ["lPack", "Упаковка камеры", () => bt("sls.packing")],
        ["lUnpack", "Распаковка", () => bt("sls.unpackMin")],
        ["lManual", "Данные из программы подготовки", () => Et('[data-bind="sls.mG"]').map(t => t.closest(".grid").closest(".field"))]
      ]
    }, {
      g: "Заказ",
      items: [
        ["partName", "Название детали", () => bt("part.name")],
        ["qty", "Тираж", () => Ht("#qtyInp")],
        ["perPlate", "На одном столе", () => Ht("#ppInp")],
        ["post", "Постобработка", () => Ht("#postInp")],
        ["minOn", "Галочка «Учитывать минимальную сумму»", () => []]
      ]
    }, {
      g: "Доп. услуги и сроки",
      items: [
        ["deadline", "Срок «Нужно к»", () => bt("money.deadline")],
        ["leadDays", "Срок выполнения, раб. дни", () => bt("part.leadDays")]
      ]
    }, {
      g: "Цена и документы",
      items: [
        ["markup", "Наценка", () => Ht("#mk")],
        ["adjust", "Скидка / срочность", () => Ht("#adj")],
        ["opt", "Скидки за опт (настройка)", () => Et("#secMoney .opt-box")],
        ["tiers", "Цена за штуку при тираже", () => Et("#tiersBox")],
        ["vyp", "Выписка", () => Et("#vypBox")],
        ["costRows", "Состав себестоимости в смете (амортизация, энергия, работа…)", () => Et("#sumRows")],
        ["kp", "Текст КП", () => Et("#kpBox")],
        ["basket", "Список заказа", () => Et("#basketBox, #btnAddBasket")]
      ]
    }],
    Ws = ["secExtra", "secTime", "secMoney"],
    Ks = ["adv", "pro", "mgr", "cli"];
  let Js = !1,
    Jt = !1,
    St = null;
  const Ha = {},
    se = {};

  function Qs(t) {
    const e = {
      simple: !0,
      adv: !0,
      staff: !0,
      pro: !0
    };
    for (let n = t; n && n !== document.body; n = n.parentElement) {
      const a = n.classList;
      a.contains("adv") && (e.simple = !1), a.contains("mgr") && (e.simple = e.adv = !1), a.contains("pro") && (e.simple = e.adv = e.staff = !1), a.contains("cli") && (e.staff = e.pro = !1)
    }
    return e.friend = e.pro, e
  }

  function Io() {
    for (const t of Gs)
      for (const [e, , n] of t.items) {
        const a = (n() || []).filter(Boolean);
        Ha[e] = a, a.forEach(o => {
          o._visDef = Qs(o), Ks.forEach(s => o.classList.remove(s)), o.dataset.vis = e
        }), se[e] = a[0] ? a[0]._visDef : {
          simple: !0,
          adv: !0,
          staff: !0,
          pro: !0,
          friend: !0
        }
      }
    se.minOn = {
      simple: !1,
      adv: !1,
      staff: !0,
      pro: !0,
      friend: !0
    }, se.costRows = {
      simple: !1,
      adv: !1,
      staff: !0,
      pro: !0,
      friend: !0
    };
    for (const q of ["chamber", "post", "perPlate"]) se[q] && (se[q] = {
      ...se[q],
      simple: !1,
      adv: !1
    });
    for (const t of Ws) {
      const e = f(t);
      e && (e._visDef = Qs(e), Ks.forEach(n => e.classList.remove(n)))
    }
    Js = !0, Xe()
  }
  const ti = () => l.mode === "pro" ? l.access === "friend" || Jt ? "friend" : "pro" : l.mode;

  function ei(t, e = ti()) {
    if (e === "pro") return se[t] ? se[t].pro : !0;
    const n = l.vis && l.vis[t];
    return n && typeof n[e] == "boolean" ? n[e] : se[t] ? se[t][e] : !0
  }
  const ni = {
    printer: () => l.sel[l.tech].printer !== re[l.tech].printer && (l.sel[l.tech].printer = re[l.tech].printer, 1),
    material: () => l.sel[l.tech].material !== re[l.tech].material && (l.sel[l.tech].material = re[l.tech].material, 1),
    tech: () => l.tech !== "fdm" && (Ve("fdm", !0), 1),
    source: () => l.source !== "model" && (Ge("model"), 1),
    qty: () => +l.part.qty != 1 && (l.part.qty = 1, 1),
    perPlate: () => +l.part.perPlate != 0 && (l.part.perPlate = 0, 1),
    post: () => +l.part.postMin !== mn.postMin && (l.part.postMin = mn.postMin, 1),
    minOn: () => l.part.minOn === !1 && (l.part.minOn = !0, 1),
    inserts: () => +l.part.inserts != 0 && (l.part.inserts = 0, 1),
    paint: () => l.part.paintOn && (l.part.paintOn = !1, 1),
    pack: () => l.part.packOn && (l.part.packOn = !1, 1),
    cad: () => +l.money.cadH != 0 && (l.money.cadH = 0, 1),
    deadline: () => l.money.deadline && (l.money.deadline = "", 1)
  };

  function Xe() {
    if (!Js) return;
    const t = ti();
    let e = !1;
    for (const n in Ha) {
      const a = t === "pro" ? null : ei(n, t);
      if (Ha[n].forEach(o => o.classList.toggle("vis-off", a === null ? !o._visDef.pro : !a)), a === !1 && ni[n] && !(t === "friend" && Jt)) try {
        ni[n]() && (e = !0)
      } catch {}
    }
    for (const n of Ws) {
      const a = f(n);
      if (!a || !a._visDef) continue;
      const o = [...a.querySelectorAll("[data-vis]")].some(s => !s.classList.contains("vis-off"));
      a.classList.toggle("vis-off", t === "pro" ? !a._visDef.pro : !o)
    }
    e && (Ne(), ft(), at()), Dn()
  }
  const ai = (t, e, n) => {
      const a = t && t[e];
      return a && typeof a[n] == "boolean" ? a[n] : se[e] ? se[e][n] : !0
    },
    jo = t => Object.values(t || {}).reduce((e, n) => e + Object.keys(n).length, 0);

  function Dn() {
    const t = f("visTable");
    if (!t) return;
    const e = St || l.vis || {},
      n = `<div class="vis-row vis-head"><span></span>${Vs.map(([,i])=>`<span>${i}</span>`).join("")}</div>`;
    t.innerHTML = n + Gs.map(i => `<div class="vis-g">${J(i.g)}</div>` + i.items.map(([r, c]) => `<div class="vis-row"><span class="vis-l">${J(c)}</span>${Vs.map(([d,u])=>{const p=ai(e,r,d),x=ai(l.vis,r,d);return`<label class="vis-c${p!==x?" ch":p!==se[r][d]?" mod":""}" title="${u}${p!==x?" · изменено, не сохранено":p!==se[r][d]?" · не как в стандартном виде":""}"><input type="checkbox" data-visk="${r}" data-visc="${d}" ${p?"checked":""} aria-label="${J(c)} — ${u}"></label>`}).join("")}</div>`).join("")).join("");
    const a = St && !Ot(St, l.vis || {}),
      o = jo(l.vis);
    f("visSave").disabled = f("visCancel").disabled = !a, f("visInfo").textContent = a ? "Есть несохранённые изменения" : "Всё сохранено", f("visInfo").classList.toggle("warn-text", !!a), ii("secVis", a ? "не сохранено" : "");
    const s = f("visPrevF");
    s && (s.classList.toggle("on", Jt), s.textContent = Jt ? "Выйти из просмотра «Друзья»" : "Посмотреть как «Друзья»")
  }

  function qo() {
    f("visTable") && (f("visTable").addEventListener("change", t => {
      const e = t.target,
        n = e.dataset.visk,
        a = e.dataset.visc;
      if (!n) return;
      St = st(St || l.vis || {});
      const o = St[n] = {
        ...St[n] || {}
      };
      e.checked === se[n][a] ? delete o[a] : o[a] = e.checked, Object.keys(o).length || delete St[n], Dn()
    }), f("visReset").onclick = () => {
      St = {}, Dn(), V("Подставили стандартный вид. Нажмите «Сохранить»")
    }, f("visSave").onclick = () => {
      St && (l.vis = St, St = null, Xe(), gt(), V("Сохранено. Чтобы изменения увидели все — «Опубликовать на сайт» в блоке «Цена»"))
    }, f("visCancel").onclick = () => {
      St = null, Dn(), V("Изменения отменены")
    }, f("visPrevF").onclick = t => {
      t.stopPropagation(), Jt = !Jt, document.body.classList.toggle("vis-prev", Jt), Xe(), loAsBar(), V(Jt ? "Так видят «Друзья» (по сохранённой настройке)" : "Обычный вид «Бизнеса»")
    })
  }
  const si = {
    secVis: !0,
    secEquip: !0,
    secCalib: !0
  };

  function ii(t, e) {
    const n = document.querySelector(`#${t} .col-sum`);
    n && (n.textContent = e ? "· " + e : "")
  }

  function Do() {
    for (const t in si) {
      const e = f(t);
      if (!e) continue;
      const n = e.querySelector(".card-h"),
        a = n && n.querySelector("h2");
      if (!a) continue;
      a.insertAdjacentHTML("beforeend", ' <span class="col-sum"></span>'), n.insertAdjacentHTML("afterbegin", '<button type="button" class="col-btn" aria-label="Свернуть или развернуть"><span>▸</span></button>'), n.classList.add("col-h");
      let o = si[t];
      try {
        const i = localStorage.getItem("fdmcalc.col." + t);
        i !== null && (o = i === "1")
      } catch {}
      const s = i => {
        e.classList.toggle("collapsed", i), n.querySelector(".col-btn").setAttribute("aria-expanded", i ? "false" : "true");
        try {
          localStorage.setItem("fdmcalc.col." + t, i ? "1" : "0")
        } catch {}
      };
      s(o), n.addEventListener("click", i => {
        i.target.closest("button:not(.col-btn), input, select, a, .eq-tabs") || s(!e.classList.contains("collapsed"))
      })
    }
    window.addEventListener("beforeunload", t => {
      (Ca() || St && !Ot(St, l.vis || {})) && (t.preventDefault(), t.returnValue = "")
    })
  }
  const _n = [
      ["auto", "Тема как в системе"],
      ["light", "Светлая тема"],
      ["dark", "Тёмная тема"]
    ],
    oi = {
      auto: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11" /><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor"/></svg>',
      light: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"/></svg>',
      dark: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1z"/></svg>'
    };

  function ri(t, e) {
    oi[t] || (t = "auto"), t === "auto" ? delete document.documentElement.dataset.theme : document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("fdmcalc.theme", t)
    } catch {}
    const n = f("btnTheme"),
      a = _n.find(o => o[0] === t)[1];
    n && (n.innerHTML = oi[t], n.title = a + " — нажмите, чтобы сменить", n.dataset.t = t), e && V(a), setTimeout(Yn, 0)
  }

  function _o() {
    let t = "auto";
    try {
      t = localStorage.getItem("fdmcalc.theme") || "auto"
    } catch {}
    ri(t), f("btnTheme").onclick = () => {
      const e = _n.findIndex(n => n[0] === (f("btnTheme").dataset.t || "auto"));
      ri(_n[(e + 1) % _n.length][0], !0)
    }
  }
  const No = "NeroArtNuar/Calculator-3d-printing",
    Ra = "fdmcalc.ghToken",
    li = () => {
      try {
        return localStorage.getItem(Ra) || ""
      } catch {
        return ""
      }
    };

  function Oa(t) {
    const e = !!li();
    xe("Ключ для публикации на сайт", `<p class="hint">Ключ разрешает калькулятору записывать только файл ставок в ваш репозиторий. Он хранится лишь в этом браузере: на сайт и в файл ставок не попадает.</p>
    <ol class="how"><li>Откройте <b>github.com/settings/personal-access-tokens/new</b> (вы должны быть в своём аккаунте).</li>
    <li>Token name — «Смета 3D», Expiration — 1 год.</li><li>Repository access → <b>Only select repositories</b> → <b>Calculator-3d-printing</b>.</li>
    <li>Permissions → Repository permissions → <b>Contents: Read and write</b>. Больше ничего не включайте.</li>
    <li>Нажмите <b>Generate token</b>, скопируйте ключ (начинается с github_pat_) и вставьте сюда.</li></ol>
    <label class="field"><span class="lbl">Ключ</span><span class="inp"><input id="ghTok" type="password" autocomplete="off" placeholder="${e?"ключ сохранён — вставьте новый, чтобы заменить":"github_pat_…"}"></span></label>
    <p class="hint">Если кто-то получит доступ к этому компьютеру, он сможет поменять ставки на сайте. Удалить ключ можно здесь же или на GitHub.</p>`, `${e?'<button class="btn danger" type="button" id="ghDel">Удалить ключ</button>':""}<div class="right"><button class="btn" type="button" id="dlgCancel">Отмена</button><button class="btn primary" type="button" id="ghOk">Сохранить</button></div>`), f("dlgCancel").onclick = Mt, f("ghDel") && (f("ghDel").onclick = () => {
      try {
        localStorage.removeItem(Ra)
      } catch {}
      Mt(), V("Ключ удалён из этого браузера")
    }), f("ghOk").onclick = () => {
      const n = (f("ghTok").value || "").trim();
      if (!n) {
        e ? (Mt(), t && t()) : V("Вставьте ключ");
        return
      }
      if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(n)) {
        V("Это не похоже на ключ GitHub: он начинается с github_pat_");
        return
      }
      try {
        localStorage.setItem(Ra, n)
      } catch {
        V("Браузер не дал сохранить ключ");
        return
      }
      Mt(), V("Ключ сохранён в этом браузере"), t && t()
    }
  }
  function loRateCheck() {
    const w = [],
      n = (x, d = 0) => S(+x || 0, d),
      out = (v, a, b) => !Number.isFinite(+v) || +v < a || +v > b;
    for (const p of l.printers) {
      if (p.off) continue;
      const k = p.name || "Принтер",
        big = p.tech === "sls" ? 15e3 : p.tech === "fdm" ? 1500 : 3e3,
        pmax = p.tech === "sls" ? 2e8 : 2e7;
      +p.price > 0 ? +p.price > pmax && w.push(`${k}: цена ${n(p.price)} ₽ — нет ли лишнего нуля?`) : w.push(`${k}: не указана цена принтера — амортизация будет 0`);
      out(p.life, 300, 1e5) && w.push(`${k}: ресурс ${n(p.life)} ч — обычно 3 000–20 000 ч`);
      +p.maint > 1e3 && w.push(`${k}: обслуживание ${n(p.maint)} ₽/ч — обычно до 100 ₽/ч`);
      +p.power > 0 ? +p.power > big && w.push(`${k}: средняя мощность ${n(p.power)} Вт — обычно до ${n(big)} Вт, нет ли лишнего нуля?`) : w.push(`${k}: мощность 0 Вт — электричество не посчитается`);
      +p.chamberPower > 3e3 && w.push(`${k}: мощность камеры ${n(p.chamberPower)} Вт — нет ли лишнего нуля?`)
    }
    for (const m of l.materials) {
      if (m.off) continue;
      const k = m.name || "Материал",
        r = m.tech === "resin",
        u = r ? "₽/л" : "₽/кг",
        [a, b] = r ? [500, 4e4] : m.tech === "sls" ? [500, 6e4] : [300, 12e3];
      +m.price > 0 ? out(m.price, a, b) && w.push(`${k}: цена ${n(m.price)} ${u} — обычно ${n(a)}–${n(b)} ${u}; если материал особый (PEEK и т. п.), всё в порядке`) : w.push(`${k}: не указана цена`);
      m.density != null && out(m.density, .8, 3) && w.push(`${k}: плотность ${n(m.density,2)} г/см³ — обычно 0,9–2`)
    }
    const M = l.money,
      B = l.blocks;
    +M.rate > 0 ? +M.rate > 2e4 && w.push(`Ставка работы ${n(M.rate)} ₽/ч — нет ли лишнего нуля?`) : B.labor && w.push("Ставка работы 0 ₽/ч — работа не посчитается");
    out(M.markup, 0, 1e3) && w.push(`Наценка ${n(M.markup)}% — проверьте`);
    +M.minOrder > 2e5 && w.push(`Минимальный заказ ${n(M.minOrder)} ₽ — нет ли лишнего нуля?`);
    B.tax && (+M.taxRev > 30 && w.push(`Налог ${n(M.taxRev)}% — обычно 4–15%`), +M.vat > 30 && w.push(`НДС ${n(M.vat)}% — проверьте`));
    B.energy && (+M.kwh > 0 ? +M.kwh > 50 && w.push(`Тариф ${n(M.kwh,1)} ₽/кВт·ч — обычно 3–15`) : w.push("Тариф на электричество 0 ₽ — электричество не посчитается"));
    B.risk && (+M.risk > 50 && w.push(`Резерв на брак ${n(M.risk)}% — проверьте`), +M.waste > 50 && w.push(`Запас на потери ${n(M.waste)}% — проверьте`));
    M.optOn && (M.opt || []).some(o => +o.d > 60) && w.push("Скидка за опт больше 60% — проверьте");
    return w
  }
  let loRcK = "";

  function loRateChk() {
    const b = f("ratesChk");
    if (!b) return;
    const w = loRateCheck(),
      k = w.join("|");
    if (k === loRcK) return;
    loRcK = k, b.hidden = !w.length, b.innerHTML = w.length ? `<p><b>Проверьте ставки перед публикацией (${w.length})</b> — клиенты сразу увидят цены с ними:</p><ul>${w.slice(0,12).map(x=>`<li>${J(x)}</li>`).join("")}${w.length>12?`<li>…и ещё ${w.length-12}</li>`:""}</ul>` : ""
  }
  async function ci() {
    const t = li();
    if (!t) {
      Oa(ci);
      return
    }
    {
      const w = loRateCheck(),
        e = f("ratesPub");
      if (w.length && !e.dataset.force) {
        loRcK = "", loRateChk(), f("ratesChk") && f("ratesChk").scrollIntoView({
          block: "center",
          behavior: "smooth"
        }), e.dataset.force = 1, e.textContent = "Опубликовать всё равно", V(`Похоже на опечатки в ставках: ${w.length}. Исправьте или нажмите «Опубликовать всё равно»`), setTimeout(() => {
          delete e.dataset.force, e.disabled || (e.textContent = "Опубликовать на сайт")
        }, 15e3);
        return
      }
      delete e.dataset.force
    }
    if (Ca() || St && !Ot(St, l.vis || {})) {
      V("Сначала сохраните таблицы «Принтеры и материалы» и «Что видят пользователи»");
      return
    }
    const e = f("ratesPub");
    e.disabled = !0, e.textContent = "Публикую…";
    const n = `https://api.github.com/repos/${No}/contents/rates.dat`,
      a = {
        Authorization: "Bearer " + t,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      o = s => s === 401 ? "ключ недействителен или истёк — создайте новый" : s === 403 ? "у ключа нет права записи (Contents: Read and write) или он не для репозитория smeta3d" : s === 404 ? "репозиторий не найден — проверьте, что ключ выдан для smeta3d" : "ошибка GitHub " + s;
    try {
      const s = btoa(xi($i()));
      for (let i = 0; i < 2; i++) {
        let r;
        const c = await fetch(n + "?ref=main", {
          headers: a,
          cache: "no-store"
        });
        if (c.ok) r = (await c.json()).sha;
        else if (c.status !== 404) throw new Error(o(c.status));
        const d = await fetch(n, {
          method: "PUT",
          headers: {
            ...a,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "Ставки обновлены из калькулятора",
            content: s,
            branch: "main",
            ...r ? {
              sha: r
            } : {}
          })
        });
        if (d.ok) {
          const u = f("ratesInfo");
          u && (u.textContent = `Опубликовано ${new Date().toLocaleString("ru-RU")}. Посетители увидят новые ставки в течение 5 минут`), V("Опубликовано. Через 1–5 минут все считают по новым ставкам");
          return
        }
        if (!(d.status === 409 || d.status === 422)) throw new Error(o(d.status))
      }
      throw new Error("GitHub не принял файл, попробуйте ещё раз")
    } catch (s) {
      const i = /Failed to fetch|NetworkError|Load failed/i.test(s.message) ? "нет связи с GitHub" + (typeof fe < "u" && fe ? "" : " — публикация работает на сайте neroartnuar.github.io/Calculator-3d-printing") : s.message;
      V("Не опубликовано: " + i), /недействителен|нет права/.test(i) && setTimeout(() => Oa(), 400)
    } finally {
      e.disabled = !1, e.textContent = "Опубликовать на сайт"
    }
  }

  function Bo() {
    f("ratesPub") && (f("ratesPub").onclick = ci, f("ratesKey").onclick = () => Oa())
  }
  let le = null;
  const di = t => {
    const e = [...t].sort((a, o) => a - o),
      n = e.length;
    return n ? n % 2 ? e[(n - 1) / 2] : (e[n / 2 - 1] + e[n / 2]) / 2 : NaN
  };
  async function Yo(t) {
    const e = t.name.split(".").pop().toLowerCase();
    return e === "stl" ? fs(await t.arrayBuffer()) : e === "obj" ? ms(await t.text()) : e === "3mf" ? (await ps(await t.arrayBuffer())).pos : null
  }
  async function Xo(t) {
    const e = new Map,
      n = d => d.toLowerCase().replace(/\.gcode\.3mf$/, "").replace(/\.(gcode|gco|stl|obj|3mf)$/, "");
    for (const d of t) {
      const u = d.name.toLowerCase(),
        p = n(d.name),
        x = e.get(p) || {};
      /\.(gcode|gco)$/.test(u) ? x.gc = d : /\.(stl|obj|3mf)$/.test(u) && !/\.gcode\.3mf$/.test(u) && (x.model = d), e.set(p, x)
    }
    const a = [...e.entries()].filter(([, d]) => d.gc && d.model),
      o = [...e.entries()].filter(([, d]) => !(d.gc && d.model)).map(([d]) => d);
    if (!a.length) {
      V("Нужны пары с одинаковым именем: деталь.stl + деталь.gcode");
      return
    }
    l.tech !== "fdm" && Ve("fdm", !0);
    const s = st(l.slicer),
      i = ht(),
      r = Ct(),
      c = [];
    try {
      for (let d = 0; d < a.length; d++) {
        const [u, p] = a[d];
        it(!0, `Сверка ${d+1} из ${a.length}: ${p.model.name}`), await kt();
        const x = await Ba(p.gc),
          m = await Yo(p.model);
        if (!m || m.length < 9 || !(x.grams > 0)) {
          c.push({
            name: p.model.name,
            bad: "нет веса в G-code или модель пустая"
          });
          continue
        }
        Zt.noAuto = !0;
        try {
          await Zt(m, p.model.name)
        } finally {
          Zt.noAuto = !1
        }
        const pm = fi(x.model) || fi(x.printer),
          pp = pm ? yn("fdm").filter(q => !q.off).find(q => {
            const z = fi(q.name);
            return z && (pm.includes(z) || z.includes(pm))
          }) : i,
          ft0 = (x.filaments[0] || {}).type || "",
          mm = ft0 ? gn("fdm").find(q => fi(q.name) === fi(ft0)) || gn("fdm").find(q => fi(q.name).startsWith(fi(ft0))) : null,
          R = mm || r;
        l.sel.fdm.printer = (pp || i).id, l.sel.fdm.material = R.id;
        const L = x.settings || {};
        Object.assign(l.slicer, s, {
          layer: L.layer || s.layer,
          walls: L.walls || s.walls,
          infill: L.infill ?? s.infill,
          top: L.top || s.top,
          bottom: L.bottom || s.bottom,
          nozzle: L.nozzle || s.nozzle,
          supports: L.supports ? "auto" : "off"
        });
        const P = ua();
        if (!P) {
          c.push({
            name: p.model.name,
            bad: "калькулятор не смог оценить модель"
          });
          continue
        }
        const M = L.modelS || x.machineS,
          E = x.filaments[0] && x.filaments[0].density || R.density,
          k = x.grams / E,
          g = P.gramsRaw / R.density;
        c.push({
          name: p.model.name,
          gGrams: x.grams,
          gT: M,
          eGrams: P.grams / R.density * E,
          eT: P.timeS,
          rT: M && P.timeRaw ? M / P.timeRaw : NaN,
          rM: g > 0 ? k / g : NaN,
          set: `слой ${l.slicer.layer}, стенки ${l.slicer.walls}, заполнение ${l.slicer.infill}%${L.supports?", поддержки":""}`,
          printer: x.printer || x.model || "",
          pid: pp ? pp.id : null,
          pname: (pp || i).name,
          assumed: !pm,
          mid: mm ? mm.id : null,
          mname: R.name,
          ftype: ft0,
          tc0: (pp || i).timeCal || 1,
          mk0: +R.massK || 1
        })
      }
    } catch (d) {
      console.error(d), V("Сверка прервалась: " + (d.message || d))
    } finally {
      Object.assign(l.slicer, s), l.sel.fdm.printer = i.id, l.sel.fdm.material = r.id, it(!1), ft(), at()
    }
    le = {
      rows: c,
      lone: o,
      printer: i.name,
      at: Date.now(),
      tc0: i.timeCal || 1,
      mc0: l.massCal.fdm || 1
    }, ui()
  }

  function ui() {
    const t = f("calibOut");
    if (!t) return;
    if (!le) {
      t.innerHTML = "";
      return
    }
    const e = le.rows.filter(u => !u.bad),
      r = (u, p) => {
        const x = (u / p - 1) * 100;
        return `<span class="${Math.abs(x)<=5?"ok-text":Math.abs(x)<=15?"warn-text":"bad-text"}">${x>0?"+":""}${S(x,0)}%</span>`
      },
      cl = (v, a, b) => Math.min(b, Math.max(a, v)),
      P = {},
      M = {};
    for (const u of e) u.pid && Number.isFinite(u.rT) && (P[u.pid] = P[u.pid] || []).push(u.rT), u.mid && Number.isFinite(u.rM) && (M[u.mid] = M[u.mid] || []).push(u.rM);
    const tp = Object.entries(P).map(([d, v]) => {
        const p = l.printers.find(q => q.id === d);
        return p && {
          p,
          v: cl(di(v), .25, 4),
          n: v.length
        }
      }).filter(Boolean),
      tm = Object.entries(M).map(([d, v]) => {
        const m = l.materials.find(q => q.id === d);
        return m && {
          m,
          v: cl(di(v) / (l.massCal.fdm || 1), .4, 2.5),
          n: v.length
        }
      }).filter(Boolean),
      pf = u => {
        const p = l.printers.find(q => q.id === u.pid);
        return p ? (p.timeCal || 1) / u.tc0 : 1
      },
      mf = u => {
        const m = l.materials.find(q => q.id === u.mid);
        return m ? (+m.massK || 1) / u.mk0 : 1
      },
      miss = e.filter(u => !u.pid),
      asm = e.filter(u => u.pid && u.assumed),
      mmiss = e.filter(u => !u.mid),
      dn = (n, a, b) => n === 1 ? a : b,
      ok = tp.every(x => Math.abs((x.p.timeCal || 1) - x.v) < .005) && tm.every(x => Math.abs((+x.m.massK || 1) - x.v) < .005);
    t.innerHTML = '<div class="cal-t"><div class="cal-r cal-h"><span>Модель</span><span>Вес: слайсер / калькулятор</span><span>Время: слайсер / калькулятор</span></div>' + le.rows.map(u => u.bad ? `<div class="cal-r"><span>${J(u.name)}</span><span class="bad-text" style="grid-column:span 2">${J(u.bad)}</span></div>` : `<div class="cal-r"><span>${J(u.name)}<small>${J(u.pname)}${u.pid?"":" (нет в мастерской)"} · ${J(u.mname)} · ${J(u.set)}</small></span><span>${S(u.gGrams,1)} / ${S(u.eGrams*mf(u),1)} г ${r(u.eGrams*mf(u),u.gGrams)}</span><span>${vt(u.gT)} / ${vt(u.eT*pf(u))} ${r(u.eT*pf(u),u.gT)}</span></div>`).join("") + "</div>" + (le.lone.length ? `<p class="hint">Без пары: ${le.lone.map(J).join(", ")}. У модели и G-code должно быть одинаковое имя.</p>` : "") + (miss.length ? `<p class="hint warn-text">Принтера из G-code (${[...new Set(miss.map(u=>u.printer))].map(J).join(", ")}) нет среди принтеров мастерской — поправка времени для ${miss.length} ${dn(miss.length,"детали","деталей")} не предлагается. Добавьте такой принтер или сверяйте по G-code своих принтеров.</p>` : "") + (asm.length ? `<p class="hint warn-text">В G-code не указан принтер — для ${asm.length} ${dn(asm.length,"детали","деталей")} считали на «${J(asm[0].pname)}».</p>` : "") + (mmiss.length ? `<p class="hint warn-text">Материал из G-code (${[...new Set(mmiss.map(u=>u.ftype||"не указан"))].map(J).join(", ")}) не найден среди материалов — вес сверен по плотности из G-code, поправка веса не предлагается.</p>` : "") + (tp.length || tm.length ? `<div class="cal-sum"><div>Поправки (медиана по деталям):<br>${tp.map(x=>`время «${J(x.p.name)}» ×${S(x.p.timeCal||1,2)} → <b>×${S(x.v,2)}</b> (${x.n} ${loPl(x.n,"деталь","детали","деталей")})`).join("<br>")}${tp.length&&tm.length?"<br>":""}${tm.map(x=>`вес «${J(x.m.name)}» ×${S(+x.m.massK||1,2)} → <b>×${S(x.v,2)}</b> (${x.n} ${loPl(x.n,"деталь","детали","деталей")})`).join("<br>")}</div>
      ${ok?'<b class="ok-text">Поправки применены ✓</b>':'<button type="button" class="btn small primary" id="calibApply">Применить поправки</button>'}</div>
      <p class="hint">${e.length<3?"Для надёжной поправки загрузите 3–5 разных деталей. ":""}Поправка времени — для принтера из G-code, поправка веса — для материала из G-code. После применения нажмите «Опубликовать на сайт», чтобы поправки заработали у всех.</p>` : "");
    const d = f("calibApply");
    d && (d.onclick = () => {
      for (const x of tp) x.p.timeCal = x.v;
      for (const x of tm) x.m.massK = x.v;
      ue(), gt(), ui(), V("Поправки применены: " + [...tp.map(x => `время «${x.p.name}» ×${S(x.v,2)}`), ...tm.map(x => `вес «${x.m.name}» ×${S(x.v,2)}`)].join(", "))
    })
  }
  const fi = t => String(t || "").toLowerCase().replace(/[^0-9a-zа-я]/g, "");

  function Uo() {
    const t = f("calibFiles");
    t && (t.onchange = () => {
      const e = [...t.files];
      t.value = "", e.length && Xo(e)
    })
  }
  const mi = () => {
      try {
        return matchMedia("(pointer: coarse)").matches || innerWidth < 760
      } catch {
        return !1
      }
    },
    za = () => mi() ? {
      tris: 6e5,
      bytes: 4e7,
      other: 6e7,
      target: 3e5
    } : {
      tris: 25e5,
      bytes: 15e7,
      other: 2e8,
      target: 9e5
    },
    Zo = t => S(t / 1048576, t < 10485760 ? 1 : 0) + " МБ";
  async function Vo(t) {
    const e = new Uint8Array(await t.slice(0, Math.min(t.size, 512)).arrayBuffer()),
      n = new TextDecoder().decode(e),
      a = t.size >= 84 ? new DataView(e.buffer).getUint32(80, !0) : 0;
    return 84 + a * 50 === t.size ? {
      binary: !0,
      tris: a
    } : /^\s*solid/i.test(n) && /facet|endsolid/i.test(n) ? {
      binary: !1,
      tris: Math.round(t.size / 260)
    } : {
      binary: !0,
      tris: Math.floor((t.size - 84) / 50)
    }
  }

  function pi(t, e) {
    const n = za(),
      a = mi(),
      o = e && e.binary,
      s = e && e.tris > n.tris * 4;
    return new Promise(i => {
      let r = !1;
      const c = u => {
        r || (r = !0, clearInterval(d), Mt(), i(u))
      };
      xe("Большая модель", `<p><b>${J(t.name)}</b>: ${Zo(t.size)}${e?`, около ${S(e.tris)} треугольников`:""}.</p>
      <p class="hint">${a?"На телефоне браузер такую модель, скорее всего, не откроет.":"Браузер будет открывать её долго и может зависнуть."}
      ${o?`Для расчёта цены хватит упрощённой копии — около ${S(n.target)} треугольников. Объём и вес меняются меньше чем на 1%, файл на диске не меняется.`:e?"Это текстовый STL: сохраните модель как двоичный STL — он в 5 раз меньше и откроется с упрощением.":"Если браузер зависнет, уменьшите модель в слайсере или CAD (упрощение сетки, «Decimate»)."}</p>`, `<div class="right"><button class="btn" type="button" id="bigNo">Отмена</button>${a&&s?"":`<button class="btn${o?"":" primary"}" type="button" id="bigRaw">Открыть как есть</button>`}${o?'<button class="btn primary" type="button" id="bigSimp">Упростить и открыть</button>':""}</div>`), f("bigNo").onclick = () => c("cancel"), f("bigRaw") && (f("bigRaw").onclick = () => c("raw")), f("bigSimp") && (f("bigSimp").onclick = () => c("simplify"));
      const d = setInterval(() => {
        f("dlg").hidden && c("cancel")
      }, 250)
    })
  }
  async function hi(t) {
    const e = t.name.split(".").pop().toLowerCase(),
      n = za();
    if (e !== "stl") return t.size > n.other ? pi(t, null) : "ok";
    const a = await Vo(t);
    return a.tris <= n.tris && t.size <= n.bytes ? "ok" : pi(t, a)
  }
  async function Go(t) {
    const e = za(),
      n = Math.floor((t.size - 84) / 50),
      a = 2e5,
      o = async (v, h) => {
        for (let C = 0; C < n; C += a) {
          const F = Math.min(n, C + a),
            w = new DataView(await t.slice(84 + C * 50, 84 + F * 50).arrayBuffer());
          for (let T = 0, q = 12; T < F - C; T++, q += 50) h(w, q);
          it(!0, `${v}: ${Math.round(F/n*100)}%`), await kt()
        }
      };
    let s = 1 / 0,
      i = 1 / 0,
      r = 1 / 0,
      c = -1 / 0,
      d = -1 / 0,
      u = -1 / 0,
      p = 0;
    await o("Упрощаю модель, шаг 1 из 2", (v, h) => {
      const C = v.getFloat32(h, !0),
        F = v.getFloat32(h + 4, !0),
        w = v.getFloat32(h + 8, !0),
        T = v.getFloat32(h + 12, !0),
        q = v.getFloat32(h + 16, !0),
        Y = v.getFloat32(h + 20, !0),
        I = v.getFloat32(h + 24, !0),
        R = v.getFloat32(h + 28, !0),
        X = v.getFloat32(h + 32, !0);
      if (!Number.isFinite(C + F + w + T + q + Y + I + R + X)) return;
      s = Math.min(s, C, T, I), i = Math.min(i, F, q, R), r = Math.min(r, w, Y, X), c = Math.max(c, C, T, I), d = Math.max(d, F, q, R), u = Math.max(u, w, Y, X);
      const U = T - C,
        Z = q - F,
        A = Y - w,
        O = I - C,
        _ = R - F,
        z = X - w;
      p += Math.hypot(Z * z - A * _, A * O - U * z, U * _ - Z * O) / 2
    });
    const x = Math.max(1e-4, Math.sqrt(2 * p / e.target)),
      m = Math.ceil((c - s) / x) + 2,
      L = Math.ceil((d - i) / x) + 2,
      P = new Map;
    let M = new Float64Array(3 * 65536),
      E = new Uint32Array(65536),
      k = 0,
      g = new Int32Array(3 * 65536),
      y = 0;
    const b = new Set,
      $ = (v, h, C) => {
        const F = Math.floor((v - s) / x) + m * (Math.floor((h - i) / x) + L * Math.floor((C - r) / x));
        let w = P.get(F);
        if (w === void 0 && (w = k++, P.set(F, w), k > E.length)) {
          const T = new Float64Array(M.length * 2);
          T.set(M), M = T;
          const q = new Uint32Array(E.length * 2);
          q.set(E), E = q
        }
        return M[3 * w] += v, M[3 * w + 1] += h, M[3 * w + 2] += C, E[w]++, w
      };
    await o("Упрощаю модель, шаг 2 из 2", (v, h) => {
      const C = v.getFloat32(h, !0),
        F = v.getFloat32(h + 4, !0),
        w = v.getFloat32(h + 8, !0),
        T = v.getFloat32(h + 12, !0),
        q = v.getFloat32(h + 16, !0),
        Y = v.getFloat32(h + 20, !0),
        I = v.getFloat32(h + 24, !0),
        R = v.getFloat32(h + 28, !0),
        X = v.getFloat32(h + 32, !0);
      if (!Number.isFinite(C + F + w + T + q + Y + I + R + X)) return;
      const U = $(C, F, w),
        Z = $(T, q, Y),
        A = $(I, R, X);
      if (U === Z || Z === A || U === A) return;
      const O = U < Z && U < A ? U + "," + Z + "," + A : Z < A ? Z + "," + A + "," + U : A + "," + U + "," + Z;
      if (!b.has(O)) {
        if (b.add(O), 3 * (y + 1) > g.length) {
          const _ = new Int32Array(g.length * 2);
          _.set(g), g = _
        }
        g[3 * y] = U, g[3 * y + 1] = Z, g[3 * y + 2] = A, y++
      }
    }), it(!0, "Собираю упрощённую модель…"), await kt();
    const j = new Float32Array(y * 9);
    for (let v = 0; v < y; v++)
      for (let h = 0; h < 3; h++) {
        const C = g[3 * v + h],
          F = E[C];
        j[v * 9 + h * 3] = M[3 * C] / F, j[v * 9 + h * 3 + 1] = M[3 * C + 1] / F, j[v * 9 + h * 3 + 2] = M[3 * C + 2] / F
      }
    return it(!1), j
  }

  function loAcc() {
    const b = f("btnLogout");
    b && (b.hidden = l.access === "none", b.textContent = ({
      staff: "Сотрудник",
      pro: "Владелец",
      friend: "Друзья"
    } [l.access] || "") + " · Выйти");
    const k = f("lnkLogin");
    k && (k.hidden = l.access !== "none")
  }

  function loFixSel() {
    for (const t of ee) {
      const e = l.printers.filter(a => a.tech === t),
        n = l.materials.filter(a => a.tech === cn(t));
      e.some(a => a.id === l.sel[t].printer) || (l.sel[t].printer = (e[0] || {}).id), n.some(a => a.id === l.sel[t].material) || (l.sel[t].material = (n[0] || {}).id)
    }
  }

  function loFrSave() {
    l.access === "friend" && nt.set("fr.state", {
      printers: l.printers,
      materials: l.materials,
      money: Se(l.money, ke),
      sla: Se(l.sla, Ee),
      sls: Se(l.sls, ["share", "fill"]),
      blocks: l.blocks,
      massCal: l.massCal,
      at: Date.now()
    })
  }

  function loFrLoad() {
    const q = nt.get("fr.state", null);
    if (!q || !Array.isArray(q.printers) || !Array.isArray(q.materials)) return !1;
    l.printers = st(q.printers), l.materials = st(q.materials), Object.assign(l.money, st(q.money || {})), Object.assign(l.sla, st(q.sla || {})), Object.assign(l.sls, st(q.sls || {})), q.blocks && (l.blocks = st(q.blocks)), q.massCal && (l.massCal = st(q.massCal)), loFixSel();
    return !0
  }

  function loOut() {
    const wf = l.access === "friend";
    Wa("none"), wf && (() => {
      for (const t of ["printers", "materials", "vis", "blocks", "massCal"]) nt.del(t + ".d"), nt.del(t);
      tr()
    })(), Ue("simple"), Ze(), ue(), V("Вы вышли из режима мастерской")
  }

  function loWs(on) {
    document.body.classList.toggle("ws", !!on && l.mode === "pro");
    const b = f("btnWs");
    b && (b.textContent = document.body.classList.contains("ws") ? "← К расчёту" : "Настройки мастерской")
  }

  function Ue(t) {
    setTimeout(Yn, 0), setTimeout(loAcc, 0), setTimeout(() => loWs(document.body.classList.contains("ws")), 0);
    const e = l.mode;
    l.mode = ["simple", "adv", "staff", "pro"].includes(t) ? t : "simple", l.mode === "pro" && l.access !== "pro" && l.access !== "friend" && (l.mode = l.access === "staff" ? "staff" : "adv"), l.mode === "staff" && l.access === "none" && (l.mode = "adv"), l.mode === "staff" && l.access === "friend" && (l.mode = "pro");
    const n = document.querySelector('#modeSeg [data-mode="pro"]');
    n && (n.hidden = l.access !== "pro" && l.access !== "friend", n.textContent = l.access === "friend" ? "Друзья" : "Бизнес"), document.body.classList.toggle("friend", l.access === "friend");
    const a = document.querySelector('#modeSeg [data-mode="staff"]');
    a && (a.hidden = l.access === "none" || l.access === "friend"), e !== l.mode && typeof lt < "u" && f("estBox").innerHTML && qs();
    for (const o of ["simple", "adv", "staff", "pro"]) document.body.classList.toggle("mode-" + o, l.mode === o);
    try {
      vi()
    } catch (o) {}
    document.body.classList.toggle("money", l.mode === "staff" || l.mode === "pro"), e !== l.mode && typeof rn < "u" && setTimeout(() => at(), 0), e && e !== l.mode && l.mode === "simple" && typeof H < "u" && H && !G && setTimeout(Bn, 60), document.querySelectorAll("#modeSeg button").forEach(o => o.classList.toggle("on", o.dataset.mode === l.mode)), l.mode !== "pro" && (Ca() || St) && setTimeout(() => V("В «Бизнесе» остались несохранённые изменения таблиц"), 300), l.mode !== "pro" && Jt && (Jt = !1, document.body.classList.remove("vis-prev")), Xe()
  }
  const bi = {
    value: .2
  };

  function Ia(t) {
    try {
      if (!Yt || !Yt.capabilities || !Yt.capabilities.isWebGL2) return t
    } catch {
      return t
    }
    return t.onBeforeCompile = e => {
      e.uniforms.uLayerH = bi, e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>
varying float vLY;`).replace("#include <begin_vertex>", `#include <begin_vertex>
vLY = (modelMatrix * vec4(transformed, 1.0)).y;`), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>
varying float vLY;
uniform float uLayerH;`).replace("#include <color_fragment>", `#include <color_fragment>
{ float q = vLY/max(uLayerH, 0.01); float w = fwidth(q); float band = 0.5 + 0.5*cos(6.2831853*q); diffuseColor.rgb *= mix(0.80 + 0.20*band, 0.90, clamp(w*1.8, 0.0, 1.0)); }`)
    }, t.needsUpdate = !0, t
  }

  function Wo() {
    ct && Ia(ct.material), ct && G && xt && (ct.position.z = G.lift), qt !== null && Gt()
  }

  function Nn() {
    const t = f("optRows");
    if (!t) return;
    const e = document.activeElement;
    if (e && e.dataset && e.dataset.opt != null) return;
    const n = l.money;
    n.opt = (n.opt || []).filter(Boolean), t.innerHTML = n.opt.map((a, o) => `<div class="opt-row"><span class="rot-l">от</span><span class="inp sm"><input type="number" min="1" step="1" data-opt="${o}" data-f="q" value="${a.q}" aria-label="Порог, шт"><em>шт</em></span><span class="rot-l">скидка</span><span class="inp sm"><input type="number" min="0" max="90" step="1" data-opt="${o}" data-f="d" value="${a.d}" aria-label="Скидка, %"><em>%</em></span><button type="button" class="tp-x" data-optdel="${o}" aria-label="Удалить порог">×</button></div>`).join("") || '<small class="cap">Порогов нет</small>'
  }
  async function Bn() {
    if (!H || !H.st) return;
    const t = tt.has(l.tech);
    if (!(!t && l.slicer.supports === "off")) {
      if (!t && !(H.st.overProj > 25)) {
        G && je(!0);
        return
      }
      await qe(t ? "hybrid" : Xt[l.slicer.supportType] ? l.slicer.supportType : "tree")
    }
  }
  let ja = !1;
  async function yi(t) {
    if (!(!t && l.mode !== "simple" || !H || ja)) {
      ja = !0;
      try {
        const P0 = new Float32Array(H.pos),
          H0 = H;
        if (await Sa(!0), l.mode !== "simple") return;
        await Bn();
        const tx = G && G.n ? `Повернули модель выгодно, поддержки построены (${G.fdm?Xt[G.type].toLowerCase():"гибридные"})` : "Повернули модель выгодно: поддержки не нужны";
        f("autoOrientT").textContent = tx, f("autoOrient").hidden = !1, f("autoOrientUndo").onclick = async () => {
          if (H !== H0) return;
          f("autoOrient").hidden = !0, G && je(!0), H.pos.set(P0), await Wt(), V("Положение — как в файле")
        }
      } catch (e) {
        console.error(e)
      } finally {
        ja = !1
      }
    }
  }

  function gi() {
    const t = l.money.presets || [];
    f("mkPresets").innerHTML = t.map((n, a) => `<button type="button" data-mk="${a}" class="${+n.v==+l.money.markup?"on":""}">${J(n.n)} ${n.v}%</button>`).join("");
    f("mkPresets2") && (f("mkPresets2").innerHTML = f("mkPresets").innerHTML);
    const e = document.activeElement;
    e && e.dataset && e.dataset.pre != null || (f("mkEdit").innerHTML = t.map((n, a) => `<span class="inp"><input type="text" data-pre="${a}" data-f="n" value="${J(n.n)}" aria-label="Название кнопки ${a+1}"></span><span class="inp"><input type="number" min="0" step="5" data-pre="${a}" data-f="v" value="${n.v}" aria-label="Наценка кнопки ${a+1}"><em>%</em></span>`).join(""))
  }

  function Yn() {
    document.documentElement.dataset.pal = "grad";
    const t = [...document.querySelectorAll(".card, .sum")].filter(e => e.offsetParent !== null || e.classList.contains("sum")),
      b = loHS(l.money.brand),
      h0 = b ? b[0] - 30 : 150,
      w = b ? 60 : 130;
    document.querySelectorAll(".card, .sum").forEach(e => e.style.removeProperty("--h")), t.forEach((e, n) => e.style.setProperty("--h", Math.round(h0 + w * n / Math.max(1, t.length - 1))))
  }

  function loHS(x) {
    const m = /^#([0-9a-f]{6})$/i.exec(String(x || "").trim());
    if (!m) return null;
    const [r, g, b] = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255),
      M = Math.max(r, g, b),
      n = Math.min(r, g, b),
      d = M - n,
      L = (M + n) / 2,
      S = d ? d / (1 - Math.abs(2 * L - 1)) : 0;
    let h = 0;
    d && (h = M === r ? (g - b) / d % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4);
    return [Math.round((h * 60 + 360) % 360), Math.round(S * 100)]
  }
  let loBK = null;

  function loBrand() {
    const m = l.money,
      k = (m.brand || "") + "|" + (m.logo || "").length + "|" + (m.shopName || "") + "|" + !!m.logoBg;
    if (k === loBK) return;
    loBK = k;
    const r = document.documentElement,
      b = loHS(m.brand);
    b ? (r.style.setProperty("--h", b[0]), r.style.setProperty("--sat", Math.max(35, Math.min(75, b[1])) + "%"), r.dataset.brand = "1") : (r.style.removeProperty("--h"), r.style.removeProperty("--sat"), delete r.dataset.brand);
    const br = document.querySelector(".top .brand"),
      lg = f("brandLogo"),
      h1 = br && br.querySelector("h1");
    if (br) {
      br.classList.toggle("has-logo", !!m.logo), br.classList.toggle("logo-bg", !!m.logoBg), lg && (lg.hidden = !m.logo, m.logo ? lg.src = m.logo : lg.removeAttribute("src"));
      const nm = (m.shopName || "").trim();
      h1 && (h1.textContent = nm || "Смета 3D-печати", h1.title = nm ? "Смета 3D-печати" : "")
    }
    const pv = f("logoPrev"),
      dl = f("logoDel"),
      cl = f("brandClr"),
      cd = f("brandDel");
    f("logoBgChk") && (f("logoBgChk").checked = !!m.logoBg, f("logoBgChk").closest("label").hidden = !m.logo), pv && (pv.hidden = !m.logo, m.logo ? pv.src = m.logo : pv.removeAttribute("src")), dl && (dl.hidden = !m.logo), cl && (cl.value = b ? m.brand : "#2f8fb0"), cd && (cd.hidden = !b);
    try {
      Yn(), typeof Ko == "function" && Ko()
    } catch {}
  }

  function loLogo(file) {
    if (!file) return;
    if (file.size > 5e6) return V("Файл больше 5 МБ — выберите картинку поменьше");
    const u = URL.createObjectURL(file),
      im = new Image;
    im.onload = () => {
      const k = Math.min(1, 240 / im.naturalWidth, 80 / im.naturalHeight) || 1,
        c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(im.naturalWidth * k)), c.height = Math.max(1, Math.round(im.naturalHeight * k)), c.getContext("2d").drawImage(im, 0, 0, c.width, c.height), URL.revokeObjectURL(u);
      let d = c.toDataURL("image/png");
      for (const q of [.9, .8, .65]) {
        if (d.length <= 4e4) break;
        const w = c.toDataURL("image/webp", q);
        w.length < d.length && (d = w)
      }
      Us("money.logo", d), gt(), at(), V("Логотип сохранён. Он появится в шапке и КП")
    }, im.onerror = () => {
      URL.revokeObjectURL(u), V("Не получилось открыть картинку. Подойдут PNG, JPG, WEBP или SVG")
    }, im.src = u
  }

  function loBrandInit() {
    const lf = f("logoFile");
    lf && lf.addEventListener("change", () => {
      loLogo(lf.files && lf.files[0]), lf.value = ""
    }), f("logoBgChk") && f("logoBgChk").addEventListener("change", e => {
      Us("money.logoBg", e.target.checked), gt(), at()
    }), f("logoDel") && f("logoDel").addEventListener("click", () => {
      Us("money.logo", ""), gt(), at()
    }), f("brandClr") && f("brandClr").addEventListener("input", e => {
      Us("money.brand", e.target.value), gt(), at()
    }), f("brandDel") && f("brandDel").addEventListener("click", () => {
      Us("money.brand", ""), gt(), at()
    })
  }

  const loTH = {
    fdm: 28,
    sla: 265,
    dlp: 285,
    lcd: 245,
    sls: 175
  };

  const loCol = [
    ["", "Любой", ""],
    ["white", "Белый", "#ecece6"],
    ["black", "Чёрный", "#2a2c30"],
    ["grey", "Серый", "#8a9096"],
    ["red", "Красный", "#c8312b"],
    ["orange", "Оранжевый", "#e57a1f"],
    ["yellow", "Жёлтый", "#e8c21a"],
    ["green", "Зелёный", "#3a9a4a"],
    ["blue", "Синий", "#2b5fb8"],
    ["clear", "Прозрачный", "#cfe3ea"]
  ];

  function loColName() {
    const c = loCol.find(x => x[0] === (l.part.color || ""));
    return c && c[0] ? c[1] : ""
  }
  let loColK = null;

  function loColRender() {
    const w = f("colorSw");
    if (!w) return;
    const k = (l.part.color || "") + "|" + l.tech;
    if (k === loColK) return;
    loColK = k, w.innerHTML = loCol.map(([id, nm, hx]) => `<button type="button" role="radio" class="sw-b${(l.part.color||"")===id?" on":""}${id?"":" any"}" data-col="${id}" aria-checked="${(l.part.color||"")===id}" title="${nm}" aria-label="${nm}" ${hx?`style="--sw:${hx}"`:""}>${id?"":"любой"}</button>`).join(""), f("colorName") && (f("colorName").textContent = loColName())
  }

  function loColInit() {
    const w = f("colorSw");
    w && w.addEventListener("click", e => {
      const b = e.target.closest("[data-col]");
      b && (l.part.color = b.dataset.col, gt(), loColK = null, loColRender(), ge(), at())
    }), loColRender()
  }

  function Ko() {
    const cx = (loCol.find(x => x[0] === (l.part.color || "")) || [])[2];
    if (cx) return [1, 3, 5].map(i => parseInt(cx.slice(i, i + 2), 16) / 255);
    const t = (loTH[l.tech] ?? 205) / 360,
      e = l.tech === "sls" ? .3 : .5,
      n = .62,
      a = o => {
        const s = (o + t * 12) % 12,
          i = e * Math.min(n, 1 - n);
        return n - i * Math.max(-1, Math.min(s - 3, 9 - s, 1))
      };
    return [a(0), a(8), a(4)]
  }

  function Ze() {
    f("strip").innerHTML = '<span class="lbl">В расчёте:</span>' + Ua.map(t => `<button type="button" class="tg" data-blk="${t.k}" aria-pressed="${l.blocks[t.k]?"true":"false"}" title="${t.d}">${t.l}</button>`).join(""), document.querySelectorAll("[data-block]").forEach(t => t.classList.toggle("blk-off", !t.dataset.block.split(/\s+/).some(e => l.blocks[e]))), Yn()
  }

  function vi() {
    const t = tt.has(l.tech);
    t && (l.resinSub = l.tech), document.querySelectorAll("#techMain [data-main]").forEach(a => a.classList.toggle("on", a.dataset.main === (t ? "resin" : l.tech))), document.querySelectorAll("#techSub [data-sub]").forEach(a => a.classList.toggle("on", a.dataset.sub === l.tech || a.dataset.sub === "sla" && tt.has(l.tech) && l.mode === "simple"));
    const e = f("techSubNote");
    e && (e.textContent = l.tech === "fdm" ? "FDM: деталь наплавляется слоями из пластиковой нити. Для прочных функциональных деталей и крупных изделий." : l.tech === "lcd" ? "ЖК-экран засвечивает слой целиком (MSLA): быстро и недорого, время зависит от высоты стола." : l.tech === "dlp" ? "Проектор засвечивает слой целиком: время зависит от высоты, а не от числа деталей." : l.tech === "sls" ? "SLS: лазер спекает порошок слой за слоем, поддержки не нужны — детали плавают в порошке. Цена зависит от высоты запуска и плотности упаковки камеры." : "Лазер обводит каждое сечение: время растёт с площадью и числом деталей. Ванна большая — промышленные детали."), f("techSeg").style.setProperty("--i", ee.indexOf(l.tech)), document.querySelectorAll("#techSeg button").forEach(a => {
      const o = a.dataset.tech === l.tech;
      a.setAttribute("aria-checked", o ? "true" : "false"), a.tabIndex = o ? 0 : -1
    }), document.querySelectorAll("[data-tech]:not(#techSeg button)").forEach(a => a.classList.toggle("tech-off", !a.dataset.tech.split(/\s+/).includes(l.tech)));
    const n = tt.has(l.tech);
    f("manAmtLbl").textContent = n ? "Смола на 1 шт" : "Пластик на 1 шт (из слайсера)", f("manAmtUnit").textContent = n ? "мл" : "г", f("manTimeLbl").textContent = n ? "Время печати стола" : "Время 1 шт", f("postLbl").textContent = l.tech === "sls" ? "Пескоструй, покраска 1 шт" : n ? "Снятие поддержек 1 шт" : "Постобработка 1 шт"
  }

  function Ve(t, e) {
    !Nt[t] || !ee.includes(t) || (tt.has(t) !== tt.has(l.tech) && je(!0), setTimeout(() => {
      Ft(), Hn()
    }, 0), l.tech = t, vi(), Ge(l.source), Ne(), Ln(), ge(), Me(), ft(), Sn(), e || at(), l.mode === "simple" && H && setTimeout(Bn, 50))
  }

  function Ge(t) {
    l.source = t === "manual" ? "manual" : t === "orca" && dt ? "orca" : "model";
    const e = kn(),
      n = Ae(),
      a = e ? "manual" : n ? "orca" : "model";
    document.querySelectorAll("#srcSeg button").forEach(o => o.classList.toggle("on", o.dataset.src === a)), f("srcModel").hidden = a !== "model", f("srcManual").hidden = a !== "manual", f("srcOrca").hidden = a !== "orca", n && ce(), H && f("pillName") && (f("pillName").textContent = kn() && loGc ? `Расчёт по G-code: ${loGc} · модель на экране не используется` : H.name)
  }

  function Jo() {
    const t = l.money,
      e = Math.max(0, +(K.money.mgrTol ?? t.mgrTol) || 0),
      n = Number.isFinite(+t.baseMarkup) && t.baseMarkup !== null ? +t.baseMarkup : +(K.money.markup ?? t.markup);
    return {
      tol: e,
      base: n,
      lo: Math.max(0, n - e),
      hi: n + e
    }
  }

  function Mi(t) {
    const e = l.money;
    if ((e.baseMarkup === null || e.baseMarkup === void 0) && (e.baseMarkup = +e.markup), l.mode === "pro") {
      e.baseMarkup = +e.markup;
      return
    }
    if (l.mode !== "staff") {
      e.markup = +(K.money.markup ?? e.markup), e.adjust = 0;
      return
    }
    const n = document.activeElement,
      a = Jo();
    let o = !1;
    (t || !(n && (n.id === "mk" || n.id === "adj" || n.id === "mk2" || n.id === "adj2"))) && ((e.markup < a.lo || e.markup > a.hi) && (e.markup = Math.min(a.hi, Math.max(a.lo, e.markup)), o = !0), Math.abs(e.adjust) > a.tol && (e.adjust = Math.sign(e.adjust) * a.tol, o = !0), o && (ft(), V(`${loPn(a.base)}наценка — от ${S(a.lo)} до ${S(a.hi)}%, скидка/надбавка — не больше ±${S(a.tol)}%`)));
    const s = f("mkLimit");
    s && (s.textContent = `${loPn(a.base)}можно от ${S(a.lo)} до ${S(a.hi)}% (±${S(a.tol)} от ${S(a.base)}%). Тип клиента — кнопками выше`)
  }

  function loPn(b) {
    const p = (l.money.presets || []).find(q => +q.v === +b);
    return p ? `Тип клиента «${p.n}» (${S(+p.v)}%): ` : "Сотруднику "
  }

  function wi() {
    const t = [],
      e = l.money,
      n = {
        prepMk: "Наценка на подготовку",
        markup: "Наценка",
        minOrder: "Мин. заказ",
        taxRev: "Налог",
        vat: "НДС",
        rate: "Ставка оператора",
        setupMin: "Приём заказа",
        plateMin: "Снятие со стола",
        cadRate: "Ставка моделирования",
        kwh: "Электроэнергия",
        twoRate: "Два тарифа",
        kwhNight: "Ночной тариф",
        risk: "Брак",
        waste: "Потери материала",
        printers: "Принтеров",
        hoursPerDay: "Печать в сутки",
        rushPct: "Наценка за срочность",
        opt: "Скидки за опт",
        optOn: "Скидки за опт",
        paintPrice: "Цена покраски",
        packaging: "Цена упаковки",
        insertPrice: "Цена втулки",
        chamber: "Нагрев камеры",
        adjust: "Скидка/надбавка",
        presets: "Кнопки клиентов",
        mgrTol: "Допуск менеджера",
        nightFrom: "Ночь с",
        nightTo: "Ночь до",
        washMin: "Мойка",
        washCost: "Спирт, перчатки",
        fill: "Загрузка стола",
        share: "Стол"
      },
      a = s => typeof s == "boolean" ? s ? "вкл" : "выкл" : Array.isArray(s) ? s.map(i => i.q != null ? `${i.q}:${i.d}%` : i.n + " " + i.v + "%").join(", ") : String(s);
    for (const s of ke) K.money[s] !== void 0 && !Ot(e[s], K.money[s]) && t.push(`${n[s]||s}: ${a(K.money[s])} → ${a(e[s])}`);
    for (const s of Ee) K.sla[s] !== void 0 && !Ot(l.sla[s], K.sla[s]) && t.push(`${n[s]||s}: ${a(K.sla[s])} → ${a(l.sla[s])}`);
    const o = (s, i, r) => {
      for (const c of s) {
        const d = i.find(x => x.id === c.id);
        if (!d) {
          t.push(`Свой ${r}: ${c.name}`);
          continue
        }
        const u = Object.keys({
            ...c,
            ...d
          }).filter(x => x !== "tech" && !Ot(c[x], d[x])),
          p = {
            name: "название",
            price: "цена",
            life: "окупаемость, ч",
            maint: "расходники, ₽/ч",
            power: "мощность, Вт",
            warmup: "нагрев, мин",
            density: "плотность",
            timeCal: "поправка времени",
            bedX: "X",
            bedY: "Y",
            bedZ: "Z",
            chamberPower: "камера, Вт",
            chamberMin: "прогрев камеры, мин"
          };
        if (u.length === 1 && u[0] === "off") {
          t.push(`${r[0].toUpperCase()+r.slice(1)} «${d.name}»: ${c.off?"скрыт":"показан"} (в мастерской — ${d.off?"скрыт":"показан"})`);
          continue
        }
        u.length && t.push(`${r[0].toUpperCase()+r.slice(1)} «${d.name}»: ` + u.filter(x => x !== "off").slice(0, 4).map(x => `${p[x]||x} ${a(d[x])} → ${a(c[x])}`).join(", ") + (u.includes("off") ? `, ${c.off?"скрыт":"показан"}` : "") + (u.length > 5 ? ` и ещё ${u.length-5}` : ""))
      }
      for (const c of i) s.some(d => d.id === c.id) || t.push(`Удалён ${r}: ${c.name}`)
    };
    return o(l.printers, K.printers, "принтер"), o(l.materials, K.materials, "материал"), Ot(l.massCal, K.massCal) || t.push(`Поправка веса: ${a(l.massCal.fdm)} / ${a(l.massCal.resin)}`), Ot(l.blocks, K.blocks) || t.push("Блоки расчёта включены иначе"), Ot(l.vis || {}, K.vis || {}) || t.push("Видимость полей настроена иначе"), t
  }

  function Qo(t) {
    const e = {
        printers: l.printers,
        materials: l.materials,
        money: l.money,
        sla: l.sla,
        blocks: l.blocks,
        massCal: l.massCal
      },
      n = lt;
    try {
      l.printers = K.printers, l.materials = K.materials, l.money = {
        ...l.money,
        ...K.money
      }, l.sla = {
        ...l.sla,
        ...K.sla
      }, l.blocks = K.blocks, l.massCal = K.massCal;
      let a = t;
      if (!t) {
        lt = ua();
        const o = Pe();
        a = o ? [o] : []
      }
      return a.length ? en(a, l.money) : null
    } catch {
      return null
    } finally {
      Object.assign(l, e), lt = n
    }
  }

  function tr() {
    l.printers = st(K.printers), l.materials = st(K.materials), l.massCal = st(K.massCal), l.blocks = st(K.blocks), l.vis = st(K.vis || {}), setTimeout(Xe, 0), Object.assign(l.money, st(K.money)), Object.assign(l.sla, st(K.sla)), Object.assign(l.sls, st(K.sls || {}));
    for (const t of ee) {
      const e = l.printers.filter(a => a.tech === t),
        n = l.materials.filter(a => a.tech === cn(t));
      e.some(a => a.id === l.sel[t].printer) || (l.sel[t].printer = (e[0] || {}).id), n.some(a => a.id === l.sel[t].material) || (l.sel[t].material = (n[0] || {}).id)
    }
    Ze(), ue(), V("Вернули параметры мастерской")
  }
  const Xn = "smeta3d·rates";

  function xi(t) {
    const e = new TextEncoder().encode(JSON.stringify(t));
    for (let a = 0; a < e.length; a++) e[a] ^= Xn.charCodeAt(a % Xn.length) & 255;
    let n = "";
    for (const a of e) n += String.fromCharCode(a);
    return btoa(n)
  }

  function er(t) {
    const e = atob(t.trim()),
      n = new Uint8Array(e.length);
    for (let a = 0; a < e.length; a++) n[a] = e.charCodeAt(a) ^ Xn.charCodeAt(a % Xn.length) & 255;
    return JSON.parse(new TextDecoder().decode(n))
  }

  function $i() {
    return {
      v: 1,
      at: new Date().toISOString(),
      printers: l.printers,
      materials: l.materials,
      money: Se(l.money, ke),
      sla: Se(l.sla, Ee),
      sls: Se(l.sls, ["share", "fill"]),
      blocks: l.blocks,
      vis: l.vis,
      massCal: l.massCal,
      pass: l.pass || K.pass
    }
  }
  async function nr() {
    if (typeof fe > "u" || !fe) return;
    const t = ["https://raw.githubusercontent.com/NeroArtNuar/Calculator-3d-printing/main/rates.dat?t=" + Math.floor(Date.now() / 6e4), "rates.dat?t=" + Math.floor(Date.now() / 6e4)];
    for (const e of t) try {
      const n = await fetch(e, {
        cache: "no-store"
      });
      if (!n.ok) continue;
      const a = er(await n.text());
      if (!a || !a.printers) continue;
      const o = {
          vis: nt.has("vis"),
          printers: nt.has("printers"),
          materials: nt.has("materials"),
          blocks: nt.has("blocks"),
          massCal: nt.has("massCal"),
          pass: nt.has("pass")
        },
        s = nt.get("money", {}) || {},
        i = nt.get("sla", {}) || {};
      K.printers = a.printers, K.materials = a.materials, K.money = {
        ...K.money,
        ...Se(a.money, ke)
      }, K.sla = {
        ...K.sla,
        ...Se(a.sla, Ee)
      }, K.sls = {
        ...K.sls,
        ...Se(a.sls, ["share", "fill"])
      }, a.blocks && (K.blocks = {
        ...hn,
        ...a.blocks
      }), a.massCal && (K.massCal = a.massCal), a.pass && a.pass.pro && a.pass.staff && (K.pass = {
        ...ta,
        ...a.pass
      }), K.at = a.at, a.vis && (K.vis = a.vis), loK = !0, loSync(o), setTimeout(Xe, 0), o.pass || (l.pass = st(K.pass));
      for (const r of ke) !(r in s) && K.money[r] !== void 0 && (l.money[r] = st(K.money[r]));
      for (const r of Ee) !(r in i) && K.sla[r] !== void 0 && (l.sla[r] = st(K.sla[r]));
      {
        const q = nt.get("sls", {}) || {};
        for (const r of ["share", "fill"]) !(r in q) && K.sls[r] !== void 0 && (l.sls[r] = st(K.sls[r]))
      }
      for (const r of ee) {
        const c = l.printers.filter(d => d.tech === r);
        c.length && !c.some(d => d.id === l.sel[r].printer) && (l.sel[r].printer = c[0].id)
      }
      Ze(), ue();
      return
    } catch {}
  }
  let loPk = "",
    loPv = null;

  function loEncl(p) {
    return p.encl != null && p.encl !== "" ? !!+p.encl : /P1S|P2S|X1|H2D|K1|K2|Voron|Plus4|Q1|X-Max|Qidi|CreatBot|Core ?One|Raise3D|Ultimaker S/i.test(p.name || "")
  }

  function loPick() {
    const cap = f("printerAuto"),
      sel = f("printerSel"),
      on = l.mode === "simple";
    if (sel && (sel.disabled = on), !on) {
      cap && (cap.hidden = !0), loPk = "";
      return
    }
    const t = l.tech,
      ps = Qe(yn());
    if (ps.length < 2) return;
    const k = JSON.stringify([t, H && H.ver, H && H.scale, l.sel[t].material, l.slicer, l.sla, l.sls, l.part, l.source, l.manual, l.manualResin, l.printers, loCh, l.money.minOrder]);
    if (k === loPk) {
      loPv && ps.some(p => p.id === loPv) && (l.sel[t].printer = loPv);
      loCap();
      return
    }
    let c = H && H.st ? ps.filter(p => wn(H.st, p, t) > 0) : ps.slice();
    c.length || (c = ps.slice());
    let why = "";
    if (t === "fdm" && Sc(Ct())) {
      const e = c.filter(p => +p.chamberPower > 0 || loEncl(p));
      e.length && (c = e, why = " с закрытой камерой")
    }
    const o = l.sel[t].printer,
      s = lt;
    let best = null,
      bv = 1 / 0;
    if (c.length === 1) best = c[0];
    else
      for (const p of c) {
        l.sel[t].printer = p.id;
        try {
          lt = ua();
          const it = Pe(),
            r = it && en([it], l.money);
          r && Number.isFinite(r.cost) && r.cost < bv && (bv = r.cost, best = p)
        } catch (e) {}
      }
    lt = s, l.sel[t].printer = best ? best.id : o, loPk = k, loPv = best ? best.id : null, loWhy = why, loCap()
  }
  let loWhy = "",
    loCmpK = "";

  function loCmp() {
    const box = f("pcmpBox"),
      tb = f("pcmp");
    if (!box || !tb) return;
    const t = l.tech,
      ps = Qe(yn()),
      on = (l.mode === "staff" || l.mode === "pro") && ps.length > 1 && !kn() && !Ae() && !!H;
    if (box.hidden = !on, !on) {
      loCmpK = "";
      return
    }
    const k = JSON.stringify([t, H && H.ver, H && H.scale, l.sel[t], l.slicer, l.sla, l.sls, l.part, l.printers, l.materials, l.money, l.blocks]);
    if (k === loCmpK) return;
    loCmpK = k;
    const o = l.sel[t].printer,
      s = lt,
      rows = [];
    for (const p of ps) {
      const fit = !H || !H.st || wn(H.st, p, t) > 0;
      if (!fit) {
        rows.push({
          p,
          fit
        });
        continue
      }
      l.sel[t].printer = p.id;
      try {
        lt = ua();
        const it = Pe(),
          r = it && en([it], l.money);
        r && Number.isFinite(r.client) && rows.push({
          p,
          fit,
          r
        })
      } catch (e) {}
    }
    lt = s, l.sel[t].printer = o;
    const ok = rows.filter(x => x.r),
      bc = Math.min(...ok.map(x => x.r.cost)),
      bd = Math.min(...ok.map(x => x.r.days));
    tb.innerHTML = rows.map(({
      p,
      fit,
      r
    }) => !fit || !r ? `<tr class="off"><td>${J(p.name)}</td><td colspan="3">${fit?"нет расчёта":"не помещается"}</td></tr>` : `<tr class="${p.id===o?"cur":""}" ${p.id===o?"":`data-pc="${J(p.id)}" tabindex="0" title="Выбрать этот принтер (прибыль ${Q(r.profit)})"`}><td>${J(p.name)}${p.id===o?" <small>выбран</small>":""}</td><td class="r${r.cost<=bc+.5?" best":""}">${Q(r.cost)}</td><td class="r${r.profit<0?" neg":""}">${Q(r.client)}</td><td class="r${r.days<=bd?" best":""}">${S(r.days)} дн</td></tr>`).join("")
  }

  function loCap() {
    const cap = f("printerAuto"),
      sel = f("printerSel"),
      p = ht();
    sel && p && (sel.value = p.id), cap && (cap.hidden = !1, cap.textContent = "Подобран автоматически" + (loWhy ? " — с закрытой камерой" : ""), cap.title = "Самый выгодный из принтеров, в которые помещается деталь")
  }

  function loAsBar() {
    const b = f("asBar");
    if (!b) return;
    const n = {
        simple: "Простой",
        adv: "Расширенный",
        staff: "Сотрудник"
      } [l.mode],
      on = !1; /* плашка «Вы смотрите как …» отключена по просьбе владельца */
    b.hidden = !on, on && (f("asBarT").textContent = Jt ? "Вы смотрите как «Друзья»" : `Вы смотрите как «${n}»`)
  }

  function loUnpub() {
    const b = f("unpubBadge");
    if (!b) return;
    let n = 0;
    try {
      n = l.access === "pro" && l.mode === "pro" && fe ? wi().length : 0
    } catch {}
    b.hidden = !n, b.textContent = n ? `Не опубликовано: ${n} · Опубликовать` : "", b.title = n ? wi().slice(0, 8).join("\n") : ""
  }

  function at() {
    try {
      loLead(), loUnpub(), loAsBar(), loBrand(), loColRender(), loRateChk()
    } catch (t) {}
    Mi(), typeof On == "function" && On();
    try {
      loPick()
    } catch (t) {
      console.error(t)
    }
    try {
      lt = ua()
    } catch (t) {
      console.error(t), lt = null
    }
    kn() || qs(), loSyncCur(), Ao(), Ae() && ce(), Yc(), gt();
    try {
      loCmp()
    } catch (t) {
      console.error(t)
    }
    try {
      loFrSave()
    } catch (t) {}
    try {
      loSteps()
    } catch (t) {}
    try {
      loDraw()
    } catch (t) {
      console.error(t)
    }
    try {
      if (loCur && loGeo.size) {
        const g = loGeo.get(loCur);
        g && g.H === H && (g.s = loSnap());
        const S0 = {};
        loGeo.forEach((q, id) => S0[id] = q.s), nt.set("lo.parts", {
          cur: loCur,
          s: S0
        })
      } else nt.del("lo.parts")
    } catch (t) {}
  }
  let loCur = null;
  const loGeo = new Map;

  function loSnap() {
    return st({
      tech: l.tech,
      resinSub: l.resinSub,
      sel: l.sel,
      slicer: l.slicer,
      sla: l.sla,
      sls: l.sls,
      part: l.part,
      sup: l.sup,
      source: l.source,
      manual: l.manual,
      manualResin: l.manualResin
    })
  }

  function loApply(s) {
    for (const k in s || {}) l[k] = st(s[k])
  }

  function loPid() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  }

  function loSyncCur() {
    if (!loCur || !H) return;
    const g0 = loGeo.get(loCur);
    if (!g0 || g0.H !== H) return;
    const i = l.basket.findIndex(b => b.id === loCur);
    if (i < 0) {
      loCur = null;
      return
    }
    const it = Pe();
    it && (l.basket[i] = {
      ...it,
      id: loCur
    })
  }

  function loStoreCur() {
    if (!loCur || !H) return;
    const g = loGeo.get(loCur) || {};
    if (g.H && g.H !== H) return;
    g.gv !== H.ver && (g.geom && g.geom.dispose(), g.geom = null), g.H = H, g.gv = H.ver, g.s = loSnap(), H.st && (g.d = {
      dimX: H.st.dimX,
      dimY: H.st.dimY,
      dimZ: H.st.dimZ
    }), loGeo.set(loCur, g), loSyncCur()
  }

  function loNewPart() {
    const it = Pe();
    if (!it || !H) {
      V("Нет данных о расходе для детали");
      return
    }
    const id = loPid();
    it.id = id, l.basket.push(it), loGeo.set(id, {
      H,
      gv: H.ver,
      s: loSnap()
    }), loCur = id, typeof loSaveM == "function" && loSaveM(), at()
  }

  function loStartParts() {
    !loCur && H && l.blocks.basket && loNewPart()
  }

  function loLoad(id) {
    const g = loGeo.get(id);
    if (!g || !g.H) return !1;
    je(!0), loCur = id, loApply(g.s), H = g.H, H.st || (H.st = vn(H.pos)), ne = null, f("scalePct").value = +((H.scale || 1) * 100).toFixed(2), f("unitSel").value = String(H.unit || 1), vi(), Ge(l.source), Ne(), Ln(), ge(), Me(), ft(), Sn(), at(), typeof loSaveM == "function" && loSaveM();
    return !0
  }

  function loSelect(id) {
    if (id === loCur) return;
    if (!loGeo.has(id)) {
      V("Для этой позиции нет модели — её можно менять только в списке");
      return
    }
    loStoreCur(), loLoad(id)
  }

  function loDup(id) {
    id === loCur && loStoreCur();
    const b = l.basket.find(x => x.id === id),
      g = loGeo.get(id);
    if (!b) return;
    const n = loPid();
    l.basket.push({
      ...st(b),
      id: n
    }), g && g.H && loGeo.set(n, {
      H: {
        ...g.H,
        pos: g.H.pos.slice(),
        ver: ++da
      },
      s: st(g.s)
    }), at(), typeof loSaveM == "function" && loSaveM(), V("Деталь продублирована")
  }

  function loDel(id) {
    l.basket = l.basket.filter(c => c.id !== id);
    const g = loGeo.get(id);
    if (g && g.geom && g.geom.dispose(), loGeo.delete(id), id === loCur) {
      loCur = null;
      const nx = l.basket.find(b => loGeo.has(b.id));
      nx && loLoad(nx.id)
    }
    l.basket.length || (loCur = null, loGeo.clear()), at(), typeof loSaveM == "function" && loSaveM()
  }
  let loGrp = null,
    loDk = "";

  function loGeom(g) {
    return (!g.geom || g.geomV !== g.H.ver) && (g.geom && g.geom.dispose(), g.geom = new THREE.BufferGeometry, g.geom.setAttribute("position", new THREE.BufferAttribute(g.H.pos, 3)), g.geom.computeVertexNormals(), g.geomV = g.H.ver), g.geom
  }

  function loBed(t) {
    const e = f("loBed");
    e && (e.hidden = !t, e.textContent = t || "")
  }

  function loDraw() {
    if (!Re || !Lt || typeof THREE > "u") return;
    loGrp || (loGrp = new THREE.Group, Lt.add(loGrp));
    const pr = ht(),
      all = l.basket.filter(b => loGeo.has(b.id)),
      parts = all.filter(b => b.tech === l.tech),
      k = JSON.stringify([loCur, l.tech, pr.id, pr.bedX, pr.bedY, all.map(b => [b.id, b.tech, b.qty, (loGeo.get(b.id).H || {}).ver])]);
    if (k === loDk) return;
    loDk = k;
    for (; loGrp.children.length;) loGrp.remove(loGrp.children[0]);
    if (!loCur || !H || !all.length) {
      He.position.set(0, 0, 0), loBed(""), zt = !0;
      return
    }
    const gap = tt.has(l.tech) ? 3 : 5,
      it = [];
    for (const b of parts) {
      const g = loGeo.get(b.id),
        d = g.H === H ? H.st : g.H.st || g.d || {
          dimX: 20,
          dimY: 20
        };
      const q = Math.max(1, Math.round(b.qty || 1));
      for (let c = 0; c < q && it.length < 120; c++) it.push({
        id: b.id,
        w: d.dimX + gap,
        h: d.dimY + gap,
        g
      })
    }
    it.sort((a, b) => (b.id === loCur) - (a.id === loCur) || b.h - a.h);
    const BX = pr.bedX,
      BY = pr.bedY;
    let x = 0,
      y = 0,
      row = 0,
      over = 0;
    const pl = [];
    for (const p of it) {
      if (x + p.w > BX + gap && x > 0 && (x = 0, y += row, row = 0), y + p.h > BY + gap || p.w > BX + gap) {
        over++;
        continue
      }
      pl.push({
        ...p,
        cx: x + p.w / 2 - gap / 2 - BX / 2,
        cy: y + p.h / 2 - gap / 2 - BY / 2
      }), x += p.w, row = Math.max(row, p.h)
    }
    const cur = pl.find(p => p.id === loCur) || {
      cx: 0,
      cy: 0
    };
    He.position.set(-cur.cx, 0, cur.cy);
    const mt = new THREE.MeshStandardMaterial({
      color: 9413555,
      transparent: !0,
      opacity: .45,
      roughness: .6,
      side: THREE.DoubleSide,
      depthWrite: !1
    });
    let first = !0;
    for (const p of pl) {
      if (p.id === loCur && first) {
        first = !1;
        continue
      }
      const m = new THREE.Mesh(loGeom(p.g), mt);
      m.position.set(p.cx - cur.cx, p.cy - cur.cy, 0), m.userData.pid = p.id, loGrp.add(m)
    }
    if (pl.length > 1) {
      let ex = 0;
      for (const p of pl) ex = Math.max(ex, Math.abs(p.cx - cur.cx) + p.w / 2, Math.abs(p.cy - cur.cy) + p.h / 2);
      pt.r = Math.max(pt.r, ex * 2.6), ma()
    }
    const ot = {};
    for (const b of all) b.tech !== l.tech && (ot[Nt[b.tech].name] = (ot[Nt[b.tech].name] || 0) + 1);
    const os = Object.entries(ot).map(([n, c]) => `${n}: ${c}`).join(", ");
    loBed([`На столе ${Nt[l.tech].name}: ${S(pl.length)} шт` + (over ? `, не поместилось ${S(over)} — пойдут на следующие столы` : ""), os ? `другие технологии — ${os} (выберите деталь в списке)` : ""].filter(Boolean).join(" · ")), zt = !0
  }

  function loPartsInit() {
    const v = f("viewer");
    if (!v) return;
    let d = null;
    v.addEventListener("pointerdown", e => {
      d = {
        x: e.clientX,
        y: e.clientY,
        t: Date.now()
      }
    }), v.addEventListener("pointerup", e => {
      if (!d || !loGrp || !loGrp.children.length || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5 || Date.now() - d.t > 500) return;
      const r = v.getBoundingClientRect(),
        q = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1),
        c = new THREE.Raycaster;
      c.setFromCamera(q, Fe);
      const h = c.intersectObjects(loGrp.children, !1)[0];
      h && h.object.userData.pid && loSelect(h.object.userData.pid)
    })
  }
  let loStepN = 1;

  function loStep(n) {
    loStepN = n = Math.min(2, Math.max(1, +n || 1)), document.body.dataset.step = n, document.querySelectorAll("#stepNav [data-step]").forEach(b => {
      const on = +b.dataset.step === n;
      b.classList.toggle("on", on), b.setAttribute("aria-selected", on ? "true" : "false")
    }), setTimeout(() => {
      try {
        us()
      } catch {}
    }, 0);
    const s = f("stepNav");
    s && s.getBoundingClientRect().top < 0 && s.scrollIntoView({
      block: "start",
      behavior: "smooth"
    })
  }

  function loMTab(id) {
    const c = f("secMoney");
    if (!c) return;
    c.querySelectorAll(".mpane").forEach(p => p.classList.toggle("on", p.dataset.mp === id)), c.querySelectorAll("#moneyTabs [data-mt]").forEach(b => {
      const on = b.dataset.mt === id;
      b.classList.toggle("on", on), b.setAttribute("aria-selected", on ? "true" : "false")
    });
    try {
      nt.set("mtab", id)
    } catch {}
  }

  function loMoneyTabs() {
    const c = f("secMoney");
    if (!c || f("moneyTabs")) return;
    const b = c.querySelector(".card-b"),
      mk = (id, cl) => {
        const d = document.createElement("div");
        return d.className = "mpane" + (cl ? " " + cl : ""), d.dataset.mp = id, d.classList.add("u-col", "u-g12"), d
      },
      P = {
        cli: mk("cli"),
        doc: mk("doc", "pro"),
        prod: mk("prod", "pro"),
        mod: mk("mod", "pro"),
        acc: mk("acc", "pro owner-only")
      },
      g1 = b.querySelector(".grid"),
      sh = g1 && g1.querySelector('[data-bind="money.shopName"]'),
      shf = sh && sh.closest(".field.pro"),
      opt = b.querySelector(".opt-box"),
      mkd = b.querySelector("details.mkd"),
      g2 = [...b.children].find(e => e.classList.contains("grid") && e.classList.contains("pro")),
      tol = g2 && g2.querySelector('[data-bind="money.mgrTol"]'),
      prod = [...b.children].find(e => e.querySelector && e.querySelector('[data-bind="money.rate"]'));
    if (shf) {
      const d = document.createElement("div");
      d.className = "grid", shf.classList.add("u-full"), d.appendChild(shf), P.doc.appendChild(d)
    }
    g1 && P.cli.appendChild(g1);
    if (tol) {
      const d = document.createElement("div");
      d.className = "grid pro", d.appendChild(tol.closest(".field")), P.cli.appendChild(d)
    }
    mkd && P.cli.appendChild(mkd), opt && P.cli.appendChild(opt), prod && (prod.classList.remove("pro"), P.prod.appendChild(prod)), g2 && (g2.classList.remove("pro"), P.acc.appendChild(g2)), b.insertAdjacentHTML("afterbegin", '<div class="seg mtabs" id="moneyTabs" role="tablist" aria-label="Разделы цены"><button type="button" role="tab" data-mt="cli">Цена для клиента</button><button type="button" role="tab" class="pro" data-mt="doc">Документы и контакты</button><button type="button" role="tab" class="pro" data-mt="prod">Производство</button><button type="button" role="tab" class="pro" data-mt="mod">Моделирование</button><button type="button" role="tab" class="pro owner-only" data-mt="acc">Доступ и публикация</button></div>');
    for (const k of ["cli", "doc", "prod", "mod", "acc"]) b.appendChild(P[k]);
    loModSettings(P.mod);
    {
      const po = [f("mk"), f("adj")].map(e => e && e.closest(".field"));
      po.forEach(e => e && e.classList.add("po"));
      const sec = (t, els) => {
          els = els.filter(Boolean);
          if (!els.length) return;
          const w = document.createElement("div");
          w.classList.add("u-col"), w.innerHTML = `<p class="sub">${t}</p>`;
          const g = document.createElement("div");
          g.className = "grid";
          for (const e of els) e.removeAttribute("data-tech"), e.classList.remove("pro", "tech-off"), g.appendChild(e);
          w.appendChild(g), P.prod.appendChild(w)
        },
        fl = q => {
          const e = document.querySelector(`[data-bind="${q}"]`);
          return e && e.closest(".field,.check")
        };
      sec("Сроки", [fl("money.rushPct"), fl("money.offDays"), P.doc.querySelector(".mx-days")]);
      {
        const eg = f("secExtra") && f("secExtra").querySelector(".grid.pro");
        eg && eg.remove()
      }
      sec("Фотополимер", [fl("sla.share"), fl("sla.fill"), fl("sla.washMin"), fl("sla.washCost")]), sec("SLS", [fl("sls.share"), fl("sls.fill")])
    }
    f("moneyTabs").addEventListener("click", e => {
      const t = e.target.closest("[data-mt]");
      t && loMTab(t.dataset.mt)
    });
    let s0 = "cli";
    try {
      s0 = nt.get("mtab", "cli")
    } catch {}
    loMTab(["cli", "doc", "prod", "mod", "acc"].includes(s0) ? s0 : "cli")
  }
  const loCT = {
      foto: ["Фото", "фото или видео готовой детали"],
      draw: ["Эскиз или чертёж", "есть размеры на бумаге или в PDF"],
      mod: ["Доработка модели", "есть STL/STEP, нужно изменить"],
      scan: ["3D-скан", "есть скан, нужна чистая модель"]
    },
    loSH = {
      plate: ["Плоская", "пластина, кронштейн, уголок"],
      box: ["Корпус", "стенки, крышка, внутренние полости"],
      rev: ["Тело вращения", "втулка, ручка, колпачок, шкив"],
      org: ["Органика", "фигурка, рельеф, сложные изгибы"]
    },
    loSZ = {
      s: "В ладонь",
      m: "До 20 см",
      l: "Больше 20 см"
    },
    loAC = {
      a: "Примерно как на фото",
      e: "Точно по размерам"
    },
    loFT = {
      hole: ["Отверстия", "под винты, штифты, провода"],
      thread: ["Резьба", "внутренняя или наружная"],
      clip: ["Крепления", "защёлки, петли, пазы, ушки"],
      edge: ["Скругления", "скругления и фаски, по кромкам"],
      rib: ["Рёбра", "усиления и перегородки"],
      text: ["Текст", "надпись, логотип, гравировка"],
      fit: ["Стыковка", "посадка к другой детали"]
    };
  let loCS = null,
    loCF = [];

  function loCadS() {
    return loCS || (loCS = {
      type: "foto",
      shape: "plate",
      size: "s",
      acc: "a",
      feat: {},
      n: 1,
      noDims: !1,
      rush: !1,
      note: "",
      ...nt.get("cad", {})
    }, loCS.feat = loCS.feat || {}, loSH[loCS.shape] || (loCS.shape = "plate"), loSZ[loCS.size] || (loCS.size = "s"), loAC[loCS.acc] || (loCS.acc = "a")), loCS
  }

  function loCadCalc() {
    const s = loCadS(),
      m = l.money,
      E = m.modE || {},
      k = m.modK || {},
      g = (o, q, d) => {
        const v = +((E[o] || {})[q]);
        return Number.isFinite(v) ? v : d
      },
      base = g("shape", s.shape, 1),
      sz = g("size", s.size, 1),
      ac = g("acc", s.acc, 1),
      ty = g("type", s.type, 1),
      nd = s.noDims ? 1 + (+k.dims || 0) / 100 : 1,
      fl = [];
    let fm = 0;
    for (const q in loFT) {
      const c = Math.max(0, Math.round(+s.feat[q] || 0));
      if (!c) continue;
      const mi = g("feat", q, 0);
      fm += c * mi, fl.push([q, c, mi])
    }
    const H1 = (base * sz * ac + fm / 60) * ty * nd,
      n = Math.max(1, Math.round(+s.n || 1)),
      qn = 1 + (n - 1) * (+k.more || 0) / 100,
      H = H1 * qn,
      lo = (+E.lo || 80) / 100,
      hi = Math.max(lo, (+E.hi || 140) / 100),
      a = H * lo,
      b = H * hi,
      rt = +m.cadRate || 0,
      ru = s.rush ? 1 + (+k.rush || 0) / 100 : 1,
      mn = +m.modMin || 0,
      tx = l.blocks.tax ? 1 / (1 - Math.min(.9, Math.max(0, (+m.taxRev || 0) / 100))) * (1 + (+m.vat || 0) / 100) : 1,
      R = x => Math.round(x / 100) * 100;
    return {
      a,
      b,
      H,
      base,
      sz,
      ac,
      ty,
      nd,
      fl,
      fm,
      n,
      qn,
      pa: R(Math.max(mn, a * rt * ru * tx)),
      pb: R(Math.max(mn, b * rt * ru * tx)),
      mid: Math.round(H * ru * 2) / 2,
      tx
    }
  }

  function loCadText() {
    const s = loCadS(),
      c = loCadCalc(),
      fl = [s.noDims && "точных размеров нет", s.rush && "срочно"].filter(Boolean);
    return ["Заявка на 3D-моделирование", `Что есть: ${loCT[s.type][0]}`, `Форма: ${loSH[s.shape][0]}, размер: ${loSZ[s.size].toLowerCase()}, точность: ${loAC[s.acc].toLowerCase()}`, c.fl.length ? "Элементы: " + c.fl.map(([q, n]) => `${loFT[q][0].toLowerCase()} — ${n}`).join(", ") : "", `Разных деталей: ${c.n}` + (fl.length ? " · " + fl.join(" · ") : ""), s.note.trim() ? `Комментарий: ${s.note.trim()}` : "", loCF.length ? `Фото и файлы: ${loCF.length} шт — приложу к сообщению` : "", `Предварительная оценка: ${Q(c.pa)} – ${Q(c.pb)} (${S(c.a,1)}–${S(c.b,1)} ч работы)`].filter(Boolean).join("\n")
  }

  function loCadRender() {
    const g = f("secCad");
    if (!g) return;
    const s = loCadS(),
      c = loCadCalc();
    g.querySelectorAll("[data-ct]").forEach(b => b.classList.toggle("on", b.dataset.ct === s.type)), g.querySelectorAll("[data-csh]").forEach(b => b.classList.toggle("on", b.dataset.csh === s.shape)), g.querySelectorAll("[data-csz]").forEach(b => b.classList.toggle("on", b.dataset.csz === s.size));
    const ch = f("cadFeats");
    ch && (ch.innerHTML = Object.entries(loFT).map(([q, [a, h]]) => {
      const n = Math.max(0, Math.round(+s.feat[q] || 0));
      return `<span class="cad-chip${n?" on":""}"><button type="button" data-fu="${q}" title="${h}. Нажмите, чтобы добавить">${a}${n?` <b>${n}</b>`:""}</button>${n?`<button type="button" class="cad-x" data-fd="${q}" aria-label="Убрать одно: ${a}">−</button>`:""}</span>`
    }).join(""));
    const ac = f("cadAcc");
    ac && (ac.checked = s.acc === "e");
    const r = f("cadRes"),
      x = (v, d = 2) => S(v, d),
      bd = [`${loSH[s.shape][0]}: ${x(c.base,2)} ч × размер ${x(c.sz)} × точность ${x(c.ac)} = ${x(c.base*c.sz*c.ac)} ч`, ...c.fl.map(([q, n, mi]) => `${loFT[q][0]}: ${n} × ${S(mi)} мин = ${x(n*mi/60)} ч`), `${loCT[s.type][0]}: × ${x(c.ty)}` + (c.nd > 1 ? ` · нет размеров × ${x(c.nd)}` : ""), c.n > 1 ? `Деталей: ${c.n} → × ${x(c.qn)}` : "", `Итого ≈ ${x(c.H,1)} ч, вилка ${x(c.a,1)}–${x(c.b,1)} ч`].filter(Boolean);
    r && (r.innerHTML = `<span class="cap">Предварительно</span><div class="cad-price">${c.pa===c.pb?Q(c.pa):Q(c.pa)+" – "+Q(c.pb)}</div><div class="cap">≈ ${S(c.a,1)}–${S(c.b,1)} ч · ${Q(+l.money.cadRate||0)}/ч${c.tx>1.0001?" · с налогами":""}${s.rush?" · срочно":""}</div><details class="cad-bd"><summary>Из чего складывается</summary><ul>${bd.map(t=>`<li>${J(t)}</li>`).join("")}</ul>${+l.money.modMin>0?`<p class="cap">Не меньше ${Q(+l.money.modMin)}.</p>`:""}</details><p class="cap">Точную цену мастер назовёт после просмотра фото или чертежа.</p>`);
    const m = l.money,
      b = f("cadSendBtns");
    if (b) {
      const y = [];
      (m.cEmail || "").trim() && y.push('<button class="btn primary" type="button" data-cs="mail">Отправить на оценку</button>'), (m.cTg || "").trim() && y.push('<button class="btn" type="button" data-cs="tg">Telegram</button>'), (m.cWa || "").replace(/\D/g, "") && y.push('<button class="btn" type="button" data-cs="wa">WhatsApp</button>'), y.push('<button class="btn" type="button" data-cs="copy">Скопировать заявку</button>', '<button class="btn ghost" type="button" data-cs="print">+ К расчёту печати</button>'), b.innerHTML = y.join("")
    }
  }

  function loCadThumbs() {
    const t = f("cadThumbs");
    t && (t.innerHTML = loCF.map((x, i) => x.type.startsWith("image/") ? `<span class="cad-th"><img src="${x.url}" alt="${J(x.name)}"><button type="button" data-cdel="${i}" aria-label="Убрать">✕</button></span>` : `<span class="cad-th cad-doc">${J(x.name)}<button type="button" data-cdel="${i}" aria-label="Убрать">✕</button></span>`).join(""))
  }

  function loCadSend(k) {
    const t = loCadText(),
      m = l.money;
    if (k === "mail") location.href = `mailto:${encodeURIComponent((m.cEmail||"").trim())}?subject=${encodeURIComponent("Заявка на 3D-моделирование")}&body=${encodeURIComponent(t)}`;
    else if (k === "tg") navigator.clipboard && navigator.clipboard.writeText(t).catch(() => {}), V("Заявка скопирована — вставьте её в чат и приложите фото"), window.open("https://t.me/" + encodeURIComponent((m.cTg || "").trim().replace(/^@|^https?:\/\/t\.me\//i, "")), "_blank", "noopener");
    else if (k === "wa") window.open(`https://wa.me/${(m.cWa||"").replace(/\D/g,"")}?text=${encodeURIComponent(t)}`, "_blank", "noopener");
    else if (k === "copy") navigator.clipboard ? navigator.clipboard.writeText(t).then(() => V("Заявка скопирована"), () => V("Не удалось скопировать")) : V("Буфер обмена недоступен");
    else if (k === "print") {
      const c = loCadCalc();
      l.money.cadH = c.mid, l.blocks.extras = !0, loView("print"), Ze(), at(), V(`В расчёт печати добавлено моделирование ≈ ${S(c.mid,1)} ч`)
    }
  }

  function loView(v) {
    document.body.classList.toggle("cadv", v === "cad"), document.querySelectorAll("#viewSeg [data-view]").forEach(b => b.classList.toggle("on", b.dataset.view === v)), v === "cad" && (typeof loWs == "function" && loWs(!1), loCadRender(), window.scrollTo({
      top: 0
    }));
    try {
      nt.set("view", v)
    } catch {}
  }

  function loCadInit() {
    const g = f("secCad");
    if (!g) return;
    const s = loCadS();
    f("cadN").value = s.n, f("cadNoDims").checked = s.noDims, f("cadRush").checked = s.rush, f("cadNote").value = s.note;
    const sv = () => {
        nt.set("cad", {
          ...loCadS()
        }), loCadRender()
      },
      fs = (q, v) => {
        s.feat[q] = Math.min(99, Math.max(0, Math.round(+v || 0))), sv()
      };
    g.addEventListener("click", e => {
      const t = e.target.closest("[data-ct],[data-csh],[data-csz],[data-fd],[data-fu],[data-cs],[data-cdel]");
      if (!t) return;
      const d = t.dataset;
      d.ct ? (s.type = d.ct, sv()) : d.csh ? (s.shape = d.csh, sv()) : d.csz ? (s.size = d.csz, sv()) : d.fd ? fs(d.fd, (+s.feat[d.fd] || 0) - 1) : d.fu ? fs(d.fu, (+s.feat[d.fu] || 0) + 1) : d.cs ? loCadSend(d.cs) : d.cdel && (URL.revokeObjectURL((loCF[+d.cdel] || {}).url || ""), loCF.splice(+d.cdel, 1), loCadThumbs(), loCadRender())
    }), g.addEventListener("input", e => {
      const t = e.target;
      t.id === "cadN" ? (s.n = Math.min(50, Math.max(1, Math.round(+t.value || 1))), sv()) : t.id === "cadNote" && (s.note = t.value, nt.set("cad", {
        ...s
      }))
    }), g.addEventListener("change", e => {
      const t = e.target;
      t.id === "cadNoDims" ? s.noDims = t.checked : t.id === "cadRush" ? s.rush = t.checked : t.id === "cadAcc" && (s.acc = t.checked ? "e" : "a"), t.id === "cadN" && (t.value = s.n), sv()
    }), f("cadPick").onclick = () => f("cadFiles").click(), f("cadFiles").onchange = e => {
      for (const x of [...e.target.files].slice(0, 8 - loCF.length)) loCF.push({
        name: x.name,
        type: x.type || "",
        url: URL.createObjectURL(x)
      });
      e.target.value = "", loCadThumbs(), loCadRender()
    }, f("viewSeg").addEventListener("click", e => {
      const b = e.target.closest("[data-view]");
      b && loView(b.dataset.view)
    }), l.part.inserts = 0, l.part.paintOn = !1, l.part.packOn = !1, loView(nt.get("view", "print") === "cad" ? "cad" : "print")
  }

  function loModSettings(P) {
    const inp = (path, u, st) => `<span class="inp"><input type="number" min="0" step="${st||.05}" data-bind="money.${path}"><em>${u}</em></span>`,
      fld = (lb, path, u, st) => `<label class="field"><span class="lbl">${lb}</span>${inp(path,u,st)}</label>`;
    P.insertAdjacentHTML("beforeend", `<p class="cap">Клиент в разделе «Моделирование» описывает деталь, и калькулятор складывает время: часы на форму × размер × точность + минуты на каждый элемент, × тип задачи. Вилка цены — от и до процента от этого времени, × ставка, с надбавками и не меньше минимума.</p><div class="grid" id="modRateBox"><label class="field"><span class="lbl">Минимальная стоимость</span><span class="inp"><input type="number" min="0" step="100" data-bind="money.modMin"><em>₽</em></span></label>${fld("Вилка: от","modE.lo","% расчёта",5)}${fld("Вилка: до","modE.hi","% расчёта",5)}</div><p class="sub">Форма — базовые часы</p><div class="grid">${Object.entries(loSH).map(([q,[a]])=>fld(a,"modE.shape."+q,"ч",.25)).join("")}</div><p class="sub">Элементы — минут за штуку</p><div class="grid">${Object.entries(loFT).map(([q,[a]])=>fld(a,"modE.feat."+q,"мин",1)).join("")}</div><p class="sub">Множители</p><div class="grid">${Object.entries(loSZ).map(([q,a])=>fld("Размер: "+a.toLowerCase(),"modE.size."+q,"×")).join("")}${Object.entries(loAC).map(([q,a])=>fld("Точность: "+a.toLowerCase(),"modE.acc."+q,"×")).join("")}${Object.entries(loCT).map(([q,[a]])=>fld(a,"modE.type."+q,"×")).join("")}</div><p class="sub">Надбавки</p><div class="grid">${fld("Нет точных размеров","modK.dims","% к часам",5)}${fld("Каждая следующая деталь","modK.more","% от первой",5)}${fld("Срочно","modK.rush","% к цене",5)}</div>`);
    {
      const cr = document.querySelector('[data-bind="money.cadRate"]'),
        fl = cr && cr.closest(".field");
      fl && (fl.classList.remove("pro"), fl.querySelector(".lbl") && (fl.querySelector(".lbl").textContent = "Ставка моделирования"), f("modRateBox").prepend(fl))
    }
    P.addEventListener("input", e => {
      const t = e.target;
      if (!t.dataset.bind || !t.dataset.bind.startsWith("money.mod")) return;
      const v = parseFloat(t.value);
      Number.isFinite(v) && v >= 0 && (Us(t.dataset.bind, v), at(), loCadRender())
    }), P.addEventListener("change", () => {
      gt(), ft()
    })
  }
  const loKpDef = "Коммерческое предложение на 3D-печать от {дата}\n{мастерская}\n\n{позиции}\n\nИтого: {итого}\n{моделирование}\n{минимум}\n{скидка}\n{ндс}\n\n{тираж_таблица}\n\n{срок}\n{оплата}\n{действует_до}\n\n{контакты}",
    loKpF = [
      ["Заказ", [
        ["позиции", "Описание заказа"],
        ["изделие", "Название детали"],
        ["материал", "Материал"],
        ["цвет", "Цвет"],
        ["технология", "Технология"],
        ["габариты", "Габариты"],
        ["масса", "Масса 1 шт"],
        ["тираж", "Количество"]
      ]],
      ["Цена", [
        ["итого", "Итоговая сумма"],
        ["цена_шт", "Цена за 1 шт"],
        ["скидка", "Скидка за объём"],
        ["ндс", "НДС"],
        ["минимум", "Минимальный заказ"],
        ["моделирование", "Моделирование"],
        ["тираж_таблица", "Цены при другом тираже"]
      ]],
      ["Условия", [
        ["срок", "Срок изготовления"],
        ["оплата", "Условия оплаты"],
        ["действует_до", "КП действует до"],
        ["дата", "Дата КП"]
      ]],
      ["Мастерская", [
        ["мастерская", "Название мастерской"],
        ["контакты", "Контакты и реквизиты"]
      ]]
    ];

  function loKpVars(t) {
    const a = Aa,
      m = l.money,
      n = l.blocks,
      v = {};
    v["дата"] = new Date().toLocaleDateString("ru-RU"), v["мастерская"] = (m.shopName || "").trim();
    for (const k of ["изделие", "технология", "материал", "цвет", "габариты", "масса", "цена_шт"]) v[k] = "";
    if (a) {
      const o = t.lines[0].c;
      v["изделие"] = a.name, v["технология"] = Nt[o.tech].long, v["габариты"] = a.dims || "", v["материал"] = o.mt.name + (a.color ? ", " + a.color.toLowerCase() : ""), v["цвет"] = a.color || "", v["масса"] = `≈ ${S(a.grams,0)} г`, v["тираж"] = `${S(a.qty)} шт`, v["цена_шт"] = mt(t.client / t.qty), v["позиции"] = [`Изделие: ${a.name}`, `Технология: ${Nt[o.tech].long}`, a.dims ? `Габариты: ${a.dims}` : "", `Материал: ${o.mt.name}`, `Масса 1 шт: ≈ ${S(a.grams,0)} г`, n.batch ? `Тираж: ${S(a.qty)} шт` : "", a.qty > 1 ? `Цена за 1 шт: ${mt(t.client/t.qty)}` : ""].filter(Boolean).join("\n")
    } else v["тираж"] = `${S(t.qty)} шт`, v["позиции"] = "Позиции:\n" + t.lines.map(({
      it: o,
      c: x
    }, i) => `  ${i+1}. ${o.name} — ${Nt[x.tech].name}, ${x.mt.name}, ${S(x.qty)} шт`).join("\n");
    v["итого"] = mt(t.client), v["моделирование"] = t.det && t.det.cad > .5 ? `В том числе моделирование ≈ ${S(+m.cadH||0,1)} ч: ${mt(t.det.cad*t.kCl)}` : "", v["минимум"] = t.minApplied ? `Минимальная сумма заказа — ${mt(t.client)}, стоимость деталей ${mt(t.byMarkup*t.kCl)}` : "", v["скидка"] = t.optD && !t.minApplied ? `С учётом скидки за объём ${loPc(t.optEff)}%` : "", v["ндс"] = n.tax && m.vat > 0 ? `В том числе НДС ${m.vat}%: ${mt(t.vatAmt)}` : "", v["тираж_таблица"] = a && n.batch ? "Цена за штуку при другом тираже:\n" + [1, 5, 10, 25, 50, 100].filter(q => q !== a.qty).map(q => {
      const i = en([{
        ...a,
        qty: q
      }], m);
      return i.minApplied ? `  ${q} шт — ${mt(i.client)} за всё (минимальная сумма заказа)` : `  ${q} шт — ${mt(i.client/q)} за шт, всего ${mt(i.client)}`
    }).join("\n") : "", v["срок"] = At() ? `Срок изготовления: ${At()} ${la(At())} после согласования модели (ориентировочно до ${$n(xn(Date.now(),At()))}).` : l.blocks.schedule && (t.plan.mode !== "none" || t.plan.busy) ? `Срок готовности: ${Rt(t.plan.end)}${t.rush?" (срочный заказ)":""}.` : `Срок изготовления: около ${t.days} раб. дн. после согласования модели.`, v["оплата"] = (m.kpPay || "").trim() ? `Условия оплаты: ${m.kpPay.trim()}` : "", v["действует_до"] = +m.kpDays > 0 ? `Предложение действительно до ${new Date(Date.now()+ +m.kpDays*864e5).toLocaleDateString("ru-RU")}.` : "", v["контакты"] = (m.shopInfo || "").trim();
    return v
  }

  function loKpFill(tpl, t, mk) {
    const v = loKpVars(t),
      r = x => x.replace(/\{([а-яё_]+)\}/gi, (y, k) => {
        k = k.toLowerCase();
        return k in v ? mk && v[k] ? "\u0001" + v[k] + "\u0002" : v[k] : y
      }),
      o = tpl.split("\n").flatMap(x => {
        const y = r(x).replace(/\s+$/, "");
        return /\{[а-яё_]+\}/i.test(x) && !y.replace(/[\s:—\-.,]+/g, "") ? [] : y.split("\n")
      });
    return o.filter((x, i) => !(x === "" && (i === 0 || o[i - 1] === ""))).join("\n").trim()
  }

  function loKpPrev() {
    const p = f("kpTplPrev"),
      st = f("kpTplState");
    if (!p) return;
    const own = !!(l.money.kpTpl || "").trim();
    st && (st.textContent = own ? "Сейчас в КП используется ваш шаблон." : "Сейчас в КП используется стандартный текст. Нажмите «Начать со стандартного текста», чтобы его изменить.", st.classList.toggle("ok-text", own));
    if (!rn) {
      p.textContent = "Посчитайте деталь на экране расчёта — здесь появится КП с её данными.";
      return
    }
    let x = "";
    try {
      x = own ? loKpFill(l.money.kpTpl, rn, !0) : Ro()
    } catch (e) {
      x = "Ошибка в шаблоне: " + e.message
    }
    p.innerHTML = J(x).replace(/\u0001/g, "<mark>").replace(/\u0002/g, "</mark>")
  }

  function loKpInit() {
    const ta = f("kpTplIn"),
      c = f("kpTplVars");
    if (!ta || !c) return;
    c.innerHTML = loKpF.map(([g, it]) => `<div class="kp-g"><span class="kp-gl">${g}</span>${it.map(([k,h])=>`<button type="button" class="kp-v" data-kpv="${k}" title="Вставит {${k}}">${h}</button>`).join("")}</div>`).join("");
    const go = () => {
      ta.dispatchEvent(new Event("input", {
        bubbles: !0
      }))
    };
    c.addEventListener("click", e => {
      const b = e.target.closest("[data-kpv]");
      if (!b) return;
      const v = `{${b.dataset.kpv}}`,
        a = ta.selectionStart ?? ta.value.length,
        z = ta.selectionEnd ?? a;
      ta.value = ta.value.slice(0, a) + v + ta.value.slice(z), ta.focus(), ta.selectionStart = ta.selectionEnd = a + v.length, go()
    }), f("kpTplDef").onclick = () => {
      ta.value = loKpDef, go(), ta.focus()
    }, f("kpTplClr").onclick = () => {
      ta.value = "", go()
    }, ta.addEventListener("input", () => setTimeout(() => {
      try {
        Ys()
      } catch {}
      loKpPrev()
    }, 0)), setTimeout(loKpPrev, 0)
  }

  function loStepsInit() {
    loMoneyTabs(), loBrandInit(), loColInit(), loKpLogInit(), loPlugInit();
    {
      const ov = document.querySelector(".ov.bl"),
        upd = () => ov && ov.classList.toggle("more", ov.scrollWidth - ov.clientWidth - ov.scrollLeft > 4);
      ov && (ov.addEventListener("scroll", upd, {
        passive: !0
      }), new ResizeObserver(upd).observe(ov), new MutationObserver(upd).observe(ov, {
        subtree: !0,
        attributes: !0,
        attributeFilter: ["class", "hidden"]
      }), upd())
    }
    {
      const pc = f("pcmp"),
        go = e => {
          const b = e.target.closest("[data-pc]");
          b && (l.sel[l.tech].printer = b.dataset.pc, Ne(), ft(), at())
        };
      pc && (pc.addEventListener("click", go), pc.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), go(e))))
    }
    const m = {
      secModel: 1,
      secPrint: 1,
      secOrder: 1,
      secExtra: 1,
      secTime: 1,
      secMoney: 2
    };
    for (const k in m) {
      const e = f(k);
      e && (e.dataset.st = m[k])
    }
    for (const [k, st, n, t] of [
        ["secTime", 1, 2, "Итог"],
        ["secMoney", 2, 1, "Расчёт"]
      ]) {
      const e = f(k);
      e && e.insertAdjacentHTML("afterend", `<div class="step-next" data-st="${st}">${st>1?`<button class="btn ghost" type="button" data-go="${n}">← ${t}</button><span></span>`:`<span></span><button class="btn primary" type="button" data-go="${n}">Далее: ${t} →</button>`}</div>`)
    }
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-go]");
      b && loStep(+b.dataset.go)
    }), f("partChips").addEventListener("click", e => {
      const b = e.target.closest("[data-pchip]");
      b && (b.dataset.pchip === "+" ? loAddPart() : loSelect(b.dataset.pchip))
    }), f("stepNav").addEventListener("click", e => {
      const b = e.target.closest("[data-step]");
      b && loStep(+b.dataset.step)
    });
    const mc = f("moreChk");
    mc && (mc.onchange = () => {
      Ue(mc.checked ? "adv" : "simple"), Ze(), ue()
    });
    const g = f("mbGo");
    g && (g.onclick = e => {
      e.preventDefault(), document.body.classList.contains("steps-on") ? loStep(2) : f("sumCard").scrollIntoView({
        behavior: "smooth"
      })
    }), loStep(1), loSteps()
  }

  function loSteps() {
    const s = (i, t) => {
        const e = f("stS" + i);
        e && (e.textContent = t)
      },
      m = Ct();
    s(1, [H ? (kn() && loGc ? "G-code: " + loGc : H.name) : "загрузите файл", (Nt[l.tech] || {}).name + (m ? " · " + m.name : ""), l.basket.length ? `${l.basket.length} ${loPl(l.basket.length,"деталь","детали","деталей")}` : `${S(+l.part.qty||1)} шт`].join(" · ")), s(2, (f("sumTotal") || {}).textContent || "");
    document.body.classList.toggle("steps-on", l.mode === "staff" || l.mode === "pro");
    const mc = f("moreChk");
    mc && (mc.checked = l.mode !== "simple", mc.closest("label").hidden = !0);
    const pc = f("partChips");
    if (pc) {
      const ps = l.basket.filter(b => loGeo.has(b.id));
      pc.hidden = !loCur || !ps.length, pc.hidden || (pc.innerHTML = ps.map(b => `<button type="button" data-pchip="${J(b.id)}" class="${b.id===loCur?"on":""}">${J(b.name)} ×${S(b.qty)}</button>`).join("") + '<button type="button" data-pchip="+">+ деталь</button>')
    }
  }

  function loAddPart() {
    loStartParts();
    const i = f("fileInput");
    i && i.click()
  }

  function ki(t) {
    if (H && l.blocks.basket) {
      if (!loCur) {
        loStartParts(), at(), V("Деталь в заказе. «+ Деталь» — добавить следующую");
        return
      }
      loDup(loCur);
      return
    }
    const e = Pe();
    if (!ds(e)) {
      V("Нет данных о расходе: загрузите модель или введите данные слайсера");
      return
    }
    l.basket.push(e), at(), t || V(`В заказе: ${e.name}, ${e.qty} шт (${Nt[e.tech].name})`)
  }

  function Ei() {
    const t = H.pos,
      e = t.length / 9,
      n = new ArrayBuffer(84 + e * 50),
      a = new DataView(n);
    a.setUint32(80, e, !0);
    for (let o = 0, s = 84; o < e; o++, s += 50)
      for (let i = 0; i < 9; i++) a.setFloat32(s + 12 + i * 4, t[o * 9 + i], !0);
    return n
  }
  const qa = (t, e) => {
    const n = {};
    for (const a of t)(n[a.source === "user" ? "Мои профили" : a.vendor] = n[a.source === "user" ? "Мои профили" : a.vendor] || []).push(a);
    return Object.entries(n).map(([a, o]) => `<optgroup label="${J(a)}">${o.map(s=>`<option value="${J(s.name)}" ${s.name===e?"selected":""}>${J(s.name)}</option>`).join("")}</optgroup>`).join("")
  };
  let Un = null;

  function Da(t) {
    return dt ? (Un && !t || (Un = (async () => {
      const e = await dt.orca.status();
      Pt.status = e.ok ? e.data : {
        found: !1,
        error: e.error
      }, Pt.status.found && await Zn(l.orca.machine || (Pt.status.current || {}).machine), ce()
    })()), Un) : Promise.resolve()
  }
  async function Zn(t) {
    const e = await dt.orca.presets(t || void 0);
    if (!e.ok) {
      ne = e.error;
      return
    }
    const n = Pt.presets = e.data,
      a = n.current || {},
      o = (s, i) => i && s.some(r => r.name === i);
    l.orca.machine = n.machine, o(n.processes, l.orca.process) || (l.orca.process = o(n.processes, a.process) ? a.process : (n.processes[0] || {}).name || ""), o(n.filaments, l.orca.filament) || (l.orca.filament = o(n.filaments, a.filament) ? a.filament : (n.filaments[0] || {}).name || ""), gt()
  }

  function ce() {
    if (!dt) return;
    const t = Pt.status,
      e = Pt.presets,
      n = f("orcaStatus"),
      a = t && t.found && e;
    t ? t.found ? n.innerHTML = "" : n.innerHTML = '<div class="alert warn"><p>OrcaSlicer не найден на этом компьютере. Укажите файл orca-slicer.exe.</p><button class="btn small primary" type="button" data-orca="pick">Указать…</button></div>' : n.innerHTML = '<div class="alert info"><p><span class="spin"></span> Ищу OrcaSlicer…</p></div>', f("orcaSel").hidden = f("orcaOv").hidden = !a, f("btnSlice").disabled = f("btnOrcaOpen").disabled = !a || !H || Ce, a && (f("orcaMachine").innerHTML = qa(e.machines, l.orca.machine), f("orcaProcess").innerHTML = qa(e.processes, l.orca.process), f("orcaFilament").innerHTML = qa(e.filaments, l.orca.filament), document.activeElement !== f("orcaInfill") && (f("orcaInfill").value = l.orca.infill), document.activeElement !== f("orcaWalls") && (f("orcaWalls").value = l.orca.walls), f("orcaSupport").value = l.orca.support, f("orcaAuto").checked = !!l.orca.auto), f("btnSlice").innerHTML = Ce ? '<span class="spin"></span> Нарезаю…' : "Нарезать в OrcaSlicer";
    const o = f("orcaRes");
    if (Ce) {
      o.innerHTML = '<p class="hint">OrcaSlicer режет модель, обычно это 5–30 секунд.</p>';
      return
    }
    if (ne) {
      const c = H && ve(H.st) > 0 && !H.repair;
      o.innerHTML = `<div class="alert bad"><p>Orca: ${J(ne)}${c?" В сетке есть дыры — почините модель и нарежьте снова.":""}</p>${c?'<button class="btn small" type="button" data-orca="repair">Починить и нарезать</button>':""}</div>`;
      return
    }
    if (!ut) {
      o.innerHTML = a && H ? '<p class="hint">Нажмите «Нарезать», чтобы получить точные вес и время из OrcaSlicer.</p>' : "";
      return
    }
    const s = fa(),
      i = ut.settings || {},
      r = lt;
    o.innerHTML = (s ? "" : '<div class="alert warn"><p>Модель изменилась после нарезки — пока считаю по оценке.</p><button class="btn small" type="button" data-orca="slice">Нарезать заново</button></div>') + `<div class="kpis"><div><div class="k">Пластик на 1 шт</div><div class="v">${S(ut.grams,2)} г</div></div><div><div class="k">Печать 1 шт</div><div class="v">${vt(ut.printS||0)}</div></div><div><div class="k">Слоёв</div><div class="v">${S(ut.layers||0)}</div></div></div><div class="cmp">Слой <b>${J(i.layer||"—")}</b> · стенки <b>${J(i.walls||"—")}</b> · заполнение <b>${J(i.infill||"—")}</b> ${J(i.pattern||"")} · поддержки <b>${i.support==="1"?"да":"нет"}</b> · плотность <b>${J(i.density||"—")}</b></div>` + (r ? `<div class="cmp">Для сравнения, оценка калькулятора: <b>${S(r.grams,1)} г</b>, <b>${vt(r.timeS)}</b></div>` : "") + (() => {
      const c = parseFloat(i.cost),
        d = Ct(),
        u = ht();
      return `<div class="cmp">Цена пластика: ${l.orca.useCost&&c>0?`<b>${S(c)} ₽/кг</b> из профиля Orca`:`<b>${S(d.price)} ₽/кг</b> (${J(d.name)} из калькулятора)`}${c>0?` · <label style="cursor:pointer"><input type="checkbox" id="orcaUseCost" ${l.orca.useCost?"checked":""}> брать из Orca (${S(c)})</label>`:""}. Амортизация и электричество — по принтеру <b>${J(u.name)}</b>.</div>`
    })() + (ut.fallback === "classic" ? '<div class="alert info"><p>Генератор стенок Arachne не справился с этой сеткой, поэтому нарезано с классическим. Вес и время могут отличаться на пару процентов.</p></div>' : "") + (ut.warnings && ut.warnings.length ? `<div class="alert warn"><p>${ut.warnings.map(J).join("<br>")}</p></div>` : "") + `<div class="cmp">Нарезано за ${S(ut.elapsedS||0,1)} с. Время без нагрева стола: нагрев берётся из профиля принтера калькулятора.</div>`
  }
  async function Vn() {
    if (!dt || !H || Ce || !Pt.presets) return;
    Ce = !0, ne = null, ce();
    const t = H.ver,
      e = l.orca,
      n = await dt.orca.slice({
        stl: Ei(),
        name: H.name.replace(/\.[^.]+$/, ""),
        machine: e.machine,
        process: e.process,
        filament: e.filament,
        overrides: {
          infill: e.infill === "" ? void 0 : +e.infill,
          walls: e.walls === "" ? void 0 : +e.walls,
          support: e.support
        }
      });
    Ce = !1, n.ok ? (ut = {
      ...n.data,
      ver: t
    }, ut.grams > 0 || (ne = "в G-code нет веса — проверьте плотность пластика в профиле Orca")) : (ne = n.error, ut = null), at(), ce(), n.ok && ut.grams > 0 && V(`Orca: ${S(ut.grams,1)} г, ${vt(ut.printS||0)}`)
  }
  let Si = null;

  function Vt(t) {
    !Ae() || !H || !l.orca.auto && !t || (clearTimeout(Si), Si = setTimeout(() => Da().then(Vn), 300))
  }

  function ar() {
    if (!dt) return;
    document.body.classList.add("desktop"), f("srcOrca").addEventListener("click", e => {
      const n = e.target.closest("[data-orca]");
      n && (n.dataset.orca === "pick" && dt.orca.pick().then(a => (Pt.status = a.ok ? a.data : Pt.status, Pt.status && Pt.status.found ? Zn(l.orca.machine) : null)).then(ce), n.dataset.orca === "slice" && Vn(), n.dataset.orca === "repair" && La().then(() => Vn()))
    }), f("orcaMachine").addEventListener("change", async e => {
      l.orca.machine = e.target.value, await Zn(l.orca.machine), ce(), Vt()
    }), f("orcaProcess").addEventListener("change", e => {
      l.orca.process = e.target.value, gt(), Vt()
    }), f("orcaFilament").addEventListener("change", e => {
      l.orca.filament = e.target.value, gt(), Vt()
    }), f("orcaInfill").addEventListener("change", e => {
      const n = e.target.value.trim();
      l.orca.infill = n === "" ? "" : Math.min(100, Math.max(0, +n || 0)), e.target.value = l.orca.infill, gt(), Vt()
    }), f("orcaWalls").addEventListener("change", e => {
      const n = e.target.value.trim();
      l.orca.walls = n === "" ? "" : Math.min(20, Math.max(1, Math.round(+n) || 1)), e.target.value = l.orca.walls, gt(), Vt()
    }), f("orcaSupport").addEventListener("change", e => {
      l.orca.support = e.target.value, gt(), Vt()
    }), f("orcaAuto").addEventListener("change", e => {
      l.orca.auto = e.target.checked, gt()
    }), f("orcaRes").addEventListener("change", e => {
      e.target.id === "orcaUseCost" && (l.orca.useCost = e.target.checked, at())
    }), f("btnSlice").onclick = Vn, f("btnOrcaOpen").onclick = () => {
      H && dt.orca.open({
        stl: Ei(),
        name: H.name.replace(/\.[^.]+$/, "")
      }).then(e => V(e.ok ? "Модель открыта в OrcaSlicer" : "Не удалось открыть: " + e.error))
    };
    const t = e => ha(e.map(n => new File([n.data], n.name)));
    dt.onOpenFiles(t), dt.pendingFiles().then(e => {
      e.ok && e.data.length && t(e.data)
    }), l.source === "orca" && Da()
  }

  function sr() {
    const t = {};
    try {
      for (let e = 0; e < localStorage.length; e++) {
        const n = localStorage.key(e);
        n.startsWith(pe) && (t[n.slice(pe.length)] = JSON.parse(localStorage.getItem(n)))
      }
    } catch {}
    return JSON.stringify({
      app: "smeta3d",
      version: 2,
      saved: new Date().toISOString(),
      data: t
    }, null, 1)
  }

  function Li(t) {
    const e = JSON.parse(t),
      n = e && e.data;
    if (!n || typeof n != "object") throw new Error("это не файл настроек калькулятора");
    try {
      for (const a in n) localStorage.setItem(pe + a, JSON.stringify(n[a]))
    } catch {
      throw new Error("браузер не дал сохранить")
    }
    location.reload()
  }

  function ir() {
    xe("Перенос профилей", `
    ${dt?`<div><p class="sub">OrcaSlicer</p><p class="hint" id="setOrca">${Pt.status&&Pt.status.found?J(Pt.status.exe):"не найден"}</p><div class="orca-row" style="margin-top:6px"><button class="btn small" type="button" id="setPick">Указать orca-slicer.exe…</button></div></div>`:""}
    <div><p class="sub">Перенос профилей и настроек</p><p class="hint">Принтеры, материалы, ставки, блоки и список заказа. ${dt?"Сохраните в файл или загрузите из файла.":"Скопируйте текст и вставьте его в калькулятор в другом браузере или на другом устройстве."}</p></div>
    <textarea class="plain" id="setText" aria-label="Настройки в формате JSON" placeholder="Вставьте сюда настройки из другой копии калькулятора"></textarea>`, `<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" type="button" id="setExport">${dt?"Сохранить в файл":"Показать мои настройки"}</button>${dt?'<button class="btn" type="button" id="setOpen">Загрузить из файла</button>':""}</div>
     <div class="right"><button class="btn" type="button" id="dlgCancel">Закрыть</button><button class="btn primary" type="button" id="setImport">Загрузить из текста</button></div>`), f("dlgCancel").onclick = Mt, f("setExport").onclick = () => {
      const t = sr();
      if (dt) dt.saveText({
        name: "smeta3d-nastroyki.json",
        text: t,
        filters: [{
          name: "JSON",
          extensions: ["json"]
        }]
      }).then(e => {
        e.ok && e.data && V("Сохранено: " + e.data)
      });
      else {
        f("setText").value = t, f("setText").select();
        try {
          navigator.clipboard.writeText(t).then(() => V("Настройки скопированы"), () => V("Выделено: нажмите Ctrl+C"))
        } catch {
          V("Выделено: нажмите Ctrl+C")
        }
      }
    }, f("setImport").onclick = () => {
      try {
        Li(f("setText").value)
      } catch (t) {
        V("Не удалось загрузить: " + t.message)
      }
    }, dt && (f("setOpen").onclick = () => dt.openText().then(t => {
      if (t.ok && t.data) try {
        Li(t.data)
      } catch (e) {
        V("Не удалось загрузить: " + e.message)
      }
    }), f("setPick").onclick = () => dt.orca.pick().then(async t => {
      t.ok && (Pt.status = t.data, f("setOrca").textContent = t.data.found ? t.data.exe : "не найден", t.data.found && await Zn(l.orca.machine), ce())
    }))
  }
  const ln = {
    common: [{
      k: "name",
      l: "Название",
      t: "text",
      wide: 1
    }, {
      g: "Область печати"
    }, {
      k: "bedX",
      l: "X",
      u: "мм"
    }, {
      k: "bedY",
      l: "Y",
      u: "мм"
    }, {
      k: "bedZ",
      l: "Z",
      u: "мм"
    }, {
      g: "Экономика"
    }, {
      k: "price",
      l: "Стоимость",
      u: "₽",
      s: 1e3
    }, {
      k: "life",
      l: "Окупаемость",
      u: "ч",
      s: 500
    }, {
      k: "maint",
      l: "Расходники, ремонт",
      u: "₽/ч",
      s: .5
    }, {
      k: "power",
      l: "Средняя мощность",
      u: "Вт",
      s: 5
    }],
    fdm: [{
      k: "warmup",
      l: "Нагрев на стол",
      u: "мин",
      s: .5
    }, {
      k: "encl",
      l: "Закрытый корпус (1 — да, 0 — нет)",
      d: p => loEncl(p) ? 1 : 0
    }, {
      g: "Движение"
    }, {
      k: "accel",
      l: "Ускорение",
      u: "мм/с²",
      s: 500
    }, {
      k: "maxFlow",
      l: "Предел потока",
      u: "мм³/с"
    }, {
      k: "tContour",
      l: "Переезд и откат на контур",
      u: "с",
      s: .05
    }],
    sla: [{
      k: "warmup",
      l: "Подготовка стола",
      u: "мин",
      s: .5
    }, {
      g: "Лазер"
    }, {
      k: "overhead",
      l: "Отрыв и разравнивание",
      u: "с/слой",
      s: .5
    }, {
      k: "areaRate",
      l: "Скорость обхода (слой 0.05)",
      u: "мм²/с",
      s: 1
    }],
    dlp: [{
      k: "warmup",
      l: "Подготовка стола",
      u: "мин",
      s: .5
    }, {
      g: "Засветка из профиля смолы"
    }, {
      k: "exp",
      l: "Засветка слоя",
      u: "с",
      s: .1
    }, {
      k: "bottomExp",
      l: "Нижние слои",
      u: "с",
      s: 1
    }, {
      k: "bottomLayers",
      l: "Нижних слоёв",
      u: "шт"
    }, {
      k: "lift",
      l: "Подъём и опускание",
      u: "с/слой",
      s: .1
    }],
    sls: [{
      k: "warmup",
      l: "Нагрев камеры",
      u: "мин",
      s: 5
    }, {
      k: "cool",
      l: "Охлаждение в станке",
      u: "мин",
      s: 10
    }, {
      g: "Производительность"
    }, {
      k: "recoat",
      l: "Нанесение слоя",
      u: "с/слой",
      s: .5
    }, {
      k: "scanRate",
      l: "Спекание",
      u: "см³/ч",
      s: 5
    }],
    tail: [{
      k: "timeCal",
      l: "Поправка времени",
      u: "×",
      s: .01
    }]
  };
  ln.lcd = ln.dlp;
  const or = {
      fdm: [{
        k: "name",
        l: "Название",
        t: "text",
        wide: 1
      }, {
        k: "price",
        l: "Цена за кг",
        u: "₽",
        s: 50
      }, {
        k: "density",
        l: "Плотность",
        u: "г/см³",
        s: .01
      }, {
        k: "maxFlow",
        l: "Макс. поток",
        u: "мм³/с"
      }, {
        k: "minLayer",
        l: "Мин. время слоя",
        u: "с"
      }],
      resin: [{
        k: "name",
        l: "Название",
        t: "text",
        wide: 1
      }, {
        k: "price",
        l: "Цена за литр",
        u: "₽",
        s: 50
      }, {
        k: "density",
        l: "Плотность",
        u: "г/мл",
        s: .01
      }, {
        k: "expMult",
        l: "Множитель засветки",
        u: "×",
        s: .05
      }],
      sls: [{
        k: "name",
        l: "Название",
        t: "text",
        wide: 1
      }, {
        k: "price",
        l: "Цена за кг",
        u: "₽",
        s: 100
      }, {
        k: "density",
        l: "Плотность детали",
        u: "г/см³",
        s: .01
      }, {
        k: "bulk",
        l: "Насыпная плотность",
        u: "г/см³",
        s: .01
      }, {
        k: "refresh",
        l: "Освежение порошка",
        u: "%"
      }]
    },
    We = [
      ["vOuter", "Внешний периметр", .6],
      ["vInner", "Внутр. периметры", .85],
      ["vInfill", "Заполнение", 1],
      ["vSolid", "Сплошные слои", .85],
      ["vSupport", "Поддержки", .6],
      ["vFirst", "Первый слой", .2],
      ["vOv2", "Нависание 25–50%", .18],
      ["vOv3", "Нависание 50–75%", .12],
      ["vOv4", "Нависание 75–100%", .05],
      ["vBridge", "Мосты", .18]
    ],
    Ti = {
      detail: {
        l: "По линиям",
        d: "Каждая скорость задаётся вручную, как в профиле слайсера."
      },
      base: {
        l: "От базовой",
        d: "Одна базовая скорость, остальные — по типичным пропорциям: периметр 60%, заполнение 100%, первый слой 20%, нависания 5–18%."
      },
      hybrid: {
        l: "Гибрид",
        d: "Базовая скорость задаёт все линии, а свои значения вписываются только там, где нужно. Пустое поле — авто от базовой."
      }
    },
    Gn = (t, e) => Math.max(5, Math.round(t * We.find(n => n[0] === e)[2]));

  function Ci(t) {
    if (!t || t.tech !== "fdm" || !t.speedMode || t.speedMode === "detail") return t;
    const e = {
        ...t
      },
      n = +t.vBase || +t.vInfill || 200;
    for (const [a] of We) e[a] = t.speedMode === "base" ? Gn(n, a) : t.vOver && +t.vOver[a] > 0 ? +t.vOver[a] : Gn(n, a);
    return e
  }

  function rr(t) {
    const e = {
      mode: t.speedMode || "detail",
      base: +t.vBase || +t.vInfill || 200,
      detail: {},
      over: {
        ...t.vOver || {}
      }
    };
    for (const [o] of We) e.detail[o] = t[o];
    const n = () => {
        const o = parseFloat(f("sp_base").value);
        o > 0 && (e.base = o);
        for (const [s] of We) {
          const i = f("sp_" + s).value.trim();
          e.mode === "detail" && i !== "" && (e.detail[s] = Math.max(1, parseFloat(i) || 0)), e.mode === "hybrid" && (i === "" ? delete e.over[s] : e.over[s] = Math.max(1, parseFloat(i) || 0))
        }
      },
      a = () => {
        f("spBlock").innerHTML = `<p class="sub">Скорости</p>
      <div class="seg" id="spMode">${Object.entries(Ti).map(([o,s])=>`<button type="button" data-m="${o}" class="${e.mode===o?"on":""}">${s.l}</button>`).join("")}</div>
      <small class="cap">${Ti[e.mode].d}</small>
      <div class="grid"><label class="field"><span class="lbl">Базовая скорость</span><span class="inp"><input id="sp_base" type="number" min="5" step="5" value="${e.base}" ${e.mode==="detail"?"disabled":""}><em>мм/с</em></span></label></div>
      <div class="grid">${We.map(([o,s])=>{const i=Gn(e.base,o),r=e.mode==="detail"?e.detail[o]:e.mode==="base"?i:e.over[o]??"";return`<label class="field"><span class="lbl">${s}</span><span class="inp"><input id="sp_${o}" type="number" min="1" step="5" value="${r??""}" placeholder="авто ${i}" ${e.mode==="base"?"disabled":""}><em>мм/с</em></span></label>`}).join("")}</div>`, f("spMode").onclick = o => {
          const s = o.target.closest("[data-m]");
          s && (n(), e.mode = s.dataset.m, a())
        }, f("sp_base").oninput = () => {
          n(), We.forEach(([o]) => {
            const s = f("sp_" + o),
              i = Gn(e.base, o);
            s.placeholder = "авто " + i, e.mode === "base" && (s.value = i)
          })
        }
      };
    return a(), () => {
      n();
      const o = {
        speedMode: e.mode,
        vBase: e.base,
        vOver: {
          ...e.over
        }
      };
      return e.mode === "detail" && Object.assign(o, e.detail), o
    }
  }

  function xe(t, e, n) {
    f("dlgTitle").textContent = t, f("dlgBody").innerHTML = e, f("dlgFoot").innerHTML = n, f("dlg").hidden = !1;
    const a = f("dlgBody").querySelector("input");
    a && a.focus()
  }

  function Mt() {
    f("dlg").hidden = !0
  }

  function lr(t, e) {
    let n = '<div class="grid">';
    for (const a of t) {
      if (a.g) {
        n += `</div><p class="sub">${a.g}</p><div class="grid">`;
        continue
      }
      n += `<label class="field" ${a.wide?'class="u-full"':""}><span class="lbl">${a.l}</span><span class="inp"><input id="f_${a.k}" type="${a.t||"number"}" ${a.t?"":`step="${a.s||1}" min="0"`} value="${J(e[a.k]??(a.d?a.d(e):""))}">${a.u?`<em>${a.u}</em>`:""}</span></label>`
    }
    return n + "</div>"
  }

  function cr(t) {
    const e = {};
    for (const n of t) {
      if (n.g) continue;
      const a = f("f_" + n.k).value;
      e[n.k] = n.t ? a.trim() : Math.max(0, parseFloat(a) || 0)
    }
    return e
  }

  function de(t, e, n) {
    if (l.mode === "simple") {
      V("Свои принтеры и материалы можно добавить в Расширенном режиме");
      return
    }
    const a = t === "printer",
      o = n && a ? n.tech : l.tech,
      s = n && !a ? n.tech : cn(o),
      i = a ? [...ln.common, ...ln[o], ...ln.tail] : or[s],
      r = n || (a ? ht() : Ct()),
      c = e === "edit" ? r : {
        ...r,
        id: null,
        name: "",
        off: !1
      },
      d = a ? yn(o) : l.materials.filter(L => L.tech === s),
      u = a ? l.printers : l.materials,
      p = !n || (a ? o === l.tech : s === cn(l.tech));
    xe((e === "edit" ? "Изменить " : "Новый ") + (a ? `принтер ${Nt[o].name}` : "материал"), lr(i, c) + (a && o === "fdm" ? '<div id="spBlock" class="sp-block"></div>' : ""), `${e==="edit"&&d.length>1?'<button class="btn danger" type="button" id="dlgDel">Удалить</button>':""}<div class="right"><button class="btn" type="button" id="dlgCancel">Отмена</button><button class="btn primary" type="button" id="dlgSave">Сохранить</button></div>`), f("dlgCancel").onclick = Mt;
    const x = a && o === "fdm" ? rr(c) : null;
    f("dlgSave").onclick = () => {
      const L = cr(i);
      if (x && Object.assign(L, x()), !L.name) {
        V("Укажите название");
        return
      }
      if (a && (!L.bedX || !L.bedY || !L.bedZ)) {
        V("Укажите размеры области печати");
        return
      }
      if (!a && !L.density) {
        V("Укажите плотность");
        return
      }
      if (e === "edit") Object.assign(r, L);
      else {
        const P = (a ? "p_" : "m_") + Date.now().toString(36);
        u.push({
          ...r,
          ...L,
          id: P,
          off: !1,
          tech: a ? o : s
        }), p && (l.sel[l.tech][a ? "printer" : "material"] = P)
      }
      Mt(), ue(), V("Профиль сохранён в этом браузере")
    };
    const m = f("dlgDel");
    m && (m.onclick = () => {
      if (!m.dataset.sure) {
        m.dataset.sure = 1, m.textContent = "Точно удалить?";
        return
      }
      u.splice(u.indexOf(r), 1), p && (l.sel[l.tech][a ? "printer" : "material"] = Qe(a ? yn() : gn())[0].id), Mt(), ue(), V("Профиль удалён")
    })
  }

  function dr() {
    if (!lt) return;
    const t = ht(),
      e = tt.has(l.tech),
      n = e ? "resin" : "fdm",
      a = e ? lt.plateS : lt.timeS,
      o = e ? lt.plateRaw : lt.timeRaw,
      s = e ? lt.ml : lt.grams,
      i = e ? lt.mlRaw : lt.gramsRaw,
      r = e ? "мл" : "г";
    xe("Сверка со слайсером", `<p class="hint">Нарежьте эту модель в слайсере с теми же настройками и впишите результат ${e?"для стола с одной деталью":"без нагрева стола"}. Поправка времени сохранится в профиле «${J(t.name)}».</p>
     <div class="grid"><label class="field"><span class="lbl">Время, ч</span><span class="inp"><input id="cH" type="number" min="0" step="1" value="${Math.floor(a/3600)}"></span></label>
       <label class="field"><span class="lbl">мин</span><span class="inp"><input id="cM" type="number" min="0" max="59" step="1" value="${Math.round(a%3600/60)}"></span></label>
       <label class="field"><span class="lbl">${e?"Смола":"Вес"}</span><span class="inp"><input id="cG" type="number" min="0" step="0.1" value="${s.toFixed(1)}"><em>${r}</em></span></label></div>
     <p class="hint">Без поправок: ${vt(o)}, ${S(i,1)} ${r}.</p>`, '<button class="btn" type="button" id="cReset">Сбросить поправки</button><div class="right"><button class="btn" type="button" id="dlgCancel">Отмена</button><button class="btn primary" type="button" id="cSave">Применить</button></div>'), f("dlgCancel").onclick = Mt, f("cReset").onclick = () => {
      t.timeCal = 1, l.massCal[n] = 1, Mt(), at(), V("Поправки сброшены")
    }, f("cSave").onclick = () => {
      const c = (parseFloat(f("cH").value) || 0) * 3600 + (parseFloat(f("cM").value) || 0) * 60,
        d = parseFloat(f("cG").value) || 0;
      c > 0 && (t.timeCal = Math.min(4, Math.max(.25, c / o))), d > 0 && (l.massCal[n] = Math.min(2.5, Math.max(.4, d / i))), Mt(), at(), V(`Поправки: время ×${S(t.timeCal,2)}, ${e?"смола":"вес"} ×${S(l.massCal[n],2)}`)
    }
  }

  function ue() {
    Ne(), Ln(), Me(), ft(), at()
  }

  function _a() {
    if (l.access !== "none") {
      Ue(l.access === "friend" ? "pro" : l.access);
      return
    }
    const t = +(localStorage.getItem("fdmcalc.lock") || 0);
    if (Date.now() < t) {
      V(`Слишком много попыток. Подождите ${Math.ceil((t-Date.now())/1e3)} с`);
      return
    }
    xe("Вход", '<p class="hint">Пароль сотрудника или владельца.</p><label class="field"><span class="inp"><input id="engPw" type="password" autocomplete="current-password" aria-label="Пароль"></span></label><p class="hint bad-text" id="engErr" hidden>Неверный пароль</p><label class="check"><input type="checkbox" id="engRem">Запомнить на этом устройстве на 30 дней</label>', '<div class="right"><button class="btn" type="button" id="dlgCancel">Отмена</button><button class="btn primary" type="button" id="engOk">Войти</button></div>');
    const e = async () => {
      const n = f("engPw").value;
      f("engOk").disabled = !0, f("engOk").textContent = "Проверяю…";
      const a = loPass(),
        o = await ea(n, a.pro) ? "pro" : a.friend && await ea(n, a.friend) ? "friend" : await ea(n, a.staff) ? "staff" : null;
      if (f("engOk").disabled = !1, f("engOk").textContent = "Войти", o) {
        localStorage.removeItem("fdmcalc.fails"), loRem = !!(f("engRem") && f("engRem").checked), Mt(), ur(o);
        return
      }
      const s = +(localStorage.getItem("fdmcalc.fails") || 0) + 1;
      if (localStorage.setItem("fdmcalc.fails", s), s >= 5) {
        localStorage.setItem("fdmcalc.lock", Date.now() + 6e4), localStorage.removeItem("fdmcalc.fails"), Mt(), V("5 неверных попыток — вход закрыт на минуту");
        return
      }
      f("engErr").hidden = !1, f("engPw").select()
    };
    f("engOk").onclick = e, f("dlgCancel").onclick = Mt, f("engPw").addEventListener("keydown", n => {
      n.key === "Enter" && e()
    })
  }

  function ur(t) {
    Wa(t), t === "friend" && loFrLoad(), Ue(t === "friend" ? "pro" : t), t === "friend" && (Ne(), ue()), V(t === "friend" ? "Режим «Друзья»: свои ставки — ваши принтеры, материалы и цены хранятся в этом браузере и не меняются, когда мастерская публикует свои. Нет паролей, видимости полей и публикации" : t === "pro" ? "Режим «Бизнес»: ставки, профили, налоги, пароли" : "Режим «Сотрудник»: себестоимость, наценка в пределах допуска, КП, список заказа")
  }

  function fr() {
    zo();
    let t = [];
    document.querySelector(".brand").addEventListener("click", () => {
      const i = Date.now();
      t = t.filter(r => i - r < 2500), t.push(i), t.length >= 5 && (t = [], _a())
    }), document.addEventListener("keydown", i => {
      i.ctrlKey && i.altKey && (i.key === "e" || i.key === "E" || i.code === "KeyE") && (i.preventDefault(), l.access === "none" ? _a() : loOut())
    }), /engineer|admin/i.test(location.hash) && l.access === "none" && setTimeout(_a, 300), f("btnLogout").onclick = loOut, f("btnAddPart").onclick = loAddPart, f("btnAddPart2").onclick = loAddPart, document.querySelectorAll("[data-as]").forEach(i => i.onclick = () => {
      Jt && f("visPrevF").click(), Ue(i.dataset.as), Ze(), ue(), window.scrollTo({
        top: 0
      })
    }), f("asBarX").onclick = () => {
      Jt ? f("visPrevF").click() : (Ue("pro"), Ze(), ue(), loWs(!0)), at()
    }, f("btnWs").onclick = () => {
      loWs(!document.body.classList.contains("ws")), window.scrollTo({
        top: 0
      })
    }, f("unpubBadge").onclick = () => {
      loWs(!0), loMTab("acc");
      const p = f("ratesPub");
      p && (p.scrollIntoView({
        block: "center"
      }), p.click())
    }, f("lnkLogin").onclick = i => {
      i.preventDefault(), _a()
    }, f("optRows").addEventListener("change", i => {
      const r = i.target,
        c = l.money.opt[+r.dataset.opt];
      if (!c) return;
      let d = Math.max(0, parseFloat(r.value) || 0);
      if (r.dataset.f === "d") {
        if (d = Math.min(90, d), l.mode !== "pro") {
          const u = Math.max(0, +l.money.mgrTol || 0);
          d > u && (d = u, V(`Сотруднику скидка за опт — не больше ${S(u)}%`))
        }
      } else d = Math.max(1, Math.round(d));
      c[r.dataset.f] = d, l.money.opt.sort((u, p) => u.q - p.q), r.blur(), Nn(), at()
    }), f("optRows").addEventListener("click", i => {
      const r = i.target.closest("[data-optdel]");
      r && (l.money.opt.splice(+r.dataset.optdel, 1), Nn(), at())
    }), f("optAdd").onclick = () => {
      const i = l.money.opt,
        r = i[i.length - 1];
      i.push({
        q: r ? r.q * 2 : 10,
        d: r ? Math.min(+l.money.mgrTol || 25, r.d + 5) : 5
      }), Nn(), at()
    }, ["mkPresets", "mkPresets2"].filter(q => f(q)).forEach(q => f(q).addEventListener("click", i => {
      const r = i.target.closest("[data-mk]");
      r && (l.money.markup = l.money.baseMarkup = +l.money.presets[+r.dataset.mk].v, ft(), at())
    })), ["mk", "adj", "mk2", "adj2"].filter(i => f(i)).forEach(i => {
      f(i).addEventListener("change", () => {
        Mi(!0), at(), ft();
        const q = f(i),
          v = Xs(q.dataset.bind);
        q.value = v;
        const w = f({
          mk: "mk2",
          mk2: "mk",
          adj: "adj2",
          adj2: "adj"
        } [i]);
        w && (w.value = v)
      }), f(i).addEventListener("input", () => {
        const q = f({
          mk: "mk2",
          mk2: "mk",
          adj: "adj2",
          adj2: "adj"
        } [i]);
        q && (q.value = f(i).value)
      })
    }), f("mkEdit").addEventListener("input", i => {
      const r = i.target,
        c = l.money.presets[+r.dataset.pre];
      if (c) {
        if (r.dataset.f === "n") c.n = r.value;
        else {
          const d = parseFloat(r.value);
          Number.isFinite(d) && d >= 0 && (c.v = d)
        }
        gi(), at()
      }
    }), f("ratesDl").onclick = async () => {
      const i = xi($i());
      const r = new Blob([i], {
          type: "text/plain"
        }),
        c = document.createElement("a");
      c.href = URL.createObjectURL(r), c.download = "rates.dat", document.body.appendChild(c), c.click(), setTimeout(() => {
        URL.revokeObjectURL(c.href), c.remove()
      }, 500), V("Файл rates.dat скачан — загрузите его в репозиторий сайта")
    }, f("ratesHow").onclick = () => {
      xe("Как обновить параметры на сайте", '<p><b>Быстро:</b> нажмите «Опубликовать на сайт». В первый раз калькулятор попросит ключ GitHub и покажет, как его получить (2 минуты). Дальше — одна кнопка.</p><p><b>Вручную:</b></p><ol class="how"><li>Нажмите «Скачать файл ставок» — сохранится <b>rates.dat</b>.</li><li>Откройте <b>github.com/NeroArtNuar/Calculator-3d-printing</b> и войдите в свой аккаунт.</li><li>«Add file» → «Upload files», перетащите rates.dat, нажмите «Commit changes».</li></ol><p class="hint">Через 1–5 минут все посетители и сотрудники считают по новым ставкам. Пароли, принтеры, материалы и видимость полей обновятся вместе с ними. Менять файл может только владелец аккаунта GitHub — включите на GitHub двухфакторный вход.</p>', '<div class="right"><button class="btn primary" type="button" id="dlgCancel">Понятно</button></div>'), f("dlgCancel").onclick = Mt
    }, f("engPwSave").onclick = async () => {
      if (l.access !== "pro") {
        V("Пароли меняет только владелец");
        return
      }
      const i = f("pwStaff").value,
        r = f("pwPro").value,
        c = f("pwFriend").value;
      if (!i && !r && !c) {
        V("Впишите новый пароль");
        return
      }
      for (const d of [i, r, c])
        if (d && (d.length < 12 || !/[a-zа-я]/i.test(d) || !/\d/.test(d))) {
          V("Пароль — от 12 символов, с буквами и цифрами");
          return
        } l.pass = st(l.pass || K.pass), i && (l.pass.staff = await na(i)), r && (l.pass.pro = await na(r)), c && (l.pass.friend = await na(c)), f("pwStaff").value = f("pwPro").value = f("pwFriend").value = "", gt(), V(fe ? "Пароли сменены. Они начнут действовать после публикации ставок («Опубликовать на сайт» или файл ставок на GitHub)" : "Пароли сменены")
    }, f("busyNow").onclick = () => {
      l.money.busyUntil = "", ft(), at()
    }, f("busyAfter").onclick = () => {
      const i = new Date(+f("busyAfter").dataset.end);
      i.setMinutes(i.getMinutes() - i.getTimezoneOffset()), l.money.busyUntil = i.toISOString().slice(0, 16), ft(), at(), V("Принтер занят до " + Rt(+f("busyAfter").dataset.end))
    }, f("modeSeg").addEventListener("click", i => {
      const r = i.target.closest("[data-mode]");
      r && (Ue(r.dataset.mode), gt())
    }), f("techSeg").addEventListener("keydown", i => {
      const r = ee.indexOf(l.tech),
        c = i.key === "ArrowRight" ? (r + 1) % 5 : i.key === "ArrowLeft" ? (r + 4) % 5 : -1;
      c < 0 || (i.preventDefault(), Ve(ee[c]), f("techSeg").querySelector(`[data-tech="${ee[c]}"]`).focus())
    }), f("strip").addEventListener("click", i => {
      const r = i.target.closest("[data-blk]");
      r && (l.blocks[r.dataset.blk] = !l.blocks[r.dataset.blk], Ze(), at())
    }), f("fileInput").addEventListener("change", i => {
      ha(i.target.files), i.target.value = ""
    });
    const e = f("viewerWrap");
    ["dragenter", "dragover"].forEach(i => e.addEventListener(i, r => {
      r.preventDefault(), f("dropHint").hidden = !1
    })), ["dragleave", "drop"].forEach(i => e.addEventListener(i, r => {
      r.preventDefault(), !(i === "dragleave" && e.contains(r.relatedTarget)) && (f("dropHint").hidden = !0)
    })), e.addEventListener("drop", i => ha(i.dataTransfer.files)), f("demoSelect").addEventListener("change", i => {
      i.target.value && Fs(i.target.value), i.target.value = ""
    }), document.querySelectorAll("[data-rot]").forEach(i => i.addEventListener("click", () => {
      if (!H) return;
      const r = new THREE.Matrix4,
        c = Math.PI / 2,
        d = (i.dataset.rot === "x" ? r.makeRotationX(c) : i.dataset.rot === "y" ? r.makeRotationY(c) : r.makeRotationZ(c)).elements;
      Le(H.pos, d), Wt(i.dataset.rot === "z")
    })), f("btnFlat").onclick = Os, f("btnOrient").onclick = Sa, f("btnRepair").onclick = La, f("btnOver").onclick = () => {
      En = !En, f("btnOver").classList.toggle("on", En), ge()
    }, f("btnCam").onclick = Sn;
    const n = ["supPanel", "posPanel"],
      a = i => {
        n.forEach(r => {
          f(r).hidden = r === i ? !f(r).hidden : !0
        }), f("btnPos").classList.toggle("on", !f("posPanel").hidden), Ft(), Hn()
      };
    f("btnSup").onclick = () => {
      a("supPanel")
    }, f("btnPos").onclick = () => a("posPanel"), document.querySelectorAll("[data-close]").forEach(i => {
      i.onclick = () => a(i.dataset.close)
    }), document.addEventListener("keydown", i => {
      if (i.key !== "Escape" || !f("dlg").hidden) return;
      const r = [...document.querySelectorAll(".tool-panel")].find(c => !c.hidden);
      r && a(r.id)
    }), f("btnFlat2").onclick = Os, fo(), vo(), $o(), document.querySelector('[data-bind="slicer.supportType"]').addEventListener("change", i => {
      G && G.fdm && qe(i.target.value)
    }), document.querySelector('[data-bind="slicer.supports"]').addEventListener("change", i => {
      i.target.value === "off" && G && G.fdm ? je() : i.target.value === "auto" && l.mode === "simple" && Bn()
    }), f("btnScale").onclick = i => {
      i.stopPropagation(), f("scalePop").hidden = !f("scalePop").hidden, ka()
    }, document.addEventListener("pointerdown", i => {
      i.target.closest("#scalePop, #btnScale") || (f("scalePop").hidden = !0)
    }), f("scaleRange").addEventListener("input", i => {
      if (!H) return;
      const r = +i.target.value,
        c = r / (H.scale * 100);
      ct && ct.scale.setScalar(c), xt && xt.scale.setScalar(c), zt = !0, f("scaleVal").textContent = S(r) + "%", f("scaleNum").value = r, Ea(c)
    }), f("scaleRange").addEventListener("change", i => zn(+i.target.value)), f("scaleNum").addEventListener("change", i => zn(parseFloat(i.target.value))), ["scaleLock", "scaleLock2"].forEach(i => f(i).addEventListener("change", r => {
      l.part.scaleLock = r.target.checked, gt(), Ea(1)
    })), f("scalePop").addEventListener("click", i => {
      const r = i.target.closest("[data-scale]");
      r && zn(+r.dataset.scale), i.target.closest("#scaleFit") && ko()
    }), f("techMain").addEventListener("click", i => {
      const r = i.target.closest("[data-main]");
      r && Ve(r.dataset.main === "resin" ? l.resinSub || "sla" : r.dataset.main)
    }), f("techSub").addEventListener("click", i => {
      const r = i.target.closest("[data-sub]");
      r && Ve(r.dataset.sub)
    }), f("modelAlerts").addEventListener("click", i => {
      const r = i.target.closest("[data-unit]");
      if (r) {
        f("unitSel").value = r.dataset.unit, f("unitSel").dispatchEvent(new Event("change"));
        return
      }
      i.target.closest('[data-act="orient"]') && Sa(), i.target.closest('[data-act="repair"]') && La(), i.target.closest('[data-act="undo"]') && So()
    });
    const o = (i, r) => {
      if (!H || !(i > 0) || !(r > 0)) return !1;
      const c = i * r / (H.unit * H.scale);
      return Math.abs(c - 1) < 1e-9 ? !1 : (Yi(H.pos, c), H.unit = i, H.scale = r, f("scalePct").value = +(r * 100).toFixed(2), f("unitSel").value = String(i), !0)
    };
    f("unitSel").addEventListener("change", i => {
      o(parseFloat(i.target.value), H && H.scale) && Wt()
    }), f("scalePct").addEventListener("change", i => {
      o(H && H.unit, parseFloat(i.target.value) / 100) && Wt()
    });
    const s = (i, r) => {
      if (!H || f("busy").hidden === !1) return;
      const c = "dim" + i,
        d = H.st[c];
      if (!(r > 0) || !(d > 0) || Math.abs(r - d) < 1e-6) return;
      if (l.part.scaleLock !== !1) {
        o(H.unit, H.scale * r / d) && Wt();
        return
      }
      const u = r / d,
        p = H.pos,
        x = {
          X: 0,
          Y: 1,
          Z: 2
        } [i];
      for (let m = x; m < p.length; m += 3) p[m] *= u;
      tn(p), Wt(), V(`Ось ${i}: ${S(d,1)} → ${S(r,1)} мм, остальные оси без изменений`)
    };
    ["X", "Y", "Z"].forEach(i => {
      f("dim" + i).addEventListener("change", r => s(i, parseFloat(r.target.value))), f("s" + i).addEventListener("change", r => s(i, parseFloat(r.target.value)))
    }), f("srcSeg").addEventListener("click", i => {
      const r = i.target.closest("button");
      if (r && r.dataset.src === "manual" && lt && l.tech !== "sls") {
        const R = tt.has(l.tech),
          m = R ? l.manualResin : l.manual;
        if (!(R ? m.ml > 0 : m.g > 0)) {
          const s = R ? lt.plateS || 0 : lt.timeS || 0;
          R ? m.ml = +(+lt.ml).toFixed(1) : m.g = +(+lt.grams).toFixed(1), m.h = Math.floor(s / 3600), m.m = Math.round(s % 3600 / 60), m.m === 60 && (m.h++, m.m = 0), setTimeout(() => {
            const n = f("manualNote");
            n && (n.textContent = "Подставили оценку по модели. Замените её весом и временем из слайсера.")
          }, 0), ft()
        }
      }
      r && (Ge(r.dataset.src), at(), Ae() && Da().then(() => {
        fa() || Vt(!0)
      }))
    }), f("presets").addEventListener("click", i => {
      const r = i.target.closest("[data-preset]");
      if (!r) return;
      const c = jn();
      c && (Object.assign(qn(), pn[c][r.dataset.preset].set(l.slicer.nozzle), {
        preset: r.dataset.preset
      }), ft(), at())
    }), f("printerSel").addEventListener("change", i => {
      l.sel[l.tech].printer = i.target.value, ue()
    }), f("matSel").addEventListener("change", i => {
      l.sel[l.tech].material = i.target.value, ue()
    }), f("chamberChk").addEventListener("change", i => {
      const m = Ct(),
        a = loSa(m),
        v = i.target.checked;
      l.access === "pro" || l.access === "friend" ? (delete loCh[m.id], v === a ? delete m.chamber : m.chamber = v) : v === (m.chamber != null ? !!m.chamber : a) ? delete loCh[m.id] : loCh[m.id] = v, nt.set("lo.chamber", loCh), at()
    }), f("editPrinter").onclick = () => de("printer", "edit"), f("addPrinter").onclick = () => de("printer", "add"), f("editMat").onclick = () => de("material", "edit"), f("addMat").onclick = () => de("material", "add"), f("dlgClose").onclick = Mt, f("dlg").addEventListener("click", i => {
      /* клик по фону окно не закрывает — только крестик, «Отмена», «Сохранить» или Esc */
    }), document.addEventListener("keydown", i => {
      i.key === "Escape" && !f("dlg").hidden && Mt()
    }), f("btnAddBasket").onclick = () => ki(!1), f("btnClearBasket").onclick = () => {
      l.basket = [], loCur = null, loGeo.forEach(g => g.geom && g.geom.dispose()), loGeo.clear(), at(), typeof loSaveM == "function" && loSaveM(), V("Список заказа очищен — считаем одну деталь")
    }, loKp(), f("leadBtns").addEventListener("click", i => {
      const r = i.target.closest("[data-lead]");
      r && loLeadGo(r.dataset.lead)
    }), f("basket").addEventListener("click", i => {
      const r = i.target.closest("[data-del]");
      if (r) {
        loDel(r.dataset.del);
        return
      }
      const u = i.target.closest("[data-dup]");
      if (u) {
        loDup(u.dataset.dup);
        return
      }
      const v = i.target.closest("[data-sel]");
      v && loSelect(v.dataset.sel)
    }), f("basket").addEventListener("change", i => {
      const b = i.target.closest("[data-bm]");
      if (b) {
        const c = l.basket.find(d => d.id === b.dataset.bm),
          m0 = c && l.materials.find(d => d.id === c.materialId),
          m1 = l.materials.find(d => d.id === b.value);
        if (c && m1 && c.id === loCur) {
          l.sel[c.tech] && (l.sel[c.tech].material = m1.id), Ne(), at();
          return
        }
        c && m1 && (c.tech !== "sla" && !tt.has(c.tech) && m0 && m0.density > 0 && (c.grams = c.grams * m1.density / m0.density), c.tech === "sls" && c.vol > 0 && (c.grams = c.vol * m1.density), c.materialId = m1.id, delete c.chamber, at());
        return
      }
      const r = i.target.closest("[data-bq]");
      if (!r) return;
      const c = l.basket.find(d => d.id === r.dataset.bq);
      if (!c) return;
      let d = Math.round(+r.value);
      d >= 1 || (d = 1), d > 1e5 && (d = 1e5), c.id === loCur ? (l.part.qty = d, ft()) : c.qty = d, at()
    }), f("tiers").addEventListener("click", i => {
      const r = i.target.closest("[data-qty]");
      r && (l.part.qty = +r.dataset.qty, ft(), at())
    }), f("btnCopy").onclick = i => {
      i.preventDefault(), i.stopPropagation();
      const r = f("kpText"),
        c = r.value,
        d = () => {
          f("kpBox").open = !0, r.focus(), r.select();
          let u = !1;
          try {
            u = document.execCommand("copy")
          } catch {}
          V(u ? "Текст КП скопирован" : "Текст выделен: нажмите Ctrl+C")
        };
      navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(c).then(() => V("Текст КП скопирован"), d) : d()
    }, f("mbGo").onclick = () => f("sumCard").scrollIntoView({
      behavior: "smooth",
      block: "start"
    }), f("btnSettings").onclick = ir, f("btnReset").onclick = () => {
      const i = f("btnReset");
      if (!i.dataset.sure) {
        i.dataset.sure = 1, i.style.borderColor = "var(--bad)", i.style.color = "var(--bad)", V("Нажмите ещё раз, чтобы сбросить настройки"), setTimeout(() => {
          delete i.dataset.sure, i.style.borderColor = "", i.style.color = ""
        }, 3500);
        return
      }
      delete i.dataset.sure, i.style.borderColor = "", i.style.color = "", Object.assign(l.slicer, st(Ya)), Object.assign(l.sla, st(Jn)), Object.assign(l.sls, st(Xa)), Object.assign(l.money, st(Qn)), Object.assign(l.blocks, st(hn)), Ze(), Object.assign(l.part, {
        ...st(mn),
        name: l.part.name
      }), l.massCal = {
        fdm: 1,
        resin: 1
      }, ft(), Ne(), at(), V("Настройки сброшены, профили сохранены")
    }
  }
  const mr = {
    "slicer.nozzle": "Диаметр сопла. Ширина линии ≈ 1,05 × сопло.",
    "slicer.layer": "Толще слой — быстрее, но заметнее ступеньки.",
    "slicer.walls": "Стенки по контуру — главное для прочности и веса.",
    "slicer.top": "Сплошные слои сверху и снизу: закрывают заполнение.",
    "slicer.infill": "Плотность решётки внутри детали.",
    "slicer.supports": "«Где нужны» — под нависаниями круче 45°.",
    "slicer.supportType": "Древовидные легче снимаются и тратят меньше пластика.",
    "part.name": "Попадает в выписку и КП.",
    "part.qty": "",
    "part.perPlate": "0 — посчитать по габаритам стола.",
    "part.postMin": "Ручная доводка каждой детали: снятие поддержек, зачистка, пескоструй.",
    "part.inserts": "Резьбовые латунные втулки, магниты — на деталь.",
    "part.insertPrice": "Закупка одной втулки.",
    "part.paint": "Грунт, краска и работа — на деталь.",
    "money.cadH": "Если модель делаете вы.",
    "money.cadRate": "Час работы в CAD.",
    "money.packaging": "На весь заказ.",
    "money.markup": "100% — цена вдвое выше себестоимости.",
    "money.adjust": "Минус — скидка, плюс — надбавка к цене с наценкой.",
    "money.minOrder": "Если себестоимость с наценкой меньше — счёт выставляется на минимум. «НДС сверху»: 5 000 ₽ → клиент платит 6 100 ₽. «НДС внутри»: клиент платит 5 000 ₽, из них НДС 902 ₽.",
    "money.taxRev": "Цена = сумма ÷ (1 − ставка), чтобы после налога осталось нужное.",
    "money.vat": "Прибавляется сверху к итоговой цене.",
    "money.rate": "Час вашего времени: приём, снятие, обработка.",
    "money.setupMin": "Один раз на заказ: проверка модели, нарезка, переписка. Входит в подготовку заказа.",
    "money.plateMin": "На каждый стол: снять детали, подготовить лист.",
    "money.kwh": "Цена киловатт-часа по счёту.",
    "money.kwhNight": "Ночная цена кВт·ч.",
    "money.nightFrom": "Начало ночного тарифа.",
    "money.nightTo": "Конец ночного тарифа.",
    "money.risk": "Доля деталей, которые придётся перепечатать.",
    "money.waste": "Продувка, концы катушек, неудачные старты.",
    "money.printers": "Сколько одинаковых принтеров печатают заказ параллельно.",
    "money.hoursPerDay": "Сколько часов в сутки реально печатаете — для срока в днях.",
    "part.leadDays": "Сколько рабочих дней обещаете клиенту. Пусто — срок считает калькулятор. Попадает в смету, выписку и КП.",
    "money.deadline": "Срок клиента. Пусто — без срока.",
    "money.busyUntil": "Когда принтер освободится от других заказов.",
    "money.start": "Пусто — как только принтер свободен. Влияет на ночной тариф.",
    "money.rushPct": "Включается сама, если успеть можно только вне очереди.",
    "money.prepMk": "Приём заказа, подготовка и снятие стола, прогрев — разово на заказ. 0% — по себестоимости: одна деталь не дорожает в разы.",
    "money.mgrTol": "Насколько в «Расширенном» можно сдвинуть наценку и скидку.",
    "sla.share": "Общий: время слоёв и мойки делится с другими заказами по занятой площади. «Только этот заказ» — платит за весь стол.",
    "sla.fill": "Насколько обычно заполнен стол заказами. Меньше — дороже штучные детали.",
    "sla.layer": "Промышленный SLA обычно 0,1 мм; тоньше — глаже, но дольше.",
    "sla.supports": "На платформе — только для плоских деталей без нависаний.",
    "sla.density": "Сложные — для тяжёлых и крупных деталей, связи между опорами.",
    "sla.tilt": "Наклон уменьшает площадь слоя и отрыв, но добавляет опор.",
    "sla.wall": "Полая деталь экономит смолу; нужны дренажные отверстия.",
    "sla.washMin": "Мойка в спирте и УФ-дозасветка — на каждый стол.",
    "sla.washCost": "Спирт, перчатки, фильтры — на каждый стол."
  };

  function pr() {
    document.querySelectorAll("[data-bind]").forEach(t => {
      const e = mr[t.dataset.bind];
      if (!e) return;
      const n = t.closest(".field");
      if (!n || n.querySelector(".cap")) return;
      const a = document.createElement("small");
      a.className = "cap auto-cap", a.textContent = e, n.appendChild(a)
    }), document.querySelectorAll(".field > small.cap:not([id])").forEach(c => c.classList.add("auto-cap"))
  }
  const fe = typeof window < "u" && !!window.__SMETA_SITE__;

  function hr() {
    if (!fe) return !0;
    const t = location.hostname;
    return [
      [110, 101, 114, 111, 97, 114, 116, 110, 117, 97, 114, 46, 103, 105, 116, 104, 117, 98, 46, 105, 111],
      [108, 111, 99, 97, 108, 104, 111, 115, 116],
      [49, 50, 55, 46, 48, 46, 48, 46, 49]
    ].map(n => String.fromCharCode(...n)).includes(t)
  }
  window.addEventListener("DOMContentLoaded", async () => {
    if (!hr()) {
      document.body.innerHTML = '<div style="max-width:520px;margin:15vh auto;padding:24px;font:16px/1.5 system-ui;text-align:center">Этот калькулятор работает только на официальном сайте.<br>Копирование и использование на других сайтах запрещено.</div>';
      return
    }
    if (typeof THREE > "u") {
      document.body.insertAdjacentHTML("afterbegin", '<div class="alert bad" style="margin:16px"><p>Не загрузилась библиотека three.js. Проверьте подключение к интернету.</p></div>');
      return
    } {
      const t = ge;
      ge = function() {
        t(), Wo()
      }
    }
    pr(), Ue(l.mode), Ze(), vi();
    {
      const t = f("leadInp");
      t && t.addEventListener("input", () => {
        t.value.trim() === "" && (l.part.leadDays = 0, at())
      })
    }
    _o(), Bo(), Uo(), Io(), qo(), Do(), eo(), fr(), ar(), To(), Ne(), Ln(), Ge(l.source), ft(), Zt.quiet = !0, await loBoot(), Zt.quiet = !1, Ho(), loPartsInit(), loStepsInit(), loCadInit(), loKpInit(), nr().then(async () => {
      await loRestore();
      const t = f("ratesInfo");
      t && (t.textContent = K.at ? `На сайте сейчас ставки от ${new Date(K.at).toLocaleString("ru-RU")}` : "На сайте — встроенные ставки калькулятора")
    })
  })
})();


/* ===== Длинные подписи: выравнивание рядов и облачко с полным текстом ===== */
(() => {
  const wraps = el => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const tops = new Set([...r.getClientRects()].map(q => Math.round(q.top)));
    return tops.size > 1
  };
  let pend = 0;
  const fitRows = () => {
    pend = 0;
    document.querySelectorAll(".grid").forEach(g => {
      const lbls = [...g.querySelectorAll(":scope > .field > .lbl, :scope > label.field > .lbl")].filter(l => l.offsetParent);
      g.classList.remove("lbl-row");
      if (lbls.length > 1 && lbls.some(wraps)) g.classList.add("lbl-row")
    })
  };
  const schedule = () => { pend || (pend = requestAnimationFrame(fitRows)) };
  window.addEventListener("resize", schedule);
  const start = () => {
    schedule();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "hidden"] })
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();

  let tip = null, cur = null, tm = 0;
  const canvas = document.createElement("canvas").getContext("2d");
  const ownText = e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  const clipped = e => {
    if (e.tagName === "SELECT") {
      const o = e.selectedOptions && e.selectedOptions[0];
      if (!o) return !1;
      const cs = getComputedStyle(e);
      canvas.font = cs.font;
      return canvas.measureText(o.text).width > e.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 16
    }
    if (!ownText(e)) return !1;
    const cs = getComputedStyle(e);
    return e.scrollWidth > e.clientWidth + 1 && (cs.overflowX === "hidden" || cs.textOverflow === "ellipsis")
  };
  const find = t => {
    for (let e = t, i = 0; e && e !== document.body && i < 4; e = e.parentElement, i++) {
      if (e.nodeType !== 1) continue;
      if (clipped(e)) return e;
      if (e.matches(".field, .card, .dialog, section")) break
    }
    return null
  };
  const text = e => e.tagName === "SELECT" ? e.selectedOptions[0].text : (e.innerText || e.textContent || "").trim();
  const hide = () => {
    clearTimeout(tm); cur = null;
    tip && tip.classList.remove("on")
  };
  const show = e => {
    tip || (tip = document.createElement("div"), tip.className = "lo-tip", tip.setAttribute("role", "tooltip"), document.body.appendChild(tip));
    tip.textContent = text(e);
    const r = e.getBoundingClientRect(), w = Math.min(380, innerWidth - 16);
    tip.style.maxWidth = w + "px";
    tip.style.left = "0px"; tip.style.top = "0px";
    tip.classList.add("on");
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = Math.max(8, Math.min(r.left, innerWidth - tw - 8)), y = r.bottom + 6;
    y + th > innerHeight - 8 && (y = Math.max(8, r.top - th - 6));
    tip.style.left = x + "px"; tip.style.top = y + "px"
  };
  document.addEventListener("mouseover", ev => {
    const e = find(ev.target);
    if (e === cur) return;
    hide();
    if (e) { cur = e; tm = setTimeout(() => cur === e && show(e), 250) }
  }, !0);
  document.addEventListener("mouseout", ev => { cur && !cur.contains(ev.relatedTarget) && hide() }, !0);
  document.addEventListener("focusin", ev => { const e = find(ev.target); e && e.tagName === "SELECT" && (cur = e, show(e)) }, !0);
  document.addEventListener("focusout", hide, !0);
  document.addEventListener("scroll", hide, !0);
  document.addEventListener("touchstart", ev => {
    const e = find(ev.target);
    if (e && !e.matches("select, input, textarea")) { cur = e; show(e); clearTimeout(tm); tm = setTimeout(hide, 2500) }
  }, { passive: !0 })
})();
