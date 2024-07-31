import { createContext, useContext } from "react";
import { getUserData, UserData } from "./utilities";


export interface UserContext {
    user: UserData | undefined, 
    setUser: React.Dispatch<React.SetStateAction<UserData>> //(newUser: string)
}


export const AppContext = createContext<UserContext>({ user: undefined, setUser: () => {} });

export function useUserContext(context: React.Context<UserContext>): UserData {
    const { user } = useContext(context);

    if (user === undefined) {
        throw Error("useUserContext can only be used in the context of the AppContext.Provider Context");
    }

    return user;
}

export function setUserContext(context: React.Context<UserContext>, newUser: string) {
    const { setUser } = useContext(context);

    getUserData(newUser).then((data: UserData) => {
        setUser(data);
    })

    
}