module PermissionsHelper
  GranulesOptions = [
    ['- Select -', 'select'],
    ['No Access to Granules', 'no-access'],
    ['All Granules', 'all-granules']
    #['All Granules in Selected Collections','all-granules-in-collections'],
    #['Granules with an Access Constraint Value','access-constraint-granule']
  ]
  CollectionsOptions = [
    ['- Select -', 'select'],
    ['All Collections','all-collections'],
    ['Selected Collections', 'selected-ids-collections']
    #['Collections with an Access Constraint Value', 'access-constraint-collections' ]
  ]

  ErrorCodeMessages = {
      409 => 'This permission could not be created because there is already another permission with the same name.',
      403 => 'You are not authorized to create a permission. Please contact your system administrator.'
  }

  def acl_checkbox(name, value, value_boolean, classes, enable = true)
    if enable
      check_box_tag(name, value, value_boolean, class: classes)
    else
      check_box_tag(name, value, value_boolean, class: classes, disabled: true)
      # check_box_tag(name, value, value_boolean, class: classes,
      #               readonly: true, onclick: "return false;", onkeydown: "return false;")

    end
  end
end
