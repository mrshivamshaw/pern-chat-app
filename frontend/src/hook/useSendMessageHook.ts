import axios from "axios";
import useConversationStore from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useState } from "react";

const useSendMessageHook = () => {
  const { selectedConversation, setMessages, messages } = useConversationStore();
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    // console.log(message);
    setLoading(true);
    
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?.id}`, {message: message});
      if (!res?.data?.success) {
        toast.error(res?.data?.message);
        setLoading(false);
        return;
      }
      setMessages([...messages, res?.data?.data]);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  return {sendMessage, loading};
};

export default useSendMessageHook;
