/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../Components/Context/UserProvider";
import { Box, TextField, Button, FormControl, FormLabel } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../Components/CheckConnection/CheckConnection";
const EditQuestion = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAdmin();
    const { id, sectionId, questionId, videoId } = useParams();
    console.log(id, sectionId)
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pageNum = location.state?.pageNum;
    const [questionDetails, setQuestionDetails] = useState({
        title: "",
        Option1:"", 
        Option2:"", 
        Option3:"", 
        Option4: "", 
        correctAnswer: "",
        attachment: "",
        videoId:videoId
    })

    useEffect(() => {getQuestion()}, []);

    async function getQuestion() {
        try {
            const {data} = await axios.get(`https://brightminds.runasp.net/api/Questions/${questionId}`);
            const response = data.data;
            console.log(response);
            setQuestionDetails({ ...questionDetails, title: response.title, Option1: response.option1, Option2: response.option2, Option3: response.option3, Option4: response.option4, correctAnswer: response.correctAnswer, attachment:response.attachmentUrl });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("Title", questionDetails.title);
            formData.append("Attachment", questionDetails.attachment);
            formData.append("Option1", questionDetails.Option1);
            formData.append("Option2", questionDetails.Option2);
            formData.append("Option3", questionDetails.Option3);
            formData.append("Option4", questionDetails.Option4);
            formData.append("CorrectAnswer", questionDetails.correctAnswer);
            formData.append("VideoId", questionDetails.videoId);
            const options = {
                url: `https://brightminds.runasp.net/api/Questions/${questionId}`,
                method: "PUT",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            navigate(`/dashboard/courses/${id}/section/${sectionId}/videos/${videoId}/questions`, { state: { pageNum:pageNum}});
            toast.success("Question Updated Successfully.");
        } catch(e) {
            console.log(e.response.data.statusCode);
            if (e.response.data.statusCode === 403) {
                toast.error("Question Editing Is Not Allowed.")
            } else if(e.response.data.statusCode === 400) {
                toast.error("You Must Enter Valid Values.");
            } 
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <CheckConnection>
            <div className="h-full flex justify-center items-center">
            <Helmet>
                <title>Editing Question</title>
            </Helmet>
            {isLoading ? <CircularProgress/> : (<Box
                onSubmit={e => handleSubmit(e)}
                component="form"
                sx={{
                    width: { xs: "90%", sm: "400px" },
                    border: "1px solid #1976d2",
                    padding: "30px 30px 10px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    background: "#fff",
                }}
            >
                <TextField
                    label="Title"
                    fullWidth
                    name="title"
                    type="text"
                    sx={{ mb: 2 }}
                    value={questionDetails.title}
                    onChange={e => setQuestionDetails({...questionDetails, title:e.target.value})}
                />

                <TextField
                    label="Opinion 1"
                    fullWidth
                    type="text"
                    name="Opinion 1"
                    sx={{ mb: 2 }}
                    value={questionDetails.Option1}
                    onChange={e => setQuestionDetails({...questionDetails, Option1:e.target.value})}
                />
                
                <TextField
                    label="Option2"
                    fullWidth
                    type="text"
                    name="Option2"
                    sx={{ mb: 2 }}
                    value={questionDetails.Option2}
                    onChange={e => setQuestionDetails({...questionDetails, Option2:e.target.value})}
                />
                    
                <TextField
                    label="Option3"
                    fullWidth
                    type="text"
                    name="Option3"
                    sx={{ mb: 2 }}
                    value={questionDetails.Option3}
                    onChange={e => setQuestionDetails({...questionDetails, Option3:e.target.value})}
                />
                    
                <TextField
                    label="Option4"
                    fullWidth
                    type="text"
                    name="Option4"
                    sx={{ mb: 2 }}
                    value={questionDetails.Option4}
                    onChange={e => setQuestionDetails({...questionDetails, Option4:e.target.value})}
                />
                    
                <TextField
                    label="correctAnswer"
                    fullWidth
                    type="text"
                    name="correctAnswer"
                    sx={{ mb: 2 }}
                    value={questionDetails.correctAnswer}
                    onChange={e => setQuestionDetails({...questionDetails, correctAnswer:e.target.value})}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel
                        sx={{
                            mb: 1,
                            fontWeight: "bold",
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "0.875rem"
                        }}
                    >
                        Question Image
                    </FormLabel>
                    <Box
                        component="input"
                        type="file"
                        name="image"
                        sx={{
                            border: "1px solid rgba(0, 0, 0, 0.23)",
                            borderRadius: "4px",
                            padding: "10.5px 14px",
                            fontSize: "16px",
                            '&::file-selector-button': {
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                mr: 2,
                                fontWeight: "bold"
                            }
                        }}
                        onChange={e => setQuestionDetails({ ...questionDetails, attachment: e.target.files[0] })}/>
                </FormControl>

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
                        py: 1,
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderRadius: "6px",
                        minWidth: "120px",
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="contained"
                        disabled={loading}
                        color="error"
                        type="button"
                        sx={{
                        textTransform: "none",
                        px: 4,
                        py: 1,
                        fontWeight: "bold",
                        fontSize: "16px",
                        borderRadius: "6px",
                        minWidth: "120px",
                        }}
                        onClick={() => navigate(`/dashboard/courses/${id}/section/${sectionId}/videos/${videoId}/questions`, { state: { pageNum:pageNum}})}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>)}
            </div>
        </CheckConnection>
    )
}

export default EditQuestion;