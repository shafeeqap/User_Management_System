import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen text-center'>
        <h1 className='font-extrabold text-9xl text-red-600 mb-5'>Oops!</h1>
        <p className='font-bold text-2xl font-mono uppercase'>404 Page Not Found</p>
        <p className='mb-5'>The page you are looking for might have been removed <br/> had its name changed or is temporarily unavailable.</p>
        <Link to="/" className='bg-blue-600 rounded-2xl text-white uppercase font-semibold p-2 px-4 hover:bg-blue-700'>go to homepage</Link>
    </div>
  )
}

export default PageNotFound