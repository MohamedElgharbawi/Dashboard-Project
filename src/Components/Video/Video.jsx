/* eslint-disable react/prop-types */
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

const Video = ({ video, onDeleteClick }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [showFullText, setShowFullText] = useState(false);
    const [playing, setPlaying] = useState(false);
    console.log(video.videoUrl);
    const handleToggle = () => {
        setShowFullText(!showFullText);
    };



    async function handleEditCourse(videoId) {
        navigate(`/dashboard/courses/${id}/section/${video.sectionId}/videos/${videoId}/edit`);
    }

    return (
            <div
                className='flex flex-col justify-between bg-white rounded-sm gap-2.5'
                style={{
                    maxWidth: 350,
                    padding: "20px",
                    maxHeight: "600px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    order:video.order
                }}
            >
                <h1 className='font-bold text-2xl text-black'>
                    {video.name}
                </h1>

                <div className='relative w-full overflow-hidden rounded-lg h-48' onClick={() => setPlaying(true)}>
                    <ReactPlayer className="react-player__wrapper"  url={`https://brightminds.runasp.net/api/Video/stream/${video.videoUrl}`} light={video.coverUrl} controls={true} width="100%" height="100%" playing={playing}/>
                </div>

                <p style={{ color: "#777" }}>
                    {video.description !== null && video.description.length > 150 ? (
                        <>
                            {showFullText ? video.description : video.description.substring(0, 150)}
                                <span
                                    style={{ whiteSpace: "nowrap", color: "#1976d2", cursor: "pointer" }}
                                    onClick={handleToggle}
                                >
                                    {showFullText ? "Show Less" : "...Read More"}
                                </span>
                        </>
                    ) : (
                        video.description ?? "No Desciption Founded To This Video"
                    )}
                </p>

                <div className='flex flex-col gap-1'>
                    <h6 className='font-bold' style={{ color: "#333" }}>
                        Updated: {video.updatedDate}
                    </h6>
                    <h6 className="font-bold" style={{ color: "#333" }}>
                        Duration: {video.duration} Minute
                    </h6>
                </div>

                <div className='flex gap-1 flex-wrap'>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        className='capitalize'
                        onClick={() => handleEditCourse(video.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        className='capitalize'
                        onClick={() => onDeleteClick(video.id)}
                    >
                        Delete
                    </Button>
                </div>
            </div>
    );
};

export default Video;