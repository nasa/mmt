/**
 * Permissions for the Provider Identities and Provider Identity ACLs
 */
const providerIdentityPermissions = {
  AUDIT_REPORT: {
    title: 'Audit Reports',
    permissions: ['read']
  },
  AUTHENTICATOR_DEFINITION: {
    title: 'Authenticator Definitions',
    permissions: ['create', 'delete']
  },
  CATALOG_ITEM_ACL: {
    title: 'Catalog Item ACLs',
    permissions: ['create', 'read', 'update', 'delete']
  },
  DASHBOARD_DAAC_CURATOR: {
    title: 'CMR Dashboard DAAC Curator',
    permissions: ['create', 'read', 'update', 'delete']
  },
  DATA_QUALITY_SUMMARY_ASSIGNMENT: {
    title: 'Data Quality Summary Assignments',
    permissions: ['create', 'delete']
  },
  DATA_QUALITY_SUMMARY_DEFINITION: {
    title: 'Data Quality Summary Definitions',
    permissions: ['create', 'update', 'delete']
  },
  DATASET_INFORMATION: {
    title: 'Dataset Information',
    permissions: ['read']
  },
  SUBSCRIPTION_MANAGEMENT: {
    title: 'Subscription Management',
    permissions: ['read', 'update']
  },
  EXTENDED_SERVICE: {
    title: 'Extended Services',
    permissions: ['create', 'update', 'delete']
  },
  GROUP: {
    title: 'Groups',
    permissions: ['create', 'read']
  },
  INGEST_MANAGEMENT_ACL: {
    title: 'Ingest Operations',
    permissions: ['read', 'update']
  },
  NON_NASA_DRAFT_APPROVER: {
    title: 'Non-NASA Draft MMT Approver',
    permissions: ['create', 'read', 'update', 'delete']
  },
  NON_NASA_DRAFT_USER: {
    title: 'Non-NASA Draft MMT User',
    permissions: ['create', 'read', 'update', 'delete']
  },
  OPTION_ASSIGNMENT: {
    title: 'Option Assignments',
    permissions: ['create', 'read', 'delete']
  },
  OPTION_DEFINITION: {
    title: 'Option Definition Deprecations',
    permissions: ['create', 'delete']
  },
  OPTION_DEFINITION_DEPRECATION: {
    title: 'Option Definitions',
    permissions: ['create']
  },
  PROVIDER_CALENDAR_EVENT: {
    title: 'Provider Calendar Event',
    permissions: ['create', 'update', 'delete']
  },
  PROVIDER_CONTEXT: {
    title: 'Provider Context',
    permissions: ['read']
  },
  PROVIDER_HOLDINGS: {
    title: 'Provider Holdings',
    permissions: ['read']
  },
  PROVIDER_INFORMATION: {
    title: 'Provider Information',
    permissions: ['update']
  },
  PROVIDER_OBJECT_ACL: {
    title: 'Provider Object ACLs',
    permissions: ['create', 'read', 'update', 'delete']
  },
  PROVIDER_ORDER_ACCEPTANCE: {
    title: 'Provider Order Acceptances',
    permissions: ['create']
  },
  PROVIDER_ORDER_CLOSURE: {
    title: 'Provider Order Closures',
    permissions: ['create']
  },
  PROVIDER_ORDER_REJECTION: {
    title: 'Provider Order Rejections',
    permissions: ['create']
  },
  PROVIDER_ORDER_RESUBMISSION: {
    title: 'Provider Order Resubmissions',
    permissions: ['create']
  },
  PROVIDER_ORDER_TRACKING_ID: {
    title: 'Provider Order Tracking IDs',
    permissions: ['update']
  },
  PROVIDER_ORDER: {
    title: 'Provider Orders',
    permissions: ['read']
  },
  PROVIDER_POLICIES: {
    title: 'Provider Policies',
    permissions: ['read', 'update', 'delete']
  },
  USER: {
    title: 'Users',
    permissions: ['read']
  }
}

export default providerIdentityPermissions
