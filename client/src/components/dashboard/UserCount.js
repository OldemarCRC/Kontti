import React from 'react';
import './user_count.css';

const UserCount = ({ count }) => {
  return (
    <div className="user-count">
      <h2 className="user-count-title">Usuarios Activos</h2>
      <p className="user-count-value">{count}</p>
    </div>
  );
};

export default UserCount;