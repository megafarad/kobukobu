# frozen_string_literal: true

class KobukobuService
  class Error < StandardError; end
  class NotConfiguredError < Error; end
  class TooManyRequestsError < Error; end
  class QuotaExceededError < Error; end
  class UnexpectedResponseError < Error; end

  def self.configured
    raise NotConfiguredError if ENV['VE_BASE_URL'].blank?

    KobukobuService::Kobukobu.new(ENV.fetch('VE_BASE_URL', nil))
  end

  def self.configured?
    ENV['VE_BASE_URL'].present?
  end

  def parse(_text, _source_language)
    raise NotImplementedError
  end
end
