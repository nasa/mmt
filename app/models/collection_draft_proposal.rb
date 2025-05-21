class CollectionDraftProposal < CollectionDraft
  include AASM
  self.table_name = 'draft_proposals'

  # Proposals must use a different table to track recommendations than Drafts
  # and Templates. We are overwriting the association to use a different class
  # and table, but keeping the association name as it would not be able to be
  # removed, and we can still use the inherited methods
  has_many :keyword_recommendations, class_name: 'ProposalKeywordRecommendation', foreign_key: 'draft_proposal_id', inverse_of: :collection_draft_proposal, dependent: :destroy
  # TODO: we currently allow one to be created, but may allow more in the future
  # should we just make this has_one for now?

  validates :request_type, presence: true
  validates :proposal_status, presence: true

  scope :publish_approved_proposals, -> { select(CollectionDraftProposal.attribute_names - %w[approver_feedback]).where(proposal_status: 'approved') }

  before_create :proposal_mode_enabled?
  before_save :proposal_mode_enabled?
  before_update :proposal_mode_enabled?
  # Need to bypass this before action to delete when publishing while in dev
  before_destroy :proposal_mode_enabled? unless Rails.env.development? || Rails.env.test?

  serialize :status_history, coder: JSON
  serialize :approver_feedback, coder: JSON

  class << self
    def create_request(collection:, user:, provider_id:, native_id:, request_type:, username: nil)
      request = self.create
      request.request_type = request_type
      request.provider_id = provider_id
      request.native_id = native_id
      request.draft = collection
      request.short_name = request.draft['ShortName']
      request.entry_title = request.draft['EntryTitle']
      request.user = user

      if request_type == 'delete'
        request.submit
        request.submitter_id = user.urs_uid
        request.status_history =
          { 'submitted' =>
            { 'username' => username, 'action_date' => Time.new } }
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

    event :mark_done do
      transitions from: :approved, to: :done
    end
  end

  def default_values
    super
    self.status_history ||= {}
    self.approver_feedback ||= {}
  end

  def add_status_history(target, name)
    self.status_history[target] = { 'username' => name, 'action_date' => Time.new }
  end

  def remove_status_history(target)
    self.status_history.delete(target)
  end

  def progress_message(action)
    status = self.status_history.fetch(action, {})
    if status.blank?
      action_time = 'No Date Provided'
      action_username = 'No User Provided'
      unless in_work?
        Rails.logger.error("A #{self.class} with title #{entry_title} and id #{id} is being asked for a status_history for #{action}, but does not have that information. This proposal should be investigated.")
      end
    else
      action_time = status['action_date'].in_time_zone('UTC').to_fs(:default_with_time_zone)
      action_username = status['username']
    end

    action_name = action == 'done' ? 'Published' : action.titleize

    "#{action_name}: #{action_time} By: #{action_username}"
  end

  # MMT need a native_id to publish changes. Either dMMT needs to provide a new
  # unique way of identifying the records or MMT will need to find a unique way
  # to identify them. Doing it this way also enables us to track how many dmmt
  # originated records are in the CMR.
  def set_native_id
    record_type = draft_type.underscore.split('_').first # we should remove 'draft' and 'proposal' from the native_id
    self.native_id ||= "dmmt_#{record_type}_#{id}"
    save
  end

  def change_status_to_done(user)
    self.add_status_history('done', user)
    self.mark_done!
  end

  private

  def provider_required?
    # new (create) proposals do not have a provider
    # but update and delete proposals should have a provider, but from the record it is created from
    false
  end

  def proposal_mode_enabled?
    throw(:abort) unless Rails.configuration.proposal_mode
    true
  end
end
