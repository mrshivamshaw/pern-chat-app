import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

type SignupInputs = {
	fullName: string;
	username: string;
	password: string;
	confirmPassword: string;
	gender: string;
};

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async (inputs: SignupInputs) => {
		const toastId = toast.loading("Creating account...");
		try {
			setLoading(true);
			const res = await axios.post("/api/auth/signup", {...inputs});
			console.log(res);
			
			if(!res?.data?.success){
				toast.dismiss(toastId);
				toast.error(res?.data?.message);
				console.log(res?.data?.message);
				return
			}

			toast.dismiss(toastId);
			toast.success("Account created successfully");
			setAuthUser(res?.data?.user);
		} catch (error: any) {
			toast.dismiss(toastId);
			toast.error(error?.response?.data?.message || error.message);
			console.log(error?.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;
