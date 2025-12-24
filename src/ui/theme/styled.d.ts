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
      glass0: string;
      glass1: string;
      glassHighlight: string;
      glassBorder: string;
      border: string;
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
      premium: string;
      skeuo: string;
      skeuoRaised: string;
      skeuoPressed: string;
      liquidGlass: string;
    };
    blur: {
      thin: string;
      regular: string;
      thick: string;
    };
    spacing: (n: number) => string;
    font: {
      body: string;
      heading: string;
      mono: string;
    };
    transition: {
      default: string;
      spring: string;
      speed: string;
    };
  }
}

