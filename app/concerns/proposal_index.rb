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

  # These two methods are being stored here because the logic of their sorts
  # should remain consistent even though they are used in different functions.
  # Any changes to sorting the records should be mirrored in the hash sorting
  # and vice versa
  def sort_records_by_submitter(proposals, user_hash = {})
    @query = {}
    @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

    sorted_proposals = proposals.sort do |a, b|
                         # Making these arrays allows empty submitter_ids to sort last/first for ASC/DESC
                         # Using 0 for 'has submitter id' and 1 for 'does not have submitted id'
                         # allows these to naturally sort last in ASC order, and first in DESC order
                         a_name = user_hash[a.submitter_id] ? [0, user_hash[a.submitter_id]] : [1, user_hash[a.submitter_id]]
                         b_name = user_hash[b.submitter_id] ? [0, user_hash[b.submitter_id]] : [1, user_hash[b.submitter_id]]
                         if params['sort_key'] == 'submitter_id'
                           a_name <=> b_name
                         else
                           b_name <=> a_name
                         end
                       end
    sorted_proposals
  end

  def sort_hashes_by_submitter(proposals,user_hash = {})
    @query = {}
    @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?

    sorted_proposals = proposals.sort do |a, b|
                         # Making these arrays allows empty submitter_ids to sort last/first for ASC/DESC
                         # Using 0 for 'has submitter id' and 1 for 'does not have submitted id'
                         # allows these to naturally sort last in ASC order, and first in DESC order
                         a_name = user_hash[a['submitter_id']] ? [0, user_hash[a['submitter_id']]] : [1, user_hash[a['submitter_id']]]
                         b_name = user_hash[b['submitter_id']] ? [0, user_hash[b['submitter_id']]] : [1, user_hash[b['submitter_id']]]
                         if params['sort_key'] == 'submitter_id'
                           a_name <=> b_name
                         else
                           b_name <=> a_name
                         end
                       end
    sorted_proposals
  end
end
