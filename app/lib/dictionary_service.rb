# frozen_string_literal: true

class DictionaryService
  class Error < StandardError; end
  class NotConfiguredError < Error; end
  class TooManyRequestsError < Error; end
  class QuotaExceededError < Error; end
  class UnexpectedResponseError < Error; end

  def self.configured
    raise NotConfiguredError if ENV['JMDICT_BASE_URL'].blank?

    DictionaryService::Dictionary.new(ENV.fetch('JMDICT_BASE_URL', nil))
  end

  def self.configured?
    ENV['JMDICT_BASE_URL'].present?
  end

  def lookup(_word)
    raise NotImplementedError
  end
end
