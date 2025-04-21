module ManageCmr
  # :nodoc:
  class OrdersController < ManageCmrController
    include LogTimeSpentHelper
    add_breadcrumb 'Track Orders', :orders_path

    def index
      logger.tagged("#{current_user.urs_uid} #{controller_name}_controller") do
        Rails.logger.info "User #{current_user.urs_uid} is starting a Track Orders search"

        render :index
      end
    end

    def show
      show_order
    end

    def search
      search_order
    end

    def resubmit
      old_order_id = params['id']
      response = cmr_client.resubmit_order(token, old_order_id)
      if response.error?
        Rails.logger.error("#{request.uuid} - OrdersController#resubmit_order - Resubmit Order Error: #{response.clean_inspect}")
        err_message = "#{response.error_message}.  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to(Rails.configuration.support_email, 'Earthdata Support')}"
        flash[:error] = err_message
        redirect_to order_path(old_order_id) and return
      end
      new_order_id = response.body.fetch('data', {}).fetch('resubmitOrder', {}).fetch('id', '')
      success_message = "Order successfully resubmitted. New order GUID is #{new_order_id}"
      Rails.logger.info success_message
      flash[:success] = success_message
      redirect_to order_path(new_order_id)
    end

    private

    def show_order
      @cmr_client_get_order = cmr_client.get_order(token, params['id'])
      response = @cmr_client_get_order
      if response.errors
        Rails.logger.error("#{request.uuid} - OrdersController#show_order - Search Order Error: #{response.clean_inspect}")
        err_message = "#{response.error_message}.  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to(Rails.configuration.support_email, 'Earthdata Support')}"
        flash[:error] = err_message
        render :index
      end
      @order = response.body.fetch('data', {}).fetch('order', {})
      add_breadcrumb @order.fetch('id'), order_path(@order.fetch('id'))
      render :show
    end

    def search_order
      single_order_search = params['order_guid'].present?
      response = if single_order_search
                  cmr_client.get_order(token, params['order_guid'])
                else
                  payload = {
                    'ursId' => params['user_id'],
                    'states' => (params['states'] || OrdersHelper::ORDER_STATES),
                    'dateType' => params['date_type'],
                    'startDate' => params['from_date'],
                    'endDate' => params['to_date']
                  }
                  cmr_client.get_orders(token, current_user.provider_id, payload)
                end
      if response.errors
        Rails.logger.error("#{request.uuid} - OrdersController#search_order - Search Order Error: #{response.clean_inspect}")
        err_message = "#{response.error_message}.  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to(Rails.configuration.support_email, 'Earthdata Support')}"
        flash[:error] = err_message
        @orders = []
        return
      end
      if single_order_search
        @orders = Array.wrap(response.body.fetch('data', {}).fetch('order', {}))
      else
        @orders = response.body.fetch('data', {}).fetch('orders', [])
      end
      render :search
    end

  end
end
