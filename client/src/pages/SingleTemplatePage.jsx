import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SingleTemplate from "../components/SingleTemplate";

// Dummy tag options (replace with API call)
const tagOptions = [
  { id: 1, name: "React" },
  { id: 2, name: "NodeJS" },
  { id: 3, name: "Prisma" }
];

const emptyTemplate = {
  id: "",
  title: "",
  description: "",
  topic: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
  userId: ""
};

function SingleTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode from URL or state
  const isCreate = location.pathname === "/template/create";
  const [mode, setMode] = useState(isCreate ? "create" : "view");

  const [template, setTemplate] = useState(emptyTemplate);

  // Fetch template if editing or viewing
  useEffect(() => {
    if (!isCreate && id) {
      // Replace with your API call
      fetch(`/api/templates/${id}`)
        .then(res => res.json())
        .then(data => setTemplate(data));
    } else {
      setTemplate(emptyTemplate);
    }
  }, [id, isCreate]);

  // Handle create or update
  const handleSave = (formData) => {
    if (mode === "create") {
      // POST to create
      fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(newTemplate => {
          navigate(`/template/${newTemplate.id}`);
        });
    } else if (mode === "edit") {
      // PUT to update
      fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(updatedTemplate => {
          setTemplate(updatedTemplate);
          setMode("view");
        });
    }
  };

  // Switch to edit mode
  const handleEdit = () => setMode("edit");

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>
        {mode === "create" && "Create Template"}
        {mode === "edit" && "Edit Template"}
        {mode === "view" && "View Template"}
      </h2>
      <SingleTemplate
        mode={mode}
        initialValues={template}
        onSubmit={handleSave}
        onEdit={handleEdit}
        allTags={tagOptions}
      />
      {mode === "view" && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
          Created: {template.createdAt}<br />
          Updated: {template.updatedAt}<br />
          User ID: {template.userId}
        </div>
      )}
    </div>
  );
}

export default SingleTemplatePage;
