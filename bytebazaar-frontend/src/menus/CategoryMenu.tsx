1// import React from "react";
import { Collapse, Container, Dropdown, Stack } from "react-bootstrap";
import "./categorymenu.css";
import {Panel} from "primereact/panel";
import {useRef} from "react";

function CategoryMenu() {
    const header = useRef(null);

    const headerTemplate = (options) => {
        const handleClick = () => {
            if (options.togglerElement?.props?.onClick) {
                options.togglerElement.props.onClick();
            }
        };

        return (
            <Stack
                direction={"horizontal"}
                ref={header}
                className="menu-title p-3 align-items-center gap-3 position-relative"
                onClick={handleClick} // Added event listener
                style={{ cursor: "pointer" }} // Makes it visually clickable
            >
                <i className="bi bi-list"></i>
                <h6 className={"category-menu-title m-0 w-100"}>Category Menu</h6>
                {options.togglerElement}
            </Stack>
        );
    };
    return (
        <Container className="category-menu px-0 w-md-100 m-md-0">

            <Panel headerTemplate={headerTemplate} toggleable>
                <Dropdown className="menu-dropdown d-flex flex-column  gap-0">
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Audio and Home Theater</div>
                        <Stack className="menu-content" direction="horizontal">

                            <ul>
                                <li>Digital Camera</li>
                                <li>Camera, Photo</li>
                                <li>4K UHD Streaming Media Players</li>
                                <li>Apple TV</li>
                                <li>Fire TV Streaming Media Devices</li>
                                <li>NVIDIA Shield</li>
                            </ul>
                        </Stack>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Camera, Photo & Video</div>

                        <Stack className="menu-content" direction="horizontal">
                            <ul>
                                <li>CD Players & Turntables</li>
                                <li>Home Theater Systems </li>
                                <li>Receivers & Amplifiers</li>
                                <li>Speakers</li>
                            </ul>
                            <ul>
                                <li> Security Cameras</li>
                                <li>Flickrq</li>
                                <li>Platform Beds</li>
                                <li>Storage Beds</li>
                            </ul>
                        </Stack>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Laptop & Computer</div>
                        <Stack className="menu-content" direction="horizontal">
                            <ul>
                                <li>Desktops</li>
                                <li>Microsoft Surface Go</li>
                                <li>Microsoft Surface Pro</li>
                                <li>Refurbished Tablets</li>
                                <li>All-in-One Computers</li>
                                <li>Apple iMac, Mini & Mac Pro</li>
                                <li>Desktop Packages</li>
                                <li>Gaming Desktops</li>
                            </ul>
                            <ul>
                                <li>Laptops 2-in-1s</li>
                                <li>Business Laptops</li>
                                <li>Chromebooks</li>
                                <li>Gaming Laptops</li>
                                <li>MacBooks</li>
                            </ul>
                            <ul>
                                <li>4G LTE Tablets</li>
                                <li>Apple iPad</li>
                                <li>E-Readers & Accessories</li>
                                <li>iPad & Tablet Accessories</li>
                                <li>Kid's Tablets</li>
                            </ul>
                        </Stack>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Cellphones & Accessories</div>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Video Games Consoles</div>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Business & Office</div>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Headphones & Accessories</div>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Quadcopters & Accessories</div>
                    </Dropdown.Item>
                    <Dropdown.Item href={"/category/all"}>
                        <div className="menu-heading">Network Devices</div>
                    </Dropdown.Item>
                </Dropdown>
        </Panel>

    </Container>
  );
}

export default CategoryMenu;
