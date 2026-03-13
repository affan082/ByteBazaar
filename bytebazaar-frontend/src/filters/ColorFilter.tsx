import FiltersInterface from "../interfaces/FiltersInterface.tsx";
import {Form, FormGroup, Stack} from "react-bootstrap";
import {ReactNode, useContext, useEffect, useState} from "react";
import {ProductConfigContext} from "../reducers/ProductConfig.tsx";
import {ProductQueryInterface} from "../interfaces/ProductQueryInterface.tsx";
import "./filters.scss";

function ColorFilter({title, queryUpdater, queryObject}:FiltersInterface) {
    const productConfig = useContext(ProductConfigContext);
    const [colorInputs, setColorInputs] = useState<ReactNode[]>([]);


    useEffect(() => {
        const inputs:ReactNode[] = [];
        productConfig.variations.availableColors.forEach((color) => {
            inputs.push(<Form.Check
                key={color.value}
                label={color.name}
                value={color.value}
                name={`color-`+color.name}
                type="checkbox"
                onChange={handleSelection}
                aria-valuetext={color.value}
                style={{'--filter-color':color.value}}
                id={`color-`+color.name} />);
        })
        setColorInputs(inputs);
    },[]);

    function handleSelection(e: React.ChangeEvent<HTMLInputElement>) {

        const updatedQuery = queryObject||{}; // Ensure it's a copy of the array or initialize
        console.log(queryObject.color);

        if (e.target.checked) {
            updatedQuery.color = updatedQuery.color||[];
            updatedQuery.color.push(e.target.value); // Add color if checked
        } else {
            updatedQuery.color = updatedQuery.color.filter((color) => color !== e.target.value); // Filter unchecked color
            // updatedColors.length = 0; // Clear the array
            // updatedColors.push(...filteredColors); // Update the array
        }

        queryUpdater({...updatedQuery}); // Update queryObject
        console.log(updatedQuery);
    }



    return (
        <Stack className="filter color-filter">
            {title?<h6 className={"filter-title"}>{title}</h6>:""}
            <FormGroup className="color-filter-inputs" >
                {colorInputs}
            </FormGroup>
        </Stack>
    );
}

export default ColorFilter;