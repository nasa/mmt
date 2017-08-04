# :nodoc:
class PagesController < ApplicationController
  def new_record
    case params[:type]
    when 'new_collection'
      redirect_to new_collection_draft_path
    when 'new_variable'
      redirect_to new_variable_draft_path
    else
      redirect_to manage_collections_path
    end
  end
end
