#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Components from the Figma design
const components = [
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
  'Button',
  'Chart',
  'Image',
  'ImageCompare',
  'Accordion'
];

// Map component names to their URL paths
const componentUrlMap = {
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
  'Button': 'button',
  'Chart': 'chart',
  'Image': 'image',
  'ImageCompare': 'imagecompare',
  'Accordion': 'accordion'
};

function generateMarkdownTemplate() {
  let markdown = `# PrimeVue Component API Report

This report contains the API information for PrimeVue components that we're considering for our custom component library. 

**Instructions for Designer:**
- Review each component's props below
- Check the boxes next to props you want to include in our custom API
- Consider which props are essential vs. nice-to-have
- Note any missing props that might be needed

---

`;

  for (const componentName of components) {
    const urlPath = componentUrlMap[componentName];
    
    markdown += `## ${componentName}

**Documentation:** [https://primevue.org/${urlPath}/](https://primevue.org/${urlPath}/)  
**Node Modules:** \`node_modules/primevue/dist/${urlPath}/${urlPath}.d.ts\`

<!-- Component description will be filled in -->

### Props Selection

<!-- Props table will be filled in after API extraction -->

| Include | Name | Type | Default | Description |
|---------|------|------|---------|-------------|
| ☐ | \`loading\` | \`boolean\` | \`false\` | Shows loading state |
| ☐ | \`disabled\` | \`boolean\` | \`false\` | Disables the component |
| ☐ | \`size\` | \`"small" \\| "large"\` | \`null\` | Size variant |

*Note: This is a template. Actual props need to be extracted from PrimeVue docs.*

### Notes
<!-- Add any specific notes about this component -->

**Priority:** 
- [ ] High (must have)
- [ ] Medium (nice to have) 
- [ ] Low (optional)

**Implementation Complexity:**
- [ ] Simple
- [ ] Medium
- [ ] Complex

---

`;
  }
  
  markdown += `## Summary

**Total Components:** ${components.length}  

### Component Priority Matrix

| Component | Priority | Complexity | Notes |
|-----------|----------|------------|-------|
`;

  components.forEach(comp => {
    markdown += `| ${comp} | ☐ High ☐ Med ☐ Low | ☐ Simple ☐ Med ☐ Complex | |\n`;
  });

  markdown += `

### Next Steps
1. Extract actual API props from PrimeVue documentation
2. Review each component's props and check the ones to include
3. Consider grouping props by priority (essential, nice-to-have, optional)
4. Identify any custom props we might need that aren't in PrimeVue
5. Plan the implementation phases based on selected props

### Implementation Phases

**Phase 1 - Core Components**
- [ ] Button
- [ ] InputText
- [ ] Select
- [ ] ToggleSwitch

**Phase 2 - Form Components**
- [ ] InputNumber
- [ ] TextArea
- [ ] ColorPicker
- [ ] Slider

**Phase 3 - Advanced Components**
- [ ] MultiSelect
- [ ] TreeSelect
- [ ] CascadeSelect
- [ ] IconField

**Phase 4 - Layout & Display**
- [ ] Accordion
- [ ] Image
- [ ] Chart
- [ ] ImageCompare

**Phase 5 - Enhancement Components**
- [ ] FloatLabel
- [ ] InputGroup
- [ ] SelectButton

---

*Generated on ${new Date().toISOString()}*
`;

  return markdown;
}

function main() {
  console.log('Generating PrimeVue API report template...');
  
  const markdown = generateMarkdownTemplate();
  
  const outputPath = path.join(__dirname, '../primevue-component-api-report.md');
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`✅ Template generated: ${outputPath}`);
  console.log(`📋 Components included: ${components.length}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Use WebFetch tool to extract actual props from each component');
  console.log('2. Update the template with real API data');
  console.log('3. Have designer review and select props');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { components, componentUrlMap, generateMarkdownTemplate };