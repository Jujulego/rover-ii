import { createMuiTheme } from '@material-ui/core';
import { deepOrange, indigo } from '@material-ui/core/colors';
import { frFR } from '@material-ui/core/locale';

// Themes
function createTheme(dark: boolean = false) {
  return createMuiTheme({
    palette: {
      primary: indigo,
      secondary: deepOrange,
      type: dark ? 'dark' : 'light',
    },
    props: {
      MuiCardHeader: {
        titleTypographyProps: { variant: "h6" }
      },
      MuiDialog: {
        maxWidth: "xs",
        fullWidth: true
      }
    }
  }, frFR);
}

export default createTheme;
