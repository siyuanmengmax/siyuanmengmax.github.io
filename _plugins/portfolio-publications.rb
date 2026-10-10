# The homepage and downloadable bibliography share the existing Scholar source.
require 'bibtex'

module Portfolio
  class Publications < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      scholar = site.config.fetch('scholar')
      source = scholar.fetch('source').sub(%r{\A/}, '')
      path = File.join(site.source, source, scholar.fetch('bibliography'))
      bibliography = BibTeX.parse(File.read(path).sub(/\A---\s*\n.*?^---\s*\n/m, ''))
      bibliography.replace_strings
      bibliography.join
      entries = bibliography.entries.values
      hidden = Array(site.config['filtered_bibtex_keywords'])
      site.data['portfolio_publications'] = entries.map do |entry|
        fields = entry.fields.transform_keys(&:to_s).transform_values(&:to_s)
        note = fields.fetch('note', '')
        venue = fields['journal'] || fields['booktitle'] || ''
        category = if note.match?(/under review|submitting|in preparation|ongoing/i) || entry.type.to_s == 'unpublished'
                     'manuscripts'
                   elsif venue.match?(/arxiv|preprint/i) || fields['arxiv']
                     'preprints'
                   elsif %w[inproceedings incollection conference].include?(entry.type.to_s)
                     'conferences'
                   else
                     'journals'
                   end
        clean = entry.dup
        hidden.each { |key| clean.delete(key.to_sym) }
        authors = entry.author ? entry.author.map do |author|
          first, last = author.first.to_s, author.last.to_s
          { 'name' => [first, author.prefix.to_s, last, author.suffix.to_s].reject(&:empty?).join(' '),
            'self' => Array(scholar['first_name']).include?(first) && Array(scholar['last_name']).include?(last) }
        end : []
        url = if fields['doi']
                'https://doi.org/' + fields['doi']
              elsif fields['html']
                fields['html']
              elsif fields['arxiv']
                'https://arxiv.org/abs/' + fields['arxiv']
              end
        { 'id' => entry.key, 'title' => fields['title'], 'year' => fields['year'],
          'volume' => fields['volume'], 'number' => fields['number'], 'pages' => fields['pages'],
          'authors' => authors, 'venue' => venue, 'note' => note, 'category' => category,
          'url' => url, 'bibtex' => clean.to_s }
      end.sort_by { |entry| -entry['year'].to_i }

      # Use a plain-text source extension so Scholar's .bib converter does not
      # turn the download into formatted HTML citations.
      download = Jekyll::PageWithoutAFile.new(site, site.source, 'assets/portfolio', 'publications.txt')
      download.content = site.data['portfolio_publications'].map { |entry| entry['bibtex'] }.join("\n")
      download.data['layout'] = nil
      download.data['permalink'] = '/assets/portfolio/publications.bib'
      download.data['render_with_liquid'] = false
      download.data['sitemap'] = false
      site.pages << download
    end
  end
end
