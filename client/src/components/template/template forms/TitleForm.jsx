import React from "react";

function TitleForm ({ title, handleChange, readOnly }) {


    return (
        <div className="mb-3 text-start">
            <label className="form-label fw-bold">Title</label>
            <input
                name="title"
                type="text"
                className="form-control"
                value={title}
                onChange={handleChange}
                readOnly={readOnly}
                required
            />
        </div>
    )
};

export default TitleForm;