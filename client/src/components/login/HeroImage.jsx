const HeroImage = () => {
  return (
    <div className="container bg-primary rounded-3xl h-full flex-col justify-center hidden lg:flex">
      <div className="px-[10%]">
        <header className="text-3xl text-white font-light mb-4 max-w-md">The simplest way to manage your assets</header>
        <p className="text-sm tracking-tight text-white mb-8">View live prices and portfolio performance</p>
        <img src="https://o.remove.bg/downloads/c979c036-f837-4d64-a609-aa4c98a22e46/965492ae3a68cced14434fd34106a551-removebg-preview.png"/>
      </div>
    </div>
  )
}

export default HeroImage