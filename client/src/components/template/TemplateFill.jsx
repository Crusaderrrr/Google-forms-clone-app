import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Comments from "./template forms/Comments";
import Likes from "./template forms/Likes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import axios from "axios";

function TemplateFill({
  t,
  readOnly,
  setReadOnly,
  mode,
  setMode,
  template,
  comments,
  setComments,
  likes,
  setLikes,
  formAnswers,
  onSubmit,
  onEdit,
  showEditButton,
  questionTypes,
  loading,
  buttonLoading,
}) {
  const [answers, setAnswers] = useState(formAnswers || []);
  const { role, isAdmin, email, userId } = useApp();
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_API_URL;

  let isAllowedUser = template.allowedUsers?.some(
    (user) => user.email === email
  );
  const isPrivate = template.access === "private";
  const isPublic = template.access === "public";
  const isGuest = role === "guest";
  let isAuthor = String(template.authorId) === String(userId);
  if (
    (isGuest && isAuthor) ||
    (isGuest && isAllowedUser) ||
    (isGuest && isAdmin)
  ) {
    isAuthor = false;
    isAllowedUser = false;
  }

  const handleInputChange = (qId, value) => {
    const existing = answers.find((a) => a.questionId === qId);
    if (existing) {
      setAnswers(
        answers.map((a) => (a.questionId === qId ? { ...a, value: value } : a))
      );
    } else {
      setAnswers([...answers, { questionId: qId, value }]);
    }
  };

  const handleSetFill = () => {
    setMode("fill");
    setReadOnly(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(answers);
  };

  const handleAddComment = async (text) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/comments/submit`,
        {
          value: text,
          templateId: template.id,
        },
        { withCredentials: true }
      );

      setComments([
        ...comments,
        {
          id: response.data.id,
          text: response.data.value,
          author: response.data.author?.name,
        },
      ]);
      window.location.reload();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleLikeToggle = async () => {
    const isLiked = likes.some((like) => like.authorId === Number(userId));
    if (isGuest) return;

    if (isLiked) {
      // Unlike: send DELETE request
      try {
        const response = await axios.delete(`${SERVER_URL}/api/likes/delete`, {
          data: { templateId: template.id }, // 'data' is required for DELETE with axios
          withCredentials: true,
        });
        setLikes(likes.filter((like) => like.authorId !== userId));
        window.location.reload();
      } catch (err) {
        console.error("Error unliking:", err);
      }
    } else {
      // Like: send POST request
      try {
        const response = await axios.post(
          `${SERVER_URL}/api/likes/submit`,
          { templateId: template.id },
          { withCredentials: true }
        );
        setLikes([
          ...likes,
          {
            id: response.data.id,
            authorId: userId,
            templateId: template.id,
          },
        ]);
        window.location.reload();
      } catch (err) {
        console.error("Error liking:", err);
      }
    }
  };

  const canUseTemplate =
    isPublic || (isPrivate && (isAdmin || isAuthor || isAllowedUser));

  if (!loading && !canUseTemplate) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{
          zIndex: 1050,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div className="alert alert-danger fs-5" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {t('template.access.notAllowed')}{" "}
          <button
            className="btn mb-1 text-decoration-underline fs-5"
            onClick={() => navigate("/main")}
            style={{ cursor: "pointer" }}
          >
            {t('main.mP')}
          </button>
        </div>
      </div>
    );
  }

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
      <h1 className="text-center mb-4 d-inline me-4">{template.title}</h1>
      {showEditButton && (
        <>
          <button
            className="btn btn-info d-inline text-end mb-3 me-2"
            onClick={onEdit}
          >
            {t('form.edit')}
          </button>
        </>
      )}
      {readOnly && !isGuest && (
        <button
          className="btn btn-success d-inline text-end mb-3"
          onClick={() => handleSetFill()}
        >
          {t('template.fill')}
        </button>
      )}

      <Likes likes={likes} onToggleLike={handleLikeToggle} />

      {/* Image */}
      {template.imageUrl && (
        <div className="mb-4 text-center">
          <img
            src={template.imageUrl}
            alt={template.title}
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

      {/* Access */}
      <div className="text-start mb-3">
        <h3 className="mt-4 mb-2">
          {t('template.access.title')}
          <span
            className={
              template.access === "public"
                ? "text-success ms-2 fs-5"
                : "text-danger ms-2 fs-5"
            }
          >
            {template.access === "public" ? t('template.access.public') : t('template.access.private')}
          </span>
        </h3>
        {template.access === "private" && (
          <>
            <div className="fw-bold mb-1">{t('form.allowed')}</div>
            <div className="d-flex flex-wrap gap-2">
              {template.allowedUsers.length > 0 ? (
                template.allowedUsers.map((user) => (
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
        <h3 className="mt-4 mb-2">{t('template.description')}</h3>
        <div className="border rounded-3">
          <div className="ms-3 mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {template.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Topic */}
      <div className="text-start">
        <h3 className="mt-4 mb-2 d-inline">{t('template.topic.title')}</h3>
        <span className="fs-5">
          {template.topic || (
            <span className="text-muted d-inline">No topic</span>
          )}
        </span>
      </div>

      {/* Tags */}
      <div className="d-flex align-items-center mt-3 mb-2">
        <h3 className="mb-0 me-2">{t('template.tags.title')}</h3>
        <div>
          {template.tags && template.tags.length > 0 ? (
            template.tags.map((tagObj) => (
              <span
                key={tagObj.tag.id || tagObj.tag.name}
                className="badge bg-primary me-2 mt-1 fs-6"
              >
                {tagObj.tag.name}
              </span>
            ))
          ) : (
            <span className="text-muted">No tags</span>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="mt-3 mb-3 text-start">
        <h3 className=" d-inline me-2">{t('template.questions.title')}</h3>
        {template.questions.length === 0 && (
          <div className="text-muted d-inline">No questions</div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        {template.questions &&
          template.questions.length > 0 &&
          template.questions.map((q) => (
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
              {q.type === "singleLine" && (
                <input
                  type="text"
                  className="form-control"
                  value={
                    answers.find((a) => a.questionId === q.id)?.value || ""
                  }
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  disabled={role === "guest"}
                  readOnly={readOnly}
                  required
                />
              )}
              {q.type === "multiLine" && (
                <textarea
                  className="form-control"
                  rows={4}
                  value={
                    answers.find((a) => a.questionId === q.id)?.value || ""
                  }
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  disabled={role === "guest"}
                  readOnly={readOnly}
                  required
                />
              )}
              {q.type === "integer" && (
                <input
                  type="number"
                  className="form-control"
                  required
                  value={
                    answers.find((a) => a.questionId === q.id)?.value || ""
                  }
                  disabled={role === "guest"}
                  readOnly={readOnly}
                  onChange={(e) =>
                    handleInputChange(
                      q.id,
                      e.target.value.replace(/[^0-9-]/g, "")
                    )
                  }
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
                      disabled={
                        role === "guest" || !["fill", "formEdit"].includes(mode)
                      }
                      readOnly={readOnly}
                      checked={
                        answers.find((a) => a.questionId === q.id)?.value ===
                        "true"
                      }
                      onChange={() => handleInputChange(q.id, "true")}
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`checkbox-yes-${q.id}`}
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`checkbox-${q.id}`}
                      id={`checkbox-no-${q.id}`}
                      disabled={
                        role === "guest" || !["fill", "formEdit"].includes(mode)
                      }
                      checked={
                        answers.find((a) => a.questionId === q.id)?.value ===
                        "false"
                      }
                      onChange={() => handleInputChange(q.id, "false")}
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`checkbox-no-${q.id}`}
                    >
                      No
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        <Comments
          comments={comments}
          readOnly={false}
          onAddComment={handleAddComment}
        />
        {role !== "guest" &&
          ["fill", "formEdit"].includes(mode) &&
          (buttonLoading === true ? (
            <button className="btn btn-success py-2" type="button" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {["view", "fill", "formEdit"].includes(mode)
                ? "Saving..."
                : "Updating..."}
            </button>
          ) : (
            <button className="btn btn-success px-4" type="submit">
              {["view", "fill", "formEdit"].includes(mode) ? "Save" : "Update"}
            </button>
          ))}
      </form>
    </div>
  );
}

export default TemplateFill;
