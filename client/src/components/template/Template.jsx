import React, { useState, useEffect } from "react";
import TitleForm from './template forms/TitleForm';
import ImageForm from "./template forms/ImageForm";
import DescriptionForm from "./template forms/DescriptionForm";
import TopicForm from "./template forms/TopicForm";
import TagsForm from "./template forms/TagsForm";
import QuestionsForm from "./template forms/QuestionsForm";

function Template({ mode, initialValues, onSubmit }) {
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
  const definedTopics = ["Education", "Quiz", ""];
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
    setTemplate(prev => {
      if (initialValues.topic && !definedTopics.includes(initialValues.topic)) {
        return {
          ...initialValues,
          customTopic: initialValues.topic
        };
      }
      return {
        ...initialValues,
        customTopic: initialValues.customTopic || ""
      };
    });
    setQuestions(initialValues.questions || []);
    setTags(initialValues.tags || []);
    setImagePreview(initialValues.imageUrl || "");
  }, [initialValues]);

  const readOnly = mode === "view";

  const handleCustomTopicChange = (e) => {
    setTemplate(prev => ({ ...prev, customTopic: e.target.value}))
  };

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
    if (template.customTopic && !definedTopics.includes(template.topic)) {
      topicToSend = template.customTopic;
    }
    if (onSubmit) onSubmit({ title: template.title, description: template.description, topic: topicToSend, questions, tags, imageFile});
  };

  const handleAddTag = () => {
    const name = tagInput.trim();
    if (!name) return;
    if (tags.some(tagObj => tagObj.tag.name.toLowerCase() === name.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags(prev => [...prev, { id: Date.now(), tag: { id: Date.now(), name: name } }]);
    setTagInput("");
  };

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleAddOrEditQuestion = () => {
    if (editingQuestionId) {
      setQuestions(prev =>
        prev.map(q => q.id === editingQuestionId ? { ...q, ...newQuestion } : q)
      );
    } else {
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

  const handleQuestionDoubleClick = (questionId, position) => {
    setMenuPosition({
      left: position.left,
      top: position.top,
    });
    setActiveQuestionId(questionId);
  };

  const handleQuestionDelete = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setActiveQuestionId(null);
  };

  const handleQuestionEdit = (questionId) => {
    const questionToEdit = questions.find(q => q.id === questionId);
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
        title={template.title} 
        handleChange={handleChange} 
        readOnly={readOnly}
      />

      <ImageForm 
        handleChange={handleImageChange} 
        readOnly={readOnly} 
        imagePreview={imagePreview}
      />

      <DescriptionForm
        description={template.description} 
        handleChange={handleChange} 
        readOnly={readOnly}
      />

      <TopicForm 
        mode={mode}
        topic={template.topic}
        customTopic={template.customTopic} 
        handleChange={handleChange}
        handleCustomTopicChange={handleCustomTopicChange} 
        readOnly={readOnly}
        definedTopics={definedTopics}
      />

      <TagsForm 
        tags={tags} 
        tagInput={tagInput} 
        handleAddTag={handleAddTag} 
        handleDeleteTag={handleDeleteTag}
        setTagInput={setTagInput} 
        readOnly={readOnly}
      />

      <QuestionsForm
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
          menuPosition
        }}
        handlers={{
          handleAddOrEditQuestion,
          handleQuestionDoubleClick,
          handleQuestionEdit,
          handleQuestionDelete
        }}
      />

      {!readOnly && (
        <button
          type="submit"
          className="btn btn-success mt-3 mb-3 px-4"
        >
          {mode === "create" ? "Save" : "Update"}
        </button>
      )}
    </form>
  );
}

export default Template;