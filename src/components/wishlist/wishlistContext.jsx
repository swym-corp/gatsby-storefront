import React, { createContext, useEffect, useState } from "react"
import { getAllLists } from "../../swym/api"

export const DataContext = createContext()

/*
  @author: swym
  @notice: wishlist context data
  @dev:    component for wishlist context data
*/

const WishlistContext = ({ children }) => {
    const [savedLists, setsavedLists] = useState([])
    const [savedListItems, setsavedListsavedListItems] = useState([])
    const [savedListItemsCount, setsavedListsavedListItemsCount] = useState(0)
    const [userAuthenticated, setuserAuthenticated] = React.useState(false)

    const updateListContents = async () => {
        const data = await getAllLists()
        if (!data.error) {
            localStorage.setItem('swymListData', JSON.stringify(data));
            const listItems = data.reduce((p, c) => [...p, ...c.listcontents], [])
            setsavedLists([...data])
            setsavedListsavedListItems([...listItems])
            setsavedListsavedListItemsCount(listItems.length)
        } else {
            console.error("Error in fetching list items")
        }
    }

    const updateListContentsFromLocal = React.useCallback(async () => {
        let listData = localStorage.getItem('swymListData');
        listData = JSON.parse(listData);
        if (listData && Array.isArray(listData) && listData.length > 0) {
            const listItems = listData.reduce((p, c) => [...p, ...c.listcontents], [])
            setsavedLists([...listData])
            setsavedListsavedListItems([...listItems])
            setsavedListsavedListItemsCount(listItems.length)
        } else {
            await updateListContents();
        }
    }, [])

    const checkUserAuthenticated = React.useCallback(async () => {
        const tokenExpiryDate = localStorage.getItem("shopifyLoginTokenExpiry")
        if (!tokenExpiryDate) {
            setuserAuthenticated(false)
        } else if (new Date() > new Date(tokenExpiryDate)) {
            localStorage.removeItem('shopifyLoginTokenExpiry');
            localStorage.removeItem('shopifyLoginToken');
            setuserAuthenticated(false)
        } else {
            setuserAuthenticated(true)
        }
    }, [])

    useEffect(() => {
        updateListContentsFromLocal()
        checkUserAuthenticated()
    }, [updateListContentsFromLocal, checkUserAuthenticated])

    return (
        <div>
            <DataContext.Provider
                value={{
                    savedLists,
                    savedListItems,
                    updateListContents,
                    savedListItemsCount,
                    userAuthenticated
                }}
            >
                {children}
            </DataContext.Provider>
        </div>
    )
}

export default WishlistContext
