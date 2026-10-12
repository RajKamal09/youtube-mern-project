import { BrowserRouter, Routes, Route } from "react-router-dom";



import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import WatchVideo from "./components/watchVideo";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
         <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/watch/:videoId" element={<WatchVideo />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;