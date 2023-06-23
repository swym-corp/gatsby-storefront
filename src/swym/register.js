import axios from "axios";

/*
  @author: swym
  @notice: to register a user in platform
  @dev:    registers a user in platform
  @param:  email = email of the user
  @param:  fName = first name of the user
  @param:  lName = last name of the user
  @param:  password = password of the user
  @return: if user is registered data
*/

export const registerUser = async (fName, lName, email, password) => {
    try {
        const query = JSON.stringify({
            query: `mutation RegisterAccount(
              $email: String!, 
              $password: String!,  
              $firstName: String!, 
              $lastName: String!
          ) {
              customerCreate(input: {
                  email: $email, 
                  password: $password, 
                  firstName: $firstName, 
                  lastName: $lastName 
              }) {
                  customer {
                      id
                  }
                  customerUserErrors {
                      code
                      message
                  }
              }
          }`,
            variables: { "email": email, "password": password, "firstName": fName, "lastName": lName }
        });
        const response = await axios.post(`https://${process.env.GATSBY_SHOPIFY_STORE_URL}/api/2023-04/graphql.json`, query, {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': process.env.GATSBY_STOREFRONT_ACCESS_TOKEN,
            },
        });
        return { error: false, data: response.data }
    } catch (error) {
        console.error(error)
        return { error: true }
    }
}