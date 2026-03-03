import AdminHeader from "../../Components/Header/AdminHeader";
import UserList from "./UserList/UserList";

const Dashboard = () => {
  return (
    <>
      <AdminHeader />
      <div><UserList/></div>
    </>
  );
};

export default Dashboard;
