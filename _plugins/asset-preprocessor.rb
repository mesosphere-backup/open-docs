require "sprockets"
require "tilt"

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

Sprockets.register_preprocessor "application/javascript", LiquidProcessor
