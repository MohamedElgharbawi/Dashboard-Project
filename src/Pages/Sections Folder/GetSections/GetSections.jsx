/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Cart from "../../../Components/Cart/Cart";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const GetSections = () => {
    const { id } = useParams();
    const [sections, setSections] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const { token } = useAdmin();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const courseId = location.state?.id;

    const getSections = async () => {
        try {
            const { data } = await axios.get(`https://brightminds.runasp.net/api/Section/course/${id}`);
            setSections(data.data);
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { getSections() }, []);

    const handleClickOpen = (sectionId) => {
        setSelectedSectionId(sectionId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedSectionId(null);
    };

    const handleDelete = async () => {
        try {
            const options = {
                url:`https://brightminds.runasp.net/api/Section/${selectedSectionId}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            setSections(prev => prev.filter(section => section.id !== selectedSectionId));
            handleClose();
            toast.success("Section Deleted Successfully.");
        } catch (e) {
            console.log(e);
        }
    };

    function handleAdd() {
        navigate("/dashboard/courses/sections/add", {
            state:{courseId}
        })
    }

    return (
        <CheckConnection>
            <section style={{ height: "calc(100vh - 120px)" }}>
            <Helmet>
                <title>
                    Sections
                </title>
            </Helmet>
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <CircularProgress />
                </div>
            ) : sections.length ?  (
                <div className="h-full">
                    <h2 className="text-white text-3xl text-center font-extrabold" style={{ marginBottom: "20px" }}>Sections</h2>
                    <div id="all-carts" className="flex flex-wrap justify-evenly overflow-auto gap-5" style={{ height: "calc(100% - 190px)" }}>
                    {sections.map(section => {
                        return <Cart key={section.id} section={section} onDeleteClick={handleClickOpen} />;
                    })}
                    </div>
                    <div className="flex items-center flex-col gap-2" style={{ marginTop:"20px" }}>
                        <Button onClick={handleAdd} variant="contained" color="primary" type="button" sx={{ textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" },width:"100%"}}>Add Section</Button>
                        <Button variant="contained" color="error" type="button" sx={{ textTransform: "none", px: 4, py: 1.5, fontWeight: "bold", fontSize: "16px", borderRadius: "6px", minWidth: "120px",width:"100%" }}onClick={() => navigate(-1)}>Back</Button>
                    </div>
                </div>
            ) : <div className="flex justify-center items-center h-full text-white font-bold flex-col gap-5" style={{ fontSize: "28px" }}>
                    <p>No Sections Founded</p>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleAdd} variant="contained" color="primary" type="button" sx={{ textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" }}}>Add Section</Button>
                        <Button variant="contained" color="error" type="button" sx={{ textTransform: "none", px: 4, py: 1.5, fontWeight: "bold", fontSize: "16px", borderRadius: "6px", minWidth: "120px" }}onClick={() => navigate(-1)}>Back</Button>
                    </div>
                </div>}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Are You Sure You Want To Delete This Section?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You Cannot Undo The Deletion Once It Is Completed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Agree
                    </Button>
                    <Button onClick={handleClose}>Disagree</Button>
                </DialogActions>
            </Dialog>
        </section>
        </CheckConnection>
    );
};

export default GetSections;
