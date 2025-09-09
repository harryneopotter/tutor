import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      surface0: string;
      surface1: string;
      ink900: string;
      ink600: string;
      ink400: string;
      brand: string;
      brandHover: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
    radius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadow: {
      card: string;
    };
    spacing: (n: number) => string;
    font: {
      body: string;
      mono: string;
    };
  }
}

