import {Col, Container, Form, FormControl, FormLabel, FormGroup, Row, Alert, Anchor} from "react-bootstrap";
import {ReactNode, useContext, useEffect, useState} from "react";
import axios from "axios";
import {ConfigContext} from "../../reducers/GlobalConfig.tsx";
import {GetCategories} from "../../queries/GetCategories.tsx";
import {CategoryInterface} from "../../interfaces/CategoryInterface.tsx";
import {useParams} from "react-router-dom";

function AddCategory(){
    const {categoryId} = useParams();
    const config = useContext(ConfigContext);
    const [resultShow, setResultShow] = useState(false);
    const [categories, setCategories] = useState<ReactNode[]>([]);
    const [result, setResult] = useState({
        variant: "",
        message: "",
    });
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    function updateFormValues(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if(categoryId){
        useEffect(() => {
            GetCategories({_id:categoryId}).then(res=>{
                if(res.length > 0 && res[0] !== undefined){
                    // console.log(Object.keys(res).map((key) => [key, res[key]]));
                    const category = res[0];
                    // setFormData(Object.keys(category).map((key) => [key, category[key]]));
                    setFormData(category);
                    console.log(category);
                }
            });
        }, []);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        formData.slug = formData.name.toLowerCase().replace(/[\s-]/g, "_");
        // console.log(formData);
        axios.post(config.server.uri+(categoryId?"category/update":"category/add"), formData,{
            headers:{
                "Content-Type": "application/json",
            }
        }).then((res) => {
            setResult({variant: "success", message: res.data.message || "Form Validated",});
            setResultShow(true);
            console.log(res.data);
        }).catch((err) => {
            setValidated(false);
            console.log(err);
            setResultShow(true);
            setResult({variant: "error", message: err.toString() || "Form Validation Failed",});
        });
    }

    useEffect(() => {
        GetCategories({}).then((data)=>{
            console.log(data);
            if(data){
                console.log(data,"Fara");
                setCategories(data?.map((category:CategoryInterface)=>{
                    return <option key={category._id} value={category._id}>{category.name}</option>
                }))
            }
        });
    },[]);

    const makeSlug = (str = "") => {
        return str
            .toLowerCase().normalize("NFD")
            .replace(/[\s,.;:/\\|+]+/g, "_")
            .replace(/[^a-z0-9_]/g, "")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "");
    };


    return(
        <Container className={"page add-category-page"}>
            <Row className={"page-detail"}>
                <h1 className={"page-title"}>Add New Category</h1>
            </Row>
            <Row className={"page-content"}>
                <Form className={"gap-3"} validated={validated} onSubmit={handleSubmit}>
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
                    <Row className={"mb-3"}>
                        <FormGroup as={Col}>
                            <FormLabel >
                                Name
                            </FormLabel>
                            <FormControl name={"name"} onChange={updateFormValues} value={formData["name"]||""} required></FormControl>
                        </FormGroup>
                        <FormGroup as={Col}>
                            <FormLabel >
                                Slug
                            </FormLabel>
                            <FormControl name={"slug"} onChange={updateFormValues} value={formData["name"]?.toLowerCase().replace(/[\s-]/g, "_")} required ></FormControl>
                        </FormGroup>
                        <FormGroup as={Col}>
                            <FormLabel>
                                Parent
                            </FormLabel>
                            <Form.Select name={"parent"} onChange={updateFormValues} value={formData["parent"]}>
                                <option value={""}>None</option>
                                {categories}
                            </Form.Select>
                        </FormGroup>
                    </Row>
                    <Row className={"mb-3"} >
                        <FormGroup >
                            <FormLabel>Short Description</FormLabel>
                            <FormControl name={"description"}
                                         as={"textarea"}
                                         placeholder={"Enter a Short Description (150 characters max)"}
                                         rows={5}
                                         onChange={updateFormValues}
                                         maxLength={150}
                                         value={formData["description"]}
                            ></FormControl>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <FormControl type={"submit"}
                                         value={categoryId?"Update Category":"Create Category"}
                                         className={"btn btn-primary p-3"}
                            ></FormControl>
                        </FormGroup>
                    </Row>
                    {/*{!validated && !resultShow ? (*/}
                    {/*    <Row className={"mb-3"}*/}
                    {/*         style={{*/}
                    {/*             display: `${*/}
                    {/*                 !resultShow || result.variant === "danger" ? "flex" : "none"*/}
                    {/*             }`,*/}
                    {/*         }}*/}
                    {/*    >*/}
                    {/*        <FormGroup>*/}
                    {/*            <FormControl type={"submit"}*/}
                    {/*                         value={categoryId?"Update Category":"Create Category"}*/}
                    {/*                         className={"btn btn-primary p-3"}*/}
                    {/*            ></FormControl>*/}
                    {/*        </FormGroup>*/}
                    {/*    </Row>*/}
                    {/*):(*/}
                    {/*    <Row*/}
                    {/*        style={{*/}
                    {/*            display: `${*/}
                    {/*                resultShow && result.variant === "success" ? "flex" : "none"*/}
                    {/*            }`,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <FormGroup as={Col}>*/}
                    {/*            <Anchor href="add">*/}
                    {/*                <FormControl*/}
                    {/*                    type="button"*/}
                    {/*                    className="btn btn-primary p-3 mt-4"*/}
                    {/*                    value={"Add New Category"}*/}
                    {/*                ></FormControl>*/}
                    {/*            </Anchor>*/}
                    {/*        </FormGroup>*/}
                    {/*        <FormGroup as={Col}>*/}
                    {/*            <Anchor href="all">*/}
                    {/*                <FormControl*/}
                    {/*                    type="button"*/}
                    {/*                    className="btn btn-primary p-3 mt-4"*/}
                    {/*                    value={"Return to Categories"}*/}
                    {/*                ></FormControl>*/}
                    {/*            </Anchor>*/}
                    {/*        </FormGroup>*/}
                    {/*    </Row>*/}
                    {/*)}*/}

                </Form>
            </Row>
        </Container>
    );
}

export default AddCategory;