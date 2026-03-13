import { GetProducts } from "../../queries/GetProducts.tsx";
import React, { ReactNode, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import "./QueryableLoopGrid.scss";

interface GridItemProps {
  _id: string | number;

  [key: string]: any;
}

interface GridProps<T extends GridItemProps> {
  query?: object;
  data?: T[];
  className?: string;
  gap?: number;
  columns?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
    laptop_large?: number;
    laptop?: number;
  };
  limits?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
    laptop_large?: number;
    laptop?: number;
  };
  TemplateComponent: React.ComponentType<T>;
  title: string;
}

function QueryableLoopGrid<T extends GridItemProps>({
  data,
  query,
  TemplateComponent,
  gap = 10,
  className,
  columns,
  title,
  limits,
}: GridProps<T>) {
  // const [data, setData] = useState<T[]>([]);
  const [items, setItems] = useState<ReactNode[]>([]);

  let _col;
  let _limit;

  if (window.innerWidth <= 480) {
    _col =
      columns?.mobile ||
      columns?.tablet ||
      columns?.laptop ||
      columns?.laptop_large ||
      columns?.desktop;
    _limit =
      limits?.mobile ||
      limits?.tablet ||
      limits?.laptop ||
      limits?.laptop_large ||
      limits?.desktop;
  } else if (window.innerWidth <= 768) {
    _col =
      columns?.tablet ||
      columns?.laptop ||
      columns?.laptop_large ||
      columns?.desktop;
    _limit =
      limits?.tablet ||
      limits?.laptop ||
      limits?.laptop_large ||
      limits?.desktop;
  } else if (window.innerWidth <= 1024) {
    _col = columns?.laptop || columns?.laptop_large || columns?.desktop;
    _limit = limits?.laptop || limits?.laptop_large || limits?.desktop;
  } else if (window.innerWidth <= 1440) {
    _col = columns?.laptop_large || columns?.desktop;
    _limit = limits?.laptop_large || limits?.desktop;
  } else {
    _col = columns?.desktop;
    _limit = limits?.desktop;
  }

  if (!limits) _limit = 12;
  useEffect(() => {
    if (data) {
      // console.log();
      // setproductFound(data.length>0);
      fillProducts(data);
    } else {
      GetProducts({ ...query, limit: _limit }).then((_data) => {
        // setData(_data); // Update the state for reactivity
        // console.log(_data); // Log the fetched data
        fillProducts(_data);
      });
    }
  }, [query, data]);

  const newList: ReactNode[] = [];

  function fillProducts(_data: T[]) {
    // console.log(_data);
    if (_data) {
      // Use _data directly to build the list
      // console.log(_data);
      for (let i = 0; i < Object.keys(_data).length; i++) {
        newList.push(
          <div
            key={_data[i]._id}
            className={"loop-grid-item"}
            // style={{ width: `calc((100% - ${_col * gap}px)/${_col})` }}
          >
            <TemplateComponent {..._data[i]} />
          </div>
        );
      }
      setItems(newList); // Update the items
    }
  }

  return (
    <Container className={"queryable-loop-grid-wrapper"}>
      <Row className={"title-row"}>
        {title && <h5 className={"loop-grid-title"}>{title}</h5>}
      </Row>
      {items.length > 0 ? (
        <Row
          className={className + " queryable-loop-grid"}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${_col}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {items}
        </Row>
      ) : (
        <h6>Sorry, no product found.</h6>
      )}
    </Container>
    // <Container className={className + " queryable-loop-grid"}
    //            style={{
    //                display:"grid",
    //                gridTemplateColumns:`repeat(${_col}, 1fr)`,
    //                gap:`${gap}px`,
    //            }}>
    //
    //     {/*{productFound?items:*/}
    //     {/*<h6>Sorry, no product found.</h6>*/}
    //     {/*}*/}
    //     {items}
    // </Container>
  );
}

export default QueryableLoopGrid;
