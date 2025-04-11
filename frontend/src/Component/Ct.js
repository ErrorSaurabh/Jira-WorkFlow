import { createContext, useState } from "react";

let Ct = createContext({
    userData: null,        
    updatestate: () => {}  
});

export const CtProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    return (
        <Ct.Provider value={{ userData, setUserData }}>
            {children}
        </Ct.Provider>
    );
};

export default Ct;

