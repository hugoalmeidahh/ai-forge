"""Core AI Prompts - AI agent instructions for internal teams."""

from pathlib import Path

_PACKAGE_DIR = Path(__file__).resolve().parent

# Detect install mode: wheel installs have team dirs inside the package,
# editable installs have them in the repo root (parent directory).
if any(d.name.endswith("-team") for d in _PACKAGE_DIR.iterdir() if d.is_dir()):
    BASE_DIR = _PACKAGE_DIR
else:
    BASE_DIR = _PACKAGE_DIR.parent

"""Absolute path to the root containing team directories."""


def get_team_dir(team_name: str) -> Path:
    """Return the absolute path to a team's directory.

    Args:
        team_name: The team folder name (e.g., 'backend-team', 'frontend-team').

    Returns:
        Path object pointing to the team directory.

    Raises:
        FileNotFoundError: If the team directory does not exist.
    """
    team_dir = BASE_DIR / team_name
    if not team_dir.is_dir():
        available = [
            d.name for d in BASE_DIR.iterdir()
            if d.is_dir() and d.name.endswith("-team")
        ]
        raise FileNotFoundError(
            f"Team '{team_name}' not found. Available teams: {available}"
        )
    return team_dir
