// //
// // THIS COMPONENT IS MAYBE DEPRECATED.
// //
// import React, { ReactNode, useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { GetProducts } from "../../queries/GetProducts";
// import axios from "axios";
// import { ConfigContext } from "../../reducers/GlobalConfig";
// import {
//   Alert,
//   Anchor,
//   Col,
//   Container,
//   Form,
//   FormControl,
//   FormGroup,
//   FormLabel,
//   Row,
//   Stack,
// } from "react-bootstrap";
// import { GetCategories } from "../../queries/GetCategories.tsx";
// import { CategoryInterface } from "../../interfaces/CategoryInterface.tsx";

// function Product() {
//   const { productId } = useParams();
//   // const [product, setProduct] = useState<Object>();
//   const [formData, setFormData] = useState<{ [key: string]: any }>({});
//   const [validated, setValidated] = useState(false);
//   const config = useContext(ConfigContext);
//   const [categories, setCategories] = useState<ReactNode[]>([]);

//   const [resultShow, setResultShow] = useState(false);
//   const [result, setResult] = useState({
//     variant: "",
//     message: "",
//   });

//   useEffect(() => {
//     axios
//       .get(config.server.uri + "product/?id=" + productId)
//       .then((data) => {
//         setFormData(data.data);
//         // //console.log(formData._id);
//       })
//       .catch((e) => {
//         //console.log(e);
//       });
//   }, []);

//   useEffect(() => {
//     GetCategories({}).then((data) => {
//       if (data) {
//         setCategories(
//           data?.map((category: CategoryInterface) => {
//             return (
//               <option key={category._id} value={category._id}>
//                 {category.name}
//               </option>
//             );
//           }),
//         );
//       }
//     });
//   }, []);

//   function updateFormValues(e: any) {
//     if (e.target.type === "file") {
//       setFormData({ ...formData, [e.target.name]: e.target.files });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   }
//   const handleSubmit = async (event: any) => {
//     event.preventDefault();
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//       return;
//     }
//     const frmData = new FormData();
//     for (let key in formData) {
//       if (formData[key] && formData[key].length > 0 && formData[key].item) {
//         Array.from(formData[key]).forEach((file) => {
//           frmData.append(key, file);
//         });
//       } else {
//         frmData.append(key, formData[key]);
//       }
//     }

//     //console.log(formData);

//     // //console.log(frmData.get("gallery"));

//     // //console.log(frmData.get("featureImage"));
//     axios
//       .post(config.server.uri + "update-product", frmData)
//       .then((res) => {
//         //console.log(res);
//         setResult({
//           variant: "success",
//           message: `Product ID: ${formData._id} has been updated successfully.`,
//         });
//       })
//       .catch((e) => {
//         setResult({
//           variant: "danger",
//           message: `The product could not be updated successfully.`,
//         });
//       });
//     setResultShow(true);

//     setValidated(true);
//   };
//   //console.log(formData);
//   if (!formData) {
//     return <h1>404</h1>;
//   }

//   return (
//     <Container className="page product-page">
//       <Stack>
//         <Form
//           className={""}
//           validated={validated}
//           method="post"
//           onSubmit={handleSubmit}
//           encType="multipart/form-data"
//         >
//           <Row
//             className="result mt-4"
//             style={{ display: `${resultShow ? "block" : "none"}` }}
//           >
//             <Alert
//               variant={result.variant}
//               onClose={() => setResultShow(false)}
//               dismissible
//             >
//               {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
//               <p>{result.message}</p>
//             </Alert>
//           </Row>
//           <Row>
//             <Col>
//               <FormGroup>
//                 <FormLabel>Product ID</FormLabel>
//                 <FormControl value={formData._id} readOnly></FormControl>
//               </FormGroup>
//             </Col>
//           </Row>
//           <Row>
//             <FormGroup as={Col} className="">
//               <FormLabel>SKU</FormLabel>
//               <FormControl
//                 name="sku"
//                 id="input_product_sku"
//                 value={formData.sku}
//                 onChange={updateFormValues}
//               />
//             </FormGroup>
//             <FormGroup as={Col} className="">
//               <FormLabel>Name</FormLabel>
//               <FormControl
//                 id="input_product_name"
//                 required
//                 name="name"
//                 value={formData.name}
//                 onChange={updateFormValues}
//               ></FormControl>
//             </FormGroup>
//             <FormGroup as={Col} className="w-50">
//               <FormLabel>Manufacturer</FormLabel>
//               <FormControl
//                 id="input_product_manufacturer"
//                 name="manufacturer"
//                 onChange={updateFormValues}
//                 value={formData.manufacturer}
//               ></FormControl>
//             </FormGroup>
//           </Row>
//           <Row>
//             <FormGroup as={Col}>
//               <FormLabel>Short Description</FormLabel>
//               <FormControl
//                 id="input_short_product_description"
//                 name="shortDescription"
//                 onChange={updateFormValues}
//                 maxLength={300}
//                 value={formData.shortDescription}
//               ></FormControl>
//             </FormGroup>
//           </Row>
//           <Row>
//             <FormGroup as={Col}>
//               <FormLabel>Description</FormLabel>
//               <FormControl
//                 as={"textarea"}
//                 rows={6}
//                 id="input_product_description"
//                 name="description"
//                 onChange={updateFormValues}
//                 value={formData.description}
//               ></FormControl>
//             </FormGroup>
//           </Row>
//           <Row>
//             <div className="alert alert-warning m-1" role="alert">
//               Leave Empty if you do not want to update the feature image and
//               gallery.
//               <Row>
//                 <FormGroup as={Col}>
//                   <FormLabel>Feature Image</FormLabel>
//                   <FormControl
//                     type={"file"}
//                     id="input_product_feature_image"
//                     accept="image/*"
//                     name="featureImage"
//                     onChange={updateFormValues}
//                     // value={formData.featureImage}
//                   ></FormControl>
//                 </FormGroup>
//                 <FormGroup as={Col}>
//                   <FormLabel>Image Callery</FormLabel>
//                   <FormControl
//                     type={"file"}
//                     id="input_product_image_gallery"
//                     accept="image/*"
//                     multiple
//                     name="gallery"
//                     onChange={updateFormValues}
//                     // value={formData.gallery}
//                   ></FormControl>
//                 </FormGroup>
//               </Row>
//             </div>
//           </Row>
//           <Row>
//             <FormGroup as={Col}>
//               <FormLabel>Price</FormLabel>
//               <FormControl
//                 type="number"
//                 id="input_product_price"
//                 required
//                 name="price"
//                 onChange={updateFormValues}
//                 step={0.01}
//                 value={formData.price}
//               ></FormControl>
//             </FormGroup>
//             <FormGroup as={Col}>
//               <FormLabel>Sale Price</FormLabel>
//               <FormControl
//                 type="number"
//                 id="input_product_sale_price"
//                 name="salePrice"
//                 onChange={updateFormValues}
//                 step={0.01}
//                 value={formData.salePrice}
//               ></FormControl>
//             </FormGroup>
//             <FormGroup as={Col}>
//               <FormLabel>Categories</FormLabel>
//               <Form.Select
//                 id="input_product_category"
//                 name="category"
//                 onChange={updateFormValues}
//                 value={formData.category}
//               >
//                 <option value={"none"}>Select Category</option>
//                 {categories}
//               </Form.Select>
//             </FormGroup>
//           </Row>
//           <Row>
//             <FormGroup as={Col}>
//               <FormLabel>Current Stock</FormLabel>
//               <FormControl
//                 type="number"
//                 id="input_product_stock"
//                 name="stock"
//                 onChange={updateFormValues}
//                 value={formData.stock}
//               ></FormControl>
//             </FormGroup>
//             <FormGroup as={Col}>
//               <FormLabel>Brand</FormLabel>
//               <FormControl
//                 id="input_product_brand"
//                 name="brand"
//                 onChange={updateFormValues}
//                 value={formData.brand}
//               ></FormControl>
//             </FormGroup>
//           </Row>
//           <Row>
//             <FormGroup as={Col}>
//               <FormLabel as={Col}>
//                 <FormLabel>Color(Comma Separated)</FormLabel>
//                 <FormControl
//                   id="input_product_color"
//                   name="color"
//                   onChange={(e) => {
//                     setFormData({
//                       ...formData,
//                       [e.target.name]: e.target.value,
//                     });
//                   }}
//                   value={formData.color}
//                 ></FormControl>
//               </FormLabel>
//             </FormGroup>
//           </Row>
//           <Row>
//             <FormGroup as={Col}>
//               <FormControl
//                 type="submit"
//                 className="btn btn-primary p-3 mt-4"
//                 value={"Update"}
//               ></FormControl>
//             </FormGroup>
//           </Row>
//         </Form>
//       </Stack>
//     </Container>
//   );
// }

// export default Product;
