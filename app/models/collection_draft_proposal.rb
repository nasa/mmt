class CollectionDraftProposal < CollectionDraft
  include AASM
  self.table_name = 'draft_proposals'
  validates :request_type, presence: true
  validates :proposal_status, presence: true

  # after_initialize :exception_unless_draft_only
  # after_find :exception_unless_draft_only

  # before_validation :proposal_mode?
  before_create :proposal_mode_enabled?
  before_save :proposal_mode_enabled?
  before_update :proposal_mode_enabled?
  before_destroy :proposal_mode_enabled?

  serialize :status_history, JSON
  serialize :approver_feedback, JSON

  class << self
    def create_request(collection, user, native_id, type, username = nil)
      request = self.create
      request.request_type = type
      request.draft = collection
      request.native_id = native_id
      request.short_name = request.draft['ShortName']
      request.entry_title = request.draft['EntryTitle']
      request.set_user_and_provider(user)

      if type == 'delete'
        request.submit
        request.status_history = { 'submitted' => { 'username' => username, 'action_date' => Time.new.utc.to_s } }
      end

      request.save
      request
    end
  end

  aasm column: 'proposal_status', whiny_transitions: false do
    state :in_work, initial: true
    state :submitted
    state :rejected
    state :approved
    state :done

    event :submit do
      transitions from: :in_work, to: :submitted
    end

    event :rescind do
      transitions from: :submitted, to: :in_work
      transitions from: :rejected, to: :in_work
    end

    event :approve do
      transitions from: :submitted, to: :approved
    end

    event :reject do
      transitions from: :submitted, to: :rejected
    end
  end

  def default_values
    super
    self.status_history ||= {}
    self.approver_feedback ||= {}
  end

  private

  def provider_required?
    # draft proposals do not have a provider
    false
  end

  def proposal_mode_enabled?
    throw(:abort) unless Rails.configuration.proposal_mode
    true
  end

  def exception_unless_draft_only
    # TODO: these require an exception raised to halt execution (see rails guides)
    # documentation says this exception should not bubble up to the user
    # so we should see if we can use this when we start CRUD
    raise ActiveRecord::Rollback unless Rails.configuration.proposal_mode
  end
end
