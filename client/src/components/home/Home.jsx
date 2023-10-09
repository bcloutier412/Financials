import SideNav from './SideNav'
import Nav from './Nav'
import Dashboard from './Dashboard'

const Home = () => {
  return (
    <div className="h-full flex">
      {/* SIDE NAV */}
      <SideNav />

      {/* 
        CONTAINER:
          CONTAINER:
            Overall performance
            Portfolio diversity
          Benchmark performance
      */}
      <main className="grow">
        <Nav />
        <Dashboard />
      </main>
  </div>
  )
}

export default Home