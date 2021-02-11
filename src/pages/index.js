import React, { useState } from 'react';
import Logo from './GBGC-Logo.png';
import background from './77533.jpg';
import Tilt from 'react-tilt'
import { Control, LocalForm, Errors } from 'react-redux-form';
import axiosInstance from '../helpers/axios';
import { keys } from '../helpers/credentials';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validText = (val) => /^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/i.test(val);
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const validMobile = (val) => /^\+91[7-9][0-9]{9}$/i.test(val);

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

const Home = (e) => {

    const [name, setName] = useState("");
    const [number, setNumber] = useState();
    const [amount, setAmount] = useState();
    const [email, setEmail] = useState("");

    async function displayRazorpay() {

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        const resdata = {
            number,
            name,
            amount,
            email
        }
        console.log(resdata)
        axiosInstance.post('pay/razorpay', resdata)
            .then(res => {
                console.log(res)
                const options = {
                    key: keys.Razorpay,
                    currency: res.data.data.currency,
                    amount: res.data.data.amount.toString(),
                    order_id: res.data.data.id,
                    name: "Pay to Gram Panchayat",
                    image: { Logo },
                    handler: function (response) {
                        const data = {
                            name: name,
                            email: email,
                            number: number,
                            response: response
                        }
                        axiosInstance.post('pay/verification', data)
                            .then(res => {
                                console.log(res)
                                store.addNotification({
                                    title: "Payment Received Successfully!",
                                    message: 'check your email for payment receipt',
                                    type: "success",
                                    container: 'top-right',
                                    animationIn: ["animated", "fadeIn"],
                                    animationOut: ["animated", "fadeOut"],
                                    dismiss: {
                                        duration: 3000,
                                        showIcon: true
                                    }
                                })
                                window.location.reload(false);
                            })
                            .catch(err => {
                                store.addNotification({
                                    title: "Payment Failed!",
                                    message: 'Try again with payment details',
                                    type: "info",
                                    container: 'top-right',
                                    animationIn: ["animated", "fadeIn"],
                                    animationOut: ["animated", "fadeOut"],
                                    dismiss: {
                                        duration: 3000,
                                        showIcon: true
                                    }
                                })
                                window.location.reload(false);
                            })

                    },
                    prefill: {
                        name: name,
                        email: email,
                        contact: number
                    }
                }
                const paymentObject = new window.Razorpay(options)
                paymentObject.open()
            })
            .catch(error => {
                console.log(error)
                store.addNotification({
                    title: `${error.response.data.error.error}`,
                    message: `${error.response.data.error.sub}`,
                    type: "info",
                    container: 'top-right',
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 3000,
                        showIcon: true
                    }
                })
                window.location.reload(false);
            })
    }

    const style = {
        backgroundImage: 'url(' + background + ')'
    };
    return (
        <div>
            <div className="bg-contact100" style={style}>
                <div className="container-contact100">
                    <div className="wrap-contact100">
                        <Tilt className="Tilt" options={{ max: 25 }} style={{ height: 250, width: 250 }} >
                            <div className="contact100-pic js-tilt Tilt-inner" data-tilt>
                                <img src={Logo} alt="IMG" />
                            </div>
                        </Tilt>

                        <LocalForm className="contact100-form validate-form">
                            <span className="contact100-form-title">
                                Get in touch
					</span>

                            <div className="wrap-input100 validate-input" data-validate="Name is required">
                                <Control.text className="input100"
                                    type="text"
                                    name="name"
                                    model=".name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    validators={{
                                        required, validText, maxLength: maxLength(40), minLength: minLength(3)
                                    }}
                                />
                                <Errors
                                    classNameName="text-danger"
                                    model=".name"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                        validText: 'Enter a valid Name!',
                                        maxLength: 'Length should be less than 40 characters!',
                                        minLength: 'Length should be greater than 3 characters!'
                                    }}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div className="wrap-input100 validate-input" data-validate="Phone number is required">
                                <Control.text className="input100"
                                    type="text"
                                    name="number"
                                    model=".number"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="off"
                                    placeholder="Phone no."
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    validators={{
                                        required, validMobile
                                    }}
                                />
                                <Errors
                                    classNameName="text-danger"
                                    model=".number"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                        validMobile: 'Enter a valid Mobile number!'
                                    }}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-phone" aria-hidden="true"></i>
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                <Control.text className="input100"
                                    type="text"
                                    name="email"
                                    model=".email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    validators={{
                                        required, validEmail
                                    }}
                                />
                                <Errors
                                    classNameName="text-danger"
                                    model=".email"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                        validEmail: 'Enter a valid email address!'
                                    }}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-envelope" aria-hidden="true"></i>
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Amount is required">
                                <Control.text className="input100"
                                    type="text"
                                    name="amount"
                                    model=".amount"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    validators={{
                                        required, isNumber
                                    }}
                                />
                                <Errors
                                    classNameName="text-danger"
                                    model=".amount"
                                    show="touched"
                                    messages={{
                                        required: 'Required ',
                                        isNumber: 'Enter a valid Number!'
                                    }}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-money" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div className="container-contact100-form-btn">
                                <button className="contact100-form-btn" onClick={displayRazorpay} type="submit">
                                    Send
						</button>
                            </div>
                        </LocalForm>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home;