import axios from "axios"
import { useEffect } from "react"
import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const AppContent = createContext()
export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials =true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const[isLoggedIn,setIsLoggedIn] = useState(false)
    const[userData,setUserData] = useState(false)

    //check the authentication status of the user
    const getAuthState =async()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth', { withCredentials: true })

            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }

        }catch(error){
            toast.error(error?.response?.data?.message || "Failed to fetch authentication state");
        }
    }
    
    //get the user data from the backend
    const getUserData = async ()=>{
        try{
            // const {data} = await axios.get(backendUrl + '/api/user/data')
             const { data } = await axios.get(`${backendUrl}/api/user/data`);
            data.success ? setUserData(data.userData) : toast.error(data.message || "Couldn't fetch user info.");

        }catch(error){
            toast.error(error?.response?.data?.message || "Failed to fetch user data");
        }
    }
    // Initialize as null instead of false


// In getAuthState() and getUserData(), handle cases properly:


    useEffect(()=>{
        getAuthState();
    },[])

    const value = {
        backendUrl, // Add other context values here as needed
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}



// This context provides the backend URL, login state, and user data to the entire application.

// This context provides the backend URL, login state, and user data to the entire application.




