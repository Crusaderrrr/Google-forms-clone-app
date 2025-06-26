import { createContext, useContext, useState, useEffect } from "react";
import i18n from '../i18n';
import default_profile_image from '../assets/default_profile_image.jpg';

const AppContext = createContext();

function getStored(key, defaultValue) {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : defaultValue;
}

export function AppProvider({ children }) {
    const [role, setRole] = useState(() => getStored('role', 'guest'));
    const [name, setName] = useState(() => getStored('name', ''));
    const [email, setEmail] = useState(() => getStored('email', ''));
    const [userId, setUserId] = useState(() => getStored('userId', ''))
    const [profileImg, setProfileImg] = useState(() =>
        getStored('profileImg', default_profile_image)
    );
    const [theme, setTheme] = useState(() => getStored('theme', 'light'));
    const [language, setLanguage] = useState(() => getStored('language', 'en'));
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('profileImg', profileImg);
        localStorage.setItem('userId', userId);
    }, [role, name, email, profileImg, userId]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute("data-bs-theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
    }, [language]);

    return (
        <AppContext.Provider value={{
            role, setRole,
            loading,
            theme, setTheme,
            language, setLanguage,
            email, setEmail,
            name, setName,
            userId, setUserId,
            profileImg, setProfileImg
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
