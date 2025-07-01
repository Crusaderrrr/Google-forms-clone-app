import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import '../../style/CardHover.css';
import axios from 'axios';

function TemplateSection({ title, templates, loading, isMain}) {
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTemplates(templates.map(tpl => tpl.id));
    } else {
      setSelectedTemplates([]);
    }
  };

  const handleCheckboxChange = (tplId) => {
    setSelectedTemplates(prev =>
      prev.includes(tplId)
        ? prev.filter(id => id !== tplId)
        : [...prev, tplId]
    );
  };

  const handleCreateTemplate = () => {
    navigate('/template/create')
  };

  const handleDeleteTemplates = async () => {
    if (selectedTemplates.length === 0) return;
    if (!window.confirm(t('myProfile.deleteTemplate?'))) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/templates/delete',
        { templateIds: selectedTemplates },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSelectedTemplates([]);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
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

  return (
    <section>
      <div className="d-flex align-items-center mb-3">
        <h4 className="mb-0">{title}</h4>
        {!isMain && (
          <input
            type="checkbox"
            className="form-check-input ms-2 align-middle"
            style={{ zIndex: 2 }}
            checked={templates.length > 0 && selectedTemplates.length === templates.length}
            onChange={handleSelectAll}
          />
        )}
        {!isMain && (
          <div className="ms-auto">
            <button className="btn btn-success me-2" onClick={handleCreateTemplate} title={t("myProfile.createTemplate")}>
              <i className="bi bi-plus-lg"></i>
            </button>
            <button className="btn btn-danger" onClick={handleDeleteTemplates} disabled={selectedTemplates.length === 0} title={t("myProfile.deleteTemplate")}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        )}
      </div>
          
      <div className="row mt-2">
        {templates.map(tpl => (
          <div className="col-md-4 col-lg-4 mb-4 col-sm-6" key={tpl.id}>
            <div
              className="card h-100 card-hover shadow-sm rounded-4 border-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/template/${tpl.id}`, { state: { mode: 'view' } })}
              >
              {!isMain && (
                <>
                  <input
                    type="checkbox"
                    className="form-check-input position-absolute"
                    style={{ top: "10px", left: "15px", zIndex: 2 }}
                    checked={selectedTemplates.includes(tpl.id)}
                    onClick={e => e.stopPropagation()} 
                    onChange={() => handleCheckboxChange(tpl.id)}
                  />
                </>
              )}
              <img 
                src={tpl.imageUrl} 
                className="card-img-top rounded-top-4 " 
                alt={tpl.title + ' Image'} 
              />
              <div className="card-body pb-2">
                <h5 className="card-title text-center fw-bold">{tpl.title}</h5>
                {isMain && tpl.author && (
                  <div className="card-subtitle mb-2 text-center">
                    <h6 className="d-inline text-muted">
                      Author:<span>&nbsp;</span>
                    </h6> 
                    <h5 className="d-inline">{tpl.author.name}</h5>
                  </div>
                )}
                <div className="text-center">
                  {tpl.tags?.slice(0, 3).map(tagObj => (
                    <span className="badge bg-primary me-1" key={tagObj.tag.id}>{tagObj.tag.name}</span>
                  ))}
                  {tpl.tags && tpl.tags.length > 3 && (
                    <span className="ms-1">...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TemplateSection;