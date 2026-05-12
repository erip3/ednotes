import { useEffect, useState } from 'react';

export const themeDecorator = (Story: any) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <div
        style={{
          padding: '12px 16px',
          marginBottom: '0',
          backgroundColor:
            theme === 'dark' ? 'hsl(140 0% 10%)' : 'hsl(0 0% 100%)',
          borderBottom: `1px solid ${theme === 'dark' ? 'hsl(140 0% 20%)' : 'hsl(214.3 31.8% 91.4%)'}`,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <label
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: theme === 'dark' ? 'hsl(140 0% 95%)' : 'hsl(222.2 84% 4.9%)',
          }}
        >
          <span>Theme:</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            style={{
              padding: '6px 8px',
              borderRadius: '4px',
              border: `1px solid ${theme === 'dark' ? 'hsl(140 0% 30%)' : 'hsl(214.3 31.8% 91.4%)'}`,
              backgroundColor:
                theme === 'dark' ? 'hsl(140 0% 15%)' : 'hsl(0 0% 100%)',
              color:
                theme === 'dark' ? 'hsl(140 0% 95%)' : 'hsl(222.2 84% 4.9%)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div style={{ paddingTop: '60px' }}>
        <Story />
      </div>
    </>
  );
};
