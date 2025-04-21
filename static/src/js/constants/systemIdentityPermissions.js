/**
 * Permissions for the System Identities and System Identity ACLs
 */
const systemIdentityPermissions = {
  ANY_ACL: {
    title: 'Any ACL',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  ARCHIVE_RECORD: {
    title: 'Archive Records',
    permittedPermissions: ['delete']
  },
  DASHBOARD_ADMIN: {
    title: 'CMR Dashboard Admin',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  DASHBOARD_ARC_CURATOR: {
    title: 'CMR Dashboard ARC Curator',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  DASHBOARD_MDQ_CURATOR: {
    title: 'CMR Dashboard MDQ Curator',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  ERROR_MESSAGE: {
    title: 'Error Messages',
    permittedPermissions: ['update']
  },
  EVENT_NOTIFICATION: {
    title: 'Event Notifications',
    permittedPermissions: ['delete']
  },
  EXTENDED_SERVICE_ACTIVATION: {
    title: 'Extended Service Activation',
    permittedPermissions: ['create']
  },
  EXTENDED_SERVICE: {
    title: 'Extended Services',
    permittedPermissions: ['delete']
  },
  GROUP: {
    title: 'Groups',
    permittedPermissions: ['create', 'read']
  },
  INGEST_MANAGEMENT_ACL: {
    title: 'Ingest Operations',
    permittedPermissions: ['read', 'update']
  },
  KEYWORD_MANAGEMENT_SYSTEM: {
    title: 'Keyword Management System',
    permittedPermissions: ['create', 'read', 'update', 'delete']
  },
  METRIC_DATA_POINT_SAMPLE: {
    title: 'Metric Data Point Samples',
    permittedPermissions: ['read']
  },
  ORDER_AND_ORDER_ITEMS: {
    title: 'Orders and Order Items',
    permittedPermissions: ['read', 'delete']
  },
  PROVIDER: {
    title: 'Providers',
    permittedPermissions: ['create', 'delete']
  },
  SYSTEM_AUDIT_REPORT: {
    title: 'System Audit Reports',
    permittedPermissions: ['read']
  },
  SYSTEM_CALENDAR_EVENT: {
    title: 'System Calendar Event',
    permittedPermissions: ['create', 'update', 'delete']
  },
  SYSTEM_INITIALIZER: {
    title: 'System Initializer',
    permittedPermissions: ['create']
  },
  SYSTEM_OPTION_DEFINITION_DEPRECATION: {
    title: 'System Option Definition Deprecations',
    permittedPermissions: ['create']
  },
  SYSTEM_OPTION_DEFINITION: {
    title: 'System Option Definitions',
    permittedPermissions: ['create', 'delete']
  },
  TAG_GROUP: {
    title: 'Tags and Tag Groups',
    permittedPermissions: ['create', 'update', 'delete']
  },
  TAXONOMY: {
    title: 'Taxonomies',
    permittedPermissions: ['create']
  },
  TAXONOMY_ENTRY: {
    title: 'Taxonomy Entries',
    permittedPermissions: ['create']
  },
  TOKEN_REVOCATION: {
    title: 'Token Revocations',
    permittedPermissions: ['create']
  },
  TOKEN: {
    title: 'Tokens',
    permittedPermissions: ['read', 'delete']
  },
  USER_CONTEXT: {
    title: 'User Context',
    permittedPermissions: ['read']
  },
  USER: {
    title: 'Users',
    permittedPermissions: ['read', 'update', 'delete']
  }
}

export default systemIdentityPermissions
