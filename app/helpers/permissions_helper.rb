module PermissionsHelper
  GranulesOptions = [
    ['- Select -', nil],
    ['No Access to Granules', 'no-access'],
    ['All Granules', 'all-granules']
    #['All Granules in Selected Collections','all-granules-in-collections'],
    #['Granules with an Access Constraint Value','access-constraint-granule']
  ]
  CollectionsOptions = [
    ['- Select -', nil],
    ['All Collections','all-collections'],
    ['Selected Collections', 'selected-ids-collections']
  ]

  ErrorCodeMessages = {
      409 => 'This permission could not be created because there is already another permission with the same name.',
      403 => 'You are not authorized to create a permission. Please contact your system administrator.'
  }

  def display_access_constraints(access_value)
    display_text = "Access Constraint Filter: "
    filters = []
    if access_value['min_value'] && access_value['max_value']
      filters << "Match range #{access_value['min_value']} to #{access_value['max_value']}"
    end
    filters << 'Include Undefined' if access_value['include_undefined_value'] == true

    display_text << filters.join(', ')
    display_text
  end

  def hide_granule_constraint_values?
    @granule_access_value.blank? && @granule_options != 'all-granules' ? 'is-hidden' : nil
  end
end
