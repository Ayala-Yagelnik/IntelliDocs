import { createTheme } from "@mui/material/styles"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#10a37f",
      light: "#4dd4b2",
      dark: "#0e8c6b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6c757d",
      light: "#9aa0a6",
      dark: "#495057",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212529",
      secondary: "#6c757d",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.75rem",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2.25rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
})

export default theme
