'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import { styles as s } from './ThemeControl.styles';
export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const selected = mounted ? (theme ?? 'system') : 'system';
  const Icon = selected === 'light' ? SunIcon : selected === 'dark' ? MoonIcon : DesktopIcon;
  return (
    <label className={s.control}>
      <Icon size={16} className={s.icon} />
      <select
        aria-label="Color theme"
        className={s.select}
        value={selected}
        onChange={(event) => setTheme(event.target.value)}
        disabled={!mounted}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
