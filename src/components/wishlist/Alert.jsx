import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SWYM_CONFIG from '../../swym/swym.config';

/*
  @author:  swym
  @notice: Alert box that appear for short period on top right of website.
  @dev:    Feedback msg on API response ( success or fail )
  @param:  info - alert box info
  @param:  open - render alert
  @param:  toggleAlertState - to hide/show popup
  @param:  type - error/success
*/

function SwymAlert({ info, type, open, toggleAlertState }) {
    React.useEffect(() => {

        const timeOut = setTimeout(() => {
            toggleAlertState(false);
        }, SWYM_CONFIG.alertTimeOut);

        return () => clearTimeout(timeOut);
    }, [toggleAlertState]);
    if (open) {
        if (type === "success") {
            toast.success(info, { autoClose: SWYM_CONFIG.alertTimeOut, hideProgressBar: true });
        } else {
            toast.error(info, { autoClose: SWYM_CONFIG.alertTimeOut, hideProgressBar: true });
        }
    }

    return (
        <div>
            <ToastContainer />
        </div>
    );
}

export default SwymAlert