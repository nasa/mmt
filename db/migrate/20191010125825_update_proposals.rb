class UpdateProposals < ActiveRecord::Migration
  def change
    add_column 'draft_proposals', :status_history, :text
    add_column 'draft_proposals', :request_type, :string
  end
end
