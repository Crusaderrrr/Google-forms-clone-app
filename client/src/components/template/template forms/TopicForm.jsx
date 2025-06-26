import React from "react";

function TopicForm ({ topic, customTopic, handleChange, readOnly }) {


    return (
        <>
        <div className="mb-3 text-start">
        <label className="form-label fw-bold">Topic</label>
        <select
            name="topic"
            className="form-select"
            value={topic}
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
        {topic === "Other" && (
            <div className="mb-3 text-start">
                <label className="form-label fw-bold">Custom Topic</label>
                <input
                    name="customTopic"
                    type="text"
                    className="form-control"
                    value={customTopic || ""}
                    onChange={handleChange}
                    readOnly={readOnly}
                    required
                />
            </div>
        )}
      </>
    )
};

export default TopicForm;