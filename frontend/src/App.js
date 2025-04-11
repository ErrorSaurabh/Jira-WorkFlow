import React, { useState, useCallback } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Reg from './Component/Reg';
import Nav from './Component/Nav';
import Login from './Component/Login';
import './App.css';
import Home from './Component/Home';
import Projects from './Component/Projects';
import Filter from './Component/Filter';
import Create from './Component/Create';
import Dashboards from './Component/Dashboards';
import Complete from './Component/Complete';
import Footer from './Component/Footer';
import Ct from './Component/Ct';
import ProjectList from './Component/ProjectList';
import Guide from './Component/Guide';
import Report from './Component/Report';
import Reports from './Component/Reports';
import Comment from './Component/Comment';
import Update from './Component/Update';
import Logout from './Component/Logout';


const App = () => {
    const [userData, setUserData] = useState(null); 

    const updatestate = useCallback((obj) => {
        setUserData(obj); 
    }, [setUserData]);

    return (
        <BrowserRouter>
            <Ct.Provider value={{ userData: userData, updatestate: updatestate }}>
                <Nav />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/guide' element={<Guide />} />
                    <Route path='/completed' element={<Complete />} />
                    <Route path='/Projects' element={<Projects />} />
                    <Route path='/Filter' element={<Filter />} />
                    <Route path='/Dashboards' element={<Dashboards />} />
                    <Route path='/Create' element={<Create />} />
                    <Route path='/Register' element={<Reg />} />
                    <Route path='/Login' element={<Login />} />
                    <Route path='/ProjectList' element={<ProjectList />} />
                    <Route path='/Report' element={<Report/>} />
                    <Route path='/Reports' element={<Reports/>} />
                    <Route path='/project/:projectId' element={<Update />} />
                    <Route path='/Comment/:projectId' element={<Comment/>}/>
                    <Route path="/logout" element={<Logout />} />
                </Routes>
                <Footer />
            </Ct.Provider>
        </BrowserRouter>
    )
}

export default App;