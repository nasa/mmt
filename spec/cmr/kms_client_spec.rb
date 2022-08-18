describe Cmr::Client do
  let(:connection) { Faraday.new }
  let(:req) { double(headers: {}) }
  let(:kms_client) { Cmr::KmsClient.new('http://example.com', '1234') }

  before { allow(kms_client).to receive(:connection).and_return(connection) }

  context 'providers search' do
    let(:providers_search_url) { '/kms/concepts/concept_scheme/providers/?format=csv' }
    let (:kmsResponse) {"Keyword Version: 14.1,Revision: 2022-08-12 13:42:11,Timestamp: 2022-08-18 09:40:09,Terms Of Use: https://cdn.earthdata.nasa.gov/conduit/upload/5182/KeywordsCommunityGuide_Baseline_v1_SIGNED_FINAL.pdf,The most up to date XML representations can be found here: https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/providers/?format=xml,Case native
Bucket_Level0,Bucket_Level1,Bucket_Level2,Bucket_Level3,Short_Name,Long_Name,Data_Center_URL,UUID
ACADEMIC,GERMANY,,,DE/DLR,German Aerospace Center (DLR),http://www.dlr.de,2f9d7c12-c02d-41fb-a168-4d91794187f7
ACADEMIC,,,,AKITA-UMINING-C,Mining College, Akita University,,6c500872-49e3-499b-8d53-dc8de90745ca
ACADEMIC,GERMANY,,,,,,d780c4ea-4b39-4fda-a0d3-4f5bee42530d"}
    it 'returns providers from kms response' do
      expect(connection).to receive(:get).with(providers_search_url, {}).and_return(Cmr::Response.new(Faraday::Response.new(status: 200, body: kmsResponse, response_headers: {})))
      response = kms_client.get_keywords('providers')
      expectedResult = {"headers"=>["Short_Name", "Long_Name", "Data_Center_URL", "UUID"], "keywords"=>[["DE/DLR", "German Aerospace Center (DLR)", "http://www.dlr.de", "2f9d7c12-c02d-41fb-a168-4d91794187f7"], ["AKITA-UMINING-C", "Mining College", " Akita University", nil, "6c500872-49e3-499b-8d53-dc8de90745ca"], [nil, nil, nil, "d780c4ea-4b39-4fda-a0d3-4f5bee42530d"]]}
      expect(response).to eq(expectedResult)
    end
  end
end