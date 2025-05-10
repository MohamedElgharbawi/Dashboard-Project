import { Link } from "react-router-dom";
import { useAdmin } from "../../Components/Context/UserProvider";
import { useEffect } from "react";

const Header = () => {

  const { admin, setAdmin, setToken } = useAdmin();

  useEffect(() => {
      if (localStorage.getItem("displayName") && !admin) 
        setAdmin(localStorage.getItem("displayName"));
  }, [admin, setAdmin]);

  return (
    <header className="header flex justify-between items-center h-20 shadow border-b" style={{paddingInline:"20px", background:"#263043"}}>
        <div className='header-left font-bold text-2xl'>Dashboard</div>
        <div className='header-right flex gap-8 items-center'>
          <p className='name font-bold tracking-wide text-white' style={{ fontSize: "20px" }}>{admin}</p>
          <div className="icons flex gap-4">
            <Link to={"/"} onClick={() => {
              localStorage.clear();
              setToken(null);
            }}>
              <i className="fa-solid fa-right-from-bracket cursor-pointer logout"></i>
            </Link>  
          </div>
      </div>
    </header>
  );
}

export default Header;
