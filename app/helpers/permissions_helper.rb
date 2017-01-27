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
    #['Collections with an Access Constraint Value', 'access-constraint-collections' ]
  ]

  ErrorCodeMessages = {
      409 => 'This permission could not be created because there is already another permission with the same name.',
      403 => 'You are not authorized to create a permission. Please contact your system administrator.'
  }

  def display_access_constraints(access_value) # want 'type' for Collection/Granule?
    display_text = "Access Constraint Filter: "
    filters = []
    if access_value['min_value'] && access_value['max_value']
      range = "Match range #{access_value['min_value']} to #{access_value['max_value']}"
            # else
            #   'no'
      filters << range
    end
    # match_undefined = access_value['include_undefined_value'] == 'true' ? 'yes' : nil
    filters << 'Include Undefined' if access_value['include_undefined_value'] == true
    # fail

    display_text << filters.join(', ')
    display_text
  end
end
