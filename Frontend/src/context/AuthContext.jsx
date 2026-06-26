import { createContext,useContext } from "react";
import React from "react";
import { useState,useEffect } from "react";
import backendApi from '../api/backendApi';
import axios from "axios";

const AuthContext=createContext();

export function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    
    useEffect(()=>{
        backendApi.get('/auth/me')
        .then((res)=>setUser(res.data.user))
        .catch((err)=>{
            console.log(err)
            setUser(null); 
        })
        .finally(()=>setLoading(false))
    },[]);

    const logout=async()=>{
        try{
            await backendApi.post('/auth/logout');
            setUser(null);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{user,loading,logout,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);