"""Build the real site and check the public documentation exports."""

import os
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from urllib.parse import unquote, urljoin, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, content):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.anchors = set()
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.anchors.add(attrs["id"])
        if tag == "a" and "name" in attrs:
            self.anchors.add(attrs["name"])
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])


class DocumentationBuildTest(unittest.TestCase):
    def test_exports_and_local_links_for_each_deployment(self):
        for prefix in ("", "develop/", "feature~2f~docs/"):
            with self.subTest(prefix=prefix), tempfile.TemporaryDirectory() as directory:
                site = Path(directory) / "site"
                base = "https://docs.example.org/" + prefix
                result = subprocess.run(
                    [sys.executable, "-m", "mkdocs", "build", "--strict",
                     "--site-dir", str(site)],
                    cwd=ROOT,
                    env={**os.environ, "PAGES_SITE_URL": base},
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                index = (site / "llms.txt").read_text()
                full = (site / "llms-full.txt").read_text()
                self.assertIn(f"[Complete text]({base}llms-full.txt)", index)

                sources = list((ROOT / "docs").rglob("*.md"))
                document_paths = re.findall(r"^Document: (.+)$", full, re.MULTILINE)
                self.assertEqual(document_paths[0], "Scope-and-Reference.md")
                self.assertCountEqual(
                    document_paths,
                    [path.relative_to(ROOT / "docs").as_posix() for path in sources],
                )
                for source in sources:
                    relative = source.relative_to(ROOT / "docs")
                    self.assertEqual((site / relative).read_bytes(), source.read_bytes())
                    self.assertIn(f"({base}{relative.as_posix()})", index)
                    self.assertIn(f"Markdown URL: {base}{relative.as_posix()}", full)
                    self.assertIn(source.read_text().rstrip(), full)

                # Check the URLs consumers actually follow, including branch prefixes.
                for link in re.findall(r"\]\((https://[^)]+)\)", index):
                    target = self.local_target(site, base, link)
                    self.assertIsNotNone(target, link)
                    self.assertTrue(target.is_file(), link)

                pages = {
                    path: Page(path.read_text())
                    for path in site.rglob("*.html")
                }
                for path, page in pages.items():
                    relative = path.relative_to(site).as_posix()
                    page_url = urljoin(base, relative)
                    for link in page.links:
                        resolved = urljoin(page_url, link)
                        target = self.local_target(site, base, resolved)
                        if target is None:
                            continue
                        self.assertTrue(target.is_file(), f"{relative}: {link}")
                        fragment = unquote(urlsplit(resolved).fragment)
                        if fragment and target in pages:
                            self.assertIn(
                                fragment, pages[target].anchors,
                                f"{relative}: missing anchor in {link}",
                            )

    def local_target(self, site, base, url):
        parts = urlsplit(url)
        origin = urlsplit(base)
        if (parts.scheme, parts.netloc) != (origin.scheme, origin.netloc):
            return None
        self.assertTrue(parts.path.startswith(origin.path), url)
        target = site / unquote(parts.path[len(origin.path):])
        if target.is_dir():
            target /= "index.html"
        return target


if __name__ == "__main__":
    unittest.main()
