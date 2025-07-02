import React, { useState } from "react";
import axios from "axios";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useApp } from "../../../context/AppContext.js";

function TagsForm({ t, tags, setTags, handleDeleteTag, readOnly }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { theme } = useApp();
  const isDarkMode = theme !== "light";
  const SERVER_URL = import.meta.env.VITE_API_URL;

  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/tags/search`,
        {
          params: { q: inputValue },
          withCredentials: true,
        }
      );
      return response.data.map((tag) => ({
        value: tag.id,
        label: tag.name
      }));
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  };

  const handleChange = (option) => {
    if (!tags.some((t) => (t.tag ? t.tag.id : t.id) === option.value)) {
      setTags([
        ...tags,
        {
          id: option.value,
          tag: { id: option.value, name: option.label },
        },
      ]);
    }
    setInputValue('');
    setSelectedOption('');
  };

  const handleCreate = (inputValue) => {
    const newId = `new-${Date.now()}`;
    const newTag = {
      value: newId,
      label: inputValue,
    };
    setOptions([...options, newTag]);
    const allTags = tags.map((t) => t.tag.name.trim());
    if (allTags.some((name) => name === inputValue.trim())) {
      setInputValue("");
      setSelectedOption("");
    } else {
      setTags([
        ...tags,
        {
          id: newId,
          tag: { id: newId, name: inputValue },
        },
      ]);
      setSelectedOption(newTag);
    }
    setInputValue("");
    setSelectedOption("");
  };

  return (
    <div className="mb-3 text-start">
      <label className="form-label fw-bold me-2">{t('template.tags.title')}</label>
      <span className="text-muted me-auto">{t('template.tags.delete')}</span>
      {!readOnly && (
        <>
          <div></div>
          <div className="mb-3">
            <AsyncCreatableSelect
              cacheOptions
              loadOptions={loadOptions}
              placeholder={t('template.tags.placeholder')}
              defaultValue=""
              inputValue={inputValue}
              onInputChange={setInputValue}
              value={selectedOption}
              onChange={handleChange}
              onCreateOption={handleCreate}
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
        </>
      )}
      <div>
        {tags.length > 0 ? (
          tags.map((tagObj) => {
            const tag = tagObj.tag || tagObj;
            return (
              <span
                className="badge bg-primary me-2"
                key={tag.id || tag.name}
                onClick={() => handleDeleteTag(tag.id)}
                style={{ cursor: "pointer" }}
              >
                {tag.name}
              </span>
            );
          })
        ) : readOnly ? null : (
          <span className="text-muted">{t('template.tags.noTags')}</span>
        )}
      </div>
    </div>
  );
}

export default TagsForm;
