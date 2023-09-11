import { createTheme } from "@mui/material";
import { cyan, blue } from "@mui/material/colors";

export const DarkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: blue[700],
        dark: blue[800],
        light: blue[500],
        contrastText: '#ffffff'
      },
      secondary: {
        main: cyan[500],
        dark: cyan[400],
        light: cyan[300],
        contrastText: '#ffffff',
      },
      background: {
        default: '#303134',
        paper: '#202124',
      },
    },
    typography: {
        allVariants: {
          color: 'white',
        }
    }
  });