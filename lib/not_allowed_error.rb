class NotAllowedError < StandardError
  def initialize(method_name)
    Rails.logger.error("#{method_name} was called while in Proposal Mode.  This action is not permitted because it may make changes to the CMR.")
    super('A requested action is not allowed in the current configuration.')
  end
end
