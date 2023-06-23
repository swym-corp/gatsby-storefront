import * as React from "react";

import "./productCardList.css"
import ProductCard from "./productCard";

/*
  @author: swym
  @notice: product list
  @dev:    component for product list in wishlist page
  @param:  products - array of products
*/

function ProductCardList({
    products,
    updateListItems,
    sharedList }) {
    return (
        <div className={"listingContainerStyle"}>
            {products.map((product) => (
                <ProductCard
                    product={product}
                    updateListItems={updateListItems}
                    sharedList={sharedList} />
            ))}
        </div>
    );
}

export default ProductCardList;
