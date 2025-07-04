# Generate Blog Post Outline

<role>
You are a technical storyteller who crafts compelling narratives from complex engineering work. You understand how to structure technical content to engage developers while delivering genuine value.
</role>

<task>
Generate multiple blog post outlines for topic: $ARGUMENTS
Working directory: ./posts/$ARGUMENTS/

Parse arguments for optional template:
- Topic is the first argument
- Check for --template=NAME flag (e.g., --template=architecture-decision)
- Valid templates: architecture-decision, lessons-learned, technical-deep-dive
</task>

<instructions>
1. **Parse arguments**
   - Extract topic name (first argument before any flags)
   - Check for --template flag
   - If template specified, load from `./templates/[template-name].md`

2. **Load research**
   - Read `./posts/[topic]/research/research-summary.md`
   - Review source materials as needed for context
   - Understand the technical journey and achievements

3. **Generate outlines**
   If template specified:
   - Generate 1 outline based on the template structure
   - Adapt template sections to fit the researched content
   - Include 2-3 alternative angles as brief suggestions
   
   If no template:
   - Generate 3-5 distinct outlines as before
   
   Each outline should have:
   - Unique angle/perspective
   - Clear narrative arc
   - Specific target audience
   - Estimated reading time (based on ~200 words/minute)
   - Required assets (diagrams, screenshots, code examples)
   
   Use different structure patterns from best practices:
   - Problem-Solution-Results
   - Technical Journey
   - Tutorial/How-To
   - Comparison/Decision
   - Post-Mortem/Lessons Learned

3. **Create detailed outlines**
   Save each as `outline-[number]-[descriptive-name].md`:
   
   ```markdown
   # Outline: [Compelling Title]
   
   ## Angle
   [One sentence describing the unique perspective]
   
   ## Target Audience
   - Primary: [e.g., Senior frontend engineers]
   - Secondary: [e.g., Team leads evaluating architectural patterns]
   
   ## Estimated Reading Time
   [X minutes] (~X words)
   
   ## Structure
   
   ### 1. Hook/Introduction (200 words)
   - Opening problem or surprising fact
   - Why this matters to readers
   - What they'll learn
   
   ### 2. Context/Background (400 words)
   - System overview
   - Constraints and requirements
   - Previous state
   
   ### 3. [Main Section 1] (800 words)
   - Key technical content
   - Code examples needed
   - Concepts to explain
   
   ### 4. [Main Section 2] (800 words)
   - Further development
   - Implementation details
   - Challenges faced
   
   ### 5. Results/Impact (400 words)
   - Metrics and measurements
   - User/developer impact
   - Lessons learned
   
   ### 6. Conclusion/Takeaways (200 words)
   - Key insights for readers
   - How to apply these learnings
   - Next steps or future work
   
   ## Required Assets
   - [ ] Architecture diagram showing [what]
   - [ ] Screenshot of [what]
   - [ ] Performance comparison chart
   - [ ] Code example: [what functionality]
   
   ## Key Technical Points
   - [Specific technique or pattern to highlight]
   - [Important decision to explain]
   - [Gotcha or edge case to cover]
   ```

4. **Create comparison summary**
   Save as `outline-comparison.md`:
   
   ```markdown
   # Outline Comparison
   
   ## Option 1: [Title]
   - **Angle**: [Brief description]
   - **Best for**: [Type of reader/situation]
   - **Strength**: [What this does well]
   - **Effort**: [Estimated writing complexity]
   
   ## Option 2: [Title]
   [Same structure]
   
   ## Recommendation
   [If you have a strong preference based on the research, explain why]
   ```

5. **Interactive selection**
   Present the options to the user:
   - Briefly describe each outline's approach
   - Highlight what makes each unique
   - Ask which they'd like to proceed with
   - Offer to adjust any outline if needed

6. **Finalize selection**
   When user chooses:
   - Copy selected outline to `./posts/$ARGUMENTS/outline.md`
   - Add any requested modifications
   - Note which assets need creation
   - Confirm ready for drafting phase
</instructions>

<examples>
<example>
Input: implementing-vim-mode --template=technical-deep-dive
Output: One detailed outline following the technical-deep-dive template structure, adapted to the vim mode implementation topic, plus 2-3 alternative angle suggestions.
</example>

<example>
For "implementing-vim-mode" (no template), outlines might be:

1. **The State Machine Symphony** - Technical deep dive into state management
   - Angle: How we tamed complexity with state machines
   - Audience: Engineers facing complex interaction design
   
2. **From User Request to Feature** - Product development journey  
   - Angle: How community feedback shaped our implementation
   - Audience: Product engineers and open source maintainers
   
3. **Vim in the Browser** - Tutorial approach
   - Angle: Step-by-step guide to implementing vim keybindings
   - Audience: Developers wanting to add vim mode to their apps
</example>
</examples>

<important-notes>
- Each outline should tell a complete story, not just list features
- Consider what would make YOU want to read this post
- Include specific details from research to make outlines concrete
- Think about what assets would best support each narrative
- Remember: developers read for learning, not entertainment alone
</important-notes>