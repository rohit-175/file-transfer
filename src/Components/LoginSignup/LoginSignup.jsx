import React, { useState } from 'react';
import './LoginSignup.css';
import userlogo from '../Assets/userlogo.png';
import passwordlogo from '../Assets/passwordlogo.png';
import emaillogo from '../Assets/emaillogo.png';

export const LoginSignup = () => {
    const [action, setAction] = useState('Sign Up');
    const initialValue = { username: '', email: '', password: '' };
    const [formValues, setFormValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
    };

    const validate = (values) => {
        const errors = {};
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!values.username && action === 'Sign Up') {
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
        else if(values.password.length < 6){
            errors.password = 'Password must be atlest 6 characters!'
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
                    {action === 'Login' ? null : (
                        <div className='input'>
                            <img src={userlogo} alt='user.png' />
                            <input
                                type='text'
                                placeholder='Name'
                                name='username'
                                value={formValues.username}
                                onChange={handleChange}
                            />
                            {formErrors.username && <p>{formErrors.username}</p>}
                        </div>
                    )}

                    <div className='input'>
                        <img src={emaillogo} alt='email.png' />
                        <input
                            type='email'
                            placeholder='Email'
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && <p>{formErrors.email}</p>}
                    </div>
                    <div className='input'>
                        <img src={passwordlogo} alt='password.png' />
                        <input
                            type='password'
                            placeholder='Password'
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                        />
                        {formErrors.password && <p>{formErrors.password}</p>}
                    </div>
                </div>

                <div className='submit-container'>
                    <div className={action === 'Sign Up' ? 'submit gray' : 'submit'} onClick={() => setAction('Login')}>
                        <button type='button'>Login</button>
                    </div>
                    <div className={action === 'Login' ? 'submit gray' : 'submit'} onClick={() => setAction('Sign Up')}>
                        <button type='button'>Sign Up</button>
                    </div>
                </div>
                <button type='submit' id='final'>Submit</button>
            </form>
        </div>
    );
};
