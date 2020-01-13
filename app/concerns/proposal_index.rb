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
end
