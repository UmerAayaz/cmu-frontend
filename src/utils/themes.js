export const PROJECT_THEMES = [
  // ── Original 8 ─────────────────────────────────────────────
  { key: 'blue',      label: 'Blue',      primary: '#1E40AF', light: '#EFF6FF', dark: '#1E3A8A' },
  { key: 'red',       label: 'Red',       primary: '#DC2626', light: '#FEE2E2', dark: '#991B1B' },
  { key: 'purple',    label: 'Purple',    primary: '#7C3AED', light: '#EDE9FE', dark: '#5B21B6' },
  { key: 'teal',      label: 'Teal',      primary: '#0F766E', light: '#CCFBF1', dark: '#115E59' },
  { key: 'amber',     label: 'Amber',     primary: '#D97706', light: '#FEF3C7', dark: '#92400E' },
  { key: 'emerald',   label: 'Emerald',   primary: '#059669', light: '#D1FAE5', dark: '#065F46' },
  { key: 'rose',      label: 'Rose',      primary: '#E11D48', light: '#FFE4E6', dark: '#9F1239' },
  { key: 'slate',     label: 'Slate',     primary: '#475569', light: '#F1F5F9', dark: '#1E293B' },

  // ── 50 additional themes ───────────────────────────────────
  { key: 'sky',       label: 'Sky',       primary: '#0284C7', light: '#E0F2FE', dark: '#075985' },
  { key: 'cyan',      label: 'Cyan',      primary: '#0891B2', light: '#CFFAFE', dark: '#155E75' },
  { key: 'indigo',    label: 'Indigo',    primary: '#4F46E5', light: '#E0E7FF', dark: '#3730A3' },
  { key: 'violet',    label: 'Violet',    primary: '#8B5CF6', light: '#F5F3FF', dark: '#5B21B6' },
  { key: 'fuchsia',   label: 'Fuchsia',   primary: '#C026D3', light: '#FAE8FF', dark: '#86198F' },
  { key: 'pink',      label: 'Pink',      primary: '#DB2777', light: '#FCE7F3', dark: '#9D174D' },
  { key: 'orange',    label: 'Orange',    primary: '#EA580C', light: '#FFEDD5', dark: '#9A3412' },
  { key: 'yellow',    label: 'Yellow',    primary: '#CA8A04', light: '#FEF9C3', dark: '#854D0E' },
  { key: 'lime',      label: 'Lime',      primary: '#65A30D', light: '#ECFCCB', dark: '#3F6212' },
  { key: 'green',     label: 'Green',     primary: '#16A34A', light: '#DCFCE7', dark: '#166534' },
  { key: 'stone',     label: 'Stone',     primary: '#57534E', light: '#F5F5F4', dark: '#292524' },
  { key: 'zinc',      label: 'Zinc',      primary: '#52525B', light: '#F4F4F5', dark: '#27272A' },
  { key: 'gray',      label: 'Gray',      primary: '#4B5563', light: '#F3F4F6', dark: '#1F2937' },
  { key: 'neutral',   label: 'Neutral',   primary: '#525252', light: '#F5F5F5', dark: '#262626' },
  { key: 'navy',      label: 'Navy',      primary: '#1E3A8A', light: '#DBEAFE', dark: '#172554' },
  { key: 'maroon',    label: 'Maroon',    primary: '#7F1D1D', light: '#FEF2F2', dark: '#450A0A' },
  { key: 'olive',     label: 'Olive',     primary: '#4D7C0F', light: '#F7FEE7', dark: '#365314' },
  { key: 'coral',     label: 'Coral',     primary: '#F97362', light: '#FFF1F0', dark: '#B83B2C' },
  { key: 'mint',      label: 'Mint',      primary: '#34D399', light: '#ECFDF5', dark: '#047857' },
  { key: 'lavender',  label: 'Lavender',  primary: '#A78BFA', light: '#F3EEFF', dark: '#6D28D9' },
  { key: 'plum',      label: 'Plum',      primary: '#9333EA', light: '#F3E8FF', dark: '#581C87' },
  { key: 'magenta',   label: 'Magenta',   primary: '#D946EF', light: '#FDF4FF', dark: '#A21CAF' },
  { key: 'crimson',   label: 'Crimson',   primary: '#BE123C', light: '#FFF1F2', dark: '#881337' },
  { key: 'gold',      label: 'Gold',      primary: '#A16207', light: '#FEFCE8', dark: '#713F12' },
  { key: 'bronze',    label: 'Bronze',    primary: '#B45309', light: '#FFFBEB', dark: '#78350F' },
  { key: 'copper',    label: 'Copper',    primary: '#C2410C', light: '#FFF7ED', dark: '#7C2D12' },
  { key: 'turquoise', label: 'Turquoise', primary: '#06B6D4', light: '#ECFEFF', dark: '#0E7490' },
  { key: 'aqua',      label: 'Aqua',      primary: '#2DD4BF', light: '#F0FDFA', dark: '#115E59' },
  { key: 'azure',     label: 'Azure',     primary: '#0369A1', light: '#F0F9FF', dark: '#0C4A6E' },
  { key: 'cerulean',  label: 'Cerulean',  primary: '#2563EB', light: '#DBEAFE', dark: '#1D4ED8' },
  { key: 'denim',     label: 'Denim',     primary: '#4263EB', light: '#EDF2FF', dark: '#2F3FA0' },
  { key: 'forest',    label: 'Forest',    primary: '#15803D', light: '#DCFCE7', dark: '#14532D' },
  { key: 'moss',      label: 'Moss',      primary: '#6B8E23', light: '#F4FAE4', dark: '#47591A' },
  { key: 'sage',      label: 'Sage',      primary: '#6E8B74', light: '#EFF6F1', dark: '#455A4A' },
  { key: 'jade',      label: 'Jade',      primary: '#12A594', light: '#E6F7F4', dark: '#0A6B60' },
  { key: 'ruby',      label: 'Ruby',      primary: '#C81E3F', light: '#FFE4E6', dark: '#8C1129' },
  { key: 'cherry',    label: 'Cherry',    primary: '#D2042D', light: '#FFEBEE', dark: '#8E0220' },
  { key: 'salmon',    label: 'Salmon',    primary: '#FA8072', light: '#FFF0EE', dark: '#C0503F' },
  { key: 'peach',     label: 'Peach',     primary: '#FB923C', light: '#FFF7ED', dark: '#B45309' },
  { key: 'apricot',   label: 'Apricot',   primary: '#FBBF24', light: '#FFFBEB', dark: '#B45309' },
  { key: 'tangerine', label: 'Tangerine', primary: '#F97316', light: '#FFF7ED', dark: '#C2410C' },
  { key: 'mustard',   label: 'Mustard',   primary: '#D4A017', light: '#FEF9E7', dark: '#9A7B0A' },
  { key: 'sand',      label: 'Sand',      primary: '#C2A878', light: '#FAF7F0', dark: '#8C7550' },
  { key: 'taupe',     label: 'Taupe',     primary: '#8B7D6B', light: '#F7F5F2', dark: '#5C5245' },
  { key: 'charcoal',  label: 'Charcoal',  primary: '#374151', light: '#F3F4F6', dark: '#111827' },
  { key: 'steel',     label: 'Steel',     primary: '#64748B', light: '#F1F5F9', dark: '#334155' },
  { key: 'graphite',  label: 'Graphite',  primary: '#3F3F46', light: '#F4F4F5', dark: '#18181B' },
  { key: 'midnight',  label: 'Midnight',  primary: '#1E1B4B', light: '#EEF2FF', dark: '#0F0D2E' },
  { key: 'ocean',     label: 'Ocean',     primary: '#0C4A6E', light: '#E0F2FE', dark: '#082F49' },
  { key: 'sunset',    label: 'Sunset',    primary: '#FF7A45', light: '#FFF3EC', dark: '#C2410C' },
];

export const DEFAULT_THEME = 'blue';

export const getTheme = (key) =>
  PROJECT_THEMES.find((t) => t.key === key) ?? PROJECT_THEMES[0];

// Optional helpers
export const getThemeKeys = () => PROJECT_THEMES.map((t) => t.key);
export const getThemeLabels = () => PROJECT_THEMES.map((t) => t.label);