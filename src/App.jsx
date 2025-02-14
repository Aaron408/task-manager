import { BrowserRouter } from "react-router-dom";
import Navigation from "./Routes/Routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
