import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorageState } from '../hooks/useLocaleStorage';

const DarkModeContext = createContext();

export default function DarkModeContextProvider({ children }) {
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [selectedTheme, setSelectedTheme] = useLocalStorageState('theme', 'system');
  const derivedTheme = selectedTheme === 'system' || !selectedTheme ? systemTheme : selectedTheme;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.matches ? setSystemTheme('dark') : setSystemTheme('light');

    const handleSystemThemeChange = e => {
      e.matches ? setSystemTheme('dark') : setSystemTheme('light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    derivedTheme === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [systemTheme, selectedTheme, setSelectedTheme, derivedTheme]);

  return (
    <DarkModeContext.Provider
      value={{
        selectedTheme,
        derivedTheme,
        setSelectedTheme,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkModeContext() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      'DarkModeContext was used outside of its provider, wrap your component with the DarkModeContextProvider to use the context',
    );
  }
  return context;
}

DarkModeContextProvider.propTypes = {
  children: PropTypes.node,
};
