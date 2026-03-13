import {Button, Col, Container, Row} from "react-bootstrap";
import "./notfound.scss";
function NotFound() {
    return (
        <>
            <Container className={"page_404"}>
                <Row>
                    <Col sm={12} className="text-center">
                        <Col sm={10} className="mx-auto">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center">404</h1>
                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">Look like you're lost</h3>
                                <p>The page you are looking for is not available!</p>
                                <Button href="/" className="link_404">
                                    Go to Home
                                </Button>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default NotFound;