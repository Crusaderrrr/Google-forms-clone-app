import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../style/CardHover.css";
import axios from "axios";
import TemplateGallery from "./TemplateGallery";
import TemplateTable from "./TemplateTable";
import { useApp } from "../../context/AppContext";

function TemplateSection({ title, templates, loading, isMain }) {
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("gallery");
  const SERVER_URL = import.meta.env.VITE_API_URL;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTemplates(templates.map((tpl) => tpl.id));
    } else {
      setSelectedTemplates([]);
    }
  };

  const handleCheckboxChange = (tplId) => {
    setSelectedTemplates((prev) =>
      prev.includes(tplId)
        ? prev.filter((id) => id !== tplId)
        : [...prev, tplId]
    );
  };

  const handleCreateTemplate = () => {
    navigate("/template/create");
  };

  const handleDeleteTemplates = async () => {
    if (selectedTemplates.length === 0) return;
    if (!window.confirm(t("myProfile.deleteTemplate?"))) return;

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/templates/delete`,
        { templateIds: selectedTemplates },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSelectedTemplates([]);
        
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 200 }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-row mb-3">
        {isMain && <h4 className="display-5">{title}</h4>}
        {isMain && (
          <div className="btn-group ms-auto py-2">
            <button
              className={`btn btn ${
                activeSection === "table"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveSection("table")}
            >
              <i className="bi bi-list"></i>
            </button>
            <button
              className={`btn btn ${
                activeSection === "gallery"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveSection("gallery")}
            >
              <i className="bi bi-columns-gap"></i>
            </button>
          </div>
        )}
      </div>
      {activeSection === "gallery" ? (
        <TemplateGallery
          t={t}
          title={title}
          navigate={navigate}
          templates={templates}
          isMain={isMain}
          selectedTemplates={selectedTemplates}
          onSelectAll={handleSelectAll}
          onCreateTemplate={handleCreateTemplate}
          onDeleteTemplate={handleDeleteTemplates}
          onCheckboxChange={handleCheckboxChange}
        />
      ) : (
        <TemplateTable t={t} templates={templates} navigate={navigate} />
      )}
    </>
  );
}

export default TemplateSection;
