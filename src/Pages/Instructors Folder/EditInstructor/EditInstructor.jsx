/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";
const EditInstructor = () => {

    const navigate = useNavigate();
    const { token } = useAdmin();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [instructorDetail, setInstructorDetail] = useState({
        qualifications: "",
        jobTitle: "",
    })

    useEffect(() => {getInstructorDetails()}, []);

    async function getInstructorDetails() {
        try {
            const { data } = await axios.get(`https://brightminds.runasp.net/api/Instructor/${id}`);
            const response = data.data;
            setInstructorDetail({ qualifications: response.qualifications, jobTitle: response.jobTitle });
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
            const options = {
                url: `https://brightminds.runasp.net/api/Instructor`,
                method: "PUT",
                data: {
                    "userId": id,
                    "qualifications":instructorDetail.qualifications,
                    "jobTitle": instructorDetail.jobTitle
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            await axios.request(options);
            navigate("/dashboard/instructors");
            toast.success("Instructor Updated Successfully.");
        } catch(e) {
            console.log(e);
            toast.error("You Must Enter Valid Values.");
        } finally {
            setLoading(false);
        }
        
    }
    
    return (
        <CheckConnection>
            <div style={{height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Helmet>
                    <title>Editing Instructor</title>
                </Helmet>
                {isLoading  ? <CircularProgress/> : (<Box
                    onSubmit={e => handleSubmit(e)}
                    component="form"
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
                        value={instructorDetail.qualifications}
                        onChange={e => setInstructorDetail({...instructorDetail, qualifications:e.target.value})}
                    />
                    
                    <TextField
                        label="JobTitle"
                        fullWidth
                        type="text"
                        name="jobTitle"
                        sx={{ mb: 2 }}
                        value={instructorDetail.jobTitle}
                        onChange={e => setInstructorDetail({...instructorDetail, jobTitle:e.target.value})}
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
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            type="button"
                            sx={{
                            textTransform: "none",
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                            fontSize: "16px",
                            borderRadius: "6px",
                            minWidth: "120px",
                            }}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>)}
            </div>
        </CheckConnection>
    )
}

export default EditInstructor;