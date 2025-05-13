/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Box, TextField, Button, FormControl, FormLabel } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";
const EditCourse = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAdmin();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pageNum = location.state?.pageNum;
    const [courseDetail, setCourseDetail] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        categoryId:location.state?.categoryId
    })

    useEffect(() => {getCourseId()}, []);

    async function getCourseId() {
        try {
            const {data} = await axios.get(`https://brightminds.runasp.net/api/Course/${id}`);
            const response = data.data;
            setCourseDetail({ ...courseDetail, name: response.name, description: response.description, price: response.price });
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
            formData.append("Name", courseDetail.name);
            formData.append("Description", courseDetail.description);
            formData.append("Price", parseFloat(courseDetail.price));
            formData.append("CategoryId", courseDetail.categoryId);
            formData.append("Image", courseDetail.image);
            const options = {
                url: `https://brightminds.runasp.net/api/Course/${id}`,
                method: "PUT",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            navigate("/dashboard/courses", { state: { pageNum:pageNum}});
            toast.success("Course Updated Successfully.");
        } catch(e) {
            console.log(e.response.data.statusCode);
            if (e.response.data.statusCode === 403) {
                toast.error("Course Editing Is Not Allowed.")
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
                <title>Editing Course</title>
            </Helmet>
            {isLoading ? <CircularProgress/> : (<Box
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
                
                <TextField
                    label="Price"
                    fullWidth
                    type="text"
                    name="price"
                    sx={{ mb: 2 }}
                    value={courseDetail.price}
                    onChange={e => setCourseDetail({...courseDetail, price:e.target.value})}
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
                        Course Image
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
                        onChange={e => setCourseDetail({ ...courseDetail, image: e.target.files[0] })}/>
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
                        disabled={loading}
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
                        onClick={() => navigate("/dashboard/courses", { state: { pageNum:pageNum}})}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>)}
            </div>
        </CheckConnection>
    )
}

export default EditCourse;