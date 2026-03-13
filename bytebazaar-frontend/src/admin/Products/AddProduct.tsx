import {useContext, useEffect, useState} from "react";
import "primereact/resources/themes/md-light-indigo/theme.css";
import {
  Alert,
  Anchor,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import { ConfigContext } from "../../reducers/GlobalConfig";
import axios from "axios";
import {GetCategories} from "../../queries/GetCategories.tsx";
import {CategoryInterface} from "../../interfaces/CategoryInterface.tsx";
import {useParams} from "react-router-dom";
import {GetProducts} from "../../queries/GetProducts.tsx";
import {MultiSelect, MultiSelectChangeEvent} from "primereact/multiselect";
import "./admin-products.scss";
import {ProductConfigContext} from "../../reducers/ProductConfig.tsx";


function AddProduct() {
  // The key value pairs of form inputs
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [validated, setValidated] = useState(false);
  const config = useContext(ConfigContext);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [resultShow, setResultShow] = useState(false);
  const [result, setResult] = useState({
    variant: "",
    message: "",
  });
  const {productId} = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryInterface[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<object[]>();
  const [selectedColors, setSelectedColors] = useState<object[]>([]);
  const productConfig = useContext(ProductConfigContext);

  useEffect(() => {
    if(productId) {
      setLoading(true);
      GetProducts({_id: productId}).then(data => {
        setFormData({...data[0], categories: data[0].categories?.map((category: { _id: any; }) => category._id)});
        setSelectedCategories(data[0].categories || []);
        setSelectedColors(data[0].color.filter(i=>i!=="")||[]);
        setSelectedSizes(data[0].size||[]);
        // console.log(data[0]);
        setLoading(false);
      }).catch(error => {
        setResult({variant: "error", message: error.message});
        setResultShow(true);
        console.log(error);
      });
    }
        console.log(formData);
  }, [productId]);


  // Change the selected categories to an array if string
  useEffect(() => {
    setFormData({...formData, "categories": selectedCategories.length>0?selectedCategories.map(i=>i._id):""});
    // console.log(selectedCategories);
  }, [selectedCategories,loading]);

  // Change the selected sizes to an array if string
  useEffect(() => {
    // console.log(selectedSizes);
    if(selectedSizes && selectedSizes.length>0){
      setFormData({...formData, "size": selectedSizes||""});
    }
  }, [selectedSizes]);

  // Change the selected colors to an array if string
  useEffect(() => {
    console.log(selectedColors);
    if(selectedColors && selectedColors.length>0){
      setFormData({...formData, "color": selectedColors});
    }
  }, [selectedColors]);


  function updateFormValues(e: any) {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files });
    }
    else {
      const _formData = {...formData};
      if(e.target.name === "name") {
        let _slug = document.querySelector("input[name='slug']");
        _slug.value = slugify(e.target.value);
        _formData["slug"] = slugify(e.target.value);
      }

      setFormData({ ..._formData, [e.target.name]: e.target.value });
    }
  }

  useEffect(() => {
    GetCategories({}).then((data)=>{
      if(data){
        setCategories(data);
      }
    });
  },[]);

  function slugify(text: string){
    return text
        .toString()                     // Cast to string
        .toLowerCase()                  // Convert the string to lowercase letters
        .normalize('NFD')       // The normalize() method returns the Unicode Normalization Form of a given string.
        .trim()                         // Remove whitespace from both sides of a string
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-');
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    const frmData = new FormData();
    //Normalize the prices
    for (let key in formData) {
      if (formData[key] && formData[key].length > 0 && formData[key].item) {
        Array.from(formData[key]).forEach((file) => {
          frmData.append(key, file);
        });
      } else {
        frmData.append(key, formData[key]);
      }
    }

    // console.log(frmData.get("gallery"));

    // console.log(frmData.get("featureImage"));
    axios
        .post(config.server.uri + (productId?"update-product":"add-product"), frmData,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          setResult({
            variant: "success",
            message: res.data.message,
          });
        })
        .catch((e) => {
          setResult({
            variant: "danger",
            message: `The product could not be added successfully. Reason ${e.response.data.errorCode}`,
          });
        });
    setResultShow(true);
    console.log(formData);
    setValidated(true);
  };
  return (
    <Container className="page admin-page product-page add-product-page">
      {
        loading?
            <Spinner animation="border" role="status" className={"loader"}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            :
            <></>
      }
      <Stack>
        <Form
          className={""}
          validated={validated}
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <Row
            className="result mt-4"
            style={{ display: `${resultShow ? "block" : "none"}` }}
          >
            <Alert
              variant={result.variant}
              onClose={() => setResultShow(false)}
              dismissible
            >
              {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
              <p>{result.message}</p>
            </Alert>
          </Row>
          <Row>
            <FormGroup as={Col} className="">
              <FormLabel>SKU</FormLabel>
              <FormControl
                name="sku"
                id="input_product_sku"
                onChange={updateFormValues}
                defaultValue={formData.sku}
              />
            </FormGroup>
            <FormGroup as={Col} className="">
              <FormLabel>Name</FormLabel>
              <FormControl
                id="input_product_name"
                required
                name="name"
                onChange={(e)=>{
                  updateFormValues(e);
                }}
                defaultValue={formData["name"]}
              ></FormControl>
            </FormGroup>
            <FormGroup as={Col} className="">
              <FormLabel>Slug</FormLabel>
              <FormControl
                  id="input_product_slug"
                  required
                  name="slug"
                  onChange={updateFormValues}
                  defaultValue={formData["slug"]}
                  readOnly={true}
              ></FormControl>
            </FormGroup>
            <FormGroup as={Col} className="w-50">
              <FormLabel>Manufacturer</FormLabel>
              <FormControl
                id="input_product_manufacturer"
                name="manufacturer"
                onChange={updateFormValues}
                defaultValue={formData.manufacturer}
              ></FormControl>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup as={Col}>
              <FormLabel>Short Description</FormLabel>
              <FormControl
                id="input_short_product_description"
                name="shortDescription"
                onChange={updateFormValues}
                maxLength={300}
                defaultValue={formData.shortDescription}
              ></FormControl>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup as={Col}>
              <FormLabel>Description</FormLabel>
              <FormControl
                as={"textarea"}
                rows={6}
                id="input_product_description"
                name="description"
                onChange={updateFormValues}
                defaultValue={formData.description}
              ></FormControl>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup as={Col}>
              <FormLabel>Feature Image</FormLabel>
              <FormControl
                type={"file"}
                id="input_product_feature_image"
                accept="image/*"
                name="featureImage"
                onChange={updateFormValues}
              ></FormControl>
            </FormGroup>
            <FormGroup as={Col}>
              <FormLabel>Image Gallery</FormLabel>
              <FormControl
                type={"file"}
                id="input_product_image_gallery"
                accept="image/*"
                multiple
                name="gallery"
                onChange={updateFormValues}
              ></FormControl>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup as={Col}>
              <FormLabel>Price</FormLabel>
              <FormControl
                type="number"
                id="input_product_price"
                required
                name="price"
                onChange={updateFormValues}
                step={0.01}
                defaultValue={formData.price}
              ></FormControl>
            </FormGroup>
            <FormGroup as={Col}>
              <FormLabel>Sale Price</FormLabel>
              <FormControl
                type="number"
                id="input_product_sale_price"
                name="salePrice"
                max={formData.price - 1}
                onChange={updateFormValues}
                step={0.01}
                defaultValue={formData.sale_price}
              ></FormControl>
            </FormGroup>
            <FormGroup as={Col} className={"product-category-field-group"}>
              <FormLabel>Categories</FormLabel>
              {/*<Form.Select*/}
              {/*  id="input_product_category"*/}
              {/*  name="category"*/}
              {/*  onChange={updateFormValues}*/}
              {/*  value={formData.category}*/}
              {/*>*/}
              {/*  <option value={""}>Select Category</option>*/}
              {/*  {categories}*/}
              {/*</Form.Select>*/}
              <MultiSelect options={categories}
                           onChange={(e:MultiSelectChangeEvent)=>{
                             setSelectedCategories(e.value);
                             // console.log(e);
                           }}
                           filter
                           name={"categories"}
                           // display={"chip"}
                           optionLabel={"name"}
                           selectAllLabel={"Select All"}
                           placeholder={"Select"}
                           value={selectedCategories}
                           className="w-full md:w-20rem"
              />
              {/*{selectedCategories.map(category => (category.name))}*/}
            </FormGroup>
          </Row>
          <Row>
            <FormGroup as={Col}>
              <FormLabel>Current Stock</FormLabel>
              <FormControl
                type="number"
                id="input_product_stock"
                name="stock"
                onChange={updateFormValues}
                defaultValue={formData.stock||0}
              ></FormControl>
            </FormGroup>
            <FormGroup as={Col}>
              <FormLabel>Brand</FormLabel>
              <FormControl
                id="input_product_brand"
                name="brand"
                onChange={updateFormValues}
                defaultValue={formData.brand}
              ></FormControl>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup as={Col} className={"d-flex flex-column gap-0"}>
              <FormLabel>Size(Comma Separated)</FormLabel>
              {/*<FormControl*/}
              {/*  id="input_product_size"*/}
              {/*  name="size"*/}
              {/*  onChange={updateFormValues}*/}
              {/*  defaultValue={formData.size?.toString()}*/}
              {/*></FormControl>*/}
              <MultiSelect options={productConfig.variations.availableSizes}
                           onChange={(e:MultiSelectChangeEvent)=>{
                             setSelectedSizes(e.value);
                             // console.log(e);
                           }}
                           name={"size"}
                           selectAllLabel={"Select All"}
                  // display={"chip"}
                           optionLabel={"name"}
                           placeholder={"Select"}
                           value={selectedSizes}
                           className="w-full md:w-20rem"
              />
            </FormGroup>
            <FormGroup as={Col}>
              <FormLabel as={Col} className={"d-flex flex-column gap-0"}>
                <FormLabel>Color(Comma Separated)</FormLabel>
                {/*<FormControl*/}
                {/*  id="input_product_color"*/}
                {/*  name="color"*/}
                {/*  onChange={(e) => {*/}
                {/*    setFormData({*/}
                {/*      ...formData,*/}
                {/*      [e.target.name]: e.target.value,*/}
                {/*    });*/}
                {/*  }}*/}
                {/*  defaultValue={formData.color?.toString()}*/}
                {/*></FormControl>*/}
                <MultiSelect options={productConfig.variations.availableColors}
                             onChange={(e:MultiSelectChangeEvent)=>{
                               setSelectedColors(e.value);
                               // console.log(e);
                             }}
                             name={"color"}
                             selectAllLabel={"Select All"}
                    // display={"chip"}
                             optionLabel={"name"}
                             placeholder={"Select"}
                             value={selectedColors}
                             className="w-full md:w-20rem"
                />
              </FormLabel>
            </FormGroup>
          </Row>
          <Row
            style={{
              display: `${
                !resultShow || result.variant === "danger" ? "flex" : "none"
              }`,
            }}
          >
            <FormGroup as={Col}>
              <FormControl
                type="submit"
                className="btn btn-primary p-3 mt-4"
              ></FormControl>
            </FormGroup>
          </Row>
          <Row
            style={{
              display: `${
                resultShow && result.variant === "success" ? "flex" : "none"
              }`,
            }}
          >
            <FormGroup as={Col}>
              <Anchor href={config.app.urls.add_product}>
                <FormControl
                  type="button"
                  className="btn btn-primary p-3 mt-4"
                  value={"Add New Product"}
                ></FormControl>
              </Anchor>
            </FormGroup>
            <FormGroup as={Col}>
              <Anchor href={`${config.app.product_archive_path}`}>
                <FormControl
                  type="button"
                  className="btn btn-primary p-3 mt-4"
                  value={"Return to Product Listing"}
                ></FormControl>
              </Anchor>
            </FormGroup>
          </Row>
        </Form>
      </Stack>
    </Container>
  );
}

export default AddProduct;
