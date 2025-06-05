
# LAIGENT Layout System Documentation

## Overview
The LAIGENT application uses a standardized layout system to ensure consistent user experience across all pages.

## Layout Components

### UniversalLayout
The primary layout component that provides:
- Universal top navigation with back/home buttons
- Keyboard navigation support (Alt+B for back, Alt+H for home)
- Consistent spacing and styling
- Fixed positioning for navigation elements

### Usage Pattern
All pages should follow this structure:

```tsx
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function YourPage() {
  return (
    <UniversalLayout>
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          {/* Page content */}
        </div>
      </div>
    </UniversalLayout>
  );
}
```

## Navigation Standards

### UniversalTopNav
- Fixed position at top-left corner
- Back button (Alt+B) - navigates to previous page or dashboard
- Home button (Alt+H) - navigates to dashboard
- Hidden on landing page
- Semi-transparent with backdrop blur effect

### Keyboard Navigation
- Alt+B: Go back (or to dashboard if no history)
- Alt+H: Go to dashboard

## Page Structure Requirements

1. **Layout Wrapper**: All pages must use `UniversalLayout`
2. **Top Padding**: Use `pt-16` to account for fixed navigation
3. **Container**: Use standard container with responsive padding
4. **Max Width**: Use `max-w-7xl` for content width constraint

## Pages Using Standard Layout
- Dashboard (Index)
- Chat
- Profile
- Knowledge Base
- Content Generator
- Content Analytics
- Content Library
- Learning Management
- Billing
- Admin

## Special Cases
- Landing page: Does not use UniversalLayout (no navigation needed)
- 404 page: Uses its own layout structure

## Implementation Notes
- The `useKeyboardNavigation` hook is automatically included in UniversalLayout
- Navigation elements have consistent hover effects and shadows
- All navigation is accessibility-friendly with proper titles
- Layout is responsive and works across all screen sizes

## Maintenance
When adding new pages:
1. Always wrap content in `UniversalLayout`
2. Follow the standard page structure pattern
3. Ensure proper spacing with `pt-16`
4. Test keyboard navigation functionality
