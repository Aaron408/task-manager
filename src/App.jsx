import { BrowserRouter } from "react-router-dom";
import Navigation from "./Routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
