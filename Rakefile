require 'rake/clean'

# Use a trailing slash for AWS CLI to recursively upload the contents rather
# than upload the directory as "_build" in S3.
BUILD_DIRECTORY = "_build/"

S3_BUCKET = "s3://mesosphere.io"
S3_REGION = "us-east-1"

STAGING_BUCKET = "s3://panda.mesosphere.io"

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

def deploy(bucket)
  awscmd_success = system "hash aws 2>/dev/null"
  unless awscmd_success
    puts
    puts "Deploying requires the AWS CLI (awscli)"
    puts "Install it with PIP: `pip install awscli`"
    exit 1
  end

  # Passing --size-only compares local and remote files only by name and
  # file size. If a file changes but has the same file size, it will NOT be
  # uploaded.
  #
  # TODO: Enable force syncing by optionally omitting `--size-only` if a
  #       certain argument is passed to `rake deploy`.

  #  * Upload HTML with short cache duration (10 minutes) so it expires
  #    periodically to update assets.
  #  * Set content type with explicit charset so browsers don't need to guess or
  #    wait for a <meta> tag. All HTML is in UTF-8.
  #
  #    See: https://developers.google.com/speed/docs/best-practices/rendering#SpecifyCharsetEarly
  system("aws", "s3", "sync",
    "--acl", "public-read",
    "--cache-control", "public,max-age=600",
    "--content-type", "text/html; charset=utf-8",
    "--exclude", "*",
    "--include", "*.html",
    "--region", S3_REGION,
    "--size-only",
    "--delete",
    BUILD_DIRECTORY, bucket)

  # * Cache XML files (used in particular for the atom.xml RSS feed) for only
  #   10 minutes like HTML files.
  system("aws", "s3", "sync",
    "--acl", "public-read",
    "--cache-control", "public,max-age=600",
    "--exclude", "*",
    "--include", "*.xml",
    "--region", S3_REGION,
    "--size-only",
    BUILD_DIRECTORY, bucket)

  # * Guess MIME types, i.e. don't set a "content-type", for non-HTML assets
  # * Cache non-HTML assets for max duration suggested, 1 year
  #   (31,536,000 seconds) since they are fingerprinted and unique based on
  #   content with the "jekyll-assets" gem.
  system("aws", "s3", "sync",
    "--acl", "public-read",
    "--cache-control", "public,max-age=31536000",
    "--exclude", "*.html",
    "--exclude", "*.xml",
    "--region", S3_REGION,
    "--size-only",
    BUILD_DIRECTORY, bucket)
end


task :deploy => [:build] do
  deploy(S3_BUCKET)
end

task :staging => [:build] do
  deploy(STAGING_BUCKET)
end
