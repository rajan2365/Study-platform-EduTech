// import { loadStripe } from "@stripe/stripe-js";
// import {toast} from "react-hot-toast";
// import { studentEndpoints } from "../apis";
// import { apiConnector } from "../apiconnector";
// import rzpLogo from "../../assets/Logo/rzp_logo.png"

// import {setPaymentLoading} from "../../slices/courseSlice";
// import { resetCart } from "../../slices/cartSlice";

// const{COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

// // //course buy ke liye razpr pay loader
// // function loadScript(src){
// //     return new Promise((resolve)=>{
// //         const script =document.createElement("script");
// //         script.src= src;

// //         script.onload=()=>{
// //             resolve(true);
// //         }
// //         script.onerror=()=>{
// //             resolve(false);
// //         }
// //         document.body.appendChild(script);
// //     })
// // }


// // import { toast } from "react-hot-toast";
// // import { studentEndpoints } from "../apis";
// // import { apiConnector } from "../apiconnector";
// // import { setPaymentLoading } from "../../slices/courseSlice";
// // import { resetCart } from "../../slices/cartSlice";

// // const { COURSE_PAYMENT_API } = studentEndpoints;

// // Initialize Stripe with publishable key
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

// export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
//   const toastId = toast.loading("Processing Payment...");
//   dispatch(setPaymentLoading(true));

//   try {
//     // 1️⃣ Call backend to create Stripe Checkout Session
//     const orderResponse = await apiConnector(
//       "POST",
//       COURSE_PAYMENT_API,
//       { courses },
//       { Authorization: `Bearer ${token}` }
//     );

//     if (!orderResponse.data.success) {
//       throw new Error(orderResponse.data.message);
//     }

//     const sessionId = orderResponse.data.sessionId;

//     // 2️⃣ Redirect to Stripe Checkout page
//     const stripe = await stripePromise;
//     const { error } = await stripe.redirectToCheckout({ sessionId });

//     if (error) {
//       console.error("Stripe Checkout error:", error);
//       toast.error("Payment failed");
//     }
//   } catch (error) {
//     console.log("PAYMENT API ERROR:", error);
//     toast.error("Could not process payment");
//   }

//   toast.dismiss(toastId);
//   dispatch(setPaymentLoading(false));
// }


// // export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
// //     const toastId = toast.loading("Loading...");
// //     try{
// //         //load the script
// //         const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

// //         if(!res) {
// //             toast.error("RazorPay SDK failed to load");
// //             return;
// //         }

// //         //initiate the order
// //         const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
// //                                 {courses},
// //                                 {
// //                                     Authorization: `Bearer ${token}`,
// //                                 })

// //         if(!orderResponse.data.success) {
// //             throw new Error(orderResponse.data.message);
// //         }
// //         console.log("PRINTING orderResponse", orderResponse);
// //         //options
// //         const options = {
// //             key: process.env.RAZORPAY_KEY,
// //             currency: orderResponse.data.message.currency,
// //             amount: `${orderResponse.data.message.amount}`,
// //             order_id:orderResponse.data.message.id,
// //             name:"StudyNotion",
// //             description: "Thank You for Purchasing the Course",
// //             image:rzpLogo,
// //             prefill: {
// //                 name:`${userDetails.firstName}`,
// //                 email:userDetails.email
// //             },
// //             handler: function(response) {
// //                 //send successful wala mail
// //                 sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token );
// //                 //verifyPayment
// //                 verifyPayment({...response, courses}, token, navigate, dispatch);
// //             }
// //         }
// //         //miss hogya tha 
// //         const paymentObject = new window.Razorpay(options);
// //         paymentObject.open();
// //         paymentObject.on("payment.failed", function(response) {
// //             toast.error("oops, payment failed");
// //             console.log(response.error);
// //         })

// //     }
// //     catch(error) {
// //         console.log("PAYMENT API ERROR.....", error);
// //         toast.error("Could not make Payment");
// //     }
// //     toast.dismiss(toastId);
// // }

// async function sendPaymentSuccessEmail(response, amount, token) {
//     try{
//         await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
//             orderId: response.razorpay_order_id,
//             paymentId: response.razorpay_payment_id,
//             amount,
//         },{
//             Authorization: `Bearer ${token}`
//         })
//     }
//     catch(error) {
//         console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
//     }
// }

// //verify payment
// async function verifyPayment(bodyData, token, navigate, dispatch) {
//     const toastId = toast.loading("Verifying Payment....");
//     dispatch(setPaymentLoading(true));
//     try{
//         const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
//             Authorization:`Bearer ${token}`,
//         })

//         if(!response.data.success) {
//             throw new Error(response.data.message);
//         }
//         toast.success("payment Successful, ypou are addded to the course");
//         navigate("/dashboard/enrolled-courses");
//         dispatch(resetCart());
//     }   
//     catch(error) {
//         console.log("PAYMENT VERIFY ERROR....", error);
//         toast.error("Could not verify Payment");
//     }
//     toast.dismiss(toastId);
//     dispatch(setPaymentLoading(false));
// }
// import { toast } from "react-hot-toast";
// import { studentEndpoints } from "../apis";
// import { apiConnector } from "../apiconnector";
// import { setPaymentLoading } from "../../slices/courseSlice";
// import { resetCart } from "../../slices/cartSlice";

// const { COURSE_PAYMENT_API, SEND_PAYMENT_SUCCESS_EMAIL_API, COURSE_VERIFY_API } = studentEndpoints;

// // ========================
// // Buy Course (Direct Enrollment)
// // ========================
// export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
//   const toastId = toast.loading("Processing Purchase...");
//   dispatch(setPaymentLoading(true));

//   try {
//     // 1️⃣ Call backend to directly enroll student
//     const orderResponse = await apiConnector(
//       "POST",
//       COURSE_PAYMENT_API, // maps to capturePayment controller
//       { courses },
//       { Authorization: `Bearer ${token}` }
//     );

//     if (!orderResponse.data.success) {
//       throw new Error(orderResponse.data.message);
//     }

//     toast.success("Course purchased successfully!");

//     // 2️⃣ Send confirmation email (optional)
//     await sendPaymentSuccessEmail(token);

//     // 3️⃣ Reset cart & navigate to enrolled courses
//     dispatch(resetCart());
//     navigate("/dashboard/enrolled-courses");
//   } catch (error) {
//     console.log("BUY COURSE ERROR:", error);
//     toast.error(error.message || "Could not purchase course");
//   }

//   toast.dismiss(toastId);
//   dispatch(setPaymentLoading(false));
// }

// // ========================
// // Send Payment Success Email
// // ========================
// async function sendPaymentSuccessEmail(token) {
//   try {
//     await apiConnector(
//       "POST",
//       SEND_PAYMENT_SUCCESS_EMAIL_API,
//       {
//         orderId: "DIRECT-BUY",
//         paymentId: "NA",
//         amount: 0,
//       },
//       { Authorization: `Bearer ${token}` }
//     );
//   } catch (error) {
//     console.log("EMAIL ERROR:", error);
//   }
// }
// // ✅ Verify Payment (after backend confirms)
// async function verifyPayment(orderId, token, navigate, dispatch) {
//     const toastId = toast.loading("Verifying Payment...");
//     dispatch(setPaymentLoading(true));

//     try {
//         const response = await apiConnector(
//             "POST",
//             COURSE_VERIFY_API,
//             { orderId },   // we send the backend's orderId / sessionId
//             { Authorization: `Bearer ${token}` }
//         );

//         if (!response.data.success) {
//             throw new Error(response.data.message);
//         }

//         toast.success("✅ Payment Successful, you are now enrolled in the course!");
//         dispatch(resetCart());
//         navigate("/dashboard/enrolled-courses");
//     } catch (error) {
//         console.error("PAYMENT VERIFY ERROR:", error);
//         toast.error("❌ Could not verify payment");
//     }

//     toast.dismiss(toastId);
//     dispatch(setPaymentLoading(false));
// }


// import { toast } from "react-hot-toast";
// import { studentEndpoints } from "../apis";
// import { apiConnector } from "../apiconnector";
// import { setPaymentLoading } from "../../slices/courseSlice";
// import { resetCart } from "../../slices/cartSlice";

// const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

// // ========================
// // Buy Course (calls capturePayment → then verifyPayment)
// // ========================
// export async function buyCourse(token, courses, navigate, dispatch) {
//   const toastId = toast.loading("Processing Purchase...");
//   dispatch(setPaymentLoading(true));

//   try {
//     // 1️⃣ Call backend to create order (direct buy)
//     const orderResponse = await apiConnector(
//       "POST",
//       COURSE_PAYMENT_API,
//       { courses },
//       { Authorization: `Bearer ${token}` }
//     );

//     if (!orderResponse.data.success) {
//       throw new Error(orderResponse.data.message);
//     }

//     const orderId = orderResponse.data.orderId; // backend must return this

//     // 2️⃣ Verify order
//     await verifyPayment(orderId, token, navigate, dispatch);

//     // 3️⃣ Send confirmation email
//     await sendPaymentSuccessEmail(orderId, token);
//      dispatch(setPaymentLoading(false));

//   } catch (error) {
//     console.log("BUY COURSE ERROR:", error);
//     toast.error(error.message || "❌ Could not purchase course");
//   }

//   toast.dismiss(toastId);
//   dispatch(setPaymentLoading(false));
// }

// // ========================
// // Verify Payment
// // ========================
// async function verifyPayment(orderId, token, navigate, dispatch) {
//   const toastId = toast.loading("Verifying Payment...");
//   dispatch(setPaymentLoading(true));

//   try {
//     const response = await apiConnector(
//       "POST",
//       COURSE_VERIFY_API,
//       { orderId },
//       { Authorization: `Bearer ${token}` }
//     );

//     if (!response.data.success) {
//       throw new Error(response.data.message);
//     }

//     toast.success("✅ Payment Successful, you are now enrolled!");
//     dispatch(resetCart());
//     navigate("/dashboard/enrolled-courses");

//   } catch (error) {
//     console.error("PAYMENT VERIFY ERROR:", error);
//     toast.error("❌ Could not verify payment");
//   }

//   toast.dismiss(toastId);
//   dispatch(setPaymentLoading(false));
// }

// // ========================
// // Send Payment Success Email
// // ========================
// async function sendPaymentSuccessEmail(orderId, token) {
//   try {
//     await apiConnector(
//       "POST",
//       SEND_PAYMENT_SUCCESS_EMAIL_API,
//       {
//         orderId,
//         paymentId: "NA",
//         amount: 0,
//       },
//       { Authorization: `Bearer ${token}` }
//     );
//   } catch (error) {
//     console.log("EMAIL ERROR:", error);
//   }
// }


import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

// ========================
// Buy Course
// ========================
export async function buyCourse(token, courses, navigate, dispatch) {
  const toastId = toast.loading("Processing Purchase...");
  dispatch(setPaymentLoading(true));

  try {
    // 1️⃣ Create order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Order creation failed");
    }

    const orderId = orderResponse.data.orderId;

    // 2️⃣ Verify payment
    await verifyPayment(orderId, token, navigate, dispatch);

    // 3️⃣ Send confirmation email
    await sendPaymentSuccessEmail(orderId, token);

  } catch (error) {
    console.error("BUY COURSE ERROR:", error);
    toast.error(error.message || "❌ Could not purchase course");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}

// ========================
// Verify Payment
// ========================
async function verifyPayment(orderId, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      { orderId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Payment verification failed");
    }

    toast.success("✅ Payment Successful, you are now enrolled!");
    dispatch(resetCart());

    // Navigate safely
    if (navigate && typeof navigate === "function") {
      navigate("/dashboard/enrolled-courses");
    } else {
      console.warn("Navigate function not provided");
    }

  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    toast.error(error.message || "❌ Could not verify payment");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}

// ========================
// Send Payment Success Email
// ========================
async function sendPaymentSuccessEmail(orderId, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId,
        paymentId: "NA",
        amount: 0,
      },
      { Authorization: `Bearer ${token}` }
    );
  } catch (error) {
    console.error("EMAIL ERROR:", error);
  }
}
