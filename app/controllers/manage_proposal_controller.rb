class ManageProposalController < ManageMetadataController
  before_action :mmt_approver_workflow_enabled?
  before_action :user_has_approver_permissions?

  RESULTS_PER_PAGE = 25

  def show
    @specified_url = 'manage_proposals'

    # make request to get approved proposals

    sort_key, sort_dir = index_sort_order
    # TODO: When we have the end points set up, this will probably be receiving
    # a JSON blob that gets converted to an array of records. If this is true,
    # dummy_data should be replacable with that array.

    response = cmr_client.dmmt_get_approved_proposals({'param1' => 'stuff'}, token)
    puts ">>>>>>>>>>>>>>>>> #{response.body.count}"

    proposals = if sort_dir == 'ASC'
                  response.body.sort { |a, b| a[sort_key] <=> b[sort_key] }
                else
                  response.body.sort { |a, b| b[sort_key] <=> a[sort_key] }
                end

    @proposals = Kaminari.paginate_array(proposals, total_count: proposals.count).page(params.fetch('page', 1)).per(RESULTS_PER_PAGE)
  end

  private

  # TODO: This should be removed by the end of MMT-1974
  def dummy_data
    data = []
    51.times do |i|
      data << { 'short_name' => "Short Name: #{i}", 'entry_title' => "Entry Title: #{i}", 'proposal_status' => 'approved', 'request_type' => i.even? ? 'create' : 'delete', 'updated_at' => Time.now }
    end
    data
  end

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
end
