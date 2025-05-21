class SubscriptionsController < ManageCmrController
  include UrsUserEndpoints
  include CmrSubscriptions

  before_action :subscriptions_enabled?
  before_action :add_top_level_breadcrumbs
  before_action :fetch_subscription, only: %i[show edit update destroy]

  skip_before_action :proposal_approver_permissions, only: [:estimate_notifications]

  DAY_IN_SECONDS = 86_400
  RESULTS_PER_PAGE = 25

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
    @user_email = user.fetch('email_address', nil)
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

  def native_id
    "mmt_subscription_#{SecureRandom.uuid}"
  end

  def update
    authorize :subscription
    # Overwrite the old subscription with the new values
    # Per business rules, only the Query and Name are allowed to be updated for
    # a subscription. As of MMT-2093, CMR does not enforce this.
    subscription_from_form = subscription_params
    @subscription['Query'] = subscription_from_form['Query']
    @subscription['Name'] = subscription_from_form['Name']

    # Remove Email address from being sent to CMR
    @subscription.delete('EmailAddress')

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

  def estimate_notifications
    authorize :subscription

    subscription = subscription_params
    render plain: 'This query cannot be tested because it is missing a parameter, please make sure all of the fields are filled in.', status: :bad_request and return if subscription['SubscriberId'].blank? || subscription['CollectionConceptId'].blank? || subscription['Query'].blank?

    collection_permission_response = cmr_client.check_user_permissions({ concept_id: subscription['CollectionConceptId'], user_id: subscription['SubscriberId'] }, token)
    if collection_permission_response.success? && JSON.parse(collection_permission_response.body)[subscription['CollectionConceptId']].include?('read')
      granule_search_response = cmr_client.test_query(prepare_query_for_test(subscription['CollectionConceptId'], subscription['Query']), token)

      if granule_search_response.success?
        granules_found = granule_search_response.body['hits']
        frequency = (Rails.configuration.cmr_email_frequency / 3600.0).ceil(2)
        frequency = frequency.to_i if frequency.to_i == frequency.to_f
        return_json = {
          'estimate' => "Estimate: #{emails_per_day(granules_found)} #{'notification'.pluralize(emails_per_day(granules_found))}/day",
          'granules' => "#{granules_found} granules related to this query were added or updated over the last 30 days.",
          'frequency' => "Notification service checks for new or updated granules once every #{frequency} #{frequency > 1 ? 'hours' : 'hour'}."
        }.to_json
        render json: return_json
      else
        render plain: "An error occurred while searching for granules: #{granule_search_response.error_message}", status: :internal_server_error
      end
    elsif collection_permission_response.success?
      render plain: 'The subscriber does not have access to the specified collection.', status: :unauthorized
    else
      render plain: "An error occurred while checking the user's permissions: #{collection_permission_response.error_message}", status: :internal_server_error
    end
  end

  private

  def subscription_params
    params.require(:subscription).permit(:Name, :CollectionConceptId, :Query, :SubscriberId)
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

  def prepare_query_for_test(concept_id, query)
    # revision_date[]=<some date>, is the same as updated_since=<same date>
    # if both a revision_date and updated_since are passed, CMR uses the more
    # restrictive, but if two sets of revision dates are passed, both are
    # permitted.
    query.slice!(0) if query[0] == '?'
    terms = query.split('&')
    terms.select! do |term|
      subterms = term.split('=')
      !subterms[0].include?('updated_since') && !subterms[0].include?('revision_date')
    end

    prepend = "collection_concept_id=#{concept_id}&updated_since=#{30.days.ago.strftime('%FT%TZ')}"
    "#{prepend}&#{terms.join('&')}"
  end

  # Wild guess at emails per day based on the assumption that the granules are
  # evenly distributed over the time period.
  def emails_per_day(granules)
    # If granules > seconds in 30 days / e-mail increment, return max per day
    if granules > DAY_IN_SECONDS * 30 / Rails.configuration.cmr_email_frequency
      (DAY_IN_SECONDS / Rails.configuration.cmr_email_frequency).ceil
    else
      # if there aren't enough granules to saturate the bins, each granule is
      # generating an e-mail.
      (granules / 30.0).ceil
    end
  end
end
