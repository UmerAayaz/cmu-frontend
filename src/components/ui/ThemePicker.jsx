import { PROJECT_THEMES } from '../../utils/themes';

export default function ThemePicker({ value, onChange }) {
  return (
    <div className="theme-picker__grid">
      {PROJECT_THEMES.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`theme-swatch ${value === t.key ? 'theme-swatch--active' : ''}`}
          title={t.label}
        >
          <span className="theme-swatch__dot" style={{ background: t.primary }} />
          <span className="theme-swatch__label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}