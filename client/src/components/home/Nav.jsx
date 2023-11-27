/* eslint-disable react/prop-types */
import { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../../features/user/userSlice'
import { useLocation, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react'

import { logoutUser } from '../../features/user/userSlice';

import Logo from '../icons/Logo'
import Bell from '../icons/Bell'
import Profile from '../icons/Profile';
import Setting from '../icons/Setting'

const Nav = () => {
  const [width, setWidth] = useState(0);
  const logoReference = useRef(null);
  const userReference = useRef(null);

  useEffect(() => {
    if (logoReference.current && userReference.current) {
      setWidth(userReference.current.offsetWidth);
    }
  }, []);
  return (
    <div className="flex justify-between border-b border-solid border-b-primaryDivider">
      <NavLogo logoReference={logoReference} width={width} />
      <NavButtons />
      <NavUser userReference={userReference} width={width} />
    </div>
  )
}

const NavLogo = ({ logoReference, width }) => {
  return (
    <div className="lg:p-4 p-2 flex items-center gap-2" style={{ minWidth: width }} ref={logoReference}>
      <Logo width="24" height="24" />
      <div className="tracking-tight">Financials</div>
    </div>
  )
}

export const NavButtons = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const buttons = [
    {
      name: "home",
      navigate: "/home",
      text: "Home"
    },
    {
      name: "assets",
      navigate: "assets",
      text: "Assets"
    },
    {
      name: "news",
      navigate: "news",
      text: "News"
    }
  ]

  const selected = "border-b border-solid border-b-primary text-primary";

  let lastPath = useMemo(() => {
    let parts = location.pathname.split('/');
    return parts[parts.length - 1];
  }, [location])

  return (
    <div className="gap-8 font-light lg:flex hidden">
      {buttons.map((button) => {
        return (<button key={button.name} className={`${lastPath === button.name && selected}`} onClick={() => navigate(button.navigate)}>{button.text}</button>)
      })}
    </div>
  )
}

const NavUser = ({ userReference, width }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);

  const handleClick = (e) => {
    const name = e.target.name || e.target.parentNode.name || e.target.parentNode.parentNode.name;
    if (!currentMenu) {
      setIsActive(true);
      setCurrentMenu(name);
    } else if (currentMenu === name) {
      setIsActive(false);
    } else {
      setCurrentMenu(name);
    }
  }

  let menuToRender;

  if (currentMenu == "settings") {
    menuToRender = <Settings />
  } else if (currentMenu == "notifications") {
    menuToRender = (<div>notifications</div>)
  } else if (currentMenu == "profile") {
    menuToRender = (<div>profile</div>)
  }
  return (
    <div className="relative lg:p-4 p-2 flex gap-4 items-center justify-between" ref={userReference} style={{ minWidth: width }}>
      <button name="settings" onClick={handleClick} className="relative p-2 border border-solid border-primaryDivider rounded-lg hover:text-primary hover:border-primary">
        <Setting width="20" height="20" />
      </button>
      <button name="notifications" onClick={handleClick} className="p-2 border border-solid border-primaryDivider rounded-lg hover:text-primary hover:border-primary">
        <Bell width="20" height="20" />
      </button>
      <button name="profile" onClick={handleClick} className="p-2 border border-solid border-primaryDivider rounded-lg hover:text-primary hover:border-primary">
        <Profile width="20" height="20" />
      </button>

      {/* Drop down menu */}
      <div className="absolute right-2 top-[60px] w-[200px] z-50">
        <Transition
          show={isActive}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setCurrentMenu(null)}
        >
          <div className={`absolute w-full bg-white border border-solid rounded border-primaryDivider p-2`}>
            {menuToRender}
          </div>
        </Transition>
      </div>
    </div>
  )
}

const Settings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login')
  }
  return (
    <div>
      <ul>
        <li><header className="text-md underline">Settings</header></li>
        <li onClick={handleLogout} className="hover:cursor-pointer">Logout</li>
      </ul>
    </div>
  )
}

export default Nav