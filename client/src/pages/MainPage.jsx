import React, { useState, useEffect } from "react";
import TemplateSection from "../components/template/TemplateSection";
import TagsCloud from "../components/TagsCloud";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [tags, setTags] = useState([]);

  const isMain = location.pathname === "/main";

  useEffect(() => {
    setLoading(true);
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/templates/latest",
          { withCredentials: true }
        );

        if (response.status === 200) {
          setTemplates(response.data.templates);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tags/all");

        if (response.status === 200) {
          setTags(response.data.tags);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
    fetchTags();
  }, []);

  const tagCloudData = tags.map((tag) => ({
    value: tag.name,
    count: 1,
    key: tag.id,
  }));

  return (
    <>
      <div className="container-fluid mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h4 className="display-5 mb-3">{t("main.latest")}</h4>
            <TemplateSection
              templates={templates}
              isMain={isMain}
              loading={loading}
            />
            <hr className="my-4" />
            <h4 className="display-5 mb-4">{t('main.tags')}</h4>
            <TagsCloud tags={tagCloudData} onTagClick={(tag) => alert(tag.value)} />
            <hr className="my-4" />
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;