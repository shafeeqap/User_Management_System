import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminLogoutMutation } from '../../features/admin/adminApiSlice';
import { adminLogout } from '../../features/admin/adminSlice';

const AdminDropdown = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ adminLogoutApiCall ] = useAdminLogoutMutation();

  const logoutHandler = async () =>{
    try {
      if(adminInfo.googleId){
        window.open('http://localhost:5000/auth/logout', "_self");
        dispatch(adminLogout());
        navigate("/admin-login");
      } else {
        await adminLogoutApiCall().unwrap();
        dispatch(adminLogout());
        navigate("/admin-login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 capitalize">
          { adminInfo?.firstName }
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
        <MenuItem>
            <Link to="/admin"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Home
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="#"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Profile
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Dashboard
            </Link>
          </MenuItem>
            <MenuItem>
              <button
              onClick={logoutHandler}
                type="button"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                Sign out
              </button>
            </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}

export default AdminDropdown