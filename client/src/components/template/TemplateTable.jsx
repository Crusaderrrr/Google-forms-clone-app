import React, { useState } from "react";

function TemplateTable({ navigate, templates }) {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Author</th>
          <th scope="col">Created date</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((t, index) => (
          <tr 
            key={t.id} 
            style={{ cursor: 'pointer'}}
            onClick={() => navigate(`/template/${t.id}`, { state: { mode: "view" } })}
        >
            <th scope="row">{index + 1}</th>
            <td>{t.title}</td>
            <td>{t.author.name}</td>
            <td>{t.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TemplateTable;
