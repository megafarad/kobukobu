# frozen_string_literal: true

class KobukobuStatusService < BaseService
  CACHE_TTL = 1.day.freeze

  include FormattingHelper

  def call(status)
    raise Mastodon::NotPermittedError unless status.public_visibility? || status.unlisted_visibility?

    @status = status
    @content = status_content_format(@status)

    Rails.cache.fetch("kobukobu/#{@status.language}/#{content_hash}", expires_in: CACHE_TTL) { kobukobu_backend.parse(@content, @status.language) }
  end

  private

  def kobukobu_backend
    KobukobuService.configured
  end

  def content_hash
    Digest::SHA256.base64digest(@content)
  end
end
