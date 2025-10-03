import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/users/homepage";
import ProfilePage from "./pages/users/profilePage";
import AboutPage from "./pages/users/intropage";
import FeedbackPage from "./pages/users/contact";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterlayout";// nhớ import đúng đường dẫn

const RouterCustom = () => {
  const userRouter = [
    {
      path: ROUTERS.USER.HOME,
      component: <Homepage />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <ProfilePage />,
    },
    {
      path: ROUTERS.USER.INTRODUCE,
      component: <AboutPage />,
    },
    {
      path: ROUTERS.USER.CONTACT,
      component: <FeedbackPage />,
    },
  ];

  return (
    <MasterLayout>
      <Routes>
        {userRouter.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

export default RouterCustom;
