/* eslint-disable react/no-unescaped-entities */
import Button from '@mui/material/Button';
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import CheckConnection from '../../Components/CheckConnection/CheckConnection';

const NotFound = () => {

    const navigate = useNavigate();

    
        return (
            <CheckConnection>
                <div className="h-screen flex flex-col justify-center items-center text-center text-white">
                    <Helmet>
                        <title>404 Not Found</title>
                    </Helmet>
                    <h1 className="text-9xl">404</h1>
                    <h2 className="text-3xl" style={{marginBlock:"20px"}}>Page Not Found</h2>
                    <p className="text-xl max-w-lg mx-auto capitalize" style={{marginBottom:"20px"}}>
                        Sorry, we can't find the page you're looking for. Please check the link or return to the home page.
                    </p>
                    <Button variant="contained" onClick={() => navigate(-1)} className="no-underline rounded text-white" style={{ padding: "10px 25px", fontWeight:"bolder" }}>
                        Back
                    </Button>
                </div>
            </CheckConnection>
        );
}

export default NotFound;