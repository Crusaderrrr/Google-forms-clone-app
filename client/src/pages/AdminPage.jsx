import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "../components/UserTable";
import UserProfile from "../components/UserProfile";
import axios from "axios";
import { useApp } from "../context/AppContext.js";
import { useTranslation } from "react-i18next";

function AdminPage() {
  const [activeSection, setActiveSection] = useState("table");
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const { isAdmin, loadingContext, userId } = useApp();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const SERVER_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log(isAdmin);
    if (!loadingContext && !isAdmin) {
      navigate("/main");
    }
  }, [isAdmin, loadingContext, navigate]);

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/users`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUsers(response.data.users);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAndSetUserInfo = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/users/${activeUserId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUserInfo(response.data);
          setActiveSection("user");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (activeSection === "table") {
      fetchAndSetUsers();
    }
    if (activeUserId) {
      fetchAndSetUserInfo();
    }
  }, [activeUserId]);

  const showUserProfile = (id) => {
    setActiveUserId(id);
  };

  const handleMakeAdmin = async (ids) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/makeAdmin`,
        { ids },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAdmin = async (ids) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/removeAdmin`,
        { ids, userId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockUsers = async (ids) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/block`,
        { ids },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlockUsers = async (ids) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/users/unblock`,
        { ids },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUsers = async (ids) => {
    try {
      const response = await axios.delete(
        `${SERVER_URL}/api/users/delete`,
        {
          data: ids,
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {activeSection === "table" && (
        <UserTable
          t={t}
          users={users}
          onUserClick={(id) => showUserProfile(id)}
          onMakeAdmin={handleMakeAdmin}
          onRemoveAdmin={handleRemoveAdmin}
          onBlock={handleBlockUsers}
          onUnblock={handleUnlockUsers}
          onDelete={handleDeleteUsers}
        />
      )}
      {activeSection === "user" && (
        <UserProfile
          t={t} 
          userInfo={userInfo}
          setActiveAdminPageSection={setActiveSection}
          setActiveUser={setActiveUserId}
        />
      )}
    </>
  );
}

export default AdminPage;
