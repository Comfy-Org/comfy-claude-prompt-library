# PrimeVue Component API Report

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

## Button

**Documentation:** [https://primevue.org/button/](https://primevue.org/button/)  
**Type Definition:** `node_modules/primevue/button/index.d.ts`

Button is an extension to standard button element with icons and theming.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `label` | `string \| undefined` | `undefined` | Text of the button. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the button. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'text' \| 'link' \| undefined` | `undefined` | Specifies the variant of the component. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `style` | `any` | `undefined` | Inline style of the button. |
| ☐ | 🟡 | `class` | `any` | `undefined` | Style class of the button. |
| ☐ | 🟡 | `iconClass` | `string \| object \| undefined` | `undefined` | Style class of the icon. |
| ☐ | 🟡 | `badgeClass` | `string \| object \| undefined` | `undefined` | Style class of the badge. |
| ☐ | 🟡 | `badgeSeverity` | `HintedString<'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast'> \| null \| undefined` | `undefined` | Severity type of the badge. |
| ☐ | 🟡 | `severity` | `HintedString<'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'> \| undefined` | `undefined` | Defines the style of the button. |
| ☐ | 🟡 | `raised` | `boolean \| undefined` | `false` | Add a shadow to indicate elevation. |
| ☐ | 🟡 | `rounded` | `boolean \| undefined` | `false` | Add a circular border radius to the button. |
| ☐ | 🟡 | `text` | `boolean \| undefined` | `false` | Add a textual class to the button without a background initially. |
| ☐ | 🟡 | `outlined` | `boolean \| undefined` | `false` | Add a border class without a background initially. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `icon` | `string \| undefined` | `undefined` | Name of the icon. |
| ☐ | 🟢 | `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom' \| undefined` | `left` | Position of the icon. |
| ☐ | 🟢 | `badge` | `string \| undefined` | `undefined` | Value of the badge. |
| ☐ | 🟢 | `loading` | `boolean \| undefined` | `false` | Whether the button is in loading state. |
| ☐ | 🟢 | `loadingIcon` | `string \| undefined` | `undefined` | Icon to display in loading state. |
| ☐ | 🟢 | `as` | `string \| Component \| undefined` | `BUTTON` | Use to change the HTML tag of root element. |
| ☐ | 🟢 | `asChild` | `boolean \| undefined` | `false` | When enabled, it changes the default rendered element for the one passed as a child element. |
| ☐ | 🟢 | `link` | `boolean \| undefined` | `false` | Add a link style to the button. |
| ☐ | 🟢 | `plain` | `boolean \| undefined` | `false` | Add a plain textual class to the button without a background initially.  [DEPRECATED] since v4.2.0. Use a contrast severity instead. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## InputNumber

**Documentation:** [https://primevue.org/inputnumber/](https://primevue.org/inputnumber/)  
**Type Definition:** `node_modules/primevue/inputnumber/index.d.ts`

InputNumber is an input component to provide numerical input.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `Nullable<number>` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `Nullable<number>` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined` | `outlined` | Specifies the input variant of the component. |
| ☐ | 🔴 | `placeholder` | `string \| undefined` | `undefined` | Placeholder text for the input. |
| ☐ | 🔴 | `ariaLabelledby` | `string \| undefined` | `undefined` | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| ☐ | 🔴 | `ariaLabel` | `string \| undefined` | `undefined` | Establishes a string value that labels the component. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `incrementButtonClass` | `string \| undefined` | `undefined` | Style class of the increment button. |
| ☐ | 🟡 | `decrementButtonClass` | `string \| undefined` | `undefined` | Style class of the decrement button. |
| ☐ | 🟡 | `inputClass` | `string \| object \| undefined` | `undefined` | Style class of the input field. |
| ☐ | 🟡 | `inputStyle` | `object \| undefined` | `undefined` | Inline style of the input field. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `format` | `boolean \| undefined` | `true` | Whether to format the value. |
| ☐ | 🟢 | `showButtons` | `boolean \| undefined` | `false` | Displays spinner buttons. |
| ☐ | 🟢 | `buttonLayout` | `'stacked' \| 'horizontal' \| 'vertical' \| undefined` | `stacked` | Layout of the buttons. |
| ☐ | 🟢 | `incrementButtonIcon` | `string \| undefined` | `undefined` | Style class of the increment icon.  [DEPRECATED] since v4.0. Use 'incrementIcon'. |
| ☐ | 🟢 | `incrementIcon` | `string \| undefined` | `undefined` | Style class of the increment icon. |
| ☐ | 🟢 | `decrementButtonIcon` | `string \| undefined` | `undefined` | Style class of the decrement icon.  [DEPRECATED] since v4.0. Use 'decrementIcon'. |
| ☐ | 🟢 | `decrementIcon` | `string \| undefined` | `undefined` | Style class of the decrement icon. |
| ☐ | 🟢 | `locale` | `string \| undefined` | `undefined` | Locale to be used in formatting. |
| ☐ | 🟢 | `localeMatcher` | `'lookup' \| 'best fit' \| undefined` | `best fit` | The locale matching algorithm to use. Possible values are 'lookup' and 'best fit'; the default is 'best fit'. See [Locale Negotation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_negotiation) for details. |
| ☐ | 🟢 | `mode` | `'decimal' \| 'currency' \| undefined` | `decimal` | Defines the behavior of the component. |
| ☐ | 🟢 | `prefix` | `string \| undefined` | `undefined` | Text to display before the value. |
| ☐ | 🟢 | `suffix` | `string \| undefined` | `undefined` | Text to display after the value. |
| ☐ | 🟢 | `currency` | `string \| undefined` | `undefined` | The currency to use in currency formatting. Possible values are the [ISO 4217 currency codes](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency), such as 'USD' for the US dollar, 'EUR' for the euro, or 'CNY' for the Chinese RMB. There is no default value; if the style is 'currency', the currency property must be provided. |
| ☐ | 🟢 | `currencyDisplay` | `string \| undefined` | `symbol` | How to display the currency in currency formatting. Possible values are 'symbol' to use a localized currency symbol such as €, 'code' to use the ISO currency code, 'name' to use a localized currency name such as 'dollar'. |
| ☐ | 🟢 | `useGrouping` | `boolean \| undefined` | `true` | Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. |
| ☐ | 🟢 | `minFractionDigits` | `number \| undefined` | `undefined` | The minimum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number and percent formatting is 0; the default for currency formatting is the number of minor unit digits provided by the [ISO 4217 currency code](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency) list (2 if the list doesn't provide that information). |
| ☐ | 🟢 | `maxFractionDigits` | `number \| undefined` | `undefined` | The maximum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number formatting is the larger of minimumFractionDigits and 3; the default for currency formatting is the larger of minimumFractionDigits and the number of minor unit digits provided by the [ISO 4217 currency code](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency) list (2 if the list doesn't provide that information). |
| ☐ | 🟢 | `roundingMode` | `RoundingMode` | `undefined` | How decimals should be rounded. The default value is `"halfExpand"`, [further information](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#roundingmode). |
| ☐ | 🟢 | `min` | `number \| undefined` | `undefined` | Minimum boundary value. |
| ☐ | 🟢 | `max` | `number \| undefined` | `undefined` | Maximum boundary value. |
| ☐ | 🟢 | `step` | `number \| undefined` | `1` | Step factor to increment/decrement the value. |
| ☐ | 🟢 | `allowEmpty` | `boolean \| undefined` | `true` | Determines whether the input field is empty. |
| ☐ | 🟢 | `highlightOnFocus` | `boolean \| undefined` | `false` | Highlights automatically the input value. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `readonly` | `boolean \| undefined` | `false` | When present, it specifies that an input field is read-only. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | Identifier of the focus input to match a label defined for the chips. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## InputText

**Documentation:** [https://primevue.org/inputtext/](https://primevue.org/inputtext/)  
**Type Definition:** `node_modules/primevue/inputtext/index.d.ts`

InputText renders a text field to enter data.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `Nullable<string>` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `Nullable<string>` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined \| null` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined \| null` | `outlined` | Specifies the input variant of the component. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined \| null` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined \| null` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## Select

**Documentation:** [https://primevue.org/select/](https://primevue.org/select/)  
**Type Definition:** `node_modules/primevue/select/index.d.ts`

Select is used to choose an item from a collection of options.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `any` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `any` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `options` | `any[]` | `undefined` | An array of select items to display as the available options. |
| ☐ | 🔴 | `optionLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option. |
| ☐ | 🔴 | `optionValue` | `string \| ((data: any) => any) \| undefined` | `undefined` | Property name or getter function to use as the value of an option, defaults to the option itself when not defined. |
| ☐ | 🔴 | `optionDisabled` | `string \| ((data: any) => boolean) \| undefined` | `undefined` | Property name or getter function to use as the disabled flag of an option, defaults to false when not defined. |
| ☐ | 🔴 | `optionGroupLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option group. |
| ☐ | 🔴 | `filterPlaceholder` | `string \| undefined` | `undefined` | Placeholder text to show when filter input is empty. |
| ☐ | 🔴 | `placeholder` | `string \| undefined` | `undefined` | Default text to display when no option is selected. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined` | `outlined` | Specifies the input variant of the component. |
| ☐ | 🔴 | `labelId` | `string \| undefined` | `undefined` | Identifier of the underlying label element. |
| ☐ | 🔴 | `labelStyle` | `object \| undefined` | `undefined` | Inline style of the label field. |
| ☐ | 🔴 | `labelClass` | `string \| object \| undefined` | `undefined` | Style class of the label field. |
| ☐ | 🔴 | `virtualScrollerOptions` | `VirtualScrollerProps` | `undefined` | Whether to use the virtualScroller feature. The properties of VirtualScroller component can be used like an object in it. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `inputStyle` | `object \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'labelStyle' instead.Inline style of the input field. |
| ☐ | 🟡 | `inputClass` | `string \| object \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'labelClass' instead.Style class of the input field. |
| ☐ | 🟡 | `labelStyle` | `object \| undefined` | `undefined` | Inline style of the label field. |
| ☐ | 🟡 | `labelClass` | `string \| object \| undefined` | `undefined` | Style class of the label field. |
| ☐ | 🟡 | `panelStyle` | `object \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayStyle' instead.Inline style of the overlay panel. |
| ☐ | 🟡 | `panelClass` | `string \| object \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayClass' instead.Style class of the overlay panel. |
| ☐ | 🟡 | `overlayStyle` | `object \| undefined` | `undefined` | Inline style of the overlay. |
| ☐ | 🟡 | `overlayClass` | `string \| object \| undefined` | `undefined` | Style class of the overlay. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `optionGroupChildren` | `string \| ((data: any) => any[]) \| undefined` | `undefined` | Property name or getter function that refers to the children options of option group. |
| ☐ | 🟢 | `scrollHeight` | `string \| undefined` | `14rem` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| ☐ | 🟢 | `filter` | `boolean \| undefined` | `false` | When specified, displays a filter input at header. |
| ☐ | 🟢 | `filterLocale` | `string \| undefined` | `undefined` | Locale to use in filtering. The default locale is the host environment's current locale. |
| ☐ | 🟢 | `filterMatchMode` | `HintedString<'contains' \| 'startsWith' \| 'endsWith'> \| undefined` | `contains` | Defines the filtering algorithm to use when searching the options. |
| ☐ | 🟢 | `filterFields` | `string[] \| undefined` | `undefined` | Fields used when filtering the options, defaults to optionLabel. |
| ☐ | 🟢 | `editable` | `boolean \| undefined` | `false` | When present, custom value instead of predefined options can be entered using the editable input field. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `dataKey` | `string \| undefined` | `undefined` | A property to uniquely identify an option. |
| ☐ | 🟢 | `showClear` | `boolean \| undefined` | `false` | When enabled, a clear icon is displayed to clear the value. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'labelId' instead.Identifier of the underlying input element. |
| ☐ | 🟢 | `appendTo` | `HintedString<'body' \| 'self'> \| undefined \| HTMLElement` | `body` | A valid query selector or an HTMLElement to specify where the overlay gets attached. |
| ☐ | 🟢 | `loading` | `boolean \| undefined` | `false` | Whether the select is in loading state. |
| ☐ | 🟢 | `clearIcon` | `string \| undefined` | `undefined` | Icon to display in clear button. |
| ☐ | 🟢 | `dropdownIcon` | `string \| undefined` | `undefined` | Icon to display in the select. |
| ☐ | 🟢 | `filterIcon` | `string \| undefined` | `undefined` | Icon to display in filter input. |
| ☐ | 🟢 | `loadingIcon` | `string \| undefined` | `undefined` | Icon to display in loading state. |
| ☐ | 🟢 | `resetFilterOnHide` | `boolean` | `false` | Clears the filter value when hiding the select. |
| ☐ | 🟢 | `resetFilterOnClear` | `boolean` | `false` | Clears the filter value when clicking on the clear icon. |
| ☐ | 🟢 | `autoOptionFocus` | `boolean \| undefined` | `false` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| ☐ | 🟢 | `autoFilterFocus` | `boolean \| undefined` | `false` | Whether to focus on the filter element when the overlay panel is shown. |
| ☐ | 🟢 | `selectOnFocus` | `boolean \| undefined` | `false` | When enabled, the focused option is selected. |
| ☐ | 🟢 | `focusOnHover` | `boolean \| undefined` | `true` | When enabled, the focus is placed on the hovered option. |
| ☐ | 🟢 | `highlightOnSelect` | `boolean \| undefined` | `true` | Whether the selected option will be add highlight class. |
| ☐ | 🟢 | `checkmark` | `boolean \| undefined` | `false` | Whether the selected option will be shown with a check mark. |

### Design Decisions

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

## CascadeSelect

**Documentation:** [https://primevue.org/cascadeselect/](https://primevue.org/cascadeselect/)  
**Type Definition:** `node_modules/primevue/cascadeselect/index.d.ts`

CascadeSelect is a form component to select a value from a nested structure of options.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `any \| undefined` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `any \| undefined` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `options` | `any[] \| undefined` | `undefined` | An array of selectitems to display as the available options. |
| ☐ | 🔴 | `optionLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option. |
| ☐ | 🔴 | `optionValue` | `string \| ((data: any) => any) \| undefined` | `undefined` | Property name or getter function to use as the value of an option, defaults to the option itself when not defined. |
| ☐ | 🔴 | `optionDisabled` | `string \| ((data: any) => boolean) \| undefined` | `undefined` | Property name or getter function to use as the disabled flag of an option, defaults to false when not defined. |
| ☐ | 🔴 | `optionGroupLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option group. |
| ☐ | 🔴 | `placeholder` | `string \| undefined` | `undefined` | Default text to display when no option is selected. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined` | `outlined` | Specifies the input variant of the component. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `inputStyle` | `object \| undefined` | `undefined` | Inline style of the input field. |
| ☐ | 🟡 | `inputClass` | `string \| object \| undefined` | `undefined` | Style class of the input field. |
| ☐ | 🟡 | `panelStyle` | `object \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayStyle' prop.Inline style of the overlay overlay. |
| ☐ | 🟡 | `panelClass` | `string \| object \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayClass' prop.Style class of the overlay overlay. |
| ☐ | 🟡 | `overlayStyle` | `object \| undefined` | `undefined` | Inline style of the overlay overlay. |
| ☐ | 🟡 | `overlayClass` | `string \| object \| undefined` | `undefined` | Style class of the overlay overlay. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `optionGroupChildren` | `string[] \| string \| ((data: any) => any[]) \| undefined` | `undefined` | Property name or getter function to retrieve the items of a group. |
| ☐ | 🟢 | `breakpoint` | `string \| undefined` | `960px` | The breakpoint to define the maximum width boundary. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `dataKey` | `string \| undefined` | `undefined` | A property to uniquely identify an option. |
| ☐ | 🟢 | `showClear` | `boolean \| undefined` | `false` | When enabled, a clear icon is displayed to clear the value. |
| ☐ | 🟢 | `clearIcon` | `string \| undefined` | `undefined` | Icon to display in clear button. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | Identifier of the underlying input element. |
| ☐ | 🟢 | `inputProps` | `InputHTMLAttributes \| undefined` | `undefined` | Used to pass all properties of the HTMLInputElement to the focusable input element inside the component. |
| ☐ | 🟢 | `panelProps` | `HTMLAttributes \| undefined` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayProps' prop.Used to pass all properties of the HTMLDivElement to the overlay overlay inside the component. |
| ☐ | 🟢 | `overlayProps` | `HTMLAttributes \| undefined` | `undefined` | Used to pass all properties of the HTMLDivElement to the overlay overlay inside the component. |
| ☐ | 🟢 | `appendTo` | `HintedString<'body' \| 'self'> \| undefined \| HTMLElement` | `body` | A valid query selector or an HTMLElement to specify where the overlay gets attached. Special keywords are 'body' for document body and 'self' for the element itself. |
| ☐ | 🟢 | `loading` | `boolean \| undefined` | `false` | Whether the dropdown is in loading state. |
| ☐ | 🟢 | `dropdownIcon` | `string \| undefined` | `undefined` | Icon to display in the dropdown. |
| ☐ | 🟢 | `loadingIcon` | `string \| undefined` | `undefined` | Icon to display in loading state. |
| ☐ | 🟢 | `optionGroupIcon` | `string \| undefined` | `undefined` | Icon to display in the option group. |
| ☐ | 🟢 | `autoOptionFocus` | `boolean \| undefined` | `false` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| ☐ | 🟢 | `selectOnFocus` | `boolean \| undefined` | `false` | When enabled, the focused option is selected/opened. |
| ☐ | 🟢 | `focusOnHover` | `boolean \| undefined` | `true` | When enabled, the focus is placed on the hovered option. |
| ☐ | 🟢 | `searchLocale` | `string \| undefined` | `undefined` | Locale to use in searching. The default locale is the host environment's current locale. |

### Design Decisions

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

## ColorPicker

**Documentation:** [https://primevue.org/colorpicker/](https://primevue.org/colorpicker/)  
**Type Definition:** `node_modules/primevue/colorpicker/index.d.ts`

ColorPicker groups a collection of contents in tabs.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `any` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `any` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `panelClass` | `any` | `undefined` | Style class of the overlay panel.  [DEPRECATED] since v4.0. Use 'overlayClass' prop instead. |
| ☐ | 🟡 | `overlayClass` | `any` | `undefined` | Style class of the overlay panel. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `defaultColor` | `any` | `ff0000` | Initial color to display when value is not defined. |
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `inline` | `boolean \| undefined` | `false` | Whether to display as an overlay or not. |
| ☐ | 🟢 | `format` | `'hex' \| 'rgb' \| 'hsb' \| undefined` | `hex` | Format to use in value binding, supported formats are 'hex', 'rgb' and 'hsb'. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `tabindex` | `string \| undefined` | `undefined` | Index of the element in tabbing order. |
| ☐ | 🟢 | `autoZIndex` | `boolean \| undefined` | `true` | Whether to automatically manage layering. |
| ☐ | 🟢 | `baseZIndex` | `number \| undefined` | `0` | Base zIndex value to use in layering. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | Identifier of the focus input to match a label defined for the dropdown. |
| ☐ | 🟢 | `appendTo` | `HintedString<'body' \| 'self'> \| undefined \| HTMLElement` | `body` | A valid query selector or an HTMLElement to specify where the overlay gets attached. Special keywords are 'body' for document body and 'self' for the element itself. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## FloatLabel

**Documentation:** [https://primevue.org/floatlabel/](https://primevue.org/floatlabel/)  
**Type Definition:** `node_modules/primevue/floatlabel/index.d.ts`

FloatLabel visually integrates a label with its form element.

### Props Selection


#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## IconField

**Documentation:** [https://primevue.org/iconfield/](https://primevue.org/iconfield/)  
**Type Definition:** `node_modules/primevue/iconfield/index.d.ts`

IconField wraps an input and an icon.

### Props Selection


#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## InputGroup

**Documentation:** [https://primevue.org/inputgroup/](https://primevue.org/inputgroup/)  
**Type Definition:** `node_modules/primevue/inputgroup/index.d.ts`

InputGroup displays text, icon, buttons and other content can be grouped next to an input.

### Props Selection


#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## MultiSelect

**Documentation:** [https://primevue.org/multiselect/](https://primevue.org/multiselect/)  
**Type Definition:** `node_modules/primevue/multiselect/index.d.ts`

MultiSelect is used to select multiple items from a collection.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `any` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `any` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `options` | `any[] \| undefined` | `undefined` | An array of select items to display as the available options. |
| ☐ | 🔴 | `optionLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option. |
| ☐ | 🔴 | `optionValue` | `string \| ((data: any) => any) \| undefined` | `undefined` | Property name or getter function to use as the value of an option, defaults to the option itself when not defined. |
| ☐ | 🔴 | `optionDisabled` | `string \| ((data: any) => boolean) \| undefined` | `undefined` | Property name or getter function to use as the disabled flag of an option, defaults to false when not defined. |
| ☐ | 🔴 | `optionGroupLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option group. |
| ☐ | 🔴 | `placeholder` | `string \| undefined` | `undefined` | Label to display when there are no selections. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined` | `outlined` | Specifies the input variant of the component. |
| ☐ | 🔴 | `filterPlaceholder` | `string \| undefined` | `undefined` | Placeholder text to show when filter input is empty. |
| ☐ | 🔴 | `selectedItemsLabel` | `string \| undefined` | `null` | Label to display after exceeding max selected labels. |
| ☐ | 🔴 | `maxSelectedLabels` | `number \| undefined` | `undefined` | Decides how many selected item labels to show at most. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `panelStyle` | `any` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayStyle' instead.Inline style of the overlay. |
| ☐ | 🟡 | `panelClass` | `any` | `undefined` | [DEPRECATED] since v4.0. Use 'overlayClass' instead.Style class of the overlay. |
| ☐ | 🟡 | `overlayStyle` | `any` | `undefined` | Inline style of the overlay. |
| ☐ | 🟡 | `overlayClass` | `any` | `undefined` | Style class of the overlay. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `optionGroupChildren` | `string \| ((data: any) => any[]) \| undefined` | `undefined` | Property name or getter function that refers to the children options of option group. |
| ☐ | 🟢 | `scrollHeight` | `string \| undefined` | `14rem` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | Identifier of the underlying input element. |
| ☐ | 🟢 | `dataKey` | `string \| undefined` | `undefined` | A property to uniquely identify an option. |
| ☐ | 🟢 | `showClear` | `boolean \| undefined` | `false` | When enabled, a clear icon is displayed to clear the value. |
| ☐ | 🟢 | `clearIcon` | `string \| undefined` | `undefined` | Icon to display in clear button. |
| ☐ | 🟢 | `resetFilterOnClear` | `boolean` | `false` | Clears the filter value when clicking on the clear icon. |
| ☐ | 🟢 | `filter` | `boolean \| undefined` | `false` | When specified, displays a filter input at header. |
| ☐ | 🟢 | `filterLocale` | `string \| undefined` | `undefined` | Locale to use in filtering. The default locale is the host environment's current locale. |
| ☐ | 🟢 | `filterMatchMode` | `HintedString<'contains' \| 'startsWith' \| 'endsWith'> \| undefined` | `contains` | Defines the filtering algorithm to use when searching the options. |
| ☐ | 🟢 | `filterFields` | `string[] \| undefined` | `undefined` | Fields used when filtering the options, defaults to optionLabel. |
| ☐ | 🟢 | `appendTo` | `HintedString<'body' \| 'self'> \| undefined \| HTMLElement` | `body` | A valid query selector or an HTMLElement to specify where the overlay gets attached. Special keywords are 'body' for document body and 'self' for the element itself. |
| ☐ | 🟢 | `display` | `'comma' \| 'chip' \| undefined` | `comma` | Defines how the selected items are displayed. |
| ☐ | 🟢 | `selectionLimit` | `number \| undefined` | `undefined` | Maximum number of selectable items. |
| ☐ | 🟢 | `showToggleAll` | `boolean \| undefined` | `true` | Whether to show the header checkbox to toggle the selection of all items at once. |
| ☐ | 🟢 | `loading` | `boolean \| undefined` | `false` | Whether the multiselect is in loading state. |
| ☐ | 🟢 | `checkboxIcon` | `string \| undefined` | `undefined` | Icon to display in the checkboxes. |
| ☐ | 🟢 | `dropdownIcon` | `string \| undefined` | `undefined` | Icon to display in the dropdown. |
| ☐ | 🟢 | `filterIcon` | `string \| undefined` | `undefined` | Icon to display in filter input. |
| ☐ | 🟢 | `loadingIcon` | `string \| undefined` | `undefined` | Icon to display in loading state. |
| ☐ | 🟢 | `removeTokenIcon` | `string \| undefined` | `undefined` | Icon to display in chip remove action. |
| ☐ | 🟢 | `chipIcon` | `string \| undefined` | `undefined` | Icon to display in chip remove action. |
| ☐ | 🟢 | `selectAll` | `boolean \| undefined` | `false` | Whether all data is selected. |
| ☐ | 🟢 | `resetFilterOnHide` | `boolean \| undefined` | `false` | Clears the filter value when hiding the dropdown. |

### Design Decisions

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

## SelectButton

**Documentation:** [https://primevue.org/selectbutton/](https://primevue.org/selectbutton/)  
**Type Definition:** `node_modules/primevue/selectbutton/index.d.ts`

SelectButton is used to choose single or multiple items from a list using buttons.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `any` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `any` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `options` | `any[] \| undefined` | `undefined` | An array of selectitems to display as the available options. |
| ☐ | 🔴 | `optionLabel` | `string \| ((data: any) => string) \| undefined` | `undefined` | Property name or getter function to use as the label of an option. |
| ☐ | 🔴 | `optionValue` | `string \| ((data: any) => any) \| undefined` | `undefined` | Property name or getter function to use as the value of an option, defaults to the option itself when not defined. |
| ☐ | 🔴 | `optionDisabled` | `string \| ((data: any) => boolean) \| undefined` | `undefined` | Property name or getter function to use as the disabled flag of an option, defaults to false when not defined. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the element should be disabled. |
| ☐ | 🔴 | `ariaLabelledby` | `string \| undefined` | `undefined` | Identifier of the underlying element. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `multiple` | `boolean \| undefined` | `false` | When specified, allows selecting multiple values. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `dataKey` | `string \| undefined` | `undefined` | A property to uniquely identify an option. |
| ☐ | 🟢 | `allowEmpty` | `boolean \| undefined` | `true` | Whether selection can be cleared. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## Slider

**Documentation:** [https://primevue.org/slider/](https://primevue.org/slider/)  
**Type Definition:** `node_modules/primevue/slider/index.d.ts`

Slider is a component to provide input with a drag handle.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `number \| number[] \| undefined` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `number \| number[] \| undefined` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `ariaLabelledby` | `string \| undefined` | `undefined` | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| ☐ | 🔴 | `ariaLabel` | `string \| undefined` | `undefined` | Used to define a string that labels the element. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `min` | `number \| undefined` | `0` | Mininum boundary value. |
| ☐ | 🟢 | `max` | `number \| undefined` | `100` | Maximum boundary value. |
| ☐ | 🟢 | `orientation` | `'horizontal' \| 'vertical' \| undefined` | `horizontal` | Orientation of the slider. |
| ☐ | 🟢 | `step` | `number \| undefined` | `1` | Step factor to increment/decrement the value. |
| ☐ | 🟢 | `range` | `boolean \| undefined` | `false` | When speficed, allows two boundary values to be picked. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `tabindex` | `number \| undefined` | `undefined` | Index of the element in tabbing order. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## TextArea

**Documentation:** [https://primevue.org/textarea/](https://primevue.org/textarea/)  
**Type Definition:** `node_modules/primevue/textarea/index.d.ts`

Textarea is a multi-line text input element.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `Nullable<string>` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `Nullable<string>` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined` | `outlined` | Specifies the input variant of the component. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `autoResize` | `boolean \| undefined` | `false` | When present, height of textarea changes as being typed. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |
| ☐ | 🟢 | `unstyled` | `boolean` | `false` | When enabled, it removes component related styles in the core. |

### Design Decisions

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

## ToggleSwitch

**Documentation:** [https://primevue.org/toggleswitch/](https://primevue.org/toggleswitch/)  
**Type Definition:** `node_modules/primevue/toggleswitch/index.d.ts`

ToggleSwitch is used to select a boolean value.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `boolean \| string \| undefined` | `false` | Specifies whether a toggleswitch should be checked or not. |
| ☐ | 🔴 | `defaultValue` | `boolean \| string \| undefined` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `trueValue` | `any` | `true` | Value in checked state. |
| ☐ | 🔴 | `falseValue` | `any` | `false` | Value in unchecked state. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `ariaLabelledby` | `string \| undefined` | `undefined` | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| ☐ | 🔴 | `ariaLabel` | `string \| undefined` | `undefined` | Establishes a string value that labels the component. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `inputClass` | `string \| object \| undefined` | `undefined` | Style class of the input field. |
| ☐ | 🟡 | `inputStyle` | `object \| undefined` | `undefined` | Inline style of the input field. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `readonly` | `boolean \| undefined` | `undefined` | When present, it specifies that an input field is read-only. |
| ☐ | 🟢 | `tabindex` | `number \| undefined` | `undefined` | Index of the element in tabbing order. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | Identifier of the underlying input element. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## TreeSelect

**Documentation:** [https://primevue.org/treeselect/](https://primevue.org/treeselect/)  
**Type Definition:** `node_modules/primevue/treeselect/index.d.ts`

TreeSelect is a form component to choose from hierarchical data.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `modelValue` | `TreeNode \| any` | `undefined` | Value of the component. |
| ☐ | 🔴 | `defaultValue` | `TreeNode \| any` | `undefined` | The default value for the input when not controlled by `modelValue`. |
| ☐ | 🔴 | `options` | `TreeNode[] \| undefined` | `undefined` | An array of treenodes. |
| ☐ | 🔴 | `selectedItemsLabel` | `string \| undefined` | `null` | Label to display after exceeding max selected labels. |
| ☐ | 🔴 | `maxSelectedLabels` | `number \| undefined` | `undefined` | Decides how many selected item labels to show at most. |
| ☐ | 🔴 | `filterPlaceholder` | `string \| undefined` | `undefined` | Placeholder text to show when filter input is empty. |
| ☐ | 🔴 | `placeholder` | `string \| undefined` | `undefined` | Label to display when there are no selections. |
| ☐ | 🔴 | `size` | `'small' \| 'large' \| undefined` | `undefined` | Defines the size of the component. |
| ☐ | 🔴 | `disabled` | `boolean \| undefined` | `false` | When present, it specifies that the component should be disabled. |
| ☐ | 🔴 | `variant` | `'outlined' \| 'filled' \| undefined` | `outlined` | Specifies the input variant of the component. |
| ☐ | 🔴 | `ariaLabelledby` | `string \| undefined` | `undefined` | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| ☐ | 🔴 | `ariaLabel` | `string \| undefined` | `undefined` | Establishes a string value that labels the component. |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `inputClass` | `string \| object \| undefined` | `undefined` | Style class of the input field. |
| ☐ | 🟡 | `inputStyle` | `object \| undefined` | `undefined` | Inline style of the input field. |
| ☐ | 🟡 | `panelClass` | `any` | `undefined` | Style class of the overlay panel. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `name` | `string \| undefined` | `undefined` | The name attribute for the element, typically used in form submissions. |
| ☐ | 🟢 | `expandedKeys` | `TreeExpandedKeys` | `undefined` | A map of keys to represent the expansion state in controlled mode. |
| ☐ | 🟢 | `showClear` | `boolean \| undefined` | `false` | When enabled, a clear icon is displayed to clear the value. |
| ☐ | 🟢 | `clearIcon` | `string \| undefined` | `undefined` | Icon to display in clear button. |
| ☐ | 🟢 | `scrollHeight` | `string \| undefined` | `20rem` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| ☐ | 🟢 | `selectionMode` | `'single' \| 'multiple' \| 'checkbox' \| undefined` | `undefined` | Defines the selection mode. |
| ☐ | 🟢 | `fluid` | `boolean \| undefined` | `null` | Spans 100% width of the container when enabled. |
| ☐ | 🟢 | `appendTo` | `HintedString<'body' \| 'self'> \| undefined \| HTMLElement` | `body` | A valid query selector or an HTMLElement to specify where the overlay gets attached. |
| ☐ | 🟢 | `display` | `'comma' \| 'chip' \| undefined` | `comma` | Defines how the selected items are displayed. |
| ☐ | 🟢 | `metaKeySelection` | `boolean \| undefined` | `false` | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| ☐ | 🟢 | `loading` | `boolean \| undefined` | `false` | Whether to display loading indicator. |
| ☐ | 🟢 | `loadingIcon` | `string \| undefined` | `undefined` | Icon to display when tree is loading. |
| ☐ | 🟢 | `loadingMode` | `'mask' \| 'icon' \| undefined` | `mask` | Loading mode display. |
| ☐ | 🟢 | `filter` | `boolean \| undefined` | `false` | When specified, displays an input field to filter the items. |
| ☐ | 🟢 | `filterBy` | `string \| ((node: TreeNode) => string) \| undefined` | `label` | When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. A callable taking a TreeNode can be provided instead of a list of field names. |
| ☐ | 🟢 | `filterMode` | `'lenient' \| 'strict' \| undefined` | `lenient` | Mode for filtering. |
| ☐ | 🟢 | `filterLocale` | `string \| undefined` | `undefined` | Locale to use in filtering. The default locale is the host environment's current locale. |
| ☐ | 🟢 | `emptyMessage` | `string \| undefined` | `No available options` | Text to display when there are no options available. Defaults to value from PrimeVue locale configuration. |
| ☐ | 🟢 | `invalid` | `boolean \| undefined` | `false` | When present, it specifies that the component should have invalid state style. |
| ☐ | 🟢 | `tabindex` | `string \| undefined` | `undefined` | Index of the element in tabbing order. |
| ☐ | 🟢 | `inputId` | `string \| undefined` | `undefined` | Identifier of the underlying input element. |
| ☐ | 🟢 | `inputProps` | `InputHTMLAttributes \| undefined` | `undefined` | Used to pass all properties of the HTMLInputElement to the focusable input element inside the component. |
| ☐ | 🟢 | `formControl` | `Record<string, any> \| undefined` | `undefined` | Form control object, typically used for handling validation and form state. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## Chart

**Documentation:** [https://primevue.org/chart/](https://primevue.org/chart/)  
**Type Definition:** `node_modules/primevue/chart/index.d.ts`

Chart groups a collection of contents in tabs.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `options` | `object \| undefined` | `undefined` | Options to customize the chart. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `type` | `string \| undefined` | `undefined` | Type of the chart. |
| ☐ | 🟢 | `data` | `object \| undefined` | `undefined` | Data to display. |
| ☐ | 🟢 | `plugins` | `any[]` | `undefined` | Used to custom plugins of the chart. |
| ☐ | 🟢 | `width` | `number \| undefined` | `300` | Width of the chart in non-responsive mode. |
| ☐ | 🟢 | `height` | `number \| undefined` | `150` | Height of the chart in non-responsive mode. |
| ☐ | 🟢 | `canvasProps` | `CanvasHTMLAttributes \| undefined` | `undefined` | Used to pass all properties of the CanvasHTMLAttributes to canvas element inside the component. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## Image

**Documentation:** [https://primevue.org/image/](https://primevue.org/image/)  
**Type Definition:** `node_modules/primevue/image/index.d.ts`

Displays an image with preview and tranformation options. For multiple image, see Galleria.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `zoomInDisabled` | `boolean \| undefined` | `false` | Disable the zoom-in button |
| ☐ | 🔴 | `zoomOutDisabled` | `boolean \| undefined` | `false` | Disable the zoom-out button |

#### 🟡 Styling Props (Medium Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟡 | `imageStyle` | `any` | `undefined` | Inline style of the image element. |
| ☐ | 🟡 | `imageClass` | `any` | `undefined` | Style class of the image element. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `preview` | `boolean \| undefined` | `false` | Controls the preview functionality. |
| ☐ | 🟢 | `indicatorIcon` | `string \| undefined` | `undefined` | Custom indicator icon.  [DEPRECATED] since v4.0. Use 'previewIcon' prop instead. |
| ☐ | 🟢 | `previewIcon` | `string \| undefined` | `undefined` | Custom indicator icon. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## ImageCompare

**Documentation:** [https://primevue.org/imagecompare/](https://primevue.org/imagecompare/)  
**Type Definition:** `node_modules/primevue/imagecompare/index.d.ts`

ImageCompare compares two images side by side with a slider.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `ariaLabel` | `string \| undefined` | `undefined` | Defines a string value that labels an interactive element. |
| ☐ | 🔴 | `ariaLabelledby` | `string \| undefined` | `undefined` | Identifier of the underlying input element. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## Accordion

**Documentation:** [https://primevue.org/accordion/](https://primevue.org/accordion/)  
**Type Definition:** `node_modules/primevue/accordion/index.d.ts`

Accordion groups a collection of contents in tabs.

### Props Selection

#### 🔴 Core Props (High Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🔴 | `value` | `string \| string[] \| number \| number[] \| null \| undefined` | `null` | Value of the active panel or an array of values in multiple mode. |

#### 🟢 Advanced Props (Low Priority)

| Include | Priority | Name | Type | Default | Description |
|---------|----------|------|------|---------|-------------|
| ☐ | 🟢 | `multiple` | `boolean \| undefined` | `false` | When enabled, multiple tabs can be activated at the same time. |
| ☐ | 🟢 | `activeIndex` | `number \| number[] \| null \| undefined` | `null` | Index of the active tab or an array of indexes in multiple mode.  [DEPRECATED] since v4. Use value property instead. |
| ☐ | 🟢 | `lazy` | `boolean \| undefined` | `false` | When enabled, hidden tabs are not rendered at all. Defaults to false that hides tabs with css. |
| ☐ | 🟢 | `expandIcon` | `string \| undefined` | `undefined` | Icon of a collapsed tab. |
| ☐ | 🟢 | `collapseIcon` | `string \| undefined` | `undefined` | Icon of an expanded tab. |
| ☐ | 🟢 | `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| ☐ | 🟢 | `selectOnFocus` | `boolean \| undefined` | `false` | When enabled, the focused tab is activated. |
| ☐ | 🟢 | `dt` | `DesignToken<any>` | `undefined` | It generates scoped CSS variables using design tokens for the component. |

### Design Decisions

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

## Implementation Summary

### Component Priority Matrix

| Component | Phase | Complexity | Essential Props Count | Total Props Count |
|-----------|-------|------------|---------------------|------------------|
| Button | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 1 | 24 |
| InputNumber | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 6 | 42 |
| InputText | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 2 | 9 |
| Select | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 12 | 49 |
| CascadeSelect | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 8 | 37 |
| ColorPicker | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 3 | 17 |
| FloatLabel | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 0 | 1 |
| IconField | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 0 | 1 |
| InputGroup | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 0 | 1 |
| MultiSelect | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 11 | 45 |
| SelectButton | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 7 | 16 |
| Slider | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 5 | 15 |
| TextArea | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 4 | 11 |
| ToggleSwitch | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 7 | 16 |
| TreeSelect | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 9 | 39 |
| Chart | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 0 | 8 |
| Image | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 2 | 8 |
| ImageCompare | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 2 | 4 |
| Accordion | ☐ 1 ☐ 2 ☐ 3 ☐ 4 | ☐ Low ☐ Med ☐ High | 1 | 9 |


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
- **Total Components:** 19
- **Components with extracted props:** 19
- **Total props across all components:** 352

*Generated on 2025-06-13T19:38:19.568Z*
