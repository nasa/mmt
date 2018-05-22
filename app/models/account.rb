# Modified from https://github.com/onelogin/ruby-saml-example/blob/master/app/models/account.rb

class Account < ActiveRecord::Base
  def self.get_saml_settings(url_base = ENV['SAML_SP_ISSUER_BASE'], authn_context = "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport")

    settings = OneLogin::RubySaml::Settings.new

    # When disabled, SAML validation errors will raise an exception.
    settings.soft = false

    # AuthnContext
    #"urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
    #"urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken"
    #"urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"
    settings.authn_context = authn_context

    # SP section
    # certificate and private_key not used in Status App
    # settings.certificate = ENV["certificate"]
    # settings.private_key = ENV["private_key"]

    settings.issuer = ENV['SAML_SP_ISSUER']
    settings.assertion_consumer_service_url = ENV['SAML_SP_ACS_URL']
    #settings.assertion_consumer_logout_service_url = url_base + "/saml/logout"

    # IDP section
    settings.idp_entity_id = ENV['SAML_IDP_ENTITY_ID']
    settings.idp_sso_target_url = ENV['SAML_IDP_SSO_TARGET_URL']

    #settings.idp_slo_target_url = ""
    settings.idp_cert = ENV['SAML_IDP_CERT']

    # idp_cert_fingerprint not used in Status App
    # settings.idp_cert_fingerprint = ENV["idp_cert_fingerprint"]

    settings.idp_cert_fingerprint_algorithm = XMLSecurity::Document::SHA1

    # settings.name_identifier_format = "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"
    settings.name_identifier_format = "urn:oasis:names:tc:SAML:2.0:nameid-format:transient"

    settings.assertion_consumer_service_binding = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
    settings.protocol_binding = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"

    # Security section
    settings.security[:authn_requests_signed] = true
    #settings.security[:logout_requests_signed] = false
    #settings.security[:logout_responses_signed] = false
    settings.security[:metadata_signed] = true
    settings.security[:digest_method] = XMLSecurity::Document::SHA256
    settings.security[:signature_method] = XMLSecurity::Document::RSA_SHA256
    settings.security[:embed_sign] = false

    settings
  end
end
