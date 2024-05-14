/**
 * Permissions for the Provider Identities and Provider Identity ACLs
 */
const providerIdentityPermissions = {
  AUDIT_REPORT: {
    title: 'Audit Reports',
    permittedPermissions: ['read']
  },
  AUTHENTICATOR_DEFINITION: {
    title: 'Authenticator Definitions',
    permittedPermissions: ['create', 'delete']
  },
  CATALOG_ITEM_ACL: {
    title: 'Catalog Item ACLs',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  DASHBOARD_DAAC_CURATOR: {
    title: 'CMR Dashboard DAAC Curator',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  DATA_QUALITY_SUMMARY_ASSIGNMENT: {
    title: 'Data Quality Summary Assignments',
    permittedPermissions: ['create', 'delete']
  },
  DATA_QUALITY_SUMMARY_DEFINITION: {
    title: 'Data Quality Summary Definitions',
    permittedPermissions: ['create', 'update', 'delete']
  },
  DATASET_INFORMATION: {
    title: 'Dataset Information',
    permittedPermissions: ['read']
  },
  SUBSCRIPTION_MANAGEMENT: {
    title: 'Subscription Management',
    permittedPermissions: ['read', 'update']
  },
  EXTENDED_SERVICE: {
    title: 'Extended Services',
    permittedPermissions: ['create', 'update', 'delete']
  },
  GROUP: {
    title: 'Groups',
    permittedPermissions: ['create', 'read']
  },
  INGEST_MANAGEMENT_ACL: {
    title: 'Ingest Operations',
    permittedPermissions: ['read', 'update']
  },
  NON_NASA_DRAFT_APPROVER: {
    title: 'Non-NASA Draft MMT Approver',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  NON_NASA_DRAFT_USER: {
    title: 'Non-NASA Draft MMT User',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  OPTION_ASSIGNMENT: {
    title: 'Option Assignments',
    permittedPermissions: ['create', 'read', 'delete']
  },
  OPTION_DEFINITION: {
    title: 'Option Definition Deprecations',
    permittedPermissions: ['create', 'delete']
  },
  OPTION_DEFINITION_DEPRECATION: {
    title: 'Option Definitions',
    permittedPermissions: ['create']
  },
  PROVIDER_CALENDAR_EVENT: {
    title: 'Provider Calendar Event',
    permittedPermissions: ['create', 'update', 'delete']
  },
  PROVIDER_CONTEXT: {
    title: 'Provider Context',
    permittedPermissions: ['read']
  },
  PROVIDER_HOLDINGS: {
    title: 'Provider Holdings',
    permittedPermissions: ['read']
  },
  PROVIDER_INFORMATION: {
    title: 'Provider Information',
    permittedPermissions: ['update']
  },
  PROVIDER_OBJECT_ACL: {
    title: 'Provider Object ACLs',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  PROVIDER_ORDER_ACCEPTANCE: {
    title: 'Provider Order Acceptances',
    permittedPermissions: ['create']
  },
  PROVIDER_ORDER_CLOSURE: {
    title: 'Provider Order Closures',
    permittedPermissions: ['create']
  },
  PROVIDER_ORDER_REJECTION: {
    title: 'Provider Order Rejections',
    permittedPermissions: ['create']
  },
  PROVIDER_ORDER_RESUBMISSION: {
    title: 'Provider Order Resubmissions',
    permittedPermissions: ['create']
  },
  PROVIDER_ORDER_TRACKING_ID: {
    title: 'Provider Order Tracking IDs',
    permittedPermissions: ['update']
  },
  PROVIDER_ORDER: {
    title: 'Provider Orders',
    permittedPermissions: ['read']
  },
  PROVIDER_POLICIES: {
    title: 'Provider Policies',
    permittedPermissions: ['read', 'update', 'delete']
  },
  USER: {
    title: 'Users',
    permittedPermissions: ['read']
  }
}

export default providerIdentityPermissions
