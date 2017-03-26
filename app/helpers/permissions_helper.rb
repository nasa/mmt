module PermissionsHelper
  CollectionsOptions = [
    ['All Collections', 'all-collections'],
    ['Selected Collections', 'selected-ids-collections'],
    ['No Access to Collections', 'no-access']
    # ['All Collections', 'all_collections'],
    # ['Selected Collections', 'selected_collections'],
    # ['No Access to Collections', 'no_access']
  ].freeze

  GranulesOptions = [
    ['All Granules', 'all-granules'],
    ['No Access to Granules', 'no-access']
    # ['All Granules', 'all_granules'],
    # ['No Access to Granules', 'no_access']
    # ['All Granules in Selected Collections','all-granules-in-collections'],
    # ['Granules with an Access Constraint Value','access-constraint-granule']
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
    # if access_value.blank? || option_value == 'no-access'
    option_value.nil? || option_value == 'no-access' ? 'is-hidden' : nil
  end

  # def hide_granule_constraint_values?(granule_access_value, granule_options)
  #   granule_access_value.blank? && granule_options != 'all-granules' ? 'is-hidden' : nil
  # end
end
