import axios from "axios";
import { ReactNode, createContext,Dispatch,SetStateAction, useEffect, useState, useContext } from "react";

type authUserType = {
    id: string,
    username: string,
    firstname : string,
    lastname : string,
    profilepic : string
}

const AuthContext = createContext<{
    authUser : authUserType | null,
    setAuthUser : Dispatch<SetStateAction<authUserType | null>>,
    isLoading : boolean
}>({
    authUser : null,
    setAuthUser : () => {},
    isLoading : true
})

export const useAuthContext  = () => {
    return useContext(AuthContext)

}

export const AuthContextProvider =  ({children}: {children: ReactNode}) => {
    const [authUser, setAuthUser] = useState<authUserType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const getUserData = async()=>{
            try {
                const res = await axios.get('/api/auth/user')
                if(!res?.data?.success){
                  console.log(res.data.message);
                  setAuthUser(null)
                }
                setAuthUser(res?.data?.user)
                
            } catch (error) {
                console.log(error);
            }finally{
                setIsLoading(false)
            }
        }

        getUserData();
    },[])

    return(
      <AuthContext.Provider
			value={{
				authUser,
				isLoading,
				setAuthUser,
			}}
		>
			{children}
		</AuthContext.Provider>
    )

}