import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { useTranslation } from "react-i18next";

function Comments({ comments = [], readOnly = false, onAddComment }) {
  const {t} = useTranslation();
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);
  const {role} = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment && onAddComment(newComment.trim());
      setNewComment("");
      setAdding(false);
    }
  };

  return (
    <div className="mb-3">
      <h3 className="form-label fw-bold">{t('template.comms')}</h3>
      <ul className="list-group mb-2">
        {comments.length === 0 && (
          <li className="list-group-item text-muted">{t('template.nC')}</li>
        )}
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            <h5 className="text-start mt-1">{comment.value}</h5>
            {comment.author && (
              <p className="text-muted text-start mb-1">{t('template.by')}{comment.author.name}</p>
            )}
          </li>
        ))}
      </ul>

      {(!readOnly && role !== 'guest') && (
        <>
          {!adding ? (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setAdding(true)}
            >
              {t('template.addC')}
            </button>
          ) : (
            <div className="d-flex gap-2 justify-content-center">
              <input
                style={{width:350}}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('template.wC')}
                autoFocus
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                type="button"
              >
                {t('template.submit')}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={() => {
                  setNewComment("");
                  setAdding(false);
                }}
              >
                {t('template.cancel')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Comments;
