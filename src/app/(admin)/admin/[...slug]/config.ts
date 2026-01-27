
// Defines the configuration for each admin table page.
export const tableConfig: Record<string, { 
    db: 'main' | 'ssp', 
    table: string, 
    columns: string[], 
    dateColumn?: string, 
    searchColumns: string[],
    filterColumns?: string[],
}> = {
  'contacts': { db: 'main', table: 'contact_inquiries', columns: ['id', 'fullName', 'email', 'inquiryType', 'timestamp'], dateColumn: 'timestamp', searchColumns: ['fullName', 'email', 'inquiryType'] },
  'customers': { db: 'main', table: 'customers', columns: ['id', 'name', 'email', 'phone', 'created_at'], dateColumn: 'created_at', searchColumns: ['name', 'email'] },
  'workshops': { db: 'main', table: 'workshop_requests', columns: ['id', 'fullName', 'company', 'email', 'workshop', 'timestamp'], dateColumn: 'timestamp', searchColumns: ['fullName', 'email', 'company', 'workshop'] },
  'newsletter-subscribers': { db: 'main', table: 'newsletter_subscribers', columns: ['id', 'email', 'subscribed_at'], dateColumn: 'subscribed_at', searchColumns: ['email'] },
  'notification-subscribers': { db: 'main', table: 'notification_subscribers', columns: ['email', 'workshopUpdates', 'csrAnnouncements', 'newsletter', 'updatedAt'], dateColumn: 'updatedAt', searchColumns: ['email'] },
  'orders': { db: 'main', table: 'orders', columns: ['id', 'customer_name', 'customer_email', 'order_total', 'order_status', 'created_at'], dateColumn: 'created_at', searchColumns: ['customer_name', 'customer_email', 'id', 'order_status'] },
  'order-services': { db: 'main', table: 'order_services', columns: ['id', 'order_id', 'service_name', 'quantity', 'price'], dateColumn: undefined, searchColumns: ['service_name', 'order_id'] },
  'services': { db: 'main', table: 'services', columns: ['id', 'name', 'category', 'price'], dateColumn: undefined, searchColumns: ['name', 'category'] },
  'tracking-status': { db: 'main', table: 'tracking_status', columns: ['id', 'order_id', 'status', 'notes', 'updated_at'], dateColumn: 'updated_at', searchColumns: ['order_id', 'status'] },
  'users': { db: 'main', table: 'user_info', columns: ['id', 'fullName', 'email', 'phone', 'userType', 'companyName', 'created_at'], dateColumn: 'created_at', searchColumns: ['fullName', 'email', 'companyName'] },
  'job-applications': { db: 'main', table: 'job_applications', columns: ['id', 'firstName', 'lastName', 'email', 'jobTitle', 'resumeUrl', 'timestamp'], dateColumn: 'timestamp', searchColumns: ['firstName', 'lastName', 'email', 'jobTitle'] },
  'ssp/orders': { 
      db: 'ssp', 
      table: 'ssp_orders', 
      columns: ['id', 'customer_name', 'customer_email', 'total_amount', 'status', 'country', 'created_at'], 
      dateColumn: 'created_at', 
      searchColumns: ['customer_name', 'customer_email', 'id', 'status'],
      filterColumns: ['status', 'country']
  },
  'ssp/order-items': { db: 'ssp', table: 'ssp_order_items', columns: ['id', 'order_id', 'service_name', 'quantity', 'price'], dateColumn: undefined, searchColumns: ['service_name', 'order_id'] },
  'ssp/services': { db: 'ssp', table: 'ssp_services', columns: ['id', 'name', 'category', 'price', 'tat'], dateColumn: undefined, searchColumns: ['name', 'category'] },
  'ssp/tracking-status': { db: 'ssp', table: 'ssp_tracking_status', columns: ['id', 'order_id', 'status', 'notes', 'updated_at'], dateColumn: 'updated_at', searchColumns: ['order_id', 'status'] },
};
