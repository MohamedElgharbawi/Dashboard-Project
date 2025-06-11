import { BsFillArchiveFill, BsPeopleFill, BsMenuButtonWideFill } from 'react-icons/bs';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    return (
        <aside
            id="sidebar"
            className="border-r"
            style={{
                height: "calc(100vh - 80px)",
                backgroundColor: "#263043",
                minWidth: "210px"
            }}
        >
            <Link
                to={"/dashboard"}
                className="sidebar-title flex justify-between items-center"
                style={{ padding: "20px" }}
            >
                <div
                    className="sidebar-brand font-bold"
                    style={{ fontSize: "20px" }}
                >
                    <i className="fa-solid fa-brain text-2xl ml-2 text-primary-500 mr-2"></i> Bright-Routes
                </div>
            </Link>

            <ul className="sidebar-list list-none">
                <li onClick={() => navigate("/dashboard/courses")} className={`sidebar-list-item ${isActive("/dashboard/courses") ? "active" : ""}`}>
                    <NavLink to="/dashboard/courses">
                        <BsFillArchiveFill className="icon" /> Courses
                    </NavLink>
                </li>
                <li onClick={() => navigate("/dashboard/instructors")} className={`sidebar-list-item ${isActive("/dashboard/instructors") ? "active" : ""}`}>
                    <NavLink to="/dashboard/instructors">
                        <BsPeopleFill className="icon" /> Instructors
                    </NavLink>
                </li>
                <li onClick={() => navigate("/dashboard/users")} className={`sidebar-list-item ${isActive("/dashboard/users") ? "active" : ""}`}>
                    <NavLink to="/dashboard/users">
                        <GroupsIcon /> Users
                    </NavLink>
                </li>
                <li onClick={() => navigate("/dashboard/orders")} className={`sidebar-list-item ${isActive("/dashboard/orders") ? "active" : ""}`}>
                    <NavLink to="/dashboard/orders">
                        <BsMenuButtonWideFill className="icon" /> Orders
                    </NavLink>
                </li>
                <li onClick={() => navigate("/dashboard/questions")} className={`sidebar-list-item ${isActive("/dashboard/questions") ? "active" : ""}`}>
                    <NavLink to="/dashboard/questions">
                        Questions
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
