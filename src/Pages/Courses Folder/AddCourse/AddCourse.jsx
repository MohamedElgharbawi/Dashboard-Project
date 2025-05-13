/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../../Components/Context/UserProvider";
import { InputLabel, Select, MenuItem , Box, TextField, Button, FormControl, FormLabel} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const AddCourse = () => {
    const navigate = useNavigate();
    const [dataCatge, setDataCateg] = useState([]);
    const { token } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataObj, setDataObj] = useState({
        categoryId: "",
        name: "",
        description: "",
        image: "",
        price:""
    })

    async function getCategory() {
        try {
                await axios.get("https://brightminds.runasp.net/api/Category").then(response => response.data).then(response => {
                const { data } = response;
                setDataCateg(data);
            })
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {getCategory()}, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("CategoryId", dataObj.categoryId);
            formData.append("Name", dataObj.name);
            formData.append("Description", dataObj.description);
            formData.append("Price", dataObj.price);
            formData.append("Image", dataObj.image);
            const options = {
                url: "https://brightminds.runasp.net/api/Course",
                method: "POST",
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            navigate("/dashboard/courses");
            toast.success("Course Added Successfully.");
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
                <title>Adding Course</title>
            </Helmet>
            {isLoading ?  <CircularProgress/> : (<Box
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
                    value={dataObj.name}
                    onChange={e => setDataObj({ ...dataObj, name: e.target.value })}
                />

                <TextField
                    label="Description"
                    fullWidth
                    type="text"
                    name="description"
                    sx={{ mb: 2 }}
                    value={dataObj.description}
                    onChange={e => setDataObj({ ...dataObj, description: e.target.value })}
                />
                
                <TextField
                    label="Price"
                    fullWidth
                    type="text"
                    name="price"
                    sx={{ mb: 2 }}
                    value={dataObj.price}
                    onChange={e => setDataObj({ ...dataObj, price: e.target.value })}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                },
                                className: "custom-scrollbar"
                            },
                        }}
                        labelId="category-label"
                        id="category"
                        name="categoryId"
                        value={dataObj.categoryId}
                        label="Category"
                        onChange={e => setDataObj({ ...dataObj, categoryId: e.target.value })}
                    >
                        {dataCatge.map(data => <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>)}
                    </Select>
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
                        Course Image
                    </FormLabel>
                    <Box
                        component="input"
                        type="file"
                        name="image"
                        onChange={e => setDataObj({ ...dataObj, image: e.target.files[0] })}
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

export default AddCourse;