import axios from "axios";
import React, { createContext, useContext, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

const paymentServer = "http://localhost:9000";

export interface Purchase {
  id: number;
  user_id: string;
  song_id: number;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  status: string;
  created_at: string;
  song?: any;
}

interface PaymentContextType {
  loading: boolean;
  createOrder: (songId: string) => Promise<any>;
  verifyPayment: (
    orderId: string,
    paymentId: string,
    signature: string
  ) => Promise<boolean>;
  getPurchaseHistory: () => Promise<Purchase[]>;
  createBulkOrder: (songId: string[]) => Promise<any>;
  verifyBulkPayment: (
    orderId: string,
    paymentId: string,
    signature: string
  ) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const createOrder = async (songId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${paymentServer}/api/v1/payment/create-order`,
        { songId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      return data;
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to create order");
      throw error;
    }
  };

  const verifyPayment = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${paymentServer}/api/v1/payment/verify`,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      if (data.success) {
        toast.success("Payment successful!");
        return true;
      }
      return false;
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Payment verification failed");
      return false;
    }
  };

  const getPurchaseHistory = async (): Promise<Purchase[]> => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${paymentServer}/api/v1/payment/history`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      return data.purchases || [];
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to fetch purchase history"
      );
      return [];
    }
  };

  // ✅ BULK ORDER FUNCTION
const createBulkOrder = async (songId: string[]) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    console.log("🛒 Creating bulk order for:", songId); // Add this
    console.log("🔑 Token:", token ? "Present" : "Missing"); // Add this
    
    const { data } = await axios.post(
      `${paymentServer}/api/v1/payment/create-bulk-order`,
      { songId },
      { headers: { token } }
    );
    return data;
  } catch (error: any) {
    console.error("❌ Bulk order error:", error.response?.data || error.message); // Add this
    toast.error(error.response?.data?.message || "Error creating bulk order");
    throw error;
  } finally {
    setLoading(false);
  }
};


  // ✅ BULK PAYMENT VERIFICATION FUNCTION
  const verifyBulkPayment = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${paymentServer}/api/v1/payment/verify-bulk`,
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      if (data.success) {
        toast.success(`${data.count} song(s) purchased successfully!`);
        return true;
      }
      return false;
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Payment verification failed");
      return false;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        loading,
        createOrder,
        verifyPayment,
        getPurchaseHistory,
        createBulkOrder,
        verifyBulkPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};