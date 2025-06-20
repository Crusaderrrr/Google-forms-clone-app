import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

function TemplateSection({ title, templates }) {
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
    navigate('/')
  };

  const handleDeleteTemplates = () => {

  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h4 className="mb-0">{title}</h4>
          <input
            type="checkbox"
            className="form-check-input ms-3 align-middle"
            style={{ zIndex: 2 }}
            checked={templates.length > 0 && selectedTemplates.length === templates.length}
            onChange={handleSelectAll}
          />
        </div>
        <div>
          <button className="btn btn-success me-2" onClick={handleCreateTemplate} title={t("myProfile.createTemplate")}>
            <i class="bi bi-plus-lg"></i>
          </button>
          <button className="btn btn-danger" onClick={handleDeleteTemplates} disabled={selectedTemplates.length === 0} title={t("myProfile.deleteTemplate")}>
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <div className="row mt-2">
        {templates.map(tpl => (
          <div className="col-md-4 col-lg-4 mb-4 col-sm-6" key={tpl.id}>
            <div className="card h-100">
              <input
                type="checkbox"
                className="form-check-input position-absolute"
                style={{ top: "10px", left: "15px", zIndex: 2 }}
                checked={selectedTemplates.includes(tpl.id)}
                onChange={() => handleCheckboxChange(tpl.id)}
              />
              <img src={tpl.imageUrl} className="card-img-top" alt={tpl.title + ' Image'} />
              <div className="card-body">
                <h5 className="card-title">{tpl.title}</h5>
                <div>
                  {tpl.tags?.map(tag => (
                    <span className="badge bg-primary me-1" key={tag.id}>{tag.name}</span>
                  ))}
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