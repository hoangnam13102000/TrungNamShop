export const ADMIN_PATH="/quan-tri";
export const ROUTERS = {
    ADMIN:{
        LOGIN:`${ADMIN_PATH}/dang-nhap`,
        DASHBOARD:`${ADMIN_PATH}/`,
        STOREMANAGEMENT:`${ADMIN_PATH}/quan-ly-cua-hang`,
        WAREHOUSE:`${ADMIN_PATH}/quan-ly-kho`,

        //--------------Products-----------------------
        PRODUCTMANAGEMENT:`${ADMIN_PATH}/quan-ly-san-pham`,
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
       
        //----------------Users---------------------------
        EMPLOYEEMANAGMENT:`${ADMIN_PATH}/quan-ly-nhan-vien`,
        POSITION:`${ADMIN_PATH}/quan-ly-chuc-vu`,
        CUSTOMERMANAGEMENTL:`${ADMIN_PATH}/quan-ly-khach-hang`,
        MEMBERLEVEL:`${ADMIN_PATH}/quan-ly-bac-thanh-vien`,
        

        //---------------Account------------------------
        ACOUNT:`${ADMIN_PATH}/quan-ly-tai-khoan`,
        ACCOUNTTYPE:`${ADMIN_PATH}/quan-ly-loai-tai-khoan`,
        REWARD:`${ADMIN_PATH}/quan-ly-thuong`,
    },

    USER: {
        HOME:"",
        LOGIN:"dang-nhap",
        REGISTER:"dang-ky",
        PRODUCTLIST:"danh-sach-san-pham",
        PRODUCTDETAILS:"chi-tiet-san-pham",
        PROFILE:"thong-tin-ca-nhan",
        INTRODUCE:"gioi-thieu",
        CONTACT:"lien-he",
        FORGOTPASSWORD:"quen-mat-khau",
        CART:"gio-hang",
        PAYMENT:"thanh-toan",
        
    }

}