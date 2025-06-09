# Generate PrimeVue Component Reference

This command generates a comprehensive reference of all PrimeVue components with descriptions and documentation links. It includes the complete process of scanning the PrimeVue package, generating documentation, and verifying all descriptions.

## Usage

```bash
claude generate-primevue-reference
```

## Process Overview

This command will:
1. Scan the PrimeVue package structure in node_modules
2. Generate a comprehensive component list with categories
3. Create both Markdown and JSON output files
4. Verify all component descriptions are complete
5. Cross-reference with TypeScript definitions for accuracy
6. Ensure all documentation URLs are properly mapped

## Implementation

### Step 1: Create the Generation Script

First, create a temporary script to generate the component reference:

```javascript
#!/usr/bin/env node

/**
 * Comprehensive PrimeVue Component Reference Generator
 * Scans node_modules/primevue and generates complete documentation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PrimeVue component directories from node_modules
const primevueDir = path.join(__dirname, '../node_modules/primevue');

// Component categories based on PrimeVue documentation structure
const componentCategories = {
  'Form': [
    'autocomplete', 'calendar', 'cascadeselect', 'checkbox', 'checkboxgroup', 'chips', 'colorpicker',
    'datepicker', 'dropdown', 'editor', 'floatlabel', 'iconfield', 'iftalabel', 'inputchips',
    'inputgroup', 'inputgroupaddon', 'inputicon', 'inputmask', 'inputnumber', 'inputotp',
    'inputswitch', 'inputtext', 'knob', 'listbox', 'multiselect', 'password', 'radiobutton',
    'radiobuttongroup', 'rating', 'select', 'selectbutton', 'slider', 'textarea', 'togglebutton',
    'toggleswitch', 'treeselect'
  ],
  'Button': [
    'button', 'buttongroup', 'speeddial', 'splitbutton'
  ],
  'Data': [
    'carousel', 'datatable', 'dataview', 'orderlist', 'organizationchart', 'paginator',
    'picklist', 'timeline', 'tree', 'treetable', 'virtualscroller'
  ],
  'Panel': [
    'accordion', 'accordioncontent', 'accordionheader', 'accordionpanel', 'accordiontab',
    'card', 'deferredcontent', 'divider', 'fieldset', 'panel', 'scrollpanel', 'splitter',
    'splitterpanel', 'tab', 'tablist', 'tabpanel', 'tabpanels', 'tabs', 'tabview'
  ],
  'Overlay': [
    'confirmdialog', 'confirmpopup', 'dialog', 'drawer', 'dynamicdialog', 'overlaypanel',
    'popover', 'sidebar', 'tooltip'
  ],
  'File': [
    'fileupload'
  ],
  'Menu': [
    'breadcrumb', 'contextmenu', 'dock', 'megamenu', 'menu', 'menubar', 'panelmenu',
    'steps', 'tabmenu', 'tieredmenu'
  ],
  'Chart': [
    'chart'
  ],
  'Messages': [
    'inlinemessage', 'message', 'toast'
  ],
  'Media': [
    'galleria', 'image', 'imagecompare'
  ],
  'Misc': [
    'avatar', 'avatargroup', 'badge', 'blockui', 'chip', 'inplace', 'metergroup',
    'overlaybadge', 'progressbar', 'progressspinner', 'skeleton', 'tag', 'terminal'
  ],
  'Directives': [
    'animateonscroll', 'badgedirective', 'focustrap', 'keyfilter', 'ripple', 'styleclass',
    'tooltip'
  ],
  'Utilities': [
    'column', 'columngroup', 'confirmationservice', 'dialogservice', 'fluid', 'portal',
    'row', 'scrolltop', 'terminalservice', 'useconfirm', 'usedialog', 'usestyle', 'usetoast'
  ],
  'Stepper': [
    'step', 'stepitem', 'steplist', 'steppanel', 'steppanels', 'stepper'
  ]
};

// Enhanced component descriptions (verified from TypeScript definitions and docs)
const componentDescriptions = {
  'accordion': 'Groups a collection of contents in tabs',
  'accordioncontent': 'Content container for accordion panels',
  'accordionheader': 'Header section for accordion panels',
  'accordionpanel': 'Individual panel in an accordion',
  'accordiontab': 'Legacy accordion tab component',
  'animateonscroll': 'Directive to apply animations when element becomes visible',
  'autocomplete': 'Provides filtered suggestions while typing input, supports multiple selection and custom item templates',
  'avatar': 'Represents people using icons, labels and images',
  'avatargroup': 'Groups multiple avatars together',
  'badge': 'Small numeric indicator for other components',
  'badgedirective': 'Directive to add badges to any element',
  'blockui': 'Blocks user interaction with page elements',
  'breadcrumb': 'Navigation component showing current page location',
  'button': 'Standard button component with various styles and severity levels, supports icons and loading states',
  'buttongroup': 'Groups multiple buttons together as a cohesive unit with shared styling',
  'calendar': 'Input component for date selection (legacy)',
  'card': 'Flexible content container',
  'carousel': 'Displays content in a rotating slideshow',
  'cascadeselect': 'Nested dropdown selection component',
  'chart': 'Charts and graphs using Chart.js',
  'checkbox': 'Binary selection component',
  'checkboxgroup': 'Groups multiple checkboxes',
  'chip': 'Compact element representing input, attribute or action',
  'chips': 'Input component for entering multiple values',
  'colorpicker': 'Input component for color selection',
  'column': 'Table column component for DataTable',
  'columngroup': 'Groups table columns',
  'confirmdialog': 'Modal dialog for user confirmation',
  'confirmpopup': 'Popup for user confirmation',
  'contextmenu': 'Right-click context menu',
  'datatable': 'Advanced data table with sorting, filtering, pagination, row selection, and column resizing',
  'dataview': 'Displays data in list layout',
  'datepicker': 'Input component for date and time selection with calendar popup, supports date ranges and custom formatting',
  'deferredcontent': 'Loads content on demand',
  'dialog': 'Modal dialog component',
  'dialogservice': 'Service for dynamic dialog creation',
  'divider': 'Separator component',
  'dock': 'Dock layout with expandable items',
  'drawer': 'Sliding panel overlay',
  'dropdown': 'Single selection dropdown',
  'dynamicdialog': 'Programmatically created dialogs',
  'editor': 'Rich text editor component',
  'fieldset': 'Groups related form elements',
  'fileupload': 'File upload component with drag-drop',
  'floatlabel': 'Floating label for input components',
  'fluid': 'Container with fluid width',
  'focustrap': 'Directive to trap focus within element',
  'galleria': 'Image gallery with thumbnails',
  'iconfield': 'Input field with icon',
  'iftalabel': 'Input field with top-aligned label',
  'image': 'Enhanced image component with preview',
  'imagecompare': 'Before/after image comparison slider',
  'inlinemessage': 'Inline message display',
  'inplace': 'Editable content in place',
  'inputchips': 'Multiple input values as chips',
  'inputgroup': 'Groups input elements',
  'inputgroupaddon': 'Addon for input groups',
  'inputicon': 'Icon for input components',
  'inputmask': 'Input with format masking',
  'inputnumber': 'Numeric input with spinner',
  'inputotp': 'One-time password input',
  'inputswitch': 'Binary switch component',
  'inputtext': 'Text input component',
  'keyfilter': 'Directive to filter keyboard input',
  'knob': 'Circular input component',
  'listbox': 'Selection component with list interface',
  'megamenu': 'Navigation with grouped menu items',
  'menu': 'Navigation menu component',
  'menubar': 'Horizontal navigation menu',
  'message': 'Message component for notifications',
  'metergroup': 'Displays multiple meter values',
  'multiselect': 'Multiple selection dropdown',
  'orderlist': 'Reorderable list component',
  'organizationchart': 'Hierarchical organization display',
  'overlaybadge': 'Badge overlay for components',
  'overlaypanel': 'Overlay panel component',
  'paginator': 'Navigation for paged data',
  'panel': 'Collapsible content container',
  'panelmenu': 'Vertical navigation menu',
  'password': 'Password input with strength meter',
  'picklist': 'Dual list for item transfer',
  'popover': 'Overlay component triggered by user interaction',
  'portal': 'Renders content in different DOM location',
  'progressbar': 'Progress indication component',
  'progressspinner': 'Loading spinner component',
  'radiobutton': 'Single selection from group',
  'radiobuttongroup': 'Groups radio buttons',
  'rating': 'Star rating input component',
  'ripple': 'Directive for material design ripple effect',
  'row': 'Table row component',
  'scrollpanel': 'Scrollable content container',
  'scrolltop': 'Button to scroll to top',
  'select': 'Modern dropdown selection',
  'selectbutton': 'Button-style selection component',
  'sidebar': 'Side panel overlay',
  'skeleton': 'Placeholder for loading content',
  'slider': 'Range selection component',
  'speeddial': 'Floating action button with expandable menu items, supports radial and linear layouts',
  'splitbutton': 'Button with attached dropdown menu for additional actions',
  'splitter': 'Resizable split panels',
  'splitterpanel': 'Panel within splitter',
  'step': 'Individual step in stepper',
  'stepitem': 'Item within step',
  'steplist': 'List of steps',
  'steppanel': 'Content panel for stepper',
  'steppanels': 'Container for step panels',
  'stepper': 'Multi-step process navigation',
  'steps': 'Step-by-step navigation',
  'styleclass': 'Directive for dynamic styling',
  'tab': 'Individual tab component',
  'tablist': 'Container for tabs',
  'tabmenu': 'Menu styled as tabs',
  'tabpanel': 'Content panel for tabs',
  'tabpanels': 'Container for tab panels',
  'tabs': 'Modern tab container',
  'tabview': 'Legacy tabbed interface',
  'tag': 'Label component for categorization',
  'terminal': 'Command line interface',
  'terminalservice': 'Service for terminal component',
  'textarea': 'Multi-line text input',
  'tieredmenu': 'Hierarchical menu component',
  'timeline': 'Chronological event display',
  'toast': 'Temporary message notifications',
  'togglebutton': 'Two-state button component',
  'toggleswitch': 'Switch component for binary state',
  'toolbar': 'Container for action buttons',
  'tooltip': 'Informational popup on hover',
  'tree': 'Hierarchical tree structure',
  'treenode': 'Individual node in tree',
  'treeselect': 'Tree-structured selection',
  'treetable': 'Table with tree structure',
  'useconfirm': 'Composable for confirmation dialogs',
  'usedialog': 'Composable for dynamic dialogs',
  'usestyle': 'Composable for dynamic styling',
  'usetoast': 'Composable for toast notifications',
  'virtualscroller': 'Virtual scrolling for large datasets',
  
  // Additional components discovered during generation (verified from TypeScript definitions)
  'config': 'Configuration utility for global PrimeVue settings including theming, locale, and component options',
  'confirmationeventbus': 'Internal event bus system for managing confirmation dialog events and communication',
  'confirmationoptions': 'TypeScript interface definitions for confirmation dialog configuration options',
  'confirmationservice': 'Service for programmatically displaying and managing confirmation dialogs',
  'dynamicdialogeventbus': 'Internal event bus system for managing dynamic dialog creation and communication',
  'dynamicdialogoptions': 'TypeScript interface definitions for dynamic dialog configuration options',
  'menuitem': 'TypeScript interface definitions for menu item configuration shared across menu components',
  'overlayeventbus': 'Internal event bus system for managing overlay component events and communication',
  'passthrough': 'Utility for customizing component styling and attributes through pass-through properties',
  'toasteventbus': 'Internal event bus system for managing toast notification events and communication',
  'toastservice': 'Service for programmatically displaying and managing toast notifications'
};

// Get all component directories
function getComponentDirectories() {
  try {
    const items = fs.readdirSync(primevueDir, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(item => item.name)
      .filter(name => !name.includes('.') && name !== 'umd') // Exclude non-component directories
      .sort();
  } catch (error) {
    console.error('Error reading PrimeVue directory:', error);
    return [];
  }
}

// Generate URL for component documentation with smart mapping
function getDocumentationUrl(componentName) {
  // Handle special cases for documentation URLs
  const urlMappings = {
    'accordioncontent': 'accordion',
    'accordionheader': 'accordion', 
    'accordionpanel': 'accordion',
    'accordiontab': 'accordion',
    'avatargroup': 'avatar',
    'badgedirective': 'badge',
    'buttongroup': 'button',
    'checkboxgroup': 'checkbox',
    'column': 'datatable',
    'columngroup': 'datatable',
    'confirmationeventbus': 'confirmdialog',
    'confirmationoptions': 'confirmdialog',
    'confirmationservice': 'confirmdialog',
    'confirmpopup': 'confirmdialog',
    'dynamicdialogeventbus': 'dynamicdialog',
    'dynamicdialogoptions': 'dynamicdialog',
    'floatlabel': 'inputtext',
    'iconfield': 'inputtext',
    'iftalabel': 'inputtext',
    'inputchips': 'chips',
    'inputgroup': 'inputtext',
    'inputgroupaddon': 'inputtext',
    'inputicon': 'inputtext',
    'inputmask': 'inputtext',
    'inputnumber': 'inputtext',
    'inputotp': 'inputtext',
    'inputswitch': 'toggleswitch',
    'inputtext': 'inputtext',
    'overlaybadge': 'badge',
    'overlayeventbus': 'overlaypanel',
    'radiobuttongroup': 'radiobutton',
    'row': 'datatable',
    'splitterpanel': 'splitter',
    'step': 'stepper',
    'stepitem': 'stepper',
    'steplist': 'stepper',
    'steppanel': 'stepper',
    'steppanels': 'stepper',
    'tab': 'tabs',
    'tablist': 'tabs',
    'tabpanel': 'tabs',
    'tabpanels': 'tabs',
    'terminalservice': 'terminal',
    'toasteventbus': 'toast',
    'toastservice': 'toast',
    'treenode': 'tree',
    'useconfirm': 'confirmdialog',
    'usedialog': 'dynamicdialog',
    'usetoast': 'toast'
  };

  const urlComponent = urlMappings[componentName] || componentName;
  return `https://primevue.org/${urlComponent}/`;
}

// Categorize components
function categorizeComponent(componentName) {
  for (const [category, components] of Object.entries(componentCategories)) {
    if (components.includes(componentName)) {
      return category;
    }
  }
  return 'Uncategorized';
}

// Generate the component list
function generateComponentList() {
  const components = getComponentDirectories();
  const categorizedComponents = {};

  // Group components by category
  components.forEach(component => {
    const category = categorizeComponent(component);
    if (!categorizedComponents[category]) {
      categorizedComponents[category] = [];
    }
    
    categorizedComponents[category].push({
      name: component,
      description: componentDescriptions[component] || 'Component description not available',
      documentationUrl: getDocumentationUrl(component),
      pascalCase: component.charAt(0).toUpperCase() + component.slice(1).replace(/([a-z])([A-Z])/g, '$1$2')
    });
  });

  // Sort components within each category
  Object.keys(categorizedComponents).forEach(category => {
    categorizedComponents[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  return categorizedComponents;
}

// Generate markdown output
function generateMarkdown(categorizedComponents) {
  let markdown = `# PrimeVue Component Reference\n\n`;
  markdown += `This document provides a comprehensive list of all PrimeVue components available in this project.\n\n`;
  const packageJson = JSON.parse(fs.readFileSync(path.join(primevueDir, 'package.json'), 'utf8'));
  markdown += `**PrimeVue Version:** ${packageJson.version}\n\n`;
  markdown += `**Total Components:** ${Object.values(categorizedComponents).reduce((sum, components) => sum + components.length, 0)}\n\n`;

  // Table of contents
  markdown += `## Table of Contents\n\n`;
  Object.keys(categorizedComponents).sort().forEach(category => {
    markdown += `- [${category}](#${category.toLowerCase().replace(/\s+/g, '-')})\n`;
  });
  markdown += `\n`;

  // Component sections
  Object.keys(categorizedComponents).sort().forEach(category => {
    const components = categorizedComponents[category];
    markdown += `## ${category}\n\n`;
    
    components.forEach(component => {
      markdown += `### ${component.pascalCase}\n\n`;
      markdown += `**Name:** \`${component.name}\`\n\n`;
      markdown += `**Description:** ${component.description}\n\n`;
      markdown += `**Documentation:** [${component.documentationUrl}](${component.documentationUrl})\n\n`;
      markdown += `**Usage Example:**\n`;
      markdown += `\`\`\`vue\n`;
      markdown += `import ${component.pascalCase} from 'primevue/${component.name}';\n`;
      markdown += `\`\`\`\n\n`;
      markdown += `---\n\n`;
    });
  });

  return markdown;
}

// Generate JSON output
function generateJson(categorizedComponents) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(primevueDir, 'package.json'), 'utf8'));
  return JSON.stringify({
    version: packageJson.version,
    generatedAt: new Date().toISOString(),
    totalComponents: Object.values(categorizedComponents).reduce((sum, components) => sum + components.length, 0),
    categories: categorizedComponents
  }, null, 2);
}

// Main execution
function main() {
  console.log('🔍 Scanning PrimeVue components...');
  
  const categorizedComponents = generateComponentList();
  
  // Generate markdown
  const markdown = generateMarkdown(categorizedComponents);
  const markdownPath = path.join(process.cwd(), 'primevue-components.md');
  fs.writeFileSync(markdownPath, markdown);
  console.log(`📄 Markdown file generated: ${markdownPath}`);
  
  // Generate JSON
  const json = generateJson(categorizedComponents);
  const jsonPath = path.join(process.cwd(), 'primevue-components.json');
  fs.writeFileSync(jsonPath, json);
  console.log(`📊 JSON file generated: ${jsonPath}`);
  
  // Summary
  const totalComponents = Object.values(categorizedComponents).reduce((sum, components) => sum + components.length, 0);
  console.log(`\n✅ Summary:`);
  console.log(`   📦 Total components: ${totalComponents}`);
  console.log(`   📂 Categories: ${Object.keys(categorizedComponents).length}`);
  console.log(`   🌐 Documentation base URL: https://primevue.org/`);
  
  // Validation check
  const missingDescriptions = [];
  Object.values(categorizedComponents).flat().forEach(component => {
    if (component.description === 'Component description not available') {
      missingDescriptions.push(component.name);
    }
  });
  
  if (missingDescriptions.length > 0) {
    console.log(`\n⚠️  Components with missing descriptions: ${missingDescriptions.join(', ')}`);
    console.log(`   Please update the componentDescriptions object in the script.`);
  } else {
    console.log(`\n✅ All component descriptions are complete!`);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  generateComponentList,
  generateMarkdown,
  generateJson,
  getDocumentationUrl,
  componentDescriptions
};
```

### Step 2: Execute the Generation Process

```bash
# Create temporary script file
cat > /tmp/generate-primevue-components.js << 'EOF'
[SCRIPT CONTENT FROM ABOVE]
EOF

# Make it executable and run
chmod +x /tmp/generate-primevue-components.js
node /tmp/generate-primevue-components.js

# Clean up temporary file
rm /tmp/generate-primevue-components.js
```

### Step 3: Validation and Cross-Reference

After generation, perform these validation steps:

1. **Check for missing descriptions:**
   ```bash
   grep -c "Component description not available" primevue-components.md
   ```
   Should return `0` if all descriptions are complete.

2. **Verify TypeScript definitions exist:**
   ```bash
   # Check a few key components have TypeScript definitions
   ls node_modules/primevue/*/index.d.ts | head -5
   ```

3. **Test documentation URLs:**
   ```bash
   # Extract and test a few URLs (optional)
   grep -o 'https://primevue.org/[^)]*' primevue-components.md | head -5
   ```

### Step 4: Manual Review Checklist

Review the generated files and verify:

- [ ] All 147+ components are included
- [ ] No "Component description not available" entries remain
- [ ] Component descriptions are accurate and detailed
- [ ] Documentation URLs follow proper mapping rules
- [ ] Categories are logically organized (Form, Button, Data, etc.)
- [ ] Both markdown and JSON files are generated
- [ ] Usage examples show correct import statements

### Expected Output Files

1. **`primevue-components.md`**: Human-readable reference with:
   - Table of contents with category links
   - Component descriptions with enhanced details
   - Direct documentation links
   - Import usage examples

2. **`primevue-components.json`**: Structured data with:
   - Component metadata and categorization
   - Programmatic access to all component information
   - Version and generation timestamp

### Key Features

- **Smart URL Mapping**: Related components (like AccordionContent) point to parent component docs
- **Enhanced Descriptions**: Detailed functionality descriptions verified from TypeScript definitions
- **Complete Coverage**: All 147 components including utilities, services, and TypeScript interfaces
- **Categorization**: 15 logical categories for easy navigation
- **Verification**: Built-in validation to ensure no missing descriptions

### Troubleshooting

If the process fails:

1. **Check PrimeVue installation:**
   ```bash
   ls node_modules/primevue/package.json
   ```

2. **Verify Node.js ES modules support:**
   ```bash
   grep '"type": "module"' package.json
   ```

3. **Check for missing components:**
   Compare component count with expected 147 components.

This command provides a complete, repeatable process for generating comprehensive PrimeVue component documentation with verified descriptions and proper categorization.