import './Header.css'
const Header = () => {
    return (
        <div className='header'>
            <div className="left-section">
                    <img className="timesheet-logo"
                    src="/timesheet-logo.png"/>
                </div>


                <div className="right-section">
                <img className="user-profile-logo" 
                        src="/user-profile-logo.png" />  
                    <select className="signout-select" > 
                        <option value="signout" >
                          Sign Out  
                        </option>
                    </select>
                </div>
        </div>
    );
}

export default Header;