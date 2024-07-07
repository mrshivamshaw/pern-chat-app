import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message: string) => {
		if (!selectedConversation) return;
		setLoading(true);
		try {
			const res = await axios.post(`/api/messages/send/${selectedConversation.id}`, {
				message,
			});

			if(!res?.data?.success){
				toast.error(res?.data?.message);
				console.log(res?.data?.message);
				return
			}
			setMessages([...messages, res?.data?.newMessage]);
		} catch (error: any) {
			toast.error(error?.res?.data?.message);
			console.log(error?.res?.data?.message);
			
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
