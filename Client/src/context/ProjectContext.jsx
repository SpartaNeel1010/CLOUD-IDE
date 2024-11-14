import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setprojects] = useState([])
  const [ActiveProject, setActiveProject] = useState(null);

  const getAllprojects= async(props)=>{
        const auth_token=localStorage.getItem('authToken')
        console.log("fetching all notes")
        if(!auth_token)
            return
        let response =await fetch('http://localhost:5001/project/fetchallprojects',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': auth_token
            },

        })
        let responseJson= await response.json()
        console.log(responseJson)
        setprojects(responseJson)
    }
    

    useEffect(()=>{
      getAllprojects();

    },[])

    


  return (
    <ProjectContext.Provider value={{projects,ActiveProject,setActiveProject,getAllprojects }}>
      {children}
    </ProjectContext.Provider>
  );
};


