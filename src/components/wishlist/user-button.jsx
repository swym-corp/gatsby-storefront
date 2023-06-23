import * as React from "react"
import { Link } from "gatsby"
import User from "../../icons/user"
import { userButton, badge } from "./user-button.module.css"
import { DataContext } from "./wishlistContext"

/*
  @author: swym
  @notice: user icon
  @dev:    component for user icon
*/

export function UserButton() {

  const { userAuthenticated } = React.useContext(DataContext)

  return (
    <Link
      to={userAuthenticated ? "#" : "/login"}
      className={userButton}
    >
      <User />
      {userAuthenticated && <div className={badge} />}
    </Link>
  )
}
