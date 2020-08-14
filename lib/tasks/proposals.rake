namespace :delete_proposals do
  desc 'Delete proposals that are older than specified date old'
  task expired_proposals: :environment do
    if Rails.configuration.proposal_mode
      count = CollectionDraftProposal.where("updated_at < '#{30.days.ago}'").delete_all
      Rails.logger.info("Automated check for proposals that are 30 days old deleted #{count || 0} proposals.")
    end
  end
end
