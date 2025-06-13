/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { CircularProgress } from "@mui/material";
import { useAdmin } from "../../../Components/Context/UserProvider";
import Video from "../../../Components/Video/Video";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckConnection from "../../../Components/CheckConnection/CheckConnection";
import { toast } from "react-toastify";

const Videos = () => {
  const { id, sectionId } = useParams();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  async function getVideos() {
    try {
      const { data } = await axios.get(
        `https://brightminds.runasp.net/api/Video/section/${sectionId}`
      );
      setVideos(data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getVideos();
  }, []);

  const handleDelete = async () => {
    try {
      const options = {
        url: `https://brightminds.runasp.net/api/Video/${selectedVideoId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.request(options);
      setVideos((prev) => prev.filter((video) => video.id !== selectedVideoId));
      handleClose();
      toast.success("Video Deleted Successfully.");
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenDialog = (videoId) => {
    setSelectedVideoId(videoId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVideoId(null);
  };

  return (
    <CheckConnection>
      <section style={{ height: "calc(100vh - 120px)" }}>
      <Helmet>
        <title>Videos</title>
      </Helmet>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : videos.length ? (
        <div className="h-full">
          <h2
            className="text-white text-3xl text-center font-extrabold"
            style={{ marginBottom: "20px" }}
          >
            Videos
          </h2>
          <div
            id="all-videos"
            className="flex flex-wrap justify-evenly gap-5 overflow-auto"
            style={{ height: "calc(100% - 190px)" }}
          >
            {videos.map((video) => {
              return (
                <Video
                  key={video.id}
                  video={video}
                  onDeleteClick={handleOpenDialog}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5" style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={() =>
                navigate(
                  `/dashboard/courses/${id}/section/${sectionId}/videos/add`
                )
              }
              sx={{
                textTransform: "none",
                padding: "12px 30px",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "5px",
                boxShadow: "0px 4px 15px rgba(25, 118, 210, 0.3)",
                transition: "all 0.3s ease",
                ":hover": { backgroundColor: "#1565c0" },
                width: "100%",
              }}
            >
              Add Video
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
                width: "100%",
              }}
              onClick={() => navigate(`/dashboard/courses/${id}/sections`)}
            >
              Back
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="flex justify-center items-center h-full text-white font-bold flex-col gap-5"
          style={{ fontSize: "28px" }}
        >
          <p>No Videos Founded</p>
          <div className="flex items-center gap-2.5">
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(
                  `/dashboard/courses/${id}/section/${sectionId}/videos/add`
                )
              }
            >
              Add Video
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate(`/dashboard/courses/${id}/sections`)}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {"Are You Sure You Want To Delete This Video?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You Cannot Undo The Deletion Once It Is Completed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDelete}>
            Agree
          </Button>
          <Button onClick={handleClose}>Disagree</Button>
        </DialogActions>
      </Dialog>
    </section>
    </CheckConnection>
    
  );
};

export default Videos;
