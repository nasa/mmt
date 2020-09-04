# :nodoc:
class VariableGenerationProcessesSearchesController < CmrSearchController
  before_action :uvg_enabled?

  def new
    add_breadcrumb 'Variable Generation Process Collection Search', :new_variable_generation_processes_search_path

    super
  end
end
