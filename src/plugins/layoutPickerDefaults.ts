/**
 * Default Layout Templates
 * 
 * Predefined layout templates with icons for the layout picker plugin.
 * Users can use these defaults or provide their own custom layouts.
 */

export interface LayoutTemplate {
  id: string;           // Layout format string (e.g., '1-1', '2-1')
  label: string;        // Display name
  icon: string;         // SVG string or image URL
}

/**
 * Default layout templates
 * Users can spread these with their custom layouts or replace entirely
 */
export const DEFAULT_LAYOUTS: LayoutTemplate[] = [
  {
    id: '1',
    label: 'Single Column',
    icon: `<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: '1-1',
    label: 'Two Columns',
    icon: `<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="27" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
      <rect x="43" y="10" width="27" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: '2-1',
    label: 'Sidebar Right',
    icon: `<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="40" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
      <rect x="56" y="10" width="14" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: '1-2',
    label: 'Sidebar Left',
    icon: `<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="14" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
      <rect x="30" y="10" width="40" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: '1-1-1',
    label: 'Three Columns',
    icon: `<svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="16" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
      <rect x="32" y="10" width="16" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
      <rect x="54" y="10" width="16" height="40" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
    </svg>`
  }
];

