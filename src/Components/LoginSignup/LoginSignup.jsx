import React, { useState, useEffect } from 'react';
import './LoginSignup.css';
import userlogo from '../Assets/userlogo.png';
import passwordlogo from '../Assets/passwordlogo.png';
import emaillogo from '../Assets/emaillogo.png';

export const LoginSignup = () => {
    const [action, setAction] = useState('Sign Up');
    const initialValue = { username: '', email: '', password: '' };
    const [formValues, setFormValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        setIsSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
            setIsSubmit(false);
        }
    }, [formErrors, isSubmit, formValues]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!values.username) {
            errors.username = 'Username is required!';
        }
        if (!values.email) {
            errors.email = 'Email is required!';
        } else if (!regex.test(values.email)) {
            errors.email = 'This is not a valid email format!';
        }
        if (!values.password) {
            errors.password = 'Password is required!';
        }
        return errors;
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className='header'>
                    <div className='text'>{action}</div>
                </div>
                <div className='inputs'>
                    {action === 'Login' ? (
                        <div></div>
                    ) : (
                        <div className='input'>
                            <img src={userlogo} alt='user.png' />
                            <input
                                type='text'
                                placeholder='Name'
                                name='username'
                                value={formValues.username}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    <p>{formErrors.username}</p>

                    <div className='input'>
                        <img src={emaillogo} alt='email.png' />
                        <input
                            type='email'
                            placeholder='Email'
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.email}</p>
                    <div className='input'>
                        <img src={passwordlogo} alt='password.png' />
                        <input
                            type='password'
                            placeholder='Password'
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.password}</p>
                </div>

                <div className='submit-container'>
                    <div className={action === 'Login' ? 'submit gray' : 'submit'} onClick={() => setAction('Sign Up')}>
                        <button type='button'>Sign Up</button>
                    </div>
                    <div className={action === 'Sign Up' ? 'submit gray' : 'submit'} onClick={() => setAction('Login')}>
                        <button type='button'>Login</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
