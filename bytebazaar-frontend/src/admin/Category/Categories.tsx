import { Col, Container, Row } from "react-bootstrap";
import { ReactNode, useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import axios from "axios";
import { CategoryInterface } from "../../interfaces/CategoryInterface.tsx";
import { GetCategories } from "../../queries/GetCategories.tsx";
import CategoryListingTemplate from "../Templates/CategoryListingTemplate.tsx";
import "./categories.scss";
function Categories() {
  const [categories, setCategories] = useState<ReactNode[]>([]);
  const config = useContext(ConfigContext);
  useEffect(() => {
    GetCategories({}).then((data) => {
      console.log(data);
      if (data) {
        setCategories(
          data?.map((category: CategoryInterface) => {
            return (
              <CategoryListingTemplate
                key={category._id}
                name={category.name}
                _id={category._id}
                parent={category.parent?.name}
                description={category.description}
                slug={category.slug}
              />
            );
          }),
        );
      }
    });
  }, []);
  return (
    <Container fluid className="page categories-page">
      {categories.length > 0 ? (
        <>
          <Row className="page-detail">
            <Col>
              <h1 className="text-center text-warning">Categories</h1>
            </Col>
          </Row>
          <Row className="category-list-wrapper">{categories}</Row>
        </>
      ) : (
        <Row className={"page-detail page-empty"}>
          <h1 className={"page-title"}>No Categories Found</h1>
          <p>You can add a new category by clicking the button below.</p>
          <a href={"add"} className={"btn btn-primary"}>
            Add New Category
          </a>
        </Row>
      )}
    </Container>
  );
}

export default Categories;
