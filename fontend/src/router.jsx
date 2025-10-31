import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./routers/navigation";

// ADMIN PATH

import { ROUTERS, ADMIN_PATH } from "./routers/router";
import DashBoard from "@page_admin/DashBoard";

//----------------------ACCOUNT-------------------------------------

import AccountList from "@page_admin/account/AccountList";
import AccountTypeList from "@page_admin/account/AccountType";
import MemberLevelList from "@page_admin/customer/MemberLevelList";
import Reward from "./pages/admin/employee/Reward";
//----------------------PRODUCT-------------------------------------

import ProductManagement from "@page_admin/product/ProductManagement";
import ProductDetail from "./pages/admin/product/ProductDetail";
import Color from "./pages/admin/product/Color";
import BrandManagement from "@page_admin/product/BrandManagement";
import PromotionList from "./pages/admin/product/PromotionManagement";
import OrderManagement from "@page_admin/OrderManagement";
import DiscountList from "@page_admin/product/DiscountManagement";
import Screen from "./pages/admin/product/Screen";
import FrontCamera from "./pages/admin/product/FrontCamera";
import RearCamera from "./pages/admin/product/RearCamera";
import OperatingSystem from "./pages/admin/product/OperatingSystem";
import MemoriesManagemnet from "./pages/admin/product/MemoriesManagemnet";
import CommunicationConnectivity from "./pages/admin/product/CommunicationConnectivity";
import BatteriesCharging from "./pages/admin/product/BatteriesCharging";
import GeneralInfomation from "./pages/admin/product/GeneralInfomation";
import Utility from "./pages/admin/product/Utility";

//----------------------USERS-------------------------------------
import EmployeeManagement from "./pages/admin/employee/EmployeeManagement";
import CustomerManagement from "@page_admin/customer/CustomerManagement";
import StoreManagement from "@page_admin/store/StoreManagement";
import WarehouseManagement from "@page_admin/store/WarehouseManagement";
import PositionManagement from "./pages/admin/employee/Position";

// HOMEPAGE PATH
import MasterAdLayout from "@page_admin/theme/MasterAdLayout";
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
import ProductImage from "./pages/admin/product/ProductImage";

const adminRouter = [
  { path: ROUTERS.ADMIN.DASHBOARD, element: <DashBoard /> },
  { path: ROUTERS.ADMIN.PRODUCTMANAGEMENT, element: <ProductManagement /> },
  { path: ROUTERS.ADMIN.PRODUCTDETAILS, element: <ProductDetail /> },
  { path: ROUTERS.ADMIN.COLOR, element: <Color /> },
  { path: ROUTERS.ADMIN.PRODUCTIMAGE, element: <ProductImage /> },
  { path: ROUTERS.ADMIN.SCREEN, element: <Screen /> },
  { path: ROUTERS.ADMIN.FRONTCAMERA, element: <FrontCamera /> },
  { path: ROUTERS.ADMIN.REARCAMERA, element: <RearCamera /> },
  { path: ROUTERS.ADMIN.OPERATINGSYSTEM, element: <OperatingSystem /> },
  { path: ROUTERS.ADMIN.MEMORIES, element: <MemoriesManagemnet /> },
  { path: ROUTERS.ADMIN.UTILITY, element: <Utility /> },
  { path: ROUTERS.ADMIN.BATTERIES, element: <BatteriesCharging /> },
  { path: ROUTERS.ADMIN.GENERALINFO, element: <GeneralInfomation /> },
  { path: ROUTERS.ADMIN.CONNECTIONS, element: <CommunicationConnectivity /> },
  { path: ROUTERS.ADMIN.BRANDMANAGEMENT, element: <BrandManagement /> },
  { path: ROUTERS.ADMIN.PROMOTION, element: <PromotionList /> },
  { path: ROUTERS.ADMIN.DISCOUNT, element: <DiscountList /> },
  { path: ROUTERS.ADMIN.ORDERMANAGEMENT, element: <OrderManagement /> },
  { path: ROUTERS.ADMIN.ACCOUNTTYPE, element: <AccountTypeList /> },
  { path: ROUTERS.ADMIN.EMPLOYEEMANAGMENT, element: <EmployeeManagement /> },
  { path: ROUTERS.ADMIN.ACOUNT, element: <AccountList /> },
  { path: ROUTERS.ADMIN.POSITION, element: <PositionManagement /> },
  { path: ROUTERS.ADMIN.REWARD, element: <Reward /> },
  { path: ROUTERS.ADMIN.CUSTOMERMANAGEMENTL, element: <CustomerManagement /> },
  { path: ROUTERS.ADMIN.MEMBERLEVEL, element: <MemberLevelList /> },
  { path: ROUTERS.ADMIN.STOREMANAGEMENT, element: <StoreManagement /> },
  { path: ROUTERS.ADMIN.WAREHOUSE, element: <WarehouseManagement /> },
];

const renderAdminRouter = () => (
  <MasterAdLayout>
    <ScrollToTop />
    <Routes>
      {adminRouter.map((item, key) => (
        <Route key={key} path={item.path} element={item.element} />
      ))}
    </Routes>
  </MasterAdLayout>
);


const renderUserRouter = () => {
  const userRouter = [
    { path: ROUTERS.USER.HOME, element: <Homepage /> },
    { path: ROUTERS.USER.LOGIN, element: <Login /> },
    { path: ROUTERS.USER.REGISTER, element: <Register /> },
    { path: ROUTERS.USER.FORGOTPASSWORD, element: <ForgotPassword /> },
    { path: ROUTERS.USER.PROFILE, element: <ProfilePage /> },
    { path: ROUTERS.USER.PRODUCTLIST, element: <ProductList /> },
    { path: ROUTERS.USER.PRODUCTDETAILS, element: < ProductsDetails/> },
    { path: ROUTERS.USER.INTRODUCE, element: <AboutPage /> },
    { path: ROUTERS.USER.CONTACT, element: <FeedbackPage /> },
    { path: ROUTERS.USER.CART, element: <Cart /> },
    { path: ROUTERS.USER.PAYMENT, element: <Payment /> },
  ];

  return (
    <MasterLayout>
      <ScrollToTop />
      <Routes>
        {userRouter.map((item, key) => (
          <Route key={key} path={item.path} element={item.element} />
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
