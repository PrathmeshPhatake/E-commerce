import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        className: "bg-[#5D534A] text-[#F3EEEA]",
        progressClassName: "bg-[#B0A695]"
      });
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully", {
        className: "bg-[#5D534A] text-[#F3EEEA]",
        progressClassName: "bg-[#B0A695]"
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] py-10 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#3A3632] mb-6 text-center">Update Profile</h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5D534A] mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D534A] mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D534A] mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D534A] mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 border border-[#EBE3D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B0A695] text-[#3A3632]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loadingUpdateProfile}
                className="flex-1 py-2.5 px-4 bg-[#776B5D] text-white rounded-lg hover:bg-[#5D534A] transition-colors disabled:opacity-70"
              >
                {loadingUpdateProfile ? "Updating..." : "Update Profile"}
              </button>

              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;