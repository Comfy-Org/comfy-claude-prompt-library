#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Components from the Figma design
const components = [
  'Button',
  'InputNumber',
  'InputText', 
  'Select',
  'CascadeSelect',
  'ColorPicker',
  'FloatLabel',
  'IconField',
  'InputGroup',
  'MultiSelect',
  'SelectButton',
  'Slider',
  'TextArea',
  'ToggleSwitch',
  'TreeSelect',
  'Chart',
  'Image',
  'ImageCompare',
  'Accordion'
];

// Map component names to their file paths
const componentPathMap = {
  'Button': 'button',
  'InputNumber': 'inputnumber',
  'InputText': 'inputtext',
  'Select': 'select',
  'CascadeSelect': 'cascadeselect',
  'ColorPicker': 'colorpicker',
  'FloatLabel': 'floatlabel',
  'IconField': 'iconfield',
  'InputGroup': 'inputgroup',
  'MultiSelect': 'multiselect',
  'SelectButton': 'selectbutton',
  'Slider': 'slider',
  'TextArea': 'textarea',
  'ToggleSwitch': 'toggleswitch',
  'TreeSelect': 'treeselect',
  'Chart': 'chart',
  'Image': 'image',
  'ImageCompare': 'imagecompare',
  'Accordion': 'accordion'
};

function extractPropsFromTypeDefinition(content, componentName) {
  const props = [];
  
  // Find the Props interface
  const propsInterfaceRegex = new RegExp(`export interface ${componentName}Props[^{]*{([^}]+(?:{[^}]*}[^}]*)*)}`, 's');
  const match = content.match(propsInterfaceRegex);
  
  if (!match) {
    return props;
  }
  
  const propsContent = match[1];
  
  // Extract individual prop definitions - handle both comment styles
  const propRegex = /\/\*\*\s*((?:\s*\*.*\n)*)\s*\*\/\s*(\w+)\?\s*:\s*([^;]+);/g;
  const simplePropsRegex = /(\w+)\?\s*:\s*([^;]+);/g;
  
  let propMatch;
  
  // Try with full comments first
  while ((propMatch = propRegex.exec(propsContent)) !== null) {
    const [, comment, propName, propType] = propMatch;
    
    // Parse the comment to extract description and default value
    let description = '';
    let defaultValue = 'undefined';
    
    if (comment) {
      const lines = comment.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim()).filter(line => line);
      
      for (const line of lines) {
        if (line.startsWith('@defaultValue')) {
          defaultValue = line.replace('@defaultValue', '').trim();
        } else if (line.startsWith('@deprecated')) {
          description += ' [DEPRECATED] ' + line.replace('@deprecated', '').trim();
        } else if (!line.startsWith('@')) {
          description += line + ' ';
        }
      }
    }
    
    props.push({
      name: propName,
      type: propType.trim(),
      default: defaultValue,
      description: description.trim()
    });
  }
  
  // If no props found with comments, try simple pattern matching for TextArea-style definitions
  if (props.length === 0) {
    // Split by lines and look for property definitions
    const lines = propsContent.split('\n');
    let currentComment = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this is a comment line
      if (line.startsWith('*')) {
        currentComment += line.replace(/^\*\s?/, '').trim() + ' ';
        continue;
      }
      
      // Check if this is a property definition
      const propMatch = line.match(/(\w+)\?\s*:\s*([^;]+);/);
      if (propMatch) {
        const [, propName, propType] = propMatch;
        
        // Parse default value from comment
        let defaultValue = 'undefined';
        let description = currentComment.trim();
        
        const defaultMatch = description.match(/@defaultValue\s+(.+?)(?:\s|$)/);
        if (defaultMatch) {
          defaultValue = defaultMatch[1];
          description = description.replace(/@defaultValue\s+.+?(?:\s|$)/, '').trim();
        }
        
        props.push({
          name: propName,
          type: propType.trim(),
          default: defaultValue,
          description: description
        });
        
        currentComment = '';
      } else if (line === '') {
        currentComment = '';
      }
    }
  }
  
  return props;
}

function parseComponent(componentName) {
  const componentPath = componentPathMap[componentName];
  const filePath = path.join(__dirname, '../node_modules/primevue', componentPath, 'index.d.ts');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return {
        componentName,
        description: 'Component type definition file not found',
        props: [],
        filePath
      };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract component description from the top comment
    const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*\n\s*\*\s*(.*?)\s*\n/);
    const description = descriptionMatch ? descriptionMatch[1] : '';
    
    const props = extractPropsFromTypeDefinition(content, componentName);
    
    return {
      componentName,
      description,
      props,
      filePath
    };
  } catch (error) {
    console.error(`Error parsing ${componentName}:`, error.message);
    return {
      componentName,
      description: `Error parsing component: ${error.message}`,
      props: [],
      filePath
    };
  }
}

function generateMarkdownReport(componentData) {
  let markdown = `# PrimeVue Component API Report

This report contains the API information for PrimeVue components that we're considering for our custom component library. 

**Instructions for Designer:**
- Review each component's props below
- Check the boxes next to props you want to include in our custom API
- Consider which props are essential vs. nice-to-have
- Note any missing props that might be needed

**Legend:**
- ☐ Include this prop in our API
- 🔴 High Priority (essential for basic functionality)
- 🟡 Medium Priority (nice to have)
- 🟢 Low Priority (advanced features)

---

`;

  for (const data of componentData) {
    const componentPath = componentPathMap[data.componentName];
    
    markdown += `## ${data.componentName}

**Documentation:** [https://primevue.org/${componentPath}/](https://primevue.org/${componentPath}/)  
**Type Definition:** \`node_modules/primevue/${componentPath}/index.d.ts\`

${data.description}

### Props Selection

`;

    if (data.props.length > 0) {
      // Group props by importance (basic props vs advanced)
      const basicProps = data.props.filter(prop => 
        ['label', 'value', 'disabled', 'placeholder', 'size', 'variant', 'modelValue', 'options'].some(basic => 
          prop.name.toLowerCase().includes(basic.toLowerCase())
        )
      );
      
      const stylingProps = data.props.filter(prop => 
        ['class', 'style', 'severity', 'outlined', 'text', 'raised', 'rounded'].some(style => 
          prop.name.toLowerCase().includes(style.toLowerCase())
        )
      );
      
      const advancedProps = data.props.filter(prop => 
        !basicProps.includes(prop) && !stylingProps.includes(prop)
      );
      
      if (basicProps.length > 0) {
        markdown += `#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
`;
        
        basicProps.forEach(prop => {
          const name = prop.name.replace(/\|/g, '\\|');
          const type = prop.type.replace(/\|/g, '\\|');
          const defaultVal = prop.default.replace(/\|/g, '\\|');
          const desc = prop.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
          
          markdown += `| ☐ | 🔴 | \`${name}\` | \`${type}\` | \`${defaultVal}\` | ${desc} |\n`;
        });
      }
      
      if (stylingProps.length > 0) {
        markdown += `\n#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
`;
        
        stylingProps.forEach(prop => {
          const name = prop.name.replace(/\|/g, '\\|');
          const type = prop.type.replace(/\|/g, '\\|');
          const defaultVal = prop.default.replace(/\|/g, '\\|');
          const desc = prop.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
          
          markdown += `| ☐ | 🟡 | \`${name}\` | \`${type}\` | \`${defaultVal}\` | ${desc} |\n`;
        });
      }
      
      if (advancedProps.length > 0) {
        markdown += `\n#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
`;
        
        advancedProps.forEach(prop => {
          const name = prop.name.replace(/\|/g, '\\|');
          const type = prop.type.replace(/\|/g, '\\|');
          const defaultVal = prop.default.replace(/\|/g, '\\|');
          const desc = prop.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
          
          markdown += `| ☐ | 🟢 | \`${name}\` | \`${type}\` | \`${defaultVal}\` | ${desc} |\n`;
        });
      }
    } else {
      markdown += `*No props extracted from type definition. Please check the type file manually.*

**Action needed:** Review type definition at \`node_modules/primevue/${componentPath}/index.d.ts\`
`;
    }
    
    markdown += `\n### Design Decisions

**Priority Level:**
- [ ] Phase 1 (Must have - core functionality)
- [ ] Phase 2 (Should have - important features)  
- [ ] Phase 3 (Could have - nice to have features)
- [ ] Phase 4 (Won't have - not needed for initial release)

**Implementation Notes:**
<!-- Add any specific implementation notes or concerns -->

**Custom Props Needed:**
<!-- List any props not in PrimeVue that we might need -->

---

`;
  }
  
  markdown += `## Implementation Summary

### Component Priority Matrix

| Component | Phase | Complexity | Essential Props Count | Total Props Count |
|-----------|-------|------------|---------------------|------------------|
`;

  componentData.forEach(data => {
    const totalProps = data.props.length;
    const essentialProps = data.props.filter(prop => 
      ['label', 'value', 'disabled', 'placeholder', 'modelValue'].some(essential => 
        prop.name.toLowerCase().includes(essential.toLowerCase())
      )
    ).length;
    
    markdown += `| ${data.componentName} | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | ${essentialProps} | ${totalProps} |\n`;
  });

  markdown += `

### Development Phases

**Phase 1 - Foundation (Core Form Components)**
- [ ] Button - Essential for all interactions
- [ ] InputText - Basic text input
- [ ] Select - Dropdown selection
- [ ] ToggleSwitch - Boolean toggle

**Phase 2 - Enhanced Forms**  
- [ ] InputNumber - Numeric input with validation
- [ ] TextArea - Multi-line text input
- [ ] ColorPicker - Color selection
- [ ] Slider - Range selection

**Phase 3 - Advanced Selection**
- [ ] MultiSelect - Multiple option selection
- [ ] TreeSelect - Hierarchical selection
- [ ] CascadeSelect - Dependent selection
- [ ] SelectButton - Button-style selection

**Phase 4 - Layout & Enhancement**
- [ ] Accordion - Collapsible content
- [ ] FloatLabel - Floating label enhancement
- [ ] IconField - Input with icons
- [ ] InputGroup - Grouped inputs

**Phase 5 - Media & Visualization**
- [ ] Image - Enhanced image display
- [ ] Chart - Data visualization
- [ ] ImageCompare - Before/after comparison

### Next Steps

1. **Review & Prioritize**: Go through each component and mark priority level
2. **Select Props**: Check boxes for props to include in each phase
3. **Identify Gaps**: Note any missing props we need to add
4. **Plan Implementation**: Organize development based on phases
5. **Create Specifications**: Document exact API for each component

---

**Statistics:**
- **Total Components:** ${componentData.length}
- **Components with extracted props:** ${componentData.filter(d => d.props.length > 0).length}
- **Total props across all components:** ${componentData.reduce((sum, d) => sum + d.props.length, 0)}

*Generated on ${new Date().toISOString()}*
`;

  return markdown;
}

function main() {
  console.log('Parsing PrimeVue TypeScript definitions...');
  
  const allComponentData = [];
  
  for (const componentName of components) {
    console.log(`Parsing ${componentName}...`);
    const data = parseComponent(componentName);
    allComponentData.push(data);
    console.log(`  Found ${data.props.length} props`);
  }
  
  console.log('\nGenerating markdown report...');
  const markdown = generateMarkdownReport(allComponentData);
  
  const outputPath = path.join(__dirname, '../primevue-component-api-report.md');
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`\n✅ Report generated: ${outputPath}`);
  console.log(`📊 Processed ${allComponentData.length} components`);
  console.log(`📋 Total props extracted: ${allComponentData.reduce((sum, d) => sum + d.props.length, 0)}`);
  
  // Also save raw data as JSON for further processing
  const jsonPath = path.join(__dirname, '../primevue-api-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allComponentData, null, 2));
  console.log(`💾 Raw data saved: ${jsonPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseComponent, generateMarkdownReport };