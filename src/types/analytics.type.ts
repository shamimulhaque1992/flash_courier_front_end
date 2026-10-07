export interface AdminAnalytics {
  merchants: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  };
  riders: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  };
  shipments: {
    total: number;
    delivered: number;
    cancelled: number;
    inTransit: number;
  };
  schedules: { total: number; published: number };
  financials: { totalRevenue: number; totalRefunded: number };
}

export interface MerchantAnalytics {
  shipments: {
    total: number;
    pendingPayment: number;
    paid: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  financials: {
    totalRevenue: number;
    totalRefunded: number;
    totalPayments: number;
  };
}

export interface RiderAnalytics {
  schedules: { total: number; published: number; completed: number };
  shipments: {
    total: number;
    accepted: number;
    pickedUp: number;
    outForDelivery: number;
    delivered: number;
    rejected: number;
  };
}

export interface CustomerAnalytics {
  shipments: {
    total: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    returned: number;
  };
  financials: { totalAmountSpent: number; totalRefunded: number };
}
