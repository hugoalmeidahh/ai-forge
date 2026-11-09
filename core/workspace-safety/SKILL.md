---
name: ai-forge-core-workspace-safety
description: "Prepare or inspect a repository/worktree and deliver isolated changes while preserving unrelated work and respecting runtime-managed lifecycle boundaries."
---

# Workspace and worktree safety

Confirm the actual repository root, branch, remote/base, working-tree changes and applicable instructions before editing. Paths and IDs come from current tools/configuration, not a developer's personal directory.

- Reuse the runtime-assigned worktree for a task. A worktree isolates Git changes, not processes, network, credentials or host permissions. Do not copy private environment files as setup.
- Preserve uncommitted changes and identify ownership before broad edits. Use targeted staging; inspect the actual staged diff before committing.
- Create an isolated checkout only when needed within the authorized task. If the runtime manages it, use its supported lifecycle instead of creating a second worktree for the same task.
- Verify the diff, relevant checks and target branch before integration. Resolve conflicts by understanding both sides; do not use destructive reset or force push to erase uncertainty.
- Commit, PR, push, merge and removal have different effects. Execute the steps authorized by the user; a ready-for-review state alone does not authorize publication or deletion.
- Stop only processes started for this task. Remove branches/worktrees only when their changes are safe and removal is authorized.

Report the actual branch/path, commits, verification and whether integration/publication occurred. If setup access is unavailable, provide the concrete missing prerequisite without announcing an environment was created.
