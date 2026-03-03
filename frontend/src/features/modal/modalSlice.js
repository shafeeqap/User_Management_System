import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isProfileModalOpen: false,
  isPasswordModalOpen: false,
  isProfileImageModalOpen: false,
  isForgotPasswordModalOpen: false,
  isAddNewUserModalOpen: false,
  isEditUserModalOpen: false,
  selectedUser: null,
  isUserBlockUnblockModalOpne: false,
  isUserDeleteModalOpen: false,
  isAdminProfileModalOpen: false,
};
const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    openProfileModal: (state, action) => {
      state.isProfileModalOpen = true;
    },
    closeProfileModal: (state, action) => {
      state.isProfileModalOpen = false;
    },
    openPasswordModal: (state, action) => {
      state.isPasswordModalOpen = true;
    },
    closePasswordModal: (state, action) => {
      state.isPasswordModalOpen = false;
    },
    openProfileImageModal: (state, action) => {
      state.isProfileImageModalOpen = true;
    },
    closeProfileImageModal: (state, action) => {
      state.isProfileImageModalOpen = false;
    },
    openForgotPasswordModal: (state, action) =>{
      state.isForgotPasswordModalOpen = true;
    },
    closeForgotPasswordModal: (state, action) =>{
      state.isForgotPasswordModalOpen = false;
    },
    openAddNewUserModal: (state, action) =>{
      state.isAddNewUserModalOpen = true;
    },
    closeAddNewUserModal: (state, action) =>{
      state.isAddNewUserModalOpen = false;
    },
    openEditUserModal: (state, action) =>{
      state.isEditUserModalOpen = true;
    },
    closeEditUserModal: (state, aciton) =>{
      state.isEditUserModalOpen = false;
      state.selectedUser = null
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    openUserBlockUnblockModal: (state, action) =>{
      state.isUserBlockUnblockModalOpne = true;
    },
    closeUserBlockUnblockModal: (state, action) =>{
      state.isUserBlockUnblockModalOpne = false;
    },
    openUserDeleteModal: (state, action) =>{
      state.isUserDeleteModalOpen = true;
    },
    closeUserDeleteModal: (state, action) => {
      state.isUserDeleteModalOpen = false;
    },
    openAdminProfileModal: (state, action) => {
      state.isAdminProfileModalOpen = true;
    },
    closeAdminProfileModal: (state, action) => {
      state.isAdminProfileModalOpen = false;
    },
  },
});

export const {
  openProfileModal,
  closeProfileModal,
  openPasswordModal,
  closePasswordModal,
  openProfileImageModal,
  closeProfileImageModal,
  openForgotPasswordModal,
  closeForgotPasswordModal,
  openAddNewUserModal,
  closeAddNewUserModal,
  openEditUserModal,
  closeEditUserModal,
  setSelectedUser,
  openUserBlockUnblockModal,
  closeUserBlockUnblockModal,
  openUserDeleteModal,
  closeUserDeleteModal,
  openAdminProfileModal,
  closeAdminProfileModal,
} = modalSlice.actions;

export default modalSlice.reducer;
