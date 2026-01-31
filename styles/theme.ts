import { createTheme } from "@mui/material";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    rounded: true;
    pills: true;
    bluepill: true;
  }
  interface ButtonPropsColorOverrides {
    white: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      paper: string;
      border: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      main?: string;
      paper?: string;
      border?: string;
    };
  }
}

export const toolbarHeight = 70;
export const drawerWidth = 64;

const tempTheme = createTheme();

// Shared component styles
const getComponentStyles = (isDark: boolean) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        lineHeight: 1,
      },
    },
    variants: [
      {
        props: { variant: "contained" as const },
        style: {
          padding: "12px 24px",
        },
      },
      {
        props: { variant: "rounded" as const },
        style: {
          border: "1px solid",
          color: "#fff",
          padding: "12px 30px",
          background: "#1034A6",
          fontWeight: 400,
          borderRadius: "50px",
          textTransform: "none" as const,
          cursor: "pointer",
          "&:hover": {
            color: "#1034A6",
            background: isDark ? "#1a1a2e" : "#fff",
          },
          "&.Mui-disabled": {
            background: "#1034A688",
            color: "#fff",
            pointerEvents: "auto" as const,
            cursor: "not-allowed",
          },
          "&.MuiButton-roundedSuccess": {
            background: "#2e7d32",
            "&:hover": {
              color: "#2e7d32",
              background: isDark ? "#1a1a2e" : "#fff",
            },
          },
          "&.MuiButton-roundedError": {
            background: "#d32f2f",
            "&:hover": {
              color: "#d32f2f",
              background: isDark ? "#1a1a2e" : "#fff",
            },
          },
          "&.MuiButton-roundedSecondary": {
            background: isDark ? "#2a2a4a" : "#12131C",
            "&:hover": {
              color: isDark ? "#fff" : "#12131C",
              background: isDark ? "#1a1a2e" : "#fff",
            },
          },
          "&.MuiButton-roundedWhite": {
            background: isDark ? "#2a2a4a" : "#fff",
            color: isDark ? "#fff" : "#12131C",
            "&:hover": {
              color: isDark ? "#12131C" : "#fff",
              background: isDark ? "#fff" : "#12131C",
            },
          },
        },
      },
      {
        props: { variant: "pills" as const },
        style: {
          border: "1px solid",
          padding: "10px 30px",
          color: "#1034A6",
          fontWeight: 600,
          borderRadius: "15px",
          fontSize: "16px",
          "&:hover": {
            color: "#fff",
            background: "#1034A6",
          },
        },
      },
      {
        props: { variant: "bluepill" as const },
        style: {
          border: "1px solid",
          padding: "10px 30px",
          color: "#fff",
          background: "#1034A6",
          fontWeight: 600,
          borderRadius: "15px",
          fontSize: "16px",
          "&:hover": {
            color: "#1034A6",
            background: isDark ? "#1a1a2e" : "#fff",
          },
          "&.Mui-disabled": {
            background: "#1034A699",
            color: "#fff",
          },
        },
      },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          cursor: "not-allowed",
          pointerEvents: "auto" as const,
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: "20px !important",
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      MenuProps: {
        PaperProps: {
          sx: {
            maxHeight: "270px",
          },
        },
      },
    },
    styleOverrides: {
      outlined: {
        color: "#1034A6",
        padding: "10px 15px",
        borderRadius: "20px",
        [tempTheme.breakpoints.down("md")]: {
          minWidth: "75px",
        },
        border: "1px solid ",
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: `${toolbarHeight}px !important`,
        alignItems: "center",
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: "30px",
        fontWeight: 600,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          background: isDark ? "#1a1a2e" : "#F8F8F8",
        },
        borderRadius: "20px",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        "& .MuiChip-label": {
          paddingLeft: "4px",
          paddingRight: "8px",
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: isDark ? '#1a1a2e' : '#fff',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: isDark ? '#2a2a4a' : '#F5F8FF',
        },
      },
    },
  },
});

// Light Theme
export const lightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
    },
  },
  palette: {
    mode: 'light',
    common: {
      black: "#12131C",
      white: "#fff",
    },
    primary: {
      main: "#12131C",
      dark: "#000000",
      light: "#383943",
      contrastText: "#fff",
    },
    secondary: {
      main: "#1034A6",
      dark: "#001076",
      light: "#585ed8",
    },
    text: {
      primary: "#12131C",
      secondary: "#1034A6",
    },
    background: {
      default: "#F5F8FF",
      paper: "#FFFFFF",
    },
    surface: {
      main: "#F5F8FF",
      paper: "#FFFFFF",
      border: "#E7EAFD",
    },
  },
  typography: {
    allVariants: {
      fontFamily: "Poppins",
    },
  },
  components: getComponentStyles(false),
});

// Dark Theme
export const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
    },
  },
  palette: {
    mode: 'dark',
    common: {
      black: "#12131C",
      white: "#fff",
    },
    primary: {
      main: "#FFFFFF",
      dark: "#E0E0E0",
      light: "#FFFFFF",
      contrastText: "#12131C",
    },
    secondary: {
      main: "#6C7BFF",
      dark: "#4A5AE8",
      light: "#8E9AFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B8FF",
    },
    background: {
      default: "#0d0d1a",
      paper: "#1a1a2e",
    },
    surface: {
      main: "#0d0d1a",
      paper: "#1a1a2e",
      border: "#2a2a4a",
    },
  },
  typography: {
    allVariants: {
      fontFamily: "Poppins",
    },
  },
  components: getComponentStyles(true),
});

// Export the light theme as default for backwards compatibility
export const theme = lightTheme;
