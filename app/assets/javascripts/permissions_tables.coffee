$(document).ready ->
  if $('.permissions-management-table').length > 0
    $('.permissions-management-table').tablesorter
      sortList: [[0,0]]
      headers:
        1:
          sorter: false
        2:
          sorter: false
        3:
          sorter: false
        4:
          sorter: false
