export const ADMIN_PATH="/quan-tri";
export const ROUTERS = {
    ADMIN:{
        LOGIN:`${ADMIN_PATH}/dang-nhap`,
        ADMINPAGE:`${ADMIN_PATH}/bang-dieu-khien`,
        PRODUCTMANAGEMENT:`${ADMIN_PATH}/quan-ly-san-pham`,
        ADDPRODUCT:`${ADMIN_PATH}/them-san-pham`,
        BRANDMANAGEMENT:`${ADMIN_PATH}/quan-ly-thuong-hieu`,

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