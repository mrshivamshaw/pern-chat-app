import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"

function App() {

  return (
    <div className='flex w-[100vw] h-screen justify-center items-center'>
      <Routes>
        <Route index path="/" element={<Home/>}/>
        <Route path="*" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

export default App
