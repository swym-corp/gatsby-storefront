import * as React from "react"
import { Layout } from "../components/layout"
import { Seo } from "../components/seo"
import { Link } from "gatsby"
import SwymAlert from "../components/wishlist/Alert"
import {
    registerSection,
    registerHeading,
    registerForm,
    formGroup,
    registerInput,
    registerButton,
    registerMessage
} from './register.module.css';
import { registerUser } from "../swym/register"
import { navigate } from "gatsby";

export default function RegisterPage() {

    const [fName, setfName] = React.useState('');
    const [lName, setlName] = React.useState('');
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
            case "fName": setfName(e.target.value);
                break;
            case "lName": setlName(e.target.value);
                break;
            case "email": setemail(e.target.value);
                break;
            case "password": setpassword(e.target.value);
                break;
            default: console.log("Invalid target");
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setbtnDisable(true)
        if (fName.trim().length === 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Please enter First Name.');
            setbtnDisable(false)
            return;
        } else if (lName.trim().length === 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Please enter Last Name.');
            setbtnDisable(false)
            return;
        } else if ((email.trim().length === 0) || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
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
        const { data, error } = await registerUser(fName, lName, email, password);
        if (error) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo('Something went wrong!');
            setbtnDisable(false)
        }
        if (data.data && data.data.customerCreate && data.data.customerCreate.customer && data.data.customerCreate.customer.id) {
            setshowAlertBox(true);
            setalertBoxType('success');
            setalertBoxInfo('Registration successful! Please login to continue.');
            setTimeout(() => (navigate('/login')), 2000)
        } else if (data.data && data.data.customerCreate && data.data.customerCreate.customerUserErrors && data.data.customerCreate.customerUserErrors.length > 0) {
            setshowAlertBox(true);
            setalertBoxType('error');
            setalertBoxInfo(data.data.customerCreate.customerUserErrors[0].message);
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
            <section className={registerSection}>
                <div>
                    <h2 className={registerHeading}>Create Account</h2>
                </div>
                <form className={registerForm}>
                    <div className={formGroup}>
                        <input className={registerInput} type="text" id="fName" name="fName" placeholder="First Name" value={fName} onChange={onChange} />
                    </div>
                    <div className={formGroup}>
                        <input className={registerInput} type="text" id="lName" name="fName" placeholder="Last Name" value={lName} onChange={onChange} />
                    </div>
                    <div className={formGroup}>
                        <input className={registerInput} type="email" id="email" name="email" placeholder="Email" value={email} onChange={onChange} />
                    </div>
                    <div className={formGroup}>
                        <input className={registerInput} type="password" id="password" name="password" placeholder="Password" value={password} onChange={onChange} />
                    </div>
                    <button disabled={btnDisable} type="button" onClick={submitForm} className={registerButton}>CREATE</button>
                </form>
                <div className={registerMessage}>
                    <Link to="/login">Already have an account? Click here to login!</Link>
                </div>
            </section>
        </Layout>
    )
}

export const Head = () => <Seo />
