import { createTheme } from '@mui/material'
import { deepmerge } from '@mui/utils'

// Create a base theme, which will be used to create the other themes.
// These values are used in both light and dark mode.
export const themeBase = {
  palette: {
    connected: {
      main: '#6dcd00',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderTitle: {
          fontWeight: 600,
          fontSize: 'large',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        bar: {
          transition: 'transform 0.05s linear',
        },
      },
    },
  },
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 400,
  },
}

// Create the light theme.
export const themeLight = createTheme(
  deepmerge(themeBase, {
    palette: {
      primary: {
        main: '#137C83',
        overlay: '#0f6267',
      },
      contrastbackground: {
        main: '#137C83',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, .2)',
            backdropFilter: 'blur(5px)',
            boxShadow:
              '0px 7px 8px -4px rgb(0 0 0 / 10%), 0px 12px 17px 2px rgb(0 0 0 / 8%), 0px 5px 22px 4px rgb(0 0 0 / 6%)',
          },
        },
      },
    },
    apexcharts: {
      shade: 'light',
    },
    modelVisual: {
      borderColor: '#c4c4c4',
      fontColor: '#212121',
      backgroundColor: '#ffffff',
    },
    home: {
      mascot: '/molele.svg',
    },
    darkMode: false,
  })
)

// Create the dark theme.
export const themeDark = createTheme(
  deepmerge(themeBase, {
    palette: {
      primary: {
        main: '#dc3984',
        overlay: '#7E2E54',
      },
      mode: 'dark',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#7E2E54',
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(30, 30, 30, .5)',
            backdropFilter: 'blur(5px)',
          },
        },
      },
    },
    apexcharts: {
      shade: 'dark',
    },
    modelVisual: {
      borderColor: '#707070',
      fontColor: 'white',
      backgroundColor: '#2b2b2b',
    },
    home: {
      mascot: '/molele-dark.svg',
    },
    darkMode: true,
  })
)
