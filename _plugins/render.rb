require "liquid"

module Jekyll
  module Filters
    def render(input)
      Liquid::Template.parse(input).render({}, {
        :filters => [Jekyll::Filters],
        :registers => {
          :site => @context.registers[:site]
        }
      })
    end
  end
end

