class Api::CmrKeywordsController < BaseDraftsController
  include ManageMetadataHelper

  before_action :proposal_approver_permissions, except: [:show]
  skip_before_action :ensure_user_is_logged_in, only: [:show]
  skip_before_action :add_top_level_breadcrumbs, only: [:show]
  skip_before_action :set_resource, only: [:show]

  def fetch(keyword_scheme)
    response = cmr_client.get_controlled_keywords(keyword_scheme)
    if response.success?
      response.body
    else
      []
    end
  end

  def show
    keyword_scheme = params[:id]
    keywords = fetch(keyword_scheme)
    render json: JSON.pretty_generate(keywords)
  end
end
