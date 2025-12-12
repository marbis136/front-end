import PropTypes from 'prop-types';
import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// ======================================================
// 🔹 CONFIGURACIÓN POR DEFECTO
// ======================================================
const defaultConfig = {
  // 🎨 Theming
  mode: 'light', // 'light' | 'dark' | 'system'
  fontFamily: "'Inter', system-ui, sans-serif",
  borderRadius: 8,
  presetColor: '#7367F0', // color primario por defecto (violeta)

  // 🧱 Layouts
  layout: 'vertical', // 'vertical' | 'collapsed' | 'horizontal'
  contentWidth: 'compact', // 'compact' | 'wide'
  skin: 'default', // 'default' | 'bordered'
  semiDark: false, // modo semi oscuro

  // 🎨 Colores individuales (opcional)
  primaryColor: '#1976d2',
  secondaryColor: '#9c27b0'
};

// ======================================================
// 🔹 CREACIÓN DEL CONTEXTO
// ======================================================
export const ConfigContext = createContext({
  ...defaultConfig,
  // Métodos de actualización
  onToggleMode: () => {},
  onSetMode: () => {},
  onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onChangePresetColor: () => {},
  onChangeLayout: () => {},
  onChangeContentWidth: () => {},
  onChangeSkin: () => {},
  onChangeSemiDark: () => {},
  onSetPrimary: () => {},
  onSetSecondary: () => {},
  onReset: () => {}
});

// ======================================================
// 🔹 PROVEEDOR DE CONTEXTO
// ======================================================
export function ConfigProvider({ children }) {
  const [cfg, setCfg] = useLocalStorage('mana-theme', defaultConfig);

  // =========================
  // 🎨 Theming
  // =========================
  const onToggleMode = () =>
    setCfg({ ...cfg, mode: cfg.mode === 'dark' ? 'light' : 'dark' });

  const onSetMode = (mode) => setCfg({ ...cfg, mode });
  const onChangeFontFamily = (fontFamily) => setCfg({ ...cfg, fontFamily });
  const onChangeBorderRadius = (_, v) => setCfg({ ...cfg, borderRadius: v });
  const onChangePresetColor = (presetColor) => setCfg({ ...cfg, presetColor });

  // =========================
  // 🧱 Layout & Content
  // =========================
  const onChangeLayout = (layout) => setCfg({ ...cfg, layout });
  const onChangeContentWidth = (contentWidth) => setCfg({ ...cfg, contentWidth });
  const onChangeSkin = (skin) => setCfg({ ...cfg, skin });
  const onChangeSemiDark = (semiDark) => setCfg({ ...cfg, semiDark });

  // =========================
  // 🎨 Colores directos
  // =========================
  const onSetPrimary = (hex) => setCfg({ ...cfg, primaryColor: hex });
  const onSetSecondary = (hex) => setCfg({ ...cfg, secondaryColor: hex });

  // =========================
  // ♻️ Reset
  // =========================
  const onReset = () => setCfg(defaultConfig);

  // =========================
  // 💾 PROVIDER
  // =========================
  return (
    <ConfigContext.Provider
      value={{
        ...cfg,
        onToggleMode,
        onSetMode,
        onChangeFontFamily,
        onChangeBorderRadius,
        onChangePresetColor,
        onChangeLayout,
        onChangeContentWidth,
        onChangeSkin,
        onChangeSemiDark,
        onSetPrimary,
        onSetSecondary,
        onReset
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = { children: PropTypes.node };
