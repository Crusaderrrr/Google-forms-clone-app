import React from "react";

function TemplateSection({ title, templates }) {
  return (
    <section>
      <h4 className="mb-3">{title}</h4>
      <div className="row">
        {templates.map(tpl => (
          <div className="col-md-6 col-lg-4 mb-4" key={tpl.id}>
            <div className="card h-100">
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