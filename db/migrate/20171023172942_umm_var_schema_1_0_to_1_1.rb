class UmmVarSchema10To11 < ActiveRecord::Migration
  def up
    Draft.where(draft_type: 'VariableDraft').find_each do |d|
      d.draft.delete('Services') if d.draft && d.draft.key?('Services')

      d.save
    end
  end
end
