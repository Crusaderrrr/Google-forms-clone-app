import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function FormView ({questionTypes}) {
    const { id } = useParams();
    const [formInfo, setFormInfo] = useState();
    const [loading, setLoading] = useState(true);
    const showEditButton = true;

    useEffect(() => {
        setLoading(true);
        async function fetchForm(formId) {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/forms/formInfo/${formId}`,
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setFormInfo(response.data.formInfo);
                    console.log(response.data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false);
            }
        }

        fetchForm(id);
    }, [id]);

    console.log(formInfo);

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
            <h1 className="text-center mb-4 d-inline me-4">{formInfo.template.title}</h1>
            {showEditButton && (
                <button className="btn btn-info d-inline text-end mb-3">Edit</button>
            )}

            {/* Image */}
            {formInfo.template.imageUrl && (
                <div className="mb-4 text-center">
                <img
                    src={formInfo.template.imageUrl}
                    alt={formInfo.template.title}
                    className="img-fluid rounded shadow w-75"
                    style={{ maxHeight: 520, objectFit: "cover", margin: "0 auto", display: "block" }}
                /> 
                </div>
            )}
            <div className="align-items-center justify-content-between mb-3">
                <div className="d-inline me-1 text-muted">Filled by:</div>
                <span className="fw-bold me-3">{formInfo.user.name} ({formInfo.user.email})</span>
                <div className="d-inline me-1 text-muted">When:</div>
                <span className="fw-bold">{new Date(formInfo.createdAt).toLocaleString()}</span>
            </div>

            {/* Topic */}
            <div className="text-start">
                <h3 className="mt-4 mb-2 d-inline">Topic: </h3>
                <span className="fs-5">
                    {formInfo.template.topic || <span className="text-muted d-inline">No topic</span>}
                </span>
            </div>

            {/* Tags */}
            <div className="d-flex align-items-center mt-3 mb-2">
                <h3 className="mb-0 me-2">Tags:</h3>
                <div>
                    {formInfo.template.tags && formInfo.template.tags.length > 0 ? (
                    formInfo.template.tags.map(tagObj => (
                        <span key={tagObj.tag.id || tagObj.tag.name} className="badge bg-primary me-2 mt-1 fs-6">
                        {tagObj.tag.name}
                        </span>
                    ))
                    ) : (
                    <span className="text-muted">No tags</span>
                    )}
                </div>
            </div>
            <h3 className="mt-4 mb-3 text-start">Questions:</h3>
            <div>
                {formInfo.template.questions && formInfo.template.questions.length > 0 ? (
                    formInfo.template.questions.map(q => {
                        const answer = formInfo.answers.find(a => a.questionId === q.id);

                        return (
                        <div key={q.id} className="mb-4 p-3 border rounded">
                            <div className="mb-2">
                            <span className="fw-bold fs-5">{q.title}</span>
                            <span className="badge bg-secondary ms-3">{questionTypes[q.type] || q.type}</span>
                            </div>
                            {q.description && (
                            <div className="text-muted text-start mb-2">{q.description}</div>
                            )}

                            {/* Render answer below description */}
                            <div className="text-start mb-2">
                            <strong>Answer:</strong>{" "}
                            {(() => {
                                if (!answer) return <span className="text-muted">No answer</span>;

                                switch (q.type) {
                                case "singleLine":
                                case "multiLine":
                                    return <span>{answer.value}</span>;
                                case "integer":
                                    return <span>{answer.value}</span>;
                                case "checkbox":
                                    return (
                                    <span className={`badge ms-2 ${answer.value ? "bg-success" : "bg-danger"}`}>
                                        {answer.value ? "Yes" : "No"}
                                    </span>
                                    );
                                default:
                                    return <span>{answer.value}</span>;
                                }
                            })()}
                            </div>
                        </div>
                        );
                    })
                    ) : (
                    <div className="text-muted">No questions</div>
                    )}
            </div>
        </div>
    )
};

export default FormView;