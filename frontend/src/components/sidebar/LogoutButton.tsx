import axios from "axios";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const LogoutButton = () => {
	const navigate = useNavigate();
	const {setAuthUser} = useAuthContext();
	const logout = async() => {
		try {
			const res = await axios.get("/api/auth/logout")
			if(!res?.data?.success){
				toast.error(res?.data?.message);
				return
			}
			toast.success(res?.data?.message);
			setAuthUser(null);
			navigate("/login");
		} catch (error) {
			
		}
	};

	return (
		<div className='mt-auto'>
			<LogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout} />
		</div>
	);
};
export default LogoutButton;
