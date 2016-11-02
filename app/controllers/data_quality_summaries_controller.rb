class DataQualitySummariesController < EchoSoapController
  before_action :set_summary, only: [:show, :new, :edit]
  before_action :set_summaries, only: :index

  def index
  end

  def show
  end

  def new
  end

  def edit
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

  def update
    @summary = generate_payload

    response = echo_client.update_data_quality_summary_definition(token_with_client_id, @summary)

    if response.error?
      flash[:error] ||= [*response.parsed_error].to_sentence

      render :edit
    else
      flash[:success] = 'Data Quality Summary successfully updated'

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
      'Guid' => params.fetch('id'),
      'Name' => params.fetch('name'),
      'Summary' => params.fetch('summary'),
      'OwnerProviderGuid' => current_provider_guid
    }
  end

  def set_summary
    result = echo_client.get_data_quality_summary_definition(token_with_client_id, params[:id])

    @summary = result.parsed_body unless result.error?

    @summary = {} if defined?(@summary).nil?
  end
end
