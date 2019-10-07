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
    state :submitted

    event :submit do
      transitions from: :in_work, to: :submitted
    end

    event :rescind do
      transitions from: :submitted, to: :in_work
    end
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
