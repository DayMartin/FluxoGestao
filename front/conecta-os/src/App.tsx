import { BrowserRouter } from "react-router-dom"
import './App.css';
import AppRoutes from "./routes";
import { ThemeProvider } from "@emotion/react";
import LightTheme from "./shared/themes/Light";

function App() {
  return (
    <ThemeProvider theme={LightTheme}>
    <BrowserRouter>
    <div className="App">
      <AppRoutes/>
    </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
