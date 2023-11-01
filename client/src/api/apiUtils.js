const baseURL = "https://financial-tracker-api.vercel.app"

const generateURL = (urlPath) => {
  if (process.env.NODE_ENV === "Production") {
    return baseURL + urlPath
  }
  return urlPath
}

export default generateURL