import useChatScroll from "../../hook/useChatScroll";
import useGetMessages from "../../hook/useGetMessages";
import useConversationStore from "../../zustand/useConversation";
import Message from "./Message";

const Messages = () => {
	const {loading} = useGetMessages();
	const {messages} = useConversationStore();
	const ref = useChatScroll(messages) as React.MutableRefObject<HTMLDivElement>;
	return (
		<div className='px-4 flex-1 overflow-auto' ref={ref}>
			{ messages?.map((message) => (
				<Message key={message.id} message={message} />
			))}
			{messages.length === 0 && !loading && <div className='w-full h-full text-black/80 text-xl font-semibold flex justify-center items-center'><span>Send the message to start chating</span></div>}

			{loading ? <div className='w-full h-full text-black/60 text-xl font-semibold flex justify-center items-center'><span className='loading loading-spinner mx-auto'/></div> : null}
		</div>
	);
};
export default Messages;
