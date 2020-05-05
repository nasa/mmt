class SubscriptionsController < ManageCmrController
  include UrsUserEndpoints
  include CMRSubscriptions

  RESULTS_PER_PAGE = 25
  before_action :subscriptions_enabled?
  before_action :add_top_level_breadcrumbs
  before_action :fetch_subscription, only: %i[show edit update destroy]

  def index
    authorize :subscription
    subscription_response = cmr_client.get_subscriptions({ 'provider_id' => current_user.provider_id }, token)
    if subscription_response.success?
      @subscriptions = subscription_response.body.fetch('items', []).map do |item|
        subscription = item['umm']
        subscription['ConceptId'] = item['meta']['concept-id']
        subscription
      end
    else
      Rails.logger.error("Error while retrieving subscriptions for #{current_user} in #{current_user.provider_id}; CMR Response: #{subscription_response.clean_inspect}")
      flash[:error] = subscription_response.error_message
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

    user = get_subscriber(@subscription['SubscriberId']).fetch(0, {})
    @user = "#{user['first_name']} #{user['last_name']}"
    add_breadcrumb @concept_id.to_s
  end

  def edit
    authorize :subscription

    set_previously_selected_subscriber(@subscription['SubscriberId'])
    add_breadcrumb @concept_id.to_s, subscription_path(@concept_id)
  end

  def create
    authorize :subscription
    @subscription = subscription_params
    @subscription['EmailAddress'] = get_subscriber_email(@subscription['SubscriberId'])
    native_id = "mmt_subscription_#{SecureRandom.uuid}"

    subscription_response = cmr_client.ingest_subscription(@subscription.to_json, current_user.provider_id, native_id, token)
    if subscription_response.success?
      subscription_response_result = subscription_response.parsed_body.fetch('result', {})
      flash[:success] = I18n.t('controllers.subscriptions.create.flash.success')
      redirect_to subscription_path(subscription_response_result.fetch('concept_id', ''), revision_id: subscription_response_result.fetch('revision_id', ''))
    else
      Rails.logger.error("Creating a subscription failed with CMR Response: #{subscription_response.clean_inspect}")
      flash[:error] = subscription_response.error_message(i18n: I18n.t('controllers.subscriptions.create.flash.error'))

      set_previously_selected_subscriber(@subscription['SubscriberId'])
      render :new
    end
  end

  def update
    authorize :subscription
    # Overwrite the old subscription with the new values
    subscription_from_form = subscription_params
    @subscription['Query'] = subscription_from_form['Query']
    @subscription['Name'] = subscription_from_form['Name']

    subscription_response = cmr_client.ingest_subscription(@subscription.to_json, current_user.provider_id, @native_id, token)
    if subscription_response.success?
      subscription_response_result = subscription_response.parsed_body.fetch('result', {})
      flash[:success] = I18n.t('controllers.subscriptions.update.flash.success')
      redirect_to subscription_path(subscription_response_result.fetch('concept_id', ''), revision_id: subscription_response_result.fetch('revision_id', ''))
    else
      Rails.logger.error("Updating a subscription failed with CMR Response: #{subscription_response.clean_inspect}")
      flash[:error] = subscription_response.error_message(i18n: I18n.t('controllers.subscriptions.update.flash.success'))

      set_previously_selected_subscriber(@subscription['SubscriberId'])
      render :edit
    end
  end

  def destroy
    authorize :subscription

    delete_response = cmr_client.delete_subscription(current_user.provider_id, @native_id, token)
    if delete_response.success?
      flash[:success] = I18n.t('controllers.subscriptions.destroy.flash.success')
      redirect_to subscriptions_path
    else
      Rails.logger.error("Failed to delete a subscription.  CMR Response: #{delete_response.clean_inspect}")
      flash[:error] = delete_response.error_message(i18n: I18n.t('controllers.subscriptions.destroy.flash.error'))
      redirect_to subscription_path(@concept_id)
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

  def fetch_subscription
    permitted_params = params.permit(:id, :revision_id)
    @concept_id = permitted_params['id']

    subscription = get_latest_revision(@concept_id, permitted_params['revision_id'] || 0)

    if subscription
      @subscription = subscription.fetch('umm', {})
      @native_id = subscription.fetch('meta', {}).fetch('native-id', '')
      @revision_id = subscription.fetch('meta', {}).fetch('revision-id', '')
    else
      Rails.logger.info("Could not find subscription after trying to get the latest revision, before #{params.permit(:action)['action']}")
      flash[:error] = 'This subscription is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this subscription.'
      redirect_to subscriptions_path
      return
    end
  end

  # Subscriptions pages authorize to display, so if a user winds up in a place
  # where they are not allowed to return to the referrer, we need to direct them
  # some place they can actually load. Observed case: changing providers to a
  # provider in which they did not have permissions.
  def user_not_authorized(exception)
    policy_name = exception.policy.class.to_s.underscore

    flash[:error] = I18n.t("#{policy_name}.#{exception.query}", scope: 'pundit', default: :default)
    redirect_to(policy(:subscription).index? ? subscriptions_path : manage_cmr_path)
  end
end
