---
locale: de
author: Test Author
pubDatetime: 2026-05-01T00:00:00Z
title: Hallo, Welt!
featured: true
draft: false
math: true
license: cc-by-nc-sa-4.0
tags:
  - test
description: Ein umfassender Markdown-Syntax-Test auf Deutsch, der alle Rendering-Funktionen abdeckt und die mehrsprachige Blog-Funktionalität überprüft.
---

## Willkommen auf meinem Blog

Dies ist der erste deutsche Artikel. Die mehrsprachige Konfiguration umfasst nun:

- **中文** (zh) — Standardsprache
- **English** (en)
- **日本語** (ja)
- **Русский** (ru)
- **Deutsch** (de)

Dieser Blog wurde mit Astro 6 erstellt, unterstützt den Hell-/Dunkelmodus (Gruvbox-Palette) und ist mit dem Giscus-Kommentarsystem integriert. Codeblöcke unterstützen Syntaxhervorhebung, Diff-Anmerkungen und Dateinamen-Anzeige. Mathematische Formeln werden über KaTeX gerendert, sowohl inline als auch als Block.

Dieser Artikel testet alle Markdown-Syntax-Rendering-Funktionen und überprüft gleichzeitig die schwebende Inhaltsverzeichnis-Komponente (TOC) in verschiedenen Szenarien.

---

## Dies ist eine extrem lange deutsche Überschrift, die speziell entwickelt wurde, um die TOC-Textkürzung und Tooltip-Funktionen zu testen

Das Inhaltsverzeichnis hat eine feste Breite von 192px, was bei 14px Schriftgröße etwa 22–24 lateinische Zeichen ermöglicht. Diese Überschrift überschreitet diese Länge bei weitem und sollte daher im TOC mit `...` abgeschnitten werden, während der vollständige Titel beim Darüberfahren angezeigt wird. Unten folgt ein Beispieltext.

### Eine ähnlich lange Unterüberschrift der dritten Ebene, um Einrückungsunterschiede beim Abschneiden zu überprüfen

Überschriften der dritten Ebene haben im TOC eine zusätzliche linke Einrückung, wodurch die verfügbare Breite noch schmaler wird. Daher sollte die Kürzung früher erfolgen. Diese Überschrift ist absichtlich ausführlich, um die Überlauferkennung auszulösen.

---

## Kurze Überschriften sind in Ordnung

Unten folgen kurze Überschriften, die im TOC vollständig ohne Tooltips angezeigt werden sollten.

### Kurze Unterüberschrift

Wird ebenfalls vollständig angezeigt.

---

## Test der mehrstufigen Überschriftenhierarchie

Das TOC erfasst nur h2 und h3, aber dieser Artikel enthält tiefere Ebenen, um die Darstellung von Überschriften im Artikel zu überprüfen.

### Überschrift dritter Ebene A

Im TOC sichtbar, mit linker Einrückung.

#### Überschriften der vierten Ebene erscheinen nicht im TOC

Sie werden nicht im TOC angezeigt, aber auf der Seite normal gerendert.

##### Überschriften der fünften Ebene erscheinen ebenfalls nicht

Tiefe Überschriftenebenen dienen nur strukturellen Tests.

### Überschrift dritter Ebene B

Zurück zu einer im TOC sichtbaren Ebene.

---

## Markdown-Syntax-Übersicht

Dieser Abschnitt testet systematisch die verschiedenen von Markdown unterstützten Syntaxelemente, von grundlegenden Textstilen bis hin zu komplexen Codeblöcken und mathematischen Formeln.

### Textstile

Dies ist **fetter** Text, dies ist *kursiver* Text, dies ist ***fett-kursiver*** Text, dies ist ~~durchgestrichener~~ Text und dies ist `Inline-Code`.

### Links & Bilder

[Astro Website](https://astro.build/) ist der statische Site-Generator, der von diesem Blog verwendet wird.

<img src="https://s3.sylvan.cafe/img/blog/2026/05/ENDFIELD-1778172445940.avif" alt="Arknights: Endfield" width="800" height="450" loading="lazy" />

### Blockzitate

> Dies ist ein Blockzitat, das die Darstellung von zitiertem Text demonstriert.
>
> > Dies ist ein verschachteltes Blockzitat. Technisch machbar, sollte in der Praxis aber sparsam eingesetzt werden.

---

## Listen & Layout

Listen sind ein zentrales Werkzeug zur Strukturierung von Informationen.

### Ungeordnete Listen

- Punkt eins: Einleitung
- Punkt zwei: ein weiterer Aspekt
  - Verschachtelter Punkt A: zur Erläuterung
    - Tiefere Verschachtelung wird ebenfalls unterstützt
  - Verschachtelter Punkt B: ein weiterer Unterpunkt
- Punkt drei: zurück zur obersten Ebene

### Geordnete Listen

1. Schritt eins: Projektstruktur initialisieren
2. Schritt zwei: Abhängigkeiten und Build-Einstellungen konfigurieren
3. Schritt drei: Kernfunktionalität implementieren
    1. Unterschritt 3.1 — Datenschicht implementieren
    2. Unterschritt 3.2 — Geschäftslogik implementieren
4. Schritt vier: Tests schreiben, um Codequalität sicherzustellen
5. Schritt fünf: in Produktion deployen

### Aufgabenlisten

- [x] Erledigt: Astro 6 Projekt konfigurieren
- [x] Erledigt: Tailwind CSS v4 integrieren
- [ ] Todo: schwebende TOC-Komponente hinzufügen
- [ ] Todo: Seiten-Performance optimieren
- [ ] Todo: Benutzerdokumentation schreiben
- [ ] Todo: CI/CD-Pipeline konfigurieren

---

## Tabellen & Datenanzeige

### Einfache Tabelle

| Sprache  | Code | Schriftart     | Beschreibung                        |
|----------|------|----------------|-------------------------------------|
| Chinesisch | zh | Noto Sans SC  | Optimiert für vereinfachtes Chinesisch |
| Englisch   | en | Noto Sans     | Standardschrift für lateinische Zeichen |
| Japanisch  | ja | Noto Sans JP  | Japanische Kana und Kanji          |
| Russisch   | ru | Noto Sans     | Unterstützung für kyrillische Schrift |
| Deutsch    | de | Noto Sans     | Standardschrift für lateinische Zeichen |

### Code-Vergleichstabelle

| Funktion         | JavaScript     | TypeScript       | Python                    |
|------------------|----------------|------------------|---------------------------|
| Typsystem        | Dynamisch      | Statisch         | Dynamisch (optionale Hinweise) |
| Laufzeitumgebung | Browser/Node   | Kompiliert zu JS | Interpreter               |
| Paketverwaltung  | npm/yarn/pnpm  | npm/yarn/pnpm    | pip/poetry                |
| Lernkurve        | Gering         | Mittel           | Gering                    |

---

## Codeblöcke

Codeblöcke verwenden Shiki-Syntaxhervorhebung und unterstützen: Standardzeilennummern, Zeilenumbruch (hängender Einzug), Codefaltung (`collapse`), Dateinamenbeschriftungen (`file`) und Deaktivierung von Zeilennummern (`nolines`).

### Standard-Zeilennummern

Alle Codeblöcke haben standardmäßig Zeilennummern aktiviert, keine Kennzeichnung erforderlich.

```python
def fib(n: int) -> list[int]:
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result
```

### Dateibeschriftung: file

`file="name"` zeigt eine Dateinamen-Beschriftung in der oberen linken Ecke mit einem grünen Punkt an.

```python file="fibonacci.py"
def fib(n: int) -> list[int]:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

### Zeilennummern deaktivieren: nolines

Kurze Codefragmente mit `nolines` blenden Zeilennummern aus Gründen der Übersichtlichkeit aus.

```bash nolines
pnpm install
pnpm dev
pnpm build
```

### Codefaltung: collapse

Codeblöcke mit mehr als 8 Zeilen und `collapse` werden automatisch eingeklappt, mit einem unteren Farbverlauf als Hinweis auf weiteren Inhalt. Die Schaltfläche zum Ausklappen ist unten zentriert.

```python collapse file="utils.py"
def fibonacci(n: int) -> list[int]:
    """Generiere die ersten n Fibonacci-Zahlen"""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result


def is_prime(num: int) -> bool:
    """Prüfe, ob eine ganze Zahl eine Primzahl ist"""
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True


def chunk_list(data: list, size: int):
    """Teile eine Liste in Blöcke fester Größe, gibt einen Generator zurück"""
    for i in range(0, len(data), size):
        yield data[i:i + size]


print(fibonacci(10))
primes = [x for x in fibonacci(20) if is_prime(x)]
print(f"Primzahlen: {primes}")
```

### Faltung + Keine Zeilennummern: collapse nolines

Mehrere Kennzeichnungen können frei kombiniert werden.

```python collapse nolines
import json
from pathlib import Path


def load_config(path: str | Path) -> dict:
    """Lädt eine JSON-Konfigurationsdatei, gibt ein leeres Dict zurück, wenn nicht gefunden."""
    config_path = Path(path)
    if not config_path.exists():
        return {}
    return json.loads(config_path.read_text(encoding="utf-8"))


def merge_configs(base: dict, override: dict) -> dict:
    """Tiefenmerge zweier Konfigurations-Dicts, wobei override Vorrang hat."""
    result = base.copy()
    for key, value in override.items():
        if isinstance(value, dict) and key in result:
            result[key] = merge_configs(result[key], value)
        else:
            result[key] = value
    return result


cfg = load_config("defaults.json")
user_cfg = load_config("user.json")
final = merge_configs(cfg, user_cfg)
print(json.dumps(final, indent=2, ensure_ascii=False))
```

### Zeilenumbruch + Hängender Einzug

Überlange Zeilen werden an der Container-Grenze umbrochen, wobei die Fortsetzung so eingerückt wird, dass sie mit der ersten Codezeile ausgerichtet ist.

```python collapse file="dashboard.py"
def build_dashboard_report(assignments: dict[str, list[dict]], include_history: bool = False) -> str:
    """Generiere einen aggregierten Dashboard-Bericht aus Aufgabenzuweisungen über Worker-Knoten."""
    lines = ["# Lastbericht", f"Erstellt um: {datetime.now().isoformat()}", ""]
    for node_name, tasks in assignments.items():
        pending = [t for t in tasks if t.get("status") == "pending" and t.get("priority", 0) >= 3]
        lines.append(f"## {node_name} ({len(pending)} Aufgaben mit hoher Priorität)")
        lines.extend(f"  - [{t['priority']}] {t.get('title', 'Unbenannt')}" for t in sorted(pending, key=lambda x: -x["priority"]))
    if include_history:
        lines.append("\n---\n## Historische Trends\n*Erfordert aktivierten persistenten Speicher*")
    return "\n".join(lines)


sample = [
    {"title": "Datenmigration", "status": "pending", "priority": 5, "node": "worker-0"},
    {"title": "Log-Rotation", "status": "done", "priority": 1, "node": "worker-0"},
    {"title": "Index-Neuaufbau", "status": "pending", "priority": 4, "node": "worker-1"},
]
print(build_dashboard_report({"worker-0": sample[:2], "worker-1": sample[2:]}, include_history=True))
```

### CSS

```css nolines
.astro-code {
  @apply rounded-lg border border-border;
  font-family: var(--font-code);
}

.astro-code .line {
  min-height: 1.5rem;
}
```

---

## Mathematische Formeln

### Inline-Formeln

Die Masse-Energie-Äquivalenz $E = mc^2$ ist vielleicht die bekannteste physikalische Formel. Der Satz des Pythagoras $a^2 + b^2 = c^2$ ist ebenso vertraut.

### Block-Formeln

Das Gaußsche Integral:

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

Die Dichtefunktion der Normalverteilung:

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

Eulersche Identität:

$$
e^{i\pi} + 1 = 0
$$

### Mehrzeilige Formeln

Mit der `aligned`-Umgebung:

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} - \frac{1}{c} \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4\pi\rho \\
\nabla \times \vec{\mathbf{E}} + \frac{1}{c} \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{aligned}
$$

---

## Erweiterte Funktionen

### Fußnoten

Dies ist ein Satz mit einer Fußnote.[^1] Dies ist ein weiterer Satz mit einer Fußnote.[^long-note]

[^1]: Dies ist der Fußnoteninhalt. Fußnoten werden am Ende des Artikels angezeigt.

[^long-note]: Dies ist eine lange Fußnote, um die mehrzeilige Fußnotendarstellung zu testen. In einem mehrsprachigen Blog müssen Fußnoten-Ankerlinks die Routen-Präfixe korrekt behandeln.

### HTML-Details-Panel

<details>
<summary>Zum Ausklappen klicken</summary>

Dies ist eingeklappter Inhalt, der Markdown-Syntax unterstützt.

- Listenelement
- Weiteres Element
- Noch ein Element

Das Details-Panel kann vollständiges Markdown enthalten, einschließlich Codeblöcken und Tabellen.

</details>

### Horizontale Linien

---

Eine horizontale Linie verwendet drei oder mehr Bindestriche, Sternchen oder Unterstriche.

---

## Zusammenfassung & Ausblick

Dieser Artikel hat systematisch alle vom Blog unterstützten Markdown-Syntaxelemente getestet. Durch die mehrstufige Überschriftenstruktur wurden folgende TOC-Funktionen überprüft:

- Erkennung der Überschriftenebenen (h2 und h3)
- Scroll-Highlight-Verfolgung (IntersectionObserver)
- Sanftes Scrollen bei Klick (mit Offset-Kompensation)
- Kompatibilität mit mehrsprachigen Inhalten

Zukünftige Verbesserungen umfassen Volltextsuche, Tag-Cloud und RSS-Feed-Optimierung.
