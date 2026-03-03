import Header from "../../../Components/Header/Header";
import bg_image from "../../../assets/bg-image.jpg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {

  const { userInfo } = useSelector((state) => state.auth);
  
  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <div className="flex h-screen">
        <div className="flex items-center w-1/2">
            {userInfo ? (
          <div className="px-5 max-sm:py-20 sm:px-20">
            <h1 className="font-medium text-gray-500 uppercase">Welcome to my world.</h1>
            <h1 className="font-extrabold text-lg sm:text-5xl">Hi, I'm <span className="text-yellow-700 capitalize">{ userInfo?.firstName}</span></h1>
            <h2 className="font-semibold sm:text-3xl">a Developer.{" "}<span className="text-gray-500">|</span></h2>
            <div>
            <p className="py-2">Lorem ipsum dolor sit amet consectetur, 
                adipisicing elit. Commodi, laudantium! Voluptates quia 
                libero harum minus facere, nulla molestias modi sunt. 
                Sed tempore dolorum sequi at, quos laboriosam doloremque vel cupiditate!</p>
            </div>
          </div>
            ) : (
              <div className="px-5 max-sm:py-20 sm:px-20">
              <h1 className="font-extrabold text-lg sm:text-5xl uppercase text-yellow-700">Welcome</h1>
              <h2 className="capitalize text-xl">to home page</h2>
              <div>
              <p className="py-2">Lorem ipsum dolor sit amet consectetur, 
                  adipisicing elit. Commodi, laudantium! Voluptates quia 
                  libero harum minus facere, nulla molestias modi sunt. 
                  Sed tempore dolorum sequi at, quos laboriosam doloremque vel cupiditate!</p>
              </div>
              <div className="flex gap-5">
                <Link to="/login" className="border border-black hover:bg-gray-100 hover:text-gray-500 p-1 rounded-xl text-center w-36">Login</Link>
                <Link to="/signup" className="bg-yellow-700 hover:bg-yellow-800 hover:text-gray-100 text-white border text-center p-1 rounded-xl w-36">Signup</Link>
              </div>
            </div>
            )}
        </div>
        <div className="w-1/2">
          <img src={bg_image} alt="" className="h-screen w-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Home;
