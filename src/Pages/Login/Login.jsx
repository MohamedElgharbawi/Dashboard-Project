/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import img from "../../assets/imgs/pngtree-light-blue-geometric-lines-simple-business-background-design-picture-image_1299258.jpg";
import { useAdmin } from "../../Components/Context/UserProvider";
import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {

    const [loading, setLoading] = useState(false);
    function handleClick() {
        setLoading(true);
    }

    const [isLoading, setIsLoading] = useState(true);

    const { setAdmin, setToken } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token"))
            navigate("/dashboard");
        else
            setIsLoading(false);
    }, []);

    const validation = Yup.object({
        email: Yup.string().required("The Email Is Required").email("The Email Is Not Valid"),
        password: Yup.string().required("The Password Is Required")
            .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            handleClick();
            try {
                const response = await axios.post("https://brightminds.runasp.net/api/Account/login", values);
                const { data } = response;
                if (response.status === 200 && data?.user && data?.token) {
                    console.log(data.token);
                    setAdmin(data.user.displayName);
                    setToken(data.token);
                    localStorage.setItem("displayName", data.user.displayName);
                    localStorage.setItem("token", data.token);
                    toast.success(`Hello ${data.user.displayName}`);
                    navigate("/dashboard");
                }
            } catch (e) {
                toast.error(`${e.response?.data?.message || 'Error occurred'}`);
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            {isLoading ? <CircularProgress/> : <div
                style={{
                    height: "100vh",
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                
                (<Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{
                        width: { xs: "90%", sm: "400px" },
                        border: "1px solid #1976d2",
                        padding: "70px 30px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                        background: "#fff"
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#1976d2",
                            textAlign: "center",
                            mb: 4,
                            fontWeight: "bold",
                        }}
                    >
                        Login
                    </Typography>

                    <TextField
                        label="Email"
                        fullWidth
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ mb: 2 }}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                    />
                    {formik.errors.email && formik.touched.email && (
                        <Typography
                            sx={{
                                color: "#d32f2f",
                                mb: 2,
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                            }}
                        >
                            * {formik.errors.email}
                        </Typography>
                    )}

                    <TextField
                        label="Password"
                        fullWidth
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ mb: 2 }}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <Typography
                            sx={{
                                color: "#d32f2f",
                                mb: 2,
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                            }}
                        >
                            * {formik.errors.password}
                        </Typography>
                    )}

                    <Button
                        loadingPosition="end"
                        loading={loading}
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{
                            textTransform: "none",
                            padding: "12px 30px",
                            fontWeight: "bold",
                            fontSize: "16px",
                            display: "flex",
                            margin: "0 auto",
                            borderRadius: "6px",
                            boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)",
                            transition: "all 0.3s ease",
                            ":hover": {
                                backgroundColor: "#1565c0",
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>) 
            </div>}
        </>
    );
}

export default Login;

// esamabdelnaby@gmail.com
// Password123!