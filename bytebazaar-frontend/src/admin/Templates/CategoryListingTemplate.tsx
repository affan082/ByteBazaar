import { CategoryInterface } from "../../interfaces/CategoryInterface.tsx";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import "./category-listing-template.scss";
import { useContext, useEffect } from "react";
import { GetCategories } from "../../queries/GetCategories.tsx";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";

function CategoryListingTemplate({
  _id,
  name,
  parent,
  description,
}: CategoryInterface) {
  const config = useContext(ConfigContext);
  // const [parentCategory, setParentCategory] = React.useState<CategoryInterface>();
  // useEffect(()=>{
  //     GetCategories({_id:_id}).then((data)=>{
  //         setParentCategory(data[0]);
  //     })
  // })

  async function removeCategory(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios
        .delete(config.server.uri + `category/delete?_id=${_id}`)
        .then(() => {
          window.location.reload();
        });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Container className={"category-listing-template p-4 rounded-4 mb-4"}>
      <Row className="category-list-body">
        <Col className={"name"}>
          <Stack>
            <small className={"category_id"}>ID:{_id}</small>
            <h5>{name}</h5>
          </Stack>
        </Col>
        <Col className={"parent"}>
          <p>{parent}</p>
        </Col>
        <Col className="d-flex justify-content-end">
          <Stack direction={"horizontal"}>
            <a href={""} className={"text-danger"} onClick={removeCategory}>
              Remove
            </a>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
}

export default CategoryListingTemplate;
