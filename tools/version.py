"""Метки версий у app.js и styles.css в index.html.

Браузер клиента хранит app.js и styles.css в кэше. Чтобы после публикации
он не взял старый app.js к новой странице, ссылки содержат метку версии:
app.js?v=<первые 8 знаков хэша файла>. Метка меняется только когда меняется файл.

    python tools/version.py          — проставить метки
    python tools/version.py --check  — проверить (автотест и GitHub Actions)
"""
import hashlib, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ["app.js", "styles.css"]


def tag(name):
    with open(os.path.join(ROOT, name), "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:8]


def main():
    p = os.path.join(ROOT, "index.html")
    s = open(p, encoding="utf-8", newline="").read()
    new = s
    for n in FILES:
        new = re.sub(r'(["\'])' + re.escape(n) + r'(\?v=[0-9a-f]*)?\1', lambda m: f"{m.group(1)}{n}?v={tag(n)}{m.group(1)}", new)
    if "--check" in sys.argv:
        if new != s:
            print("Метки версий в index.html устарели. Запустите: python tools/version.py")
            sys.exit(1)
        print("Метки версий в порядке.")
        return
    if new != s:
        open(p, "w", encoding="utf-8", newline="").write(new)
    print(", ".join(f"{n}?v={tag(n)}" for n in FILES))


if __name__ == "__main__":
    main()
