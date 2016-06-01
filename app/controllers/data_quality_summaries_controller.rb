class DataQualitySummariesController < EchoSoapController
  before_action :set_summary, only: :show

  def index
    set_summaries
  end

  def show
  end

  def new
    @summary = {}
  end

  def create
    @summary = generate_payload

    response = echo_client.create_data_quality_summary_definition(token_with_client_id, @summary)

    if response.error?
      flash[:error] ||= [*response.parsed_error].to_sentence

      render :new
    else
      flash[:success] = 'Data Quality Summary successfully created'

      redirect_to data_quality_summary_path(response.parsed_body)
    end
  end

  def destroy
    response = echo_client.remove_data_quality_summary_definition(token_with_client_id, params[:id])

    if response.error?
      flash[:error] ||= [*response.parsed_error].to_sentence
    else
      flash[:success] = 'Data Quality Summary successfully deleted'
    end

    redirect_to data_quality_summaries_path
  end

  private

  def generate_payload
    {
      'Name' => params.fetch('name'),
      'Summary' => params.fetch('summary'),
      'OwnerProviderGuid' => current_provider_guid
    }
  end

  def set_summary
    @summary = echo_client.get_data_quality_summary_definition(token_with_client_id, params[:id])
  end
end
