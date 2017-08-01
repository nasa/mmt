# :nodoc:
class PagesController < ApplicationController
  def new_record
    case params[:type]
    when 'new_collection'
      redirect_to new_collection_draft_path
    else
      redirect_to manage_collections_path
    end
  end
end
