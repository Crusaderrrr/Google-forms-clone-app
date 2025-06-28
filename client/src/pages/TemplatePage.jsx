import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Template from "../components/template/Template";
import TemplateFill from "../components/template/TemplateFill";
import FormView from "../components/form/FormView";
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
  const topRef = useRef();

  const isCreate = location.pathname === "/template/create";
  const isGuest = role === "guest";
  const [mode, setMode] = useState(() => {
    if (isGuest) return "view";
    if (isCreate) return "create";
    if (location.state && location.state.mode === 'formView') return 'formView';
    return 'view';
  });
  const [template, setTemplate] = useState(emptyTemplate);
  const [alertMessage, setAlertMassage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const canEdit = (role === "admin") || (Number(userId) === Number(template.authorId));
  const questionTypes = {
      'singleLine': 'Single line answer',
      'multiLine': 'Multi line answer',
      'integer': 'Numeric answer',
      'checkbox': 'Yes / No checkbox answer'
  };

  useEffect(() => {
    if (alertMessage && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [alertMessage]);
  
  useEffect(() => {

    if (isGuest && mode !== "view") {
      setMode("view");
    }

    async function fetchAndSetTemplate(id) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/templates/${id}`, 
          { withCredentials: true }
        );
        if (response.status === 200) {
          setTemplate(response.data.template);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
 
    }

    if (id && mode === 'view') {
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
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (answers) => {
    setButtonLoading(true);
    try {
      const templateId = template.id;
      const response = await axios.post(
        'http://localhost:5000/api/forms/create',
        { templateId, answers },
        { withCredentials: true },
      ) 

      if (response.status === 201) {
        setAlertMassage('Form submitted successfully!');
        setAlertType('success');
      }
    } catch (err) {
      console.error(err);
      setAlertMassage('Error when submitting form');
      setAlertType('danger');
    } finally {
      setButtonLoading(false);
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
          </h2>
          <div className="container-lg mt-4">

            {alertMessage && (
                <div 
                  className={`alert ${alertType === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show`} 
                  role="alert"
                  ref={topRef}
                >
                   {alertMessage}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMassage('')}></button>
                </div>
            )}

            {mode === 'formView' && (
              <FormView 
                questionTypes={questionTypes}
                mode={mode}
              />
            )} 
            {mode === "view" && (
              <TemplateFill 
                template={template} 
                onSubmit={handleFormSubmit}
                onEdit={() => {setMode('edit')}}
                showEditButton={canEdit && mode === 'view'}
                questionTypes={questionTypes}
                loading={loading}  
                buttonLoading={buttonLoading}
              />
            )}
            {['create', 'edit'].includes(mode) && (
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
