import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Template from "../components/template/Template";
import TemplateFill from "../components/template/TemplateFill";
import { useApp } from '../context/AppContext';
import axios from 'axios';

const emptyTemplate = {
  id: "",
  title: "",
  description: "",
  topic: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
  userId: "",
  questions: [],
  imageUrl: ''
};

function TemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {role, userId} = useApp();

  const isCreate = location.pathname === "/template/create";
  const isGuest = role === "guest";
  const [mode, setMode] = useState(
    isGuest ? "view" : (isCreate ? "create" : "view")
  );
  const [template, setTemplate] = useState(emptyTemplate);
  const canEdit = (role === "admin") || (Number(userId) === Number(template.authorId));

  useEffect(() => {
    if (isGuest && mode !== "view") {
      setMode("view");
    }

    async function fetchAndSetTemplate(id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/templates/${id}`, { withCredentials: true });
          if (response.status === 200) {
            setTemplate(response.data.template);
          }
      } catch (err) {
        console.error(err);
      }
 
    }

    if (id) {
      fetchAndSetTemplate(id);
    }
  }, [mode, id]);

  const handleSubmit = async (templateData) => {
    const formData = new FormData();
    console.log("Saving template:", templateData);
    formData.append('title', templateData.title);
    formData.append('description', templateData.description);
    formData.append('topic', templateData.topic);
    formData.append('tags', JSON.stringify(templateData.tags));
    formData.append('questions', JSON.stringify(templateData.questions));
    if (templateData.imageFile) {
      formData.append('image', templateData.imageFile);
    }
    if (mode === 'create') {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/templates/create', 
          formData, 
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        if (response.status === 201) {
          console.log('Template Created successfully')
          navigate('/myProfile');
        }
      } catch (err) {
        console.error(err);
      }
    } else if (mode === 'edit') {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/templates/${template.id}`,
          formData,
          { withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        if (response.status === 200) {
          console.log('Template updated successfully');
          setMode('view');
          navigate(`/template/${response.data.template.id}`);
        }
      } catch (err) {
        console.error(err)
      }
    }
  };

  const handleFormSubmit = async () => {

  };

  return (
    <div className="container-lg">
      <div className="row">
        <div className="col justify-content-center text-center">
          <h2> 
            {/* {TODO: add localization i18n} */}
            {mode === "create" && "Create Template"}
            {mode === "edit" && "Edit Template"}  
          </h2>
          <div className="container-lg mt-4">
          {mode === "view" ? (
            <TemplateFill 
              template={template} 
              onSubmit={handleFormSubmit}
              onEdit={() => {setMode('edit')}}
              showEditButton={canEdit && mode === 'view'}  
            />
          ) : (
            <Template
              mode={mode}
              initialValues={template}
              onSubmit={handleSubmit}
              onEdit={() => {setMode('edit')}}
              showEditButton={canEdit && mode === 'view'}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePage;
