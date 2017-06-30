class SetDraftType < ActiveRecord::Migration
  def up
    Draft.update_all(draft_type: 'CollectionDraft')
  end

  def down
    Draft.update_all(draft_type: nil)
  end
end
