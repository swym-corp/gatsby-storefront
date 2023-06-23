import * as React from "react"
import { Layout } from "../components/layout"
import { Seo } from "../components/seo"
import { Link } from "gatsby"
import SwymAlert from "../components/wishlist/Alert"
import {
    loginSection,
    loginHeading,
    loginForm,
    formGroup,
    loginButton,
    loginRegisterMessage,
    loginInput
} from './login.module.css';
import { loginUser } from "../swym/login"
import { navigate } from "gatsby";
import { syncUserEmail } from "../swym/api"

export default function LoginPage() {
    const [email, setemail] = React.useState('');
    const [password, setpassword] = React.useState('');
    const [alertBoxType, setalertBoxType] = React.useState();
    const [showAlertBox, setshowAlertBox] = React.useState(false);
    const [alertBoxInfo, setalertBoxInfo] = React.useState('');
    const [btnDisable, setbtnDisable] = React.useState(false)

    const onChange = (e) => {
        setshowAlertBox(false)
        const field = e.target.id
        switch (field) {

            case "email": setemail(e.target.value);
                break;
            case "password": setpassword(e.target.value);
                break;
            default: console.log("Invalid target");
        }
    }

    const submitForm = async (e) => {
        setbtnDisable(true)
        e.preventDefault();
        if ((email.trim().length === 0) || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Please enter a valid Email.');
            setbtnDisable(false)
            return;
        } else if (password.trim().length === 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Please enter a password.');
            setbtnDisable(false)
            return;
        }
        const { data, error } = await loginUser(email, password);
        if (error) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Something went wrong!');
            setbtnDisable(false)
        }
        if (data.data && data.data.customerAccessTokenCreate && data.data.customerAccessTokenCreate.customerAccessToken && data.data.customerAccessTokenCreate.customerAccessToken.accessToken) {
            setshowAlertBox(true);
            setalertBoxType('success');
            setalertBoxInfo('Login successful.');
            localStorage.setItem('shopifyLoginToken', data.data.customerAccessTokenCreate.customerAccessToken.accessToken)
            localStorage.setItem('shopifyLoginTokenExpiry', data.data.customerAccessTokenCreate.customerAccessToken.expiresAt)
            await syncUserEmail(email);
            setTimeout(() => (navigate('/')), 2000)
        } else if (data.data && data.data.customerAccessTokenCreate && data.data.customerAccessTokenCreate.customerUserErrors && data.data.customerAccessTokenCreate.customerUserErrors.length > 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo(data.data.customerAccessTokenCreate.customerUserErrors[0].message);
            setbtnDisable(false)
        } else if (data.errors && data.errors.length > 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo(data.errors[0].message);
            setbtnDisable(false)
        }
    }

    return (
        <Layout>
            <SwymAlert
                open={showAlertBox}
                toggleAlertState={setshowAlertBox}
                info={alertBoxInfo}
                type={alertBoxType} />
            <section className={loginSection}>
                <div>
                    <h2 className={loginHeading}>Login</h2>
                </div>
                <form className={loginForm}>
                    <div className={formGroup}>
                        <input className={loginInput} type="email" id="email" name="email" placeholder="Email" value={email} onChange={onChange} />
                    </div>
                    <div className={formGroup}>
                        <input className={loginInput} type="password" id="password" name="password" placeholder="Password" value={password} onChange={onChange} />
                    </div>
                    <button disabled={btnDisable} type="button" onClick={submitForm} className={loginButton}>LOGIN</button>
                </form>
                <div className={loginRegisterMessage}>
                    <Link to="/register">Don't have an account? Click here to create one!</Link>
                </div>
            </section>
        </Layout>
    )
}

export const Head = () => <Seo />
