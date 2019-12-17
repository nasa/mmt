class UpdatePropsalHistoryAndFeedback < ActiveRecord::Migration[4.2]
  def change
    CollectionDraftProposal.where(status_history: nil).update_all(status_history: {})
    CollectionDraftProposal.where(approver_feedback: nil).update_all(approver_feedback: {})
  end
end
