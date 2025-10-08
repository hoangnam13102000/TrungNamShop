import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./routers/navigation";

// ADMIN PATH
import AdminMain from "@page_admin/AdminPage";
import ProductManagement from "@page_admin/product/ProductManagement/ProductManagement";
import AddProduct from "./pages/admin/product/ProductManagement/AddProduct";
import BrandManagement from "@page_admin/product/brand/BrandManagement";
import MasterAdLayout from "@page_admin/theme/MasterAdLayout";

// HOMEPAGE PATH
import Homepage from "@page_user/HomePage";
import ProfilePage from "@page_user/ProfilePage";
import AboutPage from "@page_user/IntroPage";
import FeedbackPage from "@page_user/ContactPage";
import Login from "@page_user/Login";
import ProductList from "@page_user/product/ProductList";
import ProductsDetails from "@page_user/product/ProductsDetails";
import Register from "@page_user/Register";
import ForgotPassword from "@page_user/ForgotPassword";
import MasterLayout from "@page_user/theme/MasterLayout";
import Cart from "@page_user/Cart";
import Payment from "@page_user/Payment";

import { ROUTERS, ADMIN_PATH } from "./routers/router";

const renderAdminRouter = () => {
  const adminRouter = [
    {
      path: ROUTERS.ADMIN.ADMINPAGE,
      component: <AdminMain />,
    },
    {
      path: ROUTERS.ADMIN.PRODUCTMANAGEMENT,
      component: <ProductManagement />,
    },
     {
      path: ROUTERS.ADMIN.ADDPRODUCT,
      component: <AddProduct />,
    },
    {
      path: ROUTERS.ADMIN.BRANDMANAGEMENT,
      component: <BrandManagement />,
    },
  ];

  return (
    <MasterAdLayout>
      <ScrollToTop />
      <Routes>
        {adminRouter.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterAdLayout>
  );
};

const renderUserRouter = () => {
  const userRouter = [
    { path: ROUTERS.USER.HOME, component: <Homepage /> },
    { path: ROUTERS.USER.LOGIN, component: <Login /> },
    { path: ROUTERS.USER.REGISTER, component: <Register /> },
    { path: ROUTERS.USER.FORGOTPASSWORD, component: <ForgotPassword /> },
    { path: ROUTERS.USER.PROFILE, component: <ProfilePage /> },
    { path: ROUTERS.USER.PRODUCTLIST, component: <ProductList /> },
    { path: ROUTERS.USER.PRODUCTDETAILS, component: <ProductsDetails /> },
    { path: ROUTERS.USER.INTRODUCE, component: <AboutPage /> },
    { path: ROUTERS.USER.CONTACT, component: <FeedbackPage /> },
    { path: ROUTERS.USER.CART, component: <Cart /> },
    { path: ROUTERS.USER.PAYMENT, component: <Payment /> },
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

const RouterCustom = () => {
  const location = useLocation();
  const isAdminRouter = location.pathname.startsWith(ADMIN_PATH);
  return isAdminRouter ? renderAdminRouter() : renderUserRouter();
};

export default RouterCustom;
