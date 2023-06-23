import * as React from "react"
import './wishlistPage.css';
import Dropdown from "./dropdown"
import SwymAlert from "./Alert";
import ProductCardList from "./productList";
import { DataContext } from "./wishlistContext";
import ShareList from "./shareList";

/*
  @author: swym
  @notice: wishlist page
  @dev:    component for wishlist page
*/

export default function WishlistPage() {

    const [selectedListName, setselectedListName] = React.useState(null);
    const [selectedListId, setselectedListId] = React.useState(null);
    const [selectedListItems, setselectedListItems] = React.useState([]);
    const [alertBoxType, setalertBoxType] = React.useState();
    const [showAlertBox, setshowAlertBox] = React.useState(false);
    const [alertBoxInfo, setalertBoxInfo] = React.useState('');
    const [showShareList, setshowShareList] = React.useState(false);
    const { savedLists, updateListContents, userAuthenticated } = React.useContext(DataContext);

    const onListChange = (lname, lid) => {
        setselectedListName(lname);
        setselectedListId(lid);
        fetchListItems(lid);
    }

    const fetchListItems = React.useCallback((lid) => {
        const list = savedLists.filter(e => (e.lid === lid));
        if (list.length > 0) {
            setselectedListItems(list[0].listcontents);
        } else {
            setselectedListItems([]);
        }
    }, [savedLists])

    const onVariantRemove = async (error) => {
        if (!error) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Product not deleted from wishlist');
        } else {
            await updateListContents();
            fetchListItems(selectedListId)
            setshowAlertBox(true);
            setalertBoxType('success');
            setalertBoxInfo('Product deleted from wishlist');
        }
    }

    React.useEffect(() => {
        if (selectedListId) {
            fetchListItems(selectedListId)
        } else if (savedLists.length > 0) {
            setselectedListId(savedLists[0].lid)
            setselectedListName(savedLists[0].lname)
            fetchListItems(savedLists[0].lid)
        }
        setshowAlertBox(false)
    }, [savedLists, fetchListItems, selectedListId])

    return (
        <>
            {showShareList &&
                <ShareList
                    setshowShareList={setshowShareList}
                    setshowAlertBox={setshowAlertBox}
                    setalertBoxType={setalertBoxType}
                    setalertBoxInfo={setalertBoxInfo}
                    selectedListId={selectedListId}
                />}
            <SwymAlert
                open={showAlertBox}
                toggleAlertState={setshowAlertBox}
                info={alertBoxInfo}
                type={alertBoxType} />
            <section className="wishlist-section">
                <div className="wishlist-header">
                    <div>
                        <h2 className="wishlist-heading">My Wishlist</h2>
                        <p className="wishlist-heading-sub-text">Wishlisted Products will be added here.</p>
                    </div>
                    <div className="swym-wishlist-page-actions">
                        {userAuthenticated && savedLists.length > 0 && <button className="swym-share-btn" onClick={() => { setshowShareList(true) }}>Share List</button>}
                        {savedLists.length > 0 &&
                            <Dropdown lists={savedLists} selectedListName={selectedListName} onListChange={onListChange} />
                        }
                    </div>
                </div>
                {savedLists.length === 0 && <div className="text-center">
                    <br />
                    <br />
                    <h3 className="wishlist-heading-empty">Love It? Add To My Wishlist</h3>
                    <p>
                        My Wishlist allows you to keep track of all of your favorites and shopping activity whether you're on your computer, phone, or tablet. You won't have to waste time searching all over again for that item you loved on your phone the other day - it's all here in one place!
                    </p>
                </div>}
                {savedLists.length > 0 && selectedListItems.length === 0 && <div className="text-center">
                    <br />
                    <br />
                    <h3 className="wishlist-heading-empty">Love It? Add To My Wishlist</h3>
                    <p>
                        You haven't Wishlisted anything yet!
                    </p>
                </div>}
                <ProductCardList
                    products={selectedListItems}
                    updateListItems={onVariantRemove} />
            </section>
        </>
    )
}