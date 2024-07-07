import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState<ConversationType[]>([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await axios.get("/api/messages/conversations");
				
				if(!res?.data?.success){
					
					toast.error(res?.data?.message);
					throw new Error(res?.data?.message);
				}
				console.log(res?.data);
				
				setConversations(res?.data?.users);
			} catch (error: any) {
				toast.error(error?.res?.data?.message || error.message);
				console.log(error?.res?.data?.message || error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;
