import React, { useEffect, useRef } from "react";
import QuestionsList from "../questions DnD/QuestionsList";

function QuestionsForm({ t, questionForm, handlers }) {
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
    } = questionForm;

    const {
        handleAddOrEditQuestion,
        handleQuestionEdit,
        handleQuestionDelete
    } = handlers;

    const menuRef= useRef(null);
    const addFormRef = useRef(null);

    useEffect(() => {
        if (activeQuestionId && menuRef.current) {
            menuRef.current.focus();
        }
        if (showAddQuestionForm && addFormRef.current) {
            addFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [activeQuestionId, showAddQuestionForm]);

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
                <h4 className="mb-0 me-3">{t('template.questions.title')}</h4>
                <span className="text-muted me-auto mt-1">{t('template.questions.doubleClick')}</span>
                {!readOnly && (
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowAddQuestionForm(f => !f)}
                        disabled={questions.length >= 12}
                    >
                        {t('template.questions.add')}
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
                <>
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{
                            zIndex: 1049,
                            background: "rgba(0,0,0,0.3)",
                            backdropFilter: "blur(2px)"
                        }}
                    />
                    <div
                        ref={menuRef}
                        tabIndex={-1}
                        className="position-fixed top-50 start-50 translate-middle rounded shadow p-4 bg-dark"
                        style={{
                            width: 250,
                            zIndex: 1050
                        }}
                    >
                        <h5 className="mb-2 text-center text-primary">
                            {t('template.questions.edit')}
                        </h5>
                        <h6 className="text-center mb-2">{t('template.questions.cancel')}</h6>
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-info"
                                onClick={() => {
                                    handleQuestionEdit(activeQuestionId);
                                    setActiveQuestionId(null);
                                }}
                            >
                                {t('template.questions.editB')}
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    handleQuestionDelete(activeQuestionId);
                                    setActiveQuestionId(null);
                                }}
                            >
                                {t('template.questions.deleteB')}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {!readOnly && showAddQuestionForm && (
                <div className="card p-3 mt-2" ref={addFormRef}>
                    <div className="mb-2 text-start">
                        <label className="mb-1 ms-2 fw-bold">{t('template.questions.type')}</label>
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
                        <label className="mb-1 fw-bold ms-2">{t('template.questions.qTitle')}</label>
                        <input
                            className="form-control"
                            value={newQuestion.title}
                            onChange={e => setNewQuestion(q => ({ ...q, title: e.target.value }))}
                        />
                    </div>
                    <div className="mb-2 text-start">
                        <label className="mb-1 ms-2 fw-bold">{t('template.questions.description')}</label>
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
                        <label className="form-check-label fw-bold ms-1">{t('template.questions.show')}</label>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleAddOrEditQuestion}
                        disabled={!newQuestion.title}
                    >
                        {editingQuestionId ? t('template.questions.save') : t('template.questions.addB')}
                    </button>
                </div>
            )}
        </>
    )
};

export default QuestionsForm;