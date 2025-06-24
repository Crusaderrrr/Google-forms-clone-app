import React, { useState, useEffect } from "react";
import QuestionsList from "./QuestionsList";

function SingleTemplate({ mode = "view", initialValues, onSubmit, allTags = [], onEdit, showEditButton }) {
  const [template, setTemplate] = useState(initialValues);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tags, setTags] = useState(initialValues.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [questions, setQuestions] = useState(initialValues.questions || []);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, height: 0 });
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "singleLine",
    title: "",
    description: "",
    showInTable: true,
    enabled: true,
  });

  const questionTypes = {
    'singleLine': 'Single line answer',
    'multiLine': 'Multi line answer',
    'integer': 'Numeric answer',
    'checkbox': 'Yes / No checkbox answer'
  };

  useEffect(() => {
    setTemplate(initialValues);
    setQuestions(initialValues.questions || []);
    setTags(initialValues.tags || []);
  }, [initialValues]);

  const readOnly = mode === "view";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let topicToSend = template.topic;
    if (template.topic === 'Other' && template.customTopic) {
      topicToSend = template.customTopic;
    }
    if (onSubmit) onSubmit({ title: template.title, description: template.description, topic: topicToSend, questions, tags, imageFile});
  };

  const handleAddTag = () => {
    const name = tagInput.trim();
    if (!name) return;
    if (tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags(prev => [...prev, { id: Date.now(), name }]);
    setTagInput("");
  };

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleAddOrEditQuestion = () => {
    if (editingQuestionId) {
      // Edit mode: update the question
      setQuestions(prev =>
        prev.map(q => q.id === editingQuestionId ? { ...q, ...newQuestion } : q)
      );
    } else {
      // Add mode: add a new question
      setQuestions(prev => [
        ...prev,
        {
          ...newQuestion,
          id: Date.now(),
          order: prev.length + 1,
        }
      ]);
    }
    setShowAddQuestionForm(false);
    setEditingQuestionId(null);
    setNewQuestion({
      type: "singleLine",
      title: "",
      description: "",
      showInTable: true,
      enabled: true,
    });
  };

  const handleQuestionDoubleClick = (id, position) => {
    setActiveQuestionId(id);
    setMenuPosition(position);
  };  

  const handleQuestionDelete = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setActiveQuestionId(null);
  };

  const handleQuestionEdit = (questionId) => {
    const questionToEdit = questions.find(q => q.id === questionId);
    console.log(questionToEdit)
    setNewQuestion({
      type: questionToEdit.type,
      title: questionToEdit.title,
      description: questionToEdit.description,
      showInTable: questionToEdit.showInTable,
      enabled: questionToEdit.enabled,
      id: questionToEdit.id, // keep the id for updating
      order: questionToEdit.order,
    });
    setEditingQuestionId(questionId);
    setShowAddQuestionForm(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      {showEditButton && (
        <button type="button" className="btn btn-info" onClick={onEdit}>Edit</button>
      )}
      <div className="mb-3 text-start">
        <label className="form-label fw-bold">Title</label>
        <input
          name="title"
          type="text"
          className="form-control"
          value={template.title}
          onChange={handleChange}
          readOnly={readOnly}
          required
        />
      </div>
      <div className="mb-3 text-start">
        <label className="form-label fw-bold">Image</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImageChange}
          disabled={readOnly}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />
        )}
      </div>
      <div className="mb-3 text-start">
        <label className="form-label fw-bold">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows={4}
          value={template.description}
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
      <div className="mb-3 text-start">
        <label className="form-label fw-bold">Topic</label>
        <select
          name="topic"
          className="form-select"
          value={template.topic}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Select a topic</option>
          <option value="Education">Education</option>
          <option value="Quiz">Quiz</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {template.topic === "Other" && (
        <div className="mb-3 text-start">
          <label className="form-label fw-bold">Custom Topic</label>
          <input
            name="customTopic"
            type="text"
            className="form-control"
            value={template.customTopic || ""}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
        </div>
      )}

      <div className="mb-3 text-start">
        <label className="form-label fw-bold me-2">Tags</label>
        <span className="text-muted me-auto">{'(Click to delete)'}</span>
        {!readOnly && (
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tag name"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && tagInput.trim()) {
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              Add
            </button>
          </div>
        )}
        <div>
          {tags.length > 0 ? (
            tags.map(tag => (
              <span
                className="badge bg-primary me-2"
                key={tag.id || tag.name}
                onClick={() => handleDeleteTag(tag.id)}
                style={{ cursor: 'pointer' }}
              >
                {tag.name}
              </span>
            ))
          ) : (
            readOnly ? null : <span className="text-muted">No tags yet</span>
          )}
        </div>
      </div>

      <div className="mt-4 mb-3 d-flex justify-content-between align-items-center">
        <h4 className="mb-0 me-3">Questions</h4>
        <span className="text-muted me-auto mt-1">{'(Double click to modify)'}</span>
        {!readOnly && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowAddQuestionForm(f => !f)}
          >
            Add Question
          </button>
        )}
      </div>

      <QuestionsList
        questions={questions}
        setQuestions={setQuestions}
        onQuestionDoubleClick={handleQuestionDoubleClick}
        activeQuestionId={activeQuestionId}
        disabled={mode === "view"}
        qTypes={questionTypes}
      />

      {activeQuestionId && (
        <div
          className="position-absolute rounded shadow p-2"
          style={{
            left: menuPosition.left + menuPosition.width - 110, 
            top: menuPosition.top + 5,
            width: 100,
            zIndex: 1050
          }}
        >
          <button
            className="btn btn-sm btn-outline-info mb-1 w-100"
            onClick={() => {
              handleQuestionEdit(activeQuestionId);
              setActiveQuestionId(null);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger w-100"
            onClick={() => {
              handleQuestionDelete(activeQuestionId);
              setActiveQuestionId(null);
            }}
          >
            Delete
          </button>
        </div>
      )}

      {!readOnly && showAddQuestionForm && (
        <div className="card p-3 mt-2">
          <div className="mb-2 text-start">
            <label className="mb-1 ms-2 fw-bold">Type</label>
            <select
              className="form-select"
              value={newQuestion.type}
              onChange={e => setNewQuestion(q => ({ ...q, type: e.target.value }))}
            >
              {Object.entries(questionTypes).map(([key, label]) => (
                <option value={key} key={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 text-start">
            <label className="mb-1 fw-bold ms-2">Title</label>
            <input
              className="form-control"
              value={newQuestion.title}
              onChange={e => setNewQuestion(q => ({ ...q, title: e.target.value }))}
            />
          </div>
          <div className="mb-2 text-start">
            <label className="mb-1 ms-2 fw-bold">Description</label>
            <input
              className="form-control"
              value={newQuestion.description}
              onChange={e => setNewQuestion(q => ({ ...q, description: e.target.value }))}
            />
          </div>
          <div className="form-check mb-2 text-start">
            <input
              className="form-check-input"
              type="checkbox"
              checked={newQuestion.showInTable}
              onChange={e => setNewQuestion(q => ({ ...q, showInTable: e.target.checked }))}
            />
            <label className="form-check-label fw-bold ms-1">Show in Table</label>
          </div>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddOrEditQuestion}
            disabled={!newQuestion.title}
          >
            {editingQuestionId ? "Save" : "Add"}
          </button>
        </div>
      )}

      {!readOnly && (
        <button type="submit" className="btn btn-success mt-4 w-100">
          Save
        </button>
      )}
    </form>
  );
}

export default SingleTemplate;