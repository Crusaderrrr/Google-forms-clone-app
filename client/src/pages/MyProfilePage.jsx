import React, { useEffect, useState } from "react";
import MyProfileInfo from "../components/MyProfileInfo";
import FormSection from "../components/form/FormSection";
import TemplateSection from "../components//template/TemplateSection";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useApp } from "../context/AppContext";

function MyProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("templates");
  const { role, userId } = useApp();
  const SERVER_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      if (role === "guest") {
        navigate("/login");
        setLoading(false);
      } else {
        try {
          const response = await axios.get(
            `${SERVER_URL}/api/templates/myTemplates`,
            {
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            setTemplates(response.data.templates);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTemplates();

    const fetchForms = async () => {
      setLoading(true);
      if (role === "guest") {
        navigate("/login");
        setLoading(false);
      } else {
        try {
          const response = await axios.get(`${SERVER_URL}/api/forms`, {
            withCredentials: true,
          });
          if (response.status === 200) {
            setForms(response.data.formSectionInfo);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchForms();
  }, [role, navigate]);

  const handleTplSet = () => {
    setActiveSection("templates");
  };

  const handleFormsSet = () => {
    setActiveSection("forms");
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <MyProfileInfo />
          <div className="text-center">
            <div
              className="btn-group w-100"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className={`btn ${
                  activeSection === "templates"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } btn-lg w-100`}
                onClick={handleTplSet}
              >
                {t("myProfile.templates")}
              </button>
              <button
                type="button"
                className={`btn ${
                  activeSection === "forms"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } btn-lg w-100`}
                onClick={handleFormsSet}
              >
                {t("myProfile.forms")}
              </button>
            </div>
          </div>
          <hr className="my-4" />
          <div>
            {activeSection === "templates" && (
              <TemplateSection
                title={t("myProfile.myTemplates")}
                templates={templates}
                loading={loading}
              />
            )}
            {activeSection === "forms" && (
              <FormSection title={t("myProfile.myForms")} forms={forms} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
