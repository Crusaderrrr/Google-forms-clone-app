import React from 'react'
import {useApp} from '../context/AppContext'
import NavLink from './NavLink';
import { useTranslation } from 'react-i18next';

function Navbar () {
    const {role, setRole, theme, setTheme, language, setLanguage} = useApp();
    const {t, i18n} = useTranslation();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    return (
    <nav  className={`sticky-top navbar navbar-expand-lg ${theme === 'light' ? 'bg-light navbar-light' : 'bg-dark navbar-dark'}`}>
    <div className="container-fluid">
        <a className="navbar-brand mx-3" href="/main">{t('navbar.theApp')}</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink 
            onClick={toggleTheme}
            className=''
            icon={theme === 'light' ? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}
            />
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {t('navbar.language')} ({language})
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" onClick={() => changeLanguage('en')} style={{ cursor: 'pointer' }}>{t('navbar.langDropdown.English')}</a></li>
                <li><a className="dropdown-item" onClick={() => changeLanguage('es')} style={{ cursor: 'pointer' }}>{t('navbar.langDropdown.Spanish')}</a></li>
            </ul>
            </li>
            <NavLink 
            to="/myProfile" 
            labelKey={t('navbar.myProfile')}
            icon={<i className="bi bi-person-fill"></i>}
            visible={role !== 'guest'}
            />
            <NavLink
            to='/login'
            labelKey={t('navbar.login')}
            icon={<i className="bi bi-person"></i>}
            visible={role === 'guest'}
            />
        </ul>
        <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder={t('navbar.search')} aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">{t('navbar.search')}</button>
        </form>
        </div>
    </div>
    </nav>
    )
};

export default Navbar;