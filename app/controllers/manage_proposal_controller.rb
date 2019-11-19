class ManageProposalController < ManageMetadataController
  before_action :mmt_approver_workflow_enabled?
  before_action :user_has_approver_permissions?

  RESULTS_PER_PAGE = 25

  def show
    @specified_url = 'manage_proposals'

    # TODO: By the end of MMT-1916, this should no longer be necessary.
    # dMMT cannot verify a launchpad token and we do not consider launchpad
    # access to dMMT features to be MVP.
    if session[:access_token].blank?
      @proposals = []
      flash[:error] = 'Please log in with Earthdata Login to perform proposal approver actions in MMT.'
      return
    end

    sort_key, sort_dir = index_sort_order
    dmmt_response = cmr_client.dmmt_get_approved_proposals({}, token, request)

    if dmmt_response.success?
      Rails.logger.info("MMT successfully received approved proposals from dMMT at #{current_user.urs_uid}'s request.")

      proposals = if sort_key == 'user_name'
                    if sort_dir == 'ASC'
                      dmmt_response.body['proposals'].sort { |a, b| a['status_history'].fetch('submitted', {}).fetch('username', '') <=> b['status_history'].fetch('submitted', {}).fetch('username', '') }
                    else
                      dmmt_response.body['proposals'].sort { |a, b| b['status_history'].fetch('submitted', {}).fetch('username', '') <=> a['status_history'].fetch('submitted', {}).fetch('username', '') }
                    end
                  else
                    if sort_dir == 'ASC'
                      dmmt_response.body['proposals'].sort { |a, b| a[sort_key] <=> b[sort_key] }
                    else
                      dmmt_response.body['proposals'].sort { |a, b| b[sort_key] <=> a[sort_key] }
                    end
                  end
    else
      if unauthorized?(dmmt_response)
        flash[:error] = "Your token could not be authorized. Please try refreshing the page before contacting #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')} about #{request.uuid}."
        Rails.logger.error("#{request.uuid}: A user who was logged in with Non-NASA draft approver privileges was not authenticated or authorized correctly.  Refer to dMMT logs for further information: #{dmmt_response.body['request_id']}")
      else
        flash[:error] = "An internal error has occurred. Please contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')} about #{request.uuid} for further assitance."
        Rails.logger.error("#{request.uuid}: MMT has a bug or dMMT is not configured correctly.  Request to dMMT returned https code: #{dmmt_response.status}")
      end
      proposals = []
    end
    @proposals = Kaminari.paginate_array(proposals, total_count: proposals.count).page(params.fetch('page', 1)).per(RESULTS_PER_PAGE)
  end

  private

  def index_sort_order
    @query = {}
    @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

    if @query['sort_key']&.starts_with?('-')
      [@query['sort_key'].delete_prefix('-'), 'DESC']
    elsif @query['sort_key'].present?
      [@query['sort_key'], 'ASC']
    else
      ['updated_at', 'DESC']
    end
  end

  def user_has_approver_permissions?
    redirect_to manage_collections_path unless @user_has_approver_permissions
  end

  def unauthorized?(response)
    response.status == 401
  end
end
