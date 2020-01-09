module ProposalsHelper

  REASONS_FOR_REJECTION = [
    'Missing Keywords',
    'Insufficient Content',
    'Misspellings/Grammar',
    'Invalid/Incorrect Content',
    'Broken Links',
    'Duplicate Metadata',
    'Other'
  ].freeze

  # For the functions relating to the nodes on the progress page, there are
  # two classes which control the CSS that display the 'graphic' of the progress
  # The node class controls whether the blue dots are faded (this stage hasn't
  # been reached), visible (stage has been completed), or has a ring (current).
  # The line class controls whether the lines are faded and their placement
  # (since the active ones need to be placed slightly lower).

  # First node on the progress page
  def submit_node
    classes = if get_resource.in_work?
                # If the proposal is in work, this is the current node
                %w[timeline-node-active timeline-line-faded-active]
              elsif get_resource.submitted?
                # If the proposal has been submitted, this is the current node
                # and we want to make the next line active to show it is
                # waiting the next action
                %w[timeline-node-active timeline-line-active]
              else
                # Otherwise, it is in some later step and this node should be visible.
                %w[timeline-node timeline-line]
              end

    content_tag(:div, nil, class: classes)
  end

  # Second node on the progress page
  def review_node
    classes = if get_resource.rejected?
                # This node is the active node when a rejected proposal
                # has not been rescinded
                %w[timeline-node-rejected timeline-line-faded-rejected]
              elsif @status_history['approved']
                # If the proposal has been approved, a later node is active.
                %w[timeline-node timeline-line]
              elsif @status_history['rejected']
                # If this proposal has been rejected, but isn't in the rejected
                # state, this node should be visible, but no progress to the next
                # state is shown (e.g. a faded line)
                %w[timeline-node-faded timeline-line-faded-rejected]
              else
                %w[timeline-node-faded timeline-line-faded]
              end

    content_tag(:div, nil, class: classes)
  end

  # Third node on the progress page
  def approved_node
    classes = if get_resource.approved?
                # This is the active node if the proposal is approved and
                # not published.
                %w[timeline-node-active timeline-line-active]
              elsif @status_history['approved']
                # If the status history has an approved entry and it is
                # not currently in that state, then it should be in 'done'
                # and the node and line should be displayed
                %w[timeline-node timeline-line]
              else
                %w[timeline-node-faded timeline-line-faded]
              end

    content_tag(:div, nil, class: classes)
  end

  # Fourth node on the progress page
  def published_node
    classes = if get_resource.done?
                %w[timeline-node-active]
              else
                %w[timeline-node-faded]
              end

    content_tag(:div, nil, class: classes)
  end

  def state_action_button_text(state)
    get_resource.request_type == 'create' ? "#{state} Proposal Submission" : "#{state} #{get_resource.request_type.titleize} Request"
  end

  def status_badge_text
    get_resource.request_type == 'create' ? 'Draft Proposal Submission:' : "#{get_resource.request_type.titleize} Metadata Request:"
  end

  # Used in the manage proposals page for approvers to generate:
  #   <Status> | <Request Type> for each record.
  def status_content_tag(proposal)
    type = if proposal.draft_type && proposal.draft_type == 'CollectionDraftProposal'
             'Collection'
           else
             ''
           end

    request_type = if proposal.request_type == 'create'
                     'New'
                   else
                     proposal.request_type.titleize
                   end

    content_tag(:span, "#{proposal.proposal_status.titleize} | #{request_type} #{type} Request")
  end

  # Get the text for the 'actions' box on the progress page
  def get_available_actions_text
    if get_resource.in_work?
      'Make additional changes or submit this proposal for approval.'
    elsif @user_has_approver_permissions
      if get_resource.approved?
        'Please visit the Metadata Management Tool for NASA users to finish publishing this metadata.'
      elsif get_resource.done?
        'No actions are possible.'
      end
    elsif get_resource.submitted? || get_resource.rejected?
      'You may cancel this proposal to make additional changes.'
    else
      'No actions are possible.'
    end
  end

  def display_submitter_name(submitter_id)
    @urs_user_hash[submitter_id] || 'Pending'
  end
end
