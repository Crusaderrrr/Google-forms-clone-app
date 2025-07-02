import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";
import default_profile_image from "../assets/default_profile_image.jpg";
import axios from "axios";

export const AppContext = createContext();
const SERVER_URL = import.meta.env.VITE_API_URL;

function getStored(key, defaultValue) {
  const stored = localStorage.getItem(key);
  return stored !== null ? stored : defaultValue;
}

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => getStored("role", "guest"));
  const [profileImg, setProfileImg] = useState(() =>
    getStored("profileImg", default_profile_image)
  );
  const [theme, setTheme] = useState(() => getStored("theme", "light"));
  const [language, setLanguage] = useState(() => getStored("language", "en"));

  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    localStorage.setItem("role", role);
    localStorage.setItem("profileImg", profileImg);
  }, [role, profileImg]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    setLoadingContext(true);
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/auth/me`, {
          withCredentials: true,
        });
        const user = response.data.user;
        setRole(user.role);
        setIsAdmin(user.isAdmin);
        setIsBlocked(user.isBlocked);
        setName(user.name);
        setEmail(user.email);
        setUserId(user.id);
      } catch (err) {
        setRole("guest");
        setIsAdmin(false);
        setIsBlocked(false);
        setName("");
        setEmail("");
        setUserId("");
        console.error(err);
      } finally {
        setLoadingContext(false);
      }
    };
    fetchUser();
  }, [
    setRole,
    setIsAdmin,
    setIsBlocked,
    setName,
    setEmail,
    setUserId
  ]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isBlocked,
        setIsBlocked,
        loadingContext,
        isAdmin,
        setIsAdmin,
        theme,
        setTheme,
        language,
        setLanguage,
        email,
        setEmail,
        name,
        setName,
        userId,
        setUserId,
        profileImg,
        setProfileImg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}