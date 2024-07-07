import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			if (!selectedConversation) return;
			setLoading(true);
			setMessages([]);
			try {
				const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${selectedConversation.id}`,{
					withCredentials: true
				});
				if(!res?.data?.success){
					res?.data?.message === "Conversation not found" && toast.error(res?.data?.message);
					console.log(res?.data?.message);
					return
				}
				setMessages(res?.data?.conversation)
			} catch (error: any) {
				toast.error(error?.res?.data?.message);
				console.log(error?.res?.data?.message);
			} finally {
				setLoading(false);
			}
		};

		getMessages();
	}, [selectedConversation, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
