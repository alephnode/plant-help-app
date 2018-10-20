import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { AuthConsumer } from '../../common/contexts/AuthContext'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import {
  formStyles,
  inputStyles,
  buttonStyles,
  buttonLoadingStyles,
  headingStyles,
  labelStyles,
  errorStyles,
  orStyles,
  fbButtonStyles,
  fbButtonLoadingStyles,
} from '../../common/styles'

const SIGN_UP = gql`
  mutation signup(
    $name: String!
    $email: String!
    $password: String
    $fbUserId: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      fbUserId: $fbUserId
    ) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

class JoinForm extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    isLoading: false,
  }

  responseFacebook = ({ email, name, id }, cb) => {
    if (!email) return
    let fbUser = {
      variables: {
        email,
        name,
        fbUserId: id,
      },
    }
    return cb(fbUser)
  }

  handleChange = e => {
    let newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  render() {
    let { isLoading } = this.state
    return (
      <Mutation mutation={SIGN_UP}>
        {(signup, { data, error }) => (
          <div>
            <h1 css={headingStyles}>join</h1>
            <AuthConsumer>
              {({ handleAuth }) => {
                return (
                  <div>
                    <p css={errorStyles}>
                      {error ? 'Invalid Credentials. Please try again.' : ''}
                    </p>
                    <form
                      css={formStyles}
                      onSubmit={e => {
                        e.preventDefault()
                        this.setState({ isLoading: true })
                        error = false
                        signup({
                          variables: this.state,
                        })
                      }}
                    >
                      <label css={labelStyles}>name</label>
                      <input
                        css={inputStyles}
                        disabled={isLoading && !error}
                        name="name"
                        onChange={this.handleChange}
                        required
                      />
                      <label css={labelStyles}>email</label>
                      <input
                        css={inputStyles}
                        disabled={isLoading && !error}
                        name="email"
                        onChange={this.handleChange}
                        required
                      />
                      <label css={labelStyles}>password</label>
                      <input
                        css={inputStyles}
                        disabled={isLoading && !error}
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        required
                      />
                      <button
                        css={
                          isLoading && !error
                            ? buttonLoadingStyles
                            : buttonStyles
                        }
                        type="submit"
                      >
                        {isLoading && !error ? 'loading ...' : 'sign up'}
                      </button>
                      <div css={orStyles}>or</div>
                      <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                        autoLoad={true}
                        disableMobileRedirect={true}
                        fields="name,email,picture"
                        callback={r => this.responseFacebook(r, signup)}
                        render={renderProps => (
                          <div
                            css={
                              isLoading && !error
                                ? fbButtonLoadingStyles
                                : fbButtonStyles
                            }
                            onClick={() => {
                              this.setState({ isLoading: true })
                              error = false
                              return renderProps.onClick
                            }}
                          >
                            {isLoading && !error
                              ? 'loading ...'
                              : 'f | continue with facebook'}
                          </div>
                        )}
                      />
                      {data && handleAuth(data)}
                    </form>
                  </div>
                )
              }}
            </AuthConsumer>
          </div>
        )}
      </Mutation>
    )
  }
}

export default JoinForm
