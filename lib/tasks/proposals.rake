namespace :delete_proposals do
  desc 'Delete proposals that are older than specified date old'
  task expired_proposals: :environment do
    count = CollectionDraftProposal.delete_all("proposal_status = 'in_work' AND updated_at < '#{30.days.ago}'") if Rails.configuration.proposal_mode
    Rails.logger.info("Automated check for proposals that are 'in_work' and 30 days old deleted #{count || 0} proposals.")
  end
end
