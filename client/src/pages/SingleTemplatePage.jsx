import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SingleTemplate from "../components/template/SingleTemplate";
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

function SingleTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {role} = useApp();

  const isCreate = location.pathname === "/template/create";
  const isGuest = role === "guest";
  const [mode, setMode] = useState(
    isGuest ? "view" : (isCreate ? "create" : "view")
  );
  const [template, setTemplate] = useState(emptyTemplate);
  const canEdit = !isGuest || role === "admin";

  useEffect(() => {
    if (isGuest && mode !== "view") {
      setMode("view");
    }

    async function fetchAndSetTemplate(id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/templates/${id}`, { withCredentials: true });
          if (response.status === 200) {
            setTemplate(response.data.template);
            console.log(response.data.template)
          }
      } catch (err) {
        console.error(err);
      }
 
    }

    if (id) {
      fetchAndSetTemplate(id);
    }
  }, [id]);

  const handleCreate = async (templateData) => {
    console.log("Saving template:", templateData);
    const formData = new FormData();
    formData.append('title', templateData.title);
    formData.append('description', templateData.description);
    formData.append('topic', templateData.topic);
    formData.append('tags', JSON.stringify(templateData.tags));
    formData.append('questions', JSON.stringify(templateData.questions));

    if (templateData.imageFile) {
      formData.append('image', templateData.imageFile);
    }
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-lg">
      <div className="row">
        <div className="col justify-content-center text-center">
          <h2> 
            {/* {TODO: add localization i18n} */}
            {mode === "create" && "Create Template"}
            {mode === "edit" && "Edit Template"}  
            {mode === "view" && "View Template"}
          </h2>
          <div className="container-lg mt-4">
          <SingleTemplate
            mode={mode}
            initialValues={template}
            onSubmit={handleCreate}
            onEdit={() => {setMode('edit')}}
            showEditButton = {canEdit && mode === 'view'}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default SingleTemplatePage;
