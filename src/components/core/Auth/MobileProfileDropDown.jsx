// import { useRef, useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { Link, useNavigate } from "react-router-dom"
// import useOnClickOutside from "../../../hooks/useOnClickOutside";
// import Img from "../../common/Img";
// import { logout } from "../../../services/operations/authAPI";
// import { VscDashboard, VscSignOut } from "react-icons/vsc";
// import { AiOutlineCaretDown, AiOutlineHome } from "react-icons/ai";
// import { MdOutlineContactPhone } from "react-icons/md";
// import { TbMessage2Plus } from "react-icons/tb";
// import { PiNotebook } from "react-icons/pi";
// import { fetchCourseCategories } from "../../../services/operations/courseDetailsAPI";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";

// export default function MobileProfileDropDown() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const ref = useRef(null);

//   const { user } = useSelector((state) => state.profile);
//   const [open, setOpen] = useState(false);
//   const [subLinks, setSubLinks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useOnClickOutside(ref, () => setOpen(false));

//   const fetchSublinks = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchCourseCategories();
//       setSubLinks(res);
//     } catch (error) {
//       console.log("Could not fetch the category list = ", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSublinks();
//   }, []);

//   // ✅ Return after hooks
//   if (!user) return null;

//   return (
//     <button className="relative sm:hidden" onClick={() => setOpen(true)}>
//       <div className="flex items-center gap-x-1">
//         <Img
//           src={user?.image}
//           alt={`profile-${user?.firstName}`}
//           className={"aspect-square w-[30px] rounded-full object-cover"}
//         />
//         <AiOutlineCaretDown className="text-sm text-richblack-100" />
//       </div>

//       {open && (
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="absolute min-w-[120px] top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-lg border-[1px] border-richblack-700 bg-richblack-800"
//           ref={ref}
//         >
//           <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
//             <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
//               <VscDashboard className="text-lg" />
//               Dashboard
//             </div>
//           </Link>

//           <Link to="/" onClick={() => setOpen(false)}>
//             <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700">
//               <AiOutlineHome className="text-lg" />
//               Home
//             </div>
//           </Link>

//           <Link to="/" onClick={() => setOpen(false)}>
//             <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
//               <PiNotebook className="text-lg" />
//               Catalog
//             </div>
//           </Link>

//           <Link to="/about" onClick={() => setOpen(false)}>
//             <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700">
//               <TbMessage2Plus className="text-lg" />
//               About Us
//             </div>
//           </Link>

//           <Link to="/contact" onClick={() => setOpen(false)}>
//             <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
//               <MdOutlineContactPhone className="text-lg" />
//               Contact Us
//             </div>
//           </Link>

//           <div
//             onClick={() => {
//               dispatch(logout(navigate));
//               setOpen(false);
//             }}
//             className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100"
//           >
//             <VscSignOut className="text-lg" />
//             Logout
//           </div>
//         </div>
//       )}
//     </button>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Img from "../../common/Img";
import { logout } from "../../../services/operations/authAPI";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { AiOutlineCaretDown, AiOutlineHome } from "react-icons/ai";
import { MdOutlineContactPhone } from "react-icons/md";
import { TbMessage2Plus } from "react-icons/tb";

function MobileProfileDropDown({ isMobile, user }) {
  // ✅ All hooks at top level
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Hook behavior gated by condition
  useOnClickOutside(ref, () => {
    if (open) setOpen(false);
  });

  useEffect(() => {
    if (!isMobile) return;
    // logic that should only run when mobile
  }, [isMobile]);

  // ✅ Safe conditional rendering
  if (!isMobile) return null;

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Img src={user?.image} alt="Profile" />
        <AiOutlineCaretDown />
      </div>

      {open && (
        <div className="absolute top-full mt-2 w-48 rounded-lg shadow-lg bg-white z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <VscDashboard /> Dashboard
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => navigate("/contact")}
          >
            <MdOutlineContactPhone /> Contact
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => dispatch(logout(navigate))}
          >
            <VscSignOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default MobileProfileDropDown;
