import { useState, useCallback} from "react";

export const useHttp = () => {
    const [isError, setisError] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [isSuccess, setisSuccess] = useState(false);

    const sendRequest = useCallback(async (
        url,
        method = "GET",
        headers = {},
        body = null
    ) => {
        setisLoading(true)
        try{
            const response = await fetch(url, { method, headers, body });
            const responseData = await response.json()
            if(!response.ok){
                throw new Error(responseData.message)
            }
            setisSuccess(true)
            setisLoading(false)
            return responseData
        }
        catch(err){
            console.log(err);
            setisError(err.message)
            setisLoading(false)

        }
      
    },[]);

    const resetError =()=>{
        setisError(false)
    }
    const resetSuccess =()=>{
        setisSuccess(false)
    }
    return {isLoading,isError,resetError,isSuccess,resetSuccess,sendRequest}
};
