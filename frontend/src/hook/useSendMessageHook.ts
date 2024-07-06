import axios from "axios";
import useConversationStore from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessageHook = () => {
  const { selectedConversation, setMessages, messages } = useConversationStore();

  const sendMessage = async (message: string) => {
    // console.log(message);
    
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?.id}`, {message: message});
      if (!res?.data?.success) {
        toast.error(res?.data?.message);
        return;
      }
      setMessages([...messages, res?.data?.data]);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return sendMessage;
};

export default useSendMessageHook;
