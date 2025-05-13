/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Box, TextField, Button, FormControl, FormLabel } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";
const EditVideo = () => {
    const navigate = useNavigate();
    const { token } = useAdmin();
    const { sectionId, videoId } = useParams();

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [videoDetail, setVideoDetail] = useState({
        name: "",
        description: "",
        duration: "",
        sectionId: sectionId,
        coverImage: "",
        video: ""
    });

    useEffect(() => { getVideoData() }, []);

    async function getVideoData() {
        try {
            const { data } = await axios.get(`https://brightminds.runasp.net/api/Video/${videoId}`);
            const response = data.data;
            setVideoDetail({
                ...videoDetail,
                name: response.name,
                description: response.description,
                duration: response.duration,
            });
        } catch (e) {
            console.log(e);
            toast.error("Failed to load video data.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'image') {
            if (file && file.type.startsWith("image/")) {
                setVideoDetail({ ...videoDetail, coverImage: file });
            } else {
                toast.error("Please select a valid image file.");
            }
        } else if (type === 'video') {
            if (file && file.type.startsWith("video/")) {
                setVideoDetail({ ...videoDetail, video: file });
            } else {
                toast.error("Please select a valid video file.");
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("Name", videoDetail.name);
            formData.append("Description", videoDetail.description);
            formData.append("Duration", videoDetail.duration);
            formData.append("SectionId", videoDetail.sectionId);
            formData.append("CoverImage", videoDetail.coverImage);
            formData.append("Video", videoDetail.video);
            const options = {
                url: `https://brightminds.runasp.net/api/Video/${videoId}`,
                method: "PUT",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            await axios.request(options);
            toast.success("Video Updated Successfully.");
            navigate(-1);
        } catch (e) {
            console.log(e);
            if(e.response.data.statusCode === 400)
                toast.error("You Must Enter Valid Values.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <CheckConnection>
            <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Helmet>
                <title>Editing Video</title>
            </Helmet>
            {isLoading ? <CircularProgress /> : (
                <Box
                    onSubmit={handleSubmit}
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
                        onChange={e => setVideoDetail({ ...videoDetail, name: e.target.value })}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        type="text"
                        name="description"
                        sx={{ mb: 2 }}
                        value={videoDetail.description}
                        onChange={e => setVideoDetail({ ...videoDetail, description: e.target.value })}
                    />

                    <TextField
                        label="Duration"
                        fullWidth
                        type="text"
                        name="duration"
                        sx={{ mb: 2 }}
                        value={videoDetail.duration}
                        onChange={e => setVideoDetail({ ...videoDetail, duration: e.target.value })}
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
                            onChange={e => handleFileChange(e, 'image')}
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
                            onChange={e => handleFileChange(e, 'video')}
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
                                py: 1.5,
                                fontWeight: "bold",
                                fontSize: "16px",
                                borderRadius: "6px",
                                minWidth: "120px",
                            }}
                        >
                            {loading ? "Updating..." : "Edit"}
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
}

export default EditVideo;
