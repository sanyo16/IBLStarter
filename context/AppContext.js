import { createContext, useContext, useMemo, useReducer, useEffect } from "react";
import { AppReducer, initialState } from "./AppReducer";

const AppContext = createContext();

export function AppWrapper({ children }) {        
    const [appState, dispatch] = useReducer(AppReducer, initialState);
    
    const contextValue = useMemo(() => {
        return [appState, dispatch];
    }, [appState, dispatch]);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("appState"))) {                    
           dispatch({ 
              type: "init_stored", 
              value: JSON.parse(localStorage.getItem("appState")),
           });
        }
     }, []);

     useEffect(() => {
        if (appState !== initialState) { 
            localStorage.setItem("appState", JSON.stringify(appState));                    
        }
     }, [appState]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
