import useGetMessages from "../../hook/useGetMessages";
import useConversationStore from "../../zustand/useConversation";
import Message from "./Message";

const Messages = () => {
	useGetMessages();
	const {messages } = useConversationStore();
	return (
		<div className='px-4 flex-1 overflow-auto'>
			{ messages?.map((message) => (
				<Message key={message.id} message={message} />
			))}
		</div>
	);
};
export default Messages;
