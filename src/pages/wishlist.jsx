import * as React from "react"
import { Layout } from "../components/layout"
import { Seo } from "../components/seo"
import WishlistPage from "../components/wishlist/wishlistPage";

/*
  @author: swym
  @notice: wishlist page
  @dev:    component for wishlist page
*/


export default function Wishlist() {

    return (

        <Layout>
            <WishlistPage />
        </Layout>
    )
}

export const Head = () => <Seo />
