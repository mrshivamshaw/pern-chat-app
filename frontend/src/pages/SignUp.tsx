import { Link, useNavigate } from "react-router-dom";
import GenderCheckbox from "../components/GenderCheckbox";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		username : "",
		firstname : "",
		lastname : "",
		password : "",
		confirmPassword : "",
		gender : ""
	});
	const navigate = useNavigate();
	const {setAuthUser} = useAuthContext()

	const formSubmitHamdler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const toastId = toast.loading("Signing up...");
		try {
			const res = await axios.post("/api/auth/signin",inputs);
			if(!res?.data?.success){
				setInputs({ ...inputs, password : "", confirmPassword : "" })
				toast.dismiss(toastId)
				toast.error(res?.data?.message)
				return
			}
			toast.dismiss(toastId)
			toast.success(res?.data?.message)
			setInputs({ ...inputs, password : "", confirmPassword : "" })
			setAuthUser(res?.data?.user);
			navigate("/");
		} catch (error) {
			console.log(error);
			toast.dismiss(toastId)
			toast.error("Something went wrong")
		}
	};

	const handleCheckBoxChange = (gender: string) => {
		setInputs({ ...inputs, gender })
	}

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up <span className='text-blue-500'> ChatApp</span>
				</h1>

				<form onSubmit={formSubmitHamdler}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>First Name</span>
						</label>
						<input value={inputs.firstname} onChange={(e) => setInputs({ ...inputs, firstname : e.target.value })} type='text' placeholder='John' className='w-full input input-bordered  h-10' />
					</div>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Last Name</span>
						</label>
						<input value={inputs.lastname} onChange={(e) => setInputs({ ...inputs, lastname : e.target.value })} type='text' placeholder='Doe' className='w-full input input-bordered  h-10' />
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input value={inputs.username} onChange={(e) => setInputs({ ...inputs, username : e.target.value })} type='text' placeholder='johndoe' className='w-full input input-bordered h-10' />
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

					<div>
						<label className='label'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword : e.target.value })}
						/>
					</div>

					<GenderCheckbox onChangeCheckBox={handleCheckBoxChange} selectGender = {inputs.gender}/>

					<Link
						to={"/login"}
						className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-white'
					>
						Already have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2 border border-slate-700'>Sign Up</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
