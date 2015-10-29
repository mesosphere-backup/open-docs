require 'rake/clean'

# Use a trailing slash for AWS CLI to recursively upload the contents rather
# than upload the directory as "_build" in S3.
BUILD_DIRECTORY = "_build/"

CLEAN.add(BUILD_DIRECTORY)

task :build => [:clean] do
  # Build the site with default (production) configuration.
  build_success =
    system "bundle exec jekyll build -d #{BUILD_DIRECTORY} -c _config.yml"

  unless build_success
    puts "Jekyll failed to build"
    exit 1
  end
end

task :dev, :mode do |t, args|
  cmd = %w(bundle exec jekyll serve --watch)
  cmd << %w(--config _config.yml,_config.dev.yml)
  case args.mode
  when 'drafts' then cmd << '--drafts'
  end
  cmd_string = cmd.join(' ')
  puts "Running: #{cmd_string}"
  exec cmd_string
end
