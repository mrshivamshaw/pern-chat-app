import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/message/conversation");
        if (!res?.data?.success) {
          toast.error(res?.data?.message);
          return;
        }
        // console.log(res?.data?.data); 
        
        setConversations(res?.data?.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  return {conversations, loading};
};

export default useGetConversations;
