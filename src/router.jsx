import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./routers/navigation";
import Homepage from "@page/HomePage";
import ProfilePage from "@page/ProfilePage";
import AboutPage from "@page/IntroPage";
import FeedbackPage from "@page/ContactPage";
import Login from "@page/Login";
import ProductList from "@page/product/ProductList"
import ProductsDetails from "@page/product/ProductsDetails";
import  Register from "@page/Register";
import ForgotPassword from "@page/ForgotPassword";
import { ROUTERS } from "./routers/router";
import MasterLayout from "./pages/users/theme/MasterLayout";
import Cart from "./pages/users/Cart";
import Payment from "./pages/users/Payment";

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
      path: ROUTERS.USER.PRODUCTLIST,
      component: <ProductList />,
    },
    {
      path: ROUTERS.USER.PRODUCTDETAILS,
      component: <ProductsDetails />,
    },
    {
      path: ROUTERS.USER.INTRODUCE,
      component: <AboutPage />,
    },
    {
      path: ROUTERS.USER.CONTACT,
      component: <FeedbackPage />,
    },
    {
      path: ROUTERS.USER.CART,
      component: <Cart />,
    },
    {
      path: ROUTERS.USER.PAYMENT,
      component: <Payment />,
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
