import { useState } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { Box, TextField, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const AddSection = () => {

    const location = useLocation();
    const courseId = location.state?.courseId;
    const navigate = useNavigate();
    const { token } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [sectionData, setSectionData] = useState({
        name: "",
        description: "",
        order: "",
        courseId:courseId
    });
    

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const options = {
                url: `https://brightminds.runasp.net/api/Section`,
                method: "POST",
                data: sectionData,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
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
    }
    
    return (
        <CheckConnection>
            <div className="h-full flex justify-center items-center">
            <Helmet>
                <title>Adding Section</title>
            </Helmet>
            <Box
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
                    value={sectionData.name}
                    onChange={e => setSectionData({...sectionData, name:e.target.value})}
                />

                <TextField
                    label="Description"
                    fullWidth
                    type="text"
                    name="description"
                    sx={{ mb: 2 }}
                    value={sectionData.description}
                    onChange={e => setSectionData({...sectionData, description:e.target.value})}
                />
                
                <TextField
                    label="Order"
                    fullWidth
                    type="text"
                    name="order"
                    sx={{ mb: 2 }}
                    value={sectionData.order}
                    onChange={e => setSectionData({...sectionData, order:e.target.value})}
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
            </Box>
        </div>
        </CheckConnection>
        
    )
}

export default AddSection;