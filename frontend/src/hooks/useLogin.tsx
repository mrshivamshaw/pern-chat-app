import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username: string, password: string) => {
		const toastId = toast.loading("Logging in...");
		// console.log(username, password);
		
		try {
			setLoading(true);
			const res = await axios.post(import.meta.env.VITE_API_URL+"/api/auth/login", {
				username,
				password,
			},{
				withCredentials: true
			})


			if(!res?.data?.success){
				toast.dismiss(toastId);
				toast.error(res?.data?.message);
				console.log(res?.data?.message);
				
			}

			else{
				setAuthUser(res?.data?.user);
				console.log(res?.data?.user);
				toast.dismiss(toastId);
				toast.success("Successfully logged in");
			}
		} catch (error: any) {
			toast.dismiss(toastId);
			toast.error(error?.res?.data?.message);
			console.error(error?.res?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;
