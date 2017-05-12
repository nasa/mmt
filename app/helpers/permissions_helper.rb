module PermissionsHelper
  CollectionsOptions = [
    ['All Collections', 'all-collections'],
    ['Selected Collections', 'selected-ids-collections'],
    ['No Access to Collections', 'no-access']
  ].freeze

  GranulesOptions = [
    ['All Granules', 'all-granules'],
    ['No Access to Granules', 'no-access']
  ].freeze

  ErrorCodeMessages = {
    409 => 'This permission could not be created because there is already another permission with the same name.',
    403 => 'You are not authorized to create a permission. Please contact your system administrator.'
  }.freeze

  def display_access_constraints(access_value)
    display_text = 'Access Constraint Filter: '

    filters = []
    if access_value['min_value'] && access_value['max_value']
      filters << "Match range #{access_value['min_value']} to #{access_value['max_value']}"
    end
    filters << 'Include Undefined' if access_value['include_undefined_value'] == true

    display_text << filters.join(', ')
    display_text
  end

  def hide_access_constraint_values?(option_value)
    option_value.nil? || option_value == 'no-access' ? 'is-hidden' : nil
  end
end
