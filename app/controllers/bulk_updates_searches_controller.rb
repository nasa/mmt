# :nodoc:
class BulkUpdatesSearchesController < CmrSearchController
  before_filter :bulk_updates_enabled?

  def new
    add_breadcrumb 'Bulk Update Collection Search', :new_bulk_updates_search_path

    super
  end
end
