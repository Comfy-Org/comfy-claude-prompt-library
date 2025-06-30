# Create Feature Development Task

I need to create a structured development task for: $ARGUMENTS

## Your Task

Set up a comprehensive feature development task with proper tracking, phases, and documentation.

## Execution Steps

1. **Parse Feature Requirements**
   - Extract feature name and description from $ARGUMENTS
   - Identify key requirements and constraints
   - Determine complexity and scope

2. **Generate Task Structure**
   - Use the feature task template as base
   - Customize phases based on feature type
   - Add specific acceptance criteria
   - Include relevant technical considerations

3. **Create Task Documentation**
   - Copy template from ~/.claude/templates/feature-task-template.md
   - Fill in all sections with feature-specific details
   - Save to appropriate location (suggest: .claude/tasks/[feature-name].md)
   - Create initial git branch if requested

4. **Set Up Tracking**
   - Add task to TODO list if applicable
   - Create initial checkpoints
   - Set up progress markers
   - Configure any automation needed

## Template Usage

@include templates/feature-task-template.md

## Context Preservation

When creating the task, preserve:
- Initial requirements
- Key technical decisions
- File locations
- Dependencies identified
- Risk factors

## Integration

**Prerequisites**: Clear feature requirements
**Follow-up**: `/development:implement-feature [task-file]`
**Related**: `create-test-plan`, `estimate-context-window`