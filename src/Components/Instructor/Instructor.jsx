/* eslint-disable react/prop-types */
import { useState } from "react";
const Instructor = ({ instructor, index, handleEdit, handleClickOpen }) => {
    
    const [show, setShow] = useState(false);
    
    function handleToggle() {
        setShow(!show);
    }

    return (
        <>
            <tr key={instructor.userId}>
                <td>{index + 1}</td>
                <td>{instructor.displayName}</td>
                <td>{instructor.jobTitle}</td>
                <td><img src={instructor.imageCover} alt={instructor.jobTitle} /></td>
                <td>{   
                    instructor.qualifications.length > 70 ? (
                    <>
                        {show ? instructor.qualifications : instructor.qualifications.substring(0, 70)}
                            <span
                                className="cursor-pointer"
                                style={{ whiteSpace: "nowrap", color:"#fff" }}
                                onClick={handleToggle}
                            >
                                {show ? "Show Less" : "...Read More"}
                            </span>
                    </>
                ) : (
                    instructor.qualifications
                )
                }</td>
                <td>{instructor.email}</td>
                <td onClick={() => handleEdit(instructor.userId)} className="fontawesome-icon"><i className="fa-solid fa-edit cursor-pointer"></i></td>
                <td onClick={() => handleClickOpen(instructor.userId)} className="fontawesome-icon"><i className="fa-solid fa-trash cursor-pointer"></i></td>
            </tr>
        </>
    )
}

export default Instructor;