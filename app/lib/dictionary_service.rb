# frozen_string_literal: true

class DictionaryService
  class Error < StandardError; end
  class NotConfiguredError < Error; end
  class TooManyRequestsError < Error; end
  class QuotaExceededError < Error; end
  class UnexpectedResponseError < Error; end

  def self.configured
    if ENV['JMDICT_BASE_URL'].present?
      DictionaryService::Dictionary.new(ENV['JMDICT_BASE_URL'])
    else
      raise NotConfiguredError
    end
  end

  def self.configured?
    ENV['JMDICT_BASE_URL'].present?
  end

  def lookup(_word)
    raise NotImplementedError
  end
end
