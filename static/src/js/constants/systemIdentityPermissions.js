/**
 * Permissions for the System Identities and System Identity ACLs
 */
const systemIdentityPermissions = {
  ANY_ACL: {
    title: 'Any ACL',
    permissions: ['create', 'read', 'update', 'delete']
  },
  ARCHIVE_RECORD: {
    title: 'Archive Records',
    permissions: ['delete']
  },
  DASHBOARD_ADMIN: {
    title: 'CMR Dashboard Admin',
    permissions: ['create', 'read', 'update', 'delete']
  },
  DASHBOARD_ARC_CURATOR: {
    title: 'CMR Dashboard ARC Curator',
    permissions: ['create', 'read', 'update', 'delete']
  },
  DASHBOARD_MDQ_CURATOR: {
    title: 'CMR Dashboard MDQ Curator',
    permissions: ['create', 'read', 'update', 'delete']
  },
  ERROR_MESSAGE: {
    title: 'Error Messages',
    permissions: ['update']
  },
  EVENT_NOTIFICATION: {
    title: 'Event Notifications',
    permissions: ['delete']
  },
  EXTENDED_SERVICE_ACTIVATION: {
    title: 'Extended Service Activation',
    permissions: ['create']
  },
  EXTENDED_SERVICE: {
    title: 'Extended Services',
    permissions: ['delete']
  },
  GROUP: {
    title: 'Groups',
    permissions: ['create', 'read']
  },
  INGEST_MANAGEMENT_ACL: {
    title: 'Ingest Operations',
    permissions: ['read', 'update']
  },
  METRIC_DATA_POINT_SAMPLE: {
    title: 'Metric Data Point Samples',
    permissions: ['read']
  },
  ORDER_AND_ORDER_ITEMS: {
    title: 'Orders and Order Items',
    permissions: ['read', 'delete']
  },
  PROVIDER: {
    title: 'Providers',
    permissions: ['create', 'delete']
  },
  SYSTEM_AUDIT_REPORT: {
    title: 'System Audit Reports',
    permissions: ['read']
  },
  SYSTEM_CALENDAR_EVENT: {
    title: 'System Calendar Event',
    permissions: ['create', 'update', 'delete']
  },
  SYSTEM_INITIALIZER: {
    title: 'System Initializer',
    permissions: ['create']
  },
  SYSTEM_OPTION_DEFINITION_DEPRECATION: {
    title: 'System Option Definition Deprecations',
    permissions: ['create']
  },
  SYSTEM_OPTION_DEFINITION: {
    title: 'System Option Definitions',
    permissions: ['create', 'delete']
  },
  TAG_GROUP: {
    title: 'Tags and Tag Groups',
    permissions: ['create', 'update', 'delete']
  },
  TAXONOMY: {
    title: 'Taxonomies',
    permissions: ['create']
  },
  TAXONOMY_ENTRY: {
    title: 'Taxonomy Entries',
    permissions: ['create']
  },
  TOKEN_REVOCATION: {
    title: 'Token Revocations',
    permissions: ['create']
  },
  TOKEN: {
    title: 'Tokens',
    permissions: ['read', 'delete']
  },
  USER_CONTEXT: {
    title: 'User Context',
    permissions: ['read']
  },
  USER: {
    title: 'Users',
    permissions: ['read', 'update', 'delete']
  }
}

export default systemIdentityPermissions
