import React from "react";

function FormSection({ title, forms }) {
  return (
    <section>
      <h4 className="mb-3">{title}</h4>
      <div className="row">
        {forms.map(form => (
          <div className="col-md-6 col-lg-4 mb-4" key={form.id}>
            <div className="card h-100">
              <img src={form.image} className="card-img-top" alt={form.title} />
              <div className="card-body">
                <h5 className="card-title">{form.title}</h5>
                <p className="card-text">
                  <small className="text-muted">Filled at: {form.filledAt}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FormSection;