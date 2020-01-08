# Helper methods used in both dMMT and MMT to help display proposal lists

module ProposalIndex
  extend ActiveSupport::Concern
  include GroupEndpoints

  # Pass in an array of proposals to extract and query URS for user names
  # set a variable for use in other functions/views
  def set_urs_user_hash(proposals)
    submitters = proposals.map { |proposal| proposal['submitter_id'] }.uniq
    urs_users = retrieve_urs_users(submitters)
    @urs_user_hash = {}
    urs_users.each do |user|
      @urs_user_hash[user['uid']] = "#{user['first_name']} #{user['last_name']}"
    end
  end

  def sort_by_submitter(proposals)
    @query = {}
    @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

    sorted_proposals = proposals.all.sort do |a, b|
                         # Making these arrays allows empty submitter_ids to sort last/first for ASC/DESC
                         a_name = @urs_user_hash[a.submitter_id] ? [0, @urs_user_hash[a.submitter_id]] : [1, @urs_user_hash[a.submitter_id]]
                         b_name = @urs_user_hash[b.submitter_id] ? [0, @urs_user_hash[b.submitter_id]] : [1, @urs_user_hash[b.submitter_id]]
                         if params['sort_key'] == 'submitter_id'
                           a_name <=> b_name
                         else
                           b_name <=> a_name
                         end
                       end
    sorted_proposals
  end
end
