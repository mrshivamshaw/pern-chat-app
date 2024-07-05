import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import { useAuth } from "./assets/AuthContext";

function App() {
  const {authUser,setAuthUser, isLoading} = useAuth();

  if(isLoading) return null;

  return (
    <div className='flex w-[100vw] h-screen justify-center items-center'>
      <Routes>
        <Route index path="/" element={authUser ? <Home/> : <Login/>}/>
        <Route path="login" element={!authUser ? <Login/> : <Home/>}/>
        <Route path="signup" element={!authUser ? <SignUp/> : <Home/>}/>
      </Routes>
    </div>
  )
}

export default App
