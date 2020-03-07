class EmailSubscriptionsController < ManageCmrController
  include UrsUserEndpoints

  before_action :email_subscriptions_enabled?

  def new
    @subscription = {}
    authorize @subscription, policy_class: EmailSubscriptionPolicy
    @subscriber = []

    add_breadcrumb 'New', new_email_subscription_path
  end

  def create
    # query should be passed as `metadata`
    # subscriber urs_uid should be passed as `user_id`
    # subscriber email should be passed as `email_address`
    @subscription = subscription_params
    authorize @subscription, policy_class: EmailSubscriptionPolicy
    # add email from user_id
    @subscription['email_address'] = get_subscriber_email(@subscription['user_id'])

    subscription_response = cmr_client.create_email_subscription(@subscription, token)
    if subscription_response.success?
      # TODO: there is no show page yet, but we should redirect to a show view when it is available
      redirect_to manage_cmr_path, flash: { success: 'Email Subscription was successfully created.'}
    else
      # TODO: when we have a live endpoint, we should log the error and provide
      # an appropriate error message to the user with subscription_response.error_message
      flash[:error] = subscription_response.body['errors'].first

      set_previously_selected_subscriber(@subscription['user_id'])
      render :new
    end
  end

  private

  def subscription_params
    params.require(:subscription).permit(:description, :metadata, :user_id, :email_address) # :subscriber_email)
  end

  def email_subscriptions_enabled?
    redirect_to manage_cmr_path unless Rails.configuration.email_subscriptions_enabled
  end

  def get_subscriber(subscriber_id)
    if subscriber_id
      # subscriber id must be an array for the urs query
      retrieve_urs_users(Array.wrap(subscriber_id))
    else
      []
    end
  end

  def set_previously_selected_subscriber(subscriber_id)
    # setting up the subscriber for the select box option
    @subscriber = get_subscriber(subscriber_id)

    @subscriber.map! { |s| [urs_user_full_name(s), s['uid']] }
  end

  def get_subscriber_email(subscriber_id)
    subscriber = get_subscriber(subscriber_id).fetch(0, {})
    subscriber.fetch('email_address', nil)
  end
end
