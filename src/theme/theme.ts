"use client";

import { createTheme } from "@mui/material/styles";

// Christmas Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5f52", // Christmas Red
      light: "#ff5f52",
      dark: "#8e0000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff5f52", // Christmas Green
      light: "#60ad5e",
      dark: "#005005",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ffd700", // Gold
    },
    background: {
      // background:" #22C1C3",
      // background: "linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)",
      default: "#57C785", // Green
      // paper: "rgba(255, 255, 255, 0.95)",
    },

    text: {
      primary: "#1a1a1a",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: '"Prompt", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    // MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       background: "linear-gradient(135deg, #57C785 0%, #F25350 100%)",
    //     },
    //   },
    // },
  },
});

export default theme;
