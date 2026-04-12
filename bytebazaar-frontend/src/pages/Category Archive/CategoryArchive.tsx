import { Accordion, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCategories } from "../../queries/GetCategories.tsx";
import QueryableLoopGrid from "../../components/Queryable Loop Grid/QueryableLoopGrid.tsx";
import ProductCarouselTemplate1 from "../../templates/ProductCarouselTemplate1.tsx";
import { CategoryInterface } from "../../interfaces/CategoryInterface.tsx";
import "./category-archive.scss";
import CategoryFilter from "../../filters/CategoryFilter.tsx";
import { ProductQueryInterface } from "../../interfaces/ProductQueryInterface.tsx";
import {
  CategoryArchiveContext,
  CategoryArchiveContextProps,
} from "./CategoryArchiveContext.tsx";
import { GetProducts } from "../../queries/GetProducts.tsx";
import ProductInterface from "../../interfaces/ProductInterface.tsx";
import SearchFilter from "../../filters/SearchFilter.tsx";

function CategoryArchive() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const [category, setCategory] = useState<CategoryInterface>({});
  const [productQuery, setProductQuery] = useState<ProductQueryInterface>({});
  const [archiveContext, setArchiveContext] =
    useState<CategoryArchiveContextProps>({});
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [price, setPrice] = useState<{ min: Number; max: Number }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(16);
  const [totalCount, setTotalCount] = useState<number>(0);
  // console.log(products);
  // Get Category Data from Database
  useEffect(() => {
    if (!slug) return;
    GetCategories({ slug: slug, sort: 1 })
      .then((res) => {
        if (!res?.length) return;
        setCategory(res[0]);
        setProductQuery({
          ...productQuery,
          categories: [res[0]._id],
          keyword: query,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [query, slug]);

  // Get Products Data from Database
  useEffect(() => {
    GetProducts({
      ...productQuery,
      keyword: query,
      // limit: itemsPerPage,
      // skip: (currentPage - 1) * itemsPerPage,
      sort: 1,
    })
      .then((_data) => {
        setProducts(_data);
        setTotalCount(_data.length);
        if (_data.products?.length) {
          const prices = _data.products.map((p: any) => p.price);

          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          setPrice({ min: minPrice, max: maxPrice });
        }

        // console.log(productQuery,_data);
      })
      .catch((_e) => {
        {
          setProducts([]);
          setTotalCount(0);
        }
      });
  }, [productQuery, currentPage, itemsPerPage, query]);

  // console.log(category,categorySlug);

  // Get The Products based upon the current category.
  useEffect(() => {
    if (category) {
      setProductQuery({
        ...productQuery,
        ...(category._id && { categories: [category._id] }),
        keyword: query,
      });
      // setProductQuery()
    }
  }, [category, query]);

  return (
    <CategoryArchiveContext.Provider value={archiveContext}>
      <Container className={"page archive category-archive"} fluid={true}>
        {/* <Row className={"breadcrumbs content-box"}>
          <ul>
            <li className={"breadcrumb-item"}>
              <a href={"/"}>Home</a>
            </li>
            <li className={"breadcrumb-item"}>
              <a href={"/shop"}>Shop</a>
            </li>
            {category?.parent ? (
              <li className={"breadcrumb-item category-parent"}>
                <a href={"/shop/" + category.parent.slug}>
                  {category.parent.name}
                </a>
              </li>
            ) : (
              <></>
            )}
            {Object.keys(category).length ? (
              <li className={"breadcrumb-item category"}>
                <a href={"/category/" + (category.slug || "")}>
                  {category.name}
                </a>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </Row> */}
        <Row className={"content-box page-section page-content"}>
          <Col className={"filter-container"}>
            <Accordion
              defaultActiveKey={window.innerWidth > 768 ? "0" : ""}
              className={"filter-accordion"}
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>Filter</Accordion.Header>
                <Accordion.Body>
                  <Form className={"filter-container p-2 vstack"}>
                    {/*<h6 className={"text-uppercase filter-cont-heading"}>Filter By</h6>*/}
                    {/* <SearchFilter
                      queryObject={productQuery}
                      queryUpdater={setProductQuery}
                    /> */}
                    <CategoryFilter
                      title={"Categories"}
                      queryObject={productQuery}
                      queryUpdater={setProductQuery}
                    />

                    <div className={"spacer mb-2"}></div>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col className={"product-container"}>
            <QueryableLoopGrid
              // query={{ ...productQuery, limits: 5 }}
              data={products.slice(
                itemsPerPage * (currentPage - 1),
                Math.min(products.length, itemsPerPage * currentPage),
              )}
              TemplateComponent={ProductCarouselTemplate1}
              columns={{
                desktop: 4,
                laptop_large: 4,
                laptop: 3,
                tablet: 3,
                mobile: 1,
              }}
              gap={30}
            />
            <Stack
              className={"pagination-wrapper justify-content-between py-5"}
              direction={"horizontal"}
              gap={2}
            >
              <Stack
                direction={"horizontal"}
                gap={2}
                className={"pagination-buttons"}
              >
                {products && products.length > itemsPerPage && (
                  <>
                    <button
                      className={"btn btn-primary py-2 px-3"}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from(
                      {
                        length: Math.ceil(
                          (products.length || 0) / itemsPerPage,
                        ),
                      },
                      (_, i) => (
                        <button
                          key={i + 1}
                          className={`btn py-2 px-3 ${currentPage === i + 1 ? "btn-primary" : "btn-primary-outline border-1"}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ),
                    )}
                    <button
                      className={"btn btn-primary py-2 px-3"}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            Math.ceil(products.length / itemsPerPage),
                            prev + 1,
                          ),
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(products.length / itemsPerPage)
                      }
                    >
                      Next
                    </button>
                  </>
                )}
              </Stack>
              <Stack
                direction={"horizontal"}
                gap={2}
                className={"pagination-info"}
              >
                <span>{products.length} results found</span>
              </Stack>
            </Stack>
          </Col>
          <Col className={"w-100 d-none"} xs={12}>
            {JSON.stringify(productQuery)}
          </Col>
        </Row>
      </Container>
    </CategoryArchiveContext.Provider>
  );
}

export default CategoryArchive;
