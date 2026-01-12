/**
 * @fileoverview Usage Notes for AnaTech AI Search Assistant Icons
 * This file provides guidance on how to integrate and use the generated SVG icons
 * within the Next.js/React application in Firebase Studio.
 */

//
// -----------------
// 1. HOW TO USE
// -----------------
//
// You can import and use these icons like any other React component.
//
// import { AiSearchAssistantIconAdaptive } from './ai-search-assistant-icon-adaptive';
// import { AiSearchAssistantIconMonochrome } from './ai-search-assistant-icon-monochrome';
//
// function MyComponent() {
//   return (
//     <div>
//       {/* Full-color adaptive icon */}
//       <AiSearchAssistantIconAdaptive width={64} height={64} />
//
//       {/* Monochrome icon, which will inherit text color */}
//       <p className="text-blue-500">
//          <AiSearchAssistantIconMonochrome width={24} height={24} />
//          Search
//       </p>
//     </div>
//   );
// }
//

//
// -----------------
// 2. RECOMMENDED SIZES
// -----------------
//
// The icons are designed to be sharp and legible at various sizes.
//
// AiSearchAssistantIconAdaptive (Primary Icon):
// - Use for primary UI elements where the icon is a focal point.
// - Recommended sizes: 32x32, 48x48, 64x64, 128x128.
//
// AiSearchAssistantIconMonochrome (Fallback Icon):
// - Use for small UI elements, buttons, or as a favicon.
// - Recommended sizes: 16x16, 24x24.
// - This icon is designed to work well alongside text.
//

//
// -----------------
// 3. COLOR OVERRIDES
// -----------------
//
// AiSearchAssistantIconAdaptive:
// The adaptive icon uses internal CSS to switch between themes. To override,
// you would need to edit the <style> block inside the SVG component itself.
// This is not recommended unless you want to permanently change the theme colors.
//
// AiSearchAssistantIconMonochrome:
// This icon uses `stroke="currentColor"`, meaning it will automatically inherit
// the 'color' of its parent HTML element. You can change its color easily
// using Tailwind CSS text color utilities.
//
// Example:
// <AiSearchAssistantIconMonochrome className="text-red-500" />
//

//
// -----------------
// 4. ACCESSIBILITY
// -----------------
//
// Both icons include accessibility features:
// - `role="img"`: Identifies the SVG as an image to assistive technologies.
// - `<title>`: Provides a descriptive name for screen readers.
//
// If the icon is used as a purely decorative element, you can hide it from
// screen readers by adding `aria-hidden="true"`.
//
// <AiSearchAssistantIconAdaptive aria-hidden="true" />
//

/**
 * This is not a functional component, but a placeholder for documentation.
 * Do not import or use this in your application code.
 */
export const AIToolIconUsageNotes = () => null;
