import React, { useState, useEffect } from "react";
import TitleForm from "./template forms/TitleForm";
import ImageForm from "./template forms/ImageForm";
import DescriptionForm from "./template forms/DescriptionForm";
import AccessForm from "./template forms/AccessSettingsForm";
import TopicForm from "./template forms/TopicForm";
import TagsForm from "./template forms/TagsForm";
import QuestionsForm from "./template forms/QuestionsForm";

function Template({ t, mode, initialValues, onSubmit, loading }) {
  const [template, setTemplate] = useState(initialValues);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [access, setAccess] = useState(initialValues.access || "public");
  const [allowedUsers, setAllowedUsers] = useState(initialValues.allowedUsers || []);
  const [tags, setTags] = useState(initialValues.tags || []);
  const [questions, setQuestions] = useState(initialValues.questions || []);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0,
    height: 0,
  });
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const definedTopics = ["Education", "Quiz", ""];
  const [newQuestion, setNewQuestion] = useState({
    type: "singleLine",
    title: "",
    description: "",
    showInTable: true,
    enabled: true,
  });

  const questionTypes = {
    singleLine: t('template.questions.singleLine'),
    multiLine: t('template.questions.multi'),
    integer: t('template.questions.int'),
    checkbox: t('template.questions.check'),
  };

  useEffect(() => {
    setTemplate((prev) => {
      if (initialValues.topic && !definedTopics.includes(initialValues.topic)) {
        return {
          ...initialValues,
          customTopic: initialValues.topic,
        };
      }
      return {
        ...initialValues,
        customTopic: initialValues.customTopic || "",
      };
    });
    setQuestions(initialValues.questions || []);
    setTags(initialValues.tags || []);
    setImagePreview(initialValues.imageUrl || "");
  }, [initialValues]);

  const readOnly = mode === "view";

  const handleAccessChange = (e) => {
    setAccess(e.target.value);
  };

  const handleDeleteAllowed = (id) => {
    setAllowedUsers(allowedUsers.filter((user) => user.id !== id));
  };

  const handleCustomTopicChange = (e) => {
    setTemplate((prev) => ({ ...prev, customTopic: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
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
    if (template.customTopic && !definedTopics.includes(template.topic)) {
      topicToSend = template.customTopic;
    }
    if (onSubmit)
      onSubmit({
        title: template.title,
        description: template.description,
        topic: topicToSend,
        questions,
        tags,
        imageFile,
        access,
        allowedUsers,
      });
  };

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleAddOrEditQuestion = () => {
    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId ? { ...q, ...newQuestion } : q
        )
      );
    } else {
      setQuestions((prev) => [
        ...prev,
        {
          ...newQuestion,
          id: Date.now(),
          order: prev.length + 1,
        },
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

  const handleQuestionDoubleClick = (questionId, position) => {
    setMenuPosition({
      left: position.left,
      top: position.top,
    });
    setActiveQuestionId(questionId);
  };

  const handleQuestionDelete = (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setActiveQuestionId(null);
  };

  const handleQuestionEdit = (questionId) => {
    const questionToEdit = questions.find((q) => q.id === questionId);
    setNewQuestion({
      type: questionToEdit.type,
      title: questionToEdit.title,
      description: questionToEdit.description,
      showInTable: questionToEdit.showInTable,
      enabled: questionToEdit.enabled,
      id: questionToEdit.id,
      order: questionToEdit.order,
    });
    setEditingQuestionId(questionId);
    setShowAddQuestionForm(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TitleForm
        t={t}
        title={template.title}
        handleChange={handleChange}
        readOnly={readOnly}
      />

      <ImageForm
        t={t}
        handleChange={handleImageChange}
        readOnly={readOnly}
        imagePreview={imagePreview}
      />

      <AccessForm
        t={t}
        access={access}
        setAllowedUsers={setAllowedUsers}
        allowedUsers={allowedUsers}
        handleChange={handleAccessChange}
        handleDeleteAllowed={handleDeleteAllowed}
        readOnly={false}
      />

      <DescriptionForm
        t={t}
        description={template.description}
        handleChange={handleChange}
        readOnly={readOnly}
      />

      <TopicForm
        t={t}
        mode={mode}
        topic={template.topic}
        customTopic={template.customTopic}
        handleChange={handleChange}
        handleCustomTopicChange={handleCustomTopicChange}
        readOnly={readOnly}
        definedTopics={definedTopics}
      />

      <TagsForm
        t={t}
        tags={tags}
        setTags={setTags}
        handleDeleteTag={handleDeleteTag}
        readOnly={readOnly}
      />

      <QuestionsForm
        t={t}
        questionForm={{
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
          menuPosition,
        }}
        handlers={{
          handleAddOrEditQuestion,
          handleQuestionDoubleClick,
          handleQuestionEdit,
          handleQuestionDelete,
        }}
      />
      {loading === true ? (
        <button className="btn btn-success py-2 mb-4 mt-4" type="button" disabled>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          {mode === "create" ? t('template.saving') : t('template.updating')}
        </button>
      ) : (
        <button
          className="btn btn-success px-4 mb-4 mt-4"
          type="submit"
          disabled={questions.length === 0}
        >
          {mode === "create" ? t('template.save') : t('template.update')}
        </button>
      )}
    </form>
  );
}

export default Template;
