import * as React from "react"
import { addToWishlist as addToWishlistStyle } from "./add-to-wishlist.module.css"
import { DataContext } from "./wishlist/wishlistContext"

/*
  @author: swym
  @notice: wishlist button
  @dev:    component for add to wishlist button
*/

export function AddToWishlist({ ...props }) {
  const { savedListItems } = React.useContext(DataContext);
  const itemWishlisted = savedListItems.filter(e => (e.epi === Number(props.variantId)))
  return (
    <button
      type="submit"
      className={addToWishlistStyle}
      {...props}
    >
      {itemWishlisted.length > 0 ? "Added" : "Add"} to Wishlist
    </button>
  )
}
