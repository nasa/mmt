module ProviderIdentityPermissionsHelper
  AUDIT_REPORT_PERMISSIONS = %w(read)
  OPTION_ASSIGNMENT_PERMISSIONS = %w(create read delete)
  OPTION_DEFINITION_PERMISSIONS = %w(create delete)
  OPTION_DEFINITION_DEPRECATION_PERMISSIONS = %w(create)
  DATASET_INFORMATION_PERMISSIONS = %w(read)
  PROVIDER_HOLDINGS_PERMISSIONS = %w(read)
  EXTENDED_SERVICE_PERMISSIONS = %w(create update delete)
  PROVIDER_ORDER_PERMISSIONS = %w(read)
  PROVIDER_ORDER_RESUBMISSION_PERMISSIONS = %w(create)
  PROVIDER_ORDER_ACCEPTANCE_PERMISSIONS = %w(create)
  PROVIDER_ORDER_REJECTION_PERMISSIONS = %w(create)
  PROVIDER_ORDER_CLOSURE_PERMISSIONS = %w(create)
  PROVIDER_ORDER_TRACKING_ID_PERMISSIONS = %w(update)
  PROVIDER_INFORMATION_PERMISSIONS = %w(update)
  PROVIDER_CONTEXT_PERMISSIONS = %w(read)
  AUTHENTICATOR_DEFINITION_PERMISSIONS = %w(create delete)
  PROVIDER_POLICIES_PERMISSIONS = %w(read update delete)
  USER_PERMISSIONS = %w(read)
  GROUP_PERMISSIONS = %w(create read)
  PROVIDER_OBJECT_ACL_PERMISSIONS = %w(create read update delete)
  CATALOG_ITEM_ACL_PERMISSIONS = %w(create read update delete)
  INGEST_MANAGEMENT_ACL_PERMISSIONS = %w(read update)
  DATA_QUALITY_SUMMARY_DEFINITION_PERMISSIONS = %w(create update delete)
  DATA_QUALITY_SUMMARY_ASSIGNMENT_PERMISSIONS = %w(create delete)
  PROVIDER_CALENDAR_EVENT_PERMISSIONS = %w(create update delete)

  PROVIDER_TARGETS = [
    ['Audit Reports', 'AUDIT_REPORT'],
    ['Authenticator Definitions', 'AUTHENTICATOR_DEFINITION'],
    ['Catalog Item ACLs', 'CATALOG_ITEM_ACL'],
    ['Data Quality Summary Assignments', 'DATA_QUALITY_SUMMARY_ASSIGNMENT'],
    ['Data Quality Summary Definitions', 'DATA_QUALITY_SUMMARY_DEFINITION'],
    ['Dataset Information', 'DATASET_INFORMATION'],
    ['Extended Services', 'EXTENDED_SERVICE'],
    ['Groups', 'GROUP'],
    ['Ingest Operations', 'INGEST_MANAGEMENT_ACL'],
    ['Option Assignments', 'OPTION_ASSIGNMENT'],
    ['Option Definition Deprecations', 'OPTION_DEFINITION_DEPRECATION'],
    ['Option Definitions', 'OPTION_DEFINITION'],
    ['Provider Calendar Event', 'PROVIDER_CALENDAR_EVENT'],
    ['Provider Context', 'PROVIDER_CONTEXT'],
    ['Provider Holdings', 'PROVIDER_HOLDINGS'],
    ['Provider Information', 'PROVIDER_INFORMATION'],
    ['Provider Object ACLs', 'PROVIDER_OBJECT_ACL'],
    ['Provider Order Acceptances', 'PROVIDER_ORDER_ACCEPTANCE'],
    ['Provider Order Closures', 'PROVIDER_ORDER_CLOSURE'],
    ['Provider Order Rejections', 'PROVIDER_ORDER_REJECTION'],
    ['Provider Order Resubmissions', 'PROVIDER_ORDER_RESUBMISSION'],
    ['Provider Order Tracking IDs', 'PROVIDER_ORDER_TRACKING_ID'],
    ['Provider Orders', 'PROVIDER_ORDER'],
    ['Provider Policies', 'PROVIDER_POLICIES'],
    ['Users', 'USER']
  ]

  PermissionsOptions = %w(create read update delete)
end
