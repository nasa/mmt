class CollectionDraftProposal < CollectionDraft
  self.table_name = 'draft_proposals'

  # after_initialize :exception_unless_draft_only
  # after_find :exception_unless_draft_only

  before_validation :in_draft_only_mode?
  before_save :in_draft_only_mode?
  before_create :in_draft_only_mode?
  before_update :in_draft_only_mode?
  before_destroy :in_draft_only_mode?


  private

  def provider_required?
    # draft proposals do not have a provider
    false
  end

  def in_draft_only_mode?
    # TODO this will work until we update to Rails 5
    # https://blog.bigbinary.com/2016/02/13/rails-5-does-not-halt-callback-chain-when-false-is-returned.html
    Rails.configuration.is_draft_only ? true : false
  end

  def exception_unless_draft_only
    # TODO: these require an exception raised to halt execution (see rails guides)
    # documentation says this exception should not bubble up to the user
    # so we should see if we can use this when we start CRUD
    raise ActiveRecord::Rollback unless Rails.configuration.is_draft_only
  end
end
