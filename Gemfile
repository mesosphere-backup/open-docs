source "https://rubygems.org"

# Exploded version of the "pages-gem"[1] from GitHub minus "jekyll-mentions" and
# "jemoji" to prevent requiring Nokogiri. Nokogiri installation was causing
# issues for people trying to run the site like complaints about iconv[2].
#
# Since the site doesn't use mentions or emoji, just scrap them.
#
# [1] https://github.com/github/pages-gem
# [2] https://stackoverflow.com/questions/5528839/why-does-installing-nokogiri-on-mac-os-fail-with-libiconv-is-missing
gem 'RedCloth', '~> 4.2.9'
gem 'jekyll', '~> 2.5.3'
gem 'jekyll-redirect-from', '~> 0.6.2'
gem 'jekyll-sitemap', '~> 0.8.0'
gem 'kramdown', '~> 1.5.0'
gem 'maruku', '~> 0.7.2'
gem 'rdiscount', '~> 2.1.8'
gem 'redcarpet', '~> 3.2.2'

# -- Add "charset=utf-8" to Content-Type header in development. Headers are set
#    in S3 when the site is deployed, and they need to be served locally as
#    well to make browsers interpret HTML as UTF-8.
gem 'jekyll-utf8', '~> 0.0.1'

gem 'rake', '~> 10.4.2'
gem 'libxml-ruby', '~> 2.8.0'

# --- LESS
gem 'therubyracer', '~> 0.12.1'
gem 'less', git: 'https://github.com/pyronicide/less.rb.git',
  branch: 'less-1.6.2', submodules: true

# --- Build
gem 'yui-compressor', '~> 0.12.0'
gem 'sprockets-less', '~> 0.6.1'
gem 'jekyll-assets', '~>0.9.0'
gem 'ejs', '~> 1.1.1'
