import { Search } from "lucide-react";
import { useState } from "react";
import useConversationStore from "../../zustand/useConversation";
import toast from "react-hot-toast";
import useGetConversations from "../../hook/useGetConversations";

const SearchInput = () => {
	const [searchInput, setSearchInput] = useState("")
	const {setSelectedConversation} = useConversationStore()
	const {conversations} = useGetConversations()
	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(!searchInput) return;
		if(searchInput.length < 3){
			toast.error("Please enter at least 3 characters");
			return
		}

		if (!conversations) return;
		const conversation = conversations.find((c: ConversationType) => `${c.firstname}${c.lastname}.`.toLowerCase().includes(searchInput.toLowerCase())) 

		if(conversation){
			setSelectedConversation(conversation)
			setSearchInput("")
		}else{
			toast.error("No user not found");
		}
	}
	return (
		<form onSubmit={handleSearch} className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='Search…'
				className='input-sm md:input input-bordered rounded-full sm:rounded-full w-full'
				value={searchInput}
				onChange={e => setSearchInput(e.target.value)}
			/>
			<button type='submit' className='btn md:btn-md btn-sm btn-circle bg-sky-500 text-white  '>
				<Search className='w-4 h-4 md:w-6 md:h-6 outline-none' />
			</button>
		</form>
	);
};
export default SearchInput;
