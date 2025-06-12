/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Box, TextField, Button, FormControl, FormLabel} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";
const AddQuestion = () => {

    const navigate = useNavigate();
    const { id, sectionId, videoId } = useParams();
    const { token } = useAdmin();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { pageNum } = location.state;
    const [questionDetails, setQuestionDetails] = useState({
        title: "",
        option1:"",
        option2:"",
        option3:"",
        option4: "",
        correctAnswer: "",
        attachment: "",
        videoId:videoId,
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("Title", questionDetails.title);
            formData.append("Option1", questionDetails.option1);
            formData.append("Option2", questionDetails.option2);
            formData.append("Option3", questionDetails.option3);
            formData.append("Option4", questionDetails.option4);
            formData.append("VideoId", questionDetails.videoId);
            formData.append("CorrectAnswer", questionDetails.correctAnswer);
            if(questionDetails.attachment) {
                formData.append("Attachment", questionDetails.attachment);
            } else {
                const defaultImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVXNjUPYnb3YoiYebN8a_6u6HK1gcXvWAs7A&s";
                const response = await fetch(defaultImageUrl);
                const blob = await response.blob();
                formData.append("Attachment", blob, "default-question.png");
            }
            const options = {
                url: "https://brightminds.runasp.net/api/Questions",
                method: "POST",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            navigate(`/dashboard/courses/${id}/section/${sectionId}/videos/${videoId}/questions`, { state: { pageNum:pageNum}});
            toast.success("Question Added Successfully.");
        } catch(e) {
            console.log(e);
            toast.error("You Must Enter Valid Values.");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <CheckConnection>
            <div className="h-full flex justify-center items-center">
            <Helmet>
                <title>Adding Question</title>
            </Helmet>
            { (<Box
                onSubmit={e => handleSubmit(e)}
                component="form"
                sx={{
                    width: { xs: "90%", sm: "400px" },
                    border: "1px solid #1976d2",
                    padding: "25px 30px 15px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    background: "#fff"
                }}
            >
                <TextField
                    label="Title"
                    fullWidth
                    name="title"
                    type="text"
                    sx={{ mb: 2 }}
                    value={questionDetails.title}
                    onChange={e => setQuestionDetails({ ...questionDetails, title: e.target.value })}
                />

                <TextField
                    label="Option 1"
                    fullWidth
                    type="text"
                    name="Option 1"
                    sx={{ mb: 2 }}
                    value={questionDetails.option1}
                    onChange={e => setQuestionDetails({ ...questionDetails, option1: e.target.value })}
                />
                
                <TextField
                    label="Option 2"
                    fullWidth
                    type="text"
                    name="Option 2"
                    sx={{ mb: 2 }}
                    value={questionDetails.option2}
                    onChange={e => setQuestionDetails({ ...questionDetails, option2: e.target.value })}
                />
                    
                <TextField
                    label="Option 3"
                    fullWidth
                    type="text"
                    name="Option 3"
                    sx={{ mb: 2 }}
                    value={questionDetails.option3}
                    onChange={e => setQuestionDetails({ ...questionDetails, option3: e.target.value })}
                />
                    
                <TextField
                    label="Option 4"
                    fullWidth
                    type="text"
                    name="Option 4"
                    sx={{ mb: 2 }}
                    value={questionDetails.option4}
                    onChange={e => setQuestionDetails({ ...questionDetails, option4: e.target.value })}
                />
                    
                <TextField
                    label="Correct Answer"
                    fullWidth
                    type="text"
                    name="correctAnswer"
                    sx={{ mb: 2 }}
                    value={questionDetails.correctAnswer}
                    onChange={e => setQuestionDetails({ ...questionDetails, correctAnswer: e.target.value })}
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
                        onChange={e => setQuestionDetails({ ...questionDetails, attachment: e.target.files[0] })}
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
                    />
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
                        Add
                    </Button>

                    <Button
                        disabled={loading}
                        variant="contained"
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

export default AddQuestion;