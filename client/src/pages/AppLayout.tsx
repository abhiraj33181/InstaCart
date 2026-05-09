import { Outlet } from "react-router"
import Banner from "../components/Banner"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import CartSidebar from "../components/CartSidebar"

export const AppLayout = () => {
  return (
    <>
      <Banner/>
      <Navbar/>
      <main className="min-h-screen">
        <Outlet/>
      </main>

      <Footer/>
      <CartSidebar/>
    </>
  )
}