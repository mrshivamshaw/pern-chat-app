import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
	const [inputs, setInputs] = useState({
		username : "",
		password : "",
	})
	const navigate = useNavigate(); 
	const {setAuthUser} = useAuthContext();
	const loginFormHandler = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const toastId = toast.loading("Logging in...");
		try {
			const res = await axios.post("/api/auth/login", inputs);
			if(!res?.data?.success){
				setInputs({ ...inputs, password : "" })
				toast.dismiss(toastId)
				toast.error(res?.data?.message)
				return
			}
			toast.dismiss(toastId)
			toast.success(res?.data?.message)
			setInputs({ ...inputs, password : "" })
			setAuthUser(res?.data?.user);
			navigate("/");
		} catch (error: any) {
			toast.dismiss(toastId)
			toast.error(error?.response?.data?.message)
			console.log(error?.response?.data?.message);
			
		}
	};
	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-white'>
					Login
					<span className='text-blue-500'> ChatApp</span>
				</h1>

				<form onSubmit={loginFormHandler}>
					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input value={inputs.username} onChange={(e) => setInputs({ ...inputs, username : e.target.value })} type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password : e.target.value })}
						/>
					</div>
					<Link
						to='/signup'
						className='text-sm  hover:underline text-white hover:text-blue-600 mt-2 inline-block'
					>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2'>Login</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
