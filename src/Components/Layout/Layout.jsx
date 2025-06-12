import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Header />
            <div className="flex">
                <Sidebar />
                <div style={{padding:"20px ", flexGrow:"1"}}>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Layout;
