module Echo
	class Base
		class << self
			def wrap_with_envelope(content)
			    builder = Builder::XmlMarkup.new
			    builder.instruct!(:xml, encoding: "UTF-8")

				builder.tag!(:"SOAP-ENV:Envelope", {"xmlns:SOAP-ENV": "http://schemas.xmlsoap.org/soap/envelope/", "xmlns:xsd": "http://www.w3.org/2001/XMLSchema", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" }) do
				    builder.tag!(:"SOAP-ENV:Header")
				    builder.tag!(:"SOAP-ENV:Body") do
				    	builder << content
				    end
				end
			end
		end
	end
end