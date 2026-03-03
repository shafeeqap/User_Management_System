import { useState } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import Dropdown from "../Dropdown/Dropdown";
import { useLogoutMutation } from "../../features/user/usersApiSlice.js";
import { logout } from "../../features/auth/authSlice.js";
import { useDispatch, useSelector } from "react-redux";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="p-4 bg-black/85">
        <nav>
          <div className="flex justify-between px-5 text-white">
            <div className="font-bold text-lg uppercase">
              u<span className="text-yellow-700">m</span>s
            </div>
            <div className="hidden md:flex justify-between items-center">
              {userInfo ? (
                <Dropdown />
              ) : (
                <Link to="/login" className="flex items-center gap-1">
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
                <Link to="/login">Login</Link>
              </li>
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:bg-black/10 p-1 cursor-pointer">
                <Link to="/profile">Profile</Link>
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

export default Header;
