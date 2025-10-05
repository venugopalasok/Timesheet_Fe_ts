import './Header.css'
const Header = () => {
    return (
        <div className='header'>
            <div className="left-section">
                    <img className="timesheet-logo"
                    src="/timesheet-logo.png"/>
                </div>


                <div className="right-section">
                    <button className="signout-button">Sign Out</button>
                </div>
        </div>
    );
}

export default Header;