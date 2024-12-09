CARTRIDGE_CONFIG = YAML.load(ERB.new(File.read("#{Rails.root}/config/cartridge.yml")).result).deep_symbolize_keys
