import DataTable from "react-data-table-component";
import { useGetUsersQuery } from "../adminApiSlice.js";
import { useEffect, useState } from "react";
import Loader from "../../../Components/Loader/Loader.jsx";
import Button from "../../../Components/Button/Button.jsx";
import "../UserList/UserList.css";
import {
  openAddNewUserModal,
  closeAddNewUserModal,
  openEditUserModal,
  closeEditUserModal,
  setSelectedUser,
  openUserBlockUnblockModal,
  closeUserBlockUnblockModal,
  openUserDeleteModal,
  closeUserDeleteModal,
} from "../../modal/modalSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../Components/modal/Modal.jsx";
import AddNewUser from "../AddNewUser/AddNewUser.jsx";
import EditUser from "../EditUser/EditUser.jsx";
import UserBlockUnblock from "../UserBlockUnblock/UserBlockUnblock.jsx";
import DeleteUser from "../DeleteUser/DeleteUser.jsx";

const UserList = () => {
  const { data, isLoading, refetch, error } = useGetUsersQuery();
  const [userData, setUserData] = useState([]);
  const [blockUser, setBlockUser] = useState();
  const [deleteUser, setDeleteUser] = useState();
  const {
    isAddNewUserModalOpen,
    isEditUserModalOpen,
    selectedUser,
    isUserBlockUnblockModalOpne,
    isUserDeleteModalOpen,
  } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  console.log(data, "data");

  
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName,
      width: "150px",
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      width: "150px",
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      width: "150px",
    },
    {
      name: "Profile Image",
      width: "150px",
      
      cell: (row) =>
        row.googleId && row.profileImage ? (
          <img
          src={row.profileImage}
          alt={`${row.firstName[0]} ${row.lastName[0]}`}
          width="50"
          height="50"
          style={{ borderRadius: "100%", width: "50px", height: "50px" }}
        />
      ) : row.profileImage ? (
          <img
            src={`http://localhost:5000/userProfile/${row.profileImage}`}
            alt={`${row.firstName[0]} ${row.lastName[0]}`}
            width="50"
            height="50"
            style={{ borderRadius: "100%", width: "50px", height: "50px" }}
          />
        ) : (
          <div className="initials ">
            {`${row.firstName[0]}${row.lastName[0]}`}
          </div>
        ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Login Method",
      selector: (row) => (row.googleId ? "Google" : "Regular"),
      width: "150px"
    },
    {
      name: "Status",
      selector: (row) => (
        <span className={row.isStatus ? "text-green-600" : "text-red-500"}>
          {row.isStatus ? "Active" : "Blocked"}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Button
            className="editBtn Btn"
            onClick={() => handleEditUserModalOpen(row)}
          >
            Edit
          </Button>
          <Button
            className="deleteBtn Btn"
            onClick={() => handleDeleteUserModalOpen(row)}
          >
            Delete
          </Button>
          <Button
            className="readBtn Btn"
            onClick={() => handleBlockUnblockUserModalOpne(row)}
          >
            {row.isStatus ? "Block" : "Unblock"}
          </Button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "black",
        color: "white",
        fontSize: "17px",
        fontWeight: "bolder",
      },
    },
  };

  useEffect(() => {
    if (data?.user) {
      const filteredUsers = data.user.filter((item) => item.role !== "admin");
      setUserData(filteredUsers);
    } else {
      setUserData([]);
    }
  }, [data]);

  const handleChange = (e) => {
    let query = e.target.value.toLocaleLowerCase();

    const filterData = data.user.filter((item) => {
      const firstName = item.firstName.toLocaleLowerCase().includes(query);
      const lastName = item.lastName.toLocaleLowerCase().includes(query);
      const email = item.email.toLocaleLowerCase().includes(query);
      const mobile = new RegExp(query).test(item.mobile);

      return firstName || lastName || email || mobile;
    });
    setUserData(filterData);
  };

  const handleAddNewUserModalOpen = () => {
    dispatch(openAddNewUserModal());
  };
  const handleAddNewUserModalClose = () => {
    dispatch(closeAddNewUserModal());
  };
  const handleEditUserModalOpen = (user) => {
    dispatch(openEditUserModal());
    dispatch(setSelectedUser(user));
  };

  const handleEditUserModalClose = () => {
    dispatch(closeEditUserModal());
    refetch();
  };

  const handleBlockUnblockUserModalOpne = (user) => {
    dispatch(openUserBlockUnblockModal());
    setBlockUser(user);
  };

  const handleBlockUnblockUserModalClose = () => {
    dispatch(closeUserBlockUnblockModal());
    refetch();
  };

  const handleDeleteUserModalOpen = (user) => {
    dispatch(openUserDeleteModal());
    setDeleteUser(user);
  };

  const handleDeleteUserModalClose = () => {
    dispatch(closeUserDeleteModal());
    refetch();
  };

  return (
    <div>
      <div className="homeDiv">
        <div className="addUser">
          <Button className="addUserBtn" onClick={handleAddNewUserModalOpen}>
            Add User
          </Button>
        </div>
        <div className="search">
          <h2>User List</h2>
          <input type="text" placeholder="Search..." onChange={handleChange} />
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div>Error loading users</div>
        ) : (
          <DataTable
            columns={columns}
            data={userData}
            customStyles={customStyles}
            pagination
          />
        )}
      </div>
      <Modal
        isOpen={isAddNewUserModalOpen}
        onClose={handleAddNewUserModalClose}
        title={"Add New User"}
      >
        <AddNewUser
          handleAddNewUserModalClose={handleAddNewUserModalClose}
          refetchUsers={refetch}
        />
      </Modal>

      <Modal
        isOpen={isEditUserModalOpen}
        onClose={handleEditUserModalClose}
        title={"Edit User"}
      >
        <EditUser user={selectedUser} handleEditUserModalClose={handleEditUserModalClose} />
      </Modal>

      <Modal
        isOpen={isUserBlockUnblockModalOpne}
        onClose={handleBlockUnblockUserModalClose}
        title={"Are you sure to block/unblock the user?"}
      >
        <UserBlockUnblock
          user={blockUser}
          handleBlockUnblockUserModalClose={handleBlockUnblockUserModalClose}
        />
      </Modal>

      <Modal
        isOpen={isUserDeleteModalOpen}
        onClose={handleDeleteUserModalClose}
        title={"Are you sure to delete the user?"}
      >
        <DeleteUser
          user={deleteUser}
          handleDeleteUserModalClose={handleDeleteUserModalClose}
        />
      </Modal>
    </div>
  );
};

export default UserList;
