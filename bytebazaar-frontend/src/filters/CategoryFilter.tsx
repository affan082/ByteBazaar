import { CategoryInterface } from "../interfaces/CategoryInterface.tsx";
import { useEffect, useState } from "react";
import { GetCategories } from "../queries/GetCategories.tsx";
import { Form, Stack } from "react-bootstrap";
import { ProductQueryInterface } from "../interfaces/ProductQueryInterface.tsx";
import FiltersInterface from "../interfaces/FiltersInterface.tsx";
import "./filters.scss";

function CategoryFilter({
  queryObject,
  queryUpdater,
  title,
}: FiltersInterface) {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetCategories({})
      .then((res) => {
        setCategories(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Stack className="filter category-filter filter-collapsable">
      <div className={"collapse-content"}>
        {title ? <h6 className={"filter-title"}>{title}</h6> : ""}
        {loading ? (
          <div>Loading categories...</div>
        ) : (
          categories.map((item) => (
            <Form.Check
              key={item._id}
              type="checkbox"
              id={`default-${item._id}`}
              label={`${item.name}`}
              value={item._id}
              className={
                "category-filter " +
                (item.parent && Object.keys(item.parent).length > 0
                  ? "child-category"
                  : "")
              }
              checked={!!queryObject?.categories?.find((id) => id === item._id)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const updatedCategories = e.target.checked
                  ? [...(queryObject.categories || []), item._id]
                  : queryObject.categories.filter((id) => id !== item._id);

                queryUpdater({ ...queryObject, categories: updatedCategories });

                console.log("Updated Categories:", updatedCategories);
              }}
            />
          ))
        )}
      </div>
    </Stack>
  );
}

export default CategoryFilter;
