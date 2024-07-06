import { useAuthContext } from "../../context/AuthContext";
import useConversationStore from "../../zustand/useConversation";

const Message = ({ message }: { message?: any }) => {
	const {selectedConversation} = useConversationStore();
	const {authUser} = useAuthContext();
	const fromMe = message?.senderid === authUser?.id;
	const chatClass = fromMe ? "chat-end" : "chat-start";
	const img = fromMe
		? authUser?.profilepic 
		: selectedConversation?.profilepic

	const bubbleBg = fromMe ? "bg-blue-500" : "";
	return (
		<div className={`chat ${chatClass}`}>
			<div className='hidden md:block chat-image avatar'>
				<div className='w-6 md:w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={img} />
				</div>
			</div>
			<p className={`chat-bubble text-white ${bubbleBg} text-sm md:text-md`}>{message.body}</p>
			<span className='chat-footer opacity-50 text-xs flex gap-1 items-center text-white'>22:59</span>
		</div>
	);
};
export default Message;
