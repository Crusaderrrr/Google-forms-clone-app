import React from "react";
import { useApp } from "../context/AppContext";
import NavLink from "./NavLink";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const { role, theme, setTheme, language, setLanguage } = useApp();
  const { t, i18n } = useTranslation();
  const isDarkMode = theme !== "light";
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  const filterOption = (option, inputValue) => {
    const search = inputValue.toLowerCase();

    if (option.label && option.label.toLowerCase().includes(search)) {
      return true;
    }

    if (
      option.data.description &&
      option.data.description.toLowerCase().includes(search)
    ) {
      return true;
    }

    if (option.data.questions && Array.isArray(option.data.questions)) {
      for (const q of option.data.questions) {
        if (q.description && q.description.toLowerCase().includes(search)) {
          return true;
        }
      }
    }

    return false;
  };

  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      setOptions([]);
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:5000/api/search/templates",
        {
          params: { q: inputValue },
          withCredentials: true,
        }
      );

      const options = response.data.map((template) => ({
        value: template.id,
        label: template.title,
        description: template.description,
        ...template,
      }));
      setOptions(options);
    } catch (error) {
      console.error("Search failed:", error);
      setOptions([]);
    }
  };

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
    if (inputValue.length < 2) {
      return;
    }
    loadOptions(inputValue);
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    navigate(`/template/${option.id}`, { state: { mode: 'view' } })
    setSelectedOption("");
    setOptions([]);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === "light" ? "bg-light navbar-light" : "bg-dark navbar-dark"
      }`}
    >
      <div className="container-fluid">
        <a className="navbar-brand mx-3" href="/main">
          {t("navbar.theApp")}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink
              onClick={toggleTheme}
              className=""
              icon={
                theme === "light" ? (
                  <i className="bi bi-brightness-high-fill"></i>
                ) : (
                  <i className="bi bi-moon-fill"></i>
                )
              }
            />
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {t("navbar.language")} ({language})
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => changeLanguage("en")}
                    style={{ cursor: "pointer" }}
                  >
                    {t("navbar.langDropdown.English")}
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => changeLanguage("es")}
                    style={{ cursor: "pointer" }}
                  >
                    {t("navbar.langDropdown.Spanish")}
                  </a>
                </li>
              </ul>
            </li>
            <NavLink
              to="/myProfile"
              labelKey={t("navbar.myProfile")}
              icon={<i className="bi bi-person-fill"></i>}
              visible={role !== "guest"}
            />
            <NavLink
              to="/login"
              labelKey={t("navbar.login")}
              icon={<i className="bi bi-person"></i>}
              visible={role === "guest"}
            />
          </ul>
          <form className="d-flex">
            <div style={{ width: 350 }}>
              <Select
                className=""
                placeholder={t("navbar.search")}
                defaultValue=""
                options={options}
                inputValue={inputValue}
                onInputChange={(value) => handleInputChange(value)}
                value={selectedOption}
                onChange={(value) => handleChange(value)}
                filterOption={filterOption}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    neutral0: isDarkMode ? "#23272f" : "#fff",  
                    neutral80: isDarkMode ? "#f3f4f6" : "#333", 
                    primary25: isDarkMode ? "#2d3748" : "#f0f0f0",
                    primary: isDarkMode ? "#90cdf4" : "#2684ff", 
                    neutral20: isDarkMode ? "#4a5568" : "#ccc", 
                    neutral30: isDarkMode ? "#718096" : "#aaa", 
                    neutral10: isDarkMode ? "#23272f" : "#fff",
                  },
                })}
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
