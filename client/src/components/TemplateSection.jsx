import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import '../style/CardHover.css';

function TemplateSection({ title, templates, loading, isMain}) {
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        ...newQuestion,
        id: Date.now(),
        order: prev.length + 1,
      }
    ]);
    setShowAddForm(false);
    setNewQuestion({
      type: "singleLine",
      title: "",
      description: "",
      showInTable: true,
      enabled: true,
    });
  };


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

  const handleDeleteTemplates = () => {

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
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h4 className="mb-0">{title}</h4>
        </div>
          {!isMain && (
            <>
              <input
                type="checkbox"
                className="form-check-input ms-3 align-middle"
                style={{ zIndex: 2 }}
                checked={templates.length > 0 && selectedTemplates.length === templates.length}
                onChange={handleSelectAll}
              />
            <div>
              <button className="btn btn-success me-2" onClick={handleCreateTemplate} title={t("myProfile.createTemplate")}>
                <i className="bi bi-plus-lg"></i>
              </button>
              <button className="btn btn-danger" onClick={handleDeleteTemplates} disabled={selectedTemplates.length === 0} title={t("myProfile.deleteTemplate")}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </>
          )}        
          </div>
          

      <div className="row mt-2">
        {templates.map(tpl => (
          <div className="col-md-4 col-lg-4 mb-4 col-sm-6" key={tpl.id}>
            <div
              className="card h-100 card-hover shadow-sm rounded-4 border-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/template/${tpl.id}`)}
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
                className="card-img-top" 
                alt={tpl.title + ' Image'} 
                style={{ objectFit: "cover", height: "100px" }} 
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