import '../styles/global.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { AppWrapper } from "../context/AppContext";

const App = ({ Component, pageProps }) => (
    <>
        <AppWrapper>
            <Component {...pageProps} />
        </AppWrapper>
    </>
);

export default App;
