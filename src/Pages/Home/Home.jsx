import { BsFillArchiveFill, BsPeopleFill, BsMenuButtonWideFill } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CircularProgress from '@mui/material/CircularProgress';
import CheckConnection from "../../Components/CheckConnection/CheckConnection";
const Home = () => {
  
  const [coursesCount, setCoursesCount] = useState("");
  const [instructorsCount, setInstructorsCount] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingInstructor, setLoadingInstructor] = useState(true);

  async function getCourses() {
    try {
      await axios.get("https://brightminds.runasp.net/api/Course").then(response => response.data).then(response => {
        const { data } = response;
        setCoursesCount(data.count);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function getInstructor() {
    try {
      await axios.get("https://brightminds.runasp.net/api/Instructor").then(response => response.data).then(response => {
        const { data } = response;
        setInstructorsCount(data.count);
      })
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingInstructor(false);
    }
  }
  
  useEffect(() => {
    getCourses();
    getInstructor();
  }, []);

  return (
    <CheckConnection>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {loadingCourses || loadingInstructor ? <div className="flex justify-center items-center h-full"><CircularProgress/></div> :
        <main className="main-container" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
          <div className="main-cards flex flex-wrap justify-between" style={{ marginBottom: "15px" }}>
            <div className="card" style={{ backgroundColor: "#2962ff" }}>
              <div className="card-inner">
                <h3 className="font-bold">Courses</h3>
                <BsFillArchiveFill className="card_icon" />
              </div>
              <h1>{coursesCount}</h1>
            </div>
            <div className="card" style={{ backgroundColor: "#2e7d32" }}>
              <div className="card-inner">
                <h3 className="font-bold">Instructors</h3>
                <BsPeopleFill className="card_icon" />
              </div>
              <h1>{instructorsCount}</h1>
            </div>
            <div className="card" style={{ backgroundColor: "#ff6d00" }}>
              <div className="card-inner">
                <h3 className="font-bold">Reports</h3>
                <BsMenuButtonWideFill className='card_icon' />
              </div>
              <h1>12</h1>
            </div>
          </div>
        </main>}
    </CheckConnection>
  );
};

export default Home;