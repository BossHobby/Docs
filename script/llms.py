"""Export the site's source documents without maintaining a second copy."""

from pathlib import Path
from urllib.parse import quote, urljoin

from mkdocs.structure.files import File


def documents(config):
    root = Path(config["docs_dir"])
    priority = {"Scope-and-Reference.md": 0, "index.md": 1}
    return sorted(
        root.rglob("*.md"),
        key=lambda path: (priority.get(path.relative_to(root).as_posix(), 2), path.as_posix()),
    )


def on_files(files, config):
    base = config["site_url"].rstrip("/") + "/"
    index = [
        "# QUICKSILVER documentation",
        "",
        "> Development documentation. Read the scope, vehicle capabilities and pinned source revisions before using a procedure.",
        "",
        f"- [Scope and source reference]({urljoin(base, 'Scope-and-Reference.md')})",
        f"- [Complete text]({urljoin(base, 'llms-full.txt')})",
        "",
        "## Documents",
        "",
    ]
    full = [
        "# QUICKSILVER complete documentation",
        "",
        "Generated from the same Markdown as the website. Each document starts with its source path and URL.",
        "Relative links within a document resolve against that document's Markdown URL.",
        "",
    ]
    root = Path(config["docs_dir"])
    for path in documents(config):
        relative = path.relative_to(root).as_posix()
        content = path.read_text(encoding="utf-8")
        title = next(
            (line[2:].strip() for line in content.splitlines() if line.startswith("# ")),
            path.stem,
        )
        source_url = urljoin(base, quote(relative))
        page_url = urljoin(base, files.get_file_from_path(relative).url)
        index.append(f"- [{title}]({source_url}): [Web page]({page_url})")
        full.extend([
            "---", "", f"Document: {relative}", f"Markdown URL: {source_url}",
            f"Web URL: {page_url}", "", content.rstrip(), "",
        ])
    files.append(File.generated(config, "llms.txt", content="\n".join(index) + "\n"))
    files.append(File.generated(config, "llms-full.txt", content="\n".join(full)))
    return files


def on_post_build(config):
    # Preserve relative .md links and image paths by mirroring source paths at
    # the site root, alongside (not instead of) the rendered HTML directories.
    root = Path(config["docs_dir"])
    site = Path(config["site_dir"])
    for source in documents(config):
        destination = site / source.relative_to(root)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(source.read_bytes())
