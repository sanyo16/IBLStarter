import '../styles/global.css';
import { useState } from "react"

const App = ({ Component, pageProps }) => {
    const [componentData, setComponentData] = useState({});
    const updateComponentData = (newData) => {
        setComponentData({ ...componentData, ...newData });
    };

    return <Component {...pageProps} updateData = { updateComponentData } inputData = { componentData } />;
};

export default App;
