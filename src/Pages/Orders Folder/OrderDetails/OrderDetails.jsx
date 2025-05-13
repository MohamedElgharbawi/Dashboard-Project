/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { Helmet } from "react-helmet";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const OrderDetails = () => {

    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const pageNum = location.state.pageNum;

    async function getOrder() {
        try {
            axios.get(`https://brightminds.runasp.net/api/Order/${orderId}`).then(data => data.data).then(response => {
                const { data } = response;
                setOrder(data);
                const dateTime = new Date(data.creationDate);
                setDate(dateTime.toLocaleDateString());
                setTime(dateTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));
            });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrder();
    }, [])

    return (
        <CheckConnection>
            <Helmet>
                <title>
                    Order Details
                </title>
            </Helmet>
            {loading || !Object.keys(order).length ?
                <div className="h-full flex justify-center items-center">
                    <CircularProgress />
                </div>
                :
                <div className="flex flex-col h-full">
                    
                    <div className="cart bg-white rounded-lg flex flex-col gap-1 w-fit" style={{padding:"40px", marginInline:"auto"}}>
                        <h2 className="text-2xl font-semibold text-black">Name: {order.userName}</h2>
                        <div className="flex items-center gap-2 text-black" style={{ fontSize: "18px" }}><span className="font-bold" style={{fontSize:"20px"}}>Status:</span><p className="flex justify-center items-center w-fit rounded-sm text-white font-semibold" style={{ background: order.status.toLowerCase() === "paid" ? "green" : order.status.toLowerCase() === "unpaid" ? "red" : "#333", padding: "5px 15px" }}>{order.status}{order.status.toLowerCase() === "pending" ?
                            (
                                <div className="dots">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            )
                            :
                            null
                            }</p></div>
                        <p className="font-extrabold" style={{ color:"#333"}}><span className="font-bold text-black" style={{fontSize:"20px"}}>Price: </span>{order.totalCost}$</p>
                        <p className="font-extrabold" style={{ color:"#333", fontSize:"15px"}}><span className="font-bold text-black" style={{fontSize:"16px"}}>Date:</span>{date}</p>
                        <p className="font-extrabold" style={{ color:"#333", fontSize:"15px"}}><span className="font-bold text-black" style={{fontSize:"16px"}}>Time:</span>{time}</p>
                    </div>
                    <div className="items flex justify-evenly flex-wrap gap-3 overflow-auto" style={{marginTop:"30px", height:"calc(100vh - 465px)"}}>
                        {order.items.map(item => {
                            return (
                                <div key={item.id} className="item flex items-center gap-2 bg-white rounded-lg h-fit" style={{ padding: "20px" }}>
                                    <img src={item.imageUrl} alt={item.courseName} style={{width:"70px",height:"70px", borderRadius:"50%"}} />
                                    <div>
                                        <p className="text-black font-semibold">CourseName: {item.courseName}</p>
                                        <p className="text-black font-extrabold" style={{fontSize:"14px"}}>Price: {item.price}$</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <Button onClick={() => navigate("/dashboard/orders", { state: {pageNum:pageNum}})} variant="contained" color="primary" type="submit" sx={{ textTransform: "none", padding: "12px 30px", fontWeight: "bold", fontSize: "16px", borderRadius: "5px", boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)", transition: "all 0.3s ease", ":hover": { backgroundColor: "#1565c0" }, width:"100%", marginTop:"20px"}}>Back</Button>
                </div>
            }
        </CheckConnection>
    )
}

export default OrderDetails;