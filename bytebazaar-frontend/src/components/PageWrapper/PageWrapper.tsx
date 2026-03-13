import PageInterface from "../../interfaces/PageInterface.tsx";
import Header from "../header/Header.tsx";
import Footer from "../footer/Footer.tsx";

function PageWrapper({_header=<Header/>, _footer=<Footer/>, _children}:PageInterface) {
    return (
        <>
            {_header}
            {_children}
            {_footer}
        </>
    );
}

export default PageWrapper;