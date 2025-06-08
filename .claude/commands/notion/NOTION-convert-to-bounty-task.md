# Convert Task to Bounty Task

Your task is to convert the following task into a properly structured bounty task following the ComfyUI bounty process: $ARGUMENTS

## Process Overview

Follow these steps to convert a task into a bounty task (make it as a markdown file):

### Step 1: Analyze Task Scope
First, determine if this is a **Task** or **Project**:
- **Task**: A specific feature or improvement (e.g., new feature in frontend, bug fix, enhancement)
- **Project**: A larger scope initiative (e.g., entire new frontend, major system overhaul)

### Step 2: Create Bounty Task Entry

For **Tasks**:
1. **Create the task** under the appropriate project in [Tasks](https://www.notion.so/bf086637f74c4292ae588ab84ff18550?pvs=21):
   - Frontend tasks → [ComfyUI_Frontend](https://www.notion.so/ComfyUI_Frontend-5fe8e9b691a14389bc25af1e2fc25982?pvs=21)
   - Desktop tasks → [Comfy Desktop Next](https://www.notion.so/Comfy-Desktop-Next-1f96d73d365080d98d86dd109c0221e6?pvs=21)
   - Core/Backend tasks → Appropriate backend project
   
2. **Mark as Bounty**: Set the `Tag` field to "Bounty" 
   - ⚠️ **SECURITY WARNING**: This makes the task PUBLIC automatically
   - Do NOT include sensitive details, internal links, or proprietary information
   
3. **Set Bounty Category**: Go to "💰 Bounty Task" section and categorize appropriately
4. **[Optional]** Write detailed description in Comfy
5. **[Optional]** Create GitHub Issue and link it in the task

For **Projects**:
1. **Create project** under [Projects](https://www.notion.so/61fcba01de44437c9b041aa4c12b0a5e?pvs=21)
2. **Mark as "Contractor-Needed"**
3. **Write comprehensive project details** in Notion or GitHub Issue

### Step 3: Structure the Bounty Task

Create a well-structured bounty task with these sections:

#### Required Sections:
- **Title**: Clear, concise description of what needs to be done
- **Description**: Detailed explanation of the task requirements
- **Acceptance Criteria**: Specific, measurable outcomes
- **Priority Level**: High/Medium/Low
- **Estimated Effort**: Hours or complexity level
- **Skills Required**: Technical skills needed
- **Resources**: Links to relevant documentation, examples, or codebases

#### Recommended Additional Sections:
- **Background/Context**: Why this task is important
- **Technical Approach**: Suggested implementation strategy
- **Testing Requirements**: How to verify the solution works
- **Deliverables**: What exactly should be submitted

## Context & Resources

### ComfyUI Ecosystem Resources:
- **Main Repository**: [ComfyUI GitHub](https://github.com/comfyanonymous/ComfyUI)
- **Frontend Repository**: [ComfyUI Frontend](https://github.com/Comfy-Org/ComfyUI_frontend)
- **ComfyUI CLI**: [Comfy CLI](https://github.com/Comfy-Org/comfy-cli)
- **ComfyUI Desktop**: [Desktop App](https://github.com/Comfy-Org/desktop)
- **Documentation**: [ComfyUI Docs](https://docs.comfy.org/)
- **Node Registry**: [ComfyUI Registry](https://registry.comfy.org/)
- **Example Workflows**: [Example Workflows](https://github.com/Comfy-Org/example_workflows)
- **Community**: [ComfyUI Discord](https://discord.com/invite/comfyorg)

### Bounty Management:
- **Internal View**: [Bounty Tasks View (Internal)](https://www.notion.so/Bounty-Tasks-View-Internal-2006d73d365080eaae35edac894860c9?pvs=21)
- **Public View**: [ComfyUI Bounty Tasks](https://www.notion.so/ComfyUI-Bounty-Tasks-1fb6d73d36508064af76d05b3f35665f?pvs=21)

### Technical Guidelines:
- **Installation Guide**: [System Requirements](https://docs.comfy.org/installation/system_requirements)
- **Development Overview**: [Development Guide](https://docs.comfy.org/development/overview)
- **Frontend Development**: [Frontend Repository](https://github.com/Comfy-Org/ComfyUI_frontend)
- **Core Backend**: [Main Repository](https://github.com/comfyanonymous/ComfyUI)
- **CLI Tools**: [Comfy CLI](https://github.com/Comfy-Org/comfy-cli)
- **Desktop App**: [Desktop Repository](https://github.com/Comfy-Org/desktop)

## Best Practices & Tips

### Writing Effective Bounty Tasks:
1. **Be Specific**: Avoid vague requirements like "improve performance"
2. **Include Examples**: Reference existing implementations or similar features
3. **Set Clear Boundaries**: Define what's in scope and what's not
4. **Provide Context**: Explain the business value and user impact
5. **Consider Skill Level**: Match complexity to expected contributor experience

### Common Bounty Categories:
- **Frontend/UI**: User interface improvements, new components, UX enhancements
- **Backend/Core**: API improvements, performance optimizations, new core features  
- **Core Nodes**: Built-in node improvements, new core node types, optimization
- **Documentation**: Guides, tutorials, API documentation, examples
- **Testing**: Unit tests, integration tests, test automation
- **DevOps**: Build improvements, deployment automation, monitoring
- **CLI/Desktop**: Command-line tools and desktop application improvements

### Security Considerations:
- Never include API keys, passwords, or sensitive configuration
- Avoid exposing internal system architecture details
- Don't reference internal-only repositories or resources
- Use placeholder values for sensitive data in examples

### Pricing Guidelines:
- **Simple tasks** (1-4 hours): $50-200
- **Medium tasks** (4-16 hours): $200-800  
- **Complex tasks** (16+ hours): $800+
- **Projects**: Negotiate based on scope

## Example Task Conversions

### Example 1: Frontend Enhancement
**Original**: "Make the workflow editor better"
**Converted Bounty Task**:
- **Title**: Add Workflow Node Search and Filter Functionality
- **Description**: Implement search and filtering capabilities in the workflow editor to help users quickly find and organize nodes
- **Acceptance Criteria**: 
  - Search bar that filters nodes by name/category in real-time
  - Category filter dropdown with node type groupings
  - Keyboard shortcuts for search (Ctrl+F)
  - Search history (last 5 searches)
- **Skills Required**: JavaScript, Vue.js, CSS
- **Estimated Effort**: 8-12 hours
- **Resources**: [Frontend Repository](https://github.com/Comfy-Org/ComfyUI_frontend), [JS Extensions Guide](https://docs.comfy.org/custom-nodes/js/javascript_overview)

### Example 2: Node Development
**Original**: "Need better image processing"
**Converted Bounty Task**:
- **Title**: Create Advanced Image Enhancement Node Pack
- **Description**: Develop a collection of image processing nodes including noise reduction, sharpening, and color correction
- **Acceptance Criteria**:
  - 5 new nodes: Denoise, Sharpen, Color Correct, Brightness/Contrast, Saturation
  - Each node with parameter controls and real-time preview
  - Comprehensive documentation and examples
  - Unit tests for each node
- **Skills Required**: Python, Image Processing (PIL/OpenCV), ComfyUI Core API
- **Estimated Effort**: 20-30 hours
- **Resources**: [Core Repository](https://github.com/comfyanonymous/ComfyUI), [Development Overview](https://docs.comfy.org/development/overview)

## Validation Checklist

Before finalizing the bounty task:
- [ ] Task scope is clearly defined and achievable
- [ ] Acceptance criteria are specific and measurable  
- [ ] No sensitive information is included
- [ ] Appropriate project category is selected
- [ ] Effort estimation is realistic
- [ ] Required skills are clearly listed
- [ ] Relevant resources and links are provided
- [ ] Task is tagged as "Bounty" in Notion
- [ ] Bounty category is set appropriately

## Next Steps

After creating the bounty task:
1. **Review** with team lead for approval
2. **Publish** to public bounty board
3. **Monitor** for questions and applications
4. **Select** qualified contributor
5. **Provide** ongoing support during development
6. **Review** and approve final deliverables
7. **Process** payment upon completion

---

**Note**: This command follows the official ComfyUI bounty process. Always ensure tasks meet quality standards and provide clear value to the community before publishing.