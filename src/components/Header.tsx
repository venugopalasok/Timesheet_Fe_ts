import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // Hide header on sign-in and sign-up pages
    const hideHeader = location.pathname === '/signin' || location.pathname === '/signup'

    const handleSignOut = () => {
        // TODO: Add actual logout logic here (clear tokens, user state, etc.)
        console.log('Signing out...')
        
        // Navigate to sign-in page
        navigate('/signin')
        
        // Close dropdown
        setIsDropdownOpen(false)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Mock user data - replace with actual user data from context/state
    const userName = 'John Doe'
    const userEmail = 'john.doe@example.com'

    if (hideHeader) {
        return null
    }

    return (
        <div className='header'>
            <div className="left-section">
                <img className="timesheet-logo"
                    src="/timesheet-logo.png"
                    alt="Timesheet Logo"/>
            </div>

            <div className="right-section">
                <div className="user-info-container">
                    <div className="user-details">
                        <span className="user-name">{userName}</span>
                        <span className="user-email">{userEmail}</span>
                    </div>
                    <img className="user-profile-logo" 
                        src="/user-profile-logo.png"
                        alt="User Profile"
                        onClick={toggleDropdown} />
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <div className="dropdown-user-name">{userName}</div>
                                <div className="dropdown-user-email">{userEmail}</div>
                            </div>
                            <div className="dropdown-divider"></div>
                            <button 
                                className="dropdown-item signout-button"
                                onClick={handleSignOut}
                            >
                                <svg className="signout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div 
                    className="dropdown-overlay"
                    onClick={() => setIsDropdownOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default Header;