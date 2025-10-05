import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./utils/navigation";
import Homepage from "@page/HomePage";
import ProfilePage from "@page/ProfilePage";
import AboutPage from "@page/IntroPage";
import FeedbackPage from "@page/ContactPage";
import Login from "@page/Login";
import  Register from "@page/Register";
import ForgotPassword from "@page/ForgotPassword";
import ProdutcsPage from "@page/ProductsPage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/MasterLayout";

const RouterCustom = () => {
  const userRouter = [
    {
      path: ROUTERS.USER.HOME,
      component: <Homepage />,
    },
    {
      path: ROUTERS.USER.LOGIN,
      component: <Login />,
    },
    {
      path: ROUTERS.USER.REGISTER,
      component: <Register />,
    },
    {
      path: ROUTERS.USER.FORGOTPASSWORD,
      component: <ForgotPassword />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <ProfilePage />,
    },
    {
      path: ROUTERS.USER.PRODUCTS,
      component: <ProdutcsPage />,
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
       <ScrollToTop />
      <Routes>
        {userRouter.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

export default RouterCustom;
