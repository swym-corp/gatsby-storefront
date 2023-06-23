import * as React from "react"
import { Layout } from "../components/layout"
import { Seo } from "../components/seo"
import SharedWishlistPage from "../components/wishlist/sharedWishlistPage";

/*
  @author: swym
  @notice: shared wishlist page
  @dev:    component for shared wishlist page
*/


export default function SharedWishlist() {

    const [lid, setLid] = React.useState('');

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lid = urlParams.get('lid');
        setLid(lid)
    }, [])

    return (

        <Layout>
            <SharedWishlistPage lid={lid} />
        </Layout>
    )
}

export const Head = () => <Seo />
