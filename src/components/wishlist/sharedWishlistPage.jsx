import * as React from "react"
import './sharedWishlistPage.css';
import ProductCardList from "./productList";
import { fetchListContents } from "../../swym/api";

/*
  @author: swym
  @notice: shared wishlist page
  @dev:    component for shared wishlist page
*/

export default function SharedWishlistPage({ lid }) {

    const [selectedListName, setselectedListName] = React.useState(null);
    const selectedListId = lid
    const [selectedListItems, setselectedListItems] = React.useState([]);


    const fetchListItems = React.useCallback(async () => {
        if (selectedListId.length === 0) {
            return
        }
        const list = await fetchListContents(selectedListId);
        setselectedListItems(list.items);
        setselectedListName(list.list.lname);
    }, [selectedListId])


    React.useEffect(() => {
        fetchListItems();
    }, [fetchListItems])

    return (
        <>
            <section className="wishlist-section">
                <div className="wishlist-header">
                    <div>
                        <h2 className="wishlist-heading">{selectedListName}</h2>
                        <p className="wishlist-heading-sub-text">Wishlisted Products will be added here.</p>
                    </div>
                </div>
                {selectedListItems.length === 0 && <div className="text-center">
                    <br />
                    <br />
                    <h3 className="wishlist-heading-empty">Love It? Add To My Wishlist</h3>
                    <p>
                        My Wishlist allows you to keep track of all of your favorites and shopping activity whether you're on your computer, phone, or tablet. You won't have to waste time searching all over again for that item you loved on your phone the other day - it's all here in one place!
                    </p>
                </div>}
                <ProductCardList
                    products={selectedListItems}
                    sharedList={true}
                />
            </section>
        </>
    )
}