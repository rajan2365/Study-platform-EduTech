import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import Img from "../../common/Img"

import { logout } from "../../../services/operations/authAPI"
import { fetchCourseCategories } from "../../../services/operations/courseDetailsAPI"

import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { AiOutlineCaretDown, AiOutlineHome } from "react-icons/ai"
import { MdOutlineContactPhone } from "react-icons/md"
import { TbMessage2Plus } from "react-icons/tb"
import { PiNotebook } from "react-icons/pi"

export default function MobileProfileDropDown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ref = useRef(null)

  const [open, setOpen] = useState(false)
  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useOnClickOutside(ref, () => setOpen(false))

  // Fetch categories for "Catalog"
  const fetchSublinks = async () => {
    try {
      setLoading(true)
      const res = await fetchCourseCategories()
      setSubLinks(res || [])
    } catch (error) {
      console.log("Could not fetch category list:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSublinks()
  }, [])

  if (!user) return null

  return (
    // Only visible on small devices
    <button className="relative sm:hidden" onClick={() => setOpen((prev) => !prev)}>
      <div className="flex items-center gap-x-1">
        <Img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>

      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute min-w-[150px] top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-lg border-[1px] border-richblack-700 bg-richblack-800"
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          <Link to="/" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700">
              <AiOutlineHome className="text-lg" />
              Home
            </div>
          </Link>

          {/* Catalog with dynamic links */}
          <div className="relative">
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700">
              <PiNotebook className="text-lg" />
              Catalog
            </div>
            {loading ? (
              <p className="px-4 py-2 text-xs text-richblack-200">Loading...</p>
            ) : (
              subLinks.length > 0 && (
                <div className="pl-6">
                  {subLinks.map((subLink, i) => (
                    <Link
                      key={i}
                      to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                      onClick={() => setOpen(false)}
                    >
                      <p className="py-1 text-xs text-richblack-100 hover:text-yellow-25">
                        {subLink.name}
                      </p>
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>

          <Link to="/about" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700">
              <TbMessage2Plus className="text-lg" />
              About Us
            </div>
          </Link>

          <Link to="/contact" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700">
              <MdOutlineContactPhone className="text-lg" />
              Contact Us
            </div>
          </Link>

          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex w-full items-center gap-x-2 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  )
}
