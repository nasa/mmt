describe Cmr::Client do
  let(:connection) { Faraday.new }
  let(:req) { double(headers: {}) }
  let(:kms_client) { Cmr::KmsClient.new('http://example.com', '1234') }

  before { allow(kms_client).to receive(:connection).and_return(connection) }

  context 'providers search' do
    it 'returns providers from kms response' do
      providers_search_url = '/kms/concepts/concept_scheme/providers/?format=csv'
      kmsResponse = "Keyword Version: 14.1,Revision: 2022-08-12 13:42:11,Timestamp: 2022-08-18 09:40:09,Terms Of Use: https://cdn.earthdata.nasa.gov/conduit/upload/5182/KeywordsCommunityGuide_Baseline_v1_SIGNED_FINAL.pdf,The most up to date XML representations can be found here: https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/providers/?format=xml,Case native
Bucket_Level0,Bucket_Level1,Bucket_Level2,Bucket_Level3,Short_Name,Long_Name,Data_Center_URL,UUID
ACADEMIC,GERMANY,,,DE/DLR,German Aerospace Center (DLR),http://www.dlr.de,2f9d7c12-c02d-41fb-a168-4d91794187f7
ACADEMIC,,,,AKITA-UMINING-C,Mining College, Akita University,,6c500872-49e3-499b-8d53-dc8de90745ca
ACADEMIC,GERMANY,,,,,,d780c4ea-4b39-4fda-a0d3-4f5bee42530d"
      expect(connection).to receive(:get).with(providers_search_url).and_return(Cmr::Response.new(Faraday::Response.new(status: 200, body: kmsResponse, response_headers: {})))
      response = kms_client.get_kms_keywords('providers')
      expectedResult = {"headers"=>["Short_Name", "Long_Name", "Data_Center_URL", "UUID"], "keywords"=>[["DE/DLR", "German Aerospace Center (DLR)", "http://www.dlr.de", "2f9d7c12-c02d-41fb-a168-4d91794187f7"], ["AKITA-UMINING-C", "Mining College", " Akita University", nil, "6c500872-49e3-499b-8d53-dc8de90745ca"], [nil, nil, nil, "d780c4ea-4b39-4fda-a0d3-4f5bee42530d"]]}
      expect(response).to eq(expectedResult)
    end
  end
  context 'rucontenttype search' do
    it 'returns rucontenttype from kms response' do
      rucontenttype_search_url = '/kms/concepts/concept_scheme/rucontenttype/?format=csv'
      kmsResponse = "Hits: 102,page_num: 1,page_size: 2000,Keyword Version: 14.1,Revision: 2022-07-29 10:11:38,Timestamp: 2022-08-18 10:11:31,Terms Of Use: https://cdn.earthdata.nasa.gov/conduit/upload/5182/KeywordsCommunityGuide_Baseline_v1_SIGNED_FINAL.pdf,The most up to date XML representations can be found here: https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/rucontenttype/?format=xml,Case native
URLContentType,Type,Subtype,UUID
CollectionURL,DATA SET LANDING PAGE,,8826912b-c89e-4810-b446-39b98b5d937c
CollectionURL,EXTENDED METADATA,DMR++ MISSING DATA,4cc17021-b9cc-4b3f-a4f1-f05f7c1aeb2d
CollectionURL,EXTENDED METADATA,DMR++,f02b0c6a-7fd9-473d-a1cb-a6482e8daa61"
      expect(connection).to receive(:get).with(rucontenttype_search_url).and_return(Cmr::Response.new(Faraday::Response.new(status: 200, body: kmsResponse, response_headers: {})))
      response = kms_client.get_kms_keywords('rucontenttype')
      expectedResult = {"headers"=>["URLContentType","Type","Subtype","UUID"], "keywords"=>[["CollectionURL","DATA SET LANDING PAGE",nil,"8826912b-c89e-4810-b446-39b98b5d937c"],["CollectionURL","EXTENDED METADATA","DMR++ MISSING DATA","4cc17021-b9cc-4b3f-a4f1-f05f7c1aeb2d"],["CollectionURL","EXTENDED METADATA","DMR++","f02b0c6a-7fd9-473d-a1cb-a6482e8daa61"]]}
      expect(response).to eq(expectedResult)
    end
  end
end
