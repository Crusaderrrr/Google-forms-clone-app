import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage'
import LayoutWithNavbar from './components/LayoutWithNavbar';


function App() {

  return (
  <AppProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage/>}/>
      <Route element={<LayoutWithNavbar />}>
        <Route path='/main' element={<MainPage/>}/>
      </Route>
    </Routes>
  </AppProvider>
  )
}

export default App
