import { useContext, useEffect, useState, useCallback } from "react";
import "./DashboardUsers.css";
import { AuthContext } from "../../Context/AuthContext";
import Loader from "../../components/Loader/Loader";
import AddUserModal from "../Modal/AddUserModal";
import EditUserModal from "../Modal/EditUserModal";

function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const {
    getAllUsers,
    deleteUser,
    user: currentUser,
  } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Use this to trigger a fetch
  const triggerFetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      if (!mounted || isLoading) return;

      setIsLoading(true);
      try {
        setError(null);
        const response = await getAllUsers();
        if (mounted && response?.success && Array.isArray(response.users)) {
          setUsers(response.users);
        } else if (mounted) {
          setError("Failed to fetch users data");
        }
      } catch (error) {
        if (mounted) {
          setError(error.message || "Failed to fetch users");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [getAllUsers, fetchTrigger]); // Only re-run when getAllUsers changes or fetch is triggered

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleOpenEditModal = (user) => {
    if (!user) {
      console.error("No user provided to edit");
      return;
    }
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleAddUser = async () => {
    try {
      setShowAddModal(false);
      triggerFetch();
    } catch (error) {
      setError("Failed to refresh users after adding");
      console.error("Failed to refresh users after adding:", error);
    }
  };

  const handleEditUser = async () => {
    try {
      handleCloseEditModal();
      triggerFetch();
    } catch (error) {
      setError("Failed to refresh users after updating");
      console.error("Failed to refresh users after updating:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await deleteUser(userId);
        if (result.success) {
          triggerFetch();
        } else {
          setError(result.error?.message || "Failed to delete user");
        }
      } catch (error) {
        setError("Failed to delete user");
        console.error("Failed to delete user:", error);
      }
    }
  };

  return (
    <div className="dashboard-users">
      <div className="dashboard-header">
        <h2>User Management</h2>
        <button className="add-user-button" onClick={handleOpenAddModal}>
          Add New User
        </button>
      </div>

      {showAddModal && (
        <AddUserModal onClose={handleCloseAddModal} onAddUser={handleAddUser} />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseEditModal}
          onUserUpdated={handleEditUser}
        />
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={triggerFetch} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-role role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td>
                      {user._id !== currentUser?._id ? (
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => handleOpenEditModal(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="current-user-note">Current User</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-message">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardUsers;
