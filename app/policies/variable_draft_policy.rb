# :nodoc:
class VariableDraftPolicy < DraftPolicy
  def update_associated_collection?
    update?
  end
end
