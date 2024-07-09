import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import useConversation from "../zustand/useConversation";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();
	const { setSelectedConversation} = useConversation();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await axios.post(import.meta.env.VITE_API_URL+"/api/auth/logout", {},{
				withCredentials: true
			});
			if (!res?.data?.success) {
				toast.error(res?.data?.message);
				console.log(res?.data?.message);
				return
			}
			setSelectedConversation(null)
			setAuthUser(null);
			toast.success("Successfully logged out");
		} catch (error: any) {
			console.error(error?.response?.data?.message || error.message);
			toast.error(error?.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
