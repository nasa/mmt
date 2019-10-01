class CollectionDraftProposal < CollectionDraft
  include AASM
  self.table_name = 'draft_proposals'

  # after_initialize :exception_unless_draft_only
  # after_find :exception_unless_draft_only

  # before_validation :proposal_mode?
  before_create :proposal_mode_enabled?
  before_save :proposal_mode_enabled?
  before_update :proposal_mode_enabled?
  before_destroy :proposal_mode_enabled?

  aasm column: 'proposal_status', whiny_transitions: false do
    state :in_work, initial: true
    # When this state is enabled, uncomment a test in spec/features/proposal/collection_draft_proposals/collection_draft_proposals_destroy_spec.rb
    # state :submitted
  end

  private

  def provider_required?
    # draft proposals do not have a provider
    false
  end

  def proposal_mode_enabled?
    # TODO this will work until we update to Rails 5
    # https://blog.bigbinary.com/2016/02/13/rails-5-does-not-halt-callback-chain-when-false-is-returned.html
    Rails.configuration.proposal_mode
  end

  def exception_unless_draft_only
    # TODO: these require an exception raised to halt execution (see rails guides)
    # documentation says this exception should not bubble up to the user
    # so we should see if we can use this when we start CRUD
    raise ActiveRecord::Rollback unless Rails.configuration.proposal_mode
  end
end
