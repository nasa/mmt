# frozen_string_literal: true

module SystemIdentityPermissionsHelper
  ANY_ACL_PERMISSIONS = %w[create read update delete].freeze
  ARCHIVE_RECORD_PERMISSIONS = %w[delete].freeze
  DASHBOARD_ADMIN_PERMISSIONS =  %w[create read update delete].freeze
  DASHBOARD_ARC_CURATOR_PERMISSIONS = %w[create read update delete].freeze
  ERROR_MESSAGE_PERMISSIONS = %w[update].freeze
  EVENT_NOTIFICATION_PERMISSIONS = %w[delete].freeze
  EXTENDED_SERVICE_ACTIVATION_PERMISSIONS = %w[create].freeze
  EXTENDED_SERVICE_PERMISSIONS = %w[delete].freeze
  GROUP_PERMISSIONS = %w[create read].freeze
  INGEST_MANAGEMENT_ACL_PERMISSIONS = %w[read update].freeze
  METRIC_DATA_POINT_SAMPLE_PERMISSIONS = %w[read].freeze
  ORDER_AND_ORDER_ITEMS_PERMISSIONS = %w[read delete].freeze
  PROVIDER_PERMISSIONS = %w[create delete].freeze
  SYSTEM_AUDIT_REPORT_PERMISSIONS = %w[read].freeze
  SYSTEM_CALENDAR_EVENT_PERMISSIONS = %w[create update delete].freeze
  SYSTEM_INITIALIZER_PERMISSIONS = %w[create].freeze
  SYSTEM_OPTION_DEFINITION_DEPRECATION_PERMISSIONS = %w[create].freeze
  SYSTEM_OPTION_DEFINITION_PERMISSIONS = %w[create delete].freeze
  TAG_GROUP_PERMISSIONS = %w[create update delete].freeze
  TAXONOMY_PERMISSIONS = %w[create].freeze
  TAXONOMY_ENTRY_PERMISSIONS = %w[create].freeze
  TOKEN_REVOCATION_PERMISSIONS = %w[create].freeze
  TOKEN_PERMISSIONS = %w[read delete].freeze
  USER_CONTEXT_PERMISSIONS = %w[read].freeze
  USER_PERMISSIONS = %w[read update delete].freeze

  SYSTEM_TARGETS = [
    ['Any ACL', 'ANY_ACL'],
    ['Archive Records', 'ARCHIVE_RECORD'],
    ['CMR Dashboard Admin', 'DASHBOARD_ADMIN'],
    ['CMR Dashboard ARC Curator', 'DASHBOARD_ARC_CURATOR'],
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
