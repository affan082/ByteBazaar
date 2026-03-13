import { Form, FormControl, FormGroup, Stack } from "react-bootstrap";
import FiltersInterface from "../interfaces/FiltersInterface.tsx";
import "./filters.scss";

function SizeFilter({ title, queryUpdater, queryObject }: FiltersInterface) {
  function handleSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    let updatedSize = queryObject.size || [];
    if (e.target.checked && e.target.labels) {
      updatedSize.push(String(e.target.labels[0].textContent));
    } else {
      updatedSize = updatedSize.filter(
        (id) => id !== e.target.labels[0].innerText
      );
    }
    queryUpdater({ ...queryObject, size: updatedSize });
  }

  return (
    <Stack className="filter size-filter">
      {title ? <h6 className={"filter-title"}>{title}</h6> : ""}
      <FormGroup className="size-filter-inputs">
        <Form.Check
          type="checkbox"
          id="filter-size-s"
          label="S"
          onChange={handleSizeChange}
        />
        <Form.Check
          type="checkbox"
          id="filter-size-m"
          label="M"
          onChange={handleSizeChange}
        />
        <Form.Check
          type="checkbox"
          id="filter-size-l"
          label="L"
          onChange={handleSizeChange}
        />
        <Form.Check
          type="checkbox"
          id="filter-size-xl"
          label="XL"
          onChange={handleSizeChange}
        />
      </FormGroup>
    </Stack>
  );
}

export default SizeFilter;
