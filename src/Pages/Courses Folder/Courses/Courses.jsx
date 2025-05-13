/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const Courses = () => {

    const [courses, setCourses] = useState([]);
    const { token } = useAdmin();
    const [open, setOpen] = useState(false);
    const [Id, setId] = useState(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    async function getCourses() {
        try {
            const { data } = await axios.get("https://brightminds.runasp.net/api/Course");
            setNumPages(Math.ceil(data.data.count / data.data.pageSize));
            if (data.data.count)
                await axios.get(`https://brightminds.runasp.net/api/Course?pageIndex=${page}&pageSize=${data.data.pageSize}`).then(response => response.data).then(data => setCourses(data.data.items));
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
        setShow(true);
    }

    useEffect(() => {
            getCourses();
    }, [page]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setId(id);
    };

    const handleClose = () => {
        setOpen(false);
        setId(null);
    };

    async function handleDelete(id) {
        try {
            const options = {
                url: `https://brightminds.runasp.net/api/Course/${id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            const updatedCourses = courses.filter(course => course.id !== id);
            setCourses(updatedCourses);
            toast.success("Course Deleted Successfully.");
            if (courses.length === 1) {
                if (page !== 1 && numPages !== 1) {
                    setNumPages(numPages - 1);
                    setPage(page - 1);
                } else if(page === 1 && numPages !== 1) {
                    setPage(1);
                    getCourses();
                }
                else if (page === 1 && numPages === 1) {
                    setPage(0);
                    setNumPages(0);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.response.data.statusCode === 403) {
                toast.error("Course Deletion Is Not Allowed.");
            }
        }
        handleClose();
    }

    async function handleEdit(id, categoryId) {
        navigate(`/dashboard/courses/edit/${id}`, {
            state: { categoryId }
        });
    }

    async function handleSections(id) {
        navigate(`/dashboard/courses/${id}/sections`, {
            state:{id}
        });
    }

    return (
        <CheckConnection>
            <Helmet>
                <title>Courses</title>
            </Helmet>
                    {
                        !courses.length && show ?
                            <div>
                                <h1 className="text-white text-3xl font-extrabold text-center">Courses</h1>
                                <h2 className="text-center text-white font-bold" style={{ fontSize: "28px", marginBlock: "25px" }}>No Courses Founded</h2>
                                <div className="pagination">
                                    <span style={{ opacity: (page - 1 && page > 0) ? 1 : .3, pointerEvents: page - 1 ? "auto" : "none" }} onClick={() => {
                                        setPage(page - 1);
                                    }}><i className="fa-solid fa-arrow-left"></i></span>
                                    <Link to={"/dashboard/courses/add"} style={{ flexGrow: "1" }}><Button variant="contained" color="primary" type="submit" sx={{ textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" }, width: "100%" }}>Add Course</Button></Link>
                                    <span style={{ opacity: page !== numPages && numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none" }} onClick={() => {
                                        setPage(page + 1);
                                    }}><i className="fa-solid fa-arrow-right"></i></span>
                                </div>
                            </div>
                            :
                            <>
                                {loading ? (
                                    <div style={{ height: "calc(100vh - 120px)" }} className="flex justify-center items-center">
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <>
                                        <main className="flex flex-col gap-3.5" style={{ maxHeight: "calc(100vh - 192px)" }}>
                                            <h1 className="text-white text-3xl font-extrabold text-center">Courses</h1>
                                            <div className="flex flex-col overflow-auto">
                                                <div className="text-right w-full" style={{ top: "-24px" }}>{page} of {numPages}</div>
                                                <div id="table" className="relative border-t border-b overflow-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr>
                                                                <th>Course Number</th>
                                                                <th>Course</th>
                                                                <th>InstructorName</th>
                                                                <th>Picture</th>
                                                                <th>Price</th>
                                                                <th>Rate</th>
                                                                <th>Sections</th>
                                                                <th>Edit</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {courses.map((course, index) => {
                                                                return (
                                                                    <tr key={course.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{course.name}</td>
                                                                        <td>{course.instructorName}</td>
                                                                        <td><img src={course.pictureUrl} alt={course.course} /></td>
                                                                        <td>{course.price} $</td>
                                                                        <td>{course.rate}</td>
                                                                        <td className="fontawesome-icon" onClick={() => handleSections(course.id)}><i className="fa-solid fa-layer-group"></i></td>
                                                                        <td className="fontawesome-icon" onClick={() => { handleEdit(course.id, course.categoryId) }}><i className="fa-solid fa-edit"></i></td>
                                                                        <td className="fontawesome-icon" onClick={() => handleClickOpen(course.id)}><i className="fa-solid fa-trash" ></i></td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </main>
                                        <div className="pagination" style={{ marginTop: "20px" }}>
                                            <span style={{ opacity: page - 1 ? 1 : .3, pointerEvents: page - 1 ? "auto" : "none" }} onClick={() => {
                                                setPage(page - 1);
                                            }}><i className="fa-solid fa-arrow-left"></i></span>
                                            <Link to={"/dashboard/courses/add"} style={{ flexGrow: "1" }}><Button variant="contained" color="primary" type="submit" sx={{ textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" }, width: "100%" }}>Add Course</Button></Link>
                                            <span style={{ opacity: page !== numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none" }} onClick={() => {
                                                setPage(page + 1);
                                            }}><i className="fa-solid fa-arrow-right"></i></span>
                                        </div>
                                    </>
                                )}
                                <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                    <DialogTitle id="alert-dialog-title">
                                        {"Are You Sure You Want To Delete This Course ?"}
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
                            </>
                    }
            </CheckConnection>
    )
};

export default Courses;