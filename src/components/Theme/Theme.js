import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import theme from "../../constants/theme";

const Theme = ({ children }) => {
  const customTheme = createMuiTheme(theme);
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
