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
  # 401 comes in as {"errors"=>["Permission to create ACL is denied"]}

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
end
