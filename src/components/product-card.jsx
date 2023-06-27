import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { getShopifyImage } from "gatsby-source-shopify"
import { formatPrice } from "../utils/format-price"
import {
  productCardStyle,
  productHeadingStyle,
  productImageStyle,
  productDetailsStyle,
  productVendorStyle,
  productPrice,
  wishlistIconContainerStyle,
  wishlistIcon
} from "./product-card.module.css"
import CreateWishList from "./wishlist/WishlistPopUp.client"
import SwymAlert from "../components/wishlist/Alert"
import { DataContext } from "./wishlist/wishlistContext"

export function ProductCard({ product, eager }) {
  const [showCreateListPopup, setshowCreateListPopup] = React.useState(false);

  const [alertBoxType, setalertBoxType] = React.useState();
  const [showAlertBox, setshowAlertBox] = React.useState(false);
  const [alertBoxInfo, setalertBoxInfo] = React.useState('');
  const { savedListItems } = React.useContext(DataContext);
  const {
    title,
    priceRangeV2,
    slug,
    images: [firstImage],
    vendor,
    storefrontImages,
  } = product

  const price = formatPrice(
    priceRangeV2.minVariantPrice.currencyCode,
    priceRangeV2.minVariantPrice.amount
  )

  const defaultImageHeight = 200
  const defaultImageWidth = 200
  let storefrontImageData = {}
  if (storefrontImages) {
    const storefrontImage = storefrontImages.edges[0].node
    try {
      storefrontImageData = getShopifyImage({
        image: storefrontImage,
        layout: "fixed",
        width: defaultImageWidth,
        height: defaultImageHeight,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const hasImage = firstImage || Object.getOwnPropertyNames(storefrontImageData || {}).length

  const getProductId = React.useCallback(() => {
    if (product?.storefrontId) {
      return product?.storefrontId.split('Product/')[1];
    }
  }, [product]);

  const getProductVariantId = () => {
    const variant = product && product.variants && product.variants.length > 0 ? product.variants[0] : null
    if (variant?.storefrontId) {
      return variant?.storefrontId.split('ProductVariant/')[1];
    }
  };

  const handleAddToWishlistClick = (event) => {
    event.preventDefault();
    setshowCreateListPopup(true);
  };

  const isWishlisted = React.useMemo(() => {
    return savedListItems.filter(e => e.empi === Number(getProductId())).length > 0;
  }, [savedListItems, getProductId]);

  React.useEffect(() => {
    setshowAlertBox(false)
  })

  return (
    <Link
      className={productCardStyle}
      to={slug}
      aria-label={`View ${title} product page`}
    >
      <SwymAlert
        open={showAlertBox}
        toggleAlertState={setshowAlertBox}
        info={alertBoxInfo}
        type={alertBoxType} />
      {hasImage
        ? (
          <div className={productImageStyle} data-name="product-image-box">
            <GatsbyImage
              alt={firstImage?.altText ?? title}
              image={firstImage?.gatsbyImageData ?? storefrontImageData}
              loading={eager ? "eager" : "lazy"}
            />
            <div className={wishlistIconContainerStyle} onClick={handleAddToWishlistClick}>
              <svg className={wishlistIcon} width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "red" : "none"} color={isWishlisted ? "red" : "white"} xmlns="http://www.w3.org/2000/svg"><path d="M12 20.7l-1.258-1.157C5.672 15.294 2 12.124 2 8.5 2 5.462 4.462 3 7.5 3c1.852 0 3.592.906 4.5 2.35C13.908 3.906 15.648 3 17.5 3 20.538 3 23 5.462 23 8.5c0 3.624-3.672 6.794-8.742 11.043L12 20.7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>

          </div>
        ) : (
          <div style={{ height: defaultImageHeight, width: defaultImageWidth }} />
        )
      }
      <div className={productDetailsStyle}>
        <div className={productVendorStyle}>{vendor}</div>
        <h2 as="h2" className={productHeadingStyle}>
          {title}
        </h2>
        <div className={productPrice}>{price}</div>
      </div>
      {showCreateListPopup && (
        <CreateWishList
          setshowAlertBox={setshowAlertBox}
          setalertBoxType={setalertBoxType}
          setalertBoxInfo={setalertBoxInfo}
          onPopupToggle={setshowCreateListPopup}
          title={product?.title}
          productId={getProductId()}
          productVariantId={getProductVariantId()}
          slug={product.slug}
          image={product?.images[0]?.gatsbyImageData?.images?.fallback?.src}
        />
      )}
    </Link>
  )
}

export const query = graphql`
      fragment ProductCard on ShopifyProduct {
        id
    title
      storefrontId
      slug: gatsbyPath(
      filePath: "/products/{ShopifyProduct.productType}/{ShopifyProduct.handle}"
      )
      images {
        id
      altText
      gatsbyImageData(aspectRatio: 1, width: 640)
    }
      priceRangeV2 {
        minVariantPrice {
        amount
        currencyCode
      }
    }
      vendor
      variants {
        id
      storefrontId
    }
  }
      `
