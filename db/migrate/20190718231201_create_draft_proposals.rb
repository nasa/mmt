class CreateDraftProposals < ActiveRecord::Migration
  def change
    create_table :draft_proposals do |t|
      # fields mirroring drafts
      t.integer :user_id
      t.text :draft
      t.string :short_name
      t.string :entry_title
      t.string :provider_id
      t.string :native_id
      t.string :draft_type

      # new fields for draft proposals
      t.string :proposal_status
      t.text :approver_feedback

      t.timestamps null: false
    end
  end
end
