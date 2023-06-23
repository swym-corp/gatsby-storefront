import axios from 'axios';
import { axiosInstance } from "./swym-wishlist-axios";
import SWYM_CONFIG from "./swym.config";
import qs from 'qs';

/*
  @author: swym
  @notice: get localstorage data related to swym
  @dev:    get regid and sessionid.
  @return: regid - used for all swym API calls
  @return: sessionid - used for all swym API calls
*/

export const getRegAndSessionId = async () => {
    let swymData = localStorage.getItem('swymData');
    if (swymData) {
        const { regid, sessionid } = JSON.parse(swymData);
        return { regid, sessionid }
    } else {
        const { data } = await axios.get('/api/generate-regid');
        if (data && data.success) {
            localStorage.setItem('swymData', JSON.stringify(data.data))
            return { regid: data.data.regid, sessionid: data.data.sessionid }
        } else {
            return null
        }
    }
}


/*
  @author: swym
  @notice: to add a variant to wishlist
  @dev:    update list to add a variant
  @param:  lid = list id
  @param:  empi = product id
  @param:  epi = variant id
  @param:  du = product url
  @param:  slug = product slug in headless store
  @return: a = array of variants added to list
*/

export const addToList = async (lid, empi, epi, du, slug) => {
    try {
        let data = qs.stringify({
            'lid': lid,
            'a': `[{ "epi": ${epi}, "empi": ${empi}, "du": "${du}","cprops":{"slug":"${slug}"}}]`
        });
        const res = await axiosInstance.post(`api/v3/lists/update-ctx?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`, data)
        if (res.status === 200) {
            return res.data;
        } else {
            console.error(res)
            return { error: true }
        }
    } catch (error) {
        console.error(error)
        return {}
    }
}

/*
  @author: swym
  @notice: to create a new list
  @dev:    create a new wishlist
  @param:  listName = name of the wishlist
  @return: object = created list data
*/

export const createList = async (listName) => {
    try {
        let data = qs.stringify({
            'lname': listName || SWYM_CONFIG.defaultWishlistName
        });
        const res = await axiosInstance.post(`api/v3/lists/create?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`, data)
        if (res.status === 200) {
            return res.data;
        } else {
            console.error(res)
            return { error: true }
        }
    } catch (error) {
        console.error(error)
        return { error: true }
    }
}

/*
  @author: swym
  @notice: to delete a variant to wishlist
  @dev:    update list to delete a variant
  @param:  lid = list id
  @param:  empi = product id
  @param:  epi = variant id
  @param:  du = product url
  @return: d = array of variants delete from list
*/

export const deleteVariantFromList = async (lid, empi, epi, du) => {
    try {
        let data = qs.stringify({
            'lid': lid,
            'd': `[{ "epi": ${epi}, "empi": ${empi}, "du": "${du}"}]`
        });
        const res = await axiosInstance.post(`api/v3/lists/update-ctx?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`, data)
        if (res.status === 200) {
            return res.data;
        } else {
            console.error(res)
            return { error: true }
        }
    } catch (error) {
        console.error(error)
        return {}
    }
}

/*
  @author: swym
  @notice: to fetch all list for the user
  @dev:    fetches all list
  @return: array of lists
*/

export const getAllLists = async () => {
    try {
        const data = await axiosInstance.post(`/api/v3/lists/fetch-lists?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`)
        if (data.status === 200) {
            return [...data.data];
        } else {
            console.error(data)
            return { error: true }
        }
    } catch (error) {
        console.error(error)
        return { error: true }
    }
}

/*
  @author: swym
  @notice: to fetch list contents
  @dev:    fetches list content by list id
  @param:  lid = id of the list
  @return: items = array of variants in list
*/

export const fetchListContents = async (lid) => {
    try {
        let data = qs.stringify({
            'lid': lid
        });
        const res = await axiosInstance.post(`api/v3/lists/fetch-list-with-contents?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`, data)
        if (res.status === 200) {
            return res.data;
        } else {
            console.error(res)
            return { error: true }
        }
    } catch (error) {
        console.error(error)
        return { error: true }
    }
}


/*
  @author: swym
  @notice: to sync user email after sign in
  @dev:    syncs user email after sign in
  @param:  email = email of the user
*/

export const syncUserEmail = async (email) => {
    try {
        const { regid } = await getRegAndSessionId()
        const { data } = await axios.post('/api/sync-useremail-regid', {
            email,
            regid
        });
        if (data && data.success) {
            let swymData = localStorage.getItem('swymData');
            swymData = JSON.parse(swymData);
            swymData.regid = data.data.regid;
            localStorage.setItem('swymData', JSON.stringify(swymData))
        }
    } catch (error) {
        console.log(error)
        return { error: true }
    }
}

/*
  @author: swym
  @notice: to sync user email after sign in
  @dev:    syncs user email after sign in
  @param:  email = email of the user
*/

export const shareWishlistViaEmail = async (lid, toemail, fromname) => {
    try {
        let data = qs.stringify({
            lid, toemail, fromname
        });
        const res = await axiosInstance.post(`api/v3/lists/emailList?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`, data)
        if (res.status === 200) {
            if (res.data.listinfo) {
                return { error: false, msg: res.data.msg }
            } else {
                return { error: true, msg: res.data.msg }
            }
        } else {
            console.error(res)
            return { error: true, msg: "Invalid status" }
        }
    } catch (error) {
        console.error(error)
        return { error: true, msg: "Something went wrong" }
    }
}

/*
  @author: swym
  @notice: to sync user email after sign in
  @dev:    syncs user email after sign in
  @param:  email = email of the user
*/

export const markListPublic = async (lid) => {
    try {
        let data = qs.stringify({
            lid
        });
        const res = await axiosInstance.post(`api/v3/lists/markPublic?pid=${encodeURIComponent(process.env.GATSBY_SWYM_PID)}`, data)
        if (res.status === 200) {
            if (res.data.listcontents) {
                return { error: false, msg: "Link Copied" }
            } else {
                return { error: true, msg: "Unable to Copy Link" }
            }
        } else {
            console.error(res)
            return { error: true, msg: "Invalid status" }
        }
    } catch (error) {
        console.error(error)
        return { error: true, msg: "Something went wrong" }
    }
}