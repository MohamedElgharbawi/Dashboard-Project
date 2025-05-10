/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
import Instructor from "../../../Components/Instructor/Instructor";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const Instructors = () => {

    const [instructors, setInstructors] = useState([]);
    const { token } = useAdmin();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [Id, setId] = useState(null);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const handleClickOpen = (id) => {
        setOpen(true);
        setId(id);
    };
    
    const handleClose = () => {
        setOpen(false);
        setId(null);
    };

    async function getInstructors() {
        try {
            const { data } = await axios.get("https://brightminds.runasp.net/api/Instructor");
            setNumPages(Math.ceil(data.data.count / data.data.pageSize));
            if (data.data.count)
                await axios.get(`https://brightminds.runasp.net/api/Instructor?pageIndex=${page}&pageSize=${data.data.pageSize}`).then(response => response.data).then(data => setInstructors(data.data.items));
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
        setShow(true);
    }

    useEffect(() => {
        getInstructors();
    }, [page]);

    async function handleDelete(id) {
        try {
            const options = {
                url: `https://brightminds.runasp.net/api/Instructor/${id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            await axios.request(options);
            const updatedInstructors = instructors.filter((instructor) => instructor.userId !== id);
            setInstructors(updatedInstructors);
            if (instructors.length === 1) {
                if (page !== 1 && numPages !== 1) {
                    setNumPages(numPages - 1);
                    setPage(page - 1);
                } else if(page === 1 && numPages !== 1) {
                    setPage(1);
                    getInstructors();
                }
                else if (page === 1 && numPages === 1) {
                    setPage(0);
                    setNumPages(0);
                }
            }
        } catch (e) {
            console.log(e);
        }
        handleClose();
    }

    async function handleEdit(id) {
        navigate(`/dashboard/instructors/edit/${id}`);
    } 

    
    return (
        <CheckConnection>
            <Helmet>
                <title>Instructors</title>
            </Helmet>


            { !instructors.length && show ?
            <div>
                <h1 className="text-white text-3xl font-extrabold text-center">Instructors</h1>
                <h2 className="text-center text-white font-bold" style={{ fontSize: "28px", marginTop:"25px" }}>No Instructors Founded</h2>
            </div>
                :
            <>
                {loading ? (
                    <div style={{ height: "calc(100vh - 120px)" }} className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <main className="flex flex-col gap-3.5" style={{ height: "calc(100vh - 120px)" }}>
                        <h1 className="text-3xl font-extrabold text-center text-white">Instructors</h1>
                        <div className="flex flex-col overflow-auto">
                            <div className="text-right w-full">{page} of {numPages}</div>
                            <div id="table" className="relative overflow-auto border-t border-b" style={{ marginBottom:"15px"}}>
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>Instructor Number</th>
                                            <th>InstructorName</th>
                                            <th>JobTitle</th>
                                            <th>Picture</th>
                                            <th>Qualifications</th>
                                            <th>Email</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {instructors.map((instructor, index) => {
                                            return <Instructor key={instructor.userId} instructor={instructor} index={index} handleEdit={handleEdit} handleClickOpen={handleClickOpen} />
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination block w-fit" style={{ marginLeft: "auto" }}>
                                <span style={{opacity:page - 1 ? 1 : .3, pointerEvents:page - 1 ? "auto" : "none", marginRight:"10px"}} onClick={() => {
                                    setPage(page - 1);
                                }}><i className="fa-solid fa-arrow-left"></i></span>
                                <span style={{ opacity: page !== numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none"}} onClick={() => {
                                    setPage(page + 1);
                                }}><i className="fa-solid fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </main>
                )}
                <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Are You Sure You Want To Delete The Instructor ?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You Cannot Undo The Deletion Once It Is Completed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleDelete(Id)} autoFocus sx={{ color: "#f72b41", fontWeight: "bold" }}>Agree</Button>
                        <Button onClick={handleClose}>Disagree</Button>
                    </DialogActions>
                </Dialog>
            </>}
        </CheckConnection>
    )
};

export default Instructors;