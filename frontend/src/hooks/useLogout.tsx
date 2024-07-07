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
			const res = await axios.post("/api/auth/logout", {});
			if (!res?.data?.success) {
				toast.error(res?.data?.message);
				console.log(res?.data?.message);
				return
			}
			setSelectedConversation(null)
			setAuthUser(null);
		} catch (error: any) {
			console.error(error?.res?.data?.message || error.message);
			toast.error(error?.res?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
