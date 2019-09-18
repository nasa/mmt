module Helpers
  # :nodoc:
  module ConfigurationHelpers
    def require_launchpad_and_urs_login
      set_required_login_method(launchpad_required: true, urs_required: true)
    end

    def require_launchpad_login
      set_required_login_method(launchpad_required: true, urs_required: false)
    end

    def require_urs_login
      set_required_login_method(launchpad_required: false, urs_required: true)
    end

    def require_no_login_methods
      set_required_login_method(launchpad_required: false, urs_required: false)
    end

    def set_required_login_method(launchpad_required:, urs_required:)
      allow_any_instance_of(ApplicationController).to receive(:launchpad_login_required?).and_return(launchpad_required)
      allow_any_instance_of(ApplicationController).to receive(:urs_login_required?).and_return(urs_required)
    end

    def make_launchpad_button_hidden(hide)
      allow_any_instance_of(ApplicationController).to receive(:hide_launchpad_button?).and_return(hide)
    end

    def set_as_mmt_proper
      allow(Mmt::Application.config).to receive(:proposal_mode).and_return(false)

      # allow_any_instance_of(CollectionDraftProposal).to receive(:exception_unless_draft_only?).and_return(nil)
    end

    def set_as_proposal_mode_mmt(with_required_acl: false)
      allow(Mmt::Application.config).to receive(:proposal_mode).and_return(true)

      if with_required_acl
        # we have tests for checking whether a user has the Non-NASA Draft User ACL
        # to access Draft MMT (proposal mode) and CRUD Collection Draft Proposals
        # but for most of our test for proposal mode, it would be too cumbersome
        # to have to set up the group and ACL in the local CMR
        allow_any_instance_of(PermissionChecking).to receive(:is_non_nasa_draft_user?).and_return(true)
      end

      # allow_any_instance_of(CollectionDraftProposal).to receive(:exception_unless_draft_only?).and_return(raise ActiveRecord::Rollback) # can this raise an exception?
    end
  end
end
