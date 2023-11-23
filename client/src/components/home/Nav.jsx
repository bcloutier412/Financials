/* eslint-disable react/prop-types */
import { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/user/userSlice'
import { useLocation, useNavigate } from 'react-router-dom';

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
  const user = useSelector(selectUser)

  return (
    <div className="relative lg:p-4 p-2  flex gap-2 items-center justify-between" ref={userReference} style={{ minWidth: width, maxWidth: "170px" }}>
      <button className="relative p-2 border border-solid border-primaryDivider rounded-lg hover:text-primary hover:border-primary">
        <Setting width="20" height="20" />
      </button>
      <button className="p-2 border border-solid border-primaryDivider rounded-lg hover:text-primary hover:border-primary">
        <Bell width="20" height="20" />
      </button>
      <button className="p-2 border border-solid border-primaryDivider rounded-lg hover:text-primary hover:border-primary">
        <Profile width="20" height="20" />
      </button>
    </div>
  )
}

export default Nav