namespace :delete_proposals do
  desc 'Delete proposals that are older than specified date old'
  task expired_proposals: :environment do
    if Rails.configuration.proposal_mode
      proposal_inactivity_limit = ENV['proposal_inactivity_limit'] || 30
      count = CollectionDraftProposal.where("updated_at < '#{proposal_inactivity_limit.to_i.days.ago}'").delete_all
      Rails.logger.info("Automated check for proposals that are #{proposal_inactivity_limit} days old deleted #{count || 0} proposals.")
    end
  end
end
