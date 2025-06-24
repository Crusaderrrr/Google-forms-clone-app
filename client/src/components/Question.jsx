import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";

function Question({ id, question, disabled, onDoubleClick, qTypes }) {
   const cardRef = useRef(null);

  const handleDoubleClick = () => {
    if (disabled) return;
    const rect = cardRef.current.getBoundingClientRect();
    onDoubleClick(id, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
  };

  const combinedRef = node => {
    setNodeRef(node);
    cardRef.current = node;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "default" : "grab",
    boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,0.10)" : "none"
  };

  return (
    <div
      ref={combinedRef}
      style={style}
      className={`card mb-2 ${isDragging ? 'border-primary' : ''}`}
      {...attributes}
      {...(!disabled ? listeners : {})}
      tabIndex={0}
      onDoubleClick={handleDoubleClick}
    >
      <div className="card-body py-2 px-3">
        <h5 className="card-title mb-3">
            <strong style={{fontSize: '1.1rem'}}>{question.title}</strong>
        </h5>
        <h6 className="card-subtitle">
          <p className="badge bg-secondary ms-2" style={{fontSize: '0.9rem'}}>{qTypes[question.type]}</p>
        </h6>
        {question.description && (
            <p className="card-text mb-0 text-secondary">{question.description}</p>
        )}
      </div>
    </div>
  );
}

export default Question;
