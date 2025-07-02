import React, { useState } from "react";

function UserTable({
  t,
  users,
  onBlock,
  onUnblock,
  onDelete,
  onMakeAdmin,
  onRemoveAdmin,
  onUserClick,
}) {
  const [selected, setSelected] = useState([]);

  const handleSelectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected(users.map((user) => user.id));
    }
  };

  const handleSelect = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="container-lg">
      <div className="row">
        <div className="col d-flex flex-column">
          <div className="mt-2 mb-2">
            <h3 className="display-5 text-center mb-3 mt-2">{t('admin.manage')}</h3>
          </div>
          <div>
            <div className="d-flex flex-row mb-2">
              <button
                className="btn btn-success me-1"
                title={t('admin.giveA')}
                onClick={() => onMakeAdmin(selected)}
              >
                <i className="bi bi-person-plus-fill"></i>
              </button>
              <button 
                className="btn btn-danger"
                title={t('admin.remA')}
                onClick={() => onRemoveAdmin(selected)}  
              >
                <i className="bi bi-person-dash-fill"></i>
              </button>
              <div className="ms-auto">
                <button 
                  className="btn btn-primary me-1" 
                  title={t('admin.block')}
                  onClick={() => onBlock(selected)}
                >
                  <i className="bi bi-lock"></i>
                </button>
                <button 
                  className="btn btn-primary me-1" 
                  title={t('admin.unblock')}
                  onClick={() => onUnblock(selected)}
                >
                  <i className="bi bi-unlock"></i>
                </button>
                <button 
                  className="btn btn-danger" 
                  title={t('admin.del')}
                  onClick={() => onDelete(selected)}  
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">
                  <input
                    checked={
                      selected.length === users.length && users.length > 0
                    }
                    type="checkbox"
                    className="form-check mb-0"
                    onChange={() => handleSelectAll()}
                  />
                </th>
                <th scope="col">Id</th>
                <th scope="col">{t('template.access.name')}</th>
                <th scope="col">{t('template.access.email')}</th>
                <th scope="col">{t('admin.stat')}</th>
                <th scope="col">{t('admin.bStat')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{ cursor: "pointer" }}
                  className={selected.includes(user.id) ? "table-primary" : ""}
                  onClick={() => onUserClick(user.id)}
                >
                  <td>
                    <input
                      checked={selected.includes(user.id)}
                      type="checkbox"
                      className="form-check"
                      onChange={() => handleSelect(user.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin === true ? t('admin.admin') : t('admin.user')}</td>
                  <td>
                    {user.isBlocked === true ? (
                      <>
                        {t('admin.blocked')} <i className="bi bi-lock-fill"></i>
                      </>
                    ) : (
                      t('admin.nBlocked')
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
