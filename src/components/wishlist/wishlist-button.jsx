import * as React from "react"
import { Link } from "gatsby"
import Wishlist from "../../icons/wishlist"
import { wishlistButton, badge } from "./wishlist-button.module.css"
import { DataContext } from "./wishlistContext";

/*
  @author: swym
  @notice: wishlist icon
  @dev:    component for wishlist icon
*/

export function WishlistButton() {
  const { savedListItemsCount } = React.useContext(DataContext);
  return (
    <Link
      aria-label={`Wishlist with ${savedListItemsCount} items`}
      to="/wishlist"
      className={wishlistButton}
    >
      <Wishlist />
      {savedListItemsCount > 0 && <div className={badge}>{savedListItemsCount}</div>}
    </Link>
  )
}
