import React, { useEffect, useState, useRef } from "react"

const Assets = () => {
  const [assetTypeSelected, setAssetTypeSelected] = useState("all")
  const selected = "border-b border-solid border-b-primary text-primary";
  return (
    <div className="grow bg-primaryBackground">
      <div className="container m-auto bg-white rounded shadow-component p-5">
        <header className="flex justify-between">
          <div className="flex gap-3">
            <button className={`${assetTypeSelected === "all" && selected} pb-1`} onClick={() => setAssetTypeSelected("all")}>All</button>
            <button className={`${assetTypeSelected === "technology" && selected} pb-1`} onClick={() => setAssetTypeSelected("technology")}>Technology</button>
          </div>
          <div>
            search
          </div>
        </header>
      </div>
    </div>
  )
}

export default Assets