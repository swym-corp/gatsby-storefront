import axios from "axios";

/*
  @author: swym
  @notice: to login a user in platform
  @dev:    logins a user in platform
  @param:  email = email of the user
  @param:  password = password of the user
  @return: if user is logged in data
*/

export const loginUser = async (email, password) => {
    try {
        const query = JSON.stringify({
            query: `mutation SignInWithEmailAndPassword(
                $email: String!, 
                $password: String!,
            ) {
                customerAccessTokenCreate(input: { 
                    email: $email, 
                    password: $password,
                }) {
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        code
                        message
                    }
                }
            }`,
            variables: { "email": email, "password": password }
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