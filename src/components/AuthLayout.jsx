import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

//this is made to check authetication protection and navigate accordingly
export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        //To make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        
        

        // logic learned from ChatGpt
        //this checks if authentication is needed and user is not authenticated toh navigate to login page
        if(authentication && authStatus !== authentication){
            navigate("/login")

        } else if(!authentication && authStatus !== authentication){//this condition checks if authetication is not needed and user is autheticated 
                                                                    //toh navigate to root page 
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? <h1>Loading...</h1> : <>{children}</>
}