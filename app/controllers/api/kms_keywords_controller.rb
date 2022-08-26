class Api::KmsKeywordsController < BaseDraftsController
  include ManageMetadataHelper

  before_action :proposal_approver_permissions, except: [:show]
  skip_before_action :ensure_user_is_logged_in, only: [:show]
  skip_before_action :add_top_level_breadcrumbs, only: [:show]
  skip_before_action :set_resource, only: [:show]

  def show
    keyword_scheme = params[:id]
    keywords = cmr_client.get_kms_keywords(keyword_scheme)
    render json: keywords
    return
  end
end