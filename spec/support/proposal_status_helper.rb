# A series of helper functions designed to manipulate the status of
# proposals for testing dMMT.  If you pass the result of a factory_girl create,
# they will update the record's proposal_status, status_history, and
# approver_feedback and save. These bypass all validation, but are handy to test
# failure conditions by changing a record after a button has been loaded, thus
# invalidating the button's intended transition.

module Helpers
  module ProposalStatusHelper
    def mock_submit(record)
      record.proposal_status = 'submitted'
      record.status_history = { 'submitted' => { 'username' => 'TestUser1', 'action_date' => '2019-10-11 01:00' } }
      record.approver_feedback = {}
      record.save
    end

    def mock_approve(record)
      record.proposal_status = 'approved'
      record.status_history = { 'submitted' => { 'username' => 'TestUser1', 'action_date' => '2019-10-11 01:00' }, 'approved' => { 'username' => 'TestUser2', 'action_date' => '2019-10-11 02:00' } }
      record.approver_feedback = {}
      record.save
    end

    def mock_reject(record)
      record.proposal_status = 'rejected'
      record.status_history = { 'submitted' => { 'username' => 'TestUser1', 'action_date' => '2019-10-11 01:00' }, 'rejected' => { 'username' => 'TestUser3', 'action_date' => '2019-10-11 03:00' } }
      record.approver_feedback = { 'rejection_reason' => 'TestReason' }
      record.save
    end

    def mock_rescind(record)
      record.proposal_status = 'in_work'
      record.status_history = { 'rejected' => { 'username' => 'TestUser3', 'action_date' => '2019-10-11 03:00' } }
      record.approver_feedback = { 'rejection_reason' => 'TestReason' }
      record.save
    end

    def mock_publish(record)
      record.proposal_status = 'done'
      record.status_history = { 'submitted' => { 'username' => 'TestUser1', 'action_date' => '2019-10-11 01:00' }, 'approved' => { 'username' => 'TestUser2', 'action_date' => '2019-10-11 02:00' }, 'done' => { 'username' => 'TestUser4', 'action_date' => '2019-10-11 04:00' } }
      record.approver_feedback = {}
      record.save
    end
  end
end
