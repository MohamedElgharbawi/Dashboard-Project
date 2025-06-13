/* eslint-disable react-hooks/exhaustive-deps */
import { useAdmin } from "../../Components/Context/UserProvider";
import axios from "axios";
import { useEffect } from "react";
const Quizzes = () => {
    
    const { token } = useAdmin();
    async function getData() {
        console.log(token);
        try {
            const options = {
                url: "https://brightminds.runasp.net/api/Quizzes",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data }  = await axios.request(options);
            console.log(data.data);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        if(token)
            getData();
    }, [token])
    
    return (
        <>
            Quizzes
        </>
    )
};

export default Quizzes;