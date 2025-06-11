import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route  } from "react-router-dom";
import { Login, AddCourse, NotFound, EditCourse, Orders, EditInstructor, GetSections, EditSection, AddSection, Videos, EditVideo, AddVideo, OrderDetails, Users, Instructors, Courses, Home } from "./Pages/AllPages/AllPages";
import { ProtectedRoutes, UserProvider, Layout } from "./Components/AllComponent/AllComponent";

const App = () => {

    return (
        <>
            <UserProvider> 
                <ToastContainer position="top-right" autoClose={3000} />
                <BrowserRouter>
                    <Routes>
                        <Route path={"/login"} element={<Login/>} />
                        <Route path={"/"} element={<Login />} />
                        <Route path={"*"} element={<NotFound/>}/>
                        <Route element={<ProtectedRoutes/>}>
                            <Route path="/dashboard" element={<Layout />}>
                                <Route index element={<Home />}/>
                                <Route path="courses" element={<Courses />}/>
                                <Route path="instructors" element={<Instructors />}/>
                                <Route path="users" element={<Users />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="courses/add" element={<AddCourse/>}/>
                                <Route path="courses/edit/:id" element={<EditCourse/>}/>
                                <Route path="courses/:id/sections" element={<GetSections />}/>
                                <Route path="courses/sections/add" element={<AddSection/>}/>
                                <Route path="courses/:courseId/sections/:sectionId/edit" element={<EditSection />}/>
                                <Route path="instructors/edit/:id" element={<EditInstructor/>}/>
                                <Route path="courses/:id/section/:sectionId/videos" element={<Videos/>}/>
                                <Route path="courses/:id/section/:sectionId/videos/:videoId/edit" element={<EditVideo/>}/>
                                <Route path="courses/:id/section/:sectionId/videos/add" element={<AddVideo/>}/>
                                <Route path="orders/:orderId" element={<OrderDetails/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </>
    )
}

export default App;