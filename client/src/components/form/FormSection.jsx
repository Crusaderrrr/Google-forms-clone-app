import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import axios from 'axios';

function FormSection({ title, loading, forms }) {
  const [selectedForms, setSelectedForms] = useState([]);
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const SERVER_URL = import.meta.env.VITE_API_URL;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedForms(forms.map((form) => form.id));
    } else {
      setSelectedForms([]);
    }
    console.log(selectedForms);
  };

  const handleCheckboxChange = (formId) => {
    setSelectedForms((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId]
    );
  };

  const handleDeleteForms = async () => {
    if (selectedForms.length === 0) return;
    if (!window.confirm(t('myProfile.deleteForm?'))) return;

    try {
      const response = await axios.delete(
        `${SERVER_URL}/api/forms/delete`,
        {
          data: { formIds: selectedForms },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setSelectedForms([]);
        window.location.reload();
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

  const sortedForms = [...forms].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key === "templateTitle") {
      aValue = a.template.title.toLowerCase();
      bValue = b.template.title.toLowerCase();
    } else if (sortConfig.key === "createdAt") {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    } else {
      return 0;
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <section>
      <div className="d-flex align-items-center mb-3">
        <h4 className="mb-0">{title}</h4>
        <div className="ms-auto">
          <button
            className="btn btn-danger"
            onClick={handleDeleteForms}
            disabled={selectedForms.length === 0}
            title={t("myProfile.deleteForms")}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onClick={handleSelectAll} />
            </th>
            <th>#</th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("templateTitle")}
            >
              {t('myProfile.templateT')}{renderSortArrow("templateTitle")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("createdAt")}
            >
              {t('myProfile.dateFilled')}{renderSortArrow("createdAt")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedForms.map((form, idx) => (
            <tr
              key={form.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/form/${form.id}`, { state: { mode: "formView" } })
              }
            >
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(form.id)}
                  onClick={(e) => e.stopPropagation()}
                  checked={selectedForms.includes(form.id)}
                />
              </td>
              <td>{idx + 1}</td>
              <td>{form.template.title}</td>
              <td>{new Date(form.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default FormSection;