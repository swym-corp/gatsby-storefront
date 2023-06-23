/*
  @author: swym
  @notice: badge for wishlist list name
  @dev:    badge icon for wishlist icon created by wishlist name
  @param:  wishlistName - name of wishlist
  @param:  defaultText - default wishlist name
*/

export function getWishlistBadgeLetters(wishlistName, defaultText) {
  if (!wishlistName) {
    return defaultText;
  }
  const badgeTextArr = wishlistName.trim().split(' ');
  let letters = defaultText;
  if (badgeTextArr.length >= 1) {
    letters = badgeTextArr[1]
      ? badgeTextArr[0][0] + badgeTextArr[1][0]
      : badgeTextArr[0][0];
  }
  return letters;
}