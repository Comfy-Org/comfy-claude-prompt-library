# Widget Componet APIs


## Background

Vue node based system will have PrimeVue components for widgets/inputs

### Design

The design is the authority on the widget components. It is here:

[https://www.figma.com/design/CmhEJxo4oZSuYpqG1Yc39w/Nodes-V3?node-id=441-7806&m=dev](https://www.figma.com/design/CmhEJxo4oZSuYpqG1Yc39w/Nodes-V3?node-id=441-7806&m=dev)

### Python Public API

For the public API, the Python Schema will follow the pattern of:

[https://github.com/comfyanonymous/ComfyUI/blob/54e0d6b1611b108004435c641227a8ca8ba7f1e9/comfy_api/v3_01/io.py](https://github.com/comfyanonymous/ComfyUI/blob/54e0d6b1611b108004435c641227a8ca8ba7f1e9/comfy_api/v3_01/io.py)

### Frontend TypeScript Public API

And for the public frontend API, the Typescript interfaces will follow the pattern of:

```tsx
Omit<
  ButtonProps,
  | "style"
  | "class"
  | "label"
  | "icon"
  | "iconPos"
>
```

## Goal

Determine subset of API to expose for the node schema

## Criteria

This is based solely from a design UI perspective. Not so much from a functional one. Below are the props to exclude.

**❌ EXCLUDE CRITERIA**: Props that allow custom styling, colors, arbitrary CSS, or could create chaotic interfaces

(Include the rest)

---

## 1. Button

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| iconClass | ❌ | Allows custom styling |
| badgeClass | ❌ | Allows custom styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 2. InputText

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 3. Select

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| inputClass | ❌ | Allows custom styling |
| inputStyle | ❌ | Allows arbitrary CSS styling |
| panelClass | ❌ | Allows custom styling |
| panelStyle | ❌ |  |
| overlayClass | ❌ | Allows custom styling |
| labelStyle | ❌ |  |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 4. ColorPicker

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| panelClass | ❌ | Allows custom styling |
| overlayClass | ❌ |  |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 5. MultiSelect

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| overlayClass | ❌ | Allows custom styling |
| overlayStyle | ❌ |  |
| panelClass | ❌ | Allows custom styling |
| panelStyle | ❌ |  |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 6. SelectButton

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 7. Slider

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 8. Textarea

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 9. ToggleSwitch

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| inputClass | ❌ | Allows custom styling |
| inputStyle | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 10. Chart

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 11. Image

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| imageClass | ❌ | Allows custom styling |
| imageStyle | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 12. ImageCompare

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 13. Galleria

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| thumbnailsPosition | ❌ | Predefined layout options |
| verticalThumbnailViewPortHeight | ❌ | Could allow inappropriate sizing |
| indicatorsPosition | ❌ | Predefined layout options |
| maskClass | ❌ | Allows custom styling |
| containerStyle | ❌ | Allows arbitrary CSS styling |
| containerClass | ❌ |  |
| galleriaClass | ❌ | Allows custom styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 14. FileUpload

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## 15. TreeSelect

| Prop Name | Decision | Reason |
| --- | --- | --- |
| style | ❌ | Allows arbitrary CSS styling |
| class | ❌ | Allows arbitrary CSS styling |
| inputClass | ❌ |  |
| inputStyle | ❌ |  |
| panelClass | ❌ | Allows custom styling |
| dt | ❌ | Allows custom styling via design tokens |
| pt | ❌ | Allows arbitrary customization |

---

## Summary of Exclusion Patterns

### Always Exclude:

1. **`style`** - Direct CSS injection that bypasses design system constraints
2. **`class`** - External CSS classes that can override visual consistency
3. **`dt`** - Design token system allowing runtime styling modifications
4. **`pt`** - PassThrough API providing direct DOM element acces