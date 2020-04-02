class SubscriptionsController < ManageCmrController
  include UrsUserEndpoints

  RESULTS_PER_PAGE = 25
  before_action :subscriptions_enabled?
  before_action :add_top_level_breadcrumbs

  def index
    authorize :subscription
    subscription_response = cmr_client.get_subscriptions()

    if subscription_response.success?
      @subscriptions = subscription_response.body['items']
    else
      # TODO: when we have a live endpoint, we should log the error and provide
      # an appropriate error message to the user with subscription_response.error_message
      flash[:error] = subscription_response.body['errors'].first
      @subscriptions = []
    end
    @subscriptions = Kaminari.paginate_array(@subscriptions, total_count: @subscriptions.count).page(params.fetch('page', 1)).per(RESULTS_PER_PAGE)
  end

  def new
    authorize :subscription
    @subscription = {}
    @subscriber = []

    add_breadcrumb 'New', new_subscription_path
  end

  def show
    authorize :subscription
    @subscription = subscription_params.merge(params.permit(:id, :native_id))
    user = get_subscriber(@subscription['SubscriberId']).fetch(0, {})
    @user = "#{user['first_name']} #{user['last_name']}"
    @subscription_concept_id = @subscription['id']

    add_breadcrumb @subscription['id'].to_s
  end

  def edit
    authorize :subscription

    @subscription = subscription_params.merge(params.permit(:id, :native_id))
    set_previously_selected_subscriber(@subscription['SubscriberId'])

    add_breadcrumb @subscription['id'].to_s, subscription_path(@subscription['id'], subscription: @subscription, native_id: @subscription['native_id'])
  end

  def create
    authorize :subscription
    @subscription = subscription_params
    @subscription['EmailAddress'] = get_subscriber_email(@subscription['SubscriberId'])
    native_id = "mmt_subscription_#{SecureRandom.uuid}"

    subscription_response = cmr_client.ingest_subscription(@subscription.to_json, current_user.provider_id, native_id, token)
    if subscription_response.success?
      flash[:success] = I18n.t('controllers.subscriptions.create.flash.success')
      redirect_to subscription_path(subscription_response.parsed_body['result']['concept_id'], subscription: @subscription, native_id: native_id)
    else
      Rails.logger.error("Creating a subscription failed with CMR Response: #{subscription_response.clean_inspect}")
      flash[:error] = subscription_response.error_message(i18n: I18n.t('controllers.subscriptions.create.flash.error'))

      set_previously_selected_subscriber(@subscription['SubscriberId'])
      render :new
    end
  end

  def update
    authorize :subscription
    @subscription = subscription_params
    @subscription['EmailAddress'] = get_subscriber_email(@subscription['SubscriberId'])
    native_id = params.permit(:native_id)['native_id']

    subscription_response = cmr_client.ingest_subscription(@subscription.to_json, current_user.provider_id, native_id, token)
    if subscription_response.success?
      flash[:success] = I18n.t('controllers.subscriptions.update.flash.success')
      redirect_to subscription_path(subscription_response.parsed_body['result']['concept_id'], subscription: @subscription, native_id: native_id)
    else
      concept_id = params.permit(:id)['id']
      Rails.logger.error("Updating a subscription failed with CMR Response: #{subscription_response.clean_inspect}")
      flash[:error] = subscription_response.error_message(i18n: I18n.t('controllers.subscriptions.update.flash.success'))

      set_previously_selected_subscriber(@subscription['SubscriberId'])
      redirect_to edit_subscription_path(concept_id, subscription: @subscription, native_id: native_id)
    end
  end

  def destroy
    authorize :subscription

    subscription = subscription_params.merge(params.permit(:id, :native_id))
    delete_response = cmr_client.delete_subscription(current_user.provider_id, subscription['native_id'], token)
    if delete_response.success?
      flash[:success] = I18n.t('controllers.subscriptions.destroy.flash.success')
      redirect_to subscriptions_path
    else
      Rails.logger.error("Failed to delete a subscription.  CMR Response: #{delete_response.clean_inspect}")
      flash[:error] = delete_response.error_message(i18n: I18n.t('controllers.subscriptions.destroy.flash.error'))
      redirect_to subscription_path(subscription[:id], subscription: subscription, native_id: subscription['native_id'])
    end
  end

  private

  def subscription_params
    params.require(:subscription).permit(:Name, :CollectionConceptId, :Query, :SubscriberId, :EmailAddress)
  end

  def subscriptions_enabled?
    redirect_to manage_cmr_path unless Rails.configuration.subscriptions_enabled
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

  def add_top_level_breadcrumbs
    add_breadcrumb 'Subscriptions', subscriptions_path
  end
end
