import { Container, CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import Header from "./Header";
import Catalog from "../../features/catalog/Catalog";
import { useState } from "react";

function App() {

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    },
    
  })

  function themeChangeEventHandler() {
    setDarkMode(!darkMode);
  }


  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Header darkMode={darkMode} themeChangeEventHandler={themeChangeEventHandler}/>
      <Container>
        <Catalog />
      </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
