#!/usr/bin/env python3
# Sync the Oblikovati.API add-in developer wiki into this Docusaurus site.
#
# Source of truth is the sibling Oblikovati.API repo: the hand-written developer guides under
# docs/wiki/*.md, plus a per-package API reference rendered from the Go doc comments with
# gomarkdoc. This script transforms both into docs/addins/ so the docs build stays pure Node
# (no Go dependency at build time) — rerun it after the API surface or the wiki pages change.
#
#   python3 scripts/sync-addin-docs.py            # uses ../Oblikovati.API
#   OBLIKOVATI_API_DIR=/path python3 scripts/sync-addin-docs.py
#
# Requires Go and gomarkdoc on PATH:
#   go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest

import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

DOCS_ROOT = Path(__file__).resolve().parent.parent
API_DIR = Path(os.environ.get("OBLIKOVATI_API_DIR", DOCS_ROOT.parent / "Oblikovati.API")).resolve()
OUT_DIR = DOCS_ROOT / "docs" / "addins"
REF_DIR = OUT_DIR / "api-reference"

# Public docs must never name a third-party CAD product (the Oblikovati.API repo enforces the
# same rule on its own wiki). This is a hard gate on everything we import.
FORBIDDEN = re.compile(r"inventor|autodesk", re.IGNORECASE)

# Developer-guide pages, in reading order: (source, out-slug, title, position).
DEV_PAGES = [
    ("Home.md", "overview.md", "Add-in Development", 1),
    ("Oblikovati-Architecture.md", "oblikovati-architecture.md", "Application Architecture", 2),
    ("First-Steps.md", "first-steps.md", "First Steps", 3),
    ("Oblikovati-API-Architecture.md", "oblikovati-api-architecture.md", "API Architecture", 4),
    ("Testing-Automation.md", "testing-automation.md", "Testing & Automation", 5),
]

# `[[Wiki Page]]` link text -> Docusaurus relative target.
LINK_MAP = {
    "Home": "./overview.md",
    "Oblikovati Architecture": "./oblikovati-architecture.md",
    "First Steps": "./first-steps.md",
    "Oblikovati API Architecture": "./oblikovati-api-architecture.md",
    "Testing Automation": "./testing-automation.md",
    "API Docs": "/addins/api-reference",
}

# API packages rendered into per-package reference pages: (package, out-slug, title, position).
REF_PACKAGES = [
    ("types", "types.md", "types — value types & enums", 1),
    ("contract", "contract.md", "contract — Go interfaces", 2),
    ("wire", "wire.md", "wire — methods & DTOs", 3),
    ("client", "client.md", "client — typed client", 4),
]

GENERATED_NOTE = "<!-- Synced from Oblikovati.API by scripts/sync-addin-docs.py. Do not edit here. -->"


def fail(msg):
    print(f"sync-addin-docs: {msg}", file=sys.stderr)
    sys.exit(1)


def frontmatter(title, position):
    safe = title.replace('"', '\\"')
    return f'---\ntitle: "{safe}"\nsidebar_position: {position}\n---\n\n'


def rewrite_wiki_links(text):
    def sub(match):
        name = match.group(1).strip()
        target = LINK_MAP.get(name)
        return f"[{name}]({target})" if target else name

    return re.sub(r"\[\[([^\]]+)\]\]", sub, text)


def strip_leading_h1(text):
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.strip() == "":
            continue
        if line.startswith("# "):
            del lines[i]
        break
    return "\n".join(lines).lstrip("\n")


def guard(text, source):
    hit = FORBIDDEN.search(text)
    if hit:
        fail(f"forbidden third-party product name {hit.group(0)!r} in {source}; scrub the source before syncing")


def transform_dev_page(src_path, title, position):
    text = src_path.read_text(encoding="utf-8")
    guard(text, src_path.name)
    body = strip_leading_h1(rewrite_wiki_links(text))
    return frontmatter(title, position) + GENERATED_NOTE + "\n\n" + body.rstrip() + "\n"


def render_package(pkg):
    gomarkdoc = shutil.which("gomarkdoc")
    if not gomarkdoc:
        fail("'gomarkdoc' not on PATH; install: go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest")
    result = subprocess.run(
        [gomarkdoc, f"oblikovati.org/api/{pkg}"],
        cwd=API_DIR, capture_output=True, text=True,
    )
    if result.returncode != 0:
        fail(f"gomarkdoc failed for {pkg}: {result.stderr.strip()}")
    return result.stdout


def transform_ref_page(pkg, title, position):
    rendered = render_package(pkg)
    guard(rendered, f"oblikovati.org/api/{pkg}")
    note = f"_Auto-generated from the `oblikovati.org/api/{pkg}` Go source. Do not edit here._\n\n"
    return frontmatter(title, position) + GENERATED_NOTE + "\n\n" + note + strip_leading_h1(rendered).rstrip() + "\n"


def write_category(path, label, position, link):
    path.write_text(json.dumps({"label": label, "position": position, "link": link}, indent=2) + "\n")


def main():
    if not (API_DIR / "docs" / "wiki").is_dir():
        fail(f"cannot find Oblikovati.API wiki at {API_DIR}/docs/wiki (set OBLIKOVATI_API_DIR)")

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    REF_DIR.mkdir(parents=True)

    for source, out, title, position in DEV_PAGES:
        (OUT_DIR / out).write_text(transform_dev_page(API_DIR / "docs" / "wiki" / source, title, position))
        print(f"sync-addin-docs: wrote docs/addins/{out}")

    for pkg, out, title, position in REF_PACKAGES:
        (REF_DIR / out).write_text(transform_ref_page(pkg, title, position))
        print(f"sync-addin-docs: wrote docs/addins/api-reference/{out}")

    write_category(OUT_DIR / "_category_.json", "Add-in Development", 5,
                   {"type": "doc", "id": "addins/overview"})
    write_category(REF_DIR / "_category_.json", "API Reference", 6,
                   {"type": "generated-index", "slug": "/addins/api-reference",
                    "description": "Reference for every exported type, function and method in the Apache-2.0 add-in contract."})
    print("sync-addin-docs: done")


if __name__ == "__main__":
    main()
