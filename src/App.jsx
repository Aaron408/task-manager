import { BrowserRouter } from "react-router-dom";
import Navigation from "./Routes/Routes";
import { AuthProvider } from "./Components/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
