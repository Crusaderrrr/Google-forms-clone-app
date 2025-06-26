import React, { useEffect, useRef } from "react";
import QuestionsList from "../questions DnD/QuestionsList";

function QuestionsForm({ questionForm, handlers }) {
    const {
        questions,
        setQuestions,
        newQuestion,
        setNewQuestion,
        showAddQuestionForm,
        setShowAddQuestionForm,
        editingQuestionId,
        activeQuestionId,
        setActiveQuestionId,
        questionTypes,
        mode,
        readOnly,
        menuPosition
    } = questionForm;

    const {
        handleAddOrEditQuestion,
        handleQuestionDoubleClick,
        handleQuestionEdit,
        handleQuestionDelete
    } = handlers;

    const menuRef= useRef(null);

    useEffect(() => {
        if (activeQuestionId && menuRef.current) {
            menuRef.current.focus();
        }
    }, [activeQuestionId]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveQuestionId(null);
            }
        }
        if (activeQuestionId) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeQuestionId, setActiveQuestionId]);

    return (
        <>
            <div className="mt-4 mb-3 d-flex justify-content-between align-items-center position-relative">
                <h4 className="mb-0 me-3">Questions</h4>
                <span className="text-muted me-auto mt-1">{'(Double click to modify)'}</span>
                {!readOnly && (
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowAddQuestionForm(f => !f)}
                        disabled={questions.length >= 12}
                    >
                        Add Question
                    </button>
                )}
            </div>

            <QuestionsList
                questions={questions}
                setQuestions={setQuestions}
                activeQuestionId={activeQuestionId}
                setActiveQuestionId={setActiveQuestionId}
                disabled={mode === "view"}
                qTypes={questionTypes}
                onEdit={handleQuestionEdit}
                onDelete={handleQuestionDelete}
            />

            {activeQuestionId && (
                <div
                    ref={menuRef}
                    tabIndex={-1}
                    className="position-fixed top-50 start-50 translate-middle rounded shadow p-2"
                    style={{
                        width: 220,
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
        </>
    )
};

export default QuestionsForm;