import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');
  // const [token, setToken] = useState('');
  const router = useRouter();

 useEffect(() => {
    // This code will only run on the client side
    if (typeof window !== 'undefined') {
      
      // 👇 Change: Declare a new variable to hold the retrieved token
      const localToken = localStorage.getItem('token'); 
      const role = localStorage.getItem('role');
      
      // 👇 Change: Use the setToken function to update the state
      // setToken(localToken);
      setCurrentUserRole(role);

      // Use the newly retrieved 'localToken' for the check and the API call
      if (!localToken) { 
        setError('You must log in to view projects.');
        return;
      }

      axios
        .get('https://activusserver.onrender.com/api/projects/all', {
          // Use 'localToken' for the header immediately
          headers: { Authorization: `Bearer ${localToken}` }, 
        })
        .then((response) => {
          setProjects(response.data.data || []);
          setError('');
        })
        .catch((err) => {
          console.error('Error fetching projects:', err);
          setError('Error fetching projects.');
        });
    }
  }, []); // Empty dependency array means this runs once on mount // Empty dependency array means this runs once on mount

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Projects</h2>
      {error && <p style={styles.error}>{error}</p>}

      {currentUserRole === 'SUPER_ADMIN' && (
        <button
          onClick={() => router.push('/CreateProject')}
          style={styles.createButton}
        >
          + Create Project
        </button>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Project Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created On</th>
            <th style={styles.th}>Stakeholder</th>
            <th style={styles.th}>Team Members</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.projectId} style={styles.tr}>
                <td style={styles.td}>{project.projectName}</td>
                <td style={styles.td}>{project.projectDescription}</td>
                <td style={styles.td}>
                  <span style={styles.activeStatus}>Active</span>
                </td>
                <td style={styles.td}>{formatDate(project.createdAt)}</td>
                <td style={styles.td}>{project.stakeholder?.username || 'N/A'}</td>
                <td style={styles.td}>
                  {project.roleUsers && Object.keys(project.roleUsers).length > 0 ? (
                    <div style={styles.compactRolesContainer}>
                      {Object.entries(project.roleUsers)
                        .sort(([roleA], [roleB]) => roleA.localeCompare(roleB))
                        .map(([role, users]) => (
                          <div key={role} style={styles.compactRoleItem}>
                            <span style={styles.compactRoleName}>{role}: </span>
                            <span style={styles.compactUserName}>
                              {users.map(user => user.username).join(', ')}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    'No roles assigned'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={styles.noProjects}>
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: '"Roboto", sans-serif',
    background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
    minHeight: '100vh',
    borderRadius: '10px',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#333',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '16px',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#45a049',
      transform: 'scale(1.05)',
    },
  },
  table: {
    width: '90%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #ddd',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#555',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  tr: {
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#555',
    verticalAlign: 'middle',
  },
  compactRolesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  compactRoleItem: {
    display: 'flex',
    alignItems: 'baseline',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  compactRoleName: {
    fontWeight: '600',
    color: '#2d3748',
    minWidth: '80px',
    textAlign: 'right',
    paddingRight: '8px',
  },
  compactUserName: {
    color: '#4a5568',
    flex: 1,
    textAlign: 'left',
  },
  activeStatus: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  noProjects: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#999',
    fontStyle: 'italic',
  },
};

export default ProjectsPage;
