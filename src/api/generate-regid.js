const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const qs = require('qs');
const { getAuthToken } = require('../swym/generate-auth-token');


/*
  @author: swym
  @notice: generate regid & session id from
  @dev:    generate regid and sessionid using auth token
  @return: success - true/false if the request is successful
  @return: data - object containing the regid and session id
*/

export default async function handler(req, res) {
    try {
        let config = {
            method: 'post',
            url: `${process.env.GATSBY_SWYM_BASE_URL}storeadmin/v3/user/generate-regid`,
            headers: {
                'Authorization': `Basic ${getAuthToken()}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                'useragenttype': req.headers && req.headers['user-agent'] ? req.headers['user-agent'] : '',
                'uuid': uuidv4()
            })
        };

        const data = await axios.request(config);
        if (data.status === 200)
            return res.json({ success: true, data: { regid: data.data.regid, sessionid: data.data.sessionid } })
        else
            return res.json({ success: false, msg: "Unable to generate reg id" })
    } catch (error) {
        console.error(error)
        return res.json({ success: false, msg: "Something went wrong,Unable to generate reg id" })
    }
}