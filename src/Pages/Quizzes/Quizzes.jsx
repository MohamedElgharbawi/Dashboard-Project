/* eslint-disable react-hooks/exhaustive-deps */
import { useAdmin } from "../../Components/Context/UserProvider";
import axios from "axios";
import { useEffect } from "react";
const Quizzes = () => {
    
    const { token } = useAdmin();
    async function getData() {
        try {
            const options = {
                url: "https://brightminds.runasp.net/api/Quizzes?PageIndex=1&PageSize=5",
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

    async function deleteQuiz() {
        try {
            const options = {
                url: `https://brightminds.runasp.net/api/Quizzes/${quizId}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.request(options);
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (token) {
            getData();
        }
    }, [token])
    
    return (
        <>
            Quizzes
        </>
    )
};

export default Quizzes;