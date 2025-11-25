---
name: external-tooltip
description: A customizable tooltip that can be attached to any element on the page using CSS selectors with automatic positioning.
keywords: tooltip, hover, popup, hint, information, help, icon
---

#### External Tooltip

***Purpose:***
Creates tooltips that appear when users hover over specified elements on the page, with automatic positioning based on available space.

***Features:***
- Target elements using CSS selectors (classes, IDs, or attributes)
- Automatic positioning based on available screen space
- Manual position override (top, bottom, left, right)
- Customizable appearance (colors, content, distance, padding, font size)
- Optional icon at the beginning or end of the tooltip with adjustable size
- Ability to toggle icon visibility
- Smooth fade-in/fade-out animation
- Smart positioning to prevent tooltips from being cut off at screen edges
- Single-line display that prevents text wrapping
- Prioritizes bottom positioning when there's not enough space at the top

***Properties:***
- targetSelector: string - CSS selector for elements that should trigger the tooltip (e.g., ".button", "#element-id", "[data-tooltip]")
- tooltipContent: string - Text content to display inside the tooltip
- position: 'auto'|'top'|'bottom'|'left'|'right' - Preferred position of the tooltip relative to target
- offset: number - Distance in pixels between the tooltip and target element
- backgroundColor: string - Background color of the tooltip
- textColor: string - Text color inside the tooltip
- padding: string - CSS padding value for the tooltip (e.g., "8px", "8px 12px")
- fontSize: string - Font size for the tooltip text (e.g., "14px", "1rem")
- icon: string - Optional icon to display in the tooltip
- showIcon: boolean - Toggle to show or hide the icon
- iconSize: string - Size of the icon (e.g., "16px", "1.2em")
- iconPosition: 'start'|'end' - Position of the icon relative to the tooltip text

***Notes:***
- The tooltip will automatically find all elements matching the targetSelector when the page loads
- For best results, ensure target elements have position: relative, absolute, or fixed
- The tooltip will try to position itself in the preferred position, but will adjust if there's not enough space
- In edit mode, tooltips are disabled to prevent interference with the editor
- Supports all CSS selector types: classes (.classname), IDs (#idname), and attributes ([attribute])
- Icons can be placed at the beginning or end of the tooltip text for enhanced visual communication
- Icon display can be toggled on/off and its size can be customized
- Smart positioning algorithm prevents tooltips from being cut off at screen edges
- Tooltips always display in a single line without text wrapping
- When there's not enough space at the top, tooltips will automatically appear below the element