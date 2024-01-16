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
import Logout from '../icons/Logout';

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
    <div className="flex justify-between z-50 shadow-nav">
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

  const menus = {
    "settings": <Settings />,
    "notifications": <div>notifications</div>,
    "profile": <div>profile</div>
  }
  
  let menuToRender = menus[currentMenu];

  return (
    <div className="relative lg:p-4 p-2 flex lg:gap-4 gap-2 items-center justify-between" ref={userReference} style={{ minWidth: width }}>
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
      <div className="absolute right-2 top-[60px] w-[360px] z-50">
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
          <div className={`absolute w-full bg-white border border-solid rounded border-primaryDivider shadow-menu`}>
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
    <div className="p-[8px]">
      <header className="text-[24px] p-[8px] leading-tight">Settings</header>
      <div onClick={handleLogout} className="flex items-center hover:cursor-pointer transition-all hover:bg-primaryBackground w-ful px-[8px] py-[8px] rounded-lg">
        <div className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-primaryDivider mr-[4px]">
          <Logout width={20} height={20} />
        </div>
        <div className="px-[8px] text-[15px]">Logout</div>
      </div>
    </div>
  )
}

export default Nav