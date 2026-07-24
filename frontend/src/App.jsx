import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <>
            <Dashboard />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </>
    );
}

export default App;