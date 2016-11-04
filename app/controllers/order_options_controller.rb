class OrderOptionsController < ApplicationController

  def index
  end

  def new
    @order_option = {}
  end

  def create

    @order_option = params[:order_option]
    @order_option.delete(:sort_key) if @order_option[:sort_key].blank?

    # using ECHO SOAP Authenticate, temporarily
    password = '' # for now, need to add in your password to get Echo Token
    token_response = echo_client.login(session[:urs_uid], password, behalfOfProvider: @current_user.provider_id, clientInfo: {UserIpAddress: request.remote_ip}).body # .fetch(:login_response, {}).fetch(:result)
    body_hash = Hash.from_xml(token_response)

    if ! body_hash['Envelope']['Body']['Fault'].nil?
      errorMessage = body_hash['Envelope']['Body']['Fault']['detail']['AuthorizationFault']['SystemMessage']
      flash.now[:error] = errorMessage
      render :new
      return
    end


    echo_security_token = body_hash['Envelope']['Body']['LoginResponse']['result']

    response = temp_response = cmr_client.create_order_option(@order_option, echo_security_token)

    # TODO when guid option is created, use guid
    # provider_guid = get_provider_guid(@current_user.provider_id)
    # response = cmr_client.create_order_option(@order_option, token)
    if response.success?
      flash[:success] = 'Order Option was successfully created.'

      order_option_response = Hash.from_xml(response.body)
      order_option_id = order_option_response['option_definition']['id']

      redirect_to order_option_path(order_option_id)
    else
      Rails.logger.error("Create Order Option Error: #{response.inspect}")
      # TODO error parses into array. should change flash render to handle array?
      parsed_errors = Hash.from_xml(response.body)
      flash.now[:error] = parsed_errors['errors']['error'].inspect
      render :new
    end
  end

  def show
    order_option_id = params[:id]

    response = cmr_client.get_order_option(order_option_id, token)
    if response.success?
      @order_option = Hash.from_xml(response.body)['option_definition']
    else
      Rails.logger.error("Get Order Option Definition Error: #{response.inspect}")

      parsed_errors = Hash.from_xml(response.body)
      flash[:error] = parsed_errors['errors']['error'].inspect
      redirect_to order_options_path
    end
  end
end
