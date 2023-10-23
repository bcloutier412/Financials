import { useMemo } from 'react';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/user/userSlice'
import { useLocation, useNavigate } from 'react-router-dom';

import Logo from '../icons/Logo'
import Bell from '../icons/Bell'

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

const Nav = () => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const location = useLocation()

  let lastPath = useMemo(() => {
    let parts = location.pathname.split('/');
    return parts[parts.length - 1];
  }, [location])

  return (
    <div className="flex justify-between border-b border-solid border-b-primaryDivider">
      <div className="p-4 flex items-center">
        <Logo width="24" height="24" />
      </div>
      <div className="flex gap-8 font-light">
        {buttons.map((button) => {
          return (<button key={button.name} className={`${lastPath === button.name && selected}`} onClick={() => navigate(button.navigate)}>{button.text}</button>)
        })}
      </div>
      <div className="p-4 flex gap-2 items-center">
        <button className="p-2 border border-solid border-primaryDivider rounded-lg">
          <Bell width="20" height="20"/>
        </button>
        <div>{user.name}</div>
      </div>
    </div>
  )
}

export default Nav