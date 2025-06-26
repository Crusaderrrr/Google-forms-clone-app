import React from "react";

function DescriptionForm ({ description, handleChange, readOnly }) {


    return (
        <div className="mb-3 text-start">
        <label className="form-label fw-bold">Description</label>
        <textarea
            name="description"
            className="form-control"
            rows={4}
            value={description}
            onChange={e => {
                const value = e.target.value;
                const lines = value.split('\n');
                if (lines.length <= 4) {
                handleChange(e);
                }
            }}
            readOnly={readOnly}
        />
      </div>
    )
};

export default DescriptionForm;