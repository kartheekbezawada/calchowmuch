/**
 * CalcHowMuch Design System
 * Design Tokens - CSS Custom Properties
 * Version 1.0.0
 */

:root {
  /* ===== COLORS ===== */
  
  /* Primary Brand Colors */
  --color-blue-400: #60a5fa;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-cyan-400: #22d3ee;
  --color-cyan-500: #06b6d4;
  --color-cyan-600: #0891b2;
  
  /* Semantic Colors */
  --color-green-400: #4ade80;
  --color-green-500: #10b981;
  --color-emerald-500: #059669;
  --color-orange-400: #fb923c;
  --color-orange-500: #f97316;
  --color-red-500: #dc2626;
  --color-violet-400: #a78bfa;
  --color-violet-500: #8b5cf6;
  --color-indigo-500: #6366f1;
  --color-yellow-400: #facc15;
  
  /* Slate Palette (Backgrounds & Text) */
  --color-slate-50: #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-slate-500: #64748b;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1e293b;
  --color-slate-900: #0f172a;
  --color-slate-950: #020617;
  
  /* Blue Palette (Dark backgrounds) */
  --color-blue-900: #1e3a8a;
  --color-blue-950: #172554;
  
  /* White/Black */
  --color-white: #ffffff;
  --color-black: #000000;
  
  /* ===== GRADIENTS ===== */
  
  /* Background Gradients */
  --gradient-bg-main: linear-gradient(to bottom right, var(--color-slate-900), var(--color-blue-950), var(--color-slate-900));
  --gradient-bg-card: linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
  
  /* Brand Gradients */
  --gradient-brand-primary: linear-gradient(to right, var(--color-blue-600), var(--color-cyan-600));
  --gradient-brand-text: linear-gradient(to right, var(--color-blue-400), var(--color-cyan-400), var(--color-blue-400));
  
  /* Input Gradients */
  --gradient-input-blue: linear-gradient(to bottom right, var(--color-blue-500), var(--color-cyan-500));
  --gradient-input-green: linear-gradient(to bottom right, var(--color-green-500), var(--color-emerald-500));
  --gradient-input-orange: linear-gradient(to bottom right, var(--color-orange-500), var(--color-red-500));
  --gradient-input-violet: linear-gradient(to bottom right, var(--color-violet-500), var(--color-indigo-500));
  
  /* Result Gradient */
  --gradient-result-card: linear-gradient(to bottom right, var(--color-blue-600), var(--color-cyan-600));
  
  /* Badge Gradients */
  --gradient-badge-yellow: linear-gradient(to right, rgba(251, 146, 60, 0.2), rgba(234, 179, 8, 0.2));
  --gradient-badge-blue: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
  
  /* ===== SHADOWS ===== */
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Glow Shadows */
  --shadow-glow-blue: 0 10px 15px -3px rgba(37, 99, 235, 0.5), 0 4px 6px -4px rgba(37, 99, 235, 0.5);
  --shadow-glow-cyan: 0 10px 15px -3px rgba(6, 182, 212, 0.5), 0 4px 6px -4px rgba(6, 182, 212, 0.5);
  
  /* ===== TYPOGRAPHY ===== */
  
  /* Font Family */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-black: 900;
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* ===== SPACING ===== */
  
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  
  /* ===== BORDER RADIUS ===== */
  
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;
  
  /* ===== TRANSITIONS ===== */
  
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* ===== Z-INDEX ===== */
  
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal: 40;
  --z-popover: 50;
  --z-tooltip: 60;
  
  /* ===== LAYOUT ===== */
  
  --container-max-width: 1800px;
  --header-height: 72px;
  --category-nav-height: 60px;
  --footer-height: 48px;
  --gap-between-panes: 10px;
  
  /* Grid Column Widths (12-column grid) */
  --col-nav: 16.667%;      /* 2/12 */
  --col-calc: 25%;         /* 3/12 */
  --col-explain: 41.667%;  /* 5/12 */
  --col-ads: 16.667%;      /* 2/12 */
  
  /* ===== BORDERS ===== */
  
  --border-width-thin: 1px;
  --border-width-base: 2px;
  --border-width-thick: 4px;
  
  /* Border Colors */
  --border-slate-700-50: rgba(51, 65, 85, 0.5);
  --border-slate-700-30: rgba(51, 65, 85, 0.3);
  --border-blue-500-30: rgba(59, 130, 246, 0.3);
  --border-yellow-500-30: rgba(234, 179, 8, 0.3);
  
  /* ===== OPACITY ===== */
  
  --opacity-0: 0;
  --opacity-10: 0.1;
  --opacity-20: 0.2;
  --opacity-30: 0.3;
  --opacity-50: 0.5;
  --opacity-80: 0.8;
  --opacity-100: 1;
  
  /* ===== BACKDROP BLUR ===== */
  
  --blur-none: 0;
  --blur-sm: 4px;
  --blur-base: 8px;
  --blur-md: 12px;
  --blur-lg: 16px;
  --blur-xl: 24px;
  
  /* ===== COMPONENT SPECIFIC ===== */
  
  /* Slider */
  --slider-height: 8px;
  --slider-thumb-size: 20px;
  --slider-track-color: var(--color-slate-800);
  
  /* Input */
  --input-padding-x: var(--space-4);
  --input-padding-y: var(--space-3);
  --input-border-radius: var(--radius-xl);
  
  /* Button */
  --button-padding-x: var(--space-6);
  --button-padding-y: var(--space-4);
  --button-border-radius: var(--radius-xl);
  
  /* Card */
  --card-padding: var(--space-6);
  --card-border-radius: var(--radius-3xl);
  
  /* Table */
  --table-cell-padding-x: var(--space-4);
  --table-cell-padding-y: var(--space-3);
}