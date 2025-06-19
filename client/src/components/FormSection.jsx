import React, {useState} from "react";

function FormSection({ title, forms }) {

  const [selectedForms, setSelectedForms] = useState([]);


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

  return (
    <section>
      <h4 className="mb-3 d-inline">{title}</h4>
      <input 
        type='checkbox'
        className="form-check-input ms-3 mb-2 align-middle"
        style={{top: "10px", left: "15px", zIndex: 2}}
        checked={forms.length > 0 && selectedForms.length === forms.length}
        onChange={handleSelectAll}
      />
      <div className="row mt-2">
        {forms.map(form => (
          <div className="col-md-6 col-lg-4 mb-4" key={form.id}>
            <div className="card h-100">
              <input
                type="checkbox"
                className="form-check-input position-absolute"
                style={{top: "10px", left: "15px", zIndex: 2}}
                checked={selectedForms.includes(form.id)}
                onChange={() => handleCheckboxChange(form.id)}
              />
              <img src={form.image} className="card-img-top" alt={form.title + ' Image'} />
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