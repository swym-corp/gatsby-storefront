import * as React from "react"
import { createList, addToList } from '../../swym/api';
import SWYM_CONFIG from '../../swym/swym.config';
import WishlistItem from './WishlistItem.client';
import './wishlistAddToModal.css';
import { DataContext } from "./wishlistContext";

/*
  @author: swym
  @notice: add to wishlist popup 
  @dev:    component for add to wishlist popup
*/

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function validateString(name, errorsObj) {
  if (!name) {
    return errorsObj.empty;
  }
  if (name.length < 3) {
    return errorsObj.minLength;
  }
  if (name.length > 50) {
    return errorsObj.maxLength;
  }
}
export const validateUniqueString = (newList, previousListArr, errorStr) => {
  if (previousListArr.indexOf(newList) !== -1) {
    return errorStr;
  }
};



function CreateList({
  title,
  productId,
  productVariantId,
  onPopupToggle,
  image,
  setshowAlertBox,
  setalertBoxType,
  setalertBoxInfo,
  slug
}) {

  const className = 'swym-new-wishlist-item';
  const [addToWishlistLoading, setaddToWishlistLoading] = React.useState(false);
  const [createListLoading, setcreateListLoading] = React.useState(false);
  const [wishlistName, setWishlistName] = React.useState('');
  const [selectedList, setselectedList] = React.useState(null);
  const [error, setError] = React.useState();
  const { savedLists, updateListContents } = React.useContext(DataContext);


  const classNameInput = classNames(
    'swym-new-wishlist-name swym-no-zoom-fix swym-input',
    error && 'swym-input-has-error',
  );

  function validateWishlistName(name) {
    let wishlists = [];
    {
      savedLists &&
        savedLists.length > 0 &&
        savedLists.map((list) => {
          wishlists.push(list);
        });
    }
    let validateStringVar = validateString(name, {
      empty: 'Must provide a list name',
      minLength: 'Name must be longer than 3 characters',
      maxLength: 'Name must be less than 50 characters long',
    });
    let validateUniqueStringVar = validateUniqueString(
      name,
      wishlists.map((list) => {
        return list.lname;
      }),
      'List name already exists',
    );
    return validateStringVar || validateUniqueStringVar;
  }


  function validateAndSetListName(value) {
    setWishlistName(value);
    setError(validateWishlistName(value));
    console.log(error);
  }

  function selectList(value) {
    setselectedList(value);
  }

  const createListByName = async (e) => {
    e.preventDefault();
    setcreateListLoading(true)
    if (!error) {
      try {
        const res = await createList(wishlistName);
        setcreateListLoading(false);
        if (res.di) {
          updateListContents();
          setWishlistName('');
          return res;
        } else {
          setshowAlertBox(true);
          setalertBoxType('error');
          setalertBoxInfo('List not created');
        }
      } catch (e) {
        setcreateListLoading(false);
        console.log('Exception', e);
        setalertBoxType('error');
        setshowAlertBox(true);
        setalertBoxInfo('List not created');
      }
    } else {
      setcreateListLoading(false);
      setshowAlertBox(true);
      setalertBoxType('error');
      setalertBoxInfo('List not created');
      setWishlistName('');
    }
  };

  const addProductToWishlist = async (e) => {
    e.preventDefault()
    const productUrl = window.location.href;
    try {
      let selectedListId = selectedList;
      if (savedLists.length === 0) {
        let newList = await createListByName(e);
        selectedListId = newList.lid;
      } else if (!selectedList) {
        selectedListId = savedLists[0].lid
      }
      setaddToWishlistLoading(true);
      const res = await addToList(
        selectedListId,
        productId,
        productVariantId,
        productUrl,
        slug
      );
      setaddToWishlistLoading(false);
      if (res.error) {
        setshowAlertBox(true);
        setalertBoxType('error');
        setalertBoxInfo('Product not added to wishlist');
      } else {
        setshowAlertBox(true);
        setalertBoxType('success');
        setalertBoxInfo('Product addded to wishlist');
        updateListContents();
        onPopupToggle(false);
      }
    } catch (e) {
      console.log('Exception', e);
      setaddToWishlistLoading(false);
      setshowAlertBox(true);
      setalertBoxType('error');
      setalertBoxInfo('Product not added to wishlist');
    }
    // setWishlistSocialCount(true);
  };

  return (
    <div className="swym-modal" onClick={(e) => { e.preventDefault() }}>
      <div className="swym-responsive swym-modal-dialog">
        <button
          className="swym-modal-dismiss-button"
          onClick={(e) => { e.preventDefault(); onPopupToggle(false) }}>
          &times;
        </button>
        <div className="swym-modal-content">
          <div className="swym-add-wishlist-selector">
            <div className="swym-product-title swym-title-new" style={{ padding: '20px 0px', alignItems: 'center' }}>
              {image && (
                <div className="swym-product-image">
                  <img src={image} alt={title} />
                </div>
              )}
              <h3 className="swym-product-name swym-heading swym-heading-1 swym-title-new">
                {title}
              </h3>
            </div>
            <div className="swym-wishlist-items">
              <div className="swym-wishlist-items-title" role="radiogroup">
                Add To List
              </div>
              {savedLists &&
                savedLists.length > 0 &&
                savedLists.map(({ lname, lid, cnt }, index) => {
                  return (
                    <WishlistItem
                      key={lid}
                      name={lname}
                      id={lid}
                      isSelected={selectedList === lid}
                      onListSelect={selectList}
                      count={cnt}
                    />
                  );
                })}
            </div>
            <div className={className}>
              <div className="swym-new-wishlist-input-container">
                <input
                  type="text"
                  className={classNameInput}
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                  onChange={(e) => {
                    validateAndSetListName(e.target.value);
                  }}
                  placeholder={SWYM_CONFIG.defaultWishlistName}
                  value={wishlistName}
                />
                <span className="error-msg" role="alert">
                  {error}
                </span>
              </div>
            </div>

            <div className="swym-action-btns">
              <button
                type="button"
                disabled={createListLoading}
                onClick={createListByName}
                style={{ background: '#CACBCF', borderRadius: 0 }}
                className="swym-new-wishlist-btn swym-button swym-button-2 swym-color-2 swym-border-color-1 swym-border-button"
              >
                {createListLoading ? "Creating Wishlist..." : "Create New Wishlist"}
              </button>
              <button
                disabled={addToWishlistLoading}
                onClick={addProductToWishlist}
                type="button"
                className="swym-add-to-list-btn swym-button swym-button-1 swym-bg-2 swym-color-4"
              >
                {addToWishlistLoading ? 'Adding...' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateList;
