import React, { useState } from "react";

function TemplateFill ({template, onSubmit, onEdit, showEditButton, questionTypes, loading, buttonLoading}) {
    const [answers, setAnswers] = useState([]);

    const handleInputChange = (qId, value) => {
        const existing = answers.find(a => a.qId === qId)
        if (existing) {
            setAnswers(answers.map(a => a.qId === qId ? { ...a, value: value } : a))
        } else {
            setAnswers([...answers, {qId, value}])
        }
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(answers);
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
        <div className="container-lg my-5">
            {/* Title */}
            <h1 className="text-center mb-4 d-inline me-4">{template.title}</h1>
            {showEditButton && (
                <button className="btn btn-info d-inline text-end mb-3" onClick={onEdit}>Edit</button>
            )}

            {/* Image */}
            {template.imageUrl && (
                <div className="mb-4 text-center">
                <img
                    src={template.imageUrl}
                    alt={template.title}
                    className="img-fluid rounded shadow w-75"
                    style={{ maxHeight: 520, objectFit: "cover", margin: "0 auto", display: "block" }}
                /> 
                </div>
            )}

            {/* Topic */}
            <div className="text-start">
                <h3 className="mt-4 mb-2 d-inline">Topic: </h3>
                <span className="fs-5">
                    {template.topic || <span className="text-muted d-inline">No topic</span>}
                </span>
            </div>

            {/* Tags */}
            <div className="d-flex align-items-center mt-3 mb-2">
                <h3 className="mb-0 me-2">Tags:</h3>
                <div>
                    {template.tags && template.tags.length > 0 ? (
                    template.tags.map(tagObj => (
                        <span key={tagObj.tag.id || tagObj.tag.name} className="badge bg-primary me-2 mt-1 fs-6">
                        {tagObj.tag.name}
                        </span>
                    ))
                    ) : (
                    <span className="text-muted">No tags</span>
                    )}
                </div>
            </div>

            {/* Questions */}
            <h3 className="mt-4 mb-3 text-start">Questions:</h3>
            <form onSubmit={handleSubmit}>
                {template.questions && template.questions.length > 0 ? (
                template.questions.map(q => (
                    <div key={q.id} className="mb-4 p-3 border rounded">
                    <div className="mb-2">
                        <span className="fw-bold fs-5">{q.title}</span>
                        <span className="badge bg-secondary ms-3">{questionTypes[q.type] || q.type}</span>
                    </div>
                    {q.description && (
                        <div className="text-muted text-start mb-2">{q.description}</div>
                    )}
                    {/* Render input based on type */}
                    {q.type === "singleLine" && (
                        <input
                        type="text"
                        className="form-control"
                        value={answers.find(a => a.qId === q.id)?.value || ""}
                        onChange={e => handleInputChange(q.id, e.target.value)}
                        />
                    )}
                    {q.type === "multiLine" && (
                        <textarea
                        className="form-control"
                        rows={4}
                        value={answers.find(a => a.qId === q.id)?.value || ""}
                        onChange={e => handleInputChange(q.id, e.target.value)}
                        />
                    )}
                    {q.type === "integer" && (
                        <input
                        type="number"
                        className="form-control"
                        value={answers.find(a => a.qId === q.id)?.value || ""}
                        onChange={e => handleInputChange(q.id, e.target.value.replace(/[^0-9-]/g, ""))}
                        />
                    )}
                    {q.type === "checkbox" && (
                        <div>
                        <div className="form-check form-check-inline">
                            <input
                            className="form-check-input"
                            type="radio"
                            name={`checkbox-${q.id}`}
                            id={`checkbox-yes-${q.id}`}
                            checked={answers.find(a => a.qId === q.id)?.value === true}
                            onChange={() => handleInputChange(q.id, true)}
                            />
                            <label className="form-check-label" htmlFor={`checkbox-yes-${q.id}`}>Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                            className="form-check-input"
                            type="radio"
                            name={`checkbox-${q.id}`}
                            id={`checkbox-no-${q.id}`}
                            checked={answers.find(a => a.qId === q.id)?.value === false}
                            onChange={() => handleInputChange(q.id, false)}
                            />
                            <label className="form-check-label" htmlFor={`checkbox-no-${q.id}`}>No</label>
                        </div>
                        </div>
                    )}
                    </div>
                ))
                ) : (
                    <div className="text-muted">No questions</div>
                )}
                {buttonLoading === true ? (
                <button className="btn btn-success py-2" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Saving...
                    </button>
                ):(
                    <button className="btn btn-success px-4" type="submit">Save</button>
                )}
            </form>
        </div>
    );
};

export default TemplateFill;