import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useTranslation } from "react-i18next"; 

function FormView({ questionTypes }) {
  const {t} = useTranslation();
  const { id } = useParams();
  const [formInfo, setFormInfo] = useState();
  const [loading, setLoading] = useState(true);
  const showEditButton = true;
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    async function fetchForm(formId) {
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/forms/formInfo/${formId}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setFormInfo(response.data.formInfo);
          console.log(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchForm(id);
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 200 }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-lg my-5">
      {/* Title */}
      <h1 className="text-center mb-4 d-inline me-4">
        {formInfo.template.title}
      </h1>
      {showEditButton && (
        <button 
          className="btn btn-info d-inline text-end mb-3" 
          onClick={() => navigate(`/template/${formInfo.template.id}`, { state: { answers: formInfo.answers, mode: 'formEdit' } })}
        >
          {t('form.edit')}
        </button>
      )}

      {/* Image */}
      {formInfo.template.imageUrl && (
        <div className="mb-4 text-center">
          <img
            src={formInfo.template.imageUrl}
            alt={formInfo.template.title}
            className="img-fluid rounded shadow w-75"
            style={{
              maxHeight: 520,
              objectFit: "cover",
              margin: "0 auto",
              display: "block",
            }}
          />
        </div>
      )}
      <div className="align-items-center justify-content-between mb-3">
        <div className="d-inline me-1 text-muted">{t('form.filledBy')}</div>
        <span className="fw-bold me-3">
          {formInfo.user.name} ({formInfo.user.email})
        </span>
        <div className="d-inline me-1 text-muted">{t('form.when')}</div>
        <span className="fw-bold">
          {new Date(formInfo.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Access */}
      <div className="text-start mb-3">
        <h3 className="mt-4 mb-2">
          {t('form.access')}
          <span
            className={
              formInfo.template.access === "public"
                ? "text-success ms-2 fs-5"
                : "text-danger ms-2 fs-5"
            }
          >
            {formInfo.template.access === "public" ? t('template.access.public') : t('template.access.private')}
          </span>
        </h3>
        {formInfo.template.access === "private" && (
          <>
            <div className="fw-bold mb-1">{t('form.allowed')}</div>
            <div className="d-flex flex-wrap gap-2">
              {formInfo.template.allowedUsers.length > 0 ? (
                formInfo.template.allowedUsers.map((user) => (
                  <span className="badge bg-primary" key={user.id}>
                    {user.email}
                  </span>
                ))
              ) : (
                <span className="text-muted">{t('form.noAdded')}</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <div className="text-start">
        <h3 className="mt-4 mb-2 d-inline">{t('form.desc')}</h3>
        <div className="ms-2">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {formInfo.template.description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Topic */}
      <div className="text-start">
        <h3 className="mt-4 mb-2 d-inline">{t('form.topic')}</h3>
        <span className="fs-5">
          {formInfo.template.topic}
        </span>
      </div>

      {/* Tags */}
      <div className="d-flex align-items-center mt-3 mb-2">
        <h3 className="mb-0 me-2">{t('form.tags')}</h3>
        <div>
          {formInfo.template.tags && formInfo.template.tags.length > 0 ? (
            formInfo.template.tags.map((tagObj) => (
              <span
                key={tagObj.tag.id || tagObj.tag.name}
                className="badge bg-primary me-2 mt-1 fs-6"
              >
                {tagObj.tag.name}
              </span>
            ))
          ) : (
            <span className="text-muted">{t('form.nTags')}</span>
          )}
        </div>
      </div>
      <h3 className="mt-4 mb-3 text-start">{t('form.q')}</h3>
      <div>
        {formInfo.template.questions &&
        formInfo.template.questions.length > 0 ? (
          formInfo.template.questions.map((q) => {
            const answer = formInfo.answers.find((a) => a.questionId === q.id);

            return (
              <div key={q.id} className="mb-4 p-3 border rounded">
                <div className="mb-2">
                  <span className="fw-bold fs-5">{q.title}</span>
                  <span className="badge bg-secondary ms-3">
                    {questionTypes[q.type] || q.type}
                  </span>
                </div>
                {q.description && (
                  <div className="text-muted text-start mb-2">
                    {q.description}
                  </div>
                )}

                {/* Render answer below description */}
                <div className="text-start mb-2">
                  <strong>{t('form.answer')}</strong>{" "}
                  {(() => {
                    if (!answer)
                      return <span className="text-muted">{t('form.nA')}</span>;

                    switch (q.type) {
                      case "singleLine":
                      case "multiLine":
                        return <span>{answer.value}</span>;
                      case "integer":
                        return <span>{answer.value}</span>;
                      case "checkbox":
                        return (
                          <span
                            className={`badge ms-2 ${
                              answer.value ? "bg-success" : "bg-danger"
                            }`}
                          >
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
          <div className="text-muted">{t('form.nQ')}</div>
        )}
      </div>
    </div>
  );
}

export default FormView;
