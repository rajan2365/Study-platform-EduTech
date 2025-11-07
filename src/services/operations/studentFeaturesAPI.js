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
