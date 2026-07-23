"""Core AI Forge - AI agent instructions for internal teams."""

from pathlib import Path

_PACKAGE_DIR = Path(__file__).resolve().parent

# Directories that mark a valid prompts root (wheel installs have them inside
# the package, editable installs have them in the repo root/parent directory).
_MARKER_DIRS = ("core", "standards")


def _is_prompts_root(path: Path) -> bool:
    return all((path / marker).is_dir() for marker in _MARKER_DIRS)


if _is_prompts_root(_PACKAGE_DIR):
    BASE_DIR = _PACKAGE_DIR
else:
    BASE_DIR = _PACKAGE_DIR.parent

"""Absolute path to the root containing core/, standards/ and stack directories."""

# Directories that are not stacks/teams.
_NON_STACK_DIRS = {
    "core_ai_prompts",
    "node_modules",
    "template-team",
    ".git",
    ".github",
    ".gitlab",
}


def list_stacks() -> list[str]:
    """Return available stack directory names."""
    return sorted(
        d.name
        for d in BASE_DIR.iterdir()
        if d.is_dir()
        and d.name not in _NON_STACK_DIRS
        and not d.name.startswith(".")
        and (d / "SKILLS.md").is_file()
    )


def get_team_dir(team_name: str) -> Path:
    """Return the absolute path to a stack/team directory."""
    team_dir = BASE_DIR / team_name
    if not team_dir.is_dir():
        raise FileNotFoundError(
            f"Stack '{team_name}' not found. Available stacks: {list_stacks()}"
        )
    return team_dir


# Backwards-compatible alias.
get_stack_dir = get_team_dir
