import {memo} from "react"
import Header from "../header";
import Banner from "../banner";
import Footer from "../footer";
const MasterLayout = ({children ,...props})=>{
    return <div {...props}>
    <Header/>
    <Banner/>
    {children}
    <Footer/>
    </div>;
};
export default memo(MasterLayout);