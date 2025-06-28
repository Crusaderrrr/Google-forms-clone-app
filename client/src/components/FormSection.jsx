import React, { useState, useEffect } from "react";
import {useApp} from '../context/AppContext';
import { useNavigate } from "react-router-dom";

function FormSection({ title, loading, forms }) {
  const [selectedForms, setSelectedForms] = useState([]);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedForms(forms.map(form => form.id));
    } else {
      setSelectedForms([]);
    }
  };

  const handleCheckboxChange = (formId) => {
    setSelectedForms(prev => 
      prev.includes(formId)
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
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

  // Handle header click to toggle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Render sort arrow
  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <section>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("templateTitle")}>
              Template Title{renderSortArrow("templateTitle")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
              Date Filled{renderSortArrow("createdAt")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedForms.map((form, idx) => (
            <tr
              key={form.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/form/${form.id}`, { state: { mode: 'formView' } })}
            >
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