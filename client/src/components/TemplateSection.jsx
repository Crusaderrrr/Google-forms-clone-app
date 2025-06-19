import React, { useState } from "react";

function TemplateSection({ title, templates }) {

  const [selectedTemplates, setSelectedTemplates] = useState([]);


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

  return (
    <section>
      <h4 className="mb-3 d-inline">{title}</h4>
      <input
        type="checkbox"
        className="form-check-input ms-3 mb-2 align-middle"
        style={{ top: "10px", left: "15px", zIndex: 2 }}
        checked={templates.length > 0 && selectedTemplates.length === templates.length}
        onChange={handleSelectAll}
      />
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
              <img src={tpl.image} className="card-img-top" alt={tpl.title + ' Image'} />
              <div className="card-body">
                <h5 className="card-title">{tpl.title}</h5>
                <div>
                  {tpl.tags.map(tag => (
                    <span className="badge bg-primary me-1" key={tag}>{tag}</span>
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