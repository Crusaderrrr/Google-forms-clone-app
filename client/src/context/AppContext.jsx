import { createContext, useContext, useState, useEffect } from "react";
import i18n from '../i18n';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [guest, setGuest] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedGuest = localStorage.getItem('guest') === 'true';
        setGuest(storedGuest);
        setLoading(false); 
    }, []);

    useEffect(() => {
        if (guest !== null) { 
            localStorage.setItem('guest', guest);
        }
    }, [guest]);

    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        return storedTheme;
    });
    
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language); 
    }, [language]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <AppContext.Provider value={{
            guest, setGuest,
            loading, 
            theme, setTheme,
            language, setLanguage
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}