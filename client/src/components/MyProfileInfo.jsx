import React, { useEffect } from "react";
import { useApp } from "../context/AppContext.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";

function MyProfileInfo() {
  const { email, name, profileImg } = useApp();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [expandedToken, setExpandedToken] = useState(false);
  const [token, setToken] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const SERVER_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: email,
  });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateJWT = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/jwt/create`, {
        withCredentials: true,
      });
      if (response.status === 201) {
        setToken(response.data.token);
        setExpandedToken(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopySuccess(<i className="bi bi-check2"></i>);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  const handleCRMCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/sf/create-record`,
        formData
      );
      if (response.status === 201) {
        setAlertMessage("Account creation successful!");
        setAlertType("success");
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("Error during creating CRM account");
      setAlertType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex align-items-center">
          <img
            src={profileImg}
            alt="Profile"
            className="rounded-circle me-4"
            width="80"
            height="80"
          />
          <div>
            <h5 className="card-title mb-1">{name}</h5>
            <p className="card-text text-muted mb-0">{email}</p>
          </div>
          <div className="ms-auto me-3 d-flex flex-column align-items-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsExpanded(true);
                setFormData((prev) => ({
                  ...prev,
                  email: email,
                  firstName: name,
                }));
              }}
            >
              {t("myProfile.crm")}
            </button>
            <button className="btn btn-info mt-2" onClick={handleCreateJWT}>
              Generate JWT for Odoo
            </button>
          </div>
        </div>
      </div>
      {expandedToken && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 1049,
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setExpandedToken(false)}
          />
          <div
            className="position-fixed top-50 start-50 translate-middle rounded shadow bg-light p-4"
            style={{ zIndex: 1050, width: "90%", maxWidth: "500px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title">Your API Token</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setExpandedToken(false)}
              ></button>
            </div>
            <p className="text-muted small">
              Use this token to authenticate with external services like Odoo.
            </p>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={token}
                readOnly
              />
              <button
                className={`btn ${
                  copySuccess ? "btn-success" : "btn-outline-secondary"
                }`}
                type="button"
                onClick={handleCopyToken}
              >
                {copySuccess ? copySuccess : "Copy"}
              </button>
            </div>
          </div>
        </>
      )}
      {isExpanded && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 1049,
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            className="position-fixed top-50 start-50 translate-middle rounded shadow bg-light"
            style={{ zIndex: 1050 }}
            tabIndex={-1}
          >
            <div className="d-flex flex-row-reverse">
              <button
                className="btn btn-sm border border-2 rounded me-2 mt-2"
                onClick={() => setIsExpanded(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            {alertMessage && (
              <div
                className={`alert ${
                  alertType === "success" ? "alert-success" : "alert-danger"
                } alert-dismissible fade show my-2 mx-3`}
                role="alert"
              >
                {alertMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setAlertMessage("")}
                ></button>
              </div>
            )}

            <form onSubmit={(e) => handleCRMCreate(e)} className="mx-4 mt-2">
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={handleItemChange}
                  className="form-control"
                  id="companyName"
                  name="companyName"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleItemChange}
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={handleItemChange}
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={handleItemChange}
                  className="form-control"
                  id="phone"
                  name="phone"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleItemChange}
                  className="form-control"
                  id="email"
                  name="email"
                  required
                />
              </div>
              {loading ? (
                <div className="text-center mb-3">
                  <button class="btn btn-success" type="button" disabled>
                    <span
                      className="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creating...
                  </button>
                </div>
              ) : (
                <div className="text-center mb-3">
                  <button className="btn btn-success" type="submit">
                    Create
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default MyProfileInfo;
