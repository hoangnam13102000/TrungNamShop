export const ADMIN_PATH="/quan-tri";
export const ROUTERS = {
    ADMIN:{
        LOGIN:`${ADMIN_PATH}/dang-nhap`,
        DASHBOARD:`${ADMIN_PATH}/`,
        STOREMANAGEMENT:`${ADMIN_PATH}/quan-ly-cua-hang`,
        WAREHOUSE:`${ADMIN_PATH}/quan-ly-kho`,

        //--------------Products-----------------------
        PRODUCTMANAGEMENT:`${ADMIN_PATH}/quan-ly-san-pham`,
        PRODUCTDETAILS:`${ADMIN_PATH}/chi-tiet-san-pham`,
        COLOR:`${ADMIN_PATH}/quan-ly-mau-sac`,
        PRODUCTIMAGE:`${ADMIN_PATH}/quan-ly-hinh-san-pham`,
        BRANDMANAGEMENT:`${ADMIN_PATH}/quan-ly-thuong-hieu`,
        PROMOTION:`${ADMIN_PATH}/quan-ly-khuyen-mai`,
        DISCOUNT:`${ADMIN_PATH}/quan-ly-giam-gia`,
        SCREEN:`${ADMIN_PATH}/quan-ly-man-hinh`,
        ORDERMANAGEMENT:`${ADMIN_PATH}/quan-ly-don-hang`,
        FRONTCAMERA:`${ADMIN_PATH}/quan-ly-camera-truoc`,
        REARCAMERA:`${ADMIN_PATH}/quan-ly-camera-sau`,
        OPERATINGSYSTEM:`${ADMIN_PATH}/quan-ly-he-dieu-hanh`,
        MEMORIES:`${ADMIN_PATH}/quan-ly-bo-nho`,
        CONNECTIONS:`${ADMIN_PATH}/quan-ly-ket-noi`,
        BATTERIES:`${ADMIN_PATH}/quan-ly-pin`,
        GENERALINFO:`${ADMIN_PATH}/thong-tin-chung-san-pham`,
        UTILITY:`${ADMIN_PATH}/tien-ich-san-pham`,
        REVIEW:`${ADMIN_PATH}/quan-ly-danh-gia`,
       
        //----------------Users---------------------------
         CUSTOMERMANAGEMENTL:`${ADMIN_PATH}/quan-ly-khach-hang`,
        MEMBERLEVEL:`${ADMIN_PATH}/quan-ly-bac-thanh-vien`,
        
        
        //----------------Employees---------------------------
       
        EMPLOYEEMANAGMENT:`${ADMIN_PATH}/quan-ly-nhan-vien`,
        POSITION:`${ADMIN_PATH}/quan-ly-chuc-vu`,
        REWARD:`${ADMIN_PATH}/quan-ly-thuong`,
        SALARYCOEFFICIENT:`${ADMIN_PATH}/quan-ly-he-so-luong`,
        ALLOWANCE:`${ADMIN_PATH}/quan-ly-phu-cap`,
        ATTENDANCE:`${ADMIN_PATH}/quan-ly-cham-cong`,

        //---------------Account------------------------
        ACOUNT:`${ADMIN_PATH}/quan-ly-tai-khoan`,
        ACCOUNTTYPE:`${ADMIN_PATH}/quan-ly-loai-tai-khoan`,
        
    },

    USER: {
        HOME:"",
        LOGIN:"dang-nhap",
        REGISTER:"dang-ky",
        PRODUCTLIST:"danh-sach-san-pham",
        PRODUCTDETAILS:"chi-tiet-san-pham/:id",
        PROFILE:"thong-tin-ca-nhan",
        INTRODUCE:"gioi-thieu",
        CONTACT:"lien-he",
        FORGOTPASSWORD:"quen-mat-khau",
        CART:"gio-hang",
        PAYMENT:"thanh-toan",
        MYORDERS:"don-hang-cua-toi",
        MOMORETURN:"momo-result",
        PAYPALRETURN:"paypal-result",
        NOTFOUND:"4-0-4"
    }

}