import React from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Question from "./Question"; 

function QuestionsList({ questions, setQuestions, disabled, activeQuestionId, setActiveQuestionId, qTypes, onEdit, onDelete }) {
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      setQuestions((prev) =>
        arrayMove(prev, oldIndex, newIndex).map((q, idx) => ({
          ...q,
          order: idx + 1,
        }))
      );
    }
  };

  return (
    <div className="questions-list mt-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question) => (
            <Question
              key={question.id}
              id={question.id}
              question={question}
              disabled={disabled}
              activeQuestionId={activeQuestionId}
              setActiveQuestionId={setActiveQuestionId}
              qTypes={qTypes}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default QuestionsList;
