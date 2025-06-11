/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../Components/Context/UserProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../Components/CheckConnection/CheckConnection";

const Questions = () => {

    const { videoId } = useParams();
    const location = useLocation();
    const [questions, setQuestions] = useState([]);
    const { token } = useAdmin();
    const [open, setOpen] = useState(false);
    const [Id, setId] = useState(null);
    const navigate = useNavigate();
    const initialPage = location.state?.pageNum || 1;
    const [page, setPage] = useState(initialPage);
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (location.state?.pageNum) {
            navigate(location.pathname, { replace: true });
        }
    }, []);
    
    async function getQuestions() {
        try {
            const { data } = await axios.get("https://brightminds.runasp.net/api/Questions");
            setNumPages(Math.ceil(data.data.count / data.data.pageSize));
            if (data.data.count)
                await axios.get(`https://brightminds.runasp.net/api/Questions?PageIndex=${page}&PageSize=${data.data.pageSize}&VideoId=${211}`).then(response => response.data).then(data => setQuestions(data.data.items));
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
        setShow(true);
    }

    useEffect(() => {
            getQuestions();
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
                url: `https://brightminds.runasp.net/api/Questions/${id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            const updatedQuestions = questions.filter(question => question.id !== id);
            setQuestions(updatedQuestions);
            toast.success("Question Deleted Successfully.");
            if (questions.length === 1) {
                if (page !== 1 && numPages !== 1) {
                    setNumPages(numPages - 1);
                    setPage(page - 1);
                } else if(page === 1 && numPages !== 1) {
                    setPage(1);
                    getQuestions();
                }
                else if (page === 1 && numPages === 1) {
                    setPage(0);
                    setNumPages(0);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.response.data.statusCode === 403) {
                toast.error("Question Deletion Is Not Allowed.");
            }
        }
        handleClose();
    }

    async function handleEdit(id, categoryId) {
        navigate(`/dashboard/courses/edit/${id}`, {
            state: { categoryId, pageNum:page }
        });
    }

    async function handleSections(id) {
        navigate(`/dashboard/courses/${id}/sections`, {
            state:{id, pageNum:page}
        });
    }

    return (
        <CheckConnection>
            <Helmet>
                <title>Questions</title>
            </Helmet>
                    {
                        !questions.length && show ?
                            <div>
                                <h1 className="text-white text-3xl font-extrabold text-center">Questions</h1>
                                <h2 className="text-center text-white font-bold" style={{ fontSize: "28px", marginBlock: "25px" }}>No Questions Founded</h2>
                                <div className="pagination">
                                    <span style={{ opacity: (page - 1 && page > 0) ? 1 : .3, pointerEvents: page - 1 ? "auto" : "none" }} onClick={() => {
                                        setPage(page - 1);
                                    }}><i className="fa-solid fa-arrow-left"></i></span>
                                    <Link to={"/dashboard/courses/add"} style={{ flexGrow: "1" }}><Button variant="contained" color="primary" type="submit" sx={{ textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" }, width: "100%" }}>Add Question</Button></Link>
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
                                                                <th>Question Image</th>
                                                                <th>Question Number</th>
                                                                <th>Edit</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {questions.map((question, index) => {
                                                            console.log(question);
                                                                return (
                                                                    <tr key={question.id}>
                                                                        <td><img src={question.attachmentUrl} alt={question.title}/></td>
                                                                        <td className="cursor-pointer question-number">Question Number { index + 1 }</td>
                                                                        <td className="fontawesome-icon" onClick={() => { handleEdit(question.id, question.categoryId) }}><i className="fa-solid fa-edit"></i></td>
                                                                        <td className="fontawesome-icon" onClick={() => handleClickOpen(question.id)}><i className="fa-solid fa-trash" ></i></td>
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
                                            <Button onClick={() => navigate("/dashboard/courses/add", {state:{pageNum:page}})} variant="contained" color="primary" type="submit" sx={{ flexGrow: "1", textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" }, width: "100%" }}>Add Question</Button>
                                            <span style={{ opacity: page !== numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none" }} onClick={() => {
                                                setPage(page + 1);
                                            }}><i className="fa-solid fa-arrow-right"></i></span>
                                        </div>
                                    </> 
                                )}
                                <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                    <DialogTitle id="alert-dialog-title">
                                        {"Are You Sure You Want To Delete This Question ?"}
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

export default Questions;