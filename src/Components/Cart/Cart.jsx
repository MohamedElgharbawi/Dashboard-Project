/* eslint-disable react/prop-types */
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';

const Cart = ({ section, onDeleteClick }) => {
    
    const { id } = useParams();
    const [showFullText, setShowFullText] = useState(false);
    const navigate = useNavigate();
    

    const handleToggle = () => {
        setShowFullText(!showFullText);
    };

    const handleEditSection = () => {
        navigate(`/dashboard/courses/${section.courseId}/sections/${section.id}/edit`, {
            state:section.id
        });
    };

    function handleCourses(sectionId) { 
        navigate(`/dashboard/courses/${id}/section/${sectionId}/videos`);
    }

    return (
        <div key={section.id} className='flex flex-col justify-between bg-white rounded-sm gap-1' style={{ maxWidth: 350, padding: "20px", maxHeight: "350px", order:section.order}}>
            <h1  className="font-bold text-black"style={{  fontSize: "28px" }}>
                {section.name}
            </h1>
            <p style={{ color: "#777777" }}>
                { section.description.length > 150 ? (
                    <>
                    {showFullText ? section.description : section.description.substring(0, 150)}
                            <span
                                className="cursor-pointer toggle-show"
                                style={{ whiteSpace: "nowrap" }}
                                onClick={handleToggle}
                            >
                                {showFullText ? "Show Less" : "...Read More" }
                            </span>
                    </>
                ) : (
                    section.description
                )}
            </p>
            <h6 className='font-bold' style={{ color: "#333" }}>
                Updated: {section.updatedDate}
            </h6>
            <div className="flex gap-1">
                <Button size="small" variant="contained" color="success" className='capitalize' onClick={() => handleCourses(section.id)}>
                    Videos
                </Button>
                <Button size="small" variant="contained" color="primary" className='capitalize' onClick={handleEditSection}>
                    Edit
                </Button>
                <Button size="small" variant="contained" color="error" className='capitalize' onClick={() => onDeleteClick(section.id)}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default Cart;
