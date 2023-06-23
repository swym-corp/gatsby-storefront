/*
  @author: swym
  @notice: generate a unique id
  @dev:    generate unique id for fetching reg id and session id
  @return: uuid - unique id
*/

export const getAuthToken = () => {
  return Buffer.from(`${process.env.GATSBY_SWYM_PID}:${process.env.SWYM_REST_API_KEY}`).toString('base64')
}
