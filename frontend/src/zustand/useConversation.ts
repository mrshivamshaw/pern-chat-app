import {create} from "zustand";

type MeassageTpe = {
    id : string,
    body : string,
    senderId : string,
    createdAt : string,
    shouldShake? : boolean
}

interface ConversationState {
    selectedConversation : ConversationType | null,
    setSelectedConversation : (conversation : ConversationType | null) => void,
    messages : MeassageTpe[],
    setMessages : (messages : MeassageTpe[]) => void
}

const useConversationStore = create<ConversationState>((set) => ({
    selectedConversation : null,
    setSelectedConversation : (conversation) => set({ selectedConversation: conversation }),
    messages : [],
    setMessages : (messages) => set({ messages: messages }),
}))

export default useConversationStore