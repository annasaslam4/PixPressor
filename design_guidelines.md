# Design Guidelines: Image Compressor & Converter Web App

## Design Approach
**Utility-First with Premium Polish**: A professional productivity tool that prioritizes efficiency while maintaining visual appeal. Drawing inspiration from tools like Canva's simplicity, Dropbox's clarity, and TinyPNG's focused interface.

## Core Design Principles
1. **Clarity Over Decoration**: Every element serves a functional purpose
2. **Instant Comprehension**: Users understand the tool immediately upon landing
3. **Progressive Disclosure**: Advanced features accessible but not overwhelming
4. **Trust Through Transparency**: Show file sizes, compression ratios, and processing status clearly

## Typography System
- **Primary Font**: Inter for UI elements, labels, and body text
- **Accent Font**: Poppins for headings and CTAs
- **Hierarchy**:
  - Hero headline: Poppins Bold, text-5xl/text-6xl
  - Section headers: Poppins SemiBold, text-3xl/text-4xl
  - Feature titles: Inter SemiBold, text-xl
  - Body/labels: Inter Regular, text-base
  - Metadata/stats: Inter Medium, text-sm

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 (p-4, m-8, gap-6, etc.)

**Container Strategy**:
- App container: max-w-7xl with px-4 md:px-8
- Upload zone: Prominent, centered, generous padding (p-12 md:p-16)
- Preview grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6

**Vertical Rhythm**: Sections spaced with py-12 md:py-20

## Component Library

### Hero/Upload Section
- Large drag-and-drop zone with dashed border, centered
- Upload icon (cloud/arrow) above headline
- Clear file format badges below (JPG, PNG, WEBP, etc.)
- Single primary CTA: "Choose Files" button with rounded-full styling

### File Preview Cards
- Before/after slider with center handle for comparison
- File metadata overlay: original size → compressed size with percentage badge
- Individual action buttons: Download, Convert, Remove
- Thumbnail with subtle shadow and rounded-lg corners

### Control Panel
- Floating toolbar with compression presets (200KB, 100KB, 50KB buttons)
- Format conversion dropdown (pill-shaped)
- Resize preset chips for Instagram/Shopify/Etsy
- Bulk download ZIP button (prominent when multiple files)

### Navigation/Header
- Minimal header: Logo left, theme toggle right, optional Pro badge
- Sticky on scroll with backdrop blur

### Footer
- SEO-rich footer with keyword sections (compress JPG, convert HEIC, etc.)
- FAQ accordion in footer area
- Social proof: "1M+ images compressed" badge

## Interaction Patterns
- **Upload**: Hover state shows blue overlay with "Drop files here"
- **Preview Slider**: Smooth drag interaction with percentage indicator
- **Buttons**: rounded-full with subtle shadow, scale on hover (no complex animations)
- **Processing**: Linear progress bars with percentage, pulsing during compression
- **Success States**: Green checkmark badges, size reduction celebration

## Responsive Strategy
**Desktop (lg+)**: 3-column preview grid, side-by-side controls
**Tablet (md)**: 2-column preview grid, stacked controls
**Mobile (base)**: Single column, full-width upload zone, bottom-fixed bulk actions

## Images

**Hero Background**: Abstract gradient mesh or subtle compression-related illustration (NOT a large photo hero). Keep it minimal - this is a tool, not a marketing page.

**Feature Icons**: Use Heroicons for all UI icons (upload, download, settings, compare, etc.)

**No stock photography**: This is a utility app - avoid generic lifestyle images

## Page Structure

### Landing/App Hybrid Layout
1. **Header Bar** (h-16): Logo, theme toggle
2. **Hero Upload Zone** (min-h-[60vh]): Centered drag-drop with CTAs
3. **Features Strip** (py-12): 4-column grid showing key capabilities (icons + titles)
4. **Preview Area** (dynamic): Grid of processed images with before/after sliders
5. **SEO Footer** (py-16): FAQ accordion, keyword sections in 3 columns, trust indicators

### No Traditional Marketing Sections
This is an app interface, not a landing page. The upload zone IS the hero. Features are shown through the interface itself.

**Total viewport use**: App sections flow naturally - upload zone can use 60-80vh, preview area grows dynamically with content.

## Accessibility
- High contrast text (ensure readability against gradients)
- Clear focus states on all interactive elements
- Alt text for all icons
- Keyboard navigation for file management
- ARIA labels for drag-drop zones and sliders

## Dark Mode Adaptation
- Dark mode uses deep grays (not pure black)
- Gradient preserved but inverted (dark blue → deep purple)
- Cards with subtle borders in dark mode for definition
- Maintain high contrast for text and CTAs in both modes