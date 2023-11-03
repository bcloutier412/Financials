import { useMemo} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
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
    <div className="absolute w-full bottom-0 bg-white gap-8 font-light lg:hidden flex justify-center">
      {buttons.map((button) => {
        return (<button key={button.name} className={`${lastPath === button.name && selected} py-4`} onClick={() => navigate(button.navigate)}>{button.text}</button>)
      })}
    </div>
  )
}

export default Footer