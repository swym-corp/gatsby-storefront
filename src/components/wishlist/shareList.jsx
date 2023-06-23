import * as React from "react"
import { shareWishlistViaEmail, markListPublic } from "../../swym/api";
import './shareList.css';

/*
  @author: swym
  @notice: share to wishlist popup 
  @dev:    component for share wishlist popup
*/


function ShareList({ selectedListId, setshowShareList, setshowAlertBox, setalertBoxType, setalertBoxInfo }) {

    const [name, setname] = React.useState('');
    const [email, setemail] = React.useState('');
    const [disabled, setdisabled] = React.useState(false)

    const onChange = (e) => {
        setshowAlertBox(false)
        const field = e.target.id
        switch (field) {
            case "swym-email": setemail(e.target.value);
                break;
            case "swym-name": setname(e.target.value);
                break;
            default: console.log("Invalid target");
        }
    }

    const submitDetails = async () => {
        setdisabled(true)
        if (name.length === 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Please enter a Name.');
            setdisabled(false)
            return;
        } else if ((email.trim().length === 0) || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Please enter a valid Email.');
            setdisabled(false)
            return;
        } else {
            const { error, msg } = await shareWishlistViaEmail(selectedListId, email, name)
            setshowAlertBox(true);
            setalertBoxType(error ? 'error' : 'success');
            setalertBoxInfo(msg);
            setdisabled(false)
            if (!error) {
                setshowShareList(false)
            }
            return;
        }
    }

    const callCopyLink = async (e) => {
        e.preventDefault();
        const { error, msg } = await markListPublic(selectedListId)
        if (!error) {
            let sharedurl = `${window.location.origin}/shared-wishlist?lid=${selectedListId}`
            navigator.clipboard.writeText(sharedurl)
            setshowShareList(false)
        }
        setshowAlertBox(true);
        setalertBoxType(error ? 'error' : 'success');
        setalertBoxInfo(msg);
        setdisabled(false)

        return;
    };


    React.useEffect(() => {
        setshowAlertBox(false)
    }, [setshowAlertBox])

    return (
        <div className="swym-modal">
            <div className="swym-responsive swym-modal-dialog">
                <div className="swym-modal-heading-flex">
                    <h3 className="swym-modal-heading">Share Wishlist</h3>
                    <button
                        className="swym-modal-dismiss-button"
                        onClick={() => { setshowShareList(false) }}>
                        &times;
                    </button>
                </div>
                <div className="swym-modal-content">
                    <div className="swym-share-wishlist-modal-dialog">
                        <label className="swym-input-label">Sender Name
                            <div className="swym-input-label">
                                <input type="text" onChange={onChange} placeholder="Your Full Name (optional)" id="swym-name" className="swym-share-wishlist-email swym-input swym-no-zoom-fix swym-input-1 share-list-input" value={name} />
                            </div>
                        </label>
                        <label className="swym-input-label" contr>Recipients Email
                            <div className="swym-input-label">
                                <input type="text" onChange={onChange} placeholder="shopper@example.com" id="swym-email" className="swym-share-wishlist-name swym-input swym-no-zoom-fix swym-input-1 share-list-input" value={email} />
                            </div>
                        </label>
                        <div className="swym-share-email-button-container">
                            <button onClick={submitDetails} className={`swym-share-wishlist-email-btn swym-button swym-bg-2 swym-color-4 ${disabled ? 'swym-disabled' : ''}`} disabled={disabled}>Share List</button>
                        </div>
                        <div className="swym-share-wishlist-separator"></div>
                        <div className="swym-share">
                            <h3
                                className="swym-share-text"
                            >
                                Or share via:
                            </h3>
                            <button
                                className="swym-copy-text"
                                style={{ maxWidth: 'fit-content', paddingLeft: '10px' }}
                                onClick={(e) => callCopyLink(e)}
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ShareList;
