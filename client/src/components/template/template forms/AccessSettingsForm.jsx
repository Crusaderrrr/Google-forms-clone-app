import React, { useState } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import {useApp} from '../../../context/AppContext';

function AccessForm({
  t,
  access,
  setAllowedUsers,
  allowedUsers,
  handleChange,
  readOnly,
  handleDeleteAllowed,
}) {
  const [searchType, setSearchType] = useState("name");
  const [selectedOption, setSelectedOption] = useState(null);
  const {theme} = useApp();
  const isDarkMode = theme !== 'light';

  const loadOptions = async (inputValue, callback) => {
    if (inputValue.length < 2) {
      callback([]);
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/search",
        {
          params: { q: inputValue, searchType },
          withCredentials: true,
        }
      );
      const options = response.data.map((user) => ({
        value: user.id,
        label: searchType === "name" ? user.name : user.email,
        ...user,
      }));
      callback(options);
    } catch (error) {
      console.error("Search failed:", error);
      callback([]);
    }
  };

  const handleRadioChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSelectChange = (selectedUser) => {
    if (selectedUser && !allowedUsers.some((u) => u.id === selectedUser.id)) {
      setAllowedUsers([...allowedUsers, selectedUser]);
    }
  };

  return (
    <>
      <div className="mb-3 text-start">
        <label className="form-label fw-bold">{t('template.access.title')}</label>
        <select
          name="Access"
          className="form-select"
          value={access}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="public">{t('template.access.public')}</option>
          <option value="private">{t('template.access.private')}</option>
        </select>
      </div>
      {access === "private" && (
        <div className="text-start">
          <label className="form-label fw-bold">{t('template.access.addAllowed')}</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="radioName"
                checked={searchType === "name"}
                value="name"
                onChange={handleRadioChange}
              />
              <label className="form-check-label" htmlFor="radioName">
                {t('template.access.name')}
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="radioEmail"
                checked={searchType === "email"}
                value="email"
                onChange={handleRadioChange}
              />
              <label className="form-check-label" htmlFor="radioEmail">
                {t('template.access.email')}
              </label>
            </div>
          </div>
          <div className="mb-3">
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions={false}
              value={selectedOption}
              onChange={(option) => {
                handleSelectChange(option);
                setSelectedOption(null);
              }}
              isClearable
              placeholder={`${searchType === 'name' ? t('template.access.placeholderName') : t('template.access.placeholderEmail')}`}
              isDisabled={readOnly}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  neutral0: isDarkMode ? "#212529" : "#fff", 
                  primary25: isDarkMode ? "#343a40" : "#e9ecef", 
                  primary: isDarkMode ? "#0d6efd" : "#0d6efd", 
                  neutral80: isDarkMode ? "#f8f9fa" : "#212529", 
                },
              })}
            />
          </div>
        </div>
      )}
      <div>
        {allowedUsers.length > 0 ? (
          allowedUsers.map((user) => (
            <span
              className="badge bg-info me-2"
              key={user.id}
              onClick={() => handleDeleteAllowed(user.id)}
              style={{ cursor: "pointer" }}
            >
              {searchType === "name" ? user.name : user.email}
            </span>
          ))
        ) : readOnly ? null : access === "private" ? (
          <span className="text-muted">{t('template.access.noAllowed')}</span>
        ) : null}
      </div>
    </>
  );
}

export default AccessForm;
