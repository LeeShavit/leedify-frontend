import { SpotifyIcon } from '../assets/img/app-header/icons'

export function LoginModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    onLogin({ username, password })
  }

  return (
    <>
      <div className='modal-overlay' onClick={onClose}></div>
      <div className='login-modal'>
        <div className='login-modal__content'>
          <SpotifyIcon className='login-modal__logo' />
          <h1 className='login-modal__title'>Log in to Spotify</h1>

          <div className='login-modal__social-buttons'>
            <button className='login-modal__social-button'>
              <img src='/google-icon.png' alt='Google' />
              Continue with Google
            </button>
            <button className='login-modal__social-button'>
              <img src='/facebook-icon.png' alt='Facebook' />
              Continue with Facebook
            </button>
            <button className='login-modal__social-button'>
              <img src='/apple-icon.png' alt='Apple' />
              Continue with Apple
            </button>
          </div>

          <div className='login-modal__divider'>
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className='login-modal__form'>
            <div className='login-modal__form-group'>
              <label>Email or username</label>
              <input type='text' name='username' placeholder='Email or username' />
            </div>

            <div className='login-modal__form-group'>
              <label>Password</label>
              <input type='password' name='password' placeholder='Password' />
            </div>

            <button type='submit' className='login-modal__submit'>
              Log In
            </button>
          </form>

          <a href='#' className='login-modal__forgot'>
            Forgot your password?
          </a>

          <div className='login-modal__signup'>
            <span>Don't have an account?</span>
            <a href='#'>Sign up for Spotify</a>
          </div>
        </div>
      </div>
    </>
  )
}
