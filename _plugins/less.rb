require "sprockets"
require "sprockets-less"
require "sprockets/less/functions"
require "tilt"

module Sprockets
  module Less
    module Functions
      def asset_url(asset)
        "url(#{sprockets_context.asset_path(asset)})"
      end
    end
  end
end

class LiquidProcessor < Tilt::LiquidTemplate
  def evaluate context, locals, &block
    @engine.render locals, {
      :filters   => [Jekyll::Filters],
      :registers => {
        :site => context.site
      }
    }
  end
end

Sprockets.register_preprocessor "text/css",               LiquidProcessor
Sprockets.register_preprocessor "application/javascript", LiquidProcessor
