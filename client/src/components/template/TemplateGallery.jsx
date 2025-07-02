import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/CardHover.css";
import axios from "axios";

function TemplateGallery({
  t,
  title,
  navigate,
  templates,
  isMain,
  selectedTemplates,
  onSelectAll,
  onCreateTemplate,
  onDeleteTemplate,
  onCheckboxChange,
}) {
  const location = useLocation();

  return (
    <section>
      <div className="d-flex align-items-center mb-3">
        {!isMain && (
          <>
            <h4>{title}</h4>
            <input
              type="checkbox"
              className="form-check-input ms-2 mb-1 align-middle"
              style={{ zIndex: 2 }}
              checked={
                templates.length > 0 &&
                selectedTemplates.length === templates.length
              }
              onChange={onSelectAll}
            />
          </>
        )}
        {!isMain && (
          <div className="ms-auto">
            {!location.pathname.endsWith("/admin") && (
              <button
                className="btn btn-success me-2"
                onClick={onCreateTemplate}
                title={t("myProfile.createTemplate")}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={onDeleteTemplate}
              disabled={selectedTemplates.length === 0}
              title={t("myProfile.deleteTemplate")}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        )}
      </div>

      <div className="row mt-2">
        {templates.map((tpl) => (
          <div className="col-md-4 col-lg-4 mb-4 col-sm-6" key={tpl.id}>
            <div
              className="card h-100 card-hover shadow-sm rounded-4 border-1"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/template/${tpl.id}`, { state: { mode: "view" } })
              }
            >
              {!isMain && (
                <>
                  <input
                    type="checkbox"
                    className="form-check-input position-absolute"
                    style={{ top: "10px", left: "15px", zIndex: 2 }}
                    checked={selectedTemplates.includes(tpl.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onCheckboxChange(tpl.id)}
                  />
                </>
              )}
              <img
                src={tpl.imageUrl}
                className="card-img-top rounded-top-4 "
                alt={tpl.title + " Image"}
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
                  {tpl.tags?.slice(0, 3).map((tagObj) => (
                    <span className="badge bg-primary me-1" key={tagObj.tag.id}>
                      {tagObj.tag.name}
                    </span>
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

export default TemplateGallery;
