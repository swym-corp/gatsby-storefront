import * as  React from "react";

import { Link } from "gatsby"
import "./productCardList.css"
import { AddToCart } from "../add-to-cart"
import { fetchVariantAvailability } from "../../swym/fetch-variant-availibility";
import { deleteVariantFromList } from "../../swym/api";

/*
  @author: swym
  @notice: product card
  @dev:    component for product card
  @param:  product - product card details
*/

function ProductCard({
    product,
    updateListItems,
    sharedList }) {
    const removeFromWishlist = async (e) => {
        e.preventDefault();
        try {
            const res = await deleteVariantFromList(
                product.lid,
                product.empi,
                product.epi,
                product.du
            );
            if (res.error) {
                updateListItems(false);
            } else {
                updateListItems(true)
            }
        } catch (e) {
            console.log('Exception', e);
            updateListItems(false)
        }
    }
    const [availableForSale, setavailableForSale] = React.useState(true)
    const checkAvailablity = React.useCallback(async () => {
        const availability = await fetchVariantAvailability(product.epi)
        setavailableForSale(availability)
    }, [product.epi])
    React.useEffect(() => {
        checkAvailablity()
    }, [checkAvailablity])

    const imgSrc = product.iu && `${product.iu.replace("620x620", "160x160_crop_center")} 160w, ${product.iu.replace("620x620", "320x320_crop_center")} 320w,${product.iu.replace("620x620", "620x620_crop_center")} 640w`;

    return (
        <Link
            className={"productCardStyle"}
            to={product?.cprops?.slug}
            aria-label={`View ${product.dt} product page`}
        >
            <div className={"productImageStyle"} data-name="product-image-box">
                <img width={640} height={640} src={product.iu} srcSet={imgSrc} alt={product.dt} />
                {!sharedList && <div class="remove-wishlist-icon" onClick={removeFromWishlist}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cross-svg">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </div>}
            </div>
            <div className={"productDetailsStyle"}>
                <div className={"productVendorStyle"}>{product.bt}</div>
                <h2 as="h2" className={"productHeadingStyle"}>
                    {product.dt}
                </h2>
                <div className={"addToCartStyle"}>
                    <AddToCart
                        variantId={`gid://shopify/ProductVariant/${product.epi}`}
                        quantity={1}
                        available={availableForSale}
                    />
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
