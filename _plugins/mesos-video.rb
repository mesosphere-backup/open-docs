module Jekyll
  class RenderMesosVideo < Liquid::Tag

    def initialize(tag_name, videoFile, tokens)
      super
      @videoFile = videoFile.strip!
    end

    def render(context)
      "<div class=\"video-lecture-container\"><iframe class=\"smart-player-embed-container-iframe\" id=\"embeddedSmartPlayerInstance\" src=\"https://s3.amazonaws.com/advanced-mesos-course/#{@videoFile}/media/index_player.html?embedIFrameId=embeddedSmartPlayerInstance\" scrolling=\"no\"  frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>"
    end
  end
end

Liquid::Template.register_tag 'mesos_video', Jekyll::RenderMesosVideo
