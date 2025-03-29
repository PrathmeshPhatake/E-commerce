import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully", {
          className: "bg-[#3A3632] text-[#F3EEEA]",
          progressClassName: "bg-[#8C7D6D]"
        });
      } catch (err) {
        toast.error(err?.data?.message || err.error, {
          className: "bg-[#F3EEEA] text-[#5D534A]",
          progressClassName: "bg-[#B0A695]"
        });
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully", {
        className: "bg-[#3A3632] text-[#F3EEEA]",
        progressClassName: "bg-[#8C7D6D]"
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error, {
        className: "bg-[#F3EEEA] text-[#5D534A]",
        progressClassName: "bg-[#B0A695]"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Uncomment when AdminMenu is ready */}
          {/* <AdminMenu /> */}
          
          <div className="md:w-full">
            <h1 className="text-2xl font-bold text-[#3A3632] mb-6">User Management</h1>
            
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#EBE3D5]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#5D534A] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE3D5]">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-[#F9F7F5] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D534A]">
                            {user._id.substring(0, 8)}...
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editableUserId === user._id ? (
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  value={editableUserName}
                                  onChange={(e) => setEditableUserName(e.target.value)}
                                  className="w-full p-2 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                                />
                                <button
                                  onClick={() => updateHandler(user._id)}
                                  className="ml-2 bg-[#776B5D] text-white p-2 rounded-lg hover:bg-[#5D534A] transition-colors"
                                >
                                  <FaCheck />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center text-[#5D534A]">
                                {user.username}
                                <button
                                  onClick={() => toggleEdit(user._id, user.username, user.email)}
                                  className="ml-2 text-[#B0A695] hover:text-[#776B5D] transition-colors"
                                >
                                  <FaEdit />
                                </button>
                              </div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editableUserId === user._id ? (
                              <div className="flex items-center">
                                <input
                                  type="email"
                                  value={editableUserEmail}
                                  onChange={(e) => setEditableUserEmail(e.target.value)}
                                  className="w-full p-2 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                                />
                                <button
                                  onClick={() => updateHandler(user._id)}
                                  className="ml-2 bg-[#776B5D] text-white p-2 rounded-lg hover:bg-[#5D534A] transition-colors"
                                >
                                  <FaCheck />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <a 
                                  href={`mailto:${user.email}`} 
                                  className="text-[#5D534A] hover:text-[#776B5D] transition-colors"
                                >
                                  {user.email}
                                </a>
                                <button
                                  onClick={() => toggleEdit(user._id, user.username, user.email)}
                                  className="ml-2 text-[#B0A695] hover:text-[#776B5D] transition-colors"
                                >
                                  <FaEdit />
                                </button>
                              </div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isAdmin ? (
                              <FaCheck className="text-green-600" />
                            ) : (
                              <FaTimes className="text-red-500" />
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {!user.isAdmin && (
                              <button
                                onClick={() => deleteHandler(user._id)}
                                className="text-[#F3EEEA] bg-[#B0A695] hover:bg-[#8C7D6D] p-2 rounded-lg transition-colors"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;