import { useState } from "react";
import { CiLogin } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAdminLogoutMutation } from "../../features/admin/adminApiSlice.js";
import { adminLogout } from "../../features/admin/adminSlice.js";
import { useDispatch, useSelector } from "react-redux";
import AdminDropdown from "../Dropdown/AdminDropdown.jsx";


const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { adminInfo } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adminLogoutApiCall] = useAdminLogoutMutation();

  const logoutHandler = async () => {
    try {
      await adminLogoutApiCall().unwrap();
      dispatch(adminLogout());
      navigate("/admin-login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="p-4 bg-black/75">
        <nav>
          <div className="flex justify-between px-5 text-white">
            <div className="font-bold text-lg uppercase">
              u<span className="text-yellow-700">m</span>s
            </div>
            <div className="hidden md:flex justify-between items-center">
              {adminInfo ? (
                <AdminDropdown />
              ) : (
                <Link to="/admin-login" className="flex items-center gap-1">
                  <CiLogin />
                  Login
                </Link>
              )}
            </div>
            <div className="flex flex-col justify-center items-end md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <RxHamburgerMenu />
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <ul className="md:hidden flex flex-col ml-4 mt-4 text-white">
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <Link to="/admin-login">Login</Link>
              </li>
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <Link to="/admin">Home</Link>
              </li>
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};

export default AdminHeader;
