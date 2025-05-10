/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../Components/Context/UserProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import Button from '@mui/material/Button';
import { Box, TextField } from "@mui/material";
import { toast } from "react-toastify";
import CheckConnection from "../../Components/CheckConnection/CheckConnection";
const Users = () => {

    const { token } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [id, setId] = useState(null);
    const [userData, setUserData] = useState({
        qualifications: "",
        jobTitle: ""
    });
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(null);

    async function handleMakeInstructor(user) {
        if (user.roles[0] === "Admin" || user.roles[0] === "Instructor")
            return;
        setShow(true);
        setId(user.id);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const options = {
                url:"https://brightminds.runasp.net/api/Instructor",
                method: "POST",
                data: {
                    "userId": id,
                    "qualifications":userData.qualifications,
                    "jobTitle": userData.jobTitle
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            await axios.request(options);
            setUserData({
                qualifications: "",
                jobTitle:""
            })
            getUsers();
            toast.success("The User Is Upgraded Successfully.");
        } catch (e) {
            console.log(e);
            toast.error("You Must Enter Valid Values.");
        } finally {
            setLoading(false);
        }
        setShow(false);
        setSearch("");
        setPage(1);
    }


    async function getUsers() {
        try {
            const { data } = await axios.get("https://brightminds.runasp.net/api/Account");
            setNumPages(Math.ceil(data.data.count / data.data.pageSize));
            await axios.get(`https://brightminds.runasp.net/api/Account?pageIndex=${page}&pageSize=${data.data.pageSize}`).then(response => response.data).then(data => setUsers(data.data.items));
        } catch (e) {
            console.log(e);
        }
    }

    async function handleSearch(value) {
        setSearch(value);
        setPage(1);
    }

    async function fetchData () {
        try {
            const baseUrl = 'https://brightminds.runasp.net/api/Account';
            const { data } = await axios.get(search.trim() ? `${baseUrl}?PageIndex=${page}&SearchName=${search}` : `${baseUrl}?pageIndex=${page}`);
            setUsers(data.data.items);
            setNumPages(Math.ceil(data.data.count / data.data.pageSize));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {fetchData()}, [page, search]);
    
    return (
        <CheckConnection>
            <Helmet>
                <title>Users</title>
            </Helmet>
            <div className="layout h-screen fixed flex justify-center items-center z-10 w-screen top-0" onClick={() => {
                setShow(false);
                setUserData({
                    qualifications: "",
                    jobTitle: ""
                });
                }} style={{ background: "rgba(0, 0, 0, .4)", backdropFilter: "blur(3px)", transition: "all .4s", left: show ? "0" : "100%" , zIndex:"3"}}>
                <Box onClick={(e) => e.stopPropagation()} onSubmit={e => handleSubmit(e)} component="form"
                    sx={{
                        width: { xs: "90%", sm: "400px" },
                        border: "1px solid #1976d2",
                        padding: "70px 30px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                        background: "#fff"
                    }}
                    >
                    <TextField
                        label="Qualifications"
                        fullWidth
                        type="text"
                        name="qualifications"
                        sx={{ mb: 2 }}
                        value={userData.qualifications}
                        onChange={e => setUserData({ ...userData, qualifications: e.target.value })}
                    />

                    <TextField
                        label="Job Title"
                        fullWidth
                        type="text"
                        name="jobTitle"
                        sx={{ mb: 2 }}
                        value={userData.jobTitle}
                        onChange={e => setUserData({ ...userData, jobTitle: e.target.value })}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            loadingPosition="end"
                            loading={loading}
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                textTransform: "none",
                                px: 4,
                                py: 1.5,
                                fontWeight: "bold",
                                fontSize: "16px",
                                borderRadius: "6px",
                                minWidth: "120px",
                            }}
                        >
                            Upgrade
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            type="button"
                            onClick={() => {
                                setUserData({ qualifications: "", jobTitle: "" })
                                setShow(false);
                            }}
                            sx={{
                            textTransform: "none",
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                            fontSize: "16px",
                            borderRadius: "6px",
                            minWidth: "120px",
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>

                </Box>
            </div>
            
            {users.length || search  ? (
                <main className="flex flex-col gap-3.5" style={{ height: "calc(100vh - 120px)"}}>
                    <h1 className="text-3xl font-extrabold text-center text-white">Users</h1>
                    <div className="flex flex-col overflow-auto">
                        <div className="flex items-end" style={{ marginBottom: "8px" }}>
                            <input type="search" placeholder="Enter The Username ..." value={search} onChange={e => {handleSearch(e.target.value)}} style={{ padding:"8px", width:"30%", border:"1px solid #9e9ea4" }} className="outline-none rounded-sm"/>
                            {(users.length ? <div className="text-right w-full">{page} of {numPages}</div>:null)}
                        </div>

                        {users.length ? <div id="table" className="relative overflow-auto" style={{ marginBottom:"15px"}}>
                            <table className="w-full">
                                <thead>
                                <tr>
                                        <th>User Number</th>
                                        <th>User Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Upgrade To Instructor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => {
                                        return (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>{user.displayName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.roles[0] ?? "user"}</td>
                                                <td className={`${user.roles[0] === "Admin" || user.roles[0] === "Instructor" ? "cursor-auto" : "cursor-pointer"}`} onClick={() => handleMakeInstructor(user)}><p className={user.roles[0] !== "Admin" && user.roles[0] !== "Instructor" ? "text-white" : ""}>{user.roles[0] === "Admin" || user.roles[0] === "Instructor" ? `Already ${user.roles[0]}` : `Upgrade`}</p></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div> : <div className="flex justify-center items-center text-white font-bold" style={{ height: "calc(100vh - 120px)", fontSize: "28px" }}>No Users Founded</div>}

                        {users.length ? <div className="pagination block w-fit" style={{  marginLeft: "auto" }}>
                            <span style={{opacity:page - 1 ? 1 : .3, pointerEvents:page - 1 ? "auto" : "none", marginRight:"10px"}} onClick={() => {
                                setPage(page - 1);
                            }}><i className="fa-solid fa-arrow-left"></i></span>
                            <span style={{ opacity: page !== numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none"}} onClick={() => {
                                setPage(page + 1);
                            }}><i className="fa-solid fa-arrow-right"></i></span>
                        </div> : null}
                    </div>
                
                </main>
            ) : (
                <div style={{ height: "calc(100vh - 120px)" }} className="flex justify-center items-center">
                    <CircularProgress />
                </div>
            )}
        </CheckConnection>
    )
}

export default Users;