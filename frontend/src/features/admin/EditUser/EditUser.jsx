import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateProfileValidation } from "../../../utils/validation/updateProfileValidation.js";
import { TfiEmail } from "react-icons/tfi";
import { FiSmartphone, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAdminUpdateUserMutation } from "../adminApiSlice.js"
import Loader from "../../../Components/Loader/Loader.jsx";


const EditUser = ({ user, handleEditUserModalClose }) => {
  const [adminUpdateUser, { isLoading }] = useAdminUpdateUserMutation();
  const [isModified, setIsModified] = useState(false);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setValues,
  } = useFormik({
    initialValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobile: user.mobile || "",
    },
    validationSchema: updateProfileValidation,
    enableReinitialize: true,
    onSubmit: async (formValues) => {

      try {    
        const updateUserPromise  = adminUpdateUser({id: user._id, data: formValues}).unwrap();

        toast.promise(updateUserPromise, {
          pending: "Updating...",
          success: "Updation successful!",
          error: "Updation failed!",
        });

        const res = await updateUserPromise;

        if(res){
          handleEditUserModalClose();
        }
      } catch (error) {
        console.log(error.response ? error.response.data : error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    },
  });

  useEffect(() => {
    setValues({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobile: user.mobile || "",
    });
  }, [user, setValues]);

  useEffect(() => {
    setIsModified(hasChanges(values)); 
  }, [values]);

  const hasChanges = (values) => {
    return (
      values.firstName !== user.firstName ||
      values.lastName !== user.lastName ||
      values.email !== user.email ||
      values.mobile !== user.mobile
    );
  }

  
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="firstName"
            value={values.firstName}
            type="text"
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <FiUser />
          </div>
          {errors.firstName && touched.firstName && (
            <small className="text-red-500">{errors.firstName}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="lastName"
            type="text"
            value={values.lastName}
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <FiUser />
          </div>
          {errors.lastName && touched.lastName && (
            <small className="text-red-500">{errors.lastName}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            name="email"
            value={values.email}
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <TfiEmail />
          </div>
          {errors.email && touched.email && (
            <small className="text-red-500">{errors.email}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            name="mobile"
            value={values.mobile}
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <FiSmartphone />
          </div>
          {errors.mobile && touched.mobile && (
            <small className="text-red-500">{errors.mobile}</small>
          )}
        </div>
        <div className="py-5 text-center">
          <div className="flex justify-center">{isLoading && <Loader /> }</div>
          <button
            type="submit"
            disabled={ isLoading || !isModified}
            className={`bg-blue-500 text-white uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-200 cursor-pointer ${
              (!isModified || isLoading) && "cursor-not-allowed opacity-50"
            }`}          >
            update
          </button>
        </div>
      </form>
    </div>
  );

}

export default EditUser