/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Box, TextField, Button, CircularProgress } from "@mui/material";
import { useAdmin } from "../../../Components/Context/UserProvider";
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";
const EditSection = () => {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { sectionId } = useParams();
    const navigate = useNavigate();
    const { token } = useAdmin();
    const [courseDetail, setCourseDetail] = useState({
        name: "",
        description: "",
        courseId: "",
        order:""
    });
    
    async function fetchSectionData() {
        try {
            setIsLoading(true);
            const options = {
                url: `https://brightminds.runasp.net/api/Section/${sectionId}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            setCourseDetail({
                name: data.data.name,
                description: data.data.description,
                courseId: data.data.courseId,
                order: data.data.order
            });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!token) {
            setIsLoading(true);
            return;
        }
        fetchSectionData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const options = {
                url: `https://brightminds.runasp.net/api/Section/${sectionId}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                data:courseDetail
            }
            const { data } = await axios.request(options);
            navigate(-1);
            toast.success(data.message);
        } catch (e) {
            console.log(e);
            if(e.response.data.statusCode === 400)
                toast.error("You Must Enter Valid Values.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CheckConnection>
            <div className="h-full flex justify-center items-center">
            <Helmet>
                <title>
                    Editing Section
                </title>
            </Helmet>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: { xs: "90%", sm: "400px" },
                        margin: "auto",
                        border: "1px solid #1976d2",
                        padding: "70px 30px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                        background: "#fff"
                    }}
                >
                    <TextField
                        label="Name"
                        fullWidth
                        name="name"
                        type="text"
                        sx={{ mb: 2 }}
                        value={courseDetail.name}
                        onChange={e => setCourseDetail({...courseDetail, name:e.target.value})}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        type="text"
                        name="description"
                        sx={{ mb: 2 }}
                        value={courseDetail.description}
                        onChange={e => setCourseDetail({...courseDetail, description:e.target.value})}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
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
                </Box>
            )}
        </div>
        </CheckConnection>
        
    );
};

export default EditSection;
