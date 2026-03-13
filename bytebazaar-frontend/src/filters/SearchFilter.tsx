import { useState, useEffect } from "react";
import { Form, Stack } from "react-bootstrap";
import FiltersInterface from "../interfaces/FiltersInterface.tsx";

function SearchFilter({ title, queryObject, queryUpdater }: FiltersInterface) {
    const [searchTerm, setSearchTerm] = useState(queryObject.keyword || "");

    useEffect(() => {
        // Update parent whenever search term changes
        const handler = setTimeout(() => {
            queryUpdater({
                ...queryObject,
                keyword: searchTerm.trim() || undefined,
            });
        }, 400); // debounce typing

        return () => clearTimeout(handler);
    }, [searchTerm]);

    return (
        <Stack className="filter search-filter gap-2">
            {title && <h6 className="filter-title">{title}</h6>}

            <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Stack>
    );
}

export default SearchFilter;
