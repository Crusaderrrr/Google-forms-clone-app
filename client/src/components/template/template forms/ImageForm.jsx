import React from "react";

function ImageForm ({ t, handleChange, readOnly, imagePreview }) {


    return (
        <div className="mb-3 text-start">
            <label className="form-label fw-bold">{t('template.image')}</label>
            <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
                disabled={readOnly}
            />
            {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />
            )}
      </div>
    )
};

export default ImageForm;