import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";

function Likes({ likes, onToggleLike }) {
  const { userId } = useApp();
  const isLikedByUser = likes.some((l) => l.authorId === Number(userId));

  return (
    <div className="text-center mb-2">
      <div
        className='text-danger d-inline fs-3 ms-2'
        style={{ cursor: "pointer" }}
        onClick={onToggleLike}
      >
        <i className={isLikedByUser ? "bi bi-heart-fill" : "bi bi-heart"}></i>
      </div>
      <div className="d-inline fs-2 ms-2">{likes.length}</div>
    </div>
  );
}

export default Likes;
