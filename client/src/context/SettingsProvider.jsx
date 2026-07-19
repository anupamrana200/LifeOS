import { useCallback, useMemo, useState } from 'react';
import { useTheme } from '@/hooks';
import SettingsContext from './SettingsContext';

const key = 'lifeos-settings';
const defaults = { ai: { maxTokens: 2048, model: 'gpt-5-mini', provider: 'openai', streaming: true, temperature: 0.7 }, appearance: { animations: true, density: 'comfortable', themePreference: 'system' }, chat: { autoScroll: true, codeWrap: true, enterToSend: true, sidebarDefault: 'expanded', timestamps: true }, general: { dateFormat: 'MMM D, YYYY', language: 'English', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }, notifications: { desktop: false, email: true, marketing: false, sound: true }, profile: { bio: '', company: '', location: '', username: '', website: '' } };
const read = () => { try { return { ...defaults, ...JSON.parse(window.localStorage.getItem(key) || '{}') }; } catch { return defaults; } };

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(read);
  const { setTheme } = useTheme();
  const updateSection = useCallback((section, patch) => setSettings((current) => { const next = { ...current, [section]: { ...current[section], ...patch } }; window.localStorage.setItem(key, JSON.stringify(next)); return next; }), []);
  const setAppearance = useCallback((patch) => { updateSection('appearance', patch); if (patch.themePreference) setTheme(patch.themePreference === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : patch.themePreference); }, [setTheme, updateSection]);
  const value = useMemo(() => ({ setAppearance, settings, updateSection }), [setAppearance, settings, updateSection]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
