import { useEffect, useState } from 'react';
import useConversationStore  from '../zustand/useConversation'
import toast from 'react-hot-toast';
import axios from 'axios';

const useGetMessages = () => {

    const {selectedConversation, messages, setMessages} = useConversationStore();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const getMessages = async () => {
            setLoading(true);
            setMessages([]);
            try {
                const res = await axios.get(`/api/message/${selectedConversation?.id}`);
                if(!res?.data?.success){
                    toast.error(res?.data?.message);
                    return;
                }
                
                setMessages(res?.data?.messages);
            } catch (error: any) {
                toast.error(error?.response?.data?.messages);
            } finally {
                setLoading(false);
            }
            // console.log(messages);
            
        }
        getMessages();
    },[selectedConversation])
    // console.log(messages);
    
    return {messages, loading};

}
 
export default useGetMessages