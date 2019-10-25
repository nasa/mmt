module ProposalsHelper
  # For the functions relating to the nodes on the progress page, there are
  # two classes which control the CSS that display the 'graphic' of the progress
  # The node class controls whether the blue dots are faded (this stage hasn't
  # been reached), visible (stage has been completed), or has a ring (current).
  # The line class controls whether the lines are faded and their placement
  # (since the active ones need to be placed slightly lower).

  # Determine what the first node should look like on the progress page
  def submit_node
    # If the proposal has been rejected and has not been submitted,
    # Display the old rejection information.  At the time of the original
    # implementation, this is the only time the active node should display its line
    classes =   if @status_history['rejected'] && @status_history['submitted'].nil?
                  %w[timeline-node-active timeline-line-active]
    # If the proposal is in work or has been submitted, this is the current step
                elsif get_resource.in_work? || get_resource.submitted?
                  %w[timeline-node-active timeline-faded-line-active]
    # Otherwise, it is in some later step and this node should be visible.
                else
                  %w[timeline-node timeline-line]
                end

    content_tag(:div, nil, class: classes)
  end

  # Second node on the progress page
  def review_node
    # This node is the active node when a rejected proposal has not been
    # rescinded
    classes =   if get_resource.rejected?
                  %w[timeline-node-active timeline-faded-line-active]
    # If the proposal has been approved, a later node is active.
                elsif @status_history['approved']
                  %w[timeline-node timeline-line]
    # If this proposal has been rejected, but isn't in the rejected state,
    # this node should be visible, but no progress to the next state is shown
    # (e.g. a faded line)
                elsif @status_history['rejected']
                  %w[timeline-node timeline-faded-line]
                else
                  %w[timeline-faded-node timeline-faded-line]
                end

    content_tag(:div, nil, class: classes)
  end

  # Third node on the progress page
  def approved_node
    # This is the active node if the proposal is approved and not published.
    classes = if get_resource.approved?
                %w[timeline-node-active timeline-faded-line-active]
    # If the status history has an approved entry and it is not currently
    # in that state, then it should be in 'done' and the node and line should
    # be displayed
              elsif @status_history['approved']
                %w[timeline-node timeline-line]
              else
                %w[timeline-faded-node timeline-faded-line]
              end

    content_tag(:div, nil, class: classes)
  end

  # Fourth node on the progress page
  def published_node
    classes = if get_resource.done?
                %w[timeline-node-active]
              else
                %w[timeline-faded-node]
              end

    content_tag(:div, nil, class: classes)
  end

  def rescind_button_text
    get_resource.request_type == 'create' ? 'Cancel Proposal Submission' : "Cancel #{get_resource.request_type.titleize} Request"
  end

  def status_badge_text
    get_resource.request_type == 'create' ? 'Draft Proposal Submission:' : "#{get_resource.request_type.titleize} Metadata Request:"
  end
end
