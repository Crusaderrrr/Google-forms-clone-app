import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Template from "../components/template/Template";
import TemplateFill from "../components/template/TemplateFill";
import FormView from "../components/form/FormView";
import { useApp } from "../context/AppContext.js";
import axios from "axios";
import { useTranslation } from "react-i18next";

const SERVER_URL = import.meta.env.VITE_API_URL;

const emptyTemplate = {
  id: "",
  title: "",
  description: "",
  topic: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
  authorId: "",
  questions: [],
  imageUrl: "",
  access: "",
  allowedUsers: [],
  comments: [],
  likes: null
};

function TemplatePage() {
  const {t} = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userId, isAdmin } = useApp();
  const topRef = useRef();

  const isCreate = location.pathname === "/template/create";
  const isGuest = role === "guest";
  const [mode, setMode] = useState(() => {
    if (isGuest) return "view";
    if (isCreate) return "create";
    if (location.state && location.state.mode === "formView") return "formView";
    if (location.state && location.state.mode === "formEdit") return "formEdit";
    return "view";
  });
  const [readOnly, setReadOnly] = useState(() => {if (mode === 'view') return true; else return false});
  const [template, setTemplate] = useState(emptyTemplate);
  const [answers, setAnswers] = useState(() => {
    if (location.state && mode === "formEdit") {
      return location.state.answers;
    } else {
      return [];
    }
  });
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [alertMessage, setAlertMassage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const canEdit =
    isAdmin === true || Number(userId) === Number(template.authorId);
  const questionTypes = {
    singleLine: t('template.questions.singleLine'),
    multiLine: t('template.questions.multi'),
    integer: t('template.questions.int'),
    checkbox: t('template.questions.check'),
  };

  useEffect(() => {
    if (alertMessage && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
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
          `${SERVER_URL}/api/templates/${id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setTemplate(response.data.template);
          setComments(response.data.template.comments);
          setLikes(response.data.template.likes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id && ['view', 'formEdit'].includes(mode)) {
      fetchAndSetTemplate(id);
    }
  }, [mode, id, location]);

  const handleSubmit = async (templateData) => {
    setLoading(true);
    const formData = new FormData();
    console.log("Saving template:", templateData);
    formData.append("title", templateData.title);
    formData.append("description", templateData.description);
    formData.append("topic", templateData.topic);
    formData.append("tags", JSON.stringify(templateData.tags));
    formData.append("questions", JSON.stringify(templateData.questions));
    formData.append("allowedUsers", JSON.stringify(templateData.allowedUsers.map(user => user.id)));
    formData.append("access", templateData.access);
    if (templateData.imageFile) {
      formData.append("image", templateData.imageFile);
    }
    if (mode === "create") {
      try {
        const response = await axios.post(
          `${SERVER_URL}/api/templates/create`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          console.log("Template Created successfully");
          navigate("/myProfile");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else if (mode === "edit") {
      try {
        const response = await axios.put(
          `${SERVER_URL}/api/templates/${template.id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          console.log("Template updated successfully");
          setMode("view");
          navigate(`/template/${response.data.template.id}`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (answers) => {
    setButtonLoading(true);
    if (mode === "fill") {
      try {
        const templateId = template.id;
        const response = await axios.post(
          `${SERVER_URL}/api/forms/create`,
          { templateId, answers },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setAlertMassage("Form submitted successfully!");
          setAlertType("success");
        } else {
          setAlertMassage("Error submitting form");
          setAlertType("danger");
        }
      } catch (err) {
        console.error(err);
        setAlertMassage("Error when submitting form");
        setAlertType("danger");
      } finally {
        setButtonLoading(false);
      }
    }
    if (mode === "formEdit") {
      try {
        console.log(answers);
        const response = await axios.put(
          `${SERVER_URL}/api/forms/update`,
          { newAnswers: answers },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setAlertMassage("Form updated successfully");
          setAlertType("success");
        } else {
          setAlertMassage("Error when updating form");
          setAlertType("danger");
        }
      } catch (err) {
        console.error(err);
        setAlertMassage("Error when updating form");
        setAlertType("danger");
      } finally {
        setButtonLoading(false);
      }
    }
  };
  
  return (
    <div className="container-lg">
      <div className="row">
        <div className="col justify-content-center text-center">
          <h2>
            {/* {TODO: add localization i18n} */}
            {mode === "create" && t('template.create')}
            {mode === "edit" && t('template.edit')}
          </h2>
          <div className="container-lg mt-4">
            {alertMessage && (
              <div
                className={`alert ${
                  alertType === "success" ? "alert-success" : "alert-danger"
                } alert-dismissible fade show`}
                role="alert"
                ref={topRef}
              >
                {alertMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setAlertMassage("")}
                ></button>
              </div>
            )}

            {mode === "formView" && (
              <FormView questionTypes={questionTypes} mode={mode} />
            )}
            {["formEdit", "view", "fill"].includes(mode) && (
              <TemplateFill
                t={t}
                readOnly={readOnly}
                setReadOnly={setReadOnly}
                mode={mode}
                setMode={setMode}
                template={template}
                comments={comments}
                setComments={setComments}
                likes={likes}
                setLikes={setLikes}
                formAnswers={answers}
                onSubmit={handleFormSubmit}
                onEdit={() => {
                  setMode("edit");
                }}
                showEditButton={canEdit && mode === "view"}
                questionTypes={questionTypes}
                loading={loading}
                buttonLoading={buttonLoading}
              />
            )}
            {["create", "edit"].includes(mode) && (
              <Template
                t={t}
                mode={mode}
                initialValues={template}
                onSubmit={handleSubmit}
                onEdit={() => {
                  setMode("edit");
                }}
                showEditButton={canEdit && mode === "view"}
                loading={buttonLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePage;
