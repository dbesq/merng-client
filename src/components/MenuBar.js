import React, { useContext, useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function MenuBar() { 
  // Get user and logout from AuthContext
  // Toggle Navbar depending on whether a user is logged in
  const { user, logout } = useContext(AuthContext)

  /** Highlight active class depending on pathname in URL
   * 1.  Get pathname from URL in browser
   * 2.  If home, it is active, otherwise get the path after the '/'
   * 3.  Update state for the active item
   */ 
  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substr(1)
  const [activeItem, setActiveItem] = useState(path)

  const handleItemClick = (e, { name }) => setActiveItem(name)

  const menuBar = user ? (
    // DISPLAYED WHEN LOGGED IN
    <Menu pointing secondary size="massive" color="teal">
    <Menu.Item
      name={user.username}
      active
      as={Link}
      to='/'
    />
    
    <Menu.Menu position='right'>

      <Menu.Item
        name='logout'
        onClick={logout}
      />
    </Menu.Menu>
  </Menu>
  ) : (
    // DISPLAYED WHEN NOT LOGGED IN
    <Menu pointing secondary size="massive" color="teal">
    <Menu.Item
      name='home'
      active={activeItem === 'home'}
      onClick={handleItemClick}
      as={Link}
      to='/'
    />
    
    <Menu.Menu position='right'>
      <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to='/login'

      />

      <Menu.Item
        name='register'
        active={activeItem === 'register'}
        onClick={handleItemClick}
        as={Link}
        to='/register'
      />
    </Menu.Menu>
  </Menu>
  )

  return menuBar
  
  }
  
  export default MenuBar