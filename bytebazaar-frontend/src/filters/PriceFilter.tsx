import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { Slider } from "primereact/slider";
import FiltersInterface from "../interfaces/FiltersInterface.tsx";
import "./filters.scss";

function PriceFilter({
  title,
  queryObject,
  queryUpdater,
  range,
}: FiltersInterface) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    range.min,
    range.max,
  ]);
  useEffect(() => {
    setPriceRange([range?.min, range?.max]);
  }, []);

  useEffect(() => {
    // Always keep [min, max] in correct order
    const [min, max] = priceRange;
    queryUpdater({
      ...queryObject,
      price: {
        min: Math.min(min, max),
        max: Math.max(min, max),
      },
    });
  }, [priceRange]);
  // console.log("Price-Range: ",priceRange);

  return (
    <Stack className="filter price-filter gap-2">
      <h6 className="filter-title">{title}</h6>

      <div className="d-flex justify-content-between">
        <span className={"value-min"}>
          Min: {Math.min(priceRange[0], priceRange[1])}
        </span>
        <span className={"value-max"}>
          Max: {Math.max(priceRange[0], priceRange[1])}
        </span>
      </div>

      <Slider
        value={priceRange}
        onChange={(e) => setPriceRange(e.value as [number, number])}
        min={range.min}
        max={range.max}
        range
      />
    </Stack>
  );
}

export default PriceFilter;
