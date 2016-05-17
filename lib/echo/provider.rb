module Echo
	class Provider < Base
		extend Savon::Model

		client wsdl: "http://testbed.echo.nasa.gov/echo-wsdl/v10/ProviderService.wsdl"

		operations :get_provider_names

		global :log, true

		class << self
			# Returns the names and guids of all the active providers in the system.
			def get_provider_names(token, guids=nil)
				builder = Builder::XmlMarkup.new

				builder.ns2(:GetProviderNames, {"xmlns:ns2": "http://echo.nasa.gov/echo/v10", "xmlns:ns3": "http://echo.nasa.gov/echo/v10/types", "xmlns:ns4": "http://echo.nasa.gov/ingest/v10"}) do
			    builder.ns2(:token, token)

			    if guids.nil?
						# Providing nil will return all providers (NOT an empty string, only nil)
						builder.ns2(:guids, {"xsi:nil": true})
			    else
			    	builder.ns2(:guids) do
			    		guids.each do |g|
			    			builder.ns3(:Item, g)
			    		end
			    	end
			    end
				end

				super(xml: self.wrap_with_envelope(builder))
			end
		end
	end
end