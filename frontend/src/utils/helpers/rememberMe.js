import CryptoJS from "crypto-js";
// import { useSelector } from "react-redux";

export const handleRememberMe = (isChecked, setFieldValue) => {
    // const { userInfo } = useSelector((state) => state.auth);
    
  if (isChecked) {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(savedPassword, "secret-key").toString(CryptoJS.enc.Utf8);
      setFieldValue("email", savedEmail);
      setFieldValue("password", decryptedPassword);
    }
  } else {
    setFieldValue("email", "");
    setFieldValue("password", "");
  }
};


export const saveCredentials = (rememberMe, values) => {
  const encryptedPassword = CryptoJS.AES.encrypt(values.password, "secret-key").toString();

  if (rememberMe) {
    localStorage.setItem("email", values.email);
    localStorage.setItem("password", encryptedPassword);
  } else {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
  }
};
