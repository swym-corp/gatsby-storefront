import * as React from 'react';
import { getWishlistBadgeLetters } from '../../swym/util-functions';

/*
  @author: swym
  @notice: list name label
  @dev:    component for list name
  @param:  name - name of list
  @param:  isSelected - if praticular list is selected true/false
  @param:  id - id of list
  @param:  onListSelect - callback function on selecting list
*/

function WishlistItem({ name, isSelected, id, onListSelect, count }) {
  const className =
    'swym-wishlist-item swym-value swym-is-button swym-color-2 swym-hover-color-1';
  const letters = getWishlistBadgeLetters(name, 'MW');

  const handleClick = (e) => {
    e.preventDefault();
    onListSelect(id)
  };

  return (
    <div role="radiogroup">
      <button
        name="wishlist-options"
        className={className}
        onClick={handleClick}
        role="radio"
        aria-checked={isSelected}
        aria-label={name}
      >
        <span className="swym-wishlist-badge swym-bg-1 swym-bg-2 swym-color-4">
          {letters}
        </span>
        <span
          className="swym-wishlist-text"
        >
          <span className="swym-wishlist-name">{name} ({count})</span>
          <span>
            <input
              type="radio"
              checked={isSelected}
              style={{ accentColor: '#434655', color: '#434655' }}
              value={id}
              onChange={handleClick}
            />{' '}
          </span>
        </span>
      </button>
    </div>
  );
}
export default WishlistItem;
