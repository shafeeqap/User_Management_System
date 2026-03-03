import { useState, useEffect } from "react";
import { useUploadAdminProfileImageMutation, useDeleteAdminProfileImageMutation } from "../adminApiSlice";
import { IoSave } from "react-icons/io5";
import { FaTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setAdminCredentials } from "../adminSlice";
import { toast } from "react-toastify";



const AdminProfile = ({ handleAdminProfileModalClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadAdminProfileImage] = useUploadAdminProfileImageMutation();
  const [deleteAdminProfileImage] = useDeleteAdminProfileImageMutation();
  const { adminInfo } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (adminInfo && adminInfo.profileImage) {
      setPreviewImage(`http://localhost:5000/userProfile/${adminInfo.profileImage}`);
    } 

  }, [adminInfo]);

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const saveImage = async () => {
    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const response = await uploadAdminProfileImage(formData).unwrap();

      const { profileImage } = response;

      // Update localStorage with the new profile image
      const updatedAdminInfo = { ...adminInfo, profileImage };
      localStorage.setItem("adminInfo", JSON.stringify(updatedAdminInfo));
      toast.success(response.message);

      dispatch(setAdminCredentials(response));
      handleAdminProfileModalClose();
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };



  const removeImage = async () => {
    try {
        window.confirm('Are you sure?')
      const res = await deleteAdminProfileImage().unwrap();

      const updatedAdminInfo = { ...adminInfo, profileImage:"" };
      
      localStorage.setItem("adminInfo", JSON.stringify(updatedAdminInfo));
      toast.success(res.message);
      dispatch(setAdminCredentials(updatedAdminInfo));
      handleAdminProfileModalClose();
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center">
      <div onClick={handleClick} className="text-center rounded-full cursor-pointer mb-5">
        <input
          type="file"
          id="fileInput"
          onChange={handleImageChange}
          className="hidden"
        />
        {previewImage ? (
            <img
              src={previewImage}
              alt="profile-image"
              className="w-36 h-36 rounded-full"
            />
        ) : (
            <div className="adminInitials">
            {`${adminInfo.firstName[0]}${adminInfo.lastName[0]}`}
          </div>
        )}
      </div>
      <div className="w-full flex justify-between items-center">
        <button
          onClick={saveImage}
          className="flex justify-center items-center gap-2 bg-blue-500 p-2 rounded-md min-w-28 text-white text-center cursor-pointer hover:bg-blue-600"
        >
          <IoSave />
          Save
        </button>
        <button
          onClick={removeImage}
          className="flex justify-center items-center gap-2 bg-red-700 p-2 rounded-md min-w-28 text-white hover:bg-red-800"
        >
          <FaTrashCan />
          Remove
        </button>
      </div>
    </div>
  );
};

export default AdminProfile