import { useState } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Box, TextField, Button, FormControl, FormLabel } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const AddVideo = () => {

    const navigate = useNavigate();
    const { token } = useAdmin();
    const { sectionId } = useParams();
    const [loading, setLoading] = useState(false);
    const [videoDetail, setVideoDetail] = useState({
        name: "",
        description: "",
        duration: "",
        sectionId:sectionId,
        coverImage: "",
        video:""
    })
        

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("Name", videoDetail.name);
            formData.append("Description", videoDetail.description);
            formData.append("Duration", videoDetail.duration);
            formData.append("SectionId", videoDetail.sectionId);
            formData.append("CoverImage", videoDetail.image);
            formData.append("Video", videoDetail.video);
            const options = {
                url: "https://brightminds.runasp.net/api/Video",
                method: "POST",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            navigate(-1);
            toast.success(data.message);
        } catch(e) {
            console.log(e);
            if(e.response.data.statusCode === 400)
                toast.error("You Must Enter Valid Values.");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <CheckConnection>
            <div className="h-full flex justify-center items-center">
            <Helmet>
                <title>Adding Video</title>
            </Helmet>
            { (<Box
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
                    value={videoDetail.name}
                    onChange={e => setVideoDetail({...videoDetail, name:e.target.value})}
                />

                <TextField
                    label="Description"
                    fullWidth
                    type="text"
                    name="description"
                    sx={{ mb: 2 }}
                    value={videoDetail.description}
                    onChange={e => setVideoDetail({...videoDetail, description:e.target.value})}
                />
                
                <TextField
                    label="Duration"
                    fullWidth
                    type="text"
                    name="duration"
                    sx={{ mb: 2 }}
                    value={videoDetail.duration}
                    onChange={e => setVideoDetail({...videoDetail, duration:e.target.value})}
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
                        Video Image
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
                        onChange={e => setVideoDetail({...videoDetail, image:e.target.files[0]}) }
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel
                    sx={{
                        mb: 1,
                        fontWeight: "bold",
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: "0.875rem"
                    }}
                >
                    Upload Video
                </FormLabel>
                <Box
                    component="input"
                    type="file"
                    name="video"
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
                    onChange={e => setVideoDetail({ ...videoDetail, video: e.target.files[0] })}/>
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
                        Add
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

export default AddVideo;