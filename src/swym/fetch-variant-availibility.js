import axios from "axios";

/*
  @author: swym
  @notice: to fetch variant availability for sale
  @dev:    fetches from plaform if variant is available for sale
  @param:  variant = id of the variant
  @return: if variant is available for sale true/false
*/

export const fetchVariantAvailability = async (variantId) => {
  try {
    const response = await axios.post(`https://${process.env.GATSBY_SHOPIFY_STORE_URL}/api/2023-04/graphql`, JSON.stringify({
      query: `
        query {
          node(id: "gid://shopify/ProductVariant/${variantId}") {
            ... on ProductVariant {
              availableForSale
            }
          }
        }
      `,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.GATSBY_STOREFRONT_ACCESS_TOKEN,
      },
    });

    const variantAvailability = response?.data?.data?.node?.availableForSale;;
    return variantAvailability;
  } catch (error) {
    console.error(error)
    return false
  }
}