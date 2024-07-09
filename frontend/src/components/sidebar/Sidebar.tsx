import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { PiWechatLogoDuotone } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";


const Sidebar = () => {
	const [open, setOpen] = useState(true);

	return (
		<>
		<div className={` w-44 md:w-1/2 ${open ? "block" : "hidden"} md:block lg:block xl:block`}>
			<div className='border-r border-slate-500 p-1 md:p-4 flex flex-col'>
					{open && <RxCross1 onClick={() => setOpen(!open)} className="block md:hidden lg:hidden xl:hidden text-xl my-1 text-black/80 "/>}
					<SearchInput />
				<div className='divider px-3' />
				<Conversations />
				<LogoutButton />
			</div>
		</div>
		<div className={`md:hidden lg:hidden xl:hidden w-[15vw] ${open ? "hidden" : "block"} border-r-2 `}>
			{!open && <PiWechatLogoDuotone onClick={() => setOpen(!open)} className="text-4xl text-black/80 mx-auto my-4"/>}
		</div>
		</>
	);
};
export default Sidebar;
