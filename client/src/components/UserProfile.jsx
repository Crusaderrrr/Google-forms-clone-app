import React, { useState } from "react";
import TemplateSection from "./template/TemplateSection";
import FormSection from "../components/form/FormSection";

function UserProfile({ t, userInfo, setActiveAdminPageSection, setActiveUser }) {
  const [activeSection, setActiveSection] = useState("templates");

  return (
    <div className="container-lg">
      <div className="row">
        <div className="col">
          <div className="d-flex flex-row justify-content-evenly mt-4 border border-4 border-primary rounded-4 py-3">
            <h3>{t('template.access.name')}: {userInfo.name}</h3>
            <h3>Email: {userInfo.email}</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                setActiveAdminPageSection("table");
                setActiveUser(null);
              }}
            >
              {t('admin.uM')}
            </button>
          </div>
          <div
            className="btn-group w-100 mt-3 mb-3"
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
              onClick={() => setActiveSection('templates')}
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
              onClick={() => setActiveSection('forms')}
            >
              {t("myProfile.forms")}
            </button>
          </div>
          {activeSection === "templates" && (
            <TemplateSection
              title={t('admin.templates')}
              templates={userInfo.templates}
              isMain={false}
            />
          )}
          {activeSection === "forms" && <FormSection title={t('admin.forms')} forms={userInfo.forms}/>}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
