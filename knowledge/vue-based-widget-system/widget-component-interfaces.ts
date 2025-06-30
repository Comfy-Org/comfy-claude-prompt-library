/**
 * Widget Component Interfaces
 * 
 * These interfaces define the subset of PrimeVue component props that are exposed
 * for the node-based widget system. They exclude props that allow custom styling,
 * colors, arbitrary CSS, or could create chaotic interfaces.
 * 
 * Based on the design authority at:
 * https://www.figma.com/design/CmhEJxo4oZSuYpqG1Yc39w/Nodes-V3?node-id=441-7806&m=dev
 */

import type {
  ButtonProps,
  InputTextProps,
  SelectProps,
  ColorPickerProps,
  MultiSelectProps,
  SelectButtonProps,
  SliderProps,
  TextareaProps,
  ToggleSwitchProps,
  ChartProps,
  ImageProps,
  ImageCompareProps,
  GalleriaProps,
  FileUploadProps,
  TreeSelectProps
} from 'primevue';

/**
 * Widget Button Component
 * Excludes: style, class, iconClass, badgeClass, dt, pt
 */
export interface WidgetButtonProps extends Omit<
  ButtonProps,
  | 'style'
  | 'class'
  | 'iconClass'
  | 'badgeClass'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget InputText Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetInputTextProps extends Omit<
  InputTextProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget Select Component
 * Excludes: style, class, inputClass, inputStyle, panelClass, panelStyle, overlayClass, labelStyle, dt, pt
 */
export interface WidgetSelectProps extends Omit<
  SelectProps,
  | 'style'
  | 'class'
  | 'inputClass'
  | 'inputStyle'
  | 'panelClass'
  | 'panelStyle'
  | 'overlayClass'
  | 'labelStyle'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget ColorPicker Component
 * Excludes: style, class, panelClass, overlayClass, dt, pt
 */
export interface WidgetColorPickerProps extends Omit<
  ColorPickerProps,
  | 'style'
  | 'class'
  | 'panelClass'
  | 'overlayClass'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget MultiSelect Component
 * Excludes: style, class, overlayClass, overlayStyle, panelClass, panelStyle, dt, pt
 */
export interface WidgetMultiSelectProps extends Omit<
  MultiSelectProps,
  | 'style'
  | 'class'
  | 'overlayClass'
  | 'overlayStyle'
  | 'panelClass'
  | 'panelStyle'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget SelectButton Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetSelectButtonProps extends Omit<
  SelectButtonProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget Slider Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetSliderProps extends Omit<
  SliderProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget Textarea Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetTextareaProps extends Omit<
  TextareaProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget ToggleSwitch Component
 * Excludes: style, class, inputClass, inputStyle, dt, pt
 */
export interface WidgetToggleSwitchProps extends Omit<
  ToggleSwitchProps,
  | 'style'
  | 'class'
  | 'inputClass'
  | 'inputStyle'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget Chart Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetChartProps extends Omit<
  ChartProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget Image Component
 * Excludes: style, class, imageClass, imageStyle, dt, pt
 */
export interface WidgetImageProps extends Omit<
  ImageProps,
  | 'style'
  | 'class'
  | 'imageClass'
  | 'imageStyle'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget ImageCompare Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetImageCompareProps extends Omit<
  ImageCompareProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget Galleria Component
 * Excludes: style, class, thumbnailsPosition, verticalThumbnailViewPortHeight, 
 * indicatorsPosition, maskClass, containerStyle, containerClass, galleriaClass, dt, pt
 */
export interface WidgetGalleriaProps extends Omit<
  GalleriaProps,
  | 'style'
  | 'class'
  | 'thumbnailsPosition'
  | 'verticalThumbnailViewPortHeight'
  | 'indicatorsPosition'
  | 'maskClass'
  | 'containerStyle'
  | 'containerClass'
  | 'galleriaClass'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget FileUpload Component
 * Excludes: style, class, dt, pt
 */
export interface WidgetFileUploadProps extends Omit<
  FileUploadProps,
  | 'style'
  | 'class'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Widget TreeSelect Component
 * Excludes: style, class, inputClass, inputStyle, panelClass, dt, pt
 */
export interface WidgetTreeSelectProps extends Omit<
  TreeSelectProps,
  | 'style'
  | 'class'
  | 'inputClass'
  | 'inputStyle'
  | 'panelClass'
  | 'dt'
  | 'pt'
  | 'ptOptions'
  | 'unstyled'
> {}

/**
 * Export all widget interfaces as a single type for convenience
 */
export type WidgetComponentProps = 
  | WidgetButtonProps
  | WidgetInputTextProps
  | WidgetSelectProps
  | WidgetColorPickerProps
  | WidgetMultiSelectProps
  | WidgetSelectButtonProps
  | WidgetSliderProps
  | WidgetTextareaProps
  | WidgetToggleSwitchProps
  | WidgetChartProps
  | WidgetImageProps
  | WidgetImageCompareProps
  | WidgetGalleriaProps
  | WidgetFileUploadProps
  | WidgetTreeSelectProps;