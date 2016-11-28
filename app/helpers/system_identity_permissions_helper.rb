module SystemIdentityPermissionsHelper

  SYSTEM_AUDIT_REPORT_PERMISSIONS = %w(read)
  METRIC_DATA_POINT_SAMPLE_PERMISSIONS = %w(read)
  SYSTEM_INITIALIZER_PERMISSIONS = %w(create)
  ARCHIVE_RECORD_PERMISSIONS = %w(delete)
  ERROR_MESSAGE_PERMISSIONS = %w(update)
  TOKEN_PERMISSIONS = %w(read delete)
  TOKEN_REVOCATION_PERMISSIONS = %w(create)
  EXTENDED_SERVICE_ACTIVATION_PERMISSIONS = %w(create)
  ORDER_AND_ORDER_ITEMS_PERMISSIONS = %w(read delete)
  PROVIDER_PERMISSIONS = %w(create delete)
  TAG_GROUP_PERMISSIONS = %w(create update delete)
  TAXONOMY_PERMISSIONS = %w(create)
  TAXONOMY_ENTRY_PERMISSIONS = %w(create)
  USER_CONTEXT_PERMISSIONS = %w(read)
  USER_PERMISSIONS = %w(read update delete)
  GROUP_PERMISSIONS = %w(create read)
  ANY_ACL_PERMISSIONS = %w(create read update delete)
  EVENT_NOTIFICATION_PERMISSIONS = %w(delete)
  EXTENDED_SERVICE_PERMISSIONS = %w(delete)
  SYSTEM_OPTION_DEFINITION_PERMISSIONS = %w(create delete)
  SYSTEM_OPTION_DEFINITION_DEPRECATION_PERMISSIONS = %w(create)
  INGEST_MANAGEMENT_ACL_PERMISSIONS = %w(read update)
  SYSTEM_CALENDAR_EVENT_PERMISSIONS = %w(create update delete)

  SYSTEM_TARGETS = [
    ['Any ACL', 'ANY_ACL'],
    ['Archive Records', 'ARCHIVE_RECORD'],
    ['Error Messages', 'ERROR_MESSAGE'],
    ['Event Notifications', 'EVENT_NOTIFICATION'],
    ['Extended Service Activation', 'EXTENDED_SERVICE_ACTIVATION'],
    ['Extended Services', 'EXTENDED_SERVICE'],
    ['Groups', 'GROUP'],
    ['Ingest Operations', 'INGEST_MANAGEMENT_ACL'],
    ['Metric Data Point Samples', 'METRIC_DATA_POINT_SAMPLE'],
    ['Orders and Order Items', 'ORDER_AND_ORDER_ITEMS'],
    ['Providers', 'PROVIDER'],
    ['System Audit Reports', 'SYSTEM_AUDIT_REPORT'],
    ['System Calendar Event', 'SYSTEM_CALENDAR_EVENT'],
    ['System Initializer', 'SYSTEM_INITIALIZER'],
    ['System Option Definition Deprecations', 'SYSTEM_OPTION_DEFINITION_DEPRECATION'],
    ['System Option Definitions', 'SYSTEM_OPTION_DEFINITION'],
    ['Tags and Tag Groups', 'TAG_GROUP'],
    ['Taxonomies', 'TAXONOMY'],
    ['Taxonomy Entries', 'TAXONOMY_ENTRY'],
    ['Token Revocations', 'TOKEN_REVOCATION'],
    ['Tokens', 'TOKEN'],
    ['User Context', 'USER_CONTEXT'],
    ['Users', 'USER']
  ]

  PermissionsOptions = %w(create read update delete)

end
