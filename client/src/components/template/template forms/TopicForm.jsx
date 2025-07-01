import React, { useState, useEffect } from "react";

function TopicForm({ t, mode, topic, customTopic, handleChange, handleCustomTopicChange, readOnly, definedTopics }) {

    return (
        <>
            <div className="mb-3 text-start">
                <label className="form-label fw-bold">{t('template.topic.title')}</label>
                <select
                    name="topic"
                    className="form-select"
                    value={topic}
                    onChange={handleChange}
                    disabled={readOnly}
                    required
                >
                    <option value="">{t('template.topic.select')}</option>
                    <option value="Education">{t('template.topic.education')}</option>
                    <option value="Quiz">{t('template.topic.quiz')}</option>
                    <option value="Other">{t('template.topic.other')}</option>
                </select>
            </div>
            {(topic === "Other") || (mode === 'edit' && !definedTopics.includes(topic)) ? (
                <div className="mb-3 text-start">
                    <label className="form-label fw-bold">{t('template.topic.custom')}</label>
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