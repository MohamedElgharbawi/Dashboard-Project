import { Outlet, Navigate } from "react-router-dom";
import { useAdmin } from "../../Components/Context/UserProvider";

const ProtectedRoutes = () => {
    const { token } = useAdmin();
    
    return (
        <>
            {token || localStorage.getItem("token") ? <Outlet/> : <Navigate to={"/"}/>}
        </>
    )
}

export default ProtectedRoutes;