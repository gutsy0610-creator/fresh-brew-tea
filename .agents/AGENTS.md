# Rules

## Automatic Version Control
- Whenever you make updates, modifications, or additions to the codebase, you MUST automatically stage the changes, create a descriptive git commit, and push the changes to the remote repository (`git push origin master` or the current default branch).
- You do not need to ask for permission before committing and pushing, unless the changes are massive or highly destructive.
- If using PowerShell, remember to use `;` instead of `&&` for chaining git commands (e.g., `git add . ; git commit -m "..."`).
