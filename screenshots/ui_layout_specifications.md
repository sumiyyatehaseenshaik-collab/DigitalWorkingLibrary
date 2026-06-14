# UI/UX Visual Presentation Spec - Antigravity Digital Library

The **Antigravity Digital Library** frontend showcases a state-of-the-art, high-end "Luxury Modern Library" aesthetic. Below is the visual blueprint of the system's interface components:

## 1. Authentication Core (Login & Register)
- **Background**: Complete `bg-coffee-950` deep-black shade, adorned with absolute radial blur elements mimicking elegant, golden backlights:
  - Top Left: `bg-biscuit/5 blur-[120px]`
  - Bottom Right: `bg-brown/5 blur-[120px]`
- **Container**: Card panel in rich `#181411` coffee wood shade with high-definition border lines (`border-coffee-850`) and a smooth, elegant fade-in effect (`animate-fade-in`).
- **Typography**: Prominent Playfair Display serif headers in `#fdfbf7` (Cream) uppercase with high tracking, supported by monospaced subheadings in gold `#c6a67a` (Biscuit).
- **Controls**: Clean inputs highlighted by deep shadows (`shadow-inner`) and changing to `#c6a67a` borders on focus. Fully rounded `rounded-xl` primary action buttons.

## 2. Dashboard Interface
- **Greeting Banner**: Features a grand luxury architectural grid display. Welcome title in serif next to an illuminated vector status shield (`SYS CORE active`).
- **Metric Cards**: Dynamic, floating glassmorphic panels showing system stats (Catalog Books, Leases, Historic borrows, and Registered Members) with smooth hover scaling (`hover:scale-[1.01] hover:border-[#c6a67a]`) and rich icons enclosed in elegant recessed frames.
- **AI Core Panel**: Interactive vector-inspired dashboard showcasing high-dimensional conceptual query descriptions and quick-search triggers.
- **Status Drawer**: Active system checks mapping connected PostgreSQL databases, MongoDB nodes, and API gates.

## 3. Library Catalogue (All Books Page)
- **Badge Filters**: Dynamic HSL-tailored sliding categories. Active badges are highlighted in warm gold `#c6a67a` with matching shadows, while inactive badges hover elegantly.
- **Grid Layout**: A responsive 4-column layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`) presenting catalog card structures.
- **Card Designs**: Fully custom frame boxes featuring high-resolution Unsplash book covers, fallback handling, tag overlays, metadata drawers, and role-based action links.

## 4. Volume Specifications (Book Details Page)
- **Visual Grid**: Split layout presenting a premium, large-scale cover illustration on the left, flanked by detailed specs, review scores, synopses, and copies tables on the right.
- **AI Recommendation Engine**: Under the specs, a grid of related books based on category matches is displayed with interactive link lists.

## 5. Personal shelf timeline (Profile Page)
- **Details Section**: Illuminated member details card featuring joined dates, hash credentials, and interactive statistics.
- **Timeline Engine**: High-fidelity global history tracker. Each action (borrows, returns, searches) is loaded directly from MongoDB, sorting chronologically with dedicated colors and custom timeline icons.
