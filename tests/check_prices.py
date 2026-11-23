"""Автопроверка калькулятора: страница открывается без ошибок, все 5 технологий
считают, цены совпадают с эталоном tests/prices.json.

Запуск:   python tests/check_prices.py
Обновить эталон (после намеренной смены ставок):   python tests/check_prices.py --update
Локально без скачивания Chromium:   python tests/check_prices.py --chrome
"""
import json, os, re, struct, sys, threading, http.server, functools, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNAP = os.path.join(ROOT, "tests", "prices.json")
TECHS = ["fdm", "sla", "dlp", "lcd", "sls"]
QTYS = [1, 10, 50]


def box_stl(path, x=80.0, y=60.0, z=40.0):
    v = [(0, 0, 0), (x, 0, 0), (x, y, 0), (0, y, 0), (0, 0, z), (x, 0, z), (x, y, z), (0, y, z)]
    f = [(0, 2, 1), (0, 3, 2), (4, 5, 6), (4, 6, 7), (0, 1, 5), (0, 5, 4),
         (1, 2, 6), (1, 6, 5), (2, 3, 7), (2, 7, 6), (3, 0, 4), (3, 4, 7)]
    with open(path, "wb") as o:
        o.write(b"\0" * 80 + struct.pack("<I", len(f)))
        for a, b, c in f:
            o.write(struct.pack("<3f", 0, 0, 0))
            for i in (a, b, c):
                o.write(struct.pack("<3f", *v[i]))
            o.write(b"\0\0")


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    h = functools.partial(Quiet, directory=ROOT)
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def num(t):
    d = re.sub(r"[^\d]", "", t or "")
    return int(d) if d else None


def main():
    from playwright.sync_api import sync_playwright
    import subprocess
    if subprocess.call([sys.executable, os.path.join(ROOT, "tools", "version.py"), "--check"]):
        sys.exit(1)
    update = "--update" in sys.argv
    srv = serve()
    base = f"http://127.0.0.1:{srv.server_address[1]}/"
    stl = os.path.join(tempfile.mkdtemp(), "box_80x60x40.stl")
    box_stl(stl)
    small = os.path.join(os.path.dirname(stl), "small_30x30x20.stl")
    box_stl(small, 30.0, 30.0, 20.0)
    errors, got = [], {}
    with sync_playwright() as p:
        br = p.chromium.launch(channel="chrome" if "--chrome" in sys.argv else None)
        lib = {"three.min.js": "vendor/three-r128.min.js", "jszip.min.js": "vendor/jszip-3.10.1.min.js"}

        def page(tag):
            # одинаковые дата, часовой пояс и язык при любом запуске; чистый браузер на каждый сценарий
            pg = br.new_page(viewport={"width": 1400, "height": 1000}, timezone_id="Europe/Moscow", locale="ru-RU")
            pg.clock.set_fixed_time("2026-11-18T12:00:00+03:00")
            # ставки — из этой папки, а не с GitHub; библиотеки — из vendor/
            pg.route("https://raw.githubusercontent.com/**", lambda r: r.fulfill(
                path=os.path.join(ROOT, "rates.dat"), content_type="text/plain"))
            pg.route("https://cdnjs.cloudflare.com/**", lambda r: r.fulfill(
                path=os.path.join(ROOT, lib[r.request.url.rsplit("/", 1)[1]]), content_type="text/javascript"))
            pg.on("pageerror", lambda e: errors.append(f"[{tag}] JS: {e}"))
            pg.on("console", lambda m: m.type == "error" and errors.append(f"[{tag}] console: {m.text}"))
            pg.goto(base + "index.html")
            pg.wait_for_load_state("networkidle")
            return pg

        def idle(pg):
            # ждём, пока закончатся автоподбор положения и прочие долгие расчёты
            pg.wait_for_function("() => { const b = document.getElementById('busy'); window.__idle = b && b.hidden ? (window.__idle || 0) + 1 : 0; return window.__idle >= 6 }", polling=200, timeout=120000)

        def total(pg):
            last, same = None, 0
            for _ in range(60):  # ждём, пока цена перестанет меняться
                t = pg.text_content("#sumTotal")
                same = same + 1 if t == last else 0
                if same >= 3:
                    return num(t)
                last = t
                pg.wait_for_timeout(150)
            return num(last)

        def qty(pg, q):
            pg.fill("#qtyInp", str(q))
            pg.dispatch_event("#qtyInp", "input")
            pg.dispatch_event("#qtyInp", "change")

        # 1. Расширенный режим: одна деталь, все технологии, разный тираж
        pg = page("расширенный")
        pg.click('#modeSeg [data-mode="adv"]')
        pg.set_input_files("#fileInput", stl)
        idle(pg)
        for tech in TECHS:
            pg.click(f'#techSub [data-sub="{tech}"]')
            for q in QTYS:
                qty(pg, q)
                got[f"{tech} x{q}"] = total(pg)
        pg.close()

        # 2. Простой режим (автоподбор принтера и положения)
        pg = page("простой")
        pg.set_input_files("#fileInput", stl)
        idle(pg)
        for q in (1, 10):
            qty(pg, q)
            got[f"простой fdm x{q}"] = total(pg)
        pg.close()

        # 3. Заказ из двух деталей разных технологий + оформленное КП
        pg = page("заказ")
        pg.click('#modeSeg [data-mode="adv"]')
        pg.set_input_files("#fileInput", stl)
        idle(pg)
        qty(pg, 10)
        with pg.expect_file_chooser() as fc:
            pg.click("#btnAddPart")
        fc.value.set_files(small)
        try:  # вторая деталь читается из файла не сразу — ждём, пока она появится в смете
            pg.wait_for_function("() => document.querySelectorAll('#basket .bi[data-t]').length >= 2", timeout=30000)
        except Exception:
            errors.append("[заказ] вторая деталь не появилась в смете за 30 с")
        idle(pg)
        pg.click('#techSub [data-sub="sla"]')
        qty(pg, 5)
        idle(pg)
        got["заказ fdm x10 + sla x5"] = total(pg)
        n = pg.locator("#basket .bi[data-t]").count()
        techs = sorted(set(pg.eval_on_selector_all("#basket .bi[data-t]", "e => e.map(x => x.dataset.t)")))
        if n != 2 or techs != ["fdm", "sla"]:
            errors.append(f"[заказ] ожидались 2 детали FDM и SLA, в смете: {n} шт, {techs}")
        kp = pg.evaluate("""() => { document.getElementById('btnPrintKP').click(); const fr = document.getElementById('loPrintFr'); fr.contentWindow.print = () => {};
            const d = fr.contentDocument; return { total: d.querySelector('.tot .v').textContent, rows: d.querySelectorAll('tbody tr').length, no: d.querySelector('.hd .no b').textContent } }""")
        if num(kp["total"]) != got["заказ fdm x10 + sla x5"]:
            errors.append(f"[КП] итог КП {kp['total']} не совпадает со сметой {got['заказ fdm x10 + sla x5']} ₽")
        if kp["rows"] < 2:
            errors.append(f"[КП] в таблице {kp['rows']} строк, ожидалось не меньше 2")
        if "2026-001" not in kp["no"]:
            errors.append(f"[КП] номер {kp['no']!r}, ожидался 2026-001")
        pg.close()
        br.close()
    srv.shutdown()

    bad = [k for k, v in got.items() if not v]
    for k, v in got.items():
        print(f"  {k:9} {v} ₽")
    if errors:
        print("Ошибки на странице:\n  " + "\n  ".join(errors))
    if bad:
        print("Нет цены:", ", ".join(bad))
    if errors or bad:
        sys.exit(1)
    if update or not os.path.exists(SNAP):
        with open(SNAP, "w", encoding="utf-8") as o:
            json.dump(got, o, ensure_ascii=False, indent=2)
            o.write("\n")
        print("Эталон записан:", os.path.relpath(SNAP, ROOT))
        return
    want = json.load(open(SNAP, encoding="utf-8"))
    diff = [f"  {k}: было {want.get(k)} ₽, стало {got.get(k)} ₽" for k in sorted(set(want) | set(got)) if want.get(k) != got.get(k)]
    if diff:
        print("Цены отличаются от эталона:\n" + "\n".join(diff))
        print("Если ставки меняли намеренно: python tests/check_prices.py --update")
        sys.exit(1)
    print("Все цены совпадают с эталоном.")


if __name__ == "__main__":
    main()
