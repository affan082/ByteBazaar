import { useContext } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import "./price.scss";

interface Prop {
  price: Number | undefined;
  salePrice: Number | undefined;
  className?: string;
}

function Price({ price, salePrice, className }: Prop) {
  const config = useContext(ConfigContext);
  return (
    <div className={className + " product-price-and-rating price-component"}>
      <h6>
        {salePrice ? (
          <span className="product-saleprice">
            {config.app.currency_symbol + salePrice.toString()}
          </span>
        ) : (
          <></>
        )}
        <span
          className={
            "product-price" +
            (salePrice ? " text-decoration-line-through text-danger mx-2" : "")
          }
        >
          {config.app.currency_symbol + price?.toString()}
        </span>
      </h6>
    </div>
  );
}

export default Price;
