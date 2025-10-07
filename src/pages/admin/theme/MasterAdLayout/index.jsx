import {memo} from "react"

const MasterAdLayout = ({children ,...props})=>{
    return <div {...props}>
    {children}
    <Footer/>
    </div>;
};
export default memo(MasterAdLayout);