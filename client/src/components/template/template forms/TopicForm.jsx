import React, { useState, useEffect } from "react";

function TopicForm({ mode, topic, customTopic, handleChange, handleCustomTopicChange, readOnly, definedTopics }) {

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
            {(topic === "Other") || (mode === 'edit' && !definedTopics.includes(topic)) ? (
                <div className="mb-3 text-start">
                    <label className="form-label fw-bold">Custom Topic</label>
                    <input
                        name="customTopic"
                        type="text"
                        className="form-control"
                        value={customTopic || ""}
                        onChange={handleCustomTopicChange}
                        readOnly={readOnly}
                        required
                    />
                </div>
            ): null}
        </>
    );
}

export default TopicForm;