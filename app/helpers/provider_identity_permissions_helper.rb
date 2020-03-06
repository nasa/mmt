# frozen_string_literal: true

module ProviderIdentityPermissionsHelper
  AUDIT_REPORT_PERMISSIONS = %w[read].freeze
  AUTHENTICATOR_DEFINITION_PERMISSIONS = %w[create delete].freeze
  CATALOG_ITEM_ACL_PERMISSIONS = %w[create read update delete].freeze
  DASHBOARD_DAAC_CURATOR_PERMISSIONS = %w[create read update delete].freeze
  DATA_QUALITY_SUMMARY_ASSIGNMENT_PERMISSIONS = %w[create delete].freeze
  DATA_QUALITY_SUMMARY_DEFINITION_PERMISSIONS = %w[create update delete].freeze
  DATASET_INFORMATION_PERMISSIONS = %w[read].freeze
  EMAIL_SUBSCRIPTION_MANAGEMENT_PERMISSIONS = %w[create read update delete].freeze
  EXTENDED_SERVICE_PERMISSIONS = %w[create update delete].freeze
  GROUP_PERMISSIONS = %w[create read].freeze
  INGEST_MANAGEMENT_ACL_PERMISSIONS = %w[read update].freeze
  NON_NASA_DRAFT_APPROVER_PERMISSIONS = %w[create read update delete].freeze
  NON_NASA_DRAFT_USER_PERMISSIONS = %w[create read update delete].freeze
  OPTION_ASSIGNMENT_PERMISSIONS = %w[create read delete].freeze
  OPTION_DEFINITION_PERMISSIONS = %w[create delete].freeze
  OPTION_DEFINITION_DEPRECATION_PERMISSIONS = %w[create].freeze
  PROVIDER_CALENDAR_EVENT_PERMISSIONS = %w[create update delete].freeze
  PROVIDER_CONTEXT_PERMISSIONS = %w[read].freeze
  PROVIDER_HOLDINGS_PERMISSIONS = %w[read].freeze
  PROVIDER_INFORMATION_PERMISSIONS = %w[update].freeze
  PROVIDER_OBJECT_ACL_PERMISSIONS = %w[create read update delete].freeze
  PROVIDER_ORDER_ACCEPTANCE_PERMISSIONS = %w[create].freeze
  PROVIDER_ORDER_CLOSURE_PERMISSIONS = %w[create].freeze
  PROVIDER_ORDER_REJECTION_PERMISSIONS = %w[create].freeze
  PROVIDER_ORDER_RESUBMISSION_PERMISSIONS = %w[create].freeze
  PROVIDER_ORDER_TRACKING_ID_PERMISSIONS = %w[update].freeze
  PROVIDER_ORDER_PERMISSIONS = %w[read].freeze
  PROVIDER_POLICIES_PERMISSIONS = %w[read update delete].freeze
  USER_PERMISSIONS = %w[read].freeze

  PROVIDER_TARGETS = [
    ['Audit Reports', 'AUDIT_REPORT'],
    ['Authenticator Definitions', 'AUTHENTICATOR_DEFINITION'],
    ['Catalog Item ACLs', 'CATALOG_ITEM_ACL'],
    ['CMR Dashboard DAAC Curator', 'DASHBOARD_DAAC_CURATOR'],
    ['Data Quality Summary Assignments', 'DATA_QUALITY_SUMMARY_ASSIGNMENT'],
    ['Data Quality Summary Definitions', 'DATA_QUALITY_SUMMARY_DEFINITION'],
    ['Dataset Information', 'DATASET_INFORMATION'],
    ['Emain Subscription Management', 'EMAIL_SUBSCRIPTION_MANAGEMENT'],
    ['Extended Services', 'EXTENDED_SERVICE'],
    ['Groups', 'GROUP'],
    ['Ingest Operations', 'INGEST_MANAGEMENT_ACL'],
    ['Non-NASA Draft MMT Approver', 'NON_NASA_DRAFT_APPROVER'],
    ['Non-NASA Draft MMT User', 'NON_NASA_DRAFT_USER'],
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
