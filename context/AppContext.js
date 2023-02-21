import {
    createContext,
    useContext,
    useMemo,
    useReducer,
    useEffect
} from "react";
import { AppReducer, initialState } from "./AppReducer";

const AppContext = createContext();

export const AppWrapper = ({ children }) =>
{
    const [appState, dispatch] = useReducer(AppReducer, initialState);

    const contextValue = useMemo(
        () => [appState, dispatch],
        [appState, dispatch]
    );

    useEffect(
        () => {
            const state = JSON.parse(localStorage.getItem("appState"));
            state && dispatch({type: "getInitialState", value: state});
        },
        []
    );

     useEffect(
         () => {
             appState !== initialState &&
                localStorage.setItem("appState", JSON.stringify(appState));
         },
         [appState]
     );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
