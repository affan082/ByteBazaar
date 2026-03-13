// import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import "./feature-section.css";
import ImageBox from "../../../components/image-box/ImageBox.tsx";

function FeaturesSection() {
    return (
        <Container className="features">
            <Row className={""}>
                <Col  md={6} xl={3} xs={12} className={"pr-2 pb-3 feature"}>
                    <ImageBox
                        imageUrl={"assets/wrapper1.png"}
                        heading={"Free Shipping"}
                        description={"Free shipping on all Pakistan Orders"}
                        className={""}/>
                </Col>
                <Col  md={6} xl={3} xs={12} className={"pr-2 pb-3 feature"}>
                    <ImageBox
                        imageUrl={"assets/wrapper2.png"}
                        heading={"Support 24/7"}
                        description={"Contact us 24 hours a day"}
                        className={""}/>
                </Col>
                <Col  md={6} xl={3} xs={12} className={"pr-2 pb-3 feature"}>
                    <ImageBox
                        imageUrl={"assets/wrapper3.png"}
                        heading={"100% Money Back"}
                        description={"You have 30 days to Return"}
                        className={""}/>
                </Col>
                <Col  md={6} xl={3} xs={12} className={"pr-2 pb-3 feature"}>
                    <ImageBox
                        imageUrl={"assets/wrapper5.png"}
                        heading={"Payment Secure"}
                        description={"We ensure secure payment"}
                        className={""}/>
                </Col>
            </Row>

        </Container>
    );
}

export default FeaturesSection;