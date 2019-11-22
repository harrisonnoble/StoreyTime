import React, { Component } from 'react';
import './register.css';
import { UserRepo } from '../../api';

class Register extends Component {

    userRepo = new UserRepo();

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            state: '',
            user_type: 0,
            isRegistered: false
        }
    }

    async onSubmit() {
        var user = {
            email: this.state.email,
            pass: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            state_residence: this.state.state,
            user_type: this.state.user_type
        }

        await this.userRepo.registerUser(user)
            .then(resp => {
                this.setState(pState => {
                    pState.email = '';
                    pState.password = '';
                    pState.firstName = '';
                    pState.lastName = '';
                    pState.state = '';
                    pState.user_type = '';
                    pState.isRegistered = true;
                    return pState;
                });
            })
            .catch(resp => {
                console.log(resp);
                alert(resp);
            });
    }

    render() {
        return (
            <div className='register-container'>
                <div className='register-box'>
                    {this.state.isRegistered && <div className="info">
                        Account successfully created! Please login with your new credentials
                        <a href="/login">Here!</a>
                    </div>
                    }
                    <form className='register-form'>
                        <h1 className='register-label'>Register</h1>
                        <div className='register-firstname-wrapper'>
                            <i className="fas fa-plus-square"></i>
                            <input
                                className='register-firstname'
                                type='text'
                                name='register-firstname'
                                placeholder='First Name'
                                value={this.state.firstName}
                                onChange={e => this.setState({ firstName: e.target.value })}
                            />
                        </div>
                        <div className='register-lastname-wrapper'>
                            <i className="fas fa-plus-square"></i>
                            <input
                                className='register-lastname'
                                type='text'
                                name='register-lastname'
                                placeholder='Last Name'
                                value={this.state.lastName}
                                onChange={e => this.setState({ lastName: e.target.value })}
                            />
                        </div>
                        <div className='register-email-wrapper'>
                            <i className="fas fa-plus-square"></i>
                            <input
                                className='register-email'
                                type='text'
                                name='register-email'
                                placeholder='Email'
                                value={this.state.email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                        </div>
                        <div className='register-password-wrapper'>
                            <i className="fas fa-plus-square"></i>
                            <input
                                className='register-password'
                                type='password'
                                name='register-password'
                                placeholder='Password'
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </div>
                        <div className='register-state-wrapper'>
                            <i className="fas fa-plus-square"></i>
                            <select
                                className='register-state'
                                type='state'
                                name='register-state'
                                placeholder='State'
                                value={this.state.state}
                                onChange={e => this.setState({ state: e.target.value })}
                            >
                                <option value='' disabled>State</option>
                                <option value='AL'>Alabama</option>
                                <option value='AK'>Alaska</option>
                                <option value='AZ'>Arizona</option>
                                <option value='AR'>Arkansas</option>
                                <option value='CA'>California</option>
                                <option value='CO'>Colorado</option>
                                <option value='CT'>Connecticut</option>
                                <option value='DE'>Delaware</option>
                                <option value='DC'>Washington, D.C.</option>
                                <option value='FL'>Florida</option>
                                <option value='GA'>Georgia</option>
                                <option value='HI'>Hawaii</option>
                                <option value='ID'>Idaho</option>
                                <option value='IL'>Illinois</option>
                                <option value='IN'>Indiana</option>
                                <option value='IA'>Iowa</option>
                                <option value='KS'>Kansas</option>
                                <option value='KY'>Kentucky</option>
                                <option value='LA'>Louisiana</option>
                                <option value='ME'>Maine</option>
                                <option value='MD'>Maryland</option>
                                <option value='MA'>Massachusetts</option>
                                <option value='MI'>Michigan</option>
                                <option value='MN'>Minnesota</option>
                                <option value='MS'>Mississippi</option>
                                <option value='MO'>Missouri</option>
                                <option value='MT'>Montana</option>
                                <option value='NE'>Nebraska</option>
                                <option value='NV'>Nevada</option>
                                <option value='NH'>New Hampshire</option>
                                <option value='NJ'>New Jersey</option>
                                <option value='NM'>New Mexico</option>
                                <option value='NY'>New York</option>
                                <option value='NC'>North Carolina</option>
                                <option value='ND'>North Dakota</option>
                                <option value='OH'>Ohio</option>
                                <option value='OK'>Oklahoma</option>
                                <option value='OR'>Oregon</option>
                                <option value='PA'>Pennsylvania</option>
                                <option value='RI'>Rhode Island</option>
                                <option value='SC'>South Carolina</option>
                                <option value='SD'>South Dakota</option>
                                <option value='TN'>Tennessee</option>
                                <option value='TX'>Texas</option>
                                <option value='UT'>Utah</option>
                                <option value='VT'>Vermont</option>
                                <option value='VA'>Virginia</option>
                                <option value='WA'>Washington</option>
                                <option value='WV'>West Virginia</option>
                                <option value='WI'>Wisconsin</option>
                                <option value='WY'>Wyoming</option>
                            </select>
                        </div>
                        <div className='register-button-wrapper'>
                            <button
                                type='button'
                                className='btn btn-light'
                                onClick={e => { e.preventDefault(); this.onSubmit(); }}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        );
    }
}

export default Register;