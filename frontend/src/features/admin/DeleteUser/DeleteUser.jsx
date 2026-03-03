import Button from "../../../Components/Button/Button"
import Loader from "../../../Components/Loader/Loader"
import "../DeleteUser/DeleteUser.css"
import { useDeleteUserMutation } from "../../../features/admin/adminApiSlice"
import { toast } from "react-toastify";

const DeleteUser = ({ user, handleDeleteUserModalClose }) => {
    const [deleteUser, { isLoading }] = useDeleteUserMutation();

    const handleDeleteUser = async () =>{
        try {
            const res = await deleteUser(user._id).unwrap();

            if(res){
                toast.success(res.message)
                console.log(res, 'user delete response');
            }

            handleDeleteUserModalClose();
        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Failed to update user status!");

        }
    }



  return (
    <>
    <div className="flex ">
        <div className="min-w-80">
          <h1>First Name : {user?.firstName}</h1>
          <h1>Last Name : {user?.lastName}</h1>
          <h1>Email : {user?.email}</h1>
          <h1>Mobile : {user?.mobile}</h1>
          <div className="flex items-center gap-1">
            <h1 className="font-medium font-mono uppercase">Status :</h1>
            <h1
              className={`font-medium font-mono uppercase ${
                user?.isStatus ? "text-green-600" : "text-red-500"
              }`}
            >
              {user?.isStatus ? "Active" : "Blocked"}
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center min-w-28">
          <div className="bg-gray-400 w-24 h-24 rounded-full">
            {user.profileImage ? (
              <img
                src={`http://localhost:5000/userProfile/${user.profileImage}`}
                alt=""
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="image">
                {`${user.firstName[0]}${user.lastName[0]}`}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center">{isLoading && <Loader />}</div>
      <div className="flex justify-between py-4">
        <Button className="confirmBtn Button" onClick={handleDeleteUser}>
          Confirm
        </Button>
        <Button
          className="cancelBtn Button"
          onClick={handleDeleteUserModalClose}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

export default DeleteUser