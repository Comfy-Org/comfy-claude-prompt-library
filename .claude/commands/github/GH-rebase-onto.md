Rebase the current branch onto the target branch: $ARGUMENTS

<instructions>
1. First, check the current git status and branch to understand the starting state
2. Fetch the latest changes to ensure we have up-to-date refs
3. Attempt to rebase the current branch onto $ARGUMENTS
4. If the rebase completes successfully, report the result
5. If there are merge conflicts:
   - Stop the rebase process immediately (don't abort the rebase, just pause what you're doing)
   - List all conflicted files clearly
   - Provide specific instructions for manual resolution
   - Wait for user confirmation before proceeding
1. After user confirms conflicts are resolved, continue the rebase
2. Report the final status
</instructions>

<workflow>
**Step 1: Check current state**
- Run `git status` to see current branch and any uncommitted changes
- Run `git branch` to confirm which branch we're on

**Step 2: Fetch latest changes**
- Run `git fetch --all` to ensure we have the latest refs

**Step 3: Attempt rebase**
- Run `git rebase $ARGUMENTS`
- Monitor the output carefully for conflict indicators

**Step 4: Handle conflicts**
If conflicts occur:
- Run `git status` to see which files have conflicts
- List each conflicted file with a clear explanation
- Tell the user: "I've stopped the rebase due to conflicts. Please resolve them manually using your preferred editor/tool, then tell me when you're ready to continue."
- Do NOT attempt to resolve conflicts automatically
- Wait for explicit user confirmation to proceed

**Step 5: Continue after manual resolution**
When user says they're done:
- Run `git add .` to stage resolved files
- Run `git rebase --continue` to proceed
- Handle any additional conflicts that may arise by repeating the process

**Step 6: Final verification**
- Run `git status` to confirm the rebase completed successfully
- Report the final branch state and any relevant information
</workflow>

<safety_notes>
- Never automatically resolve merge conflicts
- Always stop and alert the user about conflicts before proceeding
- Preserve user work by being conservative with git operations
- If anything seems wrong, stop and ask for clarification
</safety_notes>

Remember: The goal is to safely rebase onto $ARGUMENTS while giving the user full control over conflict resolution.