class UmmT10To11 < ActiveRecord::Migration[5.2]
  def up
    tool_drafts = ToolDraft.all
    tool_drafts.each do |tool_draft|
      tool_draft.draft.delete('SearchAction')
    end
  end

  def down
    tool_drafts = ToolDraft.all
    tool_drafts.each do |tool_draft|
      tool_draft.draft.delete('PotentialAction')
    end
  end
end
