import * as React from "react"
import { SkipNavContent, SkipNavLink } from "./skip-nav"
import { Header } from "./header"
import { Footer } from "./footer"
import WishlistContext from "./wishlist/wishlistContext"

export function Layout({ children }) {

  return (
    <div>
      <SkipNavLink />
      <WishlistContext>
        <Header />
        <SkipNavContent>{children}</SkipNavContent>
      </WishlistContext>
      <Footer />
    </div>
  )
}
