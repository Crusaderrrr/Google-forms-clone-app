import { Route, Routes, useParams } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import MyProfilePage from "./pages/MyProfilePage";
import TemplatePage from "./pages/TemplatePage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          element={
            <ProtectedRoute>
              <LayoutWithNavbar />
            </ProtectedRoute>
          }
        >
          <Route path="/main" element={<MainPage />} />
          <Route path="/myProfile" element={<MyProfilePage />} />
          <Route path="/template/create" element={<TemplatePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/template/:id"
            element={
              <TemplatePage
                key={
                  (useParams().id || "") +
                  "-" +
                  (window.location.state?.mode || "")
                }
              />
            }
          />
          <Route path="/form/:id" element={<TemplatePage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
