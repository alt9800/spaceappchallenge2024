import "./App.css";
import { AppRoutes } from "./router/AppRoutes";
import { SnackbarProvider } from "./components/CustomSnackbar";

function App() {
  return (
    <div className="App">
      <SnackbarProvider>
        
        <AppRoutes />
      </SnackbarProvider>
    </div>
  );
}

export default App;
