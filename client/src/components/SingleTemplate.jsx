import React, { useState, useEffect } from "react";

// SingleTemplate handles create, edit, and view modes
function SingleTemplate({ mode = "view", initialValues, onSubmit, allTags = [], onEdit }) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const readOnly = mode === "view";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => ({
      id: Number(opt.value),
      name: opt.text
    }));
    setForm({ ...form, tags: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!readOnly && onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div>
        <label>Topic:</label>
        <input
          name="topic"
          value={form.topic}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div>
        <label>Tags:</label>
        {readOnly ? (
          <div>
            {form.tags.map(tag => (
              <span key={tag.id} style={{ marginRight: 4, background: "#eee", padding: "2px 6px", borderRadius: 4 }}>
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <select
            multiple
            value={form.tags.map(tag => tag.id)}
            onChange={handleTagChange}
          >
            {allTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        )}
      </div>
      {!readOnly && (
        <button type="submit" style={{ marginTop: 10 }}>
          Save
        </button>
      )}
      {readOnly && onEdit && (
        <button type="button" style={{ marginTop: 10 }} onClick={onEdit}>
          Edit
        </button>
      )}
    </form>
  );
}

export default SingleTemplate;
