# :nodoc:
class VariableGenerationProcessesSearchesController < CmrSearchController
  before_action :uvg_enabled?

  def new
    add_breadcrumb 'Variable Generation Process Collection Search', :new_variable_generation_processes_search_path

    # get a collection concept id if it is there
    super
  end

  def edit
    # can we modify so that edit can be used instead?
  end
end
