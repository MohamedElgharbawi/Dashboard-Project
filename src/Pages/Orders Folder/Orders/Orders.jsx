/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";

const Orders = () => {
    
    const [orders, setOrders] = useState([]);
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const initialPage = location.state?.pageNum || 1;
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        if (location.state?.pageNum) {
            navigate(location.pathname, { replace: true });
        }
    }, []);

    function handleGetOrder(id) {
        navigate(`/dashboard/orders/${id}`, {state:{pageNum:page}});
    }

    async function getOrders() {
        try {
            const { data } = await axios.get("https://brightminds.runasp.net/api/Order");
            setNumPages(Math.ceil(data.data.count / data.data.pageSize));
            if(data.data.count)
                await axios.get(`https://brightminds.runasp.net/api/Order?pageIndex=${page}&pageSize=${data.data.pageSize}`).then(response => response.data).then(data => setOrders(data.data.items));
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setShow(true);
        }
    }

    useEffect(() => {
        getOrders();
    }, [page]);

    return (
        <CheckConnection>
            
            <Helmet>
                <title>Orders</title>
            </Helmet>
            {
                !orders.length && show ? 
            <div>
                <h1 className="text-white text-3xl font-extrabold text-center">Orders</h1>
                <h2 className="text-center text-white font-bold" style={{ fontSize: "28px", marginBlock:"25px" }}>No Orders Founded</h2>
                <div className="pagination">
                        <span style={{opacity: (page - 1 && page > 0) ? 1 : .3, pointerEvents:page - 1 ? "auto" : "none"}} onClick={() => {
                            setPage(page - 1);
                        }}><i className="fa-solid fa-arrow-left"></i></span>
                        <span style={{ opacity: page !== numPages && numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none"}} onClick={() => {
                            setPage(page + 1);
                        }}><i className="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>
            :
            <>
                {loading ? (
                    <div style={{ height: "calc(100vh - 120px)" }} className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                        ) : (
                        <>
                            <main className="flex flex-col gap-3.5" style={{maxHeight: "calc(100vh - 192px)"}}>
                                <h1 className="text-white text-3xl font-extrabold text-center">Orders</h1>
                                <div className="flex flex-col overflow-auto">
                                    <div className="text-right w-full" style={{top:"-24px"}}>{page} of {numPages}</div>
                                    <div id="table" className="relative overflow-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th>Order Number</th>
                                                    <th>UserName</th>
                                                    <th>Status</th>
                                                    <th>TotalCost</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order, index) => {
                                                    const dateTime = new Date(order.creationDate);
                                                    const localDate = dateTime.toLocaleDateString();
                                                    const localTime = dateTime.toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true
                                                    });

                                                    return (
                                                        <tr key={order.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{order.userName}</td>
                                                            <td className={"font-semibold flex justify-center items-center"} style={{color: order.status.toLowerCase() === "paid" ? "green" : order.status.toLowerCase() === "unpaid" ? "red" : "auto"}}>
                                                                {order.status}
                                                                {order.status.toLowerCase() === "pending" ?
                                                                (
                                                                    <div className="dots">
                                                                        <span className="dot"></span>
                                                                        <span className="dot"></span>
                                                                        <span className="dot"></span>
                                                                    </div>
                                                                )
                                                                :
                                                                ""
                                                            }
                                                            </td>
                                                            <td>{order.totalCost}</td>
                                                            <td>{localDate}</td>
                                                            <td>{localTime}</td>
                                                            <td className="text-white font-extrabold cursor-pointer -tracking-tighter" onClick={() => handleGetOrder(order.id)}>Details</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </main>
                            <div className="pagination" style={{marginTop:"20px"}}>
                                <span style={{opacity:page - 1 ? 1 : .3, pointerEvents:page - 1 ? "auto" : "none"}} onClick={() => {
                                    setPage(page - 1);
                                }}><i className="fa-solid fa-arrow-left"></i></span>
                                <span style={{ opacity: page !== numPages ? 1 : .3, pointerEvents: page !== numPages ? "auto" : "none"}} onClick={() => {
                                    setPage(page + 1);
                                }}><i className="fa-solid fa-arrow-right"></i></span>
                            </div>
                        </>
                )}
            </>
            }
        </CheckConnection>
    )

};

export default Orders;
